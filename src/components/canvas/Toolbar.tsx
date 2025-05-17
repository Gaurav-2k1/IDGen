'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDesignStore } from '@/lib/Store'
import { saveDesign, createNewDesign } from '@/services/designService'
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
  Users
} from 'lucide-react'
import ToolbarButton from '../ui/toolbar-button'

interface ToolbarProps {
  collaborative?: boolean
  sessionId?: string
}

export function Toolbar({ collaborative, sessionId }: ToolbarProps) {
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
  
  // Handle saving the design
  const handleSave = async () => {
    try {
      saveStateToHistory() // Save current state to history
      
      const updatedDesign = {
        ...design,
        title: designTitle,
        description: designDescription,
        elements,
        canvasSize,
        canvasBackground,
        lastModified: new Date().toISOString()
      }
      
      setDesign(updatedDesign)
      
      const savedDesign = await saveDesign(updatedDesign)
      
      if (savedDesign?.id) {
        setDesign(savedDesign)
        toast({
          title: "Design saved",
          description: "Your design has been saved successfully",
        })
      }
      
      setSaveDialogOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "There was an error saving your design. Please try again.",
      })
    }
  }
  
  // Handle sharing the design
  const handleShare = async () => {
    try {
      // Save the design first
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
      
      const savedDesign = await saveDesign(updatedDesign)
      
      if (savedDesign?.id) {
        setDesign(savedDesign)
        // Generate a shareable URL
        const shareableUrl = `${window.location.origin}/editor/${savedDesign.id}`
        setShareUrl(shareableUrl)
        
        toast({
          title: "Design shared",
          description: "You can now share this design with others",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Share failed",
        description: "There was an error sharing your design. Please try again.",
      })
    }
  }
  
  // Handle design export as PNG
  const handleExport = () => {
    try {
      // In a real implementation, this would generate a PNG
      toast({
        title: "Export initiated",
        description: "Your ID card design is being prepared for download",
      })
      
      // Simulating export delay
      setTimeout(() => {
        toast({
          title: "Export complete",
          description: "Your ID card design has been downloaded",
        })
      }, 1500)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was an error exporting your design. Please try again.",
      })
    }
  }
  
  // Handle creating a new design
  const handleNew = () => {
    resetDesign()
    
    toast({
      title: "New design created",
      description: "You're now working on a new design"
    })
    
    // Create new design on server
    createNewDesign().then(newDesign => {
      if (newDesign?.id) {
        setDesign(newDesign)
      }
    })
  }
  
  // Copy share URL to clipboard
  const copyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: "URL copied",
        description: "Share URL copied to clipboard"
      })
    }
  }

  return (
    <>
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
              disabled={!canUndo}
            />
            <ToolbarButton 
              icon={<Redo2 className="h-4 w-4" />} 
              label="Redo"
              onClick={redo}
              disabled={!canRedo}
            />
            
            <Separator orientation="vertical" className="mx-1 h-6" />
            
            <ToolbarButton 
              icon={<Save className="h-4 w-4" />} 
              label="Save"
              onClick={() => setSaveDialogOpen(true)}
              disabled={isLoading}
            />
            <ToolbarButton 
              icon={<Download className="h-4 w-4" />} 
              label="Export"
              onClick={handleExport}
              disabled={isLoading || elements.length === 0}
            />
            <ToolbarButton 
              icon={<Share2 className="h-4 w-4" />} 
              label="Share"
              onClick={() => setShareDialogOpen(true)}
              disabled={isLoading}
              className={cn(collaborative && "text-primary")}
            />
            
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
      </header>
      
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!designTitle.trim()}>
              Save Design
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
                <Button onClick={handleShare}>
                  Generate Share Link
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}