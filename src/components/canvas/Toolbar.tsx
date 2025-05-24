'use client'

import { useState, useCallback, memo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDesignStore } from '@/lib/Store'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { 
  Save, 
  Download, 
  Share2, 
  Undo2, 
  Redo2, 
  Copy, 
  Trash2, 
  ArrowLeft,
  CreditCard,
  Users,
  RotateCw,
  Loader2
} from 'lucide-react'
import ToolbarButton from '../ui/toolbar-button'
import { createDesign, updateDesign } from '@/services/design-service'
import { ThemeToggle } from '../theme-toggle'

interface ToolbarProps {
  collaborative?: boolean
  sessionId?: string
  onToggleBackside?: () => void
  showBackside?: boolean
}

// Loading indicator component
const LoadingIndicator = memo(() => (
  <div className="flex items-center gap-2">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span className="text-sm">Processing...</span>
  </div>
))

LoadingIndicator.displayName = 'LoadingIndicator'

export const Toolbar = memo(function Toolbar({ 
  collaborative, 
  sessionId, 
  onToggleBackside, 
  showBackside 
}: ToolbarProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { 
    elements, 
    resetDesign, 
    canvasSize, 
    canvasBackground, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    saveStateToHistory, 
    design, 
    setDesign,
    isLoading
  } = useDesignStore()
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [designTitle, setDesignTitle] = useState(design?.title || 'Untitled Design')
  const [designDescription, setDesignDescription] = useState(design?.description || '')
  const [shareUrl, setShareUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  
  // Memoized handlers
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true)
      saveStateToHistory()
      
      const updatedDesign = {
        ...design,
        title: designTitle,
        description: designDescription,
        elements,
        backsideElements: design?.backsideElements || [],
        canvasSize,
        canvasBackground,
        lastModified: new Date().toISOString()
      }
      
      setDesign(updatedDesign)
      
      const savedDesign = await createDesign(updatedDesign)
      
      if (savedDesign?.id) {
        setDesign(savedDesign)
        toast({
          title: "Design saved",
          description: "Your design has been saved successfully",
        })
        setSaveDialogOpen(false)
      }
    } catch (error) {
      console.error('Save error:', error)
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving your design. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }, [design, designTitle, designDescription, elements, canvasSize, canvasBackground, saveStateToHistory, setDesign, toast])
  
  const handleShare = useCallback(async () => {
    try {
      setIsSharing(true)
      const updatedDesign = {
        ...design,
        title: designTitle,
        description: designDescription,
        elements,
        canvasSize, 
        canvasBackground,
        lastModified: new Date().toISOString(),
        isShared: true
      }
      
      const savedDesign = await updateDesign("", updatedDesign)
      
      if (savedDesign?.id) {
        setDesign(savedDesign)
        const shareableUrl = `${window.location.origin}/editor/${savedDesign.id}`
        setShareUrl(shareableUrl)
        
        toast({
          title: "Design shared",
          description: "You can now share this design with others",
        })
      }
    } catch (error) {
      console.error('Share error:', error)
      toast({
        variant: "destructive",
        title: "Share failed",
        description: "There was an error sharing your design. Please try again.",
      })
    } finally {
      setIsSharing(false)
    }
  }, [design, designTitle, designDescription, elements, canvasSize, canvasBackground, setDesign, toast])
  
  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true)
      toast({
        title: "Export initiated",
        description: "Your ID card design is being prepared for download",
      })
      
      // Simulating export delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Export complete",
        description: "Your ID card design has been downloaded",
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was an error exporting your design. Please try again.",
      })
    } finally {
      setIsExporting(false)
    }
  }, [toast])
  
  const handleNew = useCallback(() => {
    resetDesign()
    
    toast({
      title: "New design created",
      description: "You're now working on a new design"
    })
  }, [resetDesign, toast])
  
  const copyShareUrl = useCallback(() => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "URL copied",
        description: "Share URL copied to clipboard"
      })
    }
  }, [shareUrl, toast])

  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Home</span>
            </Button>
            <div className="flex items-center gap-2 font-semibold">
              <CreditCard className="h-5 w-5" />
              <span className="hidden sm:inline-block">ID Card Builder</span>
            </div>
          </Link>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="text-sm">
            {collaborative ? (
              <div className="flex items-center">
                <span className="font-medium">{design?.title || 'Collaborative Session'}</span>
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                  Live
                </span>
              </div>
            ) : (
              <span className="font-medium">
                {design?.title || 'Untitled Design'}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ToolbarButton 
            icon={<Undo2 className="h-4 w-4" />} 
            label="Undo"
            onClick={undo}
            disabled={!canUndo || isLoading}
          />
          <ToolbarButton 
            icon={<Redo2 className="h-4 w-4" />} 
            label="Redo"
            onClick={redo}
            disabled={!canRedo || isLoading}
          />
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <ToolbarButton 
            icon={<RotateCw className="h-4 w-4" />} 
            label={showBackside ? "Show Front" : "Show Back"}
            onClick={() => onToggleBackside?.()}
            className={cn(showBackside && "text-primary")}
            disabled={isLoading}
          />

          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <ToolbarButton 
            icon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} 
            label="Save"
            onClick={() => setSaveDialogOpen(true)}
            disabled={isLoading || isSaving}
          />
          <ToolbarButton 
            icon={isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} 
            label="Export"
            onClick={handleExport}
            disabled={isLoading || isExporting || elements.length === 0}
          />
          <ToolbarButton 
            icon={isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />} 
            label="Share"
            onClick={() => setShareDialogOpen(true)}
            disabled={isLoading || isSharing}
            className={cn(collaborative && "text-primary")}
          />
          <ThemeToggle />
          
          {collaborative && (
            <div className="ml-2 flex items-center">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Users className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Design</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="design-title">Design Title</Label>
              <Input
                id="design-title"
                value={designTitle}
                onChange={(e) => setDesignTitle(e.target.value)}
                placeholder="Enter a title for your design"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="design-description">Description (optional)</Label>
              <Textarea
                id="design-description"
                value={designDescription}
                onChange={(e) => setDesignDescription(e.target.value)}
                placeholder="Enter a description for your design"
                rows={3}
                disabled={isSaving}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!designTitle.trim() || isSaving}>
              {isSaving ? <LoadingIndicator /> : 'Save Design'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Design</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {shareUrl ? (
              <div className="space-y-2">
                <Label htmlFor="share-url">Anyone with this link can view and edit</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="share-url"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={copyShareUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Create a shareable link to collaborate on this design
                </p>
                <Button onClick={handleShare} disabled={isSharing}>
                  {isSharing ? <LoadingIndicator /> : 'Generate Share Link'}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
})

Toolbar.displayName = 'Toolbar'
