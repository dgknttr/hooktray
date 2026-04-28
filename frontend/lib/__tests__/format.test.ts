import { describe, it, expect } from "vitest"
import { formatBytes, formatRelativeTime } from "@/lib/format"

describe("formatBytes", () => {
  it("formats bytes under 1 KB", () => expect(formatBytes(500)).toBe("500 B"))
  it("formats exactly 1 KB", () => expect(formatBytes(1024)).toBe("1.0 KB"))
  it("formats kilobytes", () => expect(formatBytes(2048)).toBe("2.0 KB"))
  it("formats megabytes", () => expect(formatBytes(1048576)).toBe("1.0 MB"))
  it("formats zero bytes", () => expect(formatBytes(0)).toBe("0 B"))
})

describe("formatRelativeTime", () => {
  it("returns 'just now' for < 1s", () => {
    expect(formatRelativeTime(Date.now() - 200)).toBe("just now")
  })
  it("returns seconds ago", () => {
    expect(formatRelativeTime(Date.now() - 2000)).toBe("2s ago")
  })
  it("returns minutes ago", () => {
    expect(formatRelativeTime(Date.now() - 120000)).toBe("2m ago")
  })
  it("returns hours ago", () => {
    expect(formatRelativeTime(Date.now() - 7200000)).toBe("2h ago")
  })
})
