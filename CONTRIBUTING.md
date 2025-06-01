# Contributing to Knowledge

Thank you for your interest in contributing to Knowledge! This document provides guidelines for contributing to the project.

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to automate versioning and changelog generation. Please follow this format for your commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature (triggers a minor version bump)
- **fix**: A bug fix (triggers a patch version bump)
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the footer or add `!` after the type:

```
feat!: remove deprecated API endpoint

BREAKING CHANGE: The /old-api endpoint has been removed. Use /new-api instead.
```

### Examples

```bash
feat: add search functionality to documentation
fix: resolve markdown parsing issue with code blocks
docs: update installation instructions
chore: update dependencies
```

## Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes following the commit convention
4. Push to your fork: `git push origin feat/your-feature`
5. Create a Pull Request

## Release Process

Releases are automated using semantic-release:

- **Patch releases** (1.0.1): Bug fixes
- **Minor releases** (1.1.0): New features
- **Major releases** (2.0.0): Breaking changes

The release process is triggered automatically when commits are pushed to the `prod` branch.

## Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build the project
bun run build

# Test the CLI
bun run knowledge --help
```

## Questions?

Feel free to open an issue if you have any questions about contributing! 