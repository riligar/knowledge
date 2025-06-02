# 🛠️ Development

## Project Structure

Understanding the Knowledge codebase structure will help you contribute effectively:

```
knowledge/
├── src/                      # 🔧 Core source code
│   ├── cli.ts               # Command-line interface
│   ├── generator.ts         # Static site generator
│   ├── dev-server.ts        # Development server
│   ├── config.ts            # Configuration handling
│   ├── markdown.ts          # Markdown processing
│   ├── search.ts            # Search functionality
│   ├── port-utils.ts        # Port management utilities
│   └── open-browser.ts      # Browser automation
├── bin/                     # 📦 Executable binaries
│   ├── knowledge.js         # Main CLI entry point
│   └── cli.js              # Compiled CLI bundle
├── themes/                  # 🎨 Built-in themes
│   └── default/            # Default theme assets
├── docs/                    # 📚 Project documentation
├── scripts/                 # 🔨 Build and utility scripts
├── .github/                 # 🤖 GitHub workflows and templates
├── dist/                    # 📁 Built documentation output
├── knowledge.config.ts      # ⚙️ Project configuration
├── package.json            # 📋 Dependencies and scripts
├── tsconfig.json           # 🔧 TypeScript configuration
└── README.md               # 📖 Project overview
```

### Core Components

#### **CLI (`src/cli.ts`)**
- Command-line interface using Commander.js
- Handles all user commands (`init`, `dev`, `build`, `serve`)
- Manages configuration loading and validation
- Provides user-friendly error messages and help

#### **Generator (`src/generator.ts`)**
- Core static site generation engine
- Processes Markdown files into HTML
- Handles asset copying and optimization
- Generates search indexes and navigation

#### **Development Server (`src/dev-server.ts`)**
- Live development server with hot reload
- File watching and automatic rebuilds
- Static file serving
- Browser auto-refresh functionality

#### **Configuration (`src/config.ts`)**
- Configuration file loading and validation
- Default configuration management
- Environment variable support
- Type-safe configuration interfaces

## Development Setup

### Prerequisites

Ensure you have the required tools installed:

```bash
# Check Node.js version (18+ required)
node --version

# Check Bun version (recommended runtime)
bun --version

# Install Bun if not available
curl -fsSL https://bun.sh/install | bash
```

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/riligar/knowledge.git
cd knowledge
```

2. **Install dependencies**:
```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

3. **Build the project**:
```bash
# Build CLI binary
bun run build-bin

# Or use npm
npm run build-bin
```

4. **Link for local testing**:
```bash
# Link the package globally
npm link

# Now you can use 'knowledge' command locally
knowledge --version
```

5. **Start development**:
```bash
# Run the CLI directly with Bun
bun run src/cli.ts dev

# Or use the built binary
knowledge dev
```

### Development Workflow

#### **Making Changes**

1. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes** in the appropriate files

3. **Test your changes**:
```bash
# Test CLI commands
bun run src/cli.ts --help
bun run src/cli.ts init test-project
bun run src/cli.ts dev

# Test with real documentation
cd test-project
knowledge dev
```

4. **Build and test the binary**:
```bash
# Rebuild the CLI
bun run build-bin

# Test the built binary
./bin/knowledge.js --version
```

#### **Testing Documentation Changes**

When working on the documentation generator:

```bash
# Use the project's own docs for testing
knowledge dev

# Test with different configurations
cp knowledge.config.ts knowledge.config.backup.ts
# Modify knowledge.config.ts
knowledge build
knowledge serve
```

## Code Standards

### TypeScript Guidelines

Knowledge uses strict TypeScript with the following conventions:

#### **Type Definitions**
```typescript
// Use interfaces for configuration objects
interface SiteConfig {
    title: string;
    description: string;
    author: string;
    baseUrl?: string;
}

// Use type aliases for unions
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Use enums for constants
enum BuildMode {
    Development = 'development',
    Production = 'production'
}
```

#### **Function Signatures**
```typescript
// Use explicit return types for public functions
export function generateSite(config: KnowledgeConfig): Promise<void> {
    // Implementation
}

// Use async/await for asynchronous operations
async function processMarkdown(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath, 'utf-8');
    return marked(content);
}
```

#### **Error Handling**
```typescript
// Use custom error classes
class ConfigurationError extends Error {
    constructor(message: string, public configPath?: string) {
        super(message);
        this.name = 'ConfigurationError';
    }
}

// Handle errors gracefully
try {
    const config = await loadConfig();
} catch (error) {
    if (error instanceof ConfigurationError) {
        console.error(`❌ Configuration error: ${error.message}`);
        process.exit(1);
    }
    throw error;
}
```

### Code Formatting

The project uses consistent formatting rules:

```bash
# Format code (if using Prettier)
npx prettier --write "src/**/*.ts"

# Check TypeScript compilation
npx tsc --noEmit

# Lint code (if using ESLint)
npx eslint "src/**/*.ts"
```

