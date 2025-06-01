# Knowledge - Modern Documentation Generator

[![GitHub stars](https://img.shields.io/github/stars/riligar/knowledge)](https://github.com/riligar/knowledge/stargazers) ![GitHub License](https://img.shields.io/github/license/riligar/knowledge) [![Documentation](https://img.shields.io/badge/docs-Knowledge.click-blue)](https://myknowledge.click) [![NPM Version](https://img.shields.io/npm/v/%40riligar%2Fknowledge)
](https://www.npmjs.com/package/@riligar/knowledge)

## 🎯 What is Knowledge?

**Knowledge** is a modern static documentation generator that transforms Markdown files into professional documentation sites. It's the perfect tool for anyone who wants to create beautiful and functional documentation without complications.

> With Knowledge, you transform:

**From:** Scattered Markdown files
**To:** Professional documentation site

**In:** Less than 30 minutes
**With:** Zero complex configuration


## 🚀 Features

- **Markdown-First**: Write documentation in familiar Markdown syntax
- **Static Site Generation**: Fast, secure, and SEO-friendly output
- **Modern Themes**: Beautiful, responsive themes out of the box
- **Search Integration**: Built-in search functionality
- **CLI Tool**: Simple command-line interface for easy management
- **Live Development**: Hot-reload during development

## 📦 Installation

```bash
# Global installation (recommended)
npm install -g @riligar/knowledge

# Or with bun
bun add -g @riligar/knowledge

# Or with yarn
yarn global add @riligar/knowledge

# Or with pnpm
pnpm add -g @riligar/knowledge
```

## 🎯 Quick Start

1. **Initialize a new project**:
   ```bash
   knowledge init my-docs
   cd my-docs
   ```

2. **Start development server**:
   ```bash
   knowledge dev
   ```

3. **Build for production**:
   ```bash
   knowledge build
   ```

## 🎨 What you get automatically

| Category | Features | Benefits |
|----------|----------|----------|
| **Professional Interface** | • Modern and clean design<br>• Automatic sidebar navigation<br>• Breadcrumbs and table of contents<br>• Search with Ctrl+K | • Professional appearance<br>• Easy navigation<br>• Quick content discovery<br>• Instant search functionality |
| **Advanced Features** | • Copy-to-clipboard in code blocks<br>• Functional internal links<br>• SEO optimized<br>• Full accessibility | • Developer-friendly<br>• Seamless navigation<br>• Better search rankings<br>• Inclusive for all users |
| **Mobile Experience** | • Collapsible menu<br>• Touch-friendly<br>• Fast loading<br>• Smooth scrolling | • Mobile-first design<br>• Intuitive interactions<br>• Optimal performance<br>• Enhanced UX |

## 🚀 How to Use (3 Steps)

### 1. **Structure your files**
```
my-project/
├── docs/                 # 📝 Your .md files here
│   ├── index.md         # Home page
│   ├── installation.md  # Guides
│   └── api/             # Organize in folders
│       └── reference.md
└── knowledge.config.ts   # ⚙️ Configuration (required)
```

### 2. **Write in Markdown**
```markdown
# My Documentation

Welcome! This is a simple example.

## Features

- ✅ Easy to use
- ✅ Modern design
- ✅ Integrated search

## Links

- [Installation](./docs/installation.md)
- [API](./api/reference.md)
```

### 3. **Generate documentation**
```bash
# Production (static files)
knowledge build

# Serve generated files
knowledge serve
```

## 📋 Ideal Use Cases

### **📚 Project Documentation**
```
docs/
├── index.md           # Overview
├── installation.md    # Getting started
├── guides/           # Tutorials
└── api/              # Technical reference
```

### **🔌 API Documentation**
```
docs/
├── authentication.md  # How to authenticate
├── quick-start.md     # First steps
├── endpoints/         # Each endpoint
└── examples/          # Use cases
```

### **📖 Knowledge Base**
```
docs/
├── faq.md            # Frequently asked questions
├── tutorials/        # Step-by-step guides
├── troubleshooting/  # Problem solving
└── resources/        # Links and tools
```

## ⚙️ Minimal Configuration

**`knowledge.config.ts`** (required):
```typescript
export default {
    site: {
        title: 'My Documentation',
        description: 'My project documentation',
        author: 'Your Name'
    },
    
    features: {
        search: true,        // Automatic search
        darkMode: true,      // Dark mode
        syntaxHighlight: true // Code highlighting
    }
};
```

## 🚀 Essential Commands

```bash
# Global commands (after installing Knowledge globally)
knowledge init              # Initialize new project
knowledge dev               # Start development server
knowledge build             # Generate static site
knowledge serve             # Serve generated files
```

## 💡 Tips for Efficient Documentation

### **1. Start Simple**
- `index.md` - What the project is
- `installation.md` - How to get started
- `quick-start.md` - First use

### **2. Organize by Audience**
```
docs/
├── users/             # For end users
├── developers/        # For developers
└── administrators/    # For administrators
```

### **3. Use Conventions**
```markdown
# Use hierarchical headings
## Main section
### Subsection
#### Details

# Include code examples
```bash
npm install my-project
```

### **4. Maintain Consistency**
- Same heading style
- Standard format for examples
- Consistent tone of voice


## 📊 Comparison with Other Tools

| Feature | Knowledge | GitBook | Notion | Wiki |
|---------|-----------|---------|--------|------|
| **Simplicity** | ✅ Pure Markdown | ❌ Complex interface | ❌ Proprietary | ❌ Specific syntax |
| **Performance** | ✅ Static sites | ⚠️ Slow loading | ⚠️ Internet dependent | ❌ Server required |
| **Customization** | ✅ Themes and config | ❌ Limited | ❌ Very limited | ⚠️ Requires programming |
| **Search** | ✅ Instant | ✅ Good | ✅ Good | ⚠️ Basic |
| **Cost** | ✅ Free | ❌ Paid | ❌ Paid | ⚠️ Self-hosting |
| **Offline** | ✅ Works | ❌ No | ❌ No | ❌ No |

## 🚀 Deploy and Hosting

### **GitHub Pages** (Free)
```bash
bun run build
git add dist/
git commit -m "Update docs"
git push origin main
```

### **Netlify/Vercel** (Free)
- Connect your repository
- Configure build: `bun run build`
- Publish folder: `dist/`

### **Own Server**
```bash
bun run build
# Copy dist/ folder to your server
```

## 🏆 Benefits for Teams

| Team Role | Benefits | Impact |
|-----------|----------|--------|
| **For Developers** | • Documentation lives with the code<br>• Familiar and versionable Markdown<br>• Easy CI/CD setup<br>• No vendor lock-in | • Streamlined workflow<br>• Version control integration<br>• Automated deployments<br>• Future-proof solution |
| **For Managers** | • Reduces onboarding time<br>• Improves team communication<br>• Always up-to-date documentation<br>• Zero infrastructure cost | • Faster team productivity<br>• Better collaboration<br>• Reliable information<br>• Cost-effective solution |
| **For Users** | • Intuitive and fast interface<br>• Efficient search<br>• Works on any device<br>• Always available | • Enhanced user experience<br>• Quick information access<br>• Cross-platform compatibility<br>• Reliable availability |

## 📈 Stats
![Repo Stats](https://repobeats.axiom.co/api/embed/55571d3a82e502a0e57b6fe8c54864cd53e7e5ac.svg)


**💡 Remember**: Knowledge is made to be simple. Focus on content, let the tool handle the presentation! 