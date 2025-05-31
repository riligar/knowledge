# 📖 Referência da API

## 📋 Visão Geral

Esta documentação fornece uma referência completa da API do Knowledge, incluindo interfaces TypeScript, configurações, métodos públicos e exemplos de uso.

## 🔧 Configuração Principal

### DocForgeConfig

Interface principal de configuração do sistema.

```typescript
interface DocForgeConfig {
    // Diretórios
    inputDir: string
    outputDir: string
    templatesDir?: string
    themesDir?: string

    // Informações do site
    site: SiteConfig

    // Tema e layout
    theme: string
    layout?: string

    // Navegação
    navigation: NavigationConfig

    // Funcionalidades
    features: FeatureConfig

    // Processamento Markdown
    markdown: MarkdownConfig

    // Servidor de desenvolvimento
    dev: DevConfig
}
```

### SiteConfig

Configurações básicas do site.

```typescript
interface SiteConfig {
    title: string
    description: string
    baseUrl: string
    author: string
    
    // Opcionais
    keywords?: string[]
    language?: string
    favicon?: string
    logo?: string
    
    // SEO e Social Media
    ogImage?: string
    ogType?: string
    twitterCard?: 'summary' | 'summary_large_image'
    twitterSite?: string
    
    // Analytics
    googleAnalytics?: string
    gtag?: string
    plausible?: string
    
    // Metadados customizados
    meta?: Record<string, string>
}
```

**Exemplo:**
```typescript
site: {
    title: 'Minha Documentação',
    description: 'Documentação técnica completa do projeto',
    baseUrl: '/',
    author: 'Equipe de Desenvolvimento',
    keywords: ['documentação', 'api', 'guias'],
    language: 'pt-BR',
    favicon: '/assets/favicon.ico',
    ogImage: '/assets/og-image.png',
    googleAnalytics: 'GA_MEASUREMENT_ID'
}
```

### NavigationConfig

Configuração da navegação do site.

```typescript
interface NavigationConfig {
    auto: boolean
    items?: NavigationItem[]
    maxDepth?: number
    showHome?: boolean
    homeTitle?: string
}

interface NavigationItem {
    title: string
    url?: string
    icon?: string
    external?: boolean
    children?: NavigationItem[]
    order?: number
    hidden?: boolean
}
```

**Navegação Automática:**
```typescript
navigation: {
    auto: true,
    maxDepth: 3,
    showHome: true,
    homeTitle: 'Início'
}
```

**Navegação Manual:**
```typescript
navigation: {
    auto: false,
    items: [
        {
            title: 'Início',
            url: '/',
            icon: 'home'
        },
        {
            title: 'Guias',
            children: [
                { title: 'Instalação', url: '/guides/installation.html' },
                { title: 'Configuração', url: '/guides/configuration.html' }
            ]
        },
        {
            title: 'GitHub',
            url: 'https://github.com/riligar/knowledge',
            external: true,
            icon: 'github'
        }
    ]
}
```

### FeatureConfig

Configuração das funcionalidades do sistema.

```typescript
interface FeatureConfig {
    search?: boolean | SearchConfig
    syntaxHighlight?: boolean | SyntaxHighlightConfig
    darkMode?: boolean | DarkModeConfig
    tableOfContents?: boolean | TableOfContentsConfig
    breadcrumbs?: boolean | BreadcrumbsConfig
    editOnGithub?: string | EditOnGithubConfig
    comments?: boolean | CommentsConfig
    analytics?: boolean | AnalyticsConfig
}
```

#### SearchConfig

```typescript
interface SearchConfig {
    enabled: boolean
    placeholder?: string
    noResultsText?: string
    maxResults?: number
    minQueryLength?: number
    indexFields?: {
        title?: { boost: number }
        excerpt?: { boost: number }
        content?: { boost: number }
        tags?: { boost: number }
    }
    stopWords?: string[]
    stemming?: boolean
}
```

**Exemplo:**
```typescript
search: {
    enabled: true,
    placeholder: 'Buscar na documentação...',
    noResultsText: 'Nenhum resultado encontrado',
    maxResults: 10,
    minQueryLength: 2,
    indexFields: {
        title: { boost: 10 },
        excerpt: { boost: 5 },
        content: { boost: 1 },
        tags: { boost: 8 }
    }
}
```

