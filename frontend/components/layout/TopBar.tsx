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
