import lunr from 'lunr';
import type { DocumentPage } from './generator.js';

export interface SearchDocument {
    id: string;
    title: string;
    content: string;
    url: string;
    excerpt: string;
}

export interface SearchResult {
    ref: string;
    score: number;
    matchData: any;
    document: SearchDocument;
}

export class SearchIndexGenerator {
    private documents: SearchDocument[] = [];
    private index: lunr.Index | null = null;

    constructor() { }

    /**
     * Adiciona uma página ao índice de busca
     */
    addPage(page: DocumentPage): void {
        // Remove tags HTML e markdown do conteúdo
        const cleanContent = this.cleanContent(page.content);

        // Gera um excerpt (resumo) do conteúdo
        const excerpt = this.generateExcerpt(cleanContent);

        const document: SearchDocument = {
            id: page.url,
            title: page.title,
            content: cleanContent,
            url: page.url,
            excerpt: excerpt
        };

        this.documents.push(document);
    }

    /**
     * Constrói o índice de busca usando Lunr.js
     */
    buildIndex(): lunr.Index {
        const documents = this.documents;

        this.index = lunr(function () {
            // Configurar campos para busca
            this.field('title', { boost: 10 }); // Título tem peso maior
            this.field('content', { boost: 1 });
            this.field('excerpt', { boost: 5 }); // Excerpt tem peso médio

            // Usar URL como referência
            this.ref('id');

            // Adicionar documentos ao índice
            for (const doc of documents) {
                this.add(doc);
            }
        });

        return this.index;
    }

    /**
     * Realiza busca no índice
     */
    search(query: string): SearchResult[] {
        if (!this.index) {
            throw new Error('Index not built. Call buildIndex() first.');
        }

        const results = this.index.search(query);

        return results.map((result: lunr.Index.Result) => ({
            ref: result.ref,
            score: result.score,
            matchData: result.matchData,
            document: this.documents.find(doc => doc.id === result.ref)!
        }));
    }

    /**
     * Gera dados serializáveis para o cliente
     */
    getSerializableData(): { documents: SearchDocument[], indexData: any } {
        if (!this.index) {
            this.buildIndex();
        }

        return {
            documents: this.documents,
            indexData: this.index!.toJSON()
        };
    }

    /**
     * Remove tags HTML e markdown do conteúdo
     */
    private cleanContent(content: string): string {
        return content
            // Remove código em blocos
            .replace(/```[\s\S]*?```/g, '')
            // Remove código inline
            .replace(/`[^`]*`/g, '')
            // Remove tags HTML
            .replace(/<[^>]*>/g, '')
            // Remove markdown headers
            .replace(/^#{1,6}\s+/gm, '')
            // Remove markdown links
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
            // Remove markdown bold/italic
            .replace(/\*\*([^*]*)\*\*/g, '$1')
            .replace(/\*([^*]*)\*/g, '$1')
            // Remove linhas vazias múltiplas
            .replace(/\n\s*\n/g, '\n')
            // Trim espaços
            .trim();
    }

    /**
     * Gera um excerpt (resumo) do conteúdo
     */
    private generateExcerpt(content: string, maxLength: number = 200): string {
        const sentences = content.split(/[.!?]+/);
        let excerpt = '';

        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence && excerpt.length + trimmedSentence.length <= maxLength) {
                excerpt += (excerpt ? '. ' : '') + trimmedSentence;
            } else {
                break;
            }
        }

        return excerpt || content.substring(0, maxLength).trim() + '...';
    }

    /**
     * Limpa o índice
     */
    clear(): void {
        this.documents = [];
        this.index = null;
    }
} 