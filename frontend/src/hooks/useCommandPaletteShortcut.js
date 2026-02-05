import { useEffect } from 'react'
import { useCommandPalette } from '../contexts/CommandPaletteContext'

/**
 * useCommandPaletteShortcut Hook
 * Listens for Cmd+K (Mac) or Ctrl+K (Windows/Linux) keyboard shortcut
 * Opens/closes the Command Palette appropriately
 *
 * Usage:
 *   useCommandPaletteShortcut()
 *   // Palette will open/close with Cmd+K or Ctrl+K
 */
export function useCommandPaletteShortcut() {
  const { isOpen, openPalette, closePalette } = useCommandPalette()

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      const isMeta = e.metaKey || e.ctrlKey
      const isKKey = e.key === 'k' || e.key === 'K'

      if (!isMeta || !isKKey) {
        return
      }

      // Don't trigger on input fields (except contenteditable)
      const target = e.target
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        (target.contentEditable && target.contentEditable !== 'false')

      // If we're in an input and palette is closed, don't open
      // (user likely wants to type normally)
      if (isInput && !isOpen) {
        return
      }

      // Prevent default browser behavior
      e.preventDefault()

      // Toggle palette
      if (isOpen) {
        closePalette()
      } else {
        openPalette()
      }
    }

    // Attach listener to window
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, openPalette, closePalette])
}

export default useCommandPaletteShortcut
