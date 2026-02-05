import { Icon } from '@iconify/react'

/**
 * Icon Sizing Constants
 * Standardized sizes for consistent UI
 */
export const ICON_SIZES = {
  xs: 16,      // Inline, text
  sm: 20,      // Small UI elements
  md: 24,      // Standard UI (default)
  lg: 32,      // Headers, highlighted
  xl: 48,      // Large actions
}

/**
 * Icon Color Map
 * Use theme colors and semantic color names
 */
export const ICON_COLORS = {
  primary: 'text-cc-accent',
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  muted: 'text-gray-400',
  default: 'text-current',
}

/**
 * HeroIcon Component
 * Wrapper for Iconify Hero Icons with consistent sizing and styling
 * 
 * @param {string} name - Icon name (e.g., 'magnifying-glass', 'plus', 'check-circle')
 * @param {number|string} size - Icon size: number (pixels) or 'xs'|'sm'|'md'|'lg'|'xl'
 * @param {string} variant - Icon variant: 'outline' (default) or 'solid'
 * @param {string} className - Additional Tailwind classes
 * @param {string} color - Color preset: 'primary', 'success', 'error', 'warning', 'muted', 'default'
 * @param {object} props - Additional props passed to Icon component
 */
export default function HeroIcon({
  name,
  size = 'md',
  variant = 'outline',
  className = '',
  color = 'default',
  ...props
}) {
  // Convert size string to pixel value if needed
  const sizePixels = typeof size === 'string' ? ICON_SIZES[size] || ICON_SIZES.md : size
  
  // Get color class
  const colorClass = ICON_COLORS[color] || ICON_COLORS.default
  
  // Construct full class string
  const fullClassName = `${colorClass} ${className}`.trim()
  
  return (
    <Icon
      icon={`heroicons-${variant}:${name}`}
      width={sizePixels}
      height={sizePixels}
      className={fullClassName}
      {...props}
    />
  )
}

/**
 * Hero Icons Icon List (commonly used)
 * For reference when implementing replacements
 */
export const HERO_ICONS = {
  // Search & Navigation
  'magnifying-glass': 'Search',
  'x-mark': 'Close',
  'plus': 'Add',
  'arrow-left': 'Back',
  'arrow-right': 'Forward',
  'arrow-up': 'Up',
  'arrow-down': 'Down',
  
  // Chat & Communication
  'chat-bubble-left': 'Chat message',
  'chat-bubble-left-right': 'Chat conversation',
  'paper-airplane': 'Send',
  'bell': 'Notification',
  
  // Documents & Files
  'document': 'Document/File',
  'folder': 'Folder',
  'arrow-up-tray': 'Upload',
  'arrow-down-tray': 'Download',
  
  // Settings & Actions
  'cog': 'Settings',
  'pencil-square': 'Edit',
  'trash': 'Delete',
  'eye': 'Show',
  'eye-slash': 'Hide',
  
  // Status & Feedback
  'check-circle': 'Success',
  'x-circle': 'Error',
  'exclamation-triangle': 'Warning',
  'information-circle': 'Info',
  'arrow-path': 'Loading (use with animate-spin)',
  
  // Other
  'globe-alt': 'Globe/Language',
  '🏴‍☠️': 'CaptainClaw logo (keep as emoji)',
}
