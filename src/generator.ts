import * as fs from 'fs-extra';
import * as path from 'path';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { createHash } from 'crypto';
import type { KnowledgeConfig, NavigationItem } from './config.js';
import { resolveThemesDir } from './config.js';
import { SearchIndexGenerator } from './search.js';
import { MarkdownProcessor } from './markdown.js';

export interface DocumentPage {
    path: string;
    title: string;
    content: string;
    frontmatter: Record<string, any>;
    relativePath: string;
    url: string;
    markdownUrl: string;
}

interface Document {
    path: string;
    title: string;
    content: string;
    html: string;
    metadata: Record<string, any>;
}

interface TemplateData {
    title: string;
    content: string;
    navigation: NavigationItem[];
    config: KnowledgeConfig;
    currentPath: string;
}

interface AssetMapping {
    [originalPath: string]: string;
}

export class DocumentationGenerator {
    private pages: DocumentPage[] = [];
    private navigation: NavigationItem[] = [];
    private searchIndex: SearchIndexGenerator;
    private markdownProcessor: MarkdownProcessor;
    private resolvedThemesDir: string;
    private assetMapping: AssetMapping = {};

    constructor(private config: KnowledgeConfig) {
        this.setupMarked();
        this.searchIndex = new SearchIndexGenerator();
        this.markdownProcessor = new MarkdownProcessor(config);

        // Resolver o caminho correto dos temas
        this.resolvedThemesDir = resolveThemesDir(config.themesDir);
    }

    private setupMarked() {
        marked.setOptions({
            breaks: this.config.markdown.breaks,
            gfm: true
        });
    }

    public async generate(): Promise<void> {
        console.log('🚀 Starting documentation generation...');

        // Limpar diretório de saída
        await fs.ensureDir(this.config.outputDir);
        await fs.emptyDir(this.config.outputDir);

        // Processar arquivos markdown
        await this.processMarkdownFiles();

        // Gerar navegação
        this.generateNavigation();

        // Gerar índice de busca
        await this.generateSearchIndex();

        // Copiar assets com cache busting
        await this.copyAssetsWithCacheBusting();

        // Gerar páginas HTML (após copiar assets para ter o mapping)
        await this.generatePages();

        // Copiar arquivos markdown para download
        await this.copyMarkdownFiles();

        console.log(`✅ Documentation generated successfully in ${this.config.outputDir}`);
    }

