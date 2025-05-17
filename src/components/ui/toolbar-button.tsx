import React from "react"
import { cn } from "@/lib/utils" // Assuming you're using shadcn/ui conventions

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
}

const ToolbarButton = ({
  icon,
  label,
  onClick,
  disabled = false,
  className,
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  )
}

export default ToolbarButton