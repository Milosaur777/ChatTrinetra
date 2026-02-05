# SearchEngine Service - Usage Guide

## Quick Start

### Import the Service
```javascript
import searchEngine from '@/services/searchEngine'
```

---

## Basic Usage

### 1. Initialize with Projects
```javascript
const projects = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'A leading-edge AI project',
    system_prompt: 'You are a helpful AI assistant'
  },
  // ... more projects
]

searchEngine.initializeProjects(projects)
```

### 2. Search Projects
```javascript
// Search for projects containing "alpha"
const results = searchEngine.searchProjects('alpha')

// Results format:
// [
//   {
//     item: { id: 1, name: 'Project Alpha', ... },
//     score: 0.15  // Lower score = better match
//   },
//   ...
// ]

// Access the best match
if (results.length > 0) {
  const topMatch = results[0].item
  console.log(`Found: ${topMatch.name}`)
}
```

### 3. Initialize and Search Files
```javascript
const files = [
  {
    id: 1,
    filename: 'main.js',
    file_type: 'javascript',
    extracted_text: 'function main() { ... }'
  },
  // ... more files
]

searchEngine.initializeFiles(files)

// Search files
const fileResults = searchEngine.searchFiles('main')
```

### 4. Combined Search
```javascript
const allResults = searchEngine.searchAll('project')
// Returns: { projects: [...], files: [...] }
```

---

## React Component Integration

### SearchBar Component Example
```javascript
import { useState, useEffect } from 'react'
import searchEngine from '@/services/searchEngine'

export default function SearchBar({ projects, files }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ projects: [], files: [] })

  // Initialize indexes when data loads
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

  // Search as user types
  useEffect(() => {
    if (query.length >= 2) {
      const results = searchEngine.searchAll(query)
      setResults(results)
    } else {
      setResults({ projects: [], files: [] })
    }
  }, [query])

  return (
    <div>
      <input
        type="text"
        placeholder="Search projects or files..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {/* Display results */}
      {results.projects.map(result => (
        <div key={result.item.id}>
          <h4>{result.item.name}</h4>
          <p>Score: {(result.score * 100).toFixed(0)}%</p>
        </div>
      ))}
    </div>
  )
}
```

---

## Advanced Features

### Check Service Status
```javascript
const status = searchEngine.getStatus()
// Returns: { projectsReady: true, filesReady: true }

if (status.projectsReady) {
  console.log('Projects are indexed and ready to search')
}
```

### Clear Indexes
```javascript
searchEngine.clear()
// Useful when switching projects or cleaning up
```

### Re-index with New Data
```javascript
// When projects update
const newProjects = fetchProjectsFromAPI()
searchEngine.clear()
searchEngine.initializeProjects(newProjects)
```

---

## Search Configuration

### Project Search Keys
- **name** (weight: 1.0) - Highest priority
- **description** (weight: 0.8) - Medium priority
- **system_prompt** (weight: 0.5) - Lower priority

**Threshold**: 0.4 (typo tolerance - "prjct" finds "project")
**Min length**: 2 characters

### File Search Keys
- **filename** (weight: 1.0) - Highest priority
- **file_type** (weight: 0.8) - Medium priority
- **extracted_text** (weight: 0.6) - Lower priority

**Threshold**: 0.3 (more lenient for content)
**Min length**: 1 character

---

## Performance Tips

### 1. Lazy Initialize
Only initialize file indexes when the user selects a project:

```javascript
function selectProject(projectId) {
  const files = fetchFilesForProject(projectId)
  searchEngine.clear() // Clear old files
  searchEngine.initializeFiles(files) // Index new files
}
```

### 2. Debounce Search Input
For large datasets (1000+ items), debounce the search:

```javascript
import { useEffect, useState } from 'react'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      const results = searchEngine.searchAll(debouncedQuery)
      // Update UI with results
    }
  }, [debouncedQuery])

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
```

### 3. Virtual Scrolling
For 100+ results, use virtual scrolling:

```javascript
// Use react-window or similar library
import { FixedSizeList } from 'react-window'

const results = searchEngine.searchAll(query)
const allResults = [...results.projects, ...results.files]

<FixedSizeList
  height={400}
  itemCount={allResults.length}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>
      {allResults[index].item.name}
    </div>
  )}
</FixedSizeList>
```

---

## Keyboard Navigation Example

