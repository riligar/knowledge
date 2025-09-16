import { marked } from 'marked';
import type { DocumentationConfig } from './config.js';
import hljs from 'highlight.js';

interface ProcessedMarkdown {
    html: string;
    title?: string;
    metadata: Record<string, any>;
    isValid: boolean;
}

interface FrontMatter {
    title?: string;
    description?: string;
    author?: string;
    date?: string;
    tags?: string[];
    [key: string]: any;
}

export class MarkdownProcessor {
    constructor(private config: DocumentationConfig) {
        this.configureMarked();
    }

    async process(content: string): Promise<ProcessedMarkdown> {
        // Extrair front matter se existir
        const { frontMatter, markdown } = this.extractFrontMatter(content);

        // Validar se o markdown começa com H1
        const isValid = this.validateMarkdownStartsWithH1(markdown, frontMatter);

        // Processar markdown
        const html = await marked(markdown);

        // Extrair título se não estiver no front matter
        const title = frontMatter.title || this.extractTitle(markdown);

        return {
            html,
            title,
            metadata: frontMatter,
            isValid
        };
    }

    /**
     * Valida se o arquivo Markdown começa com H1
     * @param content Conteúdo do markdown (sem frontmatter)
     * @param frontMatter Frontmatter extraído do arquivo
     * @returns true se válido, false caso contrário
     */
    validateMarkdownStartsWithH1(content: string, frontMatter: FrontMatter): boolean {
        // Se há título no frontmatter, consideramos válido
        if (frontMatter.title) {
            return true;
        }

        // Verificar se o conteúdo começa com H1 (ignorando linhas vazias no início)
        const h1Regex = /^\s*#\s+.+/;
        return h1Regex.test(content);
    }

    private configureMarked(): void {
        marked.setOptions({
            breaks: this.config.markdown.breaks,
            gfm: true,
            pedantic: false
        });
    }

    private extractFrontMatter(content: string): { frontMatter: FrontMatter; markdown: string } {
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = content.match(frontMatterRegex);

        if (!match || !match[1] || !match[0]) {
            return { frontMatter: {}, markdown: content };
        }

        const frontMatterYaml = match[1];
        const markdown = content.slice(match[0].length);

        try {
            // Parse simples do YAML (apenas key: value)
            const frontMatter: FrontMatter = {};
            const lines = frontMatterYaml.split('\n');

            for (const line of lines) {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.slice(0, colonIndex).trim();
                    const value = line.slice(colonIndex + 1).trim();

                    // Remover aspas se existirem
                    const cleanValue = value.replace(/^["']|["']$/g, '');

                    // Tentar converter para array se for uma lista
                    if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
                        try {
                            frontMatter[key] = JSON.parse(cleanValue);
                        } catch {
                            frontMatter[key] = cleanValue;
                        }
                    } else {
                        frontMatter[key] = cleanValue;
                    }
                }
            }

            return { frontMatter, markdown };
        } catch (error) {
            console.warn('Failed to parse front matter:', error);
            return { frontMatter: {}, markdown: content };
        }
    }

    private extractTitle(markdown: string): string | undefined {
        // Procurar pelo primeiro cabeçalho H1
        const h1Match = markdown.match(/^#\s+(.+)$/m);
        return h1Match && h1Match[1] ? h1Match[1].trim() : undefined;
    }
} 