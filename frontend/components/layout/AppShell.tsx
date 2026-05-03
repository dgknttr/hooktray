"use client"
import dynamic from "next/dynamic"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRequestStore } from "@/store/requestStore"
import { useConnectionStore } from "@/store/connectionStore"
import TopBar from "./TopBar"
import RequestList from "@/components/requests/RequestList"
import SignalPulseEmptyState from "@/components/requests/SignalPulseEmptyState"

const RequestDetail = dynamic(() => import("@/components/requests/RequestDetail"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Loading request...
    </div>
  ),
})

export default function AppShell() {
  const { requests, selectedId, selectRequest } = useRequestStore()
  const { token } = useConnectionStore()
  const selected = requests.find((r) => r.id === selectedId) ?? null

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <TopBar />

      <main className="flex flex-1 overflow-hidden">
        <div
          className={`${selected ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r flex-shrink-0`}
        >
          <RequestList />
        </div>

        <div className={`${selected ? "flex" : "hidden md:flex"} flex-col flex-1 overflow-hidden`}>
          {selected ? (
            <>
              <div className="md:hidden border-b px-3 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectRequest(null)}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to requests
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <RequestDetail request={selected} />
              </div>
            </>
          ) : (
            requests.length === 0 ? (
              <SignalPulseEmptyState token={token} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                Select a request to inspect
              </div>
            )
          )}
        </div>
      </main>
    </div>
  )
}
