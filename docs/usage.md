# 🚀 How to Use Knowledge

## Main Commands

Knowledge provides a simple yet powerful CLI interface. Here are all the commands you need to know:

### Core Commands

```bash
# Initialize a new documentation project
knowledge init [project-name]

# Start development server with hot reload
knowledge dev [options]

# Build static documentation site
knowledge build [options]

# Serve built documentation
knowledge serve [options]

# Display version information
knowledge --version

# Show help information
knowledge --help
```

### Command Options

#### `knowledge init`
```bash
knowledge init my-docs          # Create project in ./my-docs
knowledge init .                # Initialize in current directory
knowledge init --template basic # Use specific template
```

#### `knowledge dev`
```bash
knowledge dev                   # Start on default port (3000)
knowledge dev --port 8080      # Use custom port
knowledge dev --host 0.0.0.0   # Bind to all interfaces
knowledge dev --no-open        # Don't auto-open browser
knowledge dev --verbose        # Enable verbose logging
```

#### `knowledge build`
```bash
knowledge build                 # Build to default output directory
knowledge build --output ./public  # Custom output directory
knowledge build --clean         # Clean output directory first
knowledge build --verbose       # Show detailed build information
```

#### `knowledge serve`
```bash
knowledge serve                 # Serve on default port (8080)
knowledge serve --port 3000     # Use custom port
knowledge serve --host 0.0.0.0  # Bind to all interfaces
knowledge serve --dir ./public  # Serve custom directory
```

## Practical Examples

### Creating Your First Documentation

1. **Initialize a new project**:
```bash
knowledge init my-project-docs
cd my-project-docs
```

2. **Create your content structure**:
```
docs/
├── index.md                 # Homepage
├── getting-started/
│   ├── installation.md      # Installation guide
│   └── quick-start.md       # Quick start guide
├── guides/
│   ├── basic-usage.md       # Basic usage
│   └── advanced-features.md # Advanced features
└── api/
    ├── authentication.md    # API auth
    └── endpoints.md         # API reference
```

3. **Write your content**:
```markdown
# Welcome to My Project

This is the main documentation for my awesome project.

## Quick Navigation

- [Installation](./getting-started/installation.md)
- [Quick Start](./getting-started/quick-start.md)
- [API Reference](./api/endpoints.md)

## Features

- ✅ Easy to use
- ✅ Fast and reliable
- ✅ Well documented
```

4. **Start development**:
```bash
knowledge dev
# Opens http://localhost:3000 automatically
```

### Real-World Project Structure

Here's how to organize documentation for different types of projects:

#### **Web Application Documentation**
```
docs/
├── index.md                    # Project overview
├── installation.md             # Setup instructions
├── user-guide/
│   ├── getting-started.md      # First steps
│   ├── dashboard.md            # Dashboard usage
│   └── settings.md             # Configuration
├── developer-guide/
│   ├── api-reference.md        # API docs
│   ├── database-schema.md      # Database structure
│   └── deployment.md           # Deployment guide
└── troubleshooting.md          # Common issues
```

#### **Library/Package Documentation**
```
docs/
├── index.md                    # Library overview
├── installation.md             # Installation methods
├── api/
│   ├── classes.md              # Class documentation
│   ├── functions.md            # Function reference
│   └── types.md                # Type definitions
├── examples/
│   ├── basic-usage.md          # Simple examples
│   └── advanced-usage.md       # Complex examples
└── migration-guide.md          # Version migration
```

#### **Team Knowledge Base**
```
docs/
├── index.md                    # Welcome page
├── onboarding/
│   ├── new-employee.md         # Onboarding checklist
│   └── tools-setup.md          # Development setup
├── processes/
│   ├── code-review.md          # Code review process
│   ├── deployment.md           # Deployment process
│   └── incident-response.md    # Incident handling
└── resources/
    ├── useful-links.md         # External resources
    └── contact-info.md         # Team contacts
```

### Advanced Markdown Features

Knowledge supports enhanced Markdown with additional features:

#### **Code Blocks with Syntax Highlighting**
```markdown
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}
```

```python
def greet(name):
    return f"Hello, {name}!"
```

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
```

#### **Tables**
```markdown
| Feature | Basic | Pro | Enterprise |
|---------|-------|-----|------------|
| Users | 5 | 50 | Unlimited |
| Storage | 1GB | 10GB | 100GB |
| Support | Email | Priority | 24/7 |
```

#### **Alerts and Callouts**
```markdown
> **Note**: This is an important note that users should pay attention to.

> **Warning**: This action cannot be undone. Proceed with caution.

