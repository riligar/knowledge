# 🔗 API Reference

## Configuration API

The `knowledge.config.ts` file is the central configuration for your documentation site. This reference covers all available options.

### Basic Configuration

```typescript
import type { KnowledgeConfig } from '@riligar/knowledge';

export default {
    // Required: Input directory containing Markdown files
    inputDir: './docs',
    
    // Required: Output directory for generated site
    outputDir: './dist',
    
    // Required: Site metadata
    site: {
        title: 'My Documentation',
        description: 'Project documentation',
        author: 'Your Name'
    }
} as KnowledgeConfig;
```

### Complete Configuration Reference

#### **Directory Configuration**

```typescript
{
    // Input directory containing Markdown files
    inputDir: './docs',
    
    // Output directory for generated static site
    outputDir: './dist',
    
    // Directory containing custom templates (optional)
    templatesDir: './templates',
    
    // Directory containing custom themes (optional)
    themesDir: './themes'
}
```

#### **Site Metadata**

```typescript
site: {
    // Site title (appears in browser tab and header)
    title: 'My Documentation',
    
    // Site description (used for SEO meta tags)
    description: 'Comprehensive documentation for my project',
    
    // Base URL for the site (important for deployment)
    baseUrl: '/',
    
    // Author name (appears in footer and meta tags)
    author: 'Your Name',
    
    // Optional: Site logo (path relative to inputDir)
    logo?: './assets/logo.png',
    
    // Optional: Favicon (path relative to inputDir)
    favicon?: './assets/favicon.ico',
    
    // Optional: Language code for HTML lang attribute
    language?: 'en',
    
    // Optional: Additional meta tags
    meta?: {
        keywords: 'documentation, api, guide',
        'og:image': './assets/social-preview.png'
    }
}
```

#### **Theme and Layout**

```typescript
{
    // Theme name (built-in: 'default')
    theme: 'default',
    
    // Layout template (built-in: 'default')
    layout: 'default',
    
    // Optional: Custom CSS file
    customCSS?: './styles/custom.css',
    
    // Optional: Custom JavaScript file
    customJS?: './scripts/custom.js'
}
```

#### **Navigation Configuration**

```typescript
navigation: {
    // Auto-generate navigation from file structure
    auto: true,
    
    // Custom navigation order (overrides auto-generation)
    order?: [
        'index.md',
        'getting-started/',
        'guides/',
        'api/',
        'faq.md'
    ],
    
    // Files and directories to exclude from navigation
    exclude?: [
        'draft.md',
        'internal/',
        '*.tmp'
    ],
    
    // Custom navigation labels
    labels?: {
        'getting-started': 'Getting Started',
        'api': 'API Reference'
    }
}
```

#### **Feature Configuration**

```typescript
features: {
    // Enable/disable search functionality
    search: true,
    
    // Enable syntax highlighting for code blocks
    syntaxHighlight: true,
    
    // Enable dark mode toggle
    darkMode: true,
    
    // Auto-generate table of contents
    tableOfContents: true,
    
    // Show breadcrumb navigation
    breadcrumbs: true,
    
    // Add "Edit on GitHub" links
    editOnGithub?: 'https://github.com/user/repo',
    
    // Enable markdown file downloads
    downloadMarkdown: true,
    
    // Print-friendly styles
    printFriendly: true,
    
    // Enable copy-to-clipboard for code blocks
    copyCode: true,
    
    // Show last modified dates
    lastModified: true
}
```

#### **Markdown Processing**

```typescript
markdown: {
    // Convert line breaks to <br> tags
    breaks: true,
    
    // Auto-convert URLs to clickable links
    linkify: true,
    
    // Enable smart quotes and typography
    typographer: true,
    
    // Custom markdown-it plugins
    plugins?: [
        // Plugin configuration
    ]
}
```

#### **Search Configuration**

```typescript
search: {
    // Maximum number of search results
    maxResults: 50,
    
    // Minimum query length to trigger search
    minQueryLength: 2,
    
    // Fields to include in search index
    fields: ['title', 'content', 'headings'],
    
    // Boost factor for title matches
    titleBoost: 2,
    
    // Enable fuzzy search
    fuzzy: true
}
```