#### SyntaxHighlightConfig

```typescript
interface SyntaxHighlightConfig {
    enabled: boolean
    theme?: 'github' | 'monokai' | 'dracula' | 'tomorrow' | 'vs2015'
    showLineNumbers?: boolean
    copyButton?: boolean
    languages?: string[]
    tabSize?: number
}
```

**Exemplo:**
```typescript
syntaxHighlight: {
    enabled: true,
    theme: 'github',
    showLineNumbers: true,
    copyButton: true,
    languages: ['typescript', 'javascript', 'bash', 'json', 'yaml'],
    tabSize: 2
}
```

#### DarkModeConfig

```typescript
interface DarkModeConfig {
    enabled: boolean
    defaultTheme?: 'light' | 'dark' | 'auto'
    storageKey?: string
    toggleButton?: boolean
    systemPreference?: boolean
}
```

#### TableOfContentsConfig

```typescript
interface TableOfContentsConfig {
    enabled: boolean
    levels?: number[]
    position?: 'left' | 'right' | 'inline'
    title?: string
    minItems?: number
    maxItems?: number
}
```

#### BreadcrumbsConfig

```typescript
interface BreadcrumbsConfig {
    enabled: boolean
    separator?: string
    showHome?: boolean
    homeText?: string
    maxItems?: number
}
```

#### EditOnGithubConfig

```typescript
interface EditOnGithubConfig {
    enabled: boolean
    baseUrl: string
    branch?: string
    text?: string
    icon?: boolean
}
```

### MarkdownConfig

Configuração do processamento de Markdown.

```typescript
interface MarkdownConfig {
    // Configurações básicas
    breaks?: boolean
    linkify?: boolean
    typographer?: boolean
    html?: boolean
    
    // Extensões
    extensions?: {
        tables?: boolean
        strikethrough?: boolean
        tasklists?: boolean
        footnotes?: boolean
        math?: boolean
        mermaid?: boolean
        emoji?: boolean
        containers?: boolean
        deflist?: boolean
        abbr?: boolean
    }
    
    // Plugins customizados
    plugins?: string[] | MarkdownPlugin[]
    
    // Configurações de renderização
    renderer?: {
        heading?: (text: string, level: number) => string
        link?: (href: string, title: string, text: string) => string
        image?: (href: string, title: string, text: string) => string
        code?: (code: string, language: string) => string
    }
}

interface MarkdownPlugin {
    name: string
    plugin: any
    options?: any
}
```

**Exemplo:**
```typescript
markdown: {
    breaks: true,
    linkify: true,
    typographer: true,
    html: false,
    extensions: {
        tables: true,
        strikethrough: true,
        tasklists: true,
        footnotes: true,
        math: true,
        mermaid: true,
        emoji: true
    },
    plugins: [
        {
            name: 'markdown-it-container',
            plugin: require('markdown-it-container'),
            options: {
                name: 'warning',
                openTag: '<div class="warning">',
                closeTag: '</div>'
            }
        }
    ]
}
```

### DevConfig

Configuração do servidor de desenvolvimento.

```typescript
interface DevConfig {
    port: number
    host: string
    livereload?: boolean
    open?: boolean
    https?: boolean | {
        key: string
        cert: string
    }
    proxy?: Record<string, string>
    middleware?: DevMiddleware[]
}

interface DevMiddleware {
    path: string
    handler: (req: Request, res: Response, next: Function) => void
}
```

## 🏗️ Classes Principais

### DocumentationGenerator

Classe principal responsável pela geração da documentação.

```typescript
class DocumentationGenerator {
    constructor(config: DocForgeConfig)
    
    // Métodos públicos
    async generate(): Promise<void>
    async processMarkdownFiles(): Promise<DocumentPage[]>
    generateNavigation(): NavigationItem[]
    async generatePages(): Promise<void>
    async copyAssets(): Promise<void>
    
    // Métodos de configuração
    setConfig(config: Partial<DocForgeConfig>): void
    getConfig(): DocForgeConfig
    
    // Eventos
    on(event: 'start' | 'progress' | 'complete' | 'error', callback: Function): void
    off(event: string, callback: Function): void
}
```

