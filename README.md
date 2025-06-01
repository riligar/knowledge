# Knowledge - Modern Documentation Generator

[![GitHub stars](https://img.shields.io/github/stars/riligar/knowledge)](https://github.com/riligar/knowledge/stargazers) ![GitHub License](https://img.shields.io/github/license/riligar/knowledge) [![Documentation](https://img.shields.io/badge/docs-Knowledge.click-blue)](https://myknowledge.click)

> Transform how your team creates, organizes, and shares knowledge

## 🎯 What is Knowledge?

**Knowledge** is a modern static documentation generator that transforms Markdown files into professional documentation sites. It's the perfect tool for anyone who wants to create beautiful and functional documentation without complications.

## 🚀 Features

- **Markdown-First**: Write documentation in familiar Markdown syntax
- **Static Site Generation**: Fast, secure, and SEO-friendly output
- **Modern Themes**: Beautiful, responsive themes out of the box
- **Search Integration**: Built-in search functionality
- **CLI Tool**: Simple command-line interface for easy management
- **Live Development**: Hot-reload during development

## 📦 Installation

### NPM (Recommended)

```bash
npm install -g @riligar/knowledge
```

### Direct Download

```bash
curl -fsSL https://raw.githubusercontent.com/riligar/knowledge/main/install.sh | sh
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

## 📖 Documentation

Visit our [official documentation](https://myknowledge.click) for detailed guides and examples.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation. Please format your commits as:

```
feat: add new feature
fix: resolve bug
docs: update documentation
```

## 🔄 Release Process

Releases are fully automated using semantic-release:

- **Automatic versioning** based on commit messages
- **Changelog generation** from conventional commits  
- **NPM publishing** on every release
- **GitHub releases** with detailed notes

Simply push to the `prod` branch and let the automation handle the rest!

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

- 📧 Email: maciel.ciro@icloud.com
- 🐛 Issues: [GitHub Issues](https://github.com/riligar/knowledge/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/riligar/knowledge/discussions)

---

Made with ❤️ by [Riligar](https://riligar.click)

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
- [API](./docs/reference.md)
```

### 3. **Generate documentation**
```bash
# Development with live reload
knowledge dev

# Production (static files)
knowledge build

# Serve generated files
knowledge serve
```

## 🎨 What you get automatically

### **Professional Interface**
- Modern and clean design
- Automatic sidebar navigation
- Breadcrumbs and table of contents
- Search with Ctrl+K

### **Advanced Features**
- Copy-to-clipboard in code blocks
- Functional internal links
- SEO optimized
- Full accessibility

### **Mobile Experience**
- Collapsible menu
- Touch-friendly
- Fast loading
- Smooth scrolling

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

# Local commands (in project directory)
bun run dev                 # Start development server
bun run build               # Generate static site
bun run serve               # Serve generated files
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

## 🎯 Recommended Workflow

### **For New Projects**
1. **Plan** the documentation structure
2. **Create** basic files (index, installation, guide)
3. **Start** `bun run dev` for development
4. **Write** and see changes in real time
5. **Publish** with `bun run build`

### **For Existing Projects**
1. **Migrate** existing documentation to Markdown
2. **Organize** in logical folder structure
3. **Configure** Knowledge with your preferences
4. **Test** with `bun run dev`
5. **Deploy** to replace old documentation

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

## 📈 Benefits for Teams

### **For Developers**
- ✅ Documentation lives with the code
- ✅ Familiar and versionable Markdown
- ✅ Easy CI/CD setup
- ✅ No vendor lock-in

### **For Managers**
- ✅ Reduces onboarding time
- ✅ Improves team communication
- ✅ Always up-to-date documentation
- ✅ Zero infrastructure cost

### **For Users**
- ✅ Intuitive and fast interface
- ✅ Efficient search
- ✅ Works on any device
- ✅ Always available

## 🎯 Final Result

With Knowledge, you transform:

**From:** Scattered Markdown files
**To:** Professional documentation site

**In:** Less than 30 minutes
**With:** Zero complex configuration

---

**💡 Remember**: Knowledge is made to be simple. Focus on content, let the tool handle the presentation! 