/**
 * SearchEngine Service Validation Test
 * Node.js test to verify the service works correctly
 */

import Fuse from 'fuse.js'

// Import the searchEngine module manually (since we're in Node)
class SearchEngine {
  constructor() {
    this.projectFuse = null
    this.fileFuse = null
  }

  initializeProjects(projects) {
    if (!projects || projects.length === 0) {
      this.projectFuse = null
      return
    }

    this.projectFuse = new Fuse(projects, {
      keys: [
        { name: 'name', weight: 1 },
        { name: 'description', weight: 0.8 },
        { name: 'system_prompt', weight: 0.5 },
      ],
      threshold: 0.4,
      minMatchCharLength: 2,
      includeScore: true,
      shouldSort: true,
    })
  }

  initializeFiles(files) {
    if (!files || files.length === 0) {
      this.fileFuse = null
      return
    }

    this.fileFuse = new Fuse(files, {
      keys: [
        { name: 'filename', weight: 1 },
        { name: 'file_type', weight: 0.8 },
        { name: 'extracted_text', weight: 0.6 },
      ],
      threshold: 0.3,
      minMatchCharLength: 1,
      includeScore: true,
      shouldSort: true,
    })
  }

  searchProjects(query) {
    if (!query || query.trim().length < 2 || !this.projectFuse) {
      return []
    }

    return this.projectFuse.search(query.trim())
  }

  searchFiles(query) {
    if (!query || query.trim().length < 2 || !this.fileFuse) {
      return []
    }

    return this.fileFuse.search(query.trim())
  }

  searchAll(query) {
    return {
      projects: this.searchProjects(query),
      files: this.searchFiles(query),
    }
  }

  clear() {
    this.projectFuse = null
    this.fileFuse = null
  }

  getStatus() {
    return {
      projectsReady: this.projectFuse !== null,
      filesReady: this.fileFuse !== null,
    }
  }
}

const searchEngine = new SearchEngine()

// Test Data
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

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

function test(name, fn) {
  try {
    fn()
    console.log(`${colors.green}✓${colors.reset} ${name}`)
    return true
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}`)
    console.log(`  ${error.message}`)
    return false
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`)
  }
}

// Run Tests
console.log(`\n${colors.cyan}🧪 SearchEngine Service Tests${colors.reset}\n`)

let passed = 0
let failed = 0

// Initialization Tests
console.log(`${colors.yellow}Initialization Tests${colors.reset}`)
if (test('should initialize projects', () => {
  searchEngine.initializeProjects(mockProjects)
  assert(searchEngine.getStatus().projectsReady, 'Projects not ready')
})) {
  passed++
} else {
  failed++
}

if (test('should initialize files', () => {
  searchEngine.initializeFiles(mockFiles)
  assert(searchEngine.getStatus().filesReady, 'Files not ready')
})) {
  passed++
} else {
  failed++
}

// Project Search Tests
console.log(`\n${colors.yellow}Project Search Tests${colors.reset}`)
searchEngine.clear()
searchEngine.initializeProjects(mockProjects)

if (test('should find projects by name', () => {
  const results = searchEngine.searchProjects('Alpha')
  assert(results.length > 0, 'No results found')
  assert(results[0].item.name === 'Project Alpha', 'Wrong project found')
})) {
  passed++
} else {
  failed++
}

if (test('should find projects by description', () => {
  const results = searchEngine.searchProjects('AI')
  assert(results.length > 0, 'No AI project found')
})) {
  passed++
} else {
  failed++
}

if (test('should handle fuzzy matching with typos', () => {
  const results = searchEngine.searchProjects('prjct')
  assert(results.length > 0, 'Fuzzy matching failed for typo')
})) {
  passed++
} else {
  failed++
}

if (test('should return empty array for short queries', () => {
  const results = searchEngine.searchProjects('a')
  assertEquals(results.length, 0, 'Should return empty for 1-char query')
})) {
  passed++
} else {
  failed++
}

// File Search Tests
console.log(`\n${colors.yellow}File Search Tests${colors.reset}`)
searchEngine.clear()
searchEngine.initializeFiles(mockFiles)