**Exemplo de uso:**
```typescript
import { DocumentationGenerator } from '@riligar/knowledge'

const generator = new DocumentationGenerator({
    inputDir: './docs',
    outputDir: './dist',
    site: {
        title: 'Minha Documentação',
        description: 'Documentação do projeto',
        baseUrl: '/',
        author: 'Autor'
    }
})

// Eventos
generator.on('start', () => console.log('Iniciando geração...'))
generator.on('progress', (progress) => console.log(`Progresso: ${progress}%`))
generator.on('complete', () => console.log('Geração concluída!'))
generator.on('error', (error) => console.error('Erro:', error))

// Gerar documentação
await generator.generate()
```

### SearchIndexGenerator

Classe responsável pela geração do índice de busca.

```typescript
class SearchIndexGenerator {
    constructor(config?: SearchConfig)
    
    // Métodos públicos
    addPage(page: DocumentPage): void
    addDocument(document: SearchDocument): void
    buildIndex(): lunr.Index
    getSerializableData(): SearchIndexData
    
    // Configuração
    setConfig(config: SearchConfig): void
    getConfig(): SearchConfig
    
    // Utilitários
    cleanContent(html: string): string
    generateExcerpt(content: string, maxLength?: number): string
}
```

**Exemplo de uso:**
```typescript
import { SearchIndexGenerator } from '@riligar/knowledge'

const searchGenerator = new SearchIndexGenerator({
    indexFields: {
        title: { boost: 10 },
        excerpt: { boost: 5 },
        content: { boost: 1 }
    }
})

// Adicionar páginas
pages.forEach(page => searchGenerator.addPage(page))

// Gerar índice
const index = searchGenerator.buildIndex()
const data = searchGenerator.getSerializableData()

// Salvar índice
await fs.writeFile('search-index.json', JSON.stringify(data))
```

### DevServer

Servidor de desenvolvimento com live reload.

```typescript
class DevServer {
    constructor(config: DocForgeConfig)
    
    // Métodos públicos
    async start(): Promise<void>
    async stop(): Promise<void>
    async restart(): Promise<void>
    
    // Configuração
    setPort(port: number): void
    setHost(host: string): void
    
    // Middleware
    use(middleware: DevMiddleware): void
    
    // Eventos
    on(event: 'start' | 'stop' | 'reload' | 'error', callback: Function): void
}
```

**Exemplo de uso:**
```typescript
import { DevServer } from '@riligar/knowledge'

const server = new DevServer(config)

// Middleware customizado
server.use({
    path: '/api',
    handler: (req, res, next) => {
        // Lógica customizada
        next()
    }
})

// Eventos
server.on('start', (port) => console.log(`Servidor iniciado na porta ${port}`))
server.on('reload', () => console.log('Página recarregada'))

// Iniciar servidor
await server.start()
```

## 📄 Interfaces de Dados

### DocumentPage

Representa uma página de documentação processada.

```typescript
interface DocumentPage {
    readonly path: string
    readonly title: string
    readonly content: string
    readonly frontmatter: Record<string, any>
    readonly relativePath: string
    readonly url: string
    readonly excerpt?: string
    readonly tags?: string[]
    readonly date?: Date
    readonly author?: string
    readonly category?: string
    readonly order?: number
}
```

### SearchDocument

Representa um documento no índice de busca.

```typescript
interface SearchDocument {
    readonly id: string
    readonly title: string
    readonly content: string
    readonly excerpt: string
    readonly url: string
    readonly tags?: string[]
    readonly category?: string
    readonly date?: string
}
```

### SearchIndexData

Dados serializáveis do índice de busca.

```typescript
interface SearchIndexData {
    documents: SearchDocument[]
    indexData: any // Dados serializados do Lunr.js
    metadata: {
        version: string
        generatedAt: string
        documentsCount: number
        indexSize: number
    }
}
```

## 🎨 Sistema de Temas

### ThemeConfig

Configuração de tema.

