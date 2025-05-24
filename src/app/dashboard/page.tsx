'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Plus,
  Pencil,
  Copy,
  Trash2,
  Download,
  Share2,
  Star,
  Clock,
  Eye,
} from 'lucide-react'

// Template interface to replace 'any'
interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  createdAt?: string;
  status?: 'published' | 'draft';
  usageCount?: number;
  lastModified?: string;
  tags?: string[];
  lastUsed?: string;
  views?: number;
  category?: string;
  rating?: number;
  downloads?: number;
  isPremium?: boolean;
  author?: string;
  lastUpdated?: string;
}

// Sample data - replace with actual data from your API/store
const myTemplates: Template[] = [
  {
    id: '1',
    name: 'Employee ID Card',
    description: 'Standard employee identification card template',
    thumbnail: '/templates/employee-id.png',
    createdAt: '2024-01-15',
    status: 'published',
    usageCount: 156,
    lastModified: '2024-03-10',
    tags: ['corporate', 'employee'],
    lastUsed: '2 hours ago',
    views: 1234,
  },
  {
    id: '2',
    name: 'Student ID Card',
    description: 'University student ID card design',
    thumbnail: '/templates/student-id.png',
    createdAt: '2024-01-20',
    status: 'draft',
    usageCount: 89,
    lastModified: '2024-03-15',
    tags: ['education', 'student'],
    lastUsed: '5 days ago',
    views: 567,
  },
]

const preBuiltTemplates: Template[] = [
  {
    id: 'pb1',
    name: 'Corporate ID',
    description: 'Professional corporate identity card',
    thumbnail: '/templates/corporate-id.png',
    category: 'Business',
    rating: 4.8,
    downloads: 2345,
    isPremium: true,
    author: 'ID Card Team',
    lastUpdated: '1 week ago',
  },
  {
    id: 'pb2',
    name: 'School ID',
    description: 'Modern school identification card',
    thumbnail: '/templates/school-id.png',
    category: 'Education',
    rating: 4.5,
    downloads: 1890,
    isPremium: false,
    author: 'ID Card Team',
    lastUpdated: '2 weeks ago',
  },
  {
    id: 'pb3',
    name: 'Event Badge',
    description: 'Conference and event badge template',
    thumbnail: '/templates/event-badge.png',
    category: 'Events',
    rating: 4.7,
    downloads: 3210,
    isPremium: true,
    author: 'ID Card Team',
    lastUpdated: '3 days ago',
  },
]

interface TemplateCardProps {
  template: Template;
  onEdit?: () => void;
  onDuplicate: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  isPreBuilt?: boolean;
}

function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
  onDownload,
  onShare,
  isPreBuilt,
}: TemplateCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg">
        <CardHeader className="p-4 space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-md">
            <Image
              src={template.thumbnail}
              alt={template.name}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2">
                {!isPreBuilt && (
                  <Button variant="secondary" size="sm" onClick={onEdit} className="h-8">
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={onDuplicate} className="h-8">
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                {onDownload && (
                  <Button variant="secondary" size="sm" onClick={onDownload} className="h-8">
                    <Download className="h-4 w-4 mr-1" />
                    Use
                  </Button>
                )}
                {onShare && (
                  <Button variant="secondary" size="sm" onClick={onShare} className="h-8">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                )}
                {!isPreBuilt && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="h-8"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">{template.description}</CardDescription>
              </div>
              {isPreBuilt && (
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">{template.rating}</span>
                  </div>
                  {template.isPremium && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Premium
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                {!isPreBuilt ? (
                  <>
                    <Badge
                      variant={template.status === 'published' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {template.status}
                    </Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" />
                      {template.views}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-muted-foreground">{template.author}</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Download className="h-3.5 w-3.5" />
                      {template.downloads}
                    </span>
                  </>
                )}
              </div>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {!isPreBuilt ? template.lastUsed : template.lastUpdated}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{template.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.()
                setIsDeleteDialogOpen(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const handleEdit = (templateId: string) => {
    // Navigate to editor with template ID
    console.log('Edit template:', templateId)
  }

  const handleDuplicate = (templateId: string) => {
    // Duplicate template logic
    console.log('Duplicate template:', templateId)
  }

  const handleDelete = (templateId: string) => {
    // Delete template logic
    console.log('Delete template:', templateId)
  }

  const handleDownload = (templateId: string) => {
    // Download template logic
    console.log('Download template:', templateId)
  }

  const handleShare = (templateId: string) => {
    // Share template logic
    console.log('Share template:', templateId)
  }

  const filteredMyTemplates = myTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPreBuiltTemplates = preBuiltTemplates.filter(
    (template) => {
      const nameMatches = template.name.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatches = selectedCategory === 'all' || 
        (template.category?.toLowerCase() === selectedCategory);
      return nameMatches && categoryMatches;
    }
  )

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto no-scrollbar bg-muted/5">
        <div className="p-6 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">My Templates</h2>
                  <p className="text-muted-foreground">
                    {filteredMyTemplates.length} templates found
                  </p>
                </div>
                <Button className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={() => handleEdit(template.id)}
                    onDuplicate={() => handleDuplicate(template.id)}
                    onDelete={() => handleDelete(template.id)}
                    onShare={() => handleShare(template.id)}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Pre-built Templates</h2>
                  <p className="text-muted-foreground">
                    {filteredPreBuiltTemplates.length} templates available
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPreBuiltTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onDuplicate={() => handleDuplicate(template.id)}
                    onDownload={() => handleDownload(template.id)}
                    isPreBuilt
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
