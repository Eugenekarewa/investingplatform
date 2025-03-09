// file: sources/microinvest.move
module microinvesting::core {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use std::vector;
    
    /// Error codes
    const EInsufficientFunds: u64 = 0;
    const EInvalidAmount: u64 = 1;
    const EInvalidAsset: u64 = 2;
    const ENotAuthorized: u64 = 3;
    const EInvalidRisk: u64 = 4;
    const EPoolFull: u64 = 5;

    /// Risk profile for users and investments
    const RISK_CONSERVATIVE: u8 = 1;
    const RISK_MODERATE: u8 = 2;
    const RISK_AGGRESSIVE: u8 = 3;
    
    /// Platform admin capability with better accessibility
    public struct AdminCap has key, store {
        id: UID
    }
    
    /// Main platform configuration
    public struct Platform has key {
        id: UID,
        treasury: Balance<SUI>,
        fee_percentage: u64,  // Fee in basis points (1 = 0.01%)
        total_assets: u64,
        total_users: u64,
        total_investments: u64
    }
    
    /// User profile
    public struct UserProfile has key, store {
        id: UID,
        user: address,
        risk_profile: u8,  // 1-3, conservative to aggressive
        credit_score: u64, // 0-1000
        total_invested: u64
    }
    
    /// Represents an asset class (real estate, stocks, DeFi, etc.)
    public struct AssetClass has key {
        id: UID,
        name: String,
        description: String,
        risk_level: u8,  // 1-3, conservative to aggressive
        total_supply: u64,
        available_supply: u64,
        price_per_unit: u64, // in SUI (smallest unit)
        min_investment: u64,
        creator_fee: u64,    // in basis points
        is_active: bool
    }
    
    /// Represents a user's investment in an asset
    public struct Investment has key,store {
        id: UID,
        asset_id: ID,
        owner: address,
        amount: u64,
        shares: u64,
        timestamp: u64
    }
    
    /// SFT/NFT representing ownership in an asset
    public struct InvestmentToken has key, store {
        id: UID,
        asset_id: ID,
        shares: u64,
        metadata: String
    }
    
    /// Investment pool where users can collectively invest
    public struct InvestmentPool has key {
        id: UID,
        name: String,
        description: String,
        risk_level: u8,
        target_size: u64,
        current_size: u64,
        min_contribution: u64,
        returns_percentage: u64, // Annual percentage in basis points
        members: Table<address, u64>, // address -> amount invested
        treasury: Balance<SUI>,
        is_active: bool
    }
    
    /// Governance token for DAO participation
    public struct GovernanceToken has key, store {
        id: UID,
        amount: u64
    }
    
    /// Events
    public struct UserRegistered has copy, drop {
        user: address,
        risk_profile: u8
    }
    
    public struct AssetListed has copy, drop {
        asset_id: ID,
        name: String,
        price: u64
    }
    
    public struct InvestmentMade has copy, drop {
        investor: address,
        asset_id: ID,
        amount: u64,
        shares: u64
    }
    
    public struct PoolCreated has copy, drop {
        pool_id: ID,
        name: String,
        target_size: u64
    }
    
    public struct AdminCapCreated has copy, drop {
        admin_cap_id: ID,
        admin: address
    }
    
    /// Initialize the platform - now emits an event with the AdminCap ID
    fun init(ctx: &mut TxContext) {
        let admin = tx_context::sender(ctx);
        
        // Create admin capability with a clear ID
        let admin_cap = AdminCap {
            id: object::new(ctx)
        };
        
        let admin_cap_id = object::id(&admin_cap);
        
        // Emit an event to easily find the admin cap ID
        event::emit(AdminCapCreated {
            admin_cap_id,
            admin
        });
        
        // Transfer admin cap to deployer
        transfer::public_transfer(admin_cap, admin);
        
        // Create and share platform object
        transfer::share_object(Platform {
            id: object::new(ctx),
            treasury: balance::zero(),
            fee_percentage: 50, // 0.5% default fee
            total_assets: 0,
            total_users: 0,
            total_investments: 0
        });
    }
    
    /// Register a new user profile
    public entry fun register_user(risk_profile: u8, ctx: &mut TxContext) {
        assert!(risk_profile >= RISK_CONSERVATIVE && risk_profile <= RISK_AGGRESSIVE, EInvalidRisk);
        
        let user_profile = UserProfile {
            id: object::new(ctx),
            user: tx_context::sender(ctx),
            risk_profile,
            credit_score: 500, // Default starting credit score
            total_invested: 0
        };
        
        event::emit(UserRegistered {
            user: tx_context::sender(ctx),
            risk_profile
        });
        
        transfer::public_transfer(user_profile, tx_context::sender(ctx));
    }
    
