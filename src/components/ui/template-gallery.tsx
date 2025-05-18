'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Card,
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Template, TemplateFilter } from '@/lib/types'
import { useDesignStore } from '@/lib/Store'
import { 
  Plus, 
  Search, 
  Tags, 
  Grid, 
  Clock,
  Heart, 
  Filter,
  X,
  Star,
  ChevronRight
} from 'lucide-react'

export function TemplateGallery() {
  const router = useRouter()
  const { toast } = useToast()
  const { 
    templates, 
    fetchTemplates,
    loadTemplate,
    templateCategories,
    fetchTemplateCategories,
    templateIsLoading
  } = useDesignStore()
  
  // Local state
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'popularity' | 'newest' | 'oldest'>('popularity')
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  
  // Fetch templates on initial load
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchTemplates(),
        fetchTemplateCategories()
      ])
    }
    
    loadInitialData()
  }, [fetchTemplates, fetchTemplateCategories])
  
  // Update filtered templates whenever filters change
  useEffect(() => {
    // Apply filters
    const filter: TemplateFilter = {
      sortBy
    }
    
    if (searchQuery.trim()) {
      filter.search = searchQuery.trim()
    }
    
    if (selectedCategory) {
      filter.categories = [selectedCategory]
    }
    
    // Set isDefault based on active tab
    if (activeTab === 'default') {
      filter.isDefault = true
    } else if (activeTab === 'user') {
      filter.isDefault = false
    }
    
    // Fetch filtered templates
    fetchTemplates(filter)
      .then(templates => setFilteredTemplates(templates))
  }, [activeTab, searchQuery, selectedCategory, sortBy, fetchTemplates])
  
  // Load a template and navigate to editor
  const handleLoadTemplate = async (template: Template) => {
    const success = await loadTemplate(template.templateId)
    
    if (success) {
      toast({
        title: "Template loaded",
        description: `${template.title} has been loaded into the editor.`,
      })
      router.push('/editor')
    } else {
      toast({
        variant: "destructive",
        title: "Error loading template",
        description: "Failed to load the selected template.",
      })
    }
  }
  
  // Render thumbnail
  const renderTemplateThumbnail = (template: Template) => {
    if (template.thumbnailUrl) {
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-md">
          <img 
            src={template.thumbnailUrl} 
            alt={template.title} 
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
      )
    } else {
      // Fallback thumbnail with preview of first few elements
      return (
        <div 
          className="relative aspect-video w-full overflow-hidden rounded-t-md bg-muted flex items-center justify-center"
        >
          <Grid className="h-8 w-8 text-muted-foreground/50" />
        </div>
      )
    }
  }
  
  // Template card component
  const TemplateCard = ({ template }: { template: Template }) => (
    <Card className="overflow-hidden border hover:shadow-md transition-all">
      {renderTemplateThumbnail(template)}
      
      <CardHeader className="p-4">
        <CardTitle className="text-base">{template.title}</CardTitle>
        {template.description && (
          <CardDescription className="line-clamp-2">{template.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex gap-2">
          {template.isDefault && (
            <Badge variant="outline" className="bg-primary/10">
              <Star className="h-3 w-3 mr-1" />
              Official
            </Badge>
          )}
          {template.tags?.slice(0, 1).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button size="sm" onClick={() => handleLoadTemplate(template)}>
          Use
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
  
  // Filter controls
  const FilterControls = () => (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="category" className="sr-only">Category</Label>
          <Select 
            value={selectedCategory} 
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="min-w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {templateCategories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Label htmlFor="sort" className="sr-only">Sort by</Label>
          <Select 
            value={sortBy} 
            onValueChange={(value: 'popularity' | 'newest' | 'oldest') => setSortBy(value)}
          >
            <SelectTrigger className="min-w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active filters */}
      {(searchQuery || selectedCategory) && (
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filters:</span>
          
          {searchQuery && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedCategory && (
            <Badge variant="outline" className="flex items-center gap-1">
              {templateCategories.find(c => c.id === selectedCategory)?.name || selectedCategory}
              <button onClick={() => setSelectedCategory('')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('')
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Templates</h1>
        
        <Button onClick={() => router.push('/editor')}>
          <Plus className="h-4 w-4 mr-2" />
          Create new
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            All Templates
          </TabsTrigger>
          <TabsTrigger value="default" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Official
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            My Templates
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recently Used
          </TabsTrigger>
        </TabsList>
        
        <FilterControls />
        
        {templateIsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4 mx-auto"></div>
              <p className="text-muted-foreground">Loading templates...</p>
            </div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Tags className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory
                ? "Try adjusting your search filters."
                : activeTab === 'user'
                  ? "You haven't created any templates yet."
                  : "No templates available in this category."}
            </p>
            {activeTab === 'user' && (
              <Button onClick={() => router.push('/editor')}>
                Create your first template
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <TemplateCard key={template.templateId} template={template} />
            ))}
          </div>
        )}
      </Tabs>
    </div>
  )
}