    private async processMarkdownFiles(): Promise<void> {
        const inputDir = path.resolve(this.config.inputDir);

        try {
            const files = await this.findMarkdownFiles(inputDir);

            for (const filePath of files) {
                const content = await fs.readFile(filePath, 'utf-8');
                const relativePath = path.relative(inputDir, filePath);
                const { frontmatter, body } = this.extractFrontmatter(content);

                // Validação: verificar se o arquivo começa com H1
                if (!this.validateMarkdownStartsWithH1(body, frontmatter)) {
                    console.warn(`⚠️  Skipping file '${relativePath}': Markdown files must start with H1 (# Title)`);
                    continue;
                }

                const htmlContent = await this.processMarkdown(body);
                const title = this.extractTitle(body, frontmatter);
                const url = this.generateUrl(relativePath);
                const markdownUrl = this.generateMarkdownUrl(relativePath);

                const page: DocumentPage = {
                    path: filePath,
                    title,
                    content: htmlContent,
                    frontmatter,
                    relativePath,
                    url,
                    markdownUrl
                };

                this.pages.push(page);

                // Adicionar página ao índice de busca
                this.searchIndex.addPage(page);
            }
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                throw new Error(
                    `❌ Input directory not found: '${this.config.inputDir}'\n\n` +
                    `Please make sure the directory exists and contains your markdown files.\n` +
                    `You can:\n` +
                    `  • Create the directory: mkdir ${this.config.inputDir}\n` +
                    `  • Change the input directory in your config file\n` +
                    `  • Use the --input flag to specify a different directory`
                );
            }
            throw error;
        }
    }

    private decodeHtmlEntities(text: string): string {
        const entities: Record<string, string> = {
            '&quot;': '"',
            '&#39;': "'",
            '&lt;': '<',
            '&gt;': '>',
            '&amp;': '&'
        };

        return text.replace(/&(?:quot|#39|lt|gt|amp);/g, (match) => entities[match] || match);
    }

    private async processMarkdown(content: string): Promise<string> {
        // Processar markdown com syntax highlighting manual
        let html = await marked(content);

        // Aplicar syntax highlighting em blocos de código
        html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
            if (hljs.getLanguage(lang)) {
                try {
                    // Decodificar entidades HTML antes de aplicar highlight
                    const decodedCode = this.decodeHtmlEntities(code);

                    const highlighted = hljs.highlight(decodedCode, { language: lang }).value;

                    // Decodificar entidades HTML no resultado do highlight.js também
                    const finalHighlighted = this.decodeHtmlEntities(highlighted);

                    return `<pre><code class="hljs language-${lang}">${finalHighlighted}</code></pre>`;
                } catch (err) {
                    console.warn(`Failed to highlight code with language "${lang}":`, err);
                }
            }
            return match;
        });

        // Processar links internos para converter .md para .html
        html = this.processInternalLinks(html);

        return html;
    }

    private processInternalLinks(html: string): string {
        // Regex para encontrar links internos que apontam para arquivos .md
        // Procura por href="./arquivo.md" ou href="arquivo.md" (links relativos)
        // Também trata aspas simples e links com âncoras (#section)
        return html.replace(/href=(["'])([^"']*\.md(?:#[^"']*)?)\1/g, (match, quote, href) => {
            // Verificar se é um link interno (não começa com http:// ou https://)
            if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:')) {
                // Converter .md para .html, preservando âncoras se existirem
                const htmlHref = href.replace(/\.md(#.*)?$/, '.html$1');
                return `href=${quote}${htmlHref}${quote}`;
            }
            return match;
        });
    }

    private async findMarkdownFiles(dir: string): Promise<string[]> {
        const files: string[] = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                const subFiles = await this.findMarkdownFiles(fullPath);
                files.push(...subFiles);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                files.push(fullPath);
            }
        }

        return files;
    }

    private extractFrontmatter(content: string): { frontmatter: Record<string, any>, body: string } {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = content.match(frontmatterRegex);

        if (!match) {
            return { frontmatter: {}, body: content };
        }

        const frontmatterText = match[1];
        const body = content.slice(match[0].length);

        // Parse YAML frontmatter simples
        const frontmatter: Record<string, any> = {};
        if (frontmatterText) {
            frontmatterText.split('\n').forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.slice(0, colonIndex).trim();
                    const value = line.slice(colonIndex + 1).trim();
                    frontmatter[key] = value.replace(/^["']|["']$/g, '');
                }
            });
        }

        return { frontmatter, body };
    }

    private extractTitle(content: string, frontmatter: Record<string, any>): string {
        if (frontmatter.title) {
            return frontmatter.title;
        }

        const firstHeading = content.match(/^#\s+(.+)$/m);
        return firstHeading?.[1] || 'Untitled';
    }

    private generateUrl(relativePath: string): string {
        let url = relativePath
            .replace(/\.md$/, '.html')
            .replace(/\\/g, '/');

        // Apenas README.md vira index.html, INDEX.md mantém seu nome
        if (url === 'README.html') {
            url = 'index.html';
        } else if (url === 'INDEX.html') {
            url = 'documentation-index.html'; // Nome único para o índice
        }

        return url;
    }

    private generateMarkdownUrl(relativePath: string): string {
        return relativePath.replace(/\.md$/, '.md');
    }

    private generateNavigation(): void {
        if (!this.config.navigation.auto) {
            this.navigation = this.config.navigation.items || [];
            return;
        }

        // Gerar navegação automática baseada na estrutura de arquivos
        const navMap = new Map<string, NavigationItem>();

        for (const page of this.pages) {
            const pathParts = page.relativePath.split(path.sep);
            let currentPath = '';

            for (let i = 0; i < pathParts.length; i++) {
                const part = pathParts[i];
                if (!part) continue; // Skip empty parts

                const isFile = i === pathParts.length - 1;
                currentPath = currentPath ? path.join(currentPath, part) : part;

                if (!navMap.has(currentPath)) {
                    const title = isFile ? page.title : this.formatDirectoryName(part);
                    const navItem: NavigationItem = {
                        title,
                        path: isFile ? page.url : '',
                        children: []
                    };
                    navMap.set(currentPath, navItem);
                }
            }
        }

        // Organizar hierarquia
        this.navigation = this.organizeNavigation(navMap);
    }

    private formatDirectoryName(dirName: string): string {
        return dirName
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    private organizeNavigation(navMap: Map<string, NavigationItem>): NavigationItem[] {
        const rootItems: NavigationItem[] = [];

        for (const [fullPath, item] of navMap) {
            const pathParts = fullPath.split(path.sep);

            if (pathParts.length === 1) {
                rootItems.push(item);
            } else {
                const parentPath = pathParts.slice(0, -1).join(path.sep);
                const parent = navMap.get(parentPath);
                if (parent && parent.children) {
                    parent.children.push(item);
                }
            }
        }

        // Ordenar itens da raiz com prioridade para arquivos de índice
        rootItems.sort((a, b) => {
            const aIsFile = a.path !== '';
            const bIsFile = b.path !== '';

            // Se um é arquivo e outro é pasta, arquivo vem primeiro
            if (aIsFile && !bIsFile) return -1;
            if (!aIsFile && bIsFile) return 1;

            // Se ambos são arquivos, verificar se algum é arquivo de índice
            if (aIsFile && bIsFile) {
                const aIndexPriority = this.getIndexFilePriority(a);
                const bIndexPriority = this.getIndexFilePriority(b);

                // Se um tem prioridade de índice e outro não, o com prioridade vem primeiro
                if (aIndexPriority > 0 && bIndexPriority === 0) return -1;
                if (aIndexPriority === 0 && bIndexPriority > 0) return 1;

                // Se ambos têm prioridade de índice, ordenar pela prioridade (maior número = maior prioridade)
                if (aIndexPriority > 0 && bIndexPriority > 0) {
                    return bIndexPriority - aIndexPriority;
                }
            }

            // Se ambos são do mesmo tipo (ou nenhum é index), ordenar alfabeticamente
            return a.title.localeCompare(b.title, 'pt-BR', {
                numeric: true,
                sensitivity: 'base'
            });
        });

        // Ordenar recursivamente os filhos de cada pasta
        this.sortNavigationChildren(rootItems);

        return rootItems;
    }

    private sortNavigationChildren(items: NavigationItem[]): void {
        for (const item of items) {
            if (item.children && item.children.length > 0) {
                // Ordenar filhos com prioridade para arquivos de índice
                item.children.sort((a, b) => {
                    const aIsFile = a.path !== '';
                    const bIsFile = b.path !== '';

                    // Se um é arquivo e outro é pasta, arquivo vem primeiro
                    if (aIsFile && !bIsFile) return -1;
                    if (!aIsFile && bIsFile) return 1;

                    // Se ambos são arquivos, verificar se algum é arquivo de índice
                    if (aIsFile && bIsFile) {
                        const aIndexPriority = this.getIndexFilePriority(a);
                        const bIndexPriority = this.getIndexFilePriority(b);

                        // Se um tem prioridade de índice e outro não, o com prioridade vem primeiro
                        if (aIndexPriority > 0 && bIndexPriority === 0) return -1;
                        if (aIndexPriority === 0 && bIndexPriority > 0) return 1;

                        // Se ambos têm prioridade de índice, ordenar pela prioridade (maior número = maior prioridade)
                        if (aIndexPriority > 0 && bIndexPriority > 0) {
                            return bIndexPriority - aIndexPriority;
                        }
                    }

                    // Se ambos são do mesmo tipo (ou nenhum é index), ordenar alfabeticamente
                    return a.title.localeCompare(b.title, 'pt-BR', {
                        numeric: true,
                        sensitivity: 'base'
                    });
                });

                // Recursivamente ordenar subpastas
                this.sortNavigationChildren(item.children);
            }
        }
    }

    private getIndexFilePriority(item: NavigationItem): number {
        if (!item.path) return 0;

        // Procurar na lista de páginas pelo item correspondente
        const page = this.pages.find(p => p.url === item.path);
        if (page) {
            const filename = path.basename(page.relativePath, '.md').toLowerCase();

            // Verificar se é um arquivo de índice (com ou sem acento)
            // Remover acentos para comparação mais robusta
            const normalizedFilename = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            // índice.md tem prioridade 2 (maior prioridade)
            if (normalizedFilename === 'indice') {
                return 2;
            }

            // index.md tem prioridade 1
            if (normalizedFilename === 'index') {
                return 1;
            }
        }

        // Não é arquivo de índice
        return 0;
    }

    private isIndexFile(item: NavigationItem): boolean {
        return this.getIndexFilePriority(item) > 0;
    }

    private async generatePages(): Promise<void> {
        const templatePath = path.join(this.resolvedThemesDir, this.config.theme, 'layouts', `${this.config.layout}.html`);
        let template = '';

        try {
            template = await fs.readFile(templatePath, 'utf-8');
        } catch (err) {
            console.warn(`Template not found at ${templatePath}, using default template`);
            template = this.getDefaultTemplate();
        }

        for (const page of this.pages) {
            const html = this.renderTemplate(template, page);
            const outputPath = path.join(this.config.outputDir, page.url);

            await fs.ensureDir(path.dirname(outputPath));
            await fs.writeFile(outputPath, html);
        }
    }

    private renderTemplate(template: string, page: DocumentPage): string {
        let renderedTemplate = template
            .replace(/\{\{title\}\}/g, page.title)
            .replace(/\{\{content\}\}/g, page.content)
            .replace(/\{\{site\.title\}\}/g, this.config.site.title)
            .replace(/\{\{site\.description\}\}/g, this.config.site.description)
            .replace(/\{\{site\.author\}\}/g, this.config.site.author)
            .replace(/\{\{site\.baseUrl\}\}/g, this.config.site.baseUrl)
            .replace(/\{\{navigation\}\}/g, this.renderNavigation())
            .replace(/\{\{baseUrl\}\}/g, this.config.site.baseUrl)
            .replace(/\{\{markdownUrl\}\}/g, this.config.site.baseUrl + page.markdownUrl);

        // Aplicar cache busting nos assets
        renderedTemplate = this.applyAssetCacheBusting(renderedTemplate);

        return renderedTemplate;
    }

    private renderNavigation(): string {
        return this.renderNavigationItems(this.navigation);
    }

    private renderNavigationItems(items: NavigationItem[]): string {
        return items.map(item => {
            const hasChildren = item.children && item.children.length > 0;
            const baseUrl = this.config.site.baseUrl;

            let content = '';
            if (item.path) {
                // É um arquivo - criar link
                content = `<a href="${baseUrl}${item.path}">${item.title}</a>`;
            } else if (hasChildren) {
                // É uma pasta com filhos - criar span para o título da pasta
                content = `<span class="folder-header">${item.title}</span>`;
            } else {
                // É uma pasta vazia - criar span simples
                content = `<span class="folder-header">${item.title}</span>`;
            }

            const children = hasChildren && item.children ? `<ul>${this.renderNavigationItems(item.children)}</ul>` : '';
            return `<li>${content}${children}</li>`;
        }).join('');
    }

    private getDefaultTemplate(): string {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - {{site.title}}</title>
    <meta name="description" content="{{site.description}}">
    <link rel="stylesheet" href="{{baseUrl}}assets/css/style.css">
    <link rel="stylesheet" href="{{baseUrl}}assets/css/highlight.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1 class="site-title">{{site.title}}</h1>
        </div>
    </header>
    
    <div class="container">
        <aside class="sidebar">
            <nav class="navigation">
                <ul>{{navigation}}</ul>
            </nav>
        </aside>
        
        <main class="content">
            <article>
                <h1>{{title}}</h1>
                {{content}}
            </article>
        </main>
    </div>
    
    <script src="{{baseUrl}}assets/js/main.js"></script>
</body>
</html>`;
    }

    private async copyAssetsWithCacheBusting(): Promise<void> {
        const themeAssetsDir = path.join(this.resolvedThemesDir, this.config.theme, 'assets');
        const outputAssetsDir = path.join(this.config.outputDir, 'assets');

        try {
            // Verificar se o diretório de assets do tema existe
            if (!await fs.pathExists(themeAssetsDir)) {
                console.warn(`Theme assets directory not found: ${themeAssetsDir}`);
                await this.createDefaultAssets();
                return;
            }

            // Criar diretório de saída
            await fs.ensureDir(outputAssetsDir);

            // Processar assets com cache busting
            await this.processAssetsRecursively(themeAssetsDir, outputAssetsDir, '');

            console.log(`✅ Assets copied with cache busting from: ${themeAssetsDir}`);
        } catch (err) {
            console.warn(`Could not copy theme assets from ${themeAssetsDir}`);
            console.warn('Error:', err instanceof Error ? err.message : err);
            // Criar assets padrão
            await this.createDefaultAssets();
        }
    }

    private async processAssetsRecursively(sourceDir: string, outputDir: string, relativePath: string): Promise<void> {
        const entries = await fs.readdir(sourceDir, { withFileTypes: true });

        for (const entry of entries) {
            const sourcePath = path.join(sourceDir, entry.name);
            const currentRelativePath = relativePath ? path.join(relativePath, entry.name) : entry.name;

            if (entry.isDirectory()) {
                // Criar subdiretório e processar recursivamente
                const outputSubDir = path.join(outputDir, entry.name);
                await fs.ensureDir(outputSubDir);
                await this.processAssetsRecursively(sourcePath, outputSubDir, currentRelativePath);
            } else if (entry.isFile()) {
                // Verificar se é um arquivo que precisa de cache busting
                if (this.shouldApplyCacheBusting(entry.name)) {
                    await this.copyAssetWithHash(sourcePath, outputDir, entry.name, currentRelativePath);
                } else {
                    // Copiar arquivo normalmente
                    const outputPath = path.join(outputDir, entry.name);
                    await fs.copy(sourcePath, outputPath);
                }
            }
        }
    }

    private shouldApplyCacheBusting(filename: string): boolean {
        const extensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot'];
        return extensions.some(ext => filename.toLowerCase().endsWith(ext));
    }

    private async copyAssetWithHash(sourcePath: string, outputDir: string, filename: string, relativePath: string): Promise<void> {
        // Ler conteúdo do arquivo
        const content = await fs.readFile(sourcePath);

        // Gerar hash do conteúdo
        const hash = createHash('md5').update(content).digest('hex').substring(0, 8);

        // Gerar novo nome com hash
        const parsedPath = path.parse(filename);
        const hashedFilename = `${parsedPath.name}.${hash}${parsedPath.ext}`;

        // Normalizar caminhos
        const normalizedRelativePath = relativePath.replace(/\\/g, '/');
        const hashedRelativePath = path.join(path.dirname(normalizedRelativePath), hashedFilename).replace(/\\/g, '/');

        // Salvar mapping para substituição posterior
        const originalAssetPath = `assets/${normalizedRelativePath}`;
        const hashedAssetPath = `assets/${hashedRelativePath}`;
        this.assetMapping[originalAssetPath] = hashedAssetPath;

        // Copiar arquivo com novo nome
        const outputPath = path.join(outputDir, hashedFilename);
        await fs.writeFile(outputPath, content);

        console.log(`📦 Asset with cache busting: ${originalAssetPath} → ${hashedAssetPath}`);
    }

    private applyAssetCacheBusting(template: string): string {
        let result = template;

        // Substituir referências de assets pelos nomes com hash
        for (const [originalPath, hashedPath] of Object.entries(this.assetMapping)) {
            // Substituir em href e src attributes
            const patterns = [
                new RegExp(`href="([^"]*?)${originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
                new RegExp(`src="([^"]*?)${originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
                new RegExp(`href='([^']*?)${originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'),
                new RegExp(`src='([^']*?)${originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g')
            ];

            patterns.forEach(pattern => {
                result = result.replace(pattern, (match, prefix) => {
                    return match.replace(originalPath, hashedPath);
                });
            });
        }

        return result;
    }

    private async createDefaultAssets(): Promise<void> {
        const assetsDir = path.join(this.config.outputDir, 'assets');
        await fs.ensureDir(path.join(assetsDir, 'css'));
        await fs.ensureDir(path.join(assetsDir, 'js'));

        // CSS padrão será criado em outro arquivo
        // JS padrão será criado em outro arquivo
    }

    /**
     * Gera o índice de busca e salva como arquivo JSON
     */
    private async generateSearchIndex(): Promise<void> {
        console.log('🔍 Generating search index...');

        try {
            const searchData = this.searchIndex.getSerializableData();
            const searchIndexPath = path.join(this.config.outputDir, 'search-index.json');

            await fs.writeFile(searchIndexPath, JSON.stringify(searchData, null, 2));
            console.log('✅ Search index generated successfully');
        } catch (error) {
            console.error('❌ Failed to generate search index:', error);
        }
    }

    private async copyMarkdownFiles(): Promise<void> {
        const inputDir = path.resolve(this.config.inputDir);
        const files = await this.findMarkdownFiles(inputDir);

        for (const filePath of files) {
            const relativePath = path.relative(inputDir, filePath);
            const outputPath = path.join(this.config.outputDir, relativePath);

            await fs.ensureDir(path.dirname(outputPath));
            await fs.copy(filePath, outputPath);
        }
    }

    /**
     * Valida se o arquivo Markdown começa com H1
     * @param content Conteúdo do markdown (sem frontmatter)
     * @param frontmatter Frontmatter extraído do arquivo
     * @returns true se válido, false caso contrário
     */
    private validateMarkdownStartsWithH1(content: string, frontmatter: Record<string, any>): boolean {
        // Se há título no frontmatter, consideramos válido
        if (frontmatter.title) {
            return true;
        }

        // Remover linhas vazias do início
        const trimmedContent = content.replace(/^\s*\n/, '');

        // Verificar se a primeira linha não vazia é um H1
        const firstLine = trimmedContent.split('\n')[0];
        if (!firstLine) {
            return false;
        }

        // Verificar se começa com # seguido de espaço e texto
        const h1Regex = /^#\s+.+/;
        return h1Regex.test(firstLine.trim());
    }
} 