    /// Create a new asset class (admin only)
    public entry fun create_asset_class(
        admin_cap: &AdminCap,
        name: vector<u8>,
        description: vector<u8>,
        risk_level: u8,
        total_supply: u64,
        price_per_unit: u64,
        min_investment: u64,
        creator_fee: u64,
        platform: &mut Platform,
        ctx: &mut TxContext
    ) {
        assert!(risk_level >= RISK_CONSERVATIVE && risk_level <= RISK_AGGRESSIVE, EInvalidRisk);
        assert!(creator_fee <= 1000, EInvalidAmount); // Max 10% fee
        
        let asset = AssetClass {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            risk_level,
            total_supply,
            available_supply: total_supply,
            price_per_unit,
            min_investment,
            creator_fee,
            is_active: true
        };
        
        let asset_id = object::id(&asset);
        platform.total_assets = platform.total_assets + 1;
        
        event::emit(AssetListed {
            asset_id,
            name: string::utf8(name),
            price: price_per_unit
        });
        
        transfer::share_object(asset);
    }
    
    /// Make an investment in an asset
    public entry fun invest_in_asset(
        asset: &mut AssetClass,
        mut amount_coin: Coin<SUI>,
        platform: &mut Platform,
        ctx: &mut TxContext
    ) {
        assert!(asset.is_active, EInvalidAsset);
        
        let amount = coin::value(&amount_coin);
        assert!(amount >= asset.min_investment, EInvalidAmount);
        
        // Calculate number of shares
        let shares = amount / asset.price_per_unit;
        assert!(shares > 0, EInvalidAmount);
        assert!(shares <= asset.available_supply, EInsufficientFunds);
        
        // Calculate fees
        let platform_fee = (amount * platform.fee_percentage) / 10000;
        let creator_fee = (amount * asset.creator_fee) / 10000;
        let investment_amount = amount - platform_fee - creator_fee;
        
        // Update platform stats
        platform.total_investments = platform.total_investments + 1;
        let platform_coin = coin::split(&mut amount_coin, platform_fee, ctx);
        coin::put(&mut platform.treasury, platform_coin);
        
        // Update asset available supply
        asset.available_supply = asset.available_supply - shares;
        
        // Create investment record
        let investment = Investment {
            id: object::new(ctx),
            asset_id: object::id(asset),
            owner: tx_context::sender(ctx),
            amount: investment_amount,
            shares,
            timestamp: tx_context::epoch(ctx)
        };
        
        // Create investment token/NFT
        let token = InvestmentToken {
            id: object::new(ctx),
            asset_id: object::id(asset),
            shares,
            metadata: string::utf8(b"Investment Token")
        };
        
        // Return remaining coin to sender
        transfer::public_transfer(amount_coin, tx_context::sender(ctx));
        
        // Send investment record and token to investor
        transfer::public_transfer(investment, tx_context::sender(ctx));
        transfer::public_transfer(token, tx_context::sender(ctx));
        
        event::emit(InvestmentMade {
            investor: tx_context::sender(ctx),
            asset_id: object::id(asset),
            amount: investment_amount,
            shares
        });
    }
    
    /// Create an investment pool
    public entry fun create_investment_pool(
        admin_cap: &AdminCap,
        name: vector<u8>,
        description: vector<u8>,
        risk_level: u8,
        target_size: u64,
        min_contribution: u64,
        returns_percentage: u64,
        platform: &mut Platform,
        ctx: &mut TxContext
    ) {
        assert!(risk_level >= RISK_CONSERVATIVE && risk_level <= RISK_AGGRESSIVE, EInvalidRisk);
        
        let pool = InvestmentPool {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            risk_level,
            target_size,
            current_size: 0,
            min_contribution,
            returns_percentage,
            members: table::new(ctx),
            treasury: balance::zero(),
            is_active: true
        };
        
        let pool_id = object::id(&pool);
        
        event::emit(PoolCreated {
            pool_id,
            name: string::utf8(name),
            target_size
        });
        
        transfer::share_object(pool);
    }
    
    /// Contribute to an investment pool
    public entry fun contribute_to_pool(
        pool: &mut InvestmentPool,
        mut amount_coin: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(pool.is_active, EInvalidAsset);
        
        let amount = coin::value(&amount_coin);
        assert!(amount >= pool.min_contribution, EInvalidAmount);
        
        let contributor = tx_context::sender(ctx);
        let available_capacity = pool.target_size - pool.current_size;
        
        assert!(amount <= available_capacity, EPoolFull);
        
        // Add user to pool members or update existing contribution
        if (table::contains(&pool.members, contributor)) {
            let user_amount = table::borrow_mut(&mut pool.members, contributor);
            *user_amount = *user_amount + amount;
        } else {
            table::add(&mut pool.members, contributor, amount);
        };
        
        // Update pool stats
        pool.current_size = pool.current_size + amount;
        
        // Add funds to pool treasury
        coin::put(&mut pool.treasury, amount_coin);
    }
    
    /// Issue governance tokens based on investment activity (simplified)
    public entry fun issue_governance_tokens(
        admin_cap: &AdminCap,
        user: address,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let token = GovernanceToken {
            id: object::new(ctx),
            amount
        };
        
        transfer::public_transfer(token, user);
    }
    
    /// Update platform fee (admin only)
    public entry fun update_platform_fee(
        admin_cap: &AdminCap,
        platform: &mut Platform,
        new_fee: u64
    ) {
        assert!(new_fee <= 500, EInvalidAmount); // Max 5% fee
        platform.fee_percentage = new_fee;
    }
    
    /// Get admin cap ID (helper function)
    public fun admin_cap_id(admin_cap: &AdminCap): ID {
        object::id(admin_cap)
    }
}