// pages/designs/index.tsx
import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { fetchDesigns, deleteDesign } from '@/services/design-service'
import { useDesignStore } from '@/lib/Store'
import { Design } from '@/lib/types'

const DesignsPage: NextPage = () => {
  const [designs, setDesigns] = useState<Design[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { resetDesign } = useDesignStore()
  
  // Fetch all designs on component mount
  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setIsLoading(true)
        const data = await fetchDesigns()
        setDesigns(data)
      } catch (error) {
        console.error('Error fetching designs:', error)
        // toast.error('Failed to load designs')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDesigns()
  }, [])
  
  // Create a new design
  const handleCreateDesign = () => {
    resetDesign()
    router.push('/editor')
  }
  
  // Delete a design
  const handleDeleteDesign = async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (confirm('Are you sure you want to delete this design?')) {
      try {
        await deleteDesign(id)
        setDesigns(designs.filter(design => design.id !== id))
        // toast.success('Design deleted successfully')
      } catch (error) {
        console.error('Error deleting design:', error)
        // toast.error('Failed to delete design')
      }
    }
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Designs</h1>
        <button
          onClick={handleCreateDesign}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Create New Design
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : designs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designs.map(design => (
            <Link href={`/editor/${design.id}`} key={design.id}>
              <div className="design-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white">
                <div className="p-3 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg truncate">{design.title}</h3>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => handleDeleteDesign(design.id, e)}
                      aria-label="Delete design"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="aspect-video bg-gray-100 relative">
                  {design.thumbnailUrl ? (
                    <img 
                      src={design.thumbnailUrl} 
                      alt={design.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>No thumbnail</span>
                    </div>
                  )}
                </div>
                
                <div className="p-3 text-sm text-gray-500">
                  <div>{new Date(design.lastModified).toLocaleDateString()}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-4">No designs yet</h3>
          <p className="text-gray-600 mb-6">Create your first design to get started!</p>
          <button
            onClick={handleCreateDesign}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Create Design
          </button>
        </div>
      )}
    </div>
  )
}

export default DesignsPage