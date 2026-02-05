# 🎛️ Command Palette Refactoring Plan

**Status:** 🔄 Planning Phase  
**Date:** 2026-02-05  
**Version:** 1.0

---

## 🎯 Problem Statement

**Current Issue:**
- SearchBar embedded in Sidebar takes up significant vertical space
- Overlaps UI elements and clutters the interface
- Blocks other important sidebar content
- Not accessible from all parts of the app

**Solution:**
Convert to a **Command Palette** pattern (like VS Code Cmd+K, GitHub Cmd+K)
- Global keyboard shortcut to trigger anywhere
- Modal/popover overlay that doesn't impact layout
- Seamless search experience across entire app
- Cleaner, more professional feel

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────┐
│       App.jsx (Root)                │
│  ┌─────────────────────────────────┐│
│  │ CommandPaletteProvider (Context)││
│  │                                 ││
│  ├─ isOpen: boolean                ││
│  ├─ searchQuery: string            ││
│  ├─ results: {projects, files}     ││
│  └─ handlers (open, close, search) ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ <Sidebar /> (no SearchBar)       ││
│  │ • Projects list                 ││
│  │ • File browser                  ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ <MainContent />                 ││
│  │ • Chat interface                ││
│  │ • File editor                   ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ <CommandPalette /> (Modal)       ││
│  │ • Keyboard shortcut listener    ││
│  │ • Overlay backdrop              ││
│  │ • Search input                  ││
│  │ • Results (Projects/Files)      ││
│  │ • Keyboard navigation (↑↓, ⏎)  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 🔧 Components to Build/Modify

### 1. **CommandPaletteContext** (NEW)
**File:** `frontend/src/contexts/CommandPaletteContext.jsx`

**Provides:**
- `isOpen: boolean` - Modal visibility state
- `searchQuery: string` - Current search input
- `results: {projects: [], files: []}` - Search results
- `openPalette()` - Open the palette
- `closePalette()` - Close the palette
- `setQuery(query)` - Update search query
- `selectProject(project)` - Handle project selection
- `selectFile(file)` - Handle file selection

**Usage:**
```javascript
const { isOpen, openPalette } = useCommandPalette()
```

---

### 2. **CommandPalette Component** (NEW)
**File:** `frontend/src/components/CommandPalette.jsx`

**Features:**
- ✅ Modal overlay with backdrop
- ✅ Search input (always focused when open)
- ✅ Results grouped: "Projects" and "Files"
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Result previews (icon, name, description/type)
- ✅ Smooth animations (Framer Motion)
- ✅ Match highlighting/scoring
- ✅ "No results" message
- ✅ Keyboard shortcut hints (Cmd+K / Ctrl+K)

**Layout:**
```
┌─────────────────────────────────┐
│  🔍 Search projects or files... │
├─────────────────────────────────┤
│                                 │
│  PROJECTS (3)                   │
│  ✓ Test Project                 │
│  ✓ Lektionsplaneringar          │
│  ✓ Skriva Mail                  │
│                                 │
│  FILES (0)                      │
│  (no matches)                   │
│                                 │
│  Cmd+K to close                 │
└─────────────────────────────────┘
```

---

### 3. **Keyboard Shortcut Handler** (NEW)
**File:** `frontend/src/hooks/useCommandPaletteShortcut.js`