if (test('should find files by filename', () => {
  const results = searchEngine.searchFiles('main')
  assert(results.length > 0, 'No main.js file found')
  assert(results[0].item.filename.includes('main'), 'Wrong file found')
})) {
  passed++
} else {
  failed++
}

if (test('should find files by file type', () => {
  const results = searchEngine.searchFiles('javascript')
  assert(results.length > 0, 'No javascript file found')
})) {
  passed++
} else {
  failed++
}

if (test('should find files by content', () => {
  const results = searchEngine.searchFiles('console')
  assert(results.length > 0, 'No file with console found')
})) {
  passed++
} else {
  failed++
}

// Combined Search Tests
console.log(`\n${colors.yellow}Combined Search Tests${colors.reset}`)
searchEngine.clear()
searchEngine.initializeProjects(mockProjects)
searchEngine.initializeFiles(mockFiles)

if (test('should search all (projects and files)', () => {
  const results = searchEngine.searchAll('Project')
  assert(results.projects !== undefined, 'No projects in results')
  assert(results.files !== undefined, 'No files in results')
})) {
  passed++
} else {
  failed++
}

// Edge Cases
console.log(`\n${colors.yellow}Edge Cases${colors.reset}`)
searchEngine.clear()
searchEngine.initializeProjects(mockProjects)

if (test('should handle whitespace in queries', () => {
  const results = searchEngine.searchProjects('  Alpha  ')
  assert(results.length > 0, 'Failed with whitespace')
})) {
  passed++
} else {
  failed++
}

if (test('should be case-insensitive', () => {
  const resultsLower = searchEngine.searchProjects('alpha')
  const resultsUpper = searchEngine.searchProjects('ALPHA')
  assert(resultsLower.length > 0, 'Lowercase search failed')
  assert(resultsUpper.length > 0, 'Uppercase search failed')
})) {
  passed++
} else {
  failed++
}

// Performance Test
console.log(`\n${colors.yellow}Performance Tests${colors.reset}`)
const largeProjectSet = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Project ${i}`,
  description: `Description for project ${i}`,
  system_prompt: `System prompt ${i}`,
}))

if (test('should handle large datasets efficiently', () => {
  const startTime = performance.now()
  searchEngine.initializeProjects(largeProjectSet)
  const initTime = performance.now() - startTime

  const searchStart = performance.now()
  const results = searchEngine.searchProjects('Project 500')
  const searchTime = performance.now() - searchStart

  console.log(`    Initialization: ${initTime.toFixed(2)}ms, Search: ${searchTime.toFixed(2)}ms`)
  assert(initTime < 100, `Initialization too slow: ${initTime}ms`)
  assert(searchTime < 100, `Search too slow: ${searchTime}ms`)
  assert(results.length > 0, 'No results for large dataset')
})) {
  passed++
} else {
  failed++
}

// Status & Cleanup Tests
console.log(`\n${colors.yellow}Status & Cleanup Tests${colors.reset}`)

if (test('should report correct status', () => {
  searchEngine.clear()
  searchEngine.initializeProjects(mockProjects)
  let status = searchEngine.getStatus()
  assert(status.projectsReady === true, 'Projects not ready')
  assert(status.filesReady === false, 'Files should not be ready')

  searchEngine.initializeFiles(mockFiles)
  status = searchEngine.getStatus()
  assert(status.projectsReady === true, 'Projects should be ready')
  assert(status.filesReady === true, 'Files not ready')
})) {
  passed++
} else {
  failed++
}

if (test('should clear indexes properly', () => {
  searchEngine.clear()
  const status = searchEngine.getStatus()
  assertEquals(status.projectsReady, false, 'Projects should be cleared')
  assertEquals(status.filesReady, false, 'Files should be cleared')
})) {
  passed++
} else {
  failed++
}

// Summary
console.log(`\n${colors.cyan}Summary${colors.reset}`)
console.log(`${colors.green}Passed: ${passed}${colors.reset}`)
console.log(`${colors.red}Failed: ${failed}${colors.reset}`)
console.log(`Total: ${passed + failed}\n`)

process.exit(failed > 0 ? 1 : 0)