```typescript
interface ThemeConfig {
    name: string
    version: string
    author: string
    description: string
    
    // Caminhos
    layouts: string
    assets: string
    
    // Configurações
    colors?: ColorScheme
    typography?: Typography
    spacing?: Spacing
    
    // Customizações
    customCSS?: string[]
    customJS?: string[]
    
    // Herança
    extends?: string
}

interface ColorScheme {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    
    // Modo escuro
    dark?: {
        primary: string
        secondary: string
        accent: string
        background: string
        surface: string
        text: string
        textSecondary: string
        border: string
    }
}

interface Typography {
    fontFamily: string
    headingFontFamily?: string
    fontSize: {
        xs: string
        sm: string
        base: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        '4xl': string
    }
    fontWeight: {
        light: number
        normal: number
        medium: number
        semibold: number
        bold: number
    }
    lineHeight: {
        tight: number
        normal: number
        relaxed: number
    }
}

interface Spacing {
    unit: string
    scale: number[]
    container: {
        maxWidth: string
        padding: string
    }
}
```

### Template Variables

Variáveis disponíveis nos templates HTML.

```typescript
interface TemplateVariables {
    // Site
    site: SiteConfig
    
    // Página atual
    page: DocumentPage
    
    // Navegação
    navigation: NavigationItem[]
    sidebar: NavigationItem[]
    breadcrumbs: BreadcrumbItem[]
    
    // Conteúdo
    content: string
    tableOfContents: TOCItem[]
    
    // Metadados
    currentYear: number
    buildDate: string
    version: string
    
    // Funcionalidades
    features: FeatureConfig
    
    // Tema
    theme: ThemeConfig
    
    // Utilitários
    utils: {
        formatDate: (date: Date) => string
        slugify: (text: string) => string
        excerpt: (text: string, length: number) => string
    }
}

interface BreadcrumbItem {
    title: string
    url?: string
    active: boolean
}

interface TOCItem {
    title: string
    anchor: string
    level: number
    children?: TOCItem[]
}
```

## 🔌 Plugin System (Futuro)

### Plugin Interface

```typescript
interface Plugin {
    name: string
    version: string
    description: string
    author: string
    
    // Hooks do ciclo de vida
    hooks: {
        beforeBuild?: () => void | Promise<void>
        afterBuild?: () => void | Promise<void>
        beforePage?: (page: DocumentPage) => DocumentPage | Promise<DocumentPage>
        afterPage?: (page: DocumentPage) => DocumentPage | Promise<DocumentPage>
        processMarkdown?: (content: string) => string | Promise<string>
        generateNavigation?: (items: NavigationItem[]) => NavigationItem[]
        modifyConfig?: (config: DocForgeConfig) => DocForgeConfig
    }
    
    // Configuração do plugin
    config?: Record<string, any>
    
    // Dependências
    dependencies?: string[]
    
    // Inicialização
    init?: (context: PluginContext) => void | Promise<void>
    
    // Cleanup
    destroy?: () => void | Promise<void>
}

interface PluginContext {
    config: DocForgeConfig
    generator: DocumentationGenerator
    logger: Logger
    utils: PluginUtils
}

interface PluginUtils {
    readFile: (path: string) => Promise<string>
    writeFile: (path: string, content: string) => Promise<void>
    copyFile: (src: string, dest: string) => Promise<void>
    ensureDir: (path: string) => Promise<void>
    glob: (pattern: string) => Promise<string[]>
}
```

### Plugin de Exemplo

```typescript
// plugins/analytics-plugin.ts
export const analyticsPlugin: Plugin = {
    name: 'analytics-plugin',
    version: '1.0.0',
    description: 'Adiciona Google Analytics às páginas',
    author: 'RiliGar',
    
    hooks: {
        afterPage: async (page) => {
            if (this.config.googleAnalytics) {
                const analyticsScript = `
                    <script async src="https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalytics}"></script>
                    <script>
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${this.config.googleAnalytics}');
                    </script>
                `
                
                page.content = page.content.replace('</head>', `${analyticsScript}</head>`)
            }
            
            return page
        }
    },
    
    config: {
        googleAnalytics: '',
        trackingEvents: true
    }
}
```

## 🛠️ Utilitários

### Logger

Sistema de logging integrado.

