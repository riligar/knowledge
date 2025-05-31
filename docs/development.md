# 🛠️ Guia de Desenvolvimento

## 📋 Visão Geral

Este guia fornece informações detalhadas para desenvolvedores que desejam contribuir com o projeto Knowledge, incluindo configuração do ambiente de desenvolvimento, padrões de código, arquitetura e processo de contribuição.

## 🚀 Configuração do Ambiente

### Pré-requisitos para Desenvolvimento

- **Bun.js**: v1.0.0+ (runtime principal)
- **Node.js**: v18.0.0+ (compatibilidade)
- **Git**: Para controle de versão
- **VS Code**: Editor recomendado
- **TypeScript**: Conhecimento básico necessário

### Configuração Inicial

```bash
# 1. Fork e clone o repositório
git clone https://github.com/seu-usuario/knowledge.git
cd knowledge

# 2. Instalar dependências
bun install

# 3. Configurar hooks do Git
bun run prepare

# 4. Executar testes
bun test

# 5. Iniciar desenvolvimento
bun run dev
```

### Extensões Recomendadas para VS Code

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

### Configuração do VS Code

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

## 🏗️ Estrutura do Projeto

### Organização de Código

```
knowledge/
├── src/                        # Código fonte principal
│   ├── cli.ts                 # Interface CLI
│   ├── generator.ts           # Gerador de documentação
│   ├── search.ts              # Sistema de busca
│   ├── markdown.ts            # Processador Markdown
│   ├── config.ts              # Configurações e tipos
│   └── dev-server.ts          # Servidor de desenvolvimento
├── themes/                     # Sistema de temas
│   └── default/               # Tema padrão
│       ├── layouts/           # Templates HTML
│       └── assets/            # CSS, JS, imagens
├── tests/                      # Testes automatizados
│   ├── unit/                  # Testes unitários
│   ├── integration/           # Testes de integração
│   └── e2e/                   # Testes end-to-end
├── docs/                       # Documentação do projeto
├── examples/                   # Exemplos de uso
└── scripts/                    # Scripts de build e deploy
```

### Convenções de Nomenclatura

- **Arquivos**: kebab-case (`search-index.ts`)
- **Classes**: PascalCase (`DocumentationGenerator`)
- **Funções**: camelCase (`generateNavigation`)
- **Constantes**: UPPER_SNAKE_CASE (`DEFAULT_CONFIG`)
- **Interfaces**: PascalCase com prefixo I (`ISearchResult`)
- **Types**: PascalCase (`DocForgeConfig`)

## 📝 Padrões de Código

### TypeScript Guidelines

```typescript
// ✅ Bom: Tipagem explícita e interfaces bem definidas
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
        // Implementação...
    }
    
    public async buildIndex(): Promise<lunr.Index> {
        // Implementação assíncrona...
    }
}

// ❌ Evitar: Tipos any e mutabilidade desnecessária
class BadExample {
    public data: any[] = []
    
    addItem(item: any) {
        this.data.push(item)
    }
}
```

### Padrões de Async/Await

```typescript
// ✅ Bom: Tratamento de erros e async/await
async function processMarkdownFiles(): Promise<DocumentPage[]> {
    try {
        const files = await this.findMarkdownFiles(this.inputDir)
        const pages = await Promise.all(
            files.map(file => this.processFile(file))
        )
        return pages.filter(page => page !== null)
    } catch (error) {
        console.error('Erro ao processar arquivos:', error)
        throw new Error(`Falha no processamento: ${error.message}`)
    }
}

// ❌ Evitar: Promises aninhadas e falta de tratamento de erro
function badAsyncExample() {
    return new Promise((resolve, reject) => {
        this.findMarkdownFiles(this.inputDir).then(files => {
            files.forEach(file => {
                this.processFile(file).then(page => {
                    // Lógica aninhada...
                })
            })
        })
    })
}
```

### Padrões de Error Handling

```typescript
// ✅ Bom: Erros específicos e informativos
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

function validateConfig(config: DocForgeConfig): void {
    if (!config.inputDir) {
        throw new DocumentationError(
            'Input directory is required',
            'MISSING_INPUT_DIR',
            { config }
        )
    }
}

// ❌ Evitar: Erros genéricos sem contexto
function badErrorHandling(config: any) {
    if (!config.inputDir) {
        throw new Error('Invalid config')
    }
}
```

## 🧪 Testes

### Estrutura de Testes

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

### Comandos de Teste

```bash
# Executar todos os testes
bun test

# Testes com watch mode
bun test --watch

# Testes específicos
bun test --grep "SearchIndexGenerator"

# Testes com coverage
bun test --coverage

# Testes de integração
bun test tests/integration/

# Testes E2E
bun test tests/e2e/
```

### Mocks e Helpers