**Handles:**
- `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) → Open palette
- `Escape` → Close palette
- `ArrowUp/Down` → Navigate results
- `Enter` → Select result
- `Backspace` → Clear search or close

**Notes:**
- Should NOT trigger on input fields (unless special handling)
- Respects user preferences if they override shortcuts
- Global listener attached at App root

---

### 4. **searchEngine Service** (MODIFY)
**File:** `frontend/src/services/searchEngine.js`

**Changes:**
- Already supports `searchAll(query)` ✅
- Add `searchWithCategory()` to return `{projects, files}` with counts
- Add `getRecentSearches()` for future enhancement (optional)
- Add `getSearchStats()` for analytics (future)

**No breaking changes** - existing API stays the same.

---

### 5. **Sidebar Component** (MODIFY)
**File:** `frontend/src/components/Sidebar.jsx`

**Changes:**
- ❌ Remove the embedded SearchBar component
- ❌ Remove the search input UI
- ✅ Add **small magnifying glass icon button** (Linear.app style)
  - Position: Top right of Sidebar header (near + New Project)
  - Icon: Clean, minimal 🔍 (16-20px)
  - Hover: Subtle background highlight
  - Click: Opens Command Palette
- ✅ Tooltip on hover: "Search (Cmd+K)" or "Search (Ctrl+K)"

**Icon Placement:**
```
┌─────────────────────────┐
│ 🏴☠️ CaptainClaw    🔍  │  ← Search icon (small, top right)
│ AI Projects              │
├─────────────────────────┤
│ + New Project            │
│ ├─ Project 1             │
│ ├─ Project 2             │
│ └─ Project 3             │
```

**Result:** Sidebar 20-30% smaller, search discoverable via button + keyboard shortcut

---

### 6. **App Component** (MODIFY)
**File:** `frontend/src/App.jsx`

**Changes:**
- Wrap with `<CommandPaletteProvider>`
- Add `<CommandPalette />` component at root
- Pass projects/files data to context
- Ensure shortcuts don't conflict with other handlers

---

## 🎨 Styling & UX Details

**Palette Style:**
- Centered, slightly off-screen modal (like GitHub/VS Code)
- Dark overlay backdrop (semi-transparent)
- Rounded corners, subtle shadow
- Fixed width (400-600px) for readability
- Max height with scroll for long result lists

**Color Scheme:**
- Match existing theme (cc-darker, cc-accent, cc-border)
- Highlight selected result with cc-accent color
- Match scores shown (0-100% opacity or visual indicator)

**Animations:**
- Framer Motion for smooth enter/exit
- Quick scale + fade animation
- Results list slides in smoothly
- Input focus animation

---

## 📋 File Structure After Changes

```
frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx (MODIFIED - remove SearchBar)
│   │   ├── CommandPalette.jsx (NEW)
│   │   └── SearchBar.jsx (DEPRECATED - kept for reference)
│   │
│   ├── contexts/
│   │   └── CommandPaletteContext.jsx (NEW)
│   │
│   ├── hooks/
│   │   ├── useCommandPaletteShortcut.js (NEW)
│   │   └── ... (existing)
│   │
│   ├── services/
│   │   └── searchEngine.js (MODIFIED - minor enhancements)
│   │
│   └── App.jsx (MODIFIED - add provider + palette)
```

---

## 🔄 Implementation Phases

### Phase 1: Foundation (1 task)
- [ ] Create CommandPaletteContext with state management
- [ ] Build basic CommandPalette modal component
- [ ] Add useCommandPaletteShortcut hook

### Phase 2: Features (2 tasks)
- [ ] Integrate searchEngine service into palette
- [ ] Add keyboard navigation (arrows, enter, escape)
- [ ] Implement result grouping and display

### Phase 3: Polish (1 task)
- [ ] Add animations (Framer Motion)
- [ ] Style to match theme perfectly
- [ ] Add no-results state and loading states

### Phase 4: Integration (1 task)
- [ ] Remove SearchBar from Sidebar
- [ ] Wrap App with CommandPaletteProvider
- [ ] Add CommandPalette to App root
- [ ] Test all shortcuts and edge cases

### Phase 5: Documentation (1 task)
- [ ] Update README with keyboard shortcuts
- [ ] Document CommandPalette API
- [ ] Add usage examples

---

## 🎯 Acceptance Criteria

**Must Have:**
- ✅ Cmd+K / Ctrl+K opens palette from anywhere
- ✅ **Small magnifying glass icon in Sidebar (Linear.app style)**
- ✅ Icon click opens Command Palette
- ✅ Icon has tooltip "Search (Cmd+K)" / "Search (Ctrl+K)"
- ✅ Escape closes palette
- ✅ Arrow keys navigate results
- ✅ Enter selects project/file
- ✅ Search works (fuzzy matching via Fuse.js)
- ✅ Results grouped by type
- ✅ No overlap with existing UI
- ✅ Clean, professional appearance

**Nice to Have:**
- ⚪ Recent searches history
- ⚪ Search analytics
- ⚪ Custom keyboard shortcut override
- ⚪ Global file search (not just current project)
- ⚪ Action commands (e.g., "Create new project")

---

## 🔄 Migration Path

**Step 1:** Sidebar with both old SearchBar and keyboard hint
**Step 2:** SearchBar hidden, palette primary search method
**Step 3:** SearchBar removed completely (old code archived)

**Zero downtime** - can work on this while app is live.

---

## 📊 Expected Improvements

| Metric | Before | After |
|--------|--------|-------|
| **Sidebar Height** | ~150px | ~100px (33% smaller) |
| **Accessible From** | Sidebar only | Anywhere in app |
| **Keyboard Shortcuts** | None | Cmd+K to search |
| **Visual Clutter** | High | Low |
| **UX Pattern** | Custom | Industry standard |

---

## 🚀 Estimated Effort

| Phase | Tasks | Est. Time | Complexity |
|-------|-------|-----------|------------|
| Phase 1 | 3 | 30 min | Low |
| Phase 2 | 3 | 45 min | Medium |
| Phase 3 | 3 | 30 min | Low |
| Phase 4 | 4 | 30 min | Medium |
| Phase 5 | 2 | 15 min | Low |
| **TOTAL** | **15** | **2.5 hrs** | **Medium** |

---

## 🔗 Related Files

- `FUZZY_SEARCH_PLAN.md` - Original fuzzy search implementation
- `FUZZY_SEARCH_IMPLEMENTED.md` - Current SearchBar details
- `frontend/src/components/SearchBar.jsx` - Code to archive
- `frontend/src/services/searchEngine.js` - Core search logic

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Keyboard shortcuts conflict | High | Test vs other shortcuts first |
| Mobile/touch unfriendly | Medium | Add UI button fallback for mobile |
| Accessibility issues | High | Test with screen readers, ARIA labels |
| Performance with 1000+ items | Medium | Virtualize list if needed |

---

## 🚀 Implementation Strategy

**Approach:** Serial tasks with single agent OR parallel sub-agents
- Linear.app style requires sequential integration points
- Can parallelize components if structured properly
- Recommend: **1 serial agent** for cleaner integration

**Suggested Execution Order:**
1. Build CommandPaletteContext (foundation)
2. Build CommandPalette component (modal)
3. Add useCommandPaletteShortcut hook
4. Add search icon button to Sidebar
5. Remove old SearchBar from Sidebar
6. Wire up App root with provider
7. Polish & test
8. Document

**Note:** Each task should be atomic - one commit per task for clean history.

---

## 📞 Approved Updates

✅ **Milo approved addition:**
- Small magnifying glass icon in Sidebar (Linear.app style)
- Icon acts as button to open Command Palette
- Button + Keyboard shortcut = dual-mode access

---

## ✅ Ready for Implementation

✅ Architecture approved
✅ Keyboard shortcut approved (Cmd+K)
✅ Linear.app-style icon button approved
✅ Scope clear (search only, future commands)
✅ Ready to deploy agents!

**Next Step:** Spawn serial task agent to execute all 5 phases

---

*Built by Captain Claw* 🏴‍☠️  
*Ready to ship when you say go!*