```typescript
interface Logger {
    debug(message: string, context?: any): void
    info(message: string, context?: any): void
    warn(message: string, context?: any): void
    error(message: string, error?: Error): void
    
    // Configuração
    setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void
    setFormat(format: 'simple' | 'json' | 'pretty'): void
}
```

### FileUtils

Utilitários para manipulação de arquivos.

```typescript
interface FileUtils {
    readFile(path: string): Promise<string>
    writeFile(path: string, content: string): Promise<void>
    copyFile(src: string, dest: string): Promise<void>
    ensureDir(path: string): Promise<void>
    exists(path: string): Promise<boolean>
    glob(pattern: string, options?: GlobOptions): Promise<string[]>
    watch(pattern: string, callback: (event: string, path: string) => void): FileWatcher
}

interface FileWatcher {
    close(): void
    add(path: string): void
    unwatch(path: string): void
}
```

### MarkdownUtils

Utilitários para processamento de Markdown.

```typescript
interface MarkdownUtils {
    parse(content: string): ParsedMarkdown
    render(content: string): string
    extractFrontmatter(content: string): FrontmatterResult
    generateTOC(content: string): TOCItem[]
    extractExcerpt(content: string, length?: number): string
    slugify(text: string): string
}

interface ParsedMarkdown {
    frontmatter: Record<string, any>
    content: string
    excerpt: string
    headings: HeadingItem[]
    links: LinkItem[]
    images: ImageItem[]
}

interface FrontmatterResult {
    frontmatter: Record<string, any>
    body: string
}

interface HeadingItem {
    level: number
    text: string
    anchor: string
}

interface LinkItem {
    text: string
    href: string
    title?: string
}

interface ImageItem {
    alt: string
    src: string
    title?: string
}
```

## 📊 Eventos e Hooks

### Eventos do Sistema

```typescript
type SystemEvent = 
    | 'build:start'
    | 'build:progress'
    | 'build:complete'
    | 'build:error'
    | 'dev:start'
    | 'dev:stop'
    | 'dev:reload'
    | 'file:change'
    | 'file:add'
    | 'file:remove'

interface EventEmitter {
    on(event: SystemEvent, callback: (...args: any[]) => void): void
    off(event: SystemEvent, callback: (...args: any[]) => void): void
    emit(event: SystemEvent, ...args: any[]): void
    once(event: SystemEvent, callback: (...args: any[]) => void): void
}
```

### Hooks de Processamento

```typescript
interface ProcessingHooks {
    beforeMarkdownProcess: (content: string, page: DocumentPage) => string | Promise<string>
    afterMarkdownProcess: (html: string, page: DocumentPage) => string | Promise<string>
    beforePageGenerate: (page: DocumentPage) => DocumentPage | Promise<DocumentPage>
    afterPageGenerate: (page: DocumentPage) => DocumentPage | Promise<DocumentPage>
    beforeNavigationGenerate: (items: NavigationItem[]) => NavigationItem[]
    afterNavigationGenerate: (items: NavigationItem[]) => NavigationItem[]
    beforeSearchIndex: (documents: SearchDocument[]) => SearchDocument[]
    afterSearchIndex: (index: SearchIndexData) => SearchIndexData
}
```

## 🔧 CLI API

### Comandos Programáticos

```typescript
import { CLI } from '@riligar/knowledge'

const cli = new CLI()

// Build
await cli.build({
    config: './custom.config.ts',
    input: './docs',
    output: './dist',
    verbose: true
})

// Dev
await cli.dev({
    port: 3000,
    host: 'localhost',
    open: true
})

// Serve
await cli.serve({
    port: 8080,
    dir: './dist'
})

// Init
await cli.init({
    dir: './my-docs',
    template: 'default'
})
```

## 🎯 Exemplos Avançados

### Configuração Completa

