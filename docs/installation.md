# 📦 Installation

## Prerequisites

Before installing Documentation, ensure your system meets these requirements:

### System Requirements

- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: npm, yarn, pnpm, or bun
- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 512MB RAM available
- **Storage**: At least 100MB free space

### Check Your Environment

Verify your Node.js version:

```bash
node --version
# Should output v18.0.0 or higher
```

Check npm version:

```bash
npm --version
# Should output 6.0.0 or higher
```

## Installation Methods

### 🚀 Global Installation (Recommended)

Install Documentation globally to use it from anywhere:

```bash
# Using npm
npm install -g @riligar/documentation

# Using yarn
yarn global add @riligar/documentation

# Using pnpm
pnpm add -g @riligar/documentation

# Using bun
bun add -g @riligar/documentation
```

### 📦 Local Installation

For project-specific installations:

```bash
# Using npm
npm install @riligar/documentation --save-dev

# Using yarn
yarn add @riligar/documentation --dev

# Using pnpm
pnpm add @riligar/documentation --save-dev

# Using bun
bun add @riligar/documentation --dev
```

### 🐳 Using with Docker

Create a `Dockerfile` for containerized documentation:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Documentation globally
RUN npm install -g @riligar/documentation

# Copy your documentation
COPY docs/ ./docs/
COPY documentation.config.ts ./

# Build documentation
RUN documentation build

# Serve static files
EXPOSE 8080
CMD ["documentation", "serve", "--port", "8080"]
```

## Configuration

### Initial Setup

After installation, create your first documentation project:

```bash
# Create a new project
documentation init my-documentation
cd my-documentation
```

This creates the following structure:

```
my-documentation/
├── docs/
│   └── index.md              # Your main documentation file
├── documentation.config.ts       # Configuration file
└── package.json             # Project dependencies
```

### Configuration File

The `documentation.config.ts` file is the heart of your documentation setup:

```typescript
import type { DocumentationConfig } from "@riligar/documentation";

export default {
  // Input and output directories
  inputDir: "./docs",
  outputDir: "./dist",

  // Site metadata
  site: {
    title: "My Documentation",
    description: "Comprehensive documentation for my project",
    baseUrl: "/",
    author: "Your Name",
  },

  // Theme and layout
  theme: "default",
  layout: "default",

  // Navigation settings
  navigation: {
    auto: true, // Automatically generate navigation from file structure
  },

  // Feature toggles
  features: {
    search: true, // Enable search functionality
    syntaxHighlight: true, // Code syntax highlighting
    darkMode: true, // Dark mode support
    tableOfContents: true, // Automatic TOC generation
    breadcrumbs: true, // Navigation breadcrumbs
    editOnGithub: "https://github.com/yourusername/your-repo",
  },

  // Markdown processing options
  markdown: {
    breaks: true, // Convert line breaks to <br>
    linkify: true, // Auto-convert URLs to links
    typographer: true, // Enable smart quotes and dashes
  },

  // Development server settings
  dev: {
    port: 3000,
    host: "localhost",
    livereload: true,
  },
} as DocumentationConfig;
```

### Environment Variables

You can override configuration using environment variables:

```bash
# Set custom port
export KNOWLEDGE_PORT=8080

# Set custom host
export KNOWLEDGE_HOST=0.0.0.0

# Enable debug mode
export KNOWLEDGE_DEBUG=true
```

## Verification

### Test Installation

Verify Documentation is installed correctly:

```bash
# Check version
documentation --version

# View help
knowledge --help

# Test with a simple project
documentation init test-docs
cd test-docs
documentation dev
```

### Expected Output

When running `documentation dev`, you should see:

```
🚀 Knowledge Development Server
📁 Input: ./docs
📁 Output: ./dist
🌐 Server: http://localhost:3000
👀 Watching for changes...

✅ Documentation built successfully!
🎉 Server started at http://localhost:3000
```

### Troubleshooting

#### Permission Issues (macOS/Linux)

```bash
# If you get permission errors, use sudo
sudo npm install -g @riligar/documentation

# Or fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### Windows PowerShell Execution Policy

```powershell
# If scripts are blocked, enable execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Node.js Version Issues

```bash
# Update Node.js using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

#### Port Already in Use

```bash
# Use a different port
documentation dev --port 3001

# Or kill the process using the port
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

## Next Steps

Now that Documentation is installed and configured:

1. **Create Content**: Start writing your documentation in Markdown
2. **Customize**: Modify the configuration to match your needs
3. **Deploy**: Build and deploy your documentation to any static host

Continue with our [Usage Guide](./usage.md) to learn how to create and manage your documentation effectively.

## Updating Knowledge

Keep Knowledge up to date with the latest features:

```bash
# Update global installation
npm update -g @riligar/documentation

# Check for updates
npm outdated -g @riligar/documentation

# View changelog
knowledge changelog
```

---

**Need help?** Check our [troubleshooting section](./usage.md#troubleshooting) or [open an issue](https://github.com/riligar/documentation/issues) on GitHub.
