import { marked } from 'marked';
import type { KnowledgeConfig } from './config.js';
import hljs from 'highlight.js';

interface ProcessedMarkdown {
    html: string;
    title?: string;
    metadata: Record<string, any>;
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
    constructor(private config: KnowledgeConfig) {
        this.configureMarked();
    }

    async process(content: string): Promise<ProcessedMarkdown> {
        // Extrair front matter se existir
        const { frontMatter, markdown } = this.extractFrontMatter(content);

        // Processar markdown
        const html = await marked(markdown);

        // Extrair título se não estiver no front matter
        const title = frontMatter.title || this.extractTitle(markdown);

        return {
            html,
            title,
            metadata: frontMatter
        };
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
        return h1Match ? h1Match[1].trim() : undefined;
    }
} 