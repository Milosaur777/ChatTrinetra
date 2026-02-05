# 🎨 Hero Icons Refactoring Plan

**Status:** 📋 Planning Phase  
**Date:** 2026-02-05  
**Version:** 1.0

---

## 🎯 Objective

Replace all emoji icons throughout ChatTrinetra with **Hero Icons** from the Iconify package for a more professional, cohesive, and scalable icon system.

---

## 📊 Current State Analysis

**Emojis currently used in project:**

| Component | Emoji | Purpose | Hero Icon Replacement |
|-----------|-------|---------|----------------------|
| Sidebar | 🏴‍☠️ | CaptainClaw logo | `globe` or custom logo |
| Sidebar | + | New Project button | `plus` |
| Sidebar | 🔍 | Search icon | `magnifying-glass` |
| SearchBar | 🔍 | Search input | `magnifying-glass` |
| SearchBar | ✕ | Clear search | `x-mark` |
| HealthIndicator | ℹ️ | Backend info | `information-circle` |
| Chat | 📞 | Conversation | `chat-bubble-left` |
| Chat | 📄 | Files | `document` |
| Chat | ⚙️ | Settings | `cog` |
| Chat | 🌐 | Language | `globe-alt` |
| Chat | 📨 | Send message | `paper-airplane` |
| Upload | 📁 | Upload files | `folder` |
| Upload | 📤 | Choose files | `arrow-up-tray` |
| Status | ✅ | Success | `check-circle` |
| Status | ❌ | Error | `x-circle` |
| Navigation | ← | Back | `arrow-left` |
| Navigation | → | Forward | `arrow-right` |

---

## 🛠️ Implementation Strategy

### Step 1: Setup
1. **Install Iconify packages:**
   ```bash
   npm install iconify-icon @iconify/react
   ```

