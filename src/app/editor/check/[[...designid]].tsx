// // pages/editor/[[...designId]].tsx
// import { useEffect, useState } from 'react'
// import { NextPage } from 'next'
// import { useRouter } from 'next/router'
// import dynamic from 'next/dynamic'
// import { toast } from 'react-hot-toast'
// import { useDesignStore } from '@/lib/Store'
// import PropertiesPanel from '@/components/Editor/PropertiesPanel'
// import { generateId } from '@/lib/utils'
// import Toolbar from '@/components/canvas/Toolbar'

// // Import Canvas with SSR disabled to avoid hydration issues
// const Canvas = dynamic(() => import('@/components/Canvas/Canvas'), {
//   ssr: false
// })

// const EditorPage: NextPage = () => {
//   const router = useRouter()
//   const { designId } = router.query
//   const [isLoading, setIsLoading] = useState(true)
//   const [designTitle, setDesignTitle] = useState('Untitled Design')
  
//   const {
//     design,
//     setDesign,
//     saveDesign,
//     resetDesign
//   } = useDesignStore()
  
//   // Parse designId from the router query
//   const currentDesignId = Array.isArray(designId) ? designId[0] : designId
  
//   // Initialize design or load from URL parameter
//   useEffect(() => {
//     // Reset the editor state when component mounts
//     if (!currentDesignId) {
//       resetDesign()
//       // Create a new design with default values
//       setDesign({
//         id: generateId(),
//         title: 'Untitled Design',
//         elements: [],
//         canvasSize: { width: 800, height: 600 },
//         canvasBackground: '#ffffff',
//         createdAt: new Date().toISOString(),
//         lastModified: new Date().toISOString()
//       })
//       setDesignTitle('Untitled Design')
//       setIsLoading(false)
//     }
//   }, [resetDesign, setDesign, currentDesignId])
  
//   // Update title when design changes
//   useEffect(() => {
//     if (design?.title) {
//       setDesignTitle(design.title)
//     }
//   }, [design])
  
//   // Handle title change
//   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newTitle = e.target.value
//     setDesignTitle(newTitle)
    
//     // Update design title in store
//     if (design) {
//       setDesign({
//         ...design,
//         title: newTitle
//       })
//     }
//   }
  
//   // Save design with keyboard shortcut or button click
//   const handleSaveDesign = async () => {
//     try {
//       const savedDesign = await saveDesign()
      
//       if (savedDesign) {
//         // If it's a new design, update the URL with the design ID
//         if (!currentDesignId && savedDesign.id) {
//           router.replace(`/editor/${savedDesign.id}`, undefined, { shallow: true })
//         }
        
//         toast.success('Design saved successfully')
//       }
//     } catch (error) {
//       console.error('Error saving design:', error)
//       toast.error('Failed to save design')
//     }
//   }
  
//   // Keyboard shortcuts for the editor
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Ctrl/Cmd + S to save
//       if ((e.ctrlKey || e.metaKey) && e.key === 's') {
//         e.preventDefault()
//         handleSaveDesign()
//       }
//     }
    
//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [handleSaveDesign])
  
//   // Back to designs list
//   const handleBackClick = async () => {
//     // Auto-save before navigating away
//     await handleSaveDesign()
//     router.push('/designs')
//   }
  
//   return (
//     <div className="flex flex-col h-screen">
//       {/* Editor header */}
//       <header className="bg-white border-b p-3 flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={handleBackClick}
//             className="text-gray-600 hover:text-gray-900"
//             aria-label="Back to designs"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M19 12H5M12 19l-7-7 7-7"/>
//             </svg>
//           </button>
          
//           <input
//             type="text"
//             value={designTitle}
//             onChange={handleTitleChange}
//             className="border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500 border rounded px-3 py-1"
//           />
//         </div>
        
//         <div>
//           <button
//             onClick={handleSaveDesign}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
//           >
//             Save
//           </button>
//         </div>
//       </header>
      
//       {/* Editor main content */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Left sidebar - tools */}
//         <div className="w-16 border-r bg-white">
//           <Toolbar />
//         </div>
        
//         {/* Canvas area */}
//         <div className="flex-1 overflow-auto bg-gray-100">
//           {currentDesignId ? (
//             <Canvas designId={currentDesignId} />
//           ) : (
//             <Canvas />
//           )}
//         </div>
        
//         {/* Right sidebar - properties */}
//         <div className="w-64 border-l bg-white">
//           <PropertiesPanel />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditorPage