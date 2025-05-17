import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
//import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ID Card Builder | Enterprise Solution',
  description: 'Professional ID card design and generation platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
          {children}
          <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}