### Commit Message Convention

Follow conventional commit format:

```bash
# Feature additions
git commit -m "feat(cli): add support for custom themes"

# Bug fixes
git commit -m "fix(generator): resolve asset copying issue"

# Documentation updates
git commit -m "docs(readme): update installation instructions"

# Breaking changes
git commit -m "feat(config)!: change configuration file format"
```

## Testing

### Manual Testing

Since Knowledge is a CLI tool, most testing is done manually:

#### **Test CLI Commands**
```bash
# Test initialization
knowledge init test-docs
cd test-docs

# Test development server
knowledge dev --port 3001

# Test building
knowledge build --verbose

# Test serving
knowledge serve --port 8080
```

#### **Test Different Configurations**
```typescript
// Test minimal configuration
export default {
    site: {
        title: 'Test Docs',
        description: 'Test documentation'
    }
};

// Test full configuration
export default {
    inputDir: './docs',
    outputDir: './dist',
    site: {
        title: 'Full Test',
        description: 'Complete configuration test',
        author: 'Test Author'
    },
    features: {
        search: true,
        syntaxHighlight: true,
        darkMode: true
    }
};
```

#### **Test Edge Cases**
```bash
# Test with empty docs directory
mkdir empty-docs
cd empty-docs
knowledge init .

# Test with large documentation
# Create many markdown files and test performance

# Test with special characters in filenames
touch "docs/file with spaces.md"
touch "docs/file-with-émojis-🚀.md"
```

### Integration Testing

Test Knowledge with real-world scenarios:

#### **Test with Popular Projects**
```bash
# Test with a typical project structure
mkdir test-project
cd test-project
knowledge init .

# Create realistic documentation structure
mkdir -p docs/{getting-started,guides,api,examples}
echo "# Getting Started" > docs/getting-started/index.md
echo "# API Reference" > docs/api/index.md

# Test build and serve
knowledge build
knowledge serve
```

#### **Test Deployment Scenarios**
```bash
# Test GitHub Pages deployment
knowledge build
# Check that dist/ contains proper files

# Test with different base URLs
# Modify knowledge.config.ts baseUrl
knowledge build
# Verify links work correctly
```

## Release Process

### Semantic Versioning

Knowledge follows semantic versioning (semver):

- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features, backward compatible
- **Patch** (1.1.1): Bug fixes, backward compatible

### Automated Releases

The project uses semantic-release for automated versioning:

#### **Release Configuration**
```json
// .releaserc.json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git"
  ]
}
```

#### **Release Workflow**
```bash
# 1. Make changes and commit with conventional format
git commit -m "feat(cli): add new command"

# 2. Push to main branch
git push origin main

# 3. GitHub Actions automatically:
#    - Analyzes commits
#    - Determines version bump
#    - Updates CHANGELOG.md
#    - Creates GitHub release
#    - Publishes to npm
```

### Manual Release Testing

Before major releases, test the release process:

```bash
# Test release script
./scripts/test-release.sh

# Test npm package
npm pack
npm install -g riligar-knowledge-*.tgz
knowledge --version
```

## Contributing Guidelines

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from main
4. **Make your changes** following the code standards
5. **Test thoroughly** with different scenarios
6. **Submit a pull request** with a clear description

### Pull Request Process

#### **Before Submitting**
- [ ] Code follows TypeScript standards
- [ ] All commands work correctly
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventional format
- [ ] No breaking changes without major version bump

#### **PR Description Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested CLI commands
- [ ] Tested with sample documentation
- [ ] Tested build and serve

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
```

### Code Review Process

1. **Automated checks** must pass (if configured)
2. **Manual review** by maintainers
3. **Testing** on different environments
4. **Approval** and merge to main
5. **Automatic release** (if applicable)

## Architecture Decisions

### Technology Choices

#### **Why Bun?**
- **Performance**: Faster than Node.js for file operations
- **TypeScript**: Native TypeScript support
- **Simplicity**: Single runtime for development and production

#### **Why Static Generation?**
- **Performance**: Fast loading times
- **Security**: No server-side vulnerabilities
- **Hosting**: Deploy anywhere (GitHub Pages, Netlify, etc.)
- **Offline**: Works without internet connection

#### **Why TypeScript?**
- **Type Safety**: Catch errors at compile time
- **Developer Experience**: Better IDE support
- **Maintainability**: Self-documenting code
- **Ecosystem**: Rich npm ecosystem

### Design Principles

1. **Simplicity First**: Easy to use out of the box
2. **Convention over Configuration**: Sensible defaults
3. **Developer Experience**: Fast feedback loops
4. **Performance**: Optimized for speed
5. **Flexibility**: Customizable when needed

---

**Ready to contribute?** Check out our [open issues](https://github.com/riligar/knowledge/issues) or start with the [good first issue](https://github.com/riligar/knowledge/labels/good%20first%20issue) label! 