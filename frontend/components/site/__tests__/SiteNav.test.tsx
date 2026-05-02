import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SiteNav } from "@/components/site/SiteNav"

describe("SiteNav", () => {
  it("renders the logo link pointing to /", () => {
    render(<SiteNav />)
    const logo = screen.getByRole("link", { name: /hooktray/i })
    expect(logo).toHaveAttribute("href", "/")
  })

  it("renders How it works nav link", () => {
    render(<SiteNav />)
    expect(screen.getByRole("link", { name: /how it works/i })).toHaveAttribute(
      "href",
      "/how-it-works"
    )
  })

  it("renders Use cases nav link", () => {
    render(<SiteNav />)
    expect(screen.getByRole("link", { name: /use cases/i })).toHaveAttribute(
      "href",
      "/use-cases"
    )
  })

  it("renders Self-hosting nav link", () => {
    render(<SiteNav />)
    expect(screen.getByRole("link", { name: /self-hosting/i })).toHaveAttribute(
      "href",
      "/self-hosting"
    )
  })

  it("renders About nav link", () => {
    render(<SiteNav />)
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "/about"
    )
  })

  it("renders Open Inspector CTA link pointing to /", () => {
    render(<SiteNav />)
    expect(screen.getByRole("link", { name: /open inspector/i })).toHaveAttribute(
      "href",
      "/"
    )
  })
})