#### **Development Server**

```typescript
dev: {
    // Development server port
    port: 3000,
    
    // Host to bind to
    host: 'localhost',
    
    // Enable live reload
    livereload: true,
    
    // Auto-open browser
    open: true,
    
    // Enable verbose logging
    verbose: false
}
```

## CLI API

### Command Reference

#### **`knowledge init`**

Initialize a new documentation project.

```bash
knowledge init [directory] [options]
```

**Arguments:**
- `directory` - Target directory (default: current directory)

**Options:**
- `--template <name>` - Use specific template
- `--force` - Overwrite existing files
- `--no-install` - Skip dependency installation

**Examples:**
```bash
# Initialize in current directory
knowledge init

# Create new project directory
knowledge init my-docs

# Use specific template
knowledge init --template minimal

# Force overwrite existing files
knowledge init --force
```

#### **`knowledge dev`**

Start development server with hot reload.

```bash
knowledge dev [options]
```

**Options:**
- `--port <number>` - Server port (default: 3000)
- `--host <string>` - Host to bind to (default: localhost)
- `--no-open` - Don't auto-open browser
- `--verbose` - Enable verbose logging
- `--config <path>` - Custom config file path

**Examples:**
```bash
# Start with default settings
knowledge dev

# Use custom port
knowledge dev --port 8080

# Bind to all interfaces
knowledge dev --host 0.0.0.0

# Enable verbose logging
knowledge dev --verbose
```

#### **`knowledge build`**

Build static documentation site.

```bash
knowledge build [options]
```

**Options:**
- `--output <directory>` - Output directory (overrides config)
- `--clean` - Clean output directory before build
- `--verbose` - Show detailed build information
- `--config <path>` - Custom config file path

**Examples:**
```bash
# Build with default settings
knowledge build

# Clean build
knowledge build --clean

# Custom output directory
knowledge build --output ./public

# Verbose build
knowledge build --verbose
```

#### **`knowledge serve`**

Serve built documentation.

```bash
knowledge serve [options]
```

**Options:**
- `--port <number>` - Server port (default: 8080)
- `--host <string>` - Host to bind to (default: localhost)
- `--dir <directory>` - Directory to serve (default: ./dist)
- `--open` - Auto-open browser

**Examples:**
```bash
# Serve built documentation
knowledge serve

# Use custom port
knowledge serve --port 3000

# Serve custom directory
knowledge serve --dir ./public

# Auto-open browser
knowledge serve --open
```

### Environment Variables

Override configuration using environment variables:

```bash
# Server configuration
export KNOWLEDGE_PORT=8080
export KNOWLEDGE_HOST=0.0.0.0

# Build configuration
export KNOWLEDGE_OUTPUT_DIR=./public
export KNOWLEDGE_INPUT_DIR=./documentation

# Debug mode
export KNOWLEDGE_DEBUG=true
export KNOWLEDGE_VERBOSE=true

# Custom config file
export KNOWLEDGE_CONFIG=./custom.config.ts
```

## Customization API

### Custom Themes

Create custom themes by extending the default theme:

#### **Theme Structure**
```
themes/
└── my-theme/
    ├── layouts/
    │   └── default.html      # Main layout template
    ├── assets/
    │   ├── css/
    │   │   └── style.css     # Theme styles
    │   └── js/
    │       └── theme.js      # Theme JavaScript
    └── theme.json            # Theme metadata
```

#### **Theme Configuration**
```json
{
    "name": "My Custom Theme",
    "version": "1.0.0",
    "description": "A custom theme for Knowledge",
    "author": "Your Name",
    "extends": "default"
}
```

