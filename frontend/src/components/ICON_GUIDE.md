# 🎨 Hero Icon Component Guide

**Component:** `Icon.jsx`  
**Package:** `@iconify/react`  
**Icon Set:** Hero Icons (heroicons.com)

---

## Quick Start

```jsx
import HeroIcon from './Icon'

<HeroIcon name="magnifying-glass" size="md" color="primary" />
```

---

## Component Props

### `name` (required)
**Type:** `string`

The Hero Icon name. Visit [heroicons.com](https://heroicons.com/) to browse all available icons.

```jsx
<HeroIcon name="document" />
<HeroIcon name="cog" />
<HeroIcon name="trash" />
```

### `size` (optional)
**Type:** `'xs' | 'sm' | 'md' | 'lg' | 'xl' | number`  
**Default:** `'md'` (24px)

Predefined sizes or custom pixel value.

```jsx
<HeroIcon name="star" size="xs" />     {/* 16px */}
<HeroIcon name="star" size="sm" />     {/* 20px */}
<HeroIcon name="star" size="md" />     {/* 24px (default) */}
<HeroIcon name="star" size="lg" />     {/* 32px */}
<HeroIcon name="star" size="xl" />     {/* 48px */}
<HeroIcon name="star" size={28} />     {/* Custom: 28px */}
```

### `variant` (optional)
**Type:** `'outline' | 'solid'`  
**Default:** `'outline'`

Icon style variant.

```jsx
<HeroIcon name="star" variant="outline" />  {/* Thin, outlined */}
<HeroIcon name="star" variant="solid" />    {/* Filled, bold */}
```

### `color` (optional)
**Type:** `'primary' | 'success' | 'error' | 'warning' | 'muted' | 'default'`  
**Default:** `'default'`

Semantic color preset based on theme.

```jsx
<HeroIcon name="check-circle" color="success" />   {/* Green */}
<HeroIcon name="x-circle" color="error" />         {/* Red */}
<HeroIcon name="alert" color="warning" />          {/* Amber */}
<HeroIcon name="cog" color="primary" />            {/* Accent color */}
<HeroIcon name="lock" color="muted" />             {/* Gray */}
<HeroIcon name="star" color="default" />           {/* Inherit */}
```

### `className` (optional)
**Type:** `string`  
**Default:** `''`

Additional Tailwind CSS classes.

```jsx
<HeroIcon name="star" className="text-yellow-500" />
<HeroIcon name="arrow-up" className="animate-bounce" />
<HeroIcon name="loader" className="animate-spin" />
<HeroIcon name="heart" className="hover:text-red-500 transition" />
```

---

## Common Usage Patterns

### 1. **Search Icon**
```jsx
<HeroIcon name="magnifying-glass" size="sm" color="primary" />
```

### 2. **Success Feedback**
```jsx
<HeroIcon name="check-circle" size="md" color="success" />
```

### 3. **Error Alert**
```jsx
<HeroIcon name="x-circle" size="md" color="error" />
```

### 4. **Loading Spinner**
```jsx
<HeroIcon name="arrow-path" size="md" className="animate-spin" />
```

### 5. **Button with Icon**
```jsx
<button className="flex items-center gap-2 px-4 py-2">
  <HeroIcon name="plus" size="sm" />
  Add Item
</button>
```

### 6. **Icon in Text**
```jsx
<span className="flex items-center gap-1">
  <HeroIcon name="check" size="xs" color="success" />
  Complete
</span>
```

### 7. **Header Icon**
```jsx
<div className="flex items-center gap-3">
  <HeroIcon name="document" size="lg" color="primary" />
  <h2>Documents</h2>
</div>
```

---

## Color Reference

| Color | Tailwind Class | Use Case |
|-------|----------------|----------|
| `primary` | `text-cc-accent` | Brand, important actions |
| `success` | `text-green-500` | Confirmations, success states |
| `error` | `text-red-500` | Errors, destructive actions |
| `warning` | `text-amber-500` | Warnings, caution |
| `muted` | `text-gray-400` | Disabled, secondary |
| `default` | `text-current` | Inherit current color |

---

## Size Reference

| Size | Pixels | Use Case |
|------|--------|----------|
| `xs` | 16px | Inline with text, badges |
| `sm` | 20px | Small buttons, labels |
| `md` | 24px | Standard UI (default) |
| `lg` | 32px | Headers, highlighted items |
| `xl` | 48px | Large actions, empty states |

---

## Animation Examples

### Spin (Loading)
```jsx
<HeroIcon name="arrow-path" className="animate-spin" />
```

### Bounce
```jsx
<HeroIcon name="arrow-down" className="animate-bounce" />
```

### Pulse
```jsx
<HeroIcon name="bell" className="animate-pulse" />
```

### Custom Transition
```jsx
<HeroIcon 
  name="chevron-right" 
  className="transition-transform group-hover:translate-x-1" 
/>
```

---

## Integration Examples

### In a Form Input
```jsx
<div className="flex items-center gap-2 px-4 py-2 border rounded">
  <HeroIcon name="magnifying-glass" size="sm" color="primary" />
  <input type="text" placeholder="Search..." />
</div>
```

### In a Navigation Item
```jsx
<button className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded">
  <HeroIcon name="home" size="md" />
  <span>Dashboard</span>
</button>
```

### In a Status Badge
```jsx
<div className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full">
  <HeroIcon name="check-circle" size="xs" color="success" />
  <span className="text-sm text-green-700">Active</span>
</div>
```

### In an Empty State
```jsx
<div className="text-center py-12">
  <HeroIcon name="inbox" size="xl" color="muted" className="mx-auto mb-4" />
  <h3 className="text-lg font-semibold">No items yet</h3>
</div>
```

---

## TypeScript Support

The Icon component is fully compatible with TypeScript:

```typescript
import HeroIcon from './Icon'
import type { ReactNode } from 'react'

interface MyComponentProps {
  icon: string
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label: string
}

export default function MyComponent({ 
  icon, 
  iconSize = 'md', 
  label 
}: MyComponentProps) {
  return (
    <div className="flex items-center gap-2">
      <HeroIcon name={icon} size={iconSize} />
      <span>{label}</span>
    </div>
  )
}
```

---

## Available Icons

Hero Icons includes 300+ icons organized by category:

### Navigation
- `arrow-left`, `arrow-right`, `chevron-left`, `chevron-right`
- `home`, `list-bullet`, `bars-3`

### Search & Filter
- `magnifying-glass`, `x-mark`, `funnel`, `slider-horizontal`

### Communication
- `chat-bubble-left`, `chat-bubble-left-right`, `envelope`, `paper-airplane`
- `bell`, `exclamation-circle`, `check-circle`

### Files & Documents
- `document`, `document-text`, `folder`, `folder-plus`
- `arrow-down-tray`, `arrow-up-tray`, `trash`

### UI Controls
- `cog`, `pencil-square`, `eye`, `eye-slash`
- `lock-closed`, `unlock`, `key`

### Other
- `star`, `heart`, `plus`, `minus`, `ellipsis-horizontal`
- `globe-alt`, `calendar`, `clock`, `user`

**Browse all:** https://heroicons.com/

---

## Best Practices

1. **Use Semantic Sizing**
   - `sm` for buttons, labels
   - `md` for standard UI (default)
   - `lg` for headers, highlights

2. **Use Semantic Colors**
   - `primary` for brand/important
   - `success` for confirmations
   - `error` for destructive actions
   - `warning` for cautions

3. **Maintain Consistency**
   - Use the same icon for the same action throughout the app
   - Keep size consistent within context

4. **Improve Accessibility**
   - Add `title` attribute to icon buttons
   - Use `aria-label` for icon-only buttons
   - Pair icons with text when possible

5. **Animation Restraint**
   - Use `animate-spin` only for loading states
   - Avoid excessive animations that distract

---

## Troubleshooting

### Icon not showing?
- Check the icon name exists at heroicons.com
- Ensure variant is 'outline' or 'solid'
- Check console for errors

### Icon too large/small?
- Use size prop instead of custom CSS
- Predefined sizes ensure consistency

### Wrong color?
- Verify color prop value
- Check Tailwind color availability
- Use `className` for custom colors

### Performance issues?
- Icons are loaded via Iconify CDN (cached)
- No performance impact expected
- Minimize custom className complexity

---

## Resources

- **Hero Icons:** https://heroicons.com/
- **Iconify:** https://iconify.design/
- **Tailwind CSS:** https://tailwindcss.com/
- **Component Code:** `Icon.jsx`

---

*Happy icon-ifying! 🎨*
