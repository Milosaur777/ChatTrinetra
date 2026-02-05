# 🎛️ Command Palette - User Guide & API Documentation

## Overview

The Command Palette is a global search interface that allows you to quickly search and navigate to projects and files from anywhere in the application. It's inspired by VS Code's Command Palette and GitHub's search pattern.

---

## ⌨️ Keyboard Shortcuts

### Opening the Palette
- **Mac:** `Cmd + K`
- **Windows/Linux:** `Ctrl + K`
- **Mouse:** Click the 🔍 search icon in the Sidebar header

### Navigation
- **↑ / ↓** - Navigate up/down through results
- **⏎ Enter** - Select the highlighted result
- **Esc** - Close the palette

---

## 🎯 Usage Examples

### Search for a Project
1. Press `Cmd+K` (or `Ctrl+K`)
2. Type project name (e.g., "test", "lekt")
3. Press ↓ to highlight a project
4. Press ⏎ to open it

### Search for a File
1. Press `Cmd+K`
2. Type filename (e.g., "main", "config")
3. Results will show both projects and files
4. Navigate to a file and press ⏎

### Fuzzy Search
The search supports fuzzy matching with typo tolerance:
- `tst` matches "test"
- `lkp` matches "lektionsplaneringar"
- `ml` matches "mail"

---

## 🏗️ Architecture

### Components

#### CommandPaletteContext
Global state management for the palette.

**Location:** `frontend/src/contexts/CommandPaletteContext.jsx`

**State:**
```javascript
{
  isOpen: boolean,              // Palette visibility
  searchQuery: string,          // Current search input
  results: {
    projects: [],              // Search results (projects)
    files: []                  // Search results (files)
  },
  selectedIndex: number,        // Currently highlighted result
  selectedResult: {
    type: 'project' | 'file',
    data: object
  }
}
```

**Hooks:**
```javascript
import { useCommandPalette } from '@/contexts/CommandPaletteContext'

const {
  isOpen,
  searchQuery,
  results,
  selectedIndex,
  selectedResult,
  openPalette,
  closePalette,
  setQuery,
  setResults,
  selectProject,
  selectFile,
  resetState
} = useCommandPalette()
```

#### CommandPalette Component
The modal UI for search and results display.

**Location:** `frontend/src/components/CommandPalette.jsx`

**Props:**
```typescript
interface CommandPaletteProps {
  projects: Project[]    // Array of projects to search
  files: File[]         // Array of files to search
}
```

**Features:**
- Framer Motion animations
- Grouped results (Projects/Files)
- Match score display
- Keyboard navigation
- "No results" state
- Responsive design

#### useCommandPaletteShortcut Hook
Keyboard shortcut listener for Cmd+K / Ctrl+K.

**Location:** `frontend/src/hooks/useCommandPaletteShortcut.js`

**Usage:**
```javascript
import { useCommandPaletteShortcut } from '@/hooks/useCommandPaletteShortcut'

export function MyComponent() {
  // Automatically listens for Cmd+K / Ctrl+K
  useCommandPaletteShortcut()
  
  return <div>...</div>
}
```

**Behavior:**
- Opens palette when shortcut is pressed
- Closes palette if already open
- Ignores shortcut in text input fields (unless palette is open)
- Works globally across the entire app

---

## 🔧 Integration Guide

### Step 1: Wrap App with Provider
```jsx
import { CommandPaletteProvider } from '@/contexts/CommandPaletteContext'
import { useCommandPaletteShortcut } from '@/hooks/useCommandPaletteShortcut'

function AppContent() {
  // Enable keyboard shortcuts
  useCommandPaletteShortcut()
  
  return (
    <div>
      <Sidebar />
      <MainContent />
      <CommandPalette projects={projects} files={files} />
    </div>
  )
}

export default function App() {
  return (
    <CommandPaletteProvider>
      <AppContent />
    </CommandPaletteProvider>
  )
}
```

### Step 2: Update Sidebar (Optional)
Add search icon button to trigger palette:
```jsx
import { useCommandPalette } from '@/contexts/CommandPaletteContext'

export function Sidebar() {
  const { openPalette } = useCommandPalette()
  
  return (
    <div>
      {/* ... */}
      <button onClick={openPalette} title="Search (Cmd+K)">
        🔍
      </button>
    </div>
  )
}
```

---

## 🎨 Styling & Theme

### Colors Used
- **Background:** `bg-cc-darker`
- **Text:** `text-cc-text`
- **Borders:** `border-cc-border`
- **Accent:** `bg-cc-accent` (selected items)
- **Muted:** `text-cc-text-muted`

### Customizing Appearance

#### Change Modal Size
Edit in `CommandPalette.jsx`:
```jsx
className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl"
// Change max-w-2xl to max-w-3xl, max-w-xl, etc.
```

