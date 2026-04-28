import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { buildHookUrl, buildStreamUrl, resolveInitialToken } from "@/lib/api"

describe("buildHookUrl", () => {
  it("includes the token in the path", () => {
    expect(buildHookUrl("mytoken")).toContain("/hooks/mytoken")
  })
})

describe("buildStreamUrl", () => {
  it("includes the token in the path", () => {
    expect(buildStreamUrl("mytoken")).toContain("/api/stream/mytoken")
  })
})

describe("resolveInitialToken", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns URL param token when ?t= is present", async () => {
    vi.stubGlobal("location", {
      search: "?t=urltoken",
      origin: "http://localhost:3000",
      href: "http://localhost:3000/?t=urltoken",
    })
    const result = await resolveInitialToken()
    expect(result.token).toBe("urltoken")
    expect(fetch).not.toHaveBeenCalled()
  })

  it("returns localStorage token when no URL param", async () => {
    vi.stubGlobal("location", {
      search: "",
      origin: "http://localhost:3000",
      href: "http://localhost:3000/",
    })
    localStorage.setItem("lastActiveToken", "storedtoken")
    const result = await resolveInitialToken()
    expect(result.token).toBe("storedtoken")
    expect(fetch).not.toHaveBeenCalled()
  })

  it("calls POST /api/hooks when no URL param and no localStorage", async () => {
    vi.stubGlobal("location", {
      search: "",
      origin: "http://localhost:3000",
      href: "http://localhost:3000/",
    })
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "newtoken",
        hookUrl: "http://localhost:3000/hooks/newtoken",
        streamUrl: "http://localhost:3000/api/stream/newtoken",
      }),
    } as Response)
    const result = await resolveInitialToken()
    expect(result.token).toBe("newtoken")
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/hooks"),
      { method: "POST" }
    )
  })
})
