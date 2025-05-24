'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Mail,
  MessageSquare,
  UserPlus,
  Users,
  Building2,
  Keyboard,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // const pathname = usePathname() // Commented out as unused
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [notifications] = useState([
    {
      id: 1,
      title: 'New team member joined',
      description: 'Sarah Johnson has joined the design team',
      time: '5m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Template approved',
      description: 'Your employee ID template was approved',
      time: '1h ago',
      unread: true,
    },
  ])
  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    image: '/avatars/default.png',
    role: 'Admin',
    team: 'Design Team',
    organization: 'Acme Corp',
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-card">
        <div className="flex h-16 items-center gap-4 px-4 md:px-8">
          {/* Company Name/Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold">ID Card Generator</span>
          </Link>

          {/* Global Search */}
          <div className="ml-6 hidden md:block max-w-md lg:max-w-lg xl:max-w-xl flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates, team members..."
                className="pl-8 w-full"
                onClick={() => setIsSearchOpen(true)}
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {/* Help */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help & Resources</TooltipContent>
            </Tooltip>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{notification.title}</span>
                      {notification.unread && (
                        <Badge variant="secondary" className="h-fit">New</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{notification.description}</span>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 gap-2 pl-2 pr-4">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.role}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-base font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{user.role}</Badge>
                          <Badge variant="outline">{user.team}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{user.organization}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Keyboard className="mr-2 h-4 w-4" />
                    Keyboard shortcuts
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Users className="mr-2 h-4 w-4" />
                      Team
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Invite Members
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Team Settings
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Support
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Documentation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Support
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 no-scrollbar">
        {children}
      </main>

      {/* Global Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search across templates, team members, and more.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Type to search..." className="pl-8" autoFocus />
          </div>
          <div className="mt-4 max-h-[300px] overflow-auto no-scrollbar">
            <h4 className="text-sm font-medium mb-2">Recent Searches</h4>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                Employee ID Template
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                Design Team
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
