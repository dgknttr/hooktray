import { describe, it, expect } from "vitest"
import { generateCurlExample } from "@/lib/curl"

describe("generateCurlExample", () => {
  it("includes the token in the URL", () => {
    const result = generateCurlExample("abc123")
    expect(result).toContain("abc123")
  })

  it("uses POST method", () => {
    expect(generateCurlExample("tok")).toContain("POST")
  })

  it("includes Content-Type header", () => {
    expect(generateCurlExample("tok")).toContain("application/json")
  })

  it("uses the current browser origin when no API URL is configured", () => {
    expect(generateCurlExample("tok")).toContain("http://localhost:3000")
  })
})
