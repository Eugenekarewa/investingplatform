"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TrendingUp, Users, User, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { WalletConnect } from "@/components/wallet-connect"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <MobileNav />
          <Link href="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Microinvesting Platform</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Home className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/assets"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === "/assets" ? "text-primary" : "text-muted-foreground",
              )}
            >
              <TrendingUp className="mr-1 h-4 w-4" />
              Assets
            </Link>
            <Link
              href="/pools"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === "/pools" ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Users className="mr-1 h-4 w-4" />
              Pools
            </Link>
            <Link
              href="/profile"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === "/profile" ? "text-primary" : "text-muted-foreground",
              )}
            >
              <User className="mr-1 h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/admin"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === "/admin" ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Settings className="mr-1 h-4 w-4" />
              Admin
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}

