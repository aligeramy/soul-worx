"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-white/10 bg-[#1c1c1e]/80 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="text-white hover:bg-white/5" />
        <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-white/60">System Online</span>
        </div>
      </div>
      <div className="ml-auto px-3">
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/5"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}

