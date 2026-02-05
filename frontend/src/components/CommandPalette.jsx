import { useState, useEffect, useRef } from 'react'
import { useCommandPalette } from '../contexts/CommandPaletteContext'
import searchEngine from '../services/searchEngine'
import HeroIcon from './Icon'

/**
 * CommandPalette Component
 * Modal search interface with keyboard shortcuts and fuzzy search
 * Displays results grouped by Projects and Files
 * Features:
 * - Fuzzy search with Fuse.js
 * - Keyboard navigation (↑↓ arrows, Enter, Escape)
 * - Results grouped by type (Projects/Files)
 * - Real-time search results
 */
export default function CommandPalette({ projects, files }) {
  const {
    isOpen,
    searchQuery,
    results,
    closePalette,
    setQuery,
    setResults,
    selectProject,
    selectFile,
  } = useCommandPalette()

  const [allResults, setAllResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)

  // Flatten results into a single array for navigation
  useEffect(() => {
    const flat = [
      ...results.projects.map((r) => ({
        type: 'project',
        item: r.item,
        score: r.score,
      })),
      ...results.files.map((r) => ({
        type: 'file',
        item: r.item,
        score: r.score,
      })),
    ]
    setAllResults(flat)
  }, [results])

  // Focus input when palette opens and reset selection
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [isOpen])

  // Initialize search engine on mount
  useEffect(() => {
    if (projects && projects.length > 0) {
      searchEngine.initializeProjects(projects)
    }
    if (files && files.length > 0) {
      searchEngine.initializeFiles(files)
    }
  }, [projects, files])

  // Handle search query change
  const handleQueryChange = (e) => {
    const query = e.target.value
    setQuery(query)

    if (query.trim().length >= 2) {
      const searchResults = searchEngine.searchAll(query)
      setResults(searchResults)
    } else {
      setResults({ projects: [], files: [] })
    }
    setSelectedIndex(0)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closePalette()
        break

      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < allResults.length - 1 ? prev + 1 : prev
        )
        break

      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break

      case 'Enter':
        e.preventDefault()
        if (allResults.length > 0 && selectedIndex < allResults.length) {
          const result = allResults[selectedIndex]
          if (result.type === 'project') {
            selectProject(result.item)
          } else {
            selectFile(result.item)
          }
          closePalette()
        }
        break

      default:
        break
    }
  }

  // Result item component
  const ResultItem = ({ result, isSelected, index }) => {
    const { type, item } = result
    const isProject = type === 'project'

    return (
      <div
        onClick={() => {
          if (isProject) {
            selectProject(item)
          } else {
            selectFile(item)
          }
          closePalette()
        }}
        className={`p-3 cursor-pointer rounded-lg ${
          isSelected
            ? 'bg-cc-accent bg-opacity-20 border border-cc-accent'
            : 'border border-transparent hover:bg-cc-accent hover:bg-opacity-10'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <HeroIcon 
              name={isProject ? 'folder' : 'document'} 
              size="md" 
              color="primary" 
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-cc-text truncate">
              {isProject ? item.name : item.filename}
            </h3>
            <p className="text-xs text-cc-text-muted truncate">
              {isProject
                ? item.description || 'No description'
                : item.file_type || 'Unknown type'}
            </p>
          </div>

          {/* Score */}
          <div className={`text-xs flex-shrink-0 ${isSelected ? 'text-cc-text-muted' : 'text-cc-text-muted opacity-60'}`}>
            {Math.round((1 - result.score) * 100)}%
          </div>
        </div>
      </div>
    )
  }

  // Group results by type
  const groupedResults = {
    projects: results.projects,
    files: results.files,
  }

  const hasResults = allResults.length > 0

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closePalette}
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
          />

          {/* Modal */}
          <div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl"
          >
            <div className="mx-4 rounded-xl border border-cc-border bg-cc-darker shadow-2xl overflow-hidden hover:border-cc-accent hover:border-opacity-50 transition-all duration-200">
              {/* Input */}
              <div className="p-4 border-b border-cc-border bg-cc-dark bg-opacity-50">
                <div className="flex items-center gap-2">
                  <HeroIcon name="magnifying-glass" size="md" color="muted" className="opacity-60" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search projects or files..."
                    value={searchQuery}
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-cc-text placeholder-cc-text-muted text-lg outline-none"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto bg-cc-dark" ref={resultsRef}>
                {hasResults ? (
                  <div
                    className="p-4 space-y-6"
                  >
                    {/* Projects Group */}
                    {groupedResults.projects.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-cc-text-muted uppercase mb-2">
                          Projects ({groupedResults.projects.length})
                        </h4>
                        <div className="space-y-2">
                          {groupedResults.projects.map((result, idx) => (
                            <ResultItem
                              key={`project-${result.item.id}`}
                              result={{
                                type: 'project',
                                item: result.item,
                                score: result.score,
                              }}
                              isSelected={selectedIndex === idx}
                              index={idx}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Files Group */}
                    {groupedResults.files.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-cc-text-muted uppercase mb-2">
                          Files ({groupedResults.files.length})
                        </h4>
                        <div className="space-y-2">
                          {groupedResults.files.map((result, idx) => (
                            <ResultItem
                              key={`file-${result.item.id}`}
                              result={{
                                type: 'file',
                                item: result.item,
                                score: result.score,
                              }}
                              isSelected={
                                selectedIndex ===
                                groupedResults.projects.length + idx
                              }
                              index={groupedResults.projects.length + idx}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : searchQuery.trim().length >= 2 ? (
                  <div
                    className="p-12 text-center"
                  >
                    <p className="text-cc-text-muted">No results found</p>
                    <p className="text-xs text-cc-text-muted mt-2">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <div
                    className="p-12 text-center"
                  >
                    <p className="text-cc-text-muted">
                      Start typing to search...
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="p-3 border-t border-cc-border bg-cc-darker text-xs text-cc-text-muted flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="opacity-60">↑↓</span>
                  <span className="opacity-40">Navigate</span>
                  <span className="mx-1 opacity-40">•</span>
                  <span className="opacity-60">⏎</span>
                  <span className="opacity-40">Select</span>
                  <span className="mx-1 opacity-40">•</span>
                  <span className="opacity-60">Esc</span>
                  <span className="opacity-40">Close</span>
                </div>
                {hasResults && (
                  <div
                    className="text-right text-cc-accent"
                  >
                    {selectedIndex + 1} / {allResults.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
