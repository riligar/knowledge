# Development Guide

## Overview

This guide provides detailed information for developers who want to contribute to the Knowledge project, including development environment setup, code standards, architecture, and contribution process.

## Environment Setup

### Development Prerequisites

- **Bun**: v1.0.0+ (main runtime)
- **Node.js**: v18.0.0+ (compatibility)
- **Git**: For version control
- **VS Code**: Recommended editor
- **TypeScript**: Basic knowledge required

### Initial Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/knowledge.git
cd knowledge

# 2. Install dependencies
bun install

# 3. Configure Git hooks
bun run prepare

# 4. Run tests
bun test

# 5. Start development
bun run dev
```

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "yzhang.markdown-all-in-one"
  ]
}
```

### VS Code Configuration

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.associations": {
    "*.md": "markdown"
  }
}
```

## Project Structure

### Code Organization

```
knowledge/
├── src/                        # Main source code
│   ├── cli.ts                 # CLI interface
│   ├── generator.ts           # Documentation generator
│   ├── search.ts              # Search system
│   ├── markdown.ts            # Markdown processor
│   ├── config.ts              # Configurations and types
│   └── dev-server.ts          # Development server
├── themes/                     # Theme system
│   └── default/               # Default theme
│       ├── layouts/           # HTML templates
│       └── assets/            # CSS, JS, images
├── tests/                      # Automated tests
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── e2e/                   # End-to-end tests
├── docs/                       # Project documentation
├── examples/                   # Usage examples
└── scripts/                    # Build and deploy scripts
```

### Naming Conventions

- **Files**: kebab-case (`search-index.ts`)
- **Classes**: PascalCase (`DocumentationGenerator`)
- **Functions**: camelCase (`generateNavigation`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_CONFIG`)
- **Interfaces**: PascalCase with I prefix (`ISearchResult`)
- **Types**: PascalCase (`KnowledgeConfig`)

## Code Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Explicit typing and well-defined interfaces
interface SearchDocument {
    readonly id: string
    readonly title: string
    readonly content: string
    readonly excerpt: string
    readonly url: string
}

class SearchIndexGenerator {
    private readonly documents: SearchDocument[] = []
    
    public addPage(page: DocumentPage): void {
        // Implementation...
    }
    
    public async buildIndex(): Promise<lunr.Index> {
        // Async implementation...
    }
}

// ❌ Avoid: any types and unnecessary mutability
class BadExample {
    public data: any[] = []
    
    addItem(item: any) {
        this.data.push(item)
    }
}
```

### Async/Await Patterns

```typescript
// ✅ Good: Error handling and async/await
async function processMarkdownFiles(): Promise<DocumentPage[]> {
    try {
        const files = await this.findMarkdownFiles(this.inputDir)
        const pages = await Promise.all(
            files.map(file => this.processFile(file))
        )
        return pages.filter(page => page !== null)
    } catch (error) {
        console.error('Error processing files:', error)
        throw new Error(`Processing failed: ${error.message}`)
    }
}

// ❌ Avoid: Nested promises and lack of error handling
function badAsyncExample() {
    return new Promise((resolve, reject) => {
        this.findMarkdownFiles(this.inputDir).then(files => {
            files.forEach(file => {
                this.processFile(file).then(page => {
                    // Nested logic...
                })
            })
        })
    })
}
```

### Error Handling Patterns

```typescript
// ✅ Good: Specific and informative errors
class DocumentationError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly context?: Record<string, unknown>
    ) {
        super(message)
        this.name = 'DocumentationError'
    }
}

function validateConfig(config: KnowledgeConfig): void {
    if (!config.inputDir) {
        throw new DocumentationError(
            'Input directory is required',
            'MISSING_INPUT_DIR',
            { config }
        )
    }
}

// ❌ Avoid: Generic errors without context
function badErrorHandling(config: any) {
    if (!config.inputDir) {
        throw new Error('Invalid config')
    }
}
```

## Test Cases

### Test Structure

```typescript
// tests/unit/generator.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { DocumentationGenerator } from '../../src/generator'
import { mockConfig, mockFileSystem } from '../helpers/mocks'

