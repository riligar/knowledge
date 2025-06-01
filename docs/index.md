# Documentation Index - Knowledge

## Overview

This is the complete index of the Knowledge system documentation. Here you will find organized links to all available documents, guides, and references.

## Quick Start

### For Users
- [Main README](./readme.md) - Complete introduction to Knowledge
- [Installation Guide](./installation.md) - How to install and configure
- [Basic Configuration](./installation.md#initial-configuration) - First steps

### For Developers
- [Development Guide](./development.md) - How to contribute to the project
- [API Reference](./reference.md) - Complete API documentation
- [System Architecture](./architecture.md) - Detailed internal structure

## Main Documentation

### 1. Introduction and Concepts
| Document | Description | Audience |
|-----------|-----------|---------|
| [README](./readme.md) | Complete system overview | Everyone |
| [Architecture](./architecture.md) | System structure and design | Developers |
| [Search System](./search.md) | Detailed search implementation | Technical |

### 2. Installation and Configuration
| Document | Description | Audience |
|-----------|-----------|---------|
| [Installation](./installation.md) | Complete installation guide | Users |
| [Advanced Configuration](./installation.md#advanced-configurations) | Advanced options | Administrators |
| [Deploy](./installation.md#deploy-to-production) | Production deployment | DevOps |

### 3. Development
| Document | Description | Audience |
|-----------|-----------|---------|
| [Development](./development.md) | Guide for contributors | Developers |
| [API Reference](./reference.md) | Complete API reference | Developers |
| [Tests](./development.md#test-cases) | Testing strategies | Developers |

## Guides by Functionality

### Search System
- [Overview](./search.md#overview)
- [Architecture](./search.md#system-architecture)
- [Configuration](./search.md#customization)
- [Tests](./search.md#testing-implementation)
- [Troubleshooting](./search.md#troubleshooting)

### Theme System
- [Personalization](./installation.md#personalization-of-theme)
- [Configuration](./reference.md#theme-system)
- [Templates](./reference.md#template-variables)

### Markdown Processing
- [Configuration](./reference.md#markdownconfig)
- [Plugins](./reference.md#markdownconfig)
- [Extensions](./installation.md#markdown-configuration)

### Deploy and Production
- [Docker](./installation.md#deploy-with-docker)
- [GitHub Pages](./installation.md#github-pages)
- [Netlify/Vercel](./installation.md#netlify)

## Technical References

### APIs and Interfaces
| Interface | Description | Document |
|-----------|-----------|-----------|
| `KnowledgeConfig` | Main configuration | [API Reference](./reference.md#knowledgeconfig) |
| `DocumentationGenerator` | Main generator | [API Reference](./reference.md#documentationgenerator) |
| `SearchIndexGenerator` | Search system | [API Reference](./reference.md#searchindexgenerator) |
| `DevServer` | Development server | [API Reference](./reference.md#devserver) |

### Configurations
| Configuration | Description | Document |
|--------------|-----------|-----------|
| `SiteConfig` | Site information | [API Reference](./reference.md#siteconfig) |
| `FeatureConfig` | Features | [API Reference](./reference.md#featureconfig) |
| `NavigationConfig` | Navigation | [API Reference](./reference.md#navigationconfig) |
| `MarkdownConfig` | MD processing | [API Reference](./reference.md#markdownconfig) |

### Utilities
| Utility | Description | Document |
|------------|-----------|-----------|
| `Logger` | Logging system | [API Reference](./reference.md#logger) |
| `FileUtils` | File manipulation | [API Reference](./reference.md#fileutils) |
| `MarkdownUtils` | MD processing | [API Reference](./reference.md#markdownutils) |

## Development Guides

### Environment Setup
- [Initial Setup](./development.md#environment-setup)
- [VS Code](./development.md#recommended-vs-code-extensions)
- [Dependencies](./development.md#initial-setup)

### Code Standards
- [TypeScript](./development.md#typescript-guidelines)
- [Async/Await](./development.md#asyncawait-patterns)
- [Error Handling](./development.md#error-handling-patterns)

### Tests
- [Structure](./development.md#test-structure)
- [Commands](./development.md#test-commands)
- [Mocks](./development.md#mocks-and-helpers)

### Build and Release
- [Build](./development.md#build-and-release)
- [Versioning](./development.md#semantic-versioning)
- [Commits](./development.md#conventional-commits)

## Contribution

### Process
- [Workflow](./development.md#development-workflow)
- [Pull Requests](./development.md#pull-request-template)
- [Code Review](./development.md#code-review-guidelines)

### Guidelines
- [Standards](./development.md#code-standards)
- [Tests](./development.md#test-cases)
- [Documentation](./development.md#contribution-process)

## Troubleshooting

### Common Problems
| Problem | Solution | Document |
|----------|---------|-----------|
| Installation fails | [Installation guide](./installation.md#troubleshooting) | Installation |
| Build doesn't work | [Build debug](./development.md#debug-and-troubleshooting) | Development |
| Search doesn't load | [Search debug](./search.md#troubleshooting) | Search |
| Assets don't load | [Assets debug](./installation.md#assets-not-loading) | Installation |

### Debug and Logs
- [Debug Tools](./development.md#debug-and-troubleshooting)
- [Performance](./development.md#performance-profiling)
- [Metrics](./development.md#metrics-and-monitoring)

## Examples and Use Cases

### Example Configurations
- [Basic](./installation.md#basic-configuration)
- [Advanced](./installation.md#advanced-configurations)
- [Enterprise](./reference.md#complete-configuration)

### Use Cases
- [API Documentation](./reference.md#advanced-examples)
- [Knowledge Base](./readme.md#main-features)
- [Technical Documentation](./installation.md#documentation-structure)

### Templates
- [Custom Theme](./installation.md#custom-theme)
- [Custom Layout](./installation.md#custom-layout)
- [Example Plugin](./reference.md#example-plugin)

## Roadmap and Future

### Planned Features
- [Plugin System](./development.md#development-roadmap)
- [Advanced Search](./search.md#roadmap-and-future-improvements)
- [Themes 2.0](./development.md#next-features)
- [Performance](./architecture.md#performance-and-optimizations)

### Contributions
- [How to Contribute](./development.md#how-to-contribute)
- [Issues](https://github.com/riligar/knowledge/issues)
- [Discussions](https://github.com/riligar/knowledge/discussions)

## Support and Community

### Support Channels
- **Email**: [suporte@riligar.click](mailto:suporte@riligar.click)
- **Issues**: [GitHub Issues](https://github.com/riligar/knowledge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/riligar/knowledge/discussions)
- **Documentation**: [knowledge.dev](https://knowledge.dev)

### External Resources
- [Bun.js Documentation](https://bun.sh/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Lunr.js Guide](https://lunrjs.com/guides/)
- [Marked.js Documentation](https://marked.js.org/)

## Documentation Checklist

### For New Users
- [ ] Read [README](./readme.md)
- [ ] Follow [Installation Guide](./installation.md)
- [ ] Configure basic project
- [ ] Test main features
- [ ] Explore [examples](./installation.md#documentation-structure)

### For Developers
- [ ] Read [Development Guide](./development.md)
- [ ] Configure development environment
- [ ] Run tests
- [ ] Study [Architecture](./architecture.md)
- [ ] Review [API Reference](./reference.md)

### For Contributors
- [ ] Fork repository
- [ ] Configure environment
- [ ] Read contribution guidelines
- [ ] Choose issue to work on
- [ ] Submit Pull Request

## Tags and Categories

### By Experience Level
- **Beginner**: README, Installation
- **Intermediate**: Architecture, Search Implementation
- **Advanced**: Development, API Reference

### By Content Type
- **Guides**: Installation, Development
- **Reference**: API Reference, Architecture
- **Tutorials**: README, Search Implementation

### By Functionality
- **Core**: README, Architecture, Development
- **Search**: Search Implementation
- **Configuration**: Installation, API Reference
- **Deploy**: Installation (Deploy section)

## Documentation Statistics

- **Total Documents**: 5 main + test files
- **Reference Pages**: 4
- **Practical Guides**: 3
- **Code Examples**: 50+
- **TypeScript Interfaces**: 20+
- **Last Update**: December 2024

This documentation is maintained by the Knowledge community.

For improvement suggestions or corrections, open an [issue](https://github.com/riligar/knowledge/issues) or [discussion](https://github.com/riligar/knowledge/discussions).

Built with ❤️ by [RiliGar](http://riligar.click/) and the open source community. 