```typescript
// tests/helpers/mocks.ts
export const mockConfig: DocForgeConfig = {
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

## 🔧 Scripts de Desenvolvimento

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

## 📦 Build e Release

### Processo de Build

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

### Versionamento Semântico

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
# Tipos de commit
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção

# Exemplos
feat(search): add fuzzy search support
fix(generator): resolve markdown parsing issue
docs(api): update configuration examples
test(search): add unit tests for indexing
```

## 🤝 Processo de Contribuição

### Workflow de Desenvolvimento

1. **Fork** do repositório
2. **Clone** do seu fork
3. **Branch** para sua feature (`git checkout -b feature/amazing-feature`)
4. **Commit** das mudanças (`git commit -m 'feat: add amazing feature'`)
5. **Push** para a branch (`git push origin feature/amazing-feature`)
6. **Pull Request** para o repositório principal

### Template de Pull Request

```markdown
## 📝 Descrição

Breve descrição das mudanças implementadas.

## 🎯 Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova funcionalidade (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação (mudança apenas na documentação)

## 🧪 Como Testar

1. Passos para reproduzir
2. Comportamento esperado
3. Screenshots (se aplicável)

## ✅ Checklist

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Commits seguem conventional commits
- [ ] Build passa sem erros
- [ ] Testes passam

## 📸 Screenshots

(Se aplicável)

## 🔗 Issues Relacionadas

Closes #123
```

### Code Review Guidelines

#### Para Autores

- **Commits pequenos**: Mantenha PRs focados e pequenos
- **Testes**: Adicione testes para novas funcionalidades
- **Documentação**: Atualize documentação relevante
- **Descrição clara**: Explique o que e por que das mudanças

#### Para Reviewers

- **Seja construtivo**: Feedback específico e útil
- **Teste localmente**: Verifique se funciona como esperado
- **Padrões**: Verifique aderência aos padrões do projeto
- **Performance**: Considere impacto na performance

## 🐛 Debug e Troubleshooting

### Logs de Debug

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

### Debugging no VS Code

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

// Uso
Profiler.start('markdown-processing')
await processMarkdownFiles()
Profiler.end('markdown-processing')
```

## 📊 Métricas e Monitoramento

### Bundle Analysis

```bash
# Analisar tamanho do bundle
bun run build --analyze

# Verificar dependências
bun run deps:check

# Audit de segurança
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

## 🔒 Segurança

### Práticas de Segurança

```typescript
// ✅ Bom: Sanitização de entrada
function sanitizeMarkdown(content: string): string {
    return content
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
}

// ✅ Bom: Validação de caminhos
function validatePath(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath)
    return !normalizedPath.includes('..')
}

// ❌ Evitar: Execução de código não sanitizado
function dangerousExample(userInput: string) {
    eval(userInput) // NUNCA fazer isso!
}
```

### Dependências

```bash
# Verificar vulnerabilidades
bun audit

# Atualizar dependências
bun update

# Verificar licenças
bunx license-checker
```

## 📚 Recursos Adicionais

### Documentação Técnica

- [Bun.js Documentation](https://bun.sh/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Lunr.js Guide](https://lunrjs.com/guides/)
- [Marked.js Documentation](https://marked.js.org/)

### Ferramentas Úteis

- **Bun DevTools**: Debugging e profiling
- **TypeScript Playground**: Testar código TypeScript
- **Regex101**: Testar expressões regulares
- **JSON Formatter**: Validar e formatar JSON

### Comunidade

- 💬 **Discord**: [Link do servidor](https://discord.gg/knowledge)
- 🐛 **Issues**: [GitHub Issues](https://github.com/riligar/knowledge/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/riligar/knowledge/discussions)
- 📧 **Email**: [dev@riligar.click](mailto:dev@riligar.click)

## 🎯 Roadmap de Desenvolvimento

### Próximas Funcionalidades

1. **Plugin System** (v2.0)
   - API de plugins
   - Marketplace de plugins
   - Hot reload de plugins

2. **Advanced Search** (v1.5)
   - Busca semântica
   - Filtros avançados
   - Analytics de busca

3. **Themes 2.0** (v1.4)
   - Theme builder visual
   - Componentes reutilizáveis
   - Sistema de herança

4. **Performance** (v1.3)
   - Lazy loading
   - Code splitting
   - Service workers

### Como Contribuir

1. **Escolha uma issue**: Procure issues marcadas como `good first issue`
2. **Discuta**: Comente na issue antes de começar
3. **Implemente**: Siga os padrões estabelecidos
4. **Teste**: Adicione testes para sua funcionalidade
5. **Documente**: Atualize a documentação relevante

---

**Obrigado por contribuir com o Knowledge!** 🙏 Sua contribuição ajuda a tornar a documentação melhor para todos. 