describe('DocumentationGenerator', () => {
    let generator: DocumentationGenerator
    
    beforeEach(() => {
        generator = new DocumentationGenerator(mockConfig)
    })
    
    afterEach(() => {
        // Cleanup
    })
    
    describe('processMarkdownFiles', () => {
        it('should process valid markdown files', async () => {
            // Arrange
            const mockFiles = ['test.md', 'example.md']
            mockFileSystem.setup(mockFiles)
            
            // Act
            const result = await generator.processMarkdownFiles()
            
            // Assert
            expect(result).toHaveLength(2)
            expect(result[0]).toMatchObject({
                title: expect.any(String),
                content: expect.any(String),
                url: expect.any(String)
            })
        })
        
        it('should handle invalid markdown gracefully', async () => {
            // Arrange
            const invalidMarkdown = '# Invalid\n```\nunclosed code block'
            mockFileSystem.setupFile('invalid.md', invalidMarkdown)
            
            // Act & Assert
            await expect(generator.processMarkdownFiles())
                .rejects.toThrow('Invalid markdown syntax')
        })
    })
})
```

### Test Commands

```bash
# Run all tests
bun test

# Test with watch mode
bun test --watch

# Specific tests
bun test --grep "SearchIndexGenerator"

# Test with coverage
bun test --coverage

# Integration tests
bun test tests/integration/

# End-to-end tests
bun test tests/e2e/
```

### Mocks and Helpers

```typescript
// tests/helpers/mocks.ts
export const mockConfig: KnowledgeConfig = {
    inputDir: './test-docs',
    outputDir: './test-dist',
    site: {
        title: 'Test Documentation',
        description: 'Test description',
        baseUrl: '/',
        author: 'Test Author'
    },
    // ... outras configurações
}

export class MockFileSystem {
    private files = new Map<string, string>()
    
    setup(filePaths: string[]): void {
        filePaths.forEach(path => {
            this.files.set(path, `# ${path}\n\nTest content`)
        })
    }
    
    setupFile(path: string, content: string): void {
        this.files.set(path, content)
    }
    
    readFile(path: string): string {
        return this.files.get(path) || ''
    }
}
```

## Development Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "bun run src/cli.ts dev",
    "build": "bun run src/cli.ts build",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write src/**/*.ts",
    "prepare": "husky install",
    "release": "semantic-release"
  }
}
```

### Husky Hooks

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bun run lint
bun run type-check
bun test --silent
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

bunx commitlint --edit $1
```

## Build and Release

### Build Process

```typescript
// scripts/build.ts
import { build } from 'bun'

async function buildProject() {
    console.log('🏗️  Building Knowledge...')
    
    // Build CLI
    await build({
        entrypoints: ['./src/cli.ts'],
        outdir: './dist',
        target: 'bun',
        minify: true
    })
    
    // Build themes
    await buildThemes()
    
    // Copy assets
    await copyAssets()
    
    console.log('✅ Build completed!')
}

buildProject().catch(console.error)
```

### Semantic Versioning

```json
{
  "release": {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      "@semantic-release/github"
    ]
  }
}
```

### Conventional Commits

```bash
# Commit types
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: refactoring
test: tests
chore: maintenance tasks

# Examples
feat(search): add fuzzy search support
fix(generator): resolve markdown parsing issue
docs(api): update configuration examples
test(search): add unit tests for indexing
```

## Contribution Process

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork
3. **Branch** for your feature (`git checkout -b feature/amazing-feature`)
4. **Commit** changes (`git commit -m 'feat: add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Pull Request** to the main repository

### Pull Request Template

```markdown
## 📝 Description

Brief description of the implemented changes.

## 🎯 Change Type

- [ ] Bug fix (change that fixes a problem)
- [ ] New feature (change that adds functionality)
- [ ] Breaking change (change that breaks compatibility)
- [ ] Documentation (change only in documentation)

## 🧪 How to Test

1. Steps to reproduce
2. Expected behavior
3. Screenshots (if applicable)

## ✅ Checklist

- [ ] Code follows project standards
- [ ] Tests were added/updated
- [ ] Documentation was updated
- [ ] Commits follow conventional commits
- [ ] Build passes without errors
- [ ] Tests pass

## 📸 Screenshots

(If applicable)

## 🔗 Related Issues

Closes #123
```

### Code Review Guidelines

#### For Authors

- **Small commits**: Keep PRs focused and small
- **Tests**: Add tests for new features
- **Documentation**: Update relevant documentation
- **Clear Description**: Explain what and why changes are made

#### For Reviewers

- **Be constructive**: Provide specific and useful feedback
- **Test locally**: Verify it works as expected
- **Standards**: Verify adherence to project standards
- **Performance**: Consider impact on performance

