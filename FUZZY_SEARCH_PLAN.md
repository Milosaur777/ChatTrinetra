# 🔍 Fuzzy Search Implementation Plan
## Adding Fuse.js for Project & File Search

---

## **Overview**
Implement a fuzzy search bar that allows users to quickly find:
- **Projects** by name, description, or system prompt
- **Files** within projects by filename, type, or content preview
- **Real-time filtering** with typo tolerance

Uses **Fuse.js** for fuzzy matching algorithm (tiny library, zero dependencies).

---

## **Tech Stack**
- **Fuse.js** - Lightweight fuzzy search (~8KB gzipped)
- **React Hooks** - State management
- **Framer Motion** - Smooth animations for results
- **Tailwind CSS** - Styling

---

## **Implementation Plan**

### **Phase 1: Setup & Dependencies** ⚙️

#### 1.1 Install Fuse.js
```bash
cd frontend
npm install fuse.js
```

#### 1.2 Create SearchEngine Service
**File:** `frontend/src/services/searchEngine.js`

```javascript
import Fuse from 'fuse.js'

class SearchEngine {
  constructor() {
    this.projectFuse = null
    this.fileFuse = null
  }

  // Initialize project search index
  initializeProjects(projects) {
    this.projectFuse = new Fuse(projects, {
      keys: ['name', 'description', 'system_prompt'],
      threshold: 0.4, // 0.4 = fuzzy matching (typos ok)
      minMatchCharLength: 2,
      includeScore: true,
    })
  }

  // Initialize file search index
  initializeFiles(files) {
    this.fileFuse = new Fuse(files, {
      keys: ['filename', 'file_type', 'extracted_text'],
      threshold: 0.3, // More lenient for content
      minMatchCharLength: 1,
      includeScore: true,
    })
  }

  // Search projects
  searchProjects(query) {
    if (!query || query.length < 2) return []
    return this.projectFuse.search(query)
  }

  // Search files
  searchFiles(query) {
    if (!query || query.length < 2) return []
    return this.fileFuse.search(query)
  }
}

export default new SearchEngine()
```

---

### **Phase 2: Search Component** 🎨

#### 2.1 Create SearchBar Component
**File:** `frontend/src/components/SearchBar.jsx`

Features:
- Search input with icon
- Real-time results as user types
- Dropdown results with categories (Projects / Files)
- Click to navigate/select
- Keyboard navigation (Arrow keys, Enter)
- "No results" state

