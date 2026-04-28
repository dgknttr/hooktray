"use client"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRequestStore } from "@/store/requestStore"
import TopBar from "./TopBar"
import RequestList from "@/components/requests/RequestList"
import RequestDetail from "@/components/requests/RequestDetail"

export default function AppShell() {
  const { requests, selectedId, selectRequest } = useRequestStore()
  const selected = requests.find((r) => r.id === selectedId) ?? null

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
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
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Select a request to inspect
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
