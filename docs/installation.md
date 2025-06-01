# Installation and Configuration Guide

## Overview

This guide provides detailed instructions for installing, configuring, and getting started with Knowledge in different environments and scenarios.

## Prerequisites

### Minimum Requirements

- **Bun**: v1.0.0 or higher (recommended)
- **Node.js**: v18.0.0 or higher (alternative)
- **Operating System**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **RAM**: 2GB minimum, 4GB recommended
- **Disk Space**: 500MB for installation + space for documentation

### Optional Tools

- **Git**: For version control
- **VS Code**: Recommended editor with TypeScript extensions
- **Docker**: For container deployment

## Installation

### Method 1: Installation with Bun (Recommended)

```bash
# 1. Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# 2. Clone the repository
git clone https://github.com/riligar/knowledge.git
cd knowledge

# 3. Install dependencies
bun install

# 4. Verify installation
bun run --version
```

### Method 2: Installation with npm/yarn

```bash
# 1. Clone the repository
git clone https://github.com/riligar/knowledge.git
cd knowledge

# 2. Install dependencies
npm install
# or
yarn install

# 3. Verify installation
npm run build --dry-run
```

### Method 3: Global Installation

```bash
# Install globally (future)
npm install -g @riligar/knowledge

# Use in any directory
knowledge init my-docs
cd my-docs
knowledge dev
```

## Initial Configuration

### 1. Initialize Project

```bash
# Create new documentation project
bun run init

# Or specify directory
bun run init --dir ./my-documentation
```

This will create the following structure:

```
my-documentation/
├── docs/                    # Source documentation
│   └── README.md           # Home page
├── knowledge.config.ts      # Main configuration
├── package.json            # Project dependencies
└── .gitignore             # Git ignored files
```

### 2. Basic Configuration

Edit the `knowledge.config.ts` file:

```typescript
import type { KnowledgeConfig } from './src/config.js';

export default {
    // Directories
    inputDir: './docs',
    outputDir: './dist',
    themesDir: './themes',

    // Site information
    site: {
        title: 'My Documentation',
        description: 'Complete documentation for my project',
        baseUrl: '/',
        author: 'Your Name'
    },

    // Theme and layout
    theme: 'default',
    layout: 'default',

    // Navigation
    navigation: {
        auto: true,  // Automatic generation based on file structure
        // items: []  // Manual navigation (optional)
    },

    // Features
    features: {
        search: true,
        syntaxHighlight: true,
        darkMode: true,
        tableOfContents: true,
        breadcrumbs: true,
        editOnGithub: 'https://github.com/your-username/your-repo'
    },

    // Markdown processing
    markdown: {
        breaks: true,
        linkify: true,
        typographer: true
    },

    // Development server
    dev: {
        port: 3000,
        host: 'localhost',
        livereload: true
    }
} as KnowledgeConfig;
```

### 3. Documentation Structure

Organize your Markdown files in the `docs/` folder:

```
docs/
├── README.md                # Home page (required)
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── configuration.md
├── guides/
│   ├── user-guide.md
│   ├── admin-guide.md
│   └── developer-guide.md
├── api/
│   ├── overview.md
│   ├── authentication.md
│   └── endpoints.md
└── assets/
    ├── images/
    └── files/
```

## Advanced Configurations

### Site Configuration

```typescript
site: {
    title: 'Knowledge Base',
    description: 'Complete technical documentation',
    baseUrl: '/',  // For GitHub Pages: '/repo-name/'
    author: 'Development Team',
    
    // Additional metadata
    keywords: ['documentation', 'api', 'guides'],
    language: 'en-US',
    favicon: '/assets/favicon.ico',
    
    // SEO and Social
    ogImage: '/assets/og-image.png',
    twitterCard: 'summary_large_image',
    
    // Analytics
    googleAnalytics: 'GA_MEASUREMENT_ID',
    gtag: 'G-XXXXXXXXXX'
}
```

### Manual Navigation Configuration

```typescript
navigation: {
    auto: false,
    items: [
        {
            title: 'Início',
            url: '/',
            icon: 'home'
        },
        {
            title: 'Guias',
            children: [
                { title: 'Instalação', url: '/guides/installation.html' },
                { title: 'Configuração', url: '/guides/configuration.html' },
                { title: 'Uso Básico', url: '/guides/basic-usage.html' }
            ]
        },
        {
            title: 'API',
            children: [
                { title: 'Visão Geral', url: '/api/overview.html' },
                { title: 'Autenticação', url: '/api/auth.html' },
                { title: 'Endpoints', url: '/api/endpoints.html' }
            ]
        },
        {
            title: 'GitHub',
            url: 'https://github.com/riligar/knowledge',
            external: true
        }
    ]
}
```

