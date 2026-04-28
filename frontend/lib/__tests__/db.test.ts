import { describe, it, expect, beforeEach } from "vitest"
import "fake-indexeddb/auto"
import type { RequestSnapshotWire } from "@/types"

function makeSnap(id: string, receivedAt: string, method = "POST"): RequestSnapshotWire {
  return {
    id,
    receivedAt,
    method,
    path: "/test",
    rawQueryString: "",
    queryParams: {},
    headers: {},
    body: null,
    bodyEncoding: "utf-8",
    isBase64Encoded: false,
    bodyPreview: null,
    sizeBytes: 0,
  }
}

describe("db", () => {
  let db: import("@/lib/db").HookTrayDb
  let addRequest: typeof import("@/lib/db").addRequest
  let hydrate: typeof import("@/lib/db").hydrate
  let clearHistory: typeof import("@/lib/db").clearHistory

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import("@/lib/db")
    db = mod.db
    addRequest = mod.addRequest
    hydrate = mod.hydrate
    clearHistory = mod.clearHistory
    await db.requests.clear()
  })

  it("addRequest stores a request under a token", async () => {
    await addRequest("tok1", makeSnap("s1", "2026-04-28T00:00:00Z"))
    const rows = await db.requests.where("token").equals("tok1").toArray()
    expect(rows).toHaveLength(1)
    expect(rows[0].id).toBe("s1")
  })

  it("hydrate returns requests newest-first", async () => {
    await addRequest("tok1", makeSnap("s1", "2026-04-28T00:00:00Z"))
    await addRequest("tok1", makeSnap("s2", "2026-04-28T00:01:00Z"))
    const results = await hydrate("tok1")
    expect(results[0].id).toBe("s2")
    expect(results[1].id).toBe("s1")
  })

  it("hydrate strips the token field from returned records", async () => {
    await addRequest("tok1", makeSnap("s1", "2026-04-28T00:00:00Z"))
    const results = await hydrate("tok1")
    expect((results[0] as { token?: string }).token).toBeUndefined()
  })

  it("different tokens do not interfere", async () => {
    await addRequest("tok1", makeSnap("s1", "2026-04-28T00:00:00Z"))
    await addRequest("tok2", makeSnap("s2", "2026-04-28T00:00:00Z"))
    expect(await hydrate("tok1")).toHaveLength(1)
    expect(await hydrate("tok2")).toHaveLength(1)
  })

  it("enforces max 500: 501st insert removes oldest", async () => {
    const existing = Array.from({ length: 500 }, (_, i) =>
      ({ ...makeSnap(`s${i}`, new Date(i * 1000).toISOString()), token: "tok1" })
    )
    await db.requests.bulkAdd(existing)
    await addRequest("tok1", makeSnap("s500", new Date(500 * 1000).toISOString()))
    const count = await db.requests.where("token").equals("tok1").count()
    expect(count).toBe(500)
    const oldest = await db.requests.where("token").equals("tok1").sortBy("receivedAt")
    expect(oldest[0].id).toBe("s1")
  })

  it("clearHistory removes only that token's records", async () => {
    await addRequest("tok1", makeSnap("s1", "2026-04-28T00:00:00Z"))
    await addRequest("tok2", makeSnap("s2", "2026-04-28T00:00:00Z"))
    await clearHistory("tok1")
    expect(await hydrate("tok1")).toHaveLength(0)
    expect(await hydrate("tok2")).toHaveLength(1)
  })
})