```javascript
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import searchEngine from '../services/searchEngine'

export default function SearchBar({ 
  projects, 
  files, 
  onSelectProject, 
  onSelectFile 
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ projects: [], files: [] })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

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
    if (projects.length > 0) {
      searchEngine.initializeProjects(projects)
    }
  }, [projects])

  useEffect(() => {
    if (files.length > 0) {
      searchEngine.initializeFiles(files)
    }
  }, [files])

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
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < totalResults - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      // Handle selection of highlighted result
      const allResults = [
        ...results.projects.map(r => ({ ...r, type: 'project' })),
        ...results.files.map(r => ({ ...r, type: 'file' }))
      ]
      const selected = allResults[selectedIndex]
      handleSelect(selected, selected.type)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="flex items-center gap-2 px-3 py-2 bg-cc-darker border border-cc-border rounded-lg hover:border-cc-accent transition-colors">
        <span className="text-cc-accent">🔍</span>
        <input
          type="text"
          placeholder="Search projects or files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="flex-1 bg-transparent text-cc-text placeholder-cc-text-muted outline-none text-sm"
        />
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full max-w-md bg-cc-darker border border-cc-border rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            {results.projects.length === 0 && results.files.length === 0 ? (
              <div className="p-4 text-center text-cc-text-muted text-sm">
                No results found
              </div>
            ) : (
              <>
                {/* Projects Section */}
                {results.projects.length > 0 && (
                  <div className="border-b border-cc-border">
                    <div className="px-3 py-2 bg-cc-dark text-xs font-bold text-cc-accent">
                      📁 PROJECTS
                    </div>
                    {results.projects.map((result, idx) => (
                      <motion.button
                        key={result.item.id}
                        onClick={() => handleSelect(result, 'project')}
                        className={`w-full text-left px-3 py-2 transition-colors ${
                          selectedIndex === idx
                            ? 'bg-cc-accent bg-opacity-20 text-cc-accent'
                            : 'hover:bg-cc-dark'
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <div className="font-semibold text-sm">{result.item.name}</div>
                        <div className="text-xs text-cc-text-muted line-clamp-1">
                          {result.item.description}
                        </div>
                        <div className="text-xs text-cc-accent opacity-60">
                          Score: {(result.score * 100).toFixed(0)}%
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Files Section */}
                {results.files.length > 0 && (
                  <div>
                    <div className="px-3 py-2 bg-cc-dark text-xs font-bold text-cc-accent">
                      📄 FILES
                    </div>
                    {results.files.map((result, idx) => (
                      <motion.button
                        key={result.item.id}
                        onClick={() => handleSelect(result, 'file')}
                        className={`w-full text-left px-3 py-2 transition-colors ${
                          selectedIndex === results.projects.length + idx
                            ? 'bg-cc-accent bg-opacity-20 text-cc-accent'
                            : 'hover:bg-cc-dark'
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <div className="font-semibold text-sm">
                          {result.item.filename}
                        </div>
                        <div className="text-xs text-cc-text-muted">
                          {result.item.file_type} • {(result.item.file_size / 1024).toFixed(1)}KB
                        </div>
                        <div className="text-xs text-cc-accent opacity-60">
                          Score: {(result.score * 100).toFixed(0)}%
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

---

### **Phase 3: Integration** 🔗

#### 3.1 Add SearchBar to Sidebar
**File:** `frontend/src/components/Sidebar.jsx`

```javascript
// Add to imports
import SearchBar from './SearchBar'

// Add to Sidebar JSX (top of sidebar, above projects list)
<SearchBar 
  projects={projects}
  files={files}
  onSelectProject={onSelectProject}
  onSelectFile={onSelectFile}
/>
```

#### 3.2 Add to MainContent
**File:** `frontend/src/components/MainContent.jsx`

Make SearchBar available in the main area too (optional, for accessibility).

---

### **Phase 4: Advanced Features** ✨

#### 4.1 Search History (Optional)
```javascript
// Store recent searches in localStorage
const recentSearches = JSON.parse(localStorage.getItem('searches') || '[]')

// Display suggestions when input is empty
if (!query && isOpen) {
  // Show recent searches
}
```

#### 4.2 Keyboard Shortcut
```javascript
// Add to App.jsx
useEffect(() => {
  const handleKeyPress = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      searchInputRef.current?.focus()
    }
  }
  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [])
```

#### 4.3 Search Analytics
Track what users search for to improve UX.

---

## **Testing Checklist** ✅

- [ ] Fuzzy matching works with typos (e.g., "prjct" finds "project")
- [ ] File search works on filename and content
- [ ] Keyboard navigation (arrows, enter, escape)
- [ ] Results update in real-time
- [ ] Performance is smooth (even with 1000+ files)
- [ ] Mobile-friendly (dropdown doesn't overflow)
- [ ] Accessibility (keyboard-only navigation works)

---

## **Performance Considerations** 🚀

- **Fuse.js caching** - Indexes are built once, searched repeatedly (fast)
- **Debouncing** - Optional: Debounce search by 100ms for large datasets
- **Virtual scrolling** - If results exceed 100, use virtualization
- **Lazy loading** - Only index files when project is selected

---

## **File Structure**
```
frontend/src/
├── components/
│   ├── SearchBar.jsx        (NEW)
│   ├── Sidebar.jsx          (UPDATED)
│   └── MainContent.jsx      (UPDATED)
├── services/
│   ├── api.js
│   └── searchEngine.js      (NEW)
└── App.jsx
```

---

## **Dependencies**
```json
{
  "fuse.js": "^7.0.0"  // ~8KB gzipped
}
```

---

## **Timeline**
- **Phase 1 (Setup):** 10 minutes
- **Phase 2 (Component):** 30 minutes
- **Phase 3 (Integration):** 15 minutes
- **Phase 4 (Polish):** 20 minutes

**Total:** ~75 minutes for a production-ready search feature

---

## **Next Steps**
1. Install `fuse.js`
2. Create `searchEngine.js` service
3. Create `SearchBar.jsx` component
4. Integrate into Sidebar
5. Test and refine UX
6. Add keyboard shortcut (Cmd+K / Ctrl+K)
7. Deploy!

---

**Want me to build this? I can do it step-by-step or all at once!** 🏴‍☠️
