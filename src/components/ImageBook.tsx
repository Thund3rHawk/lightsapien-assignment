import { useState, useCallback, useEffect } from 'react'

interface props {
    images: any[]
}

const ImageBook: React.FC<props> = ({ images }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = images.length   

  const navigatePage = useCallback((direction: 'left' | 'right') => {
    setCurrentPage((prevPage) => {
      if (direction === 'left') {
        return prevPage > 0 ? prevPage - 1 : prevPage
      } else {
        return prevPage < totalPages - 1 ? prevPage + 1 : prevPage
      }
    })
  }, [images])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      navigatePage('left')
    } else if (event.key === 'ArrowRight') {
      navigatePage('right')
    }
  }, [navigatePage])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4 h-[88vh]">
      <div className="relative w-full max-w-2xl aspect-[3/4] bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={`${images[currentPage + 1].image.file}`}
          alt={`Page ${currentPage + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigatePage('left')}
          className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-start p-4 text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Previous page"
        >
        </button>
        <button
          onClick={() => navigatePage('right')}
          className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-end p-4 text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Next page"
        >
        </button>
      </div>
      <div className="mt-4 ">
        {currentPage + 1}/{totalPages}
      </div>
    </div>
  )
}

export default ImageBook