'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  Plus,
  Users,
  Share2,
  Grid,
  History,
  ChevronRight,
  ChevronLeft,
  BarChart3,
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string
  icon: React.ReactNode
  href: string
  variant: 'default' | 'ghost'
  isNew?: boolean
  badge?: {
    text: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
}

const mainNavItems: NavItem[] = [
  {
    title: 'My Templates',
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: '/dashboard/templates',
    variant: 'default',
    badge: {
      text: '12',
      variant: 'secondary',
    },
  },
  {
    title: 'Explore',
    icon: <Grid className="h-4 w-4" />,
    href: '/dashboard/explore',
    variant: 'ghost',
  },
  {
    title: 'Team',
    icon: <Users className="h-4 w-4" />,
    href: '/dashboard/team',
    variant: 'ghost',
    isNew: true,
  },
  {
    title: 'Favorites',
    icon: <FolderOpen className="h-4 w-4" />,
    href: '/dashboard/favorites',
    variant: 'ghost',
    badge: {
      text: '3',
      variant: 'outline',
    },
  },
]

const bottomNavItems: NavItem[] = [
  {
    title: 'Analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    href: '/dashboard/analytics',
    variant: 'ghost',
  },
  {
    title: 'History',
    icon: <History className="h-4 w-4" />,
    href: '/dashboard/history',
    variant: 'ghost',
  },
  {
    title: 'Reports',
    icon: <Share2 className="h-4 w-4" />,
    href: '/dashboard/reports',
    variant: 'ghost',
  },
  {
    title: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    href: '/dashboard/settings',
    variant: 'ghost',
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 z-20 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent hover:text-accent-foreground"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3 transition-transform" />
        ) : (
          <ChevronLeft className="h-3 w-3 transition-transform" />
        )}
      </Button>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4 no-scrollbar">
          {/* New Template Button */}
          <div className={cn('flex items-center gap-2', isCollapsed && 'justify-center')}>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Templates</span>
                <span className="text-xs text-muted-foreground">Create & manage</span>
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={isCollapsed ? 'icon' : 'default'}
                  className={cn(
                    'shadow-sm transition-all duration-200 hover:shadow-md',
                    !isCollapsed && 'ml-auto'
                  )}
                >
                  <Plus className="h-4 w-4" />
                  {!isCollapsed && <span className="ml-2">New Template</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className={cn(!isCollapsed && 'hidden')}>
                New Template
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator className="my-2" />

          {/* Main Navigation */}
          <nav className="flex flex-col gap-1">
            {mainNavItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-x-2 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-accent/50',
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                      isCollapsed && 'justify-center px-2'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-md border bg-background transition-colors',
                        pathname === item.href
                          ? 'border-border text-foreground'
                          : 'border-transparent text-muted-foreground group-hover:border-border group-hover:text-foreground'
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <div className="flex flex-1 items-center justify-between">
                        <span>{item.title}</span>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 text-xs font-medium',
                                item.badge.variant === 'default' && 'bg-primary text-primary-foreground',
                                item.badge.variant === 'secondary' && 'bg-secondary text-secondary-foreground',
                                item.badge.variant === 'outline' && 'border border-border',
                                item.badge.variant === 'destructive' && 'bg-destructive text-destructive-foreground'
                              )}
                            >
                              {item.badge.text}
                            </span>
                          )}
                          {item.isNew && (
                            <span className="flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className={cn(!isCollapsed && 'hidden')}
                  sideOffset={20}
                >
                  <div className="flex items-center gap-2">
                    {item.title}
                    {item.badge && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          item.badge.variant === 'default' && 'bg-primary text-primary-foreground',
                          item.badge.variant === 'secondary' && 'bg-secondary text-secondary-foreground',
                          item.badge.variant === 'outline' && 'border border-border',
                          item.badge.variant === 'destructive' && 'bg-destructive text-destructive-foreground'
                        )}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>

          {/* Bottom Navigation */}
          <div className="mt-auto">
            <Separator className="my-4" />
            <nav className="flex flex-col gap-1">
              {bottomNavItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-x-2 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-accent/50',
                        pathname === item.href
                          ? 'bg-accent text-accent-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                        isCollapsed && 'justify-center px-2'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-md border bg-background transition-colors',
                          pathname === item.href
                            ? 'border-border text-foreground'
                            : 'border-transparent text-muted-foreground group-hover:border-border group-hover:text-foreground'
                        )}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className={cn(!isCollapsed && 'hidden')}
                    sideOffset={20}
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 