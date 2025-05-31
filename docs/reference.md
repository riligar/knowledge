# API Reference

## Overview

This documentation provides a complete API reference for Knowledge, including TypeScript interfaces, configurations, public methods, and usage examples.

## Main Configuration

### DocForgeConfig

Main system configuration interface.

```typescript
interface DocForgeConfig {
    // Directories
    inputDir: string
    outputDir: string
    templatesDir?: string
    themesDir?: string

    // Site information
    site: SiteConfig

    // Theme and layout
    theme: string
    layout?: string

    // Navigation
    navigation: NavigationConfig

    // Features
    features: FeatureConfig

    // Markdown processing
    markdown: MarkdownConfig

    // Development server
    dev: DevConfig
}
```

### SiteConfig

Basic site configurations.

```typescript
interface SiteConfig {
    title: string
    description: string
    baseUrl: string
    author: string
    
    // Optional
    keywords?: string[]
    language?: string
    favicon?: string
    logo?: string
    
    // SEO and Social Media
    ogImage?: string
    ogType?: string
    twitterCard?: 'summary' | 'summary_large_image'
    twitterSite?: string
    
    // Analytics
    googleAnalytics?: string
    gtag?: string
    plausible?: string
    
    // Custom metadata
    meta?: Record<string, string>
}
```

**Example:**
```typescript
site: {
    title: 'My Documentation',
    description: 'Complete technical documentation for the project',
    baseUrl: '/',
    author: 'Development Team',
    keywords: ['documentation', 'api', 'guides'],
    language: 'en-US',
    favicon: '/assets/favicon.ico',
    ogImage: '/assets/og-image.png',
    googleAnalytics: 'GA_MEASUREMENT_ID'
}
```

### NavigationConfig

Site navigation configuration.

```typescript
interface NavigationConfig {
    auto: boolean
    items?: NavigationItem[]
    maxDepth?: number
    showHome?: boolean
    homeTitle?: string
}

interface NavigationItem {
    title: string
    url?: string
    icon?: string
    external?: boolean
    children?: NavigationItem[]
    order?: number
    hidden?: boolean
}
```

**Automatic Navigation:**
```typescript
navigation: {
    auto: true,
    maxDepth: 3,
    showHome: true,
    homeTitle: 'Home'
}
```

**Manual Navigation:**
```typescript
navigation: {
    auto: false,
    items: [
        {
            title: 'Home',
            url: '/',
            icon: 'home'
        },
        {
            title: 'Guides',
            children: [
                { title: 'Installation', url: '/guides/installation.html' },
                { title: 'Configuration', url: '/guides/configuration.html' }
            ]
        },
        {
            title: 'GitHub',
            url: 'https://github.com/riligar/knowledge',
            external: true,
            icon: 'github'
        }
    ]
}
```

### FeatureConfig

System features configuration.

```typescript
interface FeatureConfig {
    search?: boolean | SearchConfig
    syntaxHighlight?: boolean | SyntaxHighlightConfig
    darkMode?: boolean | DarkModeConfig
    tableOfContents?: boolean | TableOfContentsConfig
    breadcrumbs?: boolean | BreadcrumbsConfig
    editOnGithub?: string | EditOnGithubConfig
    comments?: boolean | CommentsConfig
    analytics?: boolean | AnalyticsConfig
}
```

#### SearchConfig

```typescript
interface SearchConfig {
    enabled: boolean
    placeholder?: string
    noResultsText?: string
    maxResults?: number
    minQueryLength?: number
    indexFields?: {
        title?: { boost: number }
        excerpt?: { boost: number }
        content?: { boost: number }
        tags?: { boost: number }
    }
    stopWords?: string[]
    stemming?: boolean
}
```

**Example:**
```typescript
search: {
    enabled: true,
    placeholder: 'Search documentation...',
    noResultsText: 'No results found',
    maxResults: 10,
    minQueryLength: 2,
    indexFields: {
        title: { boost: 10 },
        excerpt: { boost: 5 },
        content: { boost: 1 },
        tags: { boost: 8 }
    }
}
``` 