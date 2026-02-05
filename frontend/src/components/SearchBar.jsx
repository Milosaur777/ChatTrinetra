import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import searchEngine from '../services/searchEngine'

export default function SearchBar({ 
  projects = [], 
  files = [], 
  onSelectProject = () => {}, 
  onSelectFile = () => {} 
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ projects: [], files: [] })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Update search as user types
  useEffect(() => {
    if (query.length >= 2) {
      const projectResults = searchEngine.searchProjects(query)
      const fileResults = searchEngine.searchFiles(query)
      setResults({ 
        projects: projectResults.slice(0, 5),
        files: fileResults.slice(0, 5)
      })
      setIsOpen(true)
      setSelectedIndex(-1)
    } else {
      setResults({ projects: [], files: [] })
      setIsOpen(false)
    }
  }, [query])

  // Re-index when data changes
  useEffect(() => {
    if (projects && projects.length > 0) {
      searchEngine.initializeProjects(projects)
    }
  }, [projects])

  useEffect(() => {
    if (files && files.length > 0) {
      searchEngine.initializeFiles(files)
    }
  }, [files])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (result, type) => {
    if (type === 'project') {
      onSelectProject(result.item)
    } else if (type === 'file') {
      onSelectFile(result.item)
    }
    setQuery('')
    setIsOpen(false)
  }

  const handleKeyDown = (e) => {
    const totalResults = results.projects.length + results.files.length
    
    if (!isOpen && e.key !== 'Escape') return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIsOpen(true)
      setSelectedIndex(prev => 
        prev < totalResults - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      // Handle selection of highlighted result
      const allResults = [
        ...results.projects.map((r, idx) => ({ ...r, type: 'project', index: idx })),
        ...results.files.map((r, idx) => ({ ...r, type: 'file', index: idx }))
      ]
      const selected = allResults[selectedIndex]
      if (selected) {
        handleSelect(selected, selected.type)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      setQuery('')
      setSelectedIndex(-1)
    }
  }

  const totalResults = results.projects.length + results.files.length
  const hasResults = totalResults > 0

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Search Input */}
      <div className="flex items-center gap-3 px-4 py-3 bg-cc-darker border border-cc-border rounded-lg hover:border-cc-accent transition-colors focus-within:border-cc-accent focus-within:shadow-lg focus-within:shadow-cc-accent/10">
        <span className="text-cc-accent text-lg flex-shrink-0">🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search projects or files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="flex-1 bg-transparent text-cc-text placeholder-cc-text-muted outline-none text-sm w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              setSelectedIndex(-1)
            }}
            className="text-cc-text-muted hover:text-cc-accent transition-colors flex-shrink-0"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full mt-2 w-full bg-cc-darker border border-cc-border rounded-lg shadow-2xl shadow-black/40 z-50 max-h-96 overflow-y-auto overflow-x-hidden"
          >
            {!hasResults ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 text-center"
              >
                <div className="text-cc-text-muted text-sm mb-2">
                  No results found
                </div>
                <div className="text-xs text-cc-text-muted/60">
                  Try searching by project name, description, or file name
                </div>
              </motion.div>
            ) : (
              <>
                {/* Projects Section */}
                {results.projects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    className="border-b border-cc-border"
                  >
                    <div className="sticky top-0 px-4 py-2 bg-cc-dark bg-opacity-80 backdrop-blur-sm text-xs font-bold text-cc-accent uppercase tracking-wider">
                      📁 Projects
                    </div>
                    <div>
                      {results.projects.map((result, idx) => {
                        const isSelected = selectedIndex === idx
                        return (
                          <motion.button
                            key={`project-${result.item.id}`}
                            onClick={() => handleSelect(result, 'project')}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`w-full text-left px-4 py-3 transition-all ${
                              isSelected
                                ? 'bg-cc-accent bg-opacity-15 border-l-2 border-cc-accent text-cc-accent'
                                : 'hover:bg-cc-dark hover:bg-opacity-60 border-l-2 border-transparent'
                            }`}
                            whileHover={{ x: 4 }}
                          >
                            <div className="font-semibold text-sm leading-tight">
                              {result.item.name}
                            </div>
                            {result.item.description && (
                              <div className="text-xs text-cc-text-muted line-clamp-1 mt-0.5">
                                {result.item.description}
                              </div>
                            )}
                            <div className="text-xs text-cc-accent opacity-50 mt-1">
                              Match: {(result.score * 100).toFixed(0)}%
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Files Section */}
                {results.files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="sticky top-0 px-4 py-2 bg-cc-dark bg-opacity-80 backdrop-blur-sm text-xs font-bold text-cc-accent uppercase tracking-wider">
                      📄 Files
                    </div>
                    <div>
                      {results.files.map((result, idx) => {
                        const isSelected = selectedIndex === results.projects.length + idx
                        return (
                          <motion.button
                            key={`file-${result.item.id}`}
                            onClick={() => handleSelect(result, 'file')}
                            onMouseEnter={() => setSelectedIndex(results.projects.length + idx)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (0.1 + idx * 0.05) }}
                            className={`w-full text-left px-4 py-3 transition-all ${
                              isSelected
                                ? 'bg-cc-accent bg-opacity-15 border-l-2 border-cc-accent text-cc-accent'
                                : 'hover:bg-cc-dark hover:bg-opacity-60 border-l-2 border-transparent'
                            }`}
                            whileHover={{ x: 4 }}
                          >
                            <div className="font-semibold text-sm leading-tight">
                              {result.item.filename}
                            </div>
                            <div className="text-xs text-cc-text-muted mt-0.5">
                              {result.item.file_type} {result.item.file_size ? `• ${(result.item.file_size / 1024).toFixed(1)}KB` : ''}
                            </div>
                            <div className="text-xs text-cc-accent opacity-50 mt-1">
                              Match: {(result.score * 100).toFixed(0)}%
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Footer Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="px-4 py-2 border-t border-cc-border bg-cc-dark bg-opacity-40 text-xs text-cc-text-muted/60 flex justify-between items-center"
                >
                  <span>{totalResults} result{totalResults !== 1 ? 's' : ''} found</span>
                  <span className="flex gap-2">
                    <kbd className="px-2 py-1 bg-cc-darker rounded text-xs border border-cc-border">↑↓</kbd>
                    <kbd className="px-2 py-1 bg-cc-darker rounded text-xs border border-cc-border">⏎</kbd>
                  </span>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
