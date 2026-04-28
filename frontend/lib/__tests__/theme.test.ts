import { describe, it, expect, beforeEach, vi } from "vitest"
import { getStoredTheme, setStoredTheme, resolveTheme, applyTheme } from "@/lib/theme"

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark && query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove("dark")
    mockMatchMedia(true)
  })

  it("returns 'system' by default", () => {
    expect(getStoredTheme()).toBe("system")
  })

  it("reads 'light' from localStorage", () => {
    localStorage.setItem("hooktray-theme", "light")
    expect(getStoredTheme()).toBe("light")
  })

  it("reads 'dark' from localStorage", () => {
    localStorage.setItem("hooktray-theme", "dark")
    expect(getStoredTheme()).toBe("dark")
  })

  it("falls back to 'system' for invalid stored value", () => {
    localStorage.setItem("hooktray-theme", "purple")
    expect(getStoredTheme()).toBe("system")
  })

  it("resolves 'dark' to 'dark'", () => {
    expect(resolveTheme("dark")).toBe("dark")
  })

  it("resolves 'light' to 'light'", () => {
    expect(resolveTheme("light")).toBe("light")
  })

  it("resolves 'system' with dark OS preference to 'dark'", () => {
    mockMatchMedia(true)
    expect(resolveTheme("system")).toBe("dark")
  })

  it("resolves 'system' with light OS preference to 'light'", () => {
    mockMatchMedia(false)
    expect(resolveTheme("system")).toBe("light")
  })

  it("applyTheme('dark') adds dark class to html", () => {
    applyTheme("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("applyTheme('light') removes dark class from html", () => {
    document.documentElement.classList.add("dark")
    applyTheme("light")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })

  it("applyTheme('system') with dark OS adds dark class", () => {
    mockMatchMedia(true)
    applyTheme("system")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("setStoredTheme persists to localStorage", () => {
    setStoredTheme("dark")
    expect(localStorage.getItem("hooktray-theme")).toBe("dark")
  })
})
