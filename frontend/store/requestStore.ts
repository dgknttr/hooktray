import { create } from "zustand"
import type { RequestSnapshotWire, MethodFilter } from "@/types"
import { clearHistory as dbClearHistory } from "@/lib/db"

const MAX = 500

interface RequestStore {
  requests: RequestSnapshotWire[]
  selectedId: string | null
  filter: MethodFilter
  autoScroll: boolean
  addRequest: (r: RequestSnapshotWire) => void
  selectRequest: (id: string | null) => void
  setFilter: (f: MethodFilter) => void
  setAutoScroll: (v: boolean) => void
  clearHistory: (token: string) => void
  hydrate: (requests: RequestSnapshotWire[]) => void
}

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [],
  selectedId: null,
  filter: "ALL",
  autoScroll: true,

  addRequest: (r) =>
    set((s) => ({ requests: [r, ...s.requests].slice(0, MAX) })),

  selectRequest: (id) => set({ selectedId: id }),
  setFilter: (filter) => set({ filter }),
  setAutoScroll: (autoScroll) => set({ autoScroll }),

  clearHistory: (token) => {
    dbClearHistory(token).catch((err) =>
      console.warn("[HookTray] clearHistory DB error:", err)
    )
    set({ requests: [], selectedId: null })
  },

  hydrate: (requests) => set({ requests }),
}))