```javascript
import { useState } from 'react'

function SearchBar() {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [results, setResults] = useState({ projects: [], files: [] })

  const handleKeyDown = (e) => {
    const totalResults = 
      results.projects.length + results.files.length

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
      // Select the highlighted result
      const allResults = [
        ...results.projects,
        ...results.files
      ]
      const selected = allResults[selectedIndex]
      handleSelectResult(selected)
    } else if (e.key === 'Escape') {
      // Close results
      setResults({ projects: [], files: [] })
    }
  }

  return (
    <input onKeyDown={handleKeyDown} />
  )
}
```

---

## Testing

Run the test suite:
```bash
cd frontend
node test-searchEngine.mjs
```

Expected output:
```
✅ Passed: 15/15
❌ Failed: 0/15
```

---

## API Reference

### `initializeProjects(projects)`
Initialize project search index
- **param** `{Array}` projects - Array of project objects
- **returns** `{void}`

### `initializeFiles(files)`
Initialize file search index
- **param** `{Array}` files - Array of file objects
- **returns** `{void}`

### `searchProjects(query)`
Search projects by query
- **param** `{string}` query - Search query (min 2 chars)
- **returns** `{Array}` Results with items and scores

### `searchFiles(query)`
Search files by query
- **param** `{string}` query - Search query (min 2 chars)
- **returns** `{Array}` Results with items and scores

### `searchAll(query)`
Combined search across projects and files
- **param** `{string}` query - Search query
- **returns** `{Object}` { projects: [...], files: [...] }

### `getStatus()`
Check if indexes are ready
- **returns** `{Object}` { projectsReady: bool, filesReady: bool }

### `clear()`
Clear all indexes
- **returns** `{void}`

---

## Common Patterns

### Auto-Complete Dropdown
```javascript
{query.length >= 2 && (
  <div className="dropdown">
    {results.projects.map(r => (
      <button key={r.item.id} onClick={() => selectProject(r.item)}>
        {r.item.name}
      </button>
    ))}
  </div>
)}
```

### Highlight Score
```javascript
<span className="score">
  Match: {Math.round((1 - result.score) * 100)}%
</span>
```

### Filter by Type
```javascript
const projectResults = results.projects.slice(0, 5)
const fileResults = results.files.slice(0, 5)
```

---

## Troubleshooting

### No results found
- Check that indexes are initialized: `searchEngine.getStatus()`
- Ensure query is at least 2 characters
- Verify data structure matches expected format

### Slow search
- Use debouncing (300ms recommended)
- Consider lazy-loading file indexes
- Implement virtual scrolling for 100+ results

### Memory issues with large datasets
- Clear unused indexes regularly
- Implement pagination
- Use lazy-loading strategy

---

## Example: Complete SearchBar Component

```javascript
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import searchEngine from '@/services/searchEngine'

export default function SearchBar({ projects, files, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ projects: [], files: [] })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)

  // Initialize on mount
  useEffect(() => {
    searchEngine.initializeProjects(projects)
    searchEngine.initializeFiles(files)
  }, [projects, files])

  // Search as user types
  useEffect(() => {
    if (query.length >= 2) {
      const res = searchEngine.searchAll(query)
      setResults(res)
      setIsOpen(true)
    } else {
      setResults({ projects: [], files: [] })
      setIsOpen(false)
    }
  }, [query])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const total = results.projects.length + results.files.length
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => (i < total - 1 ? i + 1 : i))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => (i > -1 ? i - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const allResults = [
        ...results.projects.map(r => ({ ...r, type: 'project' })),
        ...results.files.map(r => ({ ...r, type: 'file' }))
      ]
      onSelect(allResults[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 border rounded-lg"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg"
          >
            {results.projects.length === 0 && 
             results.files.length === 0 ? (
              <p className="p-4 text-gray-500">No results</p>
            ) : (
              <>
                {results.projects.map((r, i) => (
                  <button
                    key={r.item.id}
                    className={`w-full text-left p-3 ${
                      selectedIndex === i ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => onSelect({ ...r, type: 'project' })}
                  >
                    {r.item.name}
                  </button>
                ))}
                {results.files.map((r, i) => (
                  <button
                    key={r.item.id}
                    className={`w-full text-left p-3 ${
                      selectedIndex === results.projects.length + i 
                        ? 'bg-blue-100' 
                        : ''
                    }`}
                    onClick={() => onSelect({ ...r, type: 'file' })}
                  >
                    {r.item.filename}
                  </button>
                ))}
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

## Need Help?

- Check `SEARCH_ENGINE_IMPLEMENTATION.md` for architecture details
- Run tests: `node test-searchEngine.mjs`
- Review test cases in `searchEngine.test.js` for usage examples
