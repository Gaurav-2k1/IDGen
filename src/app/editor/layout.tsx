import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ID Card Editor | Enterprise Solution',
  description: 'Professional ID card design editor',
}

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {children}
    </div>
  )
}