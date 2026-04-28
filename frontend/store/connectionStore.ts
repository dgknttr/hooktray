import { create } from "zustand"
import type { ConnectionStatus } from "@/types"

interface ConnectionStore {
  status: ConnectionStatus
  token: string | null
  hookUrl: string | null
  setStatus: (s: ConnectionStatus) => void
  setSession: (token: string, hookUrl: string) => void
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  status: "disconnected",
  token: null,
  hookUrl: null,
  setStatus: (status) => set({ status }),
  setSession: (token, hookUrl) => set({ token, hookUrl }),
}))
