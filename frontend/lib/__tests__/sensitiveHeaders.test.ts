import { describe, it, expect } from "vitest"
import { isMasked } from "@/lib/sensitiveHeaders"

describe("isMasked", () => {
  it("masks authorization", () => expect(isMasked("authorization")).toBe(true))
  it("masks cookie", () => expect(isMasked("cookie")).toBe(true))
  it("masks set-cookie", () => expect(isMasked("set-cookie")).toBe(true))
  it("masks x-api-key", () => expect(isMasked("x-api-key")).toBe(true))
  it("masks x-auth-token", () => expect(isMasked("x-auth-token")).toBe(true))
  it("masks x-secret", () => expect(isMasked("x-secret")).toBe(true))
  it("masks x-access-token", () => expect(isMasked("x-access-token")).toBe(true))
  it("masks proxy-authorization", () => expect(isMasked("proxy-authorization")).toBe(true))
  it("does not mask content-type", () => expect(isMasked("content-type")).toBe(false))
  it("does not mask accept", () => expect(isMasked("accept")).toBe(false))
  it("is case-insensitive", () => expect(isMasked("Authorization")).toBe(true))
})
