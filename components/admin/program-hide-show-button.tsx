"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, FileEdit, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { setProgramStatus } from "@/app/(dashboard)/dashboard/admin/programs/actions"
import type { ProgramStatus } from "@/lib/db/schema"

type Props = {
  programId: string
  status: ProgramStatus
}

export function ProgramHideShowButton({ programId, status }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isVisible = status === "published"

  const setStatus = (newStatus: ProgramStatus) => {
    startTransition(async () => {
      await setProgramStatus(programId, newStatus)
      router.refresh()
    })
  }

  if (isVisible) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            disabled={isPending}
            title="Hide from public"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[10rem]">
          <DropdownMenuItem onClick={() => setStatus("draft")}>
            <FileEdit className="mr-2 h-4 w-4" />
            Move to draft
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatus("archived")}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-white/70 hover:text-white hover:bg-white/10"
      onClick={() => setStatus("published")}
      disabled={isPending}
      title="Show on public site (publish)"
    >
      <Eye className="h-4 w-4" />
    </Button>
  )
}