```typescript
// docforge.config.ts
import type { DocForgeConfig } from '@riligar/knowledge'

export default {
    inputDir: './docs',
    outputDir: './dist',
    themesDir: './themes',
    
    site: {
        title: 'Knowledge Base Avançada',
        description: 'Documentação técnica completa com todas as funcionalidades',
        baseUrl: '/',
        author: 'Equipe de Desenvolvimento',
        keywords: ['documentação', 'api', 'guias', 'tutoriais'],
        language: 'pt-BR',
        favicon: '/assets/favicon.ico',
        logo: '/assets/logo.svg',
        ogImage: '/assets/og-image.png',
        googleAnalytics: 'GA_MEASUREMENT_ID'
    },
    
    theme: 'custom',
    
    navigation: {
        auto: true,
        maxDepth: 4,
        showHome: true,
        homeTitle: 'Início'
    },
    
    features: {
        search: {
            enabled: true,
            placeholder: 'Buscar na documentação...',
            maxResults: 15,
            indexFields: {
                title: { boost: 10 },
                excerpt: { boost: 5 },
                content: { boost: 1 },
                tags: { boost: 8 }
            }
        },
        
        syntaxHighlight: {
            enabled: true,
            theme: 'github',
            showLineNumbers: true,
            copyButton: true,
            languages: ['typescript', 'javascript', 'bash', 'json', 'yaml', 'markdown']
        },
        
        darkMode: {
            enabled: true,
            defaultTheme: 'auto',
            toggleButton: true
        },
        
        tableOfContents: {
            enabled: true,
            levels: [2, 3, 4],
            position: 'right',
            minItems: 2
        },
        
        breadcrumbs: {
            enabled: true,
            separator: '/',
            showHome: true,
            homeText: 'Início'
        },
        
        editOnGithub: {
            enabled: true,
            baseUrl: 'https://github.com/riligar/knowledge',
            branch: 'main',
            text: 'Editar esta página'
        }
    },
    
    markdown: {
        breaks: true,
        linkify: true,
        typographer: true,
        extensions: {
            tables: true,
            strikethrough: true,
            tasklists: true,
            footnotes: true,
            math: true,
            mermaid: true,
            emoji: true,
            containers: true
        }
    },
    
    dev: {
        port: 3000,
        host: 'localhost',
        livereload: true,
        open: true
    }
} as DocForgeConfig
```

### Uso Programático Avançado

```typescript
import { 
    DocumentationGenerator, 
    SearchIndexGenerator, 
    DevServer,
    Logger,
    FileUtils 
} from '@riligar/knowledge'

// Configuração customizada
const config = await loadConfig('./docforge.config.ts')

// Logger customizado
const logger = new Logger({
    level: 'debug',
    format: 'pretty'
})

// Gerador com eventos
const generator = new DocumentationGenerator(config)

generator.on('build:start', () => {
    logger.info('🚀 Iniciando geração da documentação...')
})

generator.on('build:progress', (progress) => {
    logger.info(`📊 Progresso: ${progress.completed}/${progress.total} (${progress.percentage}%)`)
})

generator.on('build:complete', (stats) => {
    logger.info(`✅ Documentação gerada com sucesso!`)
    logger.info(`📄 Páginas: ${stats.pages}`)
    logger.info(`🔍 Documentos indexados: ${stats.searchDocuments}`)
    logger.info(`⏱️  Tempo: ${stats.duration}ms`)
})

generator.on('build:error', (error) => {
    logger.error('❌ Erro na geração:', error)
})

// Hooks customizados
generator.addHook('beforeMarkdownProcess', (content, page) => {
    // Processar conteúdo antes da conversão
    return content.replace(/\{\{version\}\}/g, process.env.VERSION || '1.0.0')
})

generator.addHook('afterPageGenerate', async (page) => {
    // Adicionar metadados customizados
    if (page.frontmatter.analytics !== false) {
        // Adicionar tracking
    }
    return page
})

// Gerar documentação
await generator.generate()

// Servidor de desenvolvimento com middleware customizado
if (process.env.NODE_ENV === 'development') {
    const server = new DevServer(config)
    
    // Middleware para API mock
    server.use({
        path: '/api',
        handler: (req, res, next) => {
            if (req.url.startsWith('/api/search')) {
                // Mock da API de busca
                res.json({ results: [] })
            } else {
                next()
            }
        }
    })
    
    await server.start()
}
```

---

Esta referência da API fornece uma visão completa de todas as interfaces, classes e configurações disponíveis no Knowledge. Para exemplos mais específicos e casos de uso avançados, consulte a [documentação de desenvolvimento](./development.md). 