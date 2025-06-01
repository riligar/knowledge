# 📚 Automatic Repository Documentation Prompt

## 🎯 Objective
You are a technical documentation expert. Analyze this repository and create comprehensive documentation using the Knowledge tool. The result should be a professional `docs/` folder that any developer can use to understand and contribute to the project.

## 📋 Instructions

### 1. Repository Analysis
First, thoroughly explore the repository:
- File and folder structure
- Technologies and dependencies (package.json, requirements.txt, etc.)
- Available scripts and commands
- Configurations and environment variables
- Project purpose and functionalities

### 2. Create Documentation Structure

Create the following files in the `docs/` folder:

#### `docs/index.md`
```markdown
# [Project Name]

## 🎯 What is it?
[Clear description in 2-3 sentences]

## 🚀 Features
- [List of main features]

## 📦 Technologies
- [Technology stack used]

## ⚡ Quick Start
```bash
# Essential commands to get started
```

## 📚 Documentation
- [Installation](./installation.md)
- [Usage](./usage.md)
- [Development](./development.md)
- [API](./api.md) (if applicable)
```

#### `docs/installation.md`
```markdown
# 📦 Installation

## Prerequisites
- [Required versions of Node, Python, etc.]

## Installation
```bash
# Step-by-step installation
```

## Configuration
[Environment variables, config files]

## Verification
```bash
# How to verify it worked
```
```

#### `docs/usage.md`
```markdown
# 🚀 How to Use

## Main Commands
```bash
# List of commands with examples
```

## Practical Examples
[Real use cases with code]

## Settings
[Customization options]
```

#### `docs/development.md`
```markdown
# 🛠️ Development

## Project Structure
```
[Explanation of file organization]
```

## Development Setup
```bash
# Commands to set up environment
```

## Code Standards
[Conventions, linting, formatting]

## Testing
```bash
# How to run tests
```

## Deployment
[Publishing process]
```

#### `docs/api.md` (if it's an API)
```markdown
# 🔗 API Reference

## Authentication
[How to authenticate]

## Endpoints
### GET /endpoint
[Description, parameters, example]

## Examples
```bash
# Example requests
```
```

### 3. Configuration File

Create `knowledge.config.ts` in the root:

```typescript
import type { KnowledgeConfig } from '@riligar/knowledge';

export default {
    inputDir: './docs',
    outputDir: './dist',
    
    site: {
        title: '[Project Name]',
        description: '[Project description]',
        baseUrl: '/',
        author: '[Author]'
    },
    
    features: {
        search: true,
        syntaxHighlight: true,
        darkMode: true,
        tableOfContents: true,
        breadcrumbs: true,
        editOnGithub: '[GitHub URL]'
    },
    
    markdown: {
        breaks: true,
        linkify: true,
        typographer: true
    }
} as KnowledgeConfig;
```

### 4. Update README.md

Add documentation section to README:

```markdown
## 📚 Documentation

To view the complete documentation:

```bash
# Install Knowledge
npm install -g @riligar/knowledge

# Generate documentation
knowledge build

# View locally
knowledge serve
```

Access: http://localhost:8080
```

## ✅ Quality Checklist

- [ ] Clear and objective language
- [ ] Functional code examples
- [ ] Ready-to-copy-paste commands
- [ ] Logical and organized structure
- [ ] Correct internal links
- [ ] Up-to-date information
- [ ] Complete project coverage

## 🎯 Guidelines

### Writing
- Use simple and direct language
- Include emojis for better readability
- Provide practical examples
- Explain the "why", not just the "how"

### Organization
- Structure information in lists
- Use tables when appropriate
- Highlight important information
- Keep sections concise

### Code
- All examples must work
- Include explanatory comments
- Use appropriate syntax highlighting
- Test commands before documenting

## 🚀 Expected Result

At the end, the user will have:
- Professional and navigable documentation
- Optimized static site
- Integrated search working
- Process to keep docs updated

---

**💡 Tip**: Focus on user experience. Documentation should quickly answer the questions: "What is it?", "How to install?", "How to use?" and "How to contribute?" 