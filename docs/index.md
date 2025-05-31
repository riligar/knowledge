# Índice da Documentação - Knowledge

## Visão Geral

Este é o índice completo da documentação do sistema Knowledge. Aqui você encontrará links organizados para todos os documentos, guias e referências disponíveis.

## Início Rápido

### Para Usuários
- [README Principal](./readme.md) - Introdução completa ao Knowledge
- [Guia de Instalação](./installation.md) - Como instalar e configurar
- [Configuração Básica](./installation.md#configuração-inicial) - Primeiros passos

### Para Desenvolvedores
- [Guia de Desenvolvimento](./development.md) - Como contribuir com o projeto
- [Referência da API](./api-reference.md) - Documentação completa da API
- [Arquitetura do Sistema](./architecture.md) - Estrutura interna detalhada

## Documentação Principal

### 1. Introdução e Conceitos
| Documento | Descrição | Público |
|-----------|-----------|---------|
| [README](./readme.md) | Visão geral completa do sistema | Todos |
| [Arquitetura](./architecture.md) | Estrutura e design do sistema | Desenvolvedores |
| [Sistema de Busca](./search-implementation.md) | Implementação detalhada da busca | Técnico |

### 2. Instalação e Configuração
| Documento | Descrição | Público |
|-----------|-----------|---------|
| [Instalação](./installation.md) | Guia completo de instalação | Usuários |
| [Configuração Avançada](./installation.md#configurações-avançadas) | Opções avançadas | Administradores |
| [Deploy](./installation.md#deploy-em-produção) | Deployment em produção | DevOps |

### 3. Desenvolvimento
| Documento | Descrição | Público |
|-----------|-----------|---------|
| [Desenvolvimento](./development.md) | Guia para contribuidores | Desenvolvedores |
| [API Reference](./api-reference.md) | Referência completa da API | Desenvolvedores |
| [Testes](./development.md#testes) | Estratégias de teste | Desenvolvedores |

## Guias por Funcionalidade

### Sistema de Busca
- [Visão Geral](./search-implementation.md#visão-geral)
- [Arquitetura](./search-implementation.md#arquitetura-do-sistema)
- [Configuração](./search-implementation.md#personalização)
- [Testes](./search-implementation.md#testando-a-implementação)
- [Troubleshooting](./search-implementation.md#troubleshooting)

### Sistema de Temas
- [Personalização](./installation.md#personalização-de-tema)
- [Configuração](./api-reference.md#sistema-de-temas)
- [Templates](./api-reference.md#template-variables)

### Processamento de Markdown
- [Configuração](./api-reference.md#markdownconfig)
- [Plugins](./api-reference.md#markdownconfig)
- [Extensões](./installation.md#configuração-de-markdown)

### Deploy e Produção
- [Docker](./installation.md#deploy-com-docker)
- [GitHub Pages](./installation.md#github-pages)
- [Netlify/Vercel](./installation.md#netlify)

## Referências Técnicas

### APIs e Interfaces
| Interface | Descrição | Documento |
|-----------|-----------|-----------|
| `DocForgeConfig` | Configuração principal | [API Reference](./api-reference.md#docforgeconfig) |
| `DocumentationGenerator` | Gerador principal | [API Reference](./api-reference.md#documentationgenerator) |
| `SearchIndexGenerator` | Sistema de busca | [API Reference](./api-reference.md#searchindexgenerator) |
| `DevServer` | Servidor de desenvolvimento | [API Reference](./api-reference.md#devserver) |

### Configurações
| Configuração | Descrição | Documento |
|--------------|-----------|-----------|
| `SiteConfig` | Informações do site | [API Reference](./api-reference.md#siteconfig) |
| `FeatureConfig` | Funcionalidades | [API Reference](./api-reference.md#featureconfig) |
| `NavigationConfig` | Navegação | [API Reference](./api-reference.md#navigationconfig) |
| `MarkdownConfig` | Processamento MD | [API Reference](./api-reference.md#markdownconfig) |

### Utilitários
| Utilitário | Descrição | Documento |
|------------|-----------|-----------|
| `Logger` | Sistema de logs | [API Reference](./api-reference.md#logger) |
| `FileUtils` | Manipulação de arquivos | [API Reference](./api-reference.md#fileutils) |
| `MarkdownUtils` | Processamento MD | [API Reference](./api-reference.md#markdownutils) |

## Guias de Desenvolvimento

### Configuração do Ambiente
- [Setup Inicial](./development.md#configuração-do-ambiente)
- [VS Code](./development.md#extensões-recomendadas-para-vs-code)
- [Dependências](./development.md#configuração-inicial)

### Padrões de Código
- [TypeScript](./development.md#typescript-guidelines)
- [Async/Await](./development.md#padrões-de-asyncawait)
- [Error Handling](./development.md#padrões-de-error-handling)

### Testes
- [Estrutura](./development.md#estrutura-de-testes)
- [Comandos](./development.md#comandos-de-teste)
- [Mocks](./development.md#mocks-e-helpers)

### Build e Release
- [Build](./development.md#processo-de-build)
- [Versionamento](./development.md#versionamento-semântico)
- [Commits](./development.md#conventional-commits)

## Contribuição

### Processo
- [Workflow](./development.md#workflow-de-desenvolvimento)
- [Pull Requests](./development.md#template-de-pull-request)
- [Code Review](./development.md#code-review-guidelines)

### Diretrizes
- [Padrões](./development.md#padrões-de-código)
- [Testes](./development.md#testes)
- [Documentação](./development.md#processo-de-contribuição)

## Troubleshooting

### Problemas Comuns
| Problema | Solução | Documento |
|----------|---------|-----------|
| Instalação falha | [Guia de instalação](./installation.md#troubleshooting) | Installation |
| Build não funciona | [Debug de build](./development.md#debug-e-troubleshooting) | Development |
| Busca não carrega | [Debug de busca](./search-implementation.md#troubleshooting) | Search |
| Assets não carregam | [Debug de assets](./installation.md#assets-não-carregam) | Installation |

### Debug e Logs
- [Debug Tools](./development.md#debug-e-troubleshooting)
- [Performance](./development.md#performance-profiling)
- [Métricas](./development.md#métricas-e-monitoramento)

## Exemplos e Casos de Uso

### Configurações de Exemplo
- [Básica](./installation.md#configuração-básica)
- [Avançada](./installation.md#configurações-avançadas)
- [Empresarial](./api-reference.md#configuração-completa)

### Casos de Uso
- [Documentação de API](./api-reference.md#exemplos-avançados)
- [Knowledge Base](./readme.md#características-principais)
- [Documentação Técnica](./installation.md#estrutura-de-documentação)

### Templates
- [Tema Customizado](./installation.md#tema-customizado)
- [Layout Personalizado](./installation.md#layout-personalizado)
- [Plugin Exemplo](./api-reference.md#plugin-de-exemplo)

## Roadmap e Futuro

### Funcionalidades Planejadas
- [Plugin System](./development.md#roadmap-de-desenvolvimento)
- [Advanced Search](./search-implementation.md#roadmap-e-melhorias-futuras)
- [Themes 2.0](./development.md#próximas-funcionalidades)
- [Performance](./architecture.md#performance-e-otimizações)

### Contribuições
- [Como Contribuir](./development.md#como-contribuir)
- [Issues](https://github.com/riligar/knowledge/issues)
- [Discussões](https://github.com/riligar/knowledge/discussions)

## Suporte e Comunidade

### Canais de Suporte
- **Email**: [suporte@riligar.click](mailto:suporte@riligar.click)
- **Issues**: [GitHub Issues](https://github.com/riligar/knowledge/issues)
- **Discussões**: [GitHub Discussions](https://github.com/riligar/knowledge/discussions)
- **Documentação**: [knowledge.dev](https://knowledge.dev)

### Recursos Externos
- [Bun.js Documentation](https://bun.sh/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Lunr.js Guide](https://lunrjs.com/guides/)
- [Marked.js Documentation](https://marked.js.org/)

## Checklist de Documentação

### Para Novos Usuários
- [ ] Ler [README](./readme.md)
- [ ] Seguir [Guia de Instalação](./installation.md)
- [ ] Configurar projeto básico
- [ ] Testar funcionalidades principais
- [ ] Explorar [exemplos](./installation.md#estrutura-de-documentação)

### Para Desenvolvedores
- [ ] Ler [Guia de Desenvolvimento](./development.md)
- [ ] Configurar ambiente de desenvolvimento
- [ ] Executar testes
- [ ] Estudar [Arquitetura](./architecture.md)
- [ ] Revisar [API Reference](./api-reference.md)

### Para Contribuidores
- [ ] Fork do repositório
- [ ] Configurar ambiente
- [ ] Ler diretrizes de contribuição
- [ ] Escolher issue para trabalhar
- [ ] Submeter Pull Request

## Tags e Categorias

### Por Nível de Experiência
- **Iniciante**: README, Installation
- **Intermediário**: Architecture, Search Implementation
- **Avançado**: Development, API Reference

### Por Tipo de Conteúdo
- **Guias**: Installation, Development
- **Referência**: API Reference, Architecture
- **Tutoriais**: README, Search Implementation

### Por Funcionalidade
- **Core**: README, Architecture, Development
- **Busca**: Search Implementation
- **Configuração**: Installation, API Reference
- **Deploy**: Installation (Deploy section)

## Estatísticas da Documentação

- **Total de Documentos**: 5 principais + arquivos de teste
- **Páginas de Referência**: 4
- **Guias Práticos**: 3
- **Exemplos de Código**: 50+
- **Interfaces TypeScript**: 20+
- **Última Atualização**: Dezembro 2024

Esta documentação é mantida pela comunidade Knowledge.

Para sugestões de melhoria ou correções, abra uma [issue](https://github.com/riligar/knowledge/issues) ou [discussão](https://github.com/riligar/knowledge/discussions).

Construído com ❤️ pela [RiliGar](http://riligar.click/) e a comunidade open source. 