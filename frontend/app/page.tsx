"use client"
import { useEffect, useRef } from "react"
import { useConnectionStore } from "@/store/connectionStore"
import { useRequestStore } from "@/store/requestStore"
import { resolveInitialToken } from "@/lib/api"
import {
  hydrate,
  addRequest as dbAddRequest,
  markRequestRead as dbMarkRequestRead,
} from "@/lib/db"
import { createSSEConnection } from "@/lib/sse"
import AppShell from "@/components/layout/AppShell"

export default function Page() {
  const { setStatus, setSession } = useConnectionStore()
  const { addRequest, hydrate: hydrateStore } = useRequestStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    let cleanup: (() => void) | undefined

    async function init() {
      const { token, hookUrl, streamUrl } = await resolveInitialToken()

      const url = new URL(window.location.href)
      url.searchParams.set("t", token)
      window.history.replaceState({}, "", url)
      localStorage.setItem("lastActiveToken", token)

      setSession(token, hookUrl)

      const stored = await hydrate(token)
      const selectedId = hydrateStore(stored)
      if (selectedId) {
        dbMarkRequestRead(token, selectedId).catch((err) =>
          console.warn("[HookTray] markRequestRead DB error:", err)
        )
      }

      cleanup = createSSEConnection(streamUrl, {
        onConnected: () => setStatus("connected"),
        onReconnecting: () => setStatus("reconnecting"),
        onDisconnected: () => setStatus("disconnected"),
        onRequest: (snapshot) => {
          const localSnapshot = addRequest(snapshot)
          dbAddRequest(token, localSnapshot).catch((err) =>
            console.warn("[HookTray] DB write error:", err)
          )
        },
      })
    }

    init().catch((err) => {
      console.error("[HookTray] Init error:", err)
      setStatus("disconnected")
    })

    return () => cleanup?.()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <AppShell />
}
