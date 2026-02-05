import { createContext, useContext, useReducer, useCallback } from 'react'

/**
 * CommandPaletteContext
 * Manages global state for the Command Palette modal
 * Provides search functionality and result management
 */
const CommandPaletteContext = createContext(null)

// Action types
const ACTIONS = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  SET_QUERY: 'SET_QUERY',
  SET_RESULTS: 'SET_RESULTS',
  SELECT_PROJECT: 'SELECT_PROJECT',
  SELECT_FILE: 'SELECT_FILE',
  RESET: 'RESET',
}

// Initial state
const initialState = {
  isOpen: false,
  searchQuery: '',
  results: {
    projects: [],
    files: [],
  },
  selectedIndex: 0,
  selectedResult: null,
}

// Reducer function
function commandPaletteReducer(state, action) {
  switch (action.type) {
    case ACTIONS.OPEN:
      return {
        ...state,
        isOpen: true,
        selectedIndex: 0,
      }

    case ACTIONS.CLOSE:
      return {
        ...state,
        isOpen: false,
        searchQuery: '',
        results: { projects: [], files: [] },
        selectedIndex: 0,
        selectedResult: null,
      }

    case ACTIONS.SET_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
        selectedIndex: 0,
      }

    case ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        selectedIndex: 0,
      }

    case ACTIONS.SELECT_PROJECT:
      return {
        ...state,
        selectedResult: {
          type: 'project',
          data: action.payload,
        },
      }

    case ACTIONS.SELECT_FILE:
      return {
        ...state,
        selectedResult: {
          type: 'file',
          data: action.payload,
        },
      }

    case ACTIONS.RESET:
      return initialState

    default:
      return state
  }
}

/**
 * CommandPaletteProvider
 * Wraps the app to provide command palette context
 */
export function CommandPaletteProvider({ children }) {
  const [state, dispatch] = useReducer(commandPaletteReducer, initialState)

  // Action handlers
  const openPalette = useCallback(() => {
    dispatch({ type: ACTIONS.OPEN })
  }, [])

  const closePalette = useCallback(() => {
    dispatch({ type: ACTIONS.CLOSE })
  }, [])

  const setQuery = useCallback((query) => {
    dispatch({ type: ACTIONS.SET_QUERY, payload: query })
  }, [])

  const setResults = useCallback((results) => {
    dispatch({ type: ACTIONS.SET_RESULTS, payload: results })
  }, [])

  const selectProject = useCallback((project) => {
    dispatch({ type: ACTIONS.SELECT_PROJECT, payload: project })
  }, [])

  const selectFile = useCallback((file) => {
    dispatch({ type: ACTIONS.SELECT_FILE, payload: file })
  }, [])

  const resetState = useCallback(() => {
    dispatch({ type: ACTIONS.RESET })
  }, [])

  const value = {
    // State
    isOpen: state.isOpen,
    searchQuery: state.searchQuery,
    results: state.results,
    selectedIndex: state.selectedIndex,
    selectedResult: state.selectedResult,

    // Actions
    openPalette,
    closePalette,
    setQuery,
    setResults,
    selectProject,
    selectFile,
    resetState,
  }

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  )
}

/**
 * Hook to use CommandPaletteContext
 * @throws {Error} if used outside CommandPaletteProvider
 */
export function useCommandPalette() {
  const context = useContext(CommandPaletteContext)
  if (!context) {
    throw new Error(
      'useCommandPalette must be used within CommandPaletteProvider'
    )
  }
  return context
}
