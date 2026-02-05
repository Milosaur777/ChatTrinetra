import searchEngine from '../searchEngine'

/**
 * SearchEngine Service Tests
 * Validates project and file search functionality
 */

describe('SearchEngine Service', () => {
  // Sample test data
  const mockProjects = [
    {
      id: 1,
      name: 'Project Alpha',
      description: 'A leading-edge AI project',
      system_prompt: 'You are a helpful assistant for AI research',
    },
    {
      id: 2,
      name: 'Project Beta',
      description: 'Web development framework',
      system_prompt: 'You assist with web development tasks',
    },
    {
      id: 3,
      name: 'Data Pipeline',
      description: 'ETL system for data processing',
      system_prompt: 'You help with data engineering',
    },
  ]

  const mockFiles = [
    {
      id: 1,
      filename: 'main.js',
      file_type: 'javascript',
      extracted_text: 'function main() { console.log("Hello"); }',
    },
    {
      id: 2,
      filename: 'config.yaml',
      file_type: 'yaml',
      extracted_text: 'version: 1.0 settings: enabled: true',
    },
    {
      id: 3,
      filename: 'README.md',
      file_type: 'markdown',
      extracted_text: 'This is a comprehensive guide to our project',
    },
  ]

  // Setup before each test
  beforeEach(() => {
    searchEngine.clear()
  })

  // ============================================
  // Initialization Tests
  // ============================================

  test('should initialize projects successfully', () => {
    searchEngine.initializeProjects(mockProjects)
    const status = searchEngine.getStatus()
    expect(status.projectsReady).toBe(true)
  })

  test('should initialize files successfully', () => {
    searchEngine.initializeFiles(mockFiles)
    const status = searchEngine.getStatus()
    expect(status.filesReady).toBe(true)
  })

  test('should handle empty projects array', () => {
    searchEngine.initializeProjects([])
    const status = searchEngine.getStatus()
    expect(status.projectsReady).toBe(false)
  })

  test('should handle null projects', () => {
    searchEngine.initializeProjects(null)
    const status = searchEngine.getStatus()
    expect(status.projectsReady).toBe(false)
  })

  // ============================================
  // Project Search Tests
  // ============================================

  test('should find projects by name', () => {
    searchEngine.initializeProjects(mockProjects)
    const results = searchEngine.searchProjects('Alpha')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.name).toBe('Project Alpha')
  })

  test('should find projects by description', () => {
    searchEngine.initializeProjects(mockProjects)
    const results = searchEngine.searchProjects('AI')
    expect(results.length).toBeGreaterThan(0)
  })

  test('should handle fuzzy matching with typos', () => {
    searchEngine.initializeProjects(mockProjects)
    const results = searchEngine.searchProjects('prjct')
    expect(results.length).toBeGreaterThan(0) // Should find "project"
  })

  test('should return empty array for short queries', () => {
    searchEngine.initializeProjects(mockProjects)
    const results = searchEngine.searchProjects('a')
    expect(results.length).toBe(0)
  })

  test('should return empty array for empty query', () => {
    searchEngine.initializeProjects(mockProjects)
    const results = searchEngine.searchProjects('')
    expect(results.length).toBe(0)
  })

  test('should rank results by relevance score', () => {
    searchEngine.initializeProjects(mockProjects)
    const results = searchEngine.searchProjects('Project')
    expect(results.length).toBeGreaterThan(0)
    // Results should be sorted by score
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeLessThanOrEqual(results[i + 1].score)
    }
  })

  // ============================================
  // File Search Tests
  // ============================================

  test('should find files by filename', () => {
    searchEngine.initializeFiles(mockFiles)
    const results = searchEngine.searchFiles('main')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.filename).toContain('main')
  })

  test('should find files by file type', () => {
    searchEngine.initializeFiles(mockFiles)
    const results = searchEngine.searchFiles('javascript')
    expect(results.length).toBeGreaterThan(0)
  })

  test('should find files by content', () => {
    searchEngine.initializeFiles(mockFiles)
    const results = searchEngine.searchFiles('console')
    expect(results.length).toBeGreaterThan(0)
  })

  test('should return empty array for short file queries', () => {
    searchEngine.initializeFiles(mockFiles)
    const results = searchEngine.searchFiles('m')
    expect(results.length).toBe(0)
  })

  // ============================================
  // Combined Search Tests
  // ============================================

  test('should search all (projects and files)', () => {
    searchEngine.initializeProjects(mockProjects)
    searchEngine.initializeFiles(mockFiles)
    const results = searchEngine.searchAll('Project')
    expect(results.projects).toBeDefined()
    expect(results.files).toBeDefined()
  })

  // ============================================
  // Edge Cases & Performance
  // ============================================

  test('should handle whitespace in queries', () => {
    searchEngine.initializeProjects(mockProjects)
    const results = searchEngine.searchProjects('  Alpha  ')
    expect(results.length).toBeGreaterThan(0)
  })

  test('should be case-insensitive', () => {
    searchEngine.initializeProjects(mockProjects)
    const resultsLower = searchEngine.searchProjects('alpha')
    const resultsUpper = searchEngine.searchProjects('ALPHA')
    expect(resultsLower.length).toBeGreaterThan(0)
    expect(resultsUpper.length).toBeGreaterThan(0)
  })

  test('should reinitialize with new data', () => {
    searchEngine.initializeProjects(mockProjects)
    let results = searchEngine.searchProjects('Alpha')
    expect(results.length).toBeGreaterThan(0)

    // Reinitialize with new projects
    const newProjects = [
      { id: 10, name: 'NewProject', description: 'A new one', system_prompt: 'test' },
    ]
    searchEngine.initializeProjects(newProjects)
    results = searchEngine.searchProjects('Alpha')
    expect(results.length).toBe(0) // Should not find old project

    results = searchEngine.searchProjects('NewProject')
    expect(results.length).toBeGreaterThan(0)
  })

  test('should handle large datasets efficiently', () => {
    // Create 1000 projects
    const largeProjectSet = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Project ${i}`,
      description: `Description for project ${i}`,
      system_prompt: `System prompt ${i}`,
    }))

    const startTime = performance.now()
    searchEngine.initializeProjects(largeProjectSet)
    const initTime = performance.now() - startTime

    const searchStart = performance.now()
    const results = searchEngine.searchProjects('Project 500')
    const searchTime = performance.now() - searchStart

    // Initialization should be fast (<100ms for 1000 items)
    expect(initTime).toBeLessThan(100)
    // Search should be very fast (<10ms)
    expect(searchTime).toBeLessThan(10)
    expect(results.length).toBeGreaterThan(0)
  })

  // ============================================
  // Status & Cleanup Tests
  // ============================================

  test('should report correct status', () => {
    searchEngine.initializeProjects(mockProjects)
    let status = searchEngine.getStatus()
    expect(status.projectsReady).toBe(true)
    expect(status.filesReady).toBe(false)

    searchEngine.initializeFiles(mockFiles)
    status = searchEngine.getStatus()
    expect(status.projectsReady).toBe(true)
    expect(status.filesReady).toBe(true)
  })

  test('should clear indexes properly', () => {
    searchEngine.initializeProjects(mockProjects)
    searchEngine.initializeFiles(mockFiles)
    searchEngine.clear()

    const status = searchEngine.getStatus()
    expect(status.projectsReady).toBe(false)
    expect(status.filesReady).toBe(false)

    const projectResults = searchEngine.searchProjects('Project')
    expect(projectResults.length).toBe(0)
  })
})
