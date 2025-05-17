import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
  className,
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-9 w-9 rounded-md",
        active && "bg-accent text-accent-foreground",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={label}
    >
      {icon}
    </Button>
  );
};