#### Adjust Animation Speed
Edit transition in `CommandPalette.jsx`:
```jsx
transition={{ type: 'spring', damping: 20, stiffness: 300 }}
// Lower damping = bouncier
// Higher stiffness = faster
```

#### Change Icons
Edit in `CommandPalette.jsx`:
```jsx
<span className="text-lg">📁</span>  // Project icon
<span className="text-lg">📄</span>  // File icon
```

---

## 🔍 Search Engine Integration

The Command Palette uses the existing `searchEngine` service for fuzzy search.

**File:** `frontend/src/services/searchEngine.js`

### How Search Works

1. **Initialization:**
   - Projects indexed on mount
   - Files indexed on mount
   - Uses Fuse.js for fuzzy matching

2. **Search Process:**
   - User types query
   - Query must be ≥2 characters
   - Fuse.js performs fuzzy search
   - Results grouped by type (Projects/Files)
   - Results sorted by match score

3. **Scoring:**
   - 0.0 = Perfect match
   - 1.0 = No match
   - Displayed as: `100 - (score * 100)`
   - Example: score 0.1 → "90%" match

---

## 📊 Performance Considerations

### Optimization Tips

1. **Result Limiting:** Currently shows all results (consider capping at 50)
2. **Debouncing:** Search runs on every keystroke (consider 100ms debounce)
3. **Virtualization:** Use react-window for 1000+ items

### Example: Add Debounce

```javascript
import { useMemo } from 'react'

function CommandPalette({ projects, files }) {
  const [query, setQuery] = useState('')
  
  // Debounce search with useMemo
  const results = useMemo(() => {
    if (query.trim().length < 2) return { projects: [], files: [] }
    
    const timer = setTimeout(() => {
      return searchEngine.searchAll(query)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [query])
  
  // ...
}
```

---

## 🐛 Troubleshooting

### Palette doesn't open with Cmd+K
- Ensure `useCommandPaletteShortcut()` is called in your component
- Check browser console for errors
- Verify `CommandPaletteProvider` wraps the app

### Shortcuts don't work in input fields
- This is intentional! Users often want to type normally in inputs
- To force it to work in inputs, modify `useCommandPaletteShortcut.js`

### No search results
- Verify projects/files data is passed to `<CommandPalette>`
- Check that `searchEngine.initializeProjects()` was called
- Ensure search query is ≥2 characters

### Results appear highlighted but don't select
- Make sure `selectProject()` and `selectFile()` handlers are implemented
- Check that navigation is wired correctly in parent component

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Recent searches history
- [ ] Search analytics/tracking
- [ ] Custom keyboard shortcut override
- [ ] Global file content search
- [ ] Action commands (e.g., "Create new project")
- [ ] Keyboard shortcut help overlay
- [ ] Mobile/touch support

### Example: Recent Searches

```javascript
// Add to searchEngine service
getRecentSearches() {
  return JSON.parse(localStorage.getItem('recentSearches') || '[]')
}

addRecentSearch(query) {
  const recent = this.getRecentSearches()
  const filtered = recent.filter(q => q !== query)
  localStorage.setItem('recentSearches', JSON.stringify([query, ...filtered].slice(0, 5)))
}
```

---

## 📚 Code Examples

### Using in a Component

```jsx
import { useCommandPalette } from '@/contexts/CommandPaletteContext'

export function MyComponent() {
  const { isOpen, openPalette, closePalette, searchQuery } = useCommandPalette()
  
  return (
    <div>
      <button onClick={openPalette}>
        Open Search
      </button>
      
      {isOpen && (
        <div>
          <p>Searching for: {searchQuery}</p>
        </div>
      )}
    </div>
  )
}
```

### Custom Search Button

```jsx
export function CustomSearchButton() {
  const { openPalette } = useCommandPalette()
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      onClick={openPalette}
      className="px-4 py-2 bg-cc-accent rounded-lg text-cc-dark"
    >
      Search Projects (Cmd+K)
    </motion.button>
  )
}
```

---

## 🔗 Related Files

- **Main Component:** `frontend/src/components/CommandPalette.jsx`
- **Context:** `frontend/src/contexts/CommandPaletteContext.jsx`
- **Hook:** `frontend/src/hooks/useCommandPaletteShortcut.js`
- **Search Service:** `frontend/src/services/searchEngine.js`
- **Sidebar Integration:** `frontend/src/components/Sidebar.jsx`
- **App Setup:** `frontend/src/App.jsx`

---

## 📋 Checklist for Implementation

- ✅ CommandPaletteContext created
- ✅ CommandPalette component created
- ✅ useCommandPaletteShortcut hook created
- ✅ Sidebar updated (SearchBar removed, icon added)
- ✅ App.jsx wrapped with provider
- ✅ Build successful (no errors)
- ✅ Keyboard shortcuts working
- ✅ Search results displaying
- ✅ Navigation working
- ✅ Animations smooth
- ✅ Theme colors applied

---

*Built with ❤️ for ChatTrinetra by Captain Claw* 🏴‍☠️
