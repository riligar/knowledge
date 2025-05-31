import * as fs from 'fs-extra';
import * as path from 'path';
import { marked } from 'marked';
import hljs from 'highlight.js';
import type { DocForgeConfig, NavigationItem } from './config.js';
import { SearchIndexGenerator } from './search.js';

export interface DocumentPage {
    path: string;
    title: string;
    content: string;
    frontmatter: Record<string, any>;
    relativePath: string;
    url: string;
}

export class DocumentationGenerator {
    private pages: DocumentPage[] = [];
    private navigation: NavigationItem[] = [];
    private searchIndex: SearchIndexGenerator;

    constructor(private config: DocForgeConfig) {
        this.setupMarked();
        this.searchIndex = new SearchIndexGenerator();
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

        // Gerar páginas HTML
        await this.generatePages();

        // Copiar assets
        await this.copyAssets();

        console.log(`✅ Documentation generated successfully in ${this.config.outputDir}`);
    }

    private async processMarkdownFiles(): Promise<void> {
        const inputDir = path.resolve(this.config.inputDir);
        const files = await this.findMarkdownFiles(inputDir);

        for (const filePath of files) {
            const content = await fs.readFile(filePath, 'utf-8');
            const relativePath = path.relative(inputDir, filePath);
            const { frontmatter, body } = this.extractFrontmatter(content);

            const htmlContent = await this.processMarkdown(body);
            const title = this.extractTitle(body, frontmatter);
            const url = this.generateUrl(relativePath);

            const page: DocumentPage = {
                path: filePath,
                title,
                content: htmlContent,
                frontmatter,
                relativePath,
                url
            };

            this.pages.push(page);

            // Adicionar página ao índice de busca
            this.searchIndex.addPage(page);
        }
    }

    private async processMarkdown(content: string): Promise<string> {
        // Processar markdown com syntax highlighting manual
        let html = await marked(content);

        // Aplicar syntax highlighting em blocos de código
        html = html.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
            if (hljs.getLanguage(lang)) {
                try {
                    const highlighted = hljs.highlight(code, { language: lang }).value;
                    return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
                } catch (err) {
                    console.warn(`Failed to highlight code with language "${lang}":`, err);
                }
            }
            return match;
        });

        return html;
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

        // Ordenar itens da raiz: arquivos primeiro, depois pastas (ambos em ordem alfabética)
        rootItems.sort((a, b) => {
            const aIsFile = a.path !== '';
            const bIsFile = b.path !== '';

            // Se um é arquivo e outro é pasta, arquivo vem primeiro
            if (aIsFile && !bIsFile) return -1;
            if (!aIsFile && bIsFile) return 1;

            // Se ambos são do mesmo tipo, ordenar alfabeticamente
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
                // Ordenar filhos alfabeticamente
                item.children.sort((a, b) => {
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

    private async generatePages(): Promise<void> {
        const templatePath = path.join(this.config.themesDir, this.config.theme, 'layouts', `${this.config.layout}.html`);
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
        return template
            .replace(/\{\{title\}\}/g, page.title)
            .replace(/\{\{content\}\}/g, page.content)
            .replace(/\{\{site\.title\}\}/g, this.config.site.title)
            .replace(/\{\{site\.description\}\}/g, this.config.site.description)
            .replace(/\{\{site\.author\}\}/g, this.config.site.author)
            .replace(/\{\{site\.baseUrl\}\}/g, this.config.site.baseUrl)
            .replace(/\{\{navigation\}\}/g, this.renderNavigation())
            .replace(/\{\{baseUrl\}\}/g, this.config.site.baseUrl);
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

    private async copyAssets(): Promise<void> {
        const themeAssetsDir = path.join(this.config.themesDir, this.config.theme, 'assets');
        const outputAssetsDir = path.join(this.config.outputDir, 'assets');

        try {
            await fs.copy(themeAssetsDir, outputAssetsDir);
        } catch (err) {
            console.warn(`Could not copy theme assets from ${themeAssetsDir}`);
            // Criar assets padrão
            await this.createDefaultAssets();
        }
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
} 