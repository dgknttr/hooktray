"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, Copy } from "lucide-react"

import { buildHookUrl } from "@/lib/api"

const TOKEN_STORAGE_KEY = "lastActiveToken"

function getStoredEndpoint(): string | null {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!token) return null

  return new URL(buildHookUrl(token), window.location.origin).toString()
}

export function ExistingHookEndpoint() {
  const [endpoint, setEndpoint] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const refresh = () => {
      setEndpoint(getStoredEndpoint())
      setReady(true)
    }

    refresh()
    window.addEventListener("storage", refresh)
    return () => window.removeEventListener("storage", refresh)
  }, [])

  async function copyEndpoint() {
    if (!endpoint) return
    await navigator.clipboard.writeText(endpoint)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  if (!ready) return null

  return (
    <section className="mb-12 border-y border-border py-6" aria-labelledby="existing-endpoint-title">
      <h2 id="existing-endpoint-title" className="text-xl font-semibold">
        Your HookTray endpoint
      </h2>
      {endpoint ? (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Paste this endpoint into your provider, keep the inspector open, then trigger an event.
          </p>
          <div className="mt-4 flex min-w-0 items-center gap-2">
            <code className="min-w-0 flex-1 overflow-x-auto rounded-md border bg-muted px-3 py-2 text-sm">
              {endpoint}
            </code>
            <button
              type="button"
              onClick={copyEndpoint}
              className="inline-flex size-9 flex-shrink-0 items-center justify-center rounded-md border hover:bg-muted"
              aria-label="Copy endpoint"
              title="Copy endpoint"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            This temporary URL is a secret. Anyone with it can send requests to your inspector.
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          This browser does not have a HookTray endpoint yet.{" "}
          <Link href="/" className="font-medium text-foreground underline underline-offset-2">
            Open the inspector
          </Link>{" "}
          once to create one, then return to this guide.
        </p>
      )}
    </section>
  )
}
