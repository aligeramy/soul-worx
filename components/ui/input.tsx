import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-10 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm shadow-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:shadow-md",
        "aria-invalid:border-red-500 aria-invalid:ring-red-200",
        className
      )}
      {...props}
    />
  )
}

export { Input }