> **Tip**: Use keyboard shortcuts to navigate faster through the documentation.
```

#### **Internal Links**
```markdown
# Link to other documentation pages
[Installation Guide](./installation.md)
[API Reference](./api/endpoints.md)

# Link to specific sections
[Configuration Section](./installation.md#configuration)
[Troubleshooting](./usage.md#troubleshooting)
```

## Settings and Customization

### Configuration Options

Customize your documentation by modifying `knowledge.config.ts`:

#### **Site Metadata**
```typescript
site: {
    title: 'My Project Documentation',
    description: 'Comprehensive guide for my awesome project',
    baseUrl: '/',
    author: 'Your Name',
    logo: './assets/logo.png',        // Optional logo
    favicon: './assets/favicon.ico'   // Optional favicon
}
```

#### **Theme Customization**
```typescript
theme: 'default',  // Built-in theme
layout: 'default', // Layout template

// Custom CSS
customCSS: './styles/custom.css',

// Custom JavaScript
customJS: './scripts/custom.js'
```

#### **Navigation Settings**
```typescript
navigation: {
    auto: true,                    // Auto-generate from file structure
    order: [                       // Custom order
        'index.md',
        'installation.md',
        'guides/',
        'api/'
    ],
    exclude: [                     // Files to exclude
        'draft.md',
        'internal/'
    ]
}
```

#### **Feature Toggles**
```typescript
features: {
    search: true,                  // Enable search
    syntaxHighlight: true,         // Code highlighting
    darkMode: true,                // Dark mode toggle
    tableOfContents: true,         // Auto TOC
    breadcrumbs: true,             // Navigation breadcrumbs
    editOnGithub: 'https://github.com/user/repo',  // Edit links
    downloadMarkdown: true,        // Download MD files
    printFriendly: true           // Print-optimized styles
}
```

### Environment-Specific Configuration

Create different configurations for different environments:

#### **Development Configuration**
```typescript
// knowledge.dev.config.ts
export default {
    ...baseConfig,
    dev: {
        port: 3000,
        host: 'localhost',
        livereload: true,
        verbose: true
    }
};
```

#### **Production Configuration**
```typescript
// knowledge.prod.config.ts
export default {
    ...baseConfig,
    outputDir: './dist',
    features: {
        ...baseConfig.features,
        editOnGithub: 'https://github.com/user/repo/edit/main/docs'
    }
};
```

## Deployment Workflows

### GitHub Pages

1. **Create GitHub Action**:
```yaml
# .github/workflows/docs.yml
name: Deploy Documentation

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install Knowledge
      run: npm install -g @riligar/knowledge
      
    - name: Build documentation
      run: knowledge build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Netlify

1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: `npm install -g @riligar/knowledge && knowledge build`
   - Publish directory: `dist`

### Vercel

1. **Connect your repository** to Vercel
2. **Configure build settings**:
   - Framework: Other
   - Build command: `npm install -g @riligar/knowledge && knowledge build`
   - Output directory: `dist`

## Troubleshooting

### Common Issues

#### **Port Already in Use**
```bash
# Error: Port 3000 is already in use
knowledge dev --port 3001

# Or find and kill the process
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

#### **Permission Denied**
```bash
# macOS/Linux: Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Or use sudo (not recommended)
sudo npm install -g @riligar/knowledge
```

#### **Module Not Found**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall Knowledge
npm uninstall -g @riligar/knowledge
npm install -g @riligar/knowledge
```

#### **Build Failures**
```bash
# Enable verbose logging
knowledge build --verbose

# Clean output directory
knowledge build --clean

# Check configuration file
node -c knowledge.config.ts
```

### Performance Optimization

#### **Large Documentation Sites**
```typescript
// Optimize for large sites
export default {
    // ... other config
    
    // Exclude unnecessary files
    navigation: {
        exclude: [
            'node_modules/',
            '.git/',
            '*.tmp',
            'drafts/'
        ]
    },
    
    // Optimize search index
    search: {
        maxResults: 50,
        minQueryLength: 2
    }
};
```

#### **Slow Build Times**
```bash
# Use incremental builds during development
knowledge dev --incremental

# Exclude large directories
# Add to .gitignore and navigation.exclude
```

### Getting Help

If you're still having issues:

1. **Check the logs**: Use `--verbose` flag for detailed output
2. **Search existing issues**: [GitHub Issues](https://github.com/riligar/knowledge/issues)
3. **Create a new issue**: Include your configuration and error messages
4. **Join the community**: [Discussions](https://github.com/riligar/knowledge/discussions)

---

**Next Steps**: Learn about [Development](./development.md) to contribute to Knowledge or explore the [API Reference](./api.md) for advanced customization. 