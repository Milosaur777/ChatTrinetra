import Fuse from 'fuse.js'

/**
 * SearchEngine Service
 * Provides fuzzy search for projects and files using Fuse.js
 * Supports typo tolerance and real-time filtering
 */
class SearchEngine {
  constructor() {
    this.projectFuse = null
    this.fileFuse = null
  }

  /**
   * Initialize the project search index
   * @param {Array} projects - Array of project objects with name, description, system_prompt
   */
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
      threshold: 0.4, // 0.4 = fuzzy matching (typos ok)
      minMatchCharLength: 2,
      includeScore: true,
      shouldSort: true,
    })
  }

  /**
   * Initialize the file search index
   * @param {Array} files - Array of file objects with filename, file_type, extracted_text
   */
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
      threshold: 0.3, // More lenient for content
      minMatchCharLength: 1,
      includeScore: true,
      shouldSort: true,
    })
  }

  /**
   * Search projects by query
   * @param {string} query - Search query
   * @returns {Array} Array of matching projects with scores
   */
  searchProjects(query) {
    if (!query || query.trim().length < 2 || !this.projectFuse) {
      return []
    }

    return this.projectFuse.search(query.trim())
  }

  /**
   * Search files by query
   * @param {string} query - Search query
   * @returns {Array} Array of matching files with scores
   */
  searchFiles(query) {
    if (!query || query.trim().length < 2 || !this.fileFuse) {
      return []
    }

    return this.fileFuse.search(query.trim())
  }

  /**
   * Combined search across both projects and files
   * @param {string} query - Search query
   * @returns {Object} Object with projects and files arrays
   */
  searchAll(query) {
    return {
      projects: this.searchProjects(query),
      files: this.searchFiles(query),
    }
  }

  /**
   * Clear all indexes (useful for cleanup)
   */
  clear() {
    this.projectFuse = null
    this.fileFuse = null
  }

  /**
   * Check if search indexes are initialized
   * @returns {Object} Status of both indexes
   */
  getStatus() {
    return {
      projectsReady: this.projectFuse !== null,
      filesReady: this.fileFuse !== null,
    }
  }
}

// Export singleton instance
export default new SearchEngine()
