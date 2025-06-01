# Knowledge - Modern Documentation System

[![GitHub stars](https://img.shields.io/github/stars/riligar/knowledge)](https://github.com/riligar/knowledge/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-knowledge.dev-blue)](https://knowledge.dev)

> Transform how your team creates, organizes, and shares knowledge

A modern and open-source documentation system that transforms how teams create, organize, and share knowledge. Built for developers, designed for everyone.

## Why Knowledge?

- **Developer First** - Built by developers, for developers
- **Modern Stack** - Latest web technologies for better performance
- **Extensible** - Plugin system for unlimited customization
- **Community Driven** - Open source with active community support

## Main Features

### Modern Interface
- **Clean Design**: Professional interface with attention to detail
- **Responsive**: Mobile-first design that works on all devices
- **Dark Mode**: Automatic theme switching with smooth transitions
- **Accessibility**: WCAG compatible and keyboard navigation

### Advanced Search
- **Real-time Search**: Instant results as you type
- **Full-Text Search**: Search in titles, content, and summaries
- **Keyboard Shortcuts**: Ctrl/Cmd + K to focus on search
- **Smart Relevance**: Weight-based scoring algorithm

### Developer Resources
- **Syntax Highlighting**: Syntax highlighting with copy-to-clipboard
- **Automatic Navigation**: Automatic navigation generation
- **Live Reload**: Development server with automatic reload
- **TypeScript**: Type-safe development

## Technology Stack

- **Runtime**: Bun for maximum performance
- **Language**: TypeScript for type safety
- **Markdown**: Advanced processing with extensions
- **Search**: Lunr.js for offline full-text search
- **Modern CSS**: Grid, Flexbox, Custom Properties
- **Vanilla JavaScript**: No framework dependencies

## Project Structure

```
knowledge/
├── src/                    # Source code
│   ├── cli.ts             # Command line interface
│   ├── generator.ts       # Documentation generator
│   ├── search.ts          # Search system
│   ├── markdown.ts        # Markdown processor
│   ├── config.ts          # Configurations
│   └── dev-server.ts      # Development server
├── themes/                # Themes
│   └── default/
│       ├── layouts/       # HTML templates
│       └── assets/
│           ├── css/       # Stylesheets
│           └── js/        # JavaScript scripts
├── docs/                  # Source documentation
├── dist/                  # Generated output
└── knowledge.config.ts     # Main configuration
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- Node.js v18+ (optional, for compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/riligar/knowledge.git
cd knowledge

# Install dependencies
bun install

# Initialize project
bun run init
```

### Development

```bash
# Start development server
bun run dev

# Access: http://localhost:3000
```

### Production Build

```bash
# Generate documentation
bun run build

# Serve locally
bun run serve
```

## Configuration

The `knowledge.config.ts` file contains all configuration options:

```typescript
export default {
    // Directories
    inputDir: './docs',
    outputDir: './dist',
    themesDir: './themes',

    // Site information
    site: {
        title: 'Your Documentation',
        description: 'Your site description',
        baseUrl: '/',
        author: 'Your Name'
    },

    // Theme and layout
    theme: 'default',
    layout: 'default',

    // Navigation
    navigation: {
        auto: true  // Automatic generation
    },

    // Features
    features: {
        search: true,
        syntaxHighlight: true,
        darkMode: true,
        tableOfContents: true,
        breadcrumbs: true,
        editOnGithub: 'https://github.com/your-username/docs'
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

## CLI Commands

### `build`
Generates static documentation:
```bash
bun run build [options]

Options:
  -c, --config <path>   Path to configuration file
  -i, --input <path>    Input directory with markdown files
  -o, --output <path>   Output directory for generated site
```

### `dev`
Starts development server:
```bash
bun run dev [options]

Options:
  -c, --config <path>   Path to configuration file
  -p, --port <number>   Server port (default: 3000)
  -h, --host <string>   Server host (default: localhost)
```

### `serve`
Serves built documentation:
```bash
bun run serve [options]

Options:
  -p, --port <number>   Server port (default: 8080)
  -d, --dir <path>      Directory to serve (default: ./dist)
```

### `init`
Initializes a new project:
```bash
bun run init [options]
```

## Design System

### Color Palette
- **Primary**: Blue (#3b82f6) with gradient variations
- **Secondary**: Slate gray (#64748b)
- **Accent**: Cyan (#06b6d4)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Family**: Montserrat (headings and body)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Scale**: Harmonious system with appropriate line heights

### Spacing
- **Grid**: 8px base unit system
- **Containers**: Maximum width of 1400px with responsive padding
- **Components**: Consistent spacing using CSS custom properties

## Search System

### Features
- **Engine**: Lunr.js 2.3.9 for full-text search
- **Performance**: Optimized index generated during build
- **Offline**: Works without internet connection
- **Relevance**: Weight-based scoring system (titles > excerpts > content)

### Usage
- **Shortcut**: Ctrl/Cmd + K to focus
- **Navigation**: ↑/↓ arrows to navigate, Enter to open
- **Syntax**: Wildcard support, exact search with quotes
- **Highlight**: Visual highlighting of found terms

## Mobile Experience

- **Touch-Friendly**: Minimum 44px touch targets
- **Responsive Navigation**: Collapsible sidebar
- **Optimized Typography**: Readable on all screen sizes
- **Fast Interactions**: Optimized for mobile performance

## Accessibility

- **Keyboard Navigation**: Complete keyboard support
- **Screen Readers**: Semantic HTML and ARIA labels
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences

## Dark Mode

- **Automatic Detection**: Detects system preference
- **Manual Toggle**: Manual switching with persistence
- **Smooth Transitions**: Optimized animations
- **Enhanced Visuals**: Specific design for dark mode

## Performance

- **Fast Loading**: Optimized CSS and JavaScript
- **Smooth Animations**: Hardware-accelerated transitions
- **Responsive Images**: Automatic image optimization
- **Minimal Bundle**: No unnecessary dependencies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow TypeScript code standards
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and descriptive

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern web standards
- Inspired by the best documentation sites
- Designed for developer happiness

---

**Built with ❤️ by [RiliGar](http://riligar.click/) and the open source community.**

## Support

- Email: [suporte@riligar.click](mailto:suporte@riligar.click)
- Issues: [GitHub Issues](https://github.com/riligar/knowledge/issues)
- Discussions: [GitHub Discussions](https://github.com/riligar/knowledge/discussions)
- Documentation: [knowledge.dev](https://knowledge.dev) 