"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Only render the theme provider after the component has mounted on the client
  // This prevents hydration mismatch between server and client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same structure but without theme classes
    return <div className="contents">{children}</div>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

