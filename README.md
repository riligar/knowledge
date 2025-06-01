# Knowledge - Modern Documentation Generator

[![GitHub stars](https://img.shields.io/github/stars/yourorg/knowledge)](https://github.com/yourorg/knowledge/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-knowledge.dev-blue)](https://knowledge.dev)

> Transform how your team creates, organizes, and shares knowledge

A modern, open-source documentation platform that transforms how teams create, organize, and share knowledge. Built for developers, designed for everyone.

## 🌟 Why Knowledge?

- **Developer First** - Built by developers, for developers
- **Modern Stack** - Latest web technologies for best performance
- **Extensible** - Plugin system for unlimited customization
- **Community Driven** - Open source with active community support

## 🎯 Key Features

- **Modern Design**: Clean, professional interface with attention to detail
- **Responsive**: Mobile-first design that works on all devices
- **Dark Mode**: Automatic theme switching with smooth transitions
- **Search**: Real-time search functionality
- **Code Highlighting**: Syntax highlighting with copy-to-clipboard
- **Navigation**: Auto-generated navigation with smooth scrolling
- **Accessibility**: WCAG compliant with keyboard navigation support

## 🛠️ Technical Stack

- **TypeScript**: Type-safe development
- **Modern CSS**: CSS Grid, Flexbox, Custom Properties
- **Vanilla JavaScript**: No framework dependencies
- **Markdown**: Standard markdown with extensions

## 📁 Project Structure

```
knowledge/
├── src/                 # Source code
├── themes/
│   └── default/
│       ├── layouts/     # HTML templates
│       └── assets/
│           ├── css/     # Stylesheets
│           └── js/      # JavaScript
├── templates/           # Page templates
├── docs/               # Generated output (for GitHub Pages)
└── content/            # Documentation source (Markdown files)
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) with gradient variations
- **Secondary**: Slate gray (#64748b)
- **Accent**: Cyan (#06b6d4)

### Typography
- **Font Family**: Montserrat (headings and body)
- **Font Weights**: 300, 400, 500, 600, 700, 800
- **Scale**: Harmonious type scale with proper line heights

### Spacing
- **Grid**: 8px base unit system
- **Containers**: Max-width 1400px with responsive padding
- **Components**: Consistent spacing using CSS custom properties

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Start development server**:
   ```bash
   bun run dev
   ```

3. **Build for production**:
   ```bash
   bun run build
   ```

## 📝 Configuration

The `knowledge.config.ts` file contains all configuration options:

```typescript
export default {
    site: {
        title: 'Your Documentation',
        description: 'Your site description',
        baseUrl: '/',
        author: 'Your Name'
    },
    theme: 'default',
    features: {
        search: true,
        syntaxHighlight: true,
        darkMode: true,
        tableOfContents: true
    }
} as KnowledgeConfig;
```

## 🎯 Performance

- **Fast Loading**: Optimized CSS and JavaScript
- **Smooth Animations**: Hardware-accelerated transitions
- **Responsive Images**: Automatic image optimization
- **Minimal Bundle**: No unnecessary dependencies

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML and ARIA labels
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences

## 🌙 Dark Mode

Automatic dark mode detection with manual toggle:
- System preference detection
- Smooth theme transitions
- Persistent user choice
- Enhanced dark mode visuals

## 📱 Mobile Experience

- **Touch-Friendly**: 44px minimum touch targets
- **Responsive Navigation**: Collapsible sidebar
- **Optimized Typography**: Readable on all screen sizes
- **Fast Interactions**: Optimized for mobile performance

## 🔍 Search

Real-time search functionality:
- **Instant Results**: Search as you type
- **Keyboard Shortcuts**: Ctrl/Cmd + K to focus
- **Highlighted Results**: Visual feedback for matches

## 📋 Code Features

- **Syntax Highlighting**: Multiple language support
- **Copy to Clipboard**: One-click code copying
- **Language Labels**: Automatic language detection
- **Line Numbers**: Optional line numbering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web standards
- Inspired by the best documentation sites
- Designed for developer happiness


Built with ❤️ by [RiliGar](http://riligar.click/) and the open source community.