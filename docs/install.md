# Knowledge - Installation Guide

## Quick Install (Recommended)

### Using Bun (Fastest)

```bash
# Install globally
bun install -g knowledge

# Create a new project
mkdir my-docs && cd my-docs
knowledge init

# Start developing
bun install
bun run dev
```

### Using npm

```bash
# Install globally
npm install -g knowledge

# Create a new project
mkdir my-docs && cd my-docs
knowledge init

# Start developing
npm install
npm run dev
```

## Manual Installation

If you want to install from source:

```bash
# Clone the repository
git clone https://github.com/riligar/knowledge.git
cd knowledge

# Install dependencies
bun install

# Build the project
bun run build-bin

# Link globally
bun link

# Now you can use 'knowledge' anywhere
knowledge --help
```

## Usage

Once installed, you can use these commands anywhere:

```bash
# Initialize a new project
knowledge init

# Start development server
knowledge dev

# Build for production
knowledge build

# Serve built site
knowledge serve
```

## Project Structure

After running `knowledge init`, you'll have:

```
my-project/
├── docs/                    # Your markdown files
│   ├── index.md            # Homepage
│   ├── installation.md     # Installation guide
│   ├── api/                # API documentation
│   └── troubleshooting.md  # Troubleshooting guide
├── knowledge.config.ts     # Configuration
├── package.json           # Project dependencies
└── .gitignore            # Git ignore rules
```

## Configuration

Edit `knowledge.config.ts` to customize your site:

```typescript
export default {
  site: {
    title: 'My Documentation',
    description: 'Beautiful documentation made simple',
    author: 'Your Name',
    baseUrl: '/'
  },
  
  features: {
    search: true,
    syntaxHighlight: true,
    darkMode: true,
    tableOfContents: true,
    breadcrumbs: true
  },
  
  inputDir: './docs',
  outputDir: './dist'
};
```

## Development Workflow

1. **Write** your documentation in Markdown files inside `docs/`
2. **Preview** changes with `knowledge dev` (auto-reload)
3. **Build** for production with `knowledge build`
4. **Deploy** the `dist/` folder to any static hosting

## Deployment

### GitHub Pages

```bash
# Build the site
knowledge build

# Push to gh-pages branch
git add dist/
git commit -m "Update documentation"
git subtree push --prefix dist origin gh-pages
```

### Netlify/Vercel

1. Connect your repository
2. Set build command: `knowledge build`
3. Set publish directory: `dist`

### Manual Hosting

```bash
# Build the site
knowledge build

# Upload the dist/ folder to your server
rsync -av dist/ user@server:/var/www/html/
```

## Troubleshooting

### Command not found

Make sure Knowledge is installed globally:

```bash
# With Bun
bun install -g knowledge

# With npm
npm install -g knowledge
```

### Permission errors

On macOS/Linux, you might need to use sudo:

```bash
sudo npm install -g knowledge
```

### Port already in use

Change the development port:

```bash
knowledge dev -p 3001
```

## Getting Help

- 📖 [Documentation](https://myknowledge.click)
- 🐛 [Report Issues](https://github.com/riligar/knowledge/issues)
- 💬 [Discussions](https://github.com/riligar/knowledge/discussions) 