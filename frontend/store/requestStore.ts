import { create } from "zustand"
import type {
  LocalRequestSnapshot,
  RequestSnapshotWire,
  MethodFilter,
} from "@/types"
import {
  clearHistory as dbClearHistory,
  markRequestRead as dbMarkRequestRead,
} from "@/lib/db"

const MAX = 500

interface RequestStore {
  requests: LocalRequestSnapshot[]
  selectedId: string | null
  filter: MethodFilter
  autoScroll: boolean
  addRequest: (r: RequestSnapshotWire) => LocalRequestSnapshot
  selectRequest: (id: string | null, token?: string) => void
  setFilter: (f: MethodFilter) => void
  setAutoScroll: (v: boolean) => void
  clearHistory: (token: string) => void
  hydrate: (requests: LocalRequestSnapshot[]) => string | null
}

function markRead(
  requests: LocalRequestSnapshot[],
  id: string | null
): LocalRequestSnapshot[] {
  if (!id) return requests
  return requests.map((request) =>
    request.id === id ? { ...request, isRead: true } : request
  )
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  selectedId: null,
  filter: "ALL",
  autoScroll: true,

  addRequest: (r) => {
    let localRequest: LocalRequestSnapshot | undefined

    set((s) => {
      const shouldAutoSelect = s.selectedId === null
      const localOrdinal =
        Math.max(0, ...s.requests.map((request) => request.localOrdinal)) + 1
      localRequest = {
        ...r,
        localOrdinal,
        isRead: shouldAutoSelect,
      }

      return {
        requests: [localRequest, ...s.requests].slice(0, MAX),
        selectedId: shouldAutoSelect ? r.id : s.selectedId,
      }
    })

    return localRequest!
  },

  selectRequest: (id, token) => {
    if (id && token) {
      dbMarkRequestRead(token, id).catch((err) =>
        console.warn("[HookTray] markRequestRead DB error:", err)
      )
    }
    set((s) => ({ selectedId: id, requests: markRead(s.requests, id) }))
  },
  setFilter: (filter) => set({ filter }),
  setAutoScroll: (autoScroll) => set({ autoScroll }),

  clearHistory: (token) => {
    dbClearHistory(token).catch((err) =>
      console.warn("[HookTray] clearHistory DB error:", err)
    )
    set({ requests: [], selectedId: null })
  },

  hydrate: (requests) => {
    let selectedToPersist: string | null = null

    set((s) => {
      const currentStillExists =
        s.selectedId !== null &&
        requests.some((request) => request.id === s.selectedId)
      const selectedId = currentStillExists
        ? s.selectedId
        : (requests[0]?.id ?? null)
      selectedToPersist = selectedId

      return {
        requests: markRead(requests, selectedId),
        selectedId,
      }
    })

    return selectedToPersist
  },
}))
