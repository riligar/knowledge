# Full-Text Search System - Detailed Implementation

## Overview

Knowledge implements an advanced full-text search system using [Lunr.js](https://lunrjs.com/) that allows searching through all documentation content quickly and efficiently, working completely offline.

## Main Features

### Performance
- **Instant Search**: Real-time results as you type
- **Optimized Index**: Generated during build for maximum performance
- **Offline Search**: Works without internet connection
- **Smart Cache**: Index loaded once and kept in memory

### Functionality
- **Full-Text Search**: Search in titles, content, and excerpts
- **Weight-based Relevance**: Titles have higher weight than content
- **Term Highlighting**: Visual highlighting of found terms
- **Keyboard Navigation**: Complete keyboard shortcut support
- **Responsive Interface**: Works on desktop and mobile
- **Smart Search**: Support for wildcards and exact search

### Technologies
- **Lunr.js 2.3.9**: Full-text search engine
- **TypeScript**: Strong typing and better DX
- **Modern CSS**: Elegant and accessible interface
- **Vanilla JavaScript**: No framework dependencies

## System Architecture

### Backend (Index Generation)

```typescript
// src/search.ts
export class SearchIndexGenerator {
    private documents: SearchDocument[] = []
    private lunrIndex: lunr.Index | null = null

    /**
     * Adds a page to the search index
     */
    addPage(page: DocumentPage): void {
        const cleanContent = this.cleanContent(page.content)
        const excerpt = this.generateExcerpt(cleanContent)
        
        const document: SearchDocument = {
            id: page.url,
            title: page.title,
            content: cleanContent,
            excerpt,
            url: page.url
        }
        
        this.documents.push(document)
    }

    /**
     * Builds the Lunr index with optimized configuration
     */
    buildIndex(): lunr.Index {
        return lunr(function() {
            this.ref('id')
            this.field('title', { boost: 10 })    // Titles have 10x weight
            this.field('excerpt', { boost: 5 })   // Excerpts have 5x weight
            this.field('content', { boost: 1 })   // Content normal weight
            
            // Stemming and stop words configuration
            this.use(lunr.stemmer)
            this.use(lunr.stopWordFilter)
            
            documents.forEach(doc => this.add(doc))
        })
    }

    /**
     * Generates serializable data for frontend
     */
    getSerializableData(): SearchIndexData {
        return {
            documents: this.documents,
            indexData: this.lunrIndex.toJSON()
        }
    }

    /**
     * Cleans HTML and Markdown content for indexing
     */
    private cleanContent(html: string): string {
        return html
            .replace(/<[^>]*>/g, ' ')           // Remove HTML tags
            .replace(/```[\s\S]*?```/g, ' ')    // Remove code blocks
            .replace(/`[^`]*`/g, ' ')           // Remove inline code
            .replace(/\s+/g, ' ')               // Normalize spaces
            .trim()
    }

    /**
     * Generates automatic excerpt from content
     */
    private generateExcerpt(content: string, maxLength: number = 200): string {
        if (content.length <= maxLength) return content
        
        const truncated = content.substring(0, maxLength)
        const lastSpace = truncated.lastIndexOf(' ')
        
        return lastSpace > 0 
            ? truncated.substring(0, lastSpace) + '...'
            : truncated + '...'
    }
}
```

### Frontend (Search Interface)

```javascript
// themes/default/assets/js/search.js
class DocumentationSearch {
    constructor() {
        this.searchIndex = null
        this.documents = []
        this.isLoading = false
        this.currentQuery = ''
        this.selectedIndex = -1
        
        this.initializeElements()
        this.bindEvents()
        this.loadSearchIndex()
    }

    /**
     * Loads search index from server
     */
    async loadSearchIndex() {
        if (this.isLoading) return
        
        this.isLoading = true
        this.showLoading(true)
        
        try {
            const response = await fetch('/search-index.json')
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const data = await response.json()
            this.documents = data.documents
            this.searchIndex = lunr.Index.load(data.indexData)
            
            console.log(`✅ Index loaded: ${this.documents.length} documents`)
            this.showLoading(false)
            
        } catch (error) {
            console.error('❌ Error loading index:', error)
            this.showError(error.message)
        } finally {
            this.isLoading = false
        }
    }

    /**
     * Performs search in index
     */
    performSearch(query) {
        if (!this.searchIndex || !query.trim()) {
            this.hideResults()
            return
        }

        try {
            // Prepare query for Lunr
            const processedQuery = this.processQuery(query)
            const results = this.searchIndex.search(processedQuery)
            
            this.displayResults(results, query)
            this.currentQuery = query
            
        } catch (error) {
            console.error('Search error:', error)
            this.showError('Error performing search')
        }
    }

    /**
     * Processes query to optimize search
     */
    processQuery(query) {
        // Exact search with quotes
        if (query.startsWith('"') && query.endsWith('"')) {
            return query.slice(1, -1)
        }
        
        // Add wildcard for partial search
        const terms = query.split(/\s+/).filter(term => term.length > 1)
        return terms.map(term => `${term}*`).join(' ')
    }

    /**
     * Displays search results
     */
    displayResults(results, query) {
    }
} 