#### **Layout Template**
```html
<!DOCTYPE html>
<html lang="{{site.language}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{page.title}} - {{site.title}}</title>
    <meta name="description" content="{{page.description || site.description}}">
    
    <!-- Theme CSS -->
    <link rel="stylesheet" href="{{baseUrl}}assets/css/style.css">
    
    <!-- Custom CSS -->
    {{#if customCSS}}
    <link rel="stylesheet" href="{{baseUrl}}{{customCSS}}">
    {{/if}}
</head>
<body>
    <!-- Navigation -->
    <nav class="sidebar">
        {{#each navigation}}
        <a href="{{url}}" class="nav-item {{#if active}}active{{/if}}">
            {{title}}
        </a>
        {{/each}}
    </nav>
    
    <!-- Main content -->
    <main class="content">
        {{#if features.breadcrumbs}}
        <nav class="breadcrumbs">
            {{#each breadcrumbs}}
            <a href="{{url}}">{{title}}</a>
            {{/each}}
        </nav>
        {{/if}}
        
        <article>
            {{{content}}}
        </article>
        
        {{#if features.tableOfContents}}
        <aside class="toc">
            {{#each tableOfContents}}
            <a href="#{{id}}" class="toc-item toc-{{level}}">{{text}}</a>
            {{/each}}
        </aside>
        {{/if}}
    </main>
    
    <!-- Search -->
    {{#if features.search}}
    <div id="search-container">
        <input type="text" id="search-input" placeholder="Search documentation...">
        <div id="search-results"></div>
    </div>
    {{/if}}
    
    <!-- Scripts -->
    <script src="{{baseUrl}}assets/js/knowledge.js"></script>
    
    {{#if customJS}}
    <script src="{{baseUrl}}{{customJS}}"></script>
    {{/if}}
</body>
</html>
```

### Custom CSS

Add custom styles to enhance the default theme:

```css
/* custom.css */

/* Override default colors */
:root {
    --primary-color: #007acc;
    --secondary-color: #f8f9fa;
    --text-color: #333;
    --background-color: #fff;
}

/* Custom navigation styles */
.sidebar {
    background: linear-gradient(135deg, var(--primary-color), #005a9e);
}

/* Custom content styles */
.content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

/* Custom code block styles */
pre {
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Dark mode overrides */
[data-theme="dark"] {
    --text-color: #e0e0e0;
    --background-color: #1a1a1a;
}
```

### Custom JavaScript

Add interactive features with custom JavaScript:

```javascript
// custom.js

// Add custom search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Custom search enhancements
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.blur();
            }
        });
    }
    
    // Add copy buttons to code blocks
    document.querySelectorAll('pre code').forEach(function(block) {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.className = 'copy-button';
        button.onclick = function() {
            navigator.clipboard.writeText(block.textContent);
            button.textContent = 'Copied!';
            setTimeout(() => button.textContent = 'Copy', 2000);
        };
        block.parentNode.appendChild(button);
    });
    
    // Custom analytics
    if (typeof gtag !== 'undefined') {
        // Track page views
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
});
```

## Plugin API

### Creating Plugins

Extend Knowledge functionality with custom plugins:

```typescript
// plugins/my-plugin.ts
import type { KnowledgePlugin } from '@riligar/knowledge';

export default {
    name: 'my-plugin',
    version: '1.0.0',
    
    // Hook into the build process
    hooks: {
        beforeBuild: async (config) => {
            console.log('Starting build...');
        },
        
        afterBuild: async (config, result) => {
            console.log('Build completed!');
        },
        
        processMarkdown: async (content, filePath) => {
            // Transform markdown content
            return content.replace(/TODO:/g, '📝 TODO:');
        },
        
        generatePage: async (page, config) => {
            // Modify page data before rendering
            page.customData = 'Added by plugin';
            return page;
        }
    }
} as KnowledgePlugin;
```

### Using Plugins

Configure plugins in your `knowledge.config.ts`:

```typescript
import myPlugin from './plugins/my-plugin.js';

export default {
    // ... other config
    
    plugins: [
        myPlugin,
        {
            name: 'inline-plugin',
            hooks: {
                processMarkdown: async (content) => {
                    return content.replace(/\[!NOTE\]/g, '> **Note**:');
                }
            }
        }
    ]
} as KnowledgeConfig;
```

---

**Need more customization?** Check out the [source code](https://github.com/riligar/knowledge) or [create an issue](https://github.com/riligar/knowledge/issues) for feature requests! 