2. **Choose icon set:** Hero Icons (https://heroicons.com/)
   - Professional, clean design
   - 24px and 20px sizes available
   - Outline and solid variants

### Step 2: Create Icon Wrapper Component
**File:** `frontend/src/components/Icon.jsx`

```javascript
import { Icon } from '@iconify/react'

export default function HeroIcon({ 
  name, 
  size = 24, 
  variant = 'outline',
  className = '',
  ...props 
}) {
  return (
    <Icon
      icon={`heroicons-${variant}:${name}`}
      width={size}
      height={size}
      className={`text-current ${className}`}
      {...props}
    />
  )
}
```

Usage:
```jsx
<HeroIcon name="magnifying-glass" size={20} />
<HeroIcon name="plus" variant="solid" size={24} className="text-cc-accent" />
```

### Step 3: Identify All Emoji Locations

**Sidebar.jsx:**
- 🏴‍☠️ → Custom logo (keep as is or replace)
- + → `<HeroIcon name="plus" />`
- 🔍 → `<HeroIcon name="magnifying-glass" />`

**SearchBar.jsx:**
- 🔍 → `<HeroIcon name="magnifying-glass" />`
- ✕ → `<HeroIcon name="x-mark" />`

**HealthIndicator.jsx:**
- ℹ️ → `<HeroIcon name="information-circle" />`
- 🔴 (red dot) → Keep CSS-based or use icon

**MainContent.jsx / ChatWindow.jsx:**
- 📞 → `<HeroIcon name="chat-bubble-left" />`
- 📄 → `<HeroIcon name="document" />`
- ⚙️ → `<HeroIcon name="cog" />`
- 🌐 → `<HeroIcon name="globe-alt" />`
- 📨 → `<HeroIcon name="paper-airplane" />`

**FileUpload.jsx:**
- 📁 → `<HeroIcon name="folder" />`
- 📤 → `<HeroIcon name="arrow-up-tray" />`

**Status Messages:**
- ✅ → `<HeroIcon name="check-circle" className="text-green-500" />`
- ❌ → `<HeroIcon name="x-circle" className="text-red-500" />`
- ⏳ → `<HeroIcon name="arrow-path" className="animate-spin" />`

---

## 🎨 Styling Strategy

### Icon Sizing Consistency
```javascript
// Standardized sizes
const ICON_SIZES = {
  xs: 16,      // Inline, text
  sm: 20,      // Small UI elements
  md: 24,      // Standard UI
  lg: 32,      // Headers, highlighted
  xl: 48,      // Large actions
}
```

### Color Consistency
```css
/* Use theme colors */
.icon-primary { color: var(--cc-accent); }
.icon-success { color: #10b981; }  /* green */
.icon-error { color: #ef4444; }    /* red */
.icon-warning { color: #f59e0b; }  /* amber */
.icon-muted { color: var(--cc-text-muted); }
```

### Variants
- **Outline:** Default, lighter weight (20px)
- **Solid:** Bold, filled (24px)
- **Use outline for:** Navigation, subtle actions
- **Use solid for:** Important buttons, status icons

---

## 📋 Phase Breakdown

### Phase 1: Foundation
- [ ] Install Iconify packages
- [ ] Create Icon wrapper component
- [ ] Define sizing and color standards
- Commit: `feat(icons): add Iconify setup and Icon component`

### Phase 2: Sidebar & Navigation
- [ ] Replace Sidebar icons (except logo)
- [ ] Replace SearchBar icons
- [ ] Replace navigation arrows
- Commit: `refactor(sidebar): replace emojis with Hero Icons`

### Phase 3: Chat & Content
- [ ] Replace MainContent icons
- [ ] Replace ChatWindow icons
- [ ] Replace status icons
- Commit: `refactor(chat): replace emojis with Hero Icons`

### Phase 4: Auxiliary Components
- [ ] Replace HealthIndicator icons
- [ ] Replace FileUpload icons
- [ ] Replace any remaining emojis
- Commit: `refactor(components): replace remaining emojis`

### Phase 5: Polish & Testing
- [ ] Verify all icons render correctly
- [ ] Test responsive sizes
- [ ] Check color contrast
- [ ] Ensure animations work (spin, bounce, etc.)
- Commit: `test(icons): verify Hero Icons implementation`

### Phase 6: Documentation
- [ ] Update README with icon usage
- [ ] Document Icon component API
- [ ] Create icon reference guide
- Commit: `docs(icons): add Hero Icons usage guide`

---

## 🎯 Acceptance Criteria

**Must Have:**
- ✅ All emojis replaced with Hero Icons
- ✅ Consistent sizing across app
- ✅ Proper color theming
- ✅ No layout shifts or breaking changes
- ✅ Icons scale responsively
- ✅ Status/feedback icons work (animations, colors)

**Nice to Have:**
- ⚪ Custom icon library for CaptainClaw logo
- ⚪ Icon animation utilities (spin, pulse, bounce)
- ⚪ Icon tooltip support
- ⚪ Dark/light mode icon variants

---

## 📐 Icon Mapping Reference

**Common replacements:**

```javascript
const EMOJI_TO_HERO = {
  '🔍': 'magnifying-glass',
  '➕': 'plus',
  '✕': 'x-mark',
  '❌': 'x-circle',
  '✅': 'check-circle',
  '📄': 'document',
  '📁': 'folder',
  '⚙️': 'cog',
  '💬': 'chat-bubble-left',
  '📞': 'chat-bubble-left-right',
  '📨': 'paper-airplane',
  '🌐': 'globe-alt',
  '📤': 'arrow-up-tray',
  '📥': 'arrow-down-tray',
  '←': 'arrow-left',
  '→': 'arrow-right',
  '⬆️': 'arrow-up',
  '⬇️': 'arrow-down',
  'ℹ️': 'information-circle',
  '⚠️': 'exclamation-triangle',
  '⏳': 'arrow-path', // with animate-spin
  '🔔': 'bell',
  '💾': 'arrow-down-tray',
  '🗑️': 'trash',
  '✏️': 'pencil-square',
  '👁️': 'eye',
  '👁️‍🗨️': 'eye-slash',
}
```

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Breaking CSS from emoji | High | Test each component individually |
| Performance (icon loading) | Low | Iconify uses CDN + caching |
| Mobile rendering | Medium | Test on multiple sizes |
| Accessibility | High | Ensure proper ARIA labels for screen readers |

---

## 🚀 Timeline

- **Phase 1:** 10 minutes
- **Phase 2:** 15 minutes
- **Phase 3:** 20 minutes
- **Phase 4:** 15 minutes
- **Phase 5:** 10 minutes
- **Phase 6:** 10 minutes
- **Total:** ~90 minutes (1.5 hours)

---

## 📞 Questions for Milo

1. **Keep CaptainClaw logo (🏴‍☠️)?**
   - Option A: Keep emoji as brand identity
   - Option B: Replace with custom pirate-themed icon
   - Option C: Keep but style it differently

2. **Icon size preferences?**
   - Small UI: 20px or 24px?
   - Large actions: 32px or 48px?

3. **Animation preferences?**
   - Loading spinner: rotate animation?
   - Send button: pulse on hover?
   - Transitions: instant or smooth?

4. **Execution approach?**
   - Single agent (serial phases)
   - Multiple sub-agents (parallel components)

---

## ✅ Sign-off Checklist

- [ ] Milo approves icon mappings
- [ ] Milo approves sizing standards
- [ ] Milo approves styling approach
- [ ] Milo decides on CaptainClaw logo
- [ ] Ready to proceed with implementation

---

*Built by Captain Claw* 🏴‍☠️  
*Ready to make ChatTrinetra more professional and polished!*
