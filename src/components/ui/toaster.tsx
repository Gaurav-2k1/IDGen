'use client'
import * as React from "react"
import { X } from "lucide-react"
import { useToast } from "./use-toast"
// Adjust the import path to where your use-toast.js file is located

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => {
        const { id, title, description, action, variant, open } = toast

        return (
          <div
            key={id}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full
              ${
                variant === "destructive"
                  ? "border-red-500 bg-red-500 text-white"
                  : variant === "success"
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-border bg-background"
              }`}
            data-state={open ? "open" : "closed"}
          >
            {variant === "success" && (
              <div className="absolute left-2 flex h-full items-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {variant === "destructive" && (
              <div className="absolute left-2 flex h-full items-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            
            <div className={`flex flex-1 items-start gap-2 ${variant === "default" ? "" : "ml-4"}`}>
              <div className="flex flex-1 flex-col gap-1">
                {title && <div className="text-sm font-semibold">{title}</div>}
                {description && (
                  <div className="text-sm opacity-90">{description}</div>
                )}
              </div>
            </div>
            {action}
            <button
              onClick={() => dismiss(id)}
              aria-label="Close toast"
              className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:text-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

// Example of how to use the Toaster
export function ToastDemo() {
  // Importing directly from the file to ensure it's using the correct path
  const { toast } = useToast();
  
  const showDefaultToast = () => {
    toast({
      title: "Default Toast",
      description: "This is a default toast message"
    })
  }
  
  const showSuccessToast = () => {
    toast({
      title: "Success!",
      description: "Operation completed successfully",
      variant: "success"
    })
  }
  
  const showErrorToast = () => {
    toast({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive"
    })
  }
  
  return (
    <div className="flex gap-4">
      <button 
        onClick={showDefaultToast}
        className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
      >
        Show Default Toast
      </button>
      <button 
        onClick={showSuccessToast}
        className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        Show Success Toast
      </button>
      <button 
        onClick={showErrorToast}
        className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Show Error Toast
      </button>
    </div>
  )
}