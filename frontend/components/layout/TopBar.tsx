"use client"
import Image from "next/image"
import { useState } from "react"
import { Copy, Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useConnectionStore } from "@/store/connectionStore"
import { useTheme } from "@/app/providers"
import type { Theme } from "@/types"

const STATUS_CONFIG = {
  connected: { label: "Connected", dot: "●", color: "text-green-500" },
  reconnecting: { label: "Reconnecting", dot: "◌", color: "text-yellow-500 animate-pulse" },
  disconnected: { label: "Disconnected", dot: "○", color: "text-red-500" },
} as const
const GITHUB_URL = "https://github.com/dgknttr/hooktray"

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.35 9.35 0 0 1 12 6.98c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.22 10.22 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

export default function TopBar() {
  const { status, hookUrl } = useConnectionStore()
  const { theme, setTheme } = useTheme()
  const [copied, setCopied] = useState(false)

  const cfg = STATUS_CONFIG[status]

  async function handleCopy() {
    if (!hookUrl) return
    await navigator.clipboard.writeText(hookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const themeItems: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <header className="flex items-center justify-between px-4 h-14 border-b bg-background">
      <div className="flex items-center gap-2">
        <Image src="/hooktray_logo.svg" alt="HookTray" width={28} height={28} className="flex-shrink-0" />
        <span className="font-bold text-lg tracking-tight">HookTray</span>
      </div>

      <div className="flex items-center flex-1 max-w-xl mx-4 rounded-md border border-border bg-muted/40 overflow-hidden">
        <span className="font-mono text-xs truncate flex-1 px-3 py-1.5 text-muted-foreground select-all">
          {hookUrl ?? "—"}
        </span>
        <button
          onClick={handleCopy}
          aria-label="copy hook URL"
          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-medium border-l border-border hover:bg-accent transition-colors duration-150 cursor-pointer"
        >
          <Copy className="h-3 w-3" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className={`flex items-center gap-1 text-sm font-medium ${cfg.color}`}>
          <span>{cfg.dot}</span>
          <span>{cfg.label}</span>
        </span>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="view repository on GitHub"
          title="View repository on GitHub"
          className="hidden h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium transition-colors duration-150 hover:bg-muted sm:inline-flex"
        >
          <GitHubIcon />
          GitHub
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="toggle theme" />
            }
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : theme === "light" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Monitor className="h-4 w-4" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {themeItems.map(({ value, label, icon }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => setTheme(value)}
                className="flex items-center gap-2"
              >
                {icon}
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
