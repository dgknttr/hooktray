import { describe, it, expect, beforeEach } from "vitest"
import { useConnectionStore } from "@/store/connectionStore"

describe("connectionStore", () => {
  beforeEach(() => {
    useConnectionStore.setState({ status: "disconnected", token: null, hookUrl: null })
  })

  it("initial status is disconnected", () => {
    expect(useConnectionStore.getState().status).toBe("disconnected")
  })

  it("setStatus transitions to connected", () => {
    useConnectionStore.getState().setStatus("connected")
    expect(useConnectionStore.getState().status).toBe("connected")
  })

  it("setStatus transitions connected → reconnecting", () => {
    useConnectionStore.getState().setStatus("connected")
    useConnectionStore.getState().setStatus("reconnecting")
    expect(useConnectionStore.getState().status).toBe("reconnecting")
  })

  it("setStatus transitions reconnecting → disconnected", () => {
    useConnectionStore.getState().setStatus("reconnecting")
    useConnectionStore.getState().setStatus("disconnected")
    expect(useConnectionStore.getState().status).toBe("disconnected")
  })

  it("setSession sets token and hookUrl", () => {
    useConnectionStore.getState().setSession("tok1", "http://test/hooks/tok1")
    const s = useConnectionStore.getState()
    expect(s.token).toBe("tok1")
    expect(s.hookUrl).toBe("http://test/hooks/tok1")
  })
})
