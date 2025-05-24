// import Link from 'next/link' // Unused
// import Image from 'next/image' // Unused
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter, // Unused
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRight,
  CreditCard,
  // Users, // Unused
  Shield,
  Zap,
  Cloud,
  BarChart,
  CheckCircle2,
  Building2,
  Globe2,
  ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with industry standards',
    icon: Shield,
    color: 'text-blue-500',
  },
  {
    title: 'Lightning Fast',
    description: 'Optimized performance for large-scale ID card generation',
    icon: Zap,
    color: 'text-yellow-500',
  },
  {
    title: 'Cloud Storage',
    description: 'Secure cloud storage with automatic backups',
    icon: Cloud,
    color: 'text-purple-500',
  },
]

const stats = [
  { number: '10K+', label: 'Organizations' },
  { number: '1M+', label: 'ID Cards Generated' },
  { number: '99.9%', label: 'Uptime' },
  { number: '24/7', label: 'Support' },
]

const trustedBy = [
  'Fortune 500 Companies',
  'Government Agencies',
  'Educational Institutions',
  'Healthcare Providers',
  'Tech Startups',
  'Financial Services',
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>ID Card Generator</span>
          </div>
          <nav className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm">Solutions</Button>
              <Button variant="ghost" size="sm">Enterprise</Button>
              <Button variant="ghost" size="sm">Pricing</Button>
              <Button variant="ghost" size="sm">Resources</Button>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button size="sm">Start Free Trial</Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="container flex flex-col items-center justify-center space-y-8 text-center relative">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Enterprise ID Card Management{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                Streamline your organization&apos;s identity management with our secure, scalable, and 
                enterprise-ready ID card solution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-12 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8">
                Book a Demo
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">{stat.number}</h2>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Enterprise-Grade Features</h2>
              <p className="text-muted-foreground text-lg">
                Everything you need for professional ID card management
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <feature.icon className={cn("h-6 w-6", feature.color)} />
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                        Advanced access controls
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                        Real-time collaboration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                        Audit logging
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-16 border-t">
          <div className="container">
            <div className="text-center mb-8">
              <h3 className="text-lg font-medium text-muted-foreground mb-12">
                Trusted by industry leaders worldwide
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {trustedBy.map((company, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center p-4 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm font-medium">{company}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container">
            <div className="flex flex-col items-center text-center space-y-8">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to transform your ID card management?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-[600px]">
                Join thousands of organizations that trust our platform for their ID card needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-semibold mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>ID Card Generator</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Enterprise-grade ID card management platform for modern organizations.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Globe2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Building2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <BarChart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold mb-2">Product</h4>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Features</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Security</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Enterprise</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Pricing</Button>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold mb-2">Resources</h4>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Documentation</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">API Reference</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Guides</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Blog</Button>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold mb-2">Company</h4>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">About</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Careers</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Contact</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Partners</Button>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold mb-2">Legal</h4>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Privacy</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Terms</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Security</Button>
            <Button variant="link" className="h-auto p-0 text-muted-foreground">Compliance</Button>
          </div>
        </div>
        <div className="container mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} ID Card Generator. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Button variant="link" className="h-auto p-0 text-muted-foreground">Privacy Policy</Button>
              <Button variant="link" className="h-auto p-0 text-muted-foreground">Terms of Service</Button>
              <Button variant="link" className="h-auto p-0 text-muted-foreground">Cookies</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}