"use client"
import { createContext, useContext, useEffect, useState } from "react"
import type { Theme } from "@/types"
import { getStoredTheme, setStoredTheme, applyTheme, resolveTheme } from "@/lib/theme"

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())

  useEffect(() => {
    applyTheme(theme)

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)")
      const handler = () => applyTheme("system")
      mq.addEventListener("change", handler)
      return () => mq.removeEventListener("change", handler)
    }
  }, [theme])

  const setTheme = (t: Theme) => {
    setStoredTheme(t)
    setThemeState(t)
    applyTheme(t)
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, resolvedTheme: resolveTheme(theme) }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