## 🐛 Debug and Troubleshooting

### Debug Logs

```typescript
// src/utils/logger.ts
export class Logger {
    private static instance: Logger
    private debugEnabled = process.env.DEBUG === 'true'
    
    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }
    
    debug(message: string, context?: Record<string, unknown>): void {
        if (this.debugEnabled) {
            console.log(`🐛 [DEBUG] ${message}`, context || '')
        }
    }
    
    info(message: string): void {
        console.log(`ℹ️  [INFO] ${message}`)
    }
    
    error(message: string, error?: Error): void {
        console.error(`❌ [ERROR] ${message}`, error || '')
    }
}
```

### Debugging in VS Code

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CLI",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/cli.ts",
      "args": ["build", "--verbose"],
      "env": {
        "DEBUG": "true"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/bun",
      "args": ["test", "--inspect"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Performance Profiling

```typescript
// src/utils/profiler.ts
export class Profiler {
    private static timers = new Map<string, number>()
    
    static start(label: string): void {
        this.timers.set(label, performance.now())
    }
    
    static end(label: string): number {
        const start = this.timers.get(label)
        if (!start) {
            throw new Error(`Timer ${label} not found`)
        }
        
        const duration = performance.now() - start
        console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`)
        this.timers.delete(label)
        
        return duration
    }
}

// Usage
Profiler.start('markdown-processing')
await processMarkdownFiles()
Profiler.end('markdown-processing')
```

## 📊 Metrics and Monitoring

### Bundle Analysis

```bash
# Analyze bundle size
bun run build --analyze

# Check dependencies
bun run deps:check

# Security audit
bun audit
```

### Performance Benchmarks

```typescript
// tests/benchmarks/search.bench.ts
import { bench, describe } from 'bun:test'
import { SearchIndexGenerator } from '../../src/search'

describe('Search Performance', () => {
    bench('index 1000 documents', async () => {
        const generator = new SearchIndexGenerator()
        const documents = generateMockDocuments(1000)
        
        documents.forEach(doc => generator.addPage(doc))
        await generator.buildIndex()
    })
    
    bench('search in large index', async () => {
        const index = await createLargeIndex()
        index.search('test query')
    })
})
```

## 🔒 Security

### Security Practices

```typescript
// ✅ Good: Input sanitization
function sanitizeMarkdown(content: string): string {
    return content
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
}

// ✅ Good: Path validation
function validatePath(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath)
    return !normalizedPath.includes('..')
}

// ❌ Avoid: Executing untrusted code
function dangerousExample(userInput: string) {
    eval(userInput) // NEVER do this!
}
```

### Dependencies

```bash
# Check for vulnerabilities
bun audit

# Update dependencies
bun update

# Check licenses
bunx license-checker
```

## 📚 Additional Resources

### Technical Documentation

- [Bun Documentation](https://bun.sh/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Lunr.js Guide](https://lunrjs.com/guides/)
- [Marked.js Documentation](https://marked.js.org/)

### Useful Tools

- **Bun DevTools**: Debugging and profiling
- **TypeScript Playground**: Test TypeScript code
- **Regex101**: Test regular expressions
- **JSON Formatter**: Validate and format JSON

### Community

- 💬 **Discord**: [Server link](https://discord.gg/knowledge)
- 🐛 **Issues**: [GitHub Issues](https://github.com/riligar/knowledge/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/riligar/knowledge/discussions)
- 📧 **Email**: [dev@riligar.click](mailto:dev@riligar.click)

## 🎯 Development Roadmap

### Next Features

1. **Plugin System** (v2.0)
   - API of plugins
   - Plugin marketplace
   - Hot reload of plugins

2. **Advanced Search** (v1.5)
   - Semantic search
   - Advanced filters
   - Search analytics

3. **Themes 2.0** (v1.4)
   - Visual theme builder
   - Reusable components
   - Inheritance system

4. **Performance** (v1.3)
   - Lazy loading
   - Code splitting
   - Service workers

### How to Contribute

1. **Choose an issue**: Search for issues marked as `good first issue`
2. **Discuss**: Comment on the issue before starting
3. **Implement**: Follow established patterns
4. **Test**: Add tests for your feature
5. **Document**: Update relevant documentation

---

**Thank you for contributing to Knowledge!** 🙏 Your contribution helps make documentation better for everyone. 