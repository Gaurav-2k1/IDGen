import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, CreditCard, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CreditCard className="h-5 w-5" />
            <span>ID Card Builder</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Features</Button>
            <Button variant="ghost" size="sm">Pricing</Button>
            <Button variant="ghost" size="sm">Documentation</Button>
            <Button size="sm">Sign In</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container flex flex-col items-center justify-center space-y-12 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Professional ID Card Design Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Create custom ID cards with our intuitive drag-and-drop editor. 
                Perfect for organizations of all sizes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/editor">
                <Button size="lg">
                  Start Designing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Watch Tutorial
              </Button>
            </div>
          </div>
        </section>
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Easy Customization</CardTitle>
                  <CardDescription>
                    Intuitive design tools with drag-and-drop functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Customize every aspect of your ID cards with our professional design tools.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Team Collaboration</CardTitle>
                  <CardDescription>
                    Work together on designs in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Share design sessions with your team for collaborative editing and feedback.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Ready</CardTitle>
                  <CardDescription>
                    Secure, scalable, and reliable ID card solution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  Built with enterprise-grade security and performance for organizations of any size.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 font-semibold">
            <CreditCard className="h-4 w-4" />
            <span>ID Card Builder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ID Card Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}