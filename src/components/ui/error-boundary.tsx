// "use client"

// import React, { Component, ErrorInfo, ReactNode } from "react"

// interface ErrorBoundaryProps {
//   children: ReactNode
//   fallback: ReactNode
// }

// interface ErrorBoundaryState {
//   hasError: boolean
//   error?: Error
// }

// class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   constructor(props: ErrorBoundaryProps) {
//     super(props)
//     this.state = { hasError: false }
//   }

//   static getDerivedStateFromError(error: Error): ErrorBoundaryState {
//     // Update state so the next render shows the fallback UI
//     return { hasError: true, error }
//   }

//   componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
//     // You can log the error to an error reporting service here
//     console.error("Error caught by ErrorBoundary:", error, errorInfo)
//   }

//   render(): ReactNode {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       return this.props.fallback
//     }

//     return this.props.children
//   }
// }

// export default ErrorBoundary