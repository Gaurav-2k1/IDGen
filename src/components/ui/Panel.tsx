import React from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  className?: string;
  children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg shadow-sm p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

interface PanelHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between pb-3 mb-3 border-b border-border",
        className
      )}
    >
      {children}
    </div>
  );
};

interface PanelTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const PanelTitle: React.FC<PanelTitleProps> = ({ className, children }) => {
  return (
    <h3
      className={cn(
        "text-sm font-medium",
        className
      )}
    >
      {children}
    </h3>
  );
};

interface PanelContentProps {
  className?: string;
  children: React.ReactNode;
}

export const PanelContent: React.FC<PanelContentProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "space-y-3",
        className
      )}
    >
      {children}
    </div>
  );
};