### Features Configuration

```typescript
features: {
    // Busca
    search: {
        enabled: true,
        placeholder: 'Buscar na documentação...',
        noResultsText: 'Nenhum resultado encontrado',
        indexFields: {
            title: { boost: 10 },
            excerpt: { boost: 5 },
            content: { boost: 1 }
        }
    },
    
    // Syntax highlighting
    syntaxHighlight: {
        enabled: true,
        theme: 'github',  // github, monokai, dracula, etc.
        showLineNumbers: true,
        copyButton: true
    },
    
    // Modo escuro
    darkMode: {
        enabled: true,
        defaultTheme: 'auto',  // light, dark, auto
        storageKey: 'knowledge-theme'
    },
    
    // Índice de conteúdo
    tableOfContents: {
        enabled: true,
        levels: [2, 3, 4],  // h2, h3, h4
        position: 'right'   // left, right, inline
    },
    
    // Breadcrumbs
    breadcrumbs: {
        enabled: true,
        separator: '/',
        showHome: true
    },
    
    // Editar no GitHub
    editOnGithub: {
        enabled: true,
        baseUrl: 'https://github.com/seu-usuario/seu-repo',
        branch: 'main',
        text: 'Editar esta página'
    }
}
```

### Markdown Configuration

```typescript
markdown: {
    // Configurações básicas
    breaks: true,        // Quebras de linha automáticas
    linkify: true,       // URLs automáticos
    typographer: true,   // Aspas e travessões inteligentes
    
    // Extensões
    extensions: {
        tables: true,
        strikethrough: true,
        tasklists: true,
        footnotes: true,
        math: true,          // Suporte a LaTeX
        mermaid: true,       // Diagramas Mermaid
        emoji: true          // Emojis :smile:
    },
    
    // Plugins customizados
    plugins: [
        'markdown-it-container',
        'markdown-it-deflist',
        'markdown-it-abbr'
    ]
}
```

## Personalization of Theme

### Custom Theme

```bash
# Criar tema personalizado
mkdir -p themes/meu-tema/layouts
mkdir -p themes/meu-tema/assets/css
mkdir -p themes/meu-tema/assets/js

# Copiar tema padrão como base
cp -r themes/default/* themes/meu-tema/
```

### Customization of CSS

```css
/* themes/meu-tema/assets/css/custom.css */

:root {
    /* Cores primárias */
    --primary-color: #007acc;
    --secondary-color: #6c757d;
    --accent-color: #28a745;
    
    /* Tipografia */
    --font-family: 'Inter', -apple-system, sans-serif;
    --font-size-base: 16px;
    --line-height-base: 1.6;
    
    /* Espaçamento */
    --spacing-unit: 8px;
    --container-max-width: 1200px;
    
    /* Modo escuro */
    --dark-bg: #1a1a1a;
    --dark-text: #e0e0e0;
    --dark-border: #333;
}

/* Customizações específicas */
.header {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
}

.sidebar {
    border-right: 2px solid var(--primary-color);
}

.content {
    font-family: var(--font-family);
    line-height: var(--line-height-base);
}
```

### Custom Layout

```html
<!-- themes/meu-tema/layouts/default.html -->
<!DOCTYPE html>
<html lang="{{site.language}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{page.title}} - {{site.title}}</title>
    <meta name="description" content="{{page.description || site.description}}">
    
    <!-- CSS -->
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/custom.css">
    
    <!-- Favicon -->
    <link rel="icon" href="{{site.favicon}}">
</head>
<body>
    <div class="layout">
        <!-- Header -->
        <header class="header">
            <div class="container">
                <h1 class="site-title">{{site.title}}</h1>
                <nav class="main-nav">{{navigation}}</nav>
            </div>
        </header>
        
        <!-- Main Content -->
        <main class="main">
            <aside class="sidebar">{{sidebar}}</aside>
            <article class="content">
                {{content}}
            </article>
            <aside class="toc">{{tableOfContents}}</aside>
        </main>
        
        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <p>&copy; {{currentYear}} {{site.author}}</p>
            </div>
        </footer>
    </div>
    
    <!-- JavaScript -->
    <script src="/assets/js/main.js"></script>
    <script src="/assets/js/search.js"></script>
</body>
</html>
```

## Commands and Scripts

### Development Scripts

```json
{
  "scripts": {
    "dev": "bun run src/cli.ts dev",
    "build": "bun run src/cli.ts build",
    "serve": "bun run src/cli.ts serve",
    "clean": "rm -rf dist",
    "lint": "eslint src/**/*.ts",
    "type-check": "tsc --noEmit",
    "preview": "bun run build && bun run serve"
  }
}
```

### Useful Commands

```bash
# Development
bun run dev                    # Development server
bun run dev --port 4000       # Custom port
bun run dev --host 0.0.0.0    # Accessible externally

# Build
bun run build                  # Complete build
bun run build --config custom.config.ts  # Custom configuration

# Serve
bun run serve                  # Serve dist/
bun run serve --port 8080     # Custom port
bun run serve --dir ./build   # Custom directory

# Clean
bun run clean                  # Clean dist/
rm -rf node_modules && bun install  # Reinstall dependencies
```

## Deploy with Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM oven/bun:1 as builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  knowledge:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./docs:/app/docs:ro
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Development
  knowledge-dev:
    build:
      context: .
      target: builder
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    command: bun run dev
    environment:
      - NODE_ENV=development
```

### Docker Commands

```bash
# Build image
docker build -t knowledge .

# Run container
docker run -p 80:80 knowledge

# With Docker Compose
docker-compose up -d

# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Deploy to Production

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Build
      run: bun run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Netlify

```toml
# netlify.toml
[build]
  command = "bun install && bun run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Troubleshooting

### Common Problems

#### 1. Installation Error

```bash
# Clear cache
bun pm cache rm
rm -rf node_modules bun.lock
bun install

# Verify Bun version
bun --version

# Update Bun
curl -fsSL https://bun.sh/install | bash
```

#### 2. Build Failure

```bash
# Verify configuration
bun run src/cli.ts build --verbose

# Verify Markdown files
find docs -name "*.md" -exec echo "Checking: {}" \; -exec head -1 {} \;

# Verify config syntax
bun run -e "import('./knowledge.config.ts')"
```

#### 3. Server Not Starting

```bash
# Verify port in use
lsof -i :3000

# Use different port
bun run dev --port 3001

# Verify permissions
ls -la src/
```

#### 4. Assets Not Loading

```bash
# Verify theme structure
ls -la themes/default/assets/

# Verify paths in HTML
grep -r "assets/" dist/

# Verify static server
curl -I http://localhost:3000/assets/css/style.css
```

### Debug Logs

```bash
# Enable detailed logs
DEBUG=knowledge:* bun run dev

# Specific logs
DEBUG=knowledge:generator bun run build
DEBUG=knowledge:search bun run build
DEBUG=knowledge:markdown bun run build
```

### Health Check

```bash
# Health check script
#!/bin/bash
echo "🔍 Verifying Knowledge installation..."

# Verify Bun
if command -v bun &> /dev/null; then
    echo "✅ Bun: $(bun --version)"
else
    echo "❌ Bun not found"
fi

# Verify dependencies
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    bun run --dry-run build && echo "✅ Scripts working"
else
    echo "❌ package.json not found"
fi

# Verify configuration
if [ -f "knowledge.config.ts" ]; then
    echo "✅ Configuration found"
else
    echo "⚠️  Configuration not found - execute 'bun run init'"
fi

# Verify documentation
if [ -d "docs" ] && [ -f "docs/README.md" ]; then
    echo "✅ Documentation found"
    echo "📄 Files: $(find docs -name "*.md" | wc -l) Markdown files"
else
    echo "❌ docs/ or README.md not found"
fi

echo "🎉 Health check completed!"
```

## Next Steps

After installation and configuration:

1. **Create Content**: Add your Markdown files to the `docs/` folder
2. **Personalize Theme**: Customize colors, fonts, and layout
3. **Configure Deploy**: Configure CI/CD for automatic deploy
4. **Optimize SEO**: Configure metadata and sitemap
5. **Monitor Performance**: Configure analytics and metrics

## Support

- 📖 **Documentation**: [knowledge.dev](https://knowledge.dev)
- 🐛 **Issues**: [GitHub Issues](https://github.com/riligar/knowledge/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/riligar/knowledge/discussions)
- 📧 **Email**: [suporte@riligar.click](mailto:suporte@riligar.click)

---

**Ready to start!** 🚀 Your modern documentation is just a few commands away. 