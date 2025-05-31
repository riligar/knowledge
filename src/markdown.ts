import { marked } from 'marked';
import hljs from 'highlight.js';
import type { DocForgeConfig } from './config.js';

export interface ParsedMarkdown {
    content: string;
    frontmatter: Record<string, any>;
    title: string;
    headings: Heading[];
    excerpt?: string;
}

export interface Heading {
    level: number;
    text: string;
    id: string;
    children: Heading[];
}

export class MarkdownProcessor {
    constructor(private config: DocForgeConfig) {
        this.configureMarked();
    }

    private configureMarked() {
        const renderer = new marked.Renderer();

        // Custom heading renderer para gerar IDs
        renderer.heading = (text: string, level: number) => {
            const id = this.generateId(text);
            return `<h${level} id="${id}">${text}</h${level}>`;
        };

        // Custom code renderer com syntax highlighting
        renderer.code = (code: string, language?: string) => {
            if (language && hljs.getLanguage(language)) {
                try {
                    const highlighted = hljs.highlight(code, { language }).value;
                    return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
                } catch (err) {
                    console.warn(`Failed to highlight code block with language "${language}":`, err);
                }
            }
            return `<pre><code class="hljs">${this.escapeHtml(code)}</code></pre>`;
        };

        // Custom link renderer para links internos
        renderer.link = (href: string, title: string | null, text: string) => {
            const isInternal = href.startsWith('./') || href.startsWith('../') || !href.includes('://');
            const target = isInternal ? '' : ' target="_blank" rel="noopener noreferrer"';
            const titleAttr = title ? ` title="${title}"` : '';
            return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
        };

        marked.setOptions({
            renderer,
            breaks: this.config.markdown.breaks,
            gfm: true,
            pedantic: false,
            smartypants: this.config.markdown.typographer
        });
    }

    public async parse(content: string): Promise<ParsedMarkdown> {
        const { frontmatter, body } = this.extractFrontmatter(content);
        const headings = this.extractHeadings(body);
        const title = this.extractTitle(body, frontmatter);
        const excerpt = this.extractExcerpt(body);

        const processedContent = await marked(body);

        return {
            content: processedContent,
            frontmatter,
            title,
            headings,
            excerpt
        };
    }

    private extractFrontmatter(content: string): { frontmatter: Record<string, any>, body: string } {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = content.match(frontmatterRegex);

        if (!match || !match[0]) {
            return { frontmatter: {}, body: content };
        }

        const frontmatterText = match[1];
        if (!frontmatterText) {
            return { frontmatter: {}, body: content.slice(match[0].length) };
        }

        const body = content.slice(match[0].length);

        // Parse YAML frontmatter (implementação simples)
        const frontmatter: Record<string, any> = {};
        frontmatterText.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.slice(0, colonIndex).trim();
                const value = line.slice(colonIndex + 1).trim();
                frontmatter[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes
            }
        });

        return { frontmatter, body };
    }

    private extractHeadings(content: string): Heading[] {
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        const headings: Heading[] = [];
        const stack: Heading[] = [];

        let match;
        while ((match = headingRegex.exec(content)) !== null) {
            if (!match[1] || !match[2]) continue;

            const level = match[1].length;
            const text = match[2].trim();
            const id = this.generateId(text);

            const heading: Heading = {
                level,
                text,
                id,
                children: []
            };

            // Organizar hierarquia
            while (stack.length > 0) {
                const lastItem = stack[stack.length - 1];
                if (lastItem && lastItem.level >= level) {
                    stack.pop();
                } else {
                    break;
                }
            }

            if (stack.length === 0) {
                headings.push(heading);
            } else {
                const parent = stack[stack.length - 1];
                if (parent) {
                    parent.children.push(heading);
                }
            }

            stack.push(heading);
        }

        return headings;
    }

    private extractTitle(content: string, frontmatter: Record<string, any>): string {
        if (frontmatter.title) {
            return frontmatter.title;
        }

        const firstHeading = content.match(/^#\s+(.+)$/m);
        return firstHeading?.[1] || 'Untitled';
    }

    private extractExcerpt(content: string): string {
        const firstParagraph = content.match(/^(?!#)(.+?)(?:\n\n|\n#|$)/m);
        return firstParagraph?.[1]?.trim() || '';
    }

    private generateId(text: string): string {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
} 