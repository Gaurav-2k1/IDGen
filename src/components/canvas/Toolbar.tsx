 'use client'

import { useState } from 'react'
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
  Users
} from 'lucide-react'
import ToolbarButton from '../ui/toolbar-button'
import { createDesign, updateDesign } from '@/services/design-service'

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
      
      const savedDesign = await createDesign(updatedDesign)
      
      // if (savedDesign?.id) {
      //   setDesign(savedDesign)
      //   toast({
      //     title: "Design saved",
      //     description: "Your design has been saved successfully",
      //   })
      // }
      
      // setSaveDialogOpen(false)
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
      
      const savedDesign = await updateDesign("",updatedDesign)
      
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
// components/Editor/ToolbarPanel.tsx
// import { useState } from 'react'
// import { useDesignStore } from '@/lib/Store'
// import { generateId } from '@/lib/utils'

// const Toolbar = () => {
//   const { addElement } = useDesignStore()
//   const [activeTab, setActiveTab] = useState('elements')
  
//   // Add text element to canvas
//   const handleAddText = () => {
//     addElement({
//       id: generateId(),
//       type: 'text',
//       position: { x: 100, y: 100 },
//       zIndex: 10,
//       data: {
//         text: 'Double click to edit text',
//         fontSize: 24,
//         fontFamily: 'Arial',
//         color: '#000000',
//         fontWeight: 'normal',
//         fontStyle: 'normal',
//         textAlign: 'left',
//         width: 250,
//         height: 50
//       }
//     })
//   }
  
//   // Add image element to canvas
//   const handleAddImage = () => {
//     // In a real app, you would show an image picker/upload dialog
//     // For now, we'll add a placeholder image
//     addElement({
//       id: generateId(),
//       type: 'image',
//       position: { x: 100, y: 100 },
//       zIndex: 5,
//       data: {
//         src: 'https://via.placeholder.com/300x200',
//         alt: 'Placeholder image',
//         width: 300,
//         height: 200
//       }
//     })
//   }
  
//   // Add shape element to canvas
//   const handleAddShape = (shapeType: string) => {
//     addElement({
//       id: generateId(),
//       type: 'shape',
//       position: { x: 100, y: 100 },
//       zIndex: 1,
//       data: {
//         shapeType,
//         width: 150,
//         height: 150,
//         backgroundColor: '#4CAF50',
//         borderRadius: shapeType === 'rectangle' ? 8 : 0,
//         borderWidth: 0,
//         borderColor: '#000000'
//       }
//     })
//   }
  
//   // Render tabs based on active tab
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'elements':
//         return (
//           <div className="flex flex-col items-center space-y-4 py-4">
//             <button
//               onClick={handleAddText}
//               className="tool-button w-12 h-12 flex items-center justify-center rounded hover:bg-gray-100"
//               title="Add Text"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
//               </svg>
//             </button>
            
//             <button
//               onClick={handleAddImage}
//               className="tool-button w-12 h-12 flex items-center justify-center rounded hover:bg-gray-100"
//               title="Add Image"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="3" y="3" width="18" height="18" rx="2"/>
//                 <circle cx="8.5" cy="8.5" r="1.5"/>
//                 <path d="M21 15l-5-5L5 21"/>
//               </svg>
//             </button>
            
//             <button
//               onClick={() => handleAddShape('rectangle')}
//               className="tool-button w-12 h-12 flex items-center justify-center rounded hover:bg-gray-100"
//               title="Add Rectangle"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="3" y="3" width="18" height="18" rx="2"/>
//               </svg>
//             </button>
            
//             <button
//               onClick={() => handleAddShape('circle')}
//               className="tool-button w-12 h-12 flex items-center justify-center rounded hover:bg-gray-100"
//               title="Add Circle"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="12" cy="12" r="10"/>
//               </svg>
//             </button>
            
//             <button
//               onClick={() => handleAddShape('triangle')}
//               className="tool-button w-12 h-12 flex items-center justify-center rounded hover:bg-gray-100"
//               title="Add Triangle"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M3 20h18L12 4z"/>
//               </svg>
//             </button>
//           </div>
//         )
//       case 'templates':
//         return (
//           <div className="p-4">
//             <p className="text-center text-sm text-gray-500">
//               Templates panel (coming soon)
//             </p>
//           </div>
//         )
//       default:
//         return null
//     }
//   }
  
//   return (
//     <div className="h-full flex flex-col">
//       {/* Tab navigation */}
//       <div className="flex border-b">
//         <button
//           className={`flex-1 py-2 text-xs font-medium ${activeTab === 'elements' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('elements')}
//         >
//           Elements
//         </button>
//         <button
//           className={`flex-1 py-2 text-xs font-medium ${activeTab === 'templates' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
//           onClick={() => setActiveTab('templates')}
//         >
//           Templates
//         </button>
//       </div>
      
//       {/* Tab content */}
//       <div className="flex-1 overflow-y-auto">
//         {renderTabContent()}
//       </div>
//     </div>
//   )
// }

// export default Toolbar;