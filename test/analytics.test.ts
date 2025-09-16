import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { DocumentationGenerator } from '../src/generator.js';
import type { DocumentationConfig } from '../src/config.js';
import * as fs from 'fs-extra';
import * as path from 'path';

describe('Analytics Feature', () => {
    const testDir = './test-output-analytics';
    const docsDir = './test-docs-analytics';

    beforeEach(async () => {
        // Criar diretório de teste com um arquivo markdown
        await fs.ensureDir(docsDir);
        await fs.writeFile(
            path.join(docsDir, 'index.md'),
            '# Test Page\n\nThis is a test page for analytics.'
        );
    });

    afterEach(async () => {
        // Limpar diretórios de teste
        await fs.remove(testDir);
        await fs.remove(docsDir);
    });

    it('should include analytics script when configured', async () => {
        const config: DocumentationConfig = {
            inputDir: docsDir,
            outputDir: testDir,
            templatesDir: './templates',
            themesDir: './themes',
            site: {
                title: 'Test Site',
                description: 'Test Description',
                baseUrl: '/',
                author: 'Test Author'
            },
            theme: 'default',
            layout: 'default',
            navigation: { auto: true },
            features: {
                search: true,
                syntaxHighlight: true,
                darkMode: true,
                tableOfContents: true,
                breadcrumbs: true
            },
            analytics: {
                script: '<script defer src="https://analytics.riligar.click/script.js" data-website-id="test-id"></script>'
            },
            markdown: {
                breaks: true,
                linkify: true,
                typographer: true
            },
            dev: {
                port: 3000,
                host: 'localhost',
                livereload: true
            }
        };

        const generator = new DocumentationGenerator(config);
        await generator.generate();

        // Verificar se o arquivo HTML foi gerado
        const htmlPath = path.join(testDir, 'index.html');
        expect(await fs.pathExists(htmlPath)).toBe(true);

        // Ler o conteúdo do arquivo HTML
        const htmlContent = await fs.readFile(htmlPath, 'utf-8');

        // Verificar se o script de analytics está presente
        expect(htmlContent).toContain('analytics.riligar.click/script.js');
        expect(htmlContent).toContain('data-website-id="test-id"');
        expect(htmlContent).toContain('<script defer');
    });

    it('should not include analytics script when not configured', async () => {
        const config: DocumentationConfig = {
            inputDir: docsDir,
            outputDir: testDir,
            templatesDir: './templates',
            themesDir: './themes',
            site: {
                title: 'Test Site',
                description: 'Test Description',
                baseUrl: '/',
                author: 'Test Author'
            },
            theme: 'default',
            layout: 'default',
            navigation: { auto: true },
            features: {
                search: true,
                syntaxHighlight: true,
                darkMode: true,
                tableOfContents: true,
                breadcrumbs: true
            },
            // analytics não configurado
            markdown: {
                breaks: true,
                linkify: true,
                typographer: true
            },
            dev: {
                port: 3000,
                host: 'localhost',
                livereload: true
            }
        };

        const generator = new DocumentationGenerator(config);
        await generator.generate();

        // Verificar se o arquivo HTML foi gerado
        const htmlPath = path.join(testDir, 'index.html');
        expect(await fs.pathExists(htmlPath)).toBe(true);

        // Ler o conteúdo do arquivo HTML
        const htmlContent = await fs.readFile(htmlPath, 'utf-8');

        // Verificar se o script de analytics NÃO está presente
        expect(htmlContent).not.toContain('analytics.riligar.click');
        expect(htmlContent).not.toContain('data-website-id');
    });

    it('should handle empty analytics script', async () => {
        const config: DocumentationConfig = {
            inputDir: docsDir,
            outputDir: testDir,
            templatesDir: './templates',
            themesDir: './themes',
            site: {
                title: 'Test Site',
                description: 'Test Description',
                baseUrl: '/',
                author: 'Test Author'
            },
            theme: 'default',
            layout: 'default',
            navigation: { auto: true },
            features: {
                search: true,
                syntaxHighlight: true,
                darkMode: true,
                tableOfContents: true,
                breadcrumbs: true
            },
            analytics: {
                script: '' // script vazio
            },
            markdown: {
                breaks: true,
                linkify: true,
                typographer: true
            },
            dev: {
                port: 3000,
                host: 'localhost',
                livereload: true
            }
        };

        const generator = new DocumentationGenerator(config);
        await generator.generate();

        // Verificar se o arquivo HTML foi gerado
        const htmlPath = path.join(testDir, 'index.html');
        expect(await fs.pathExists(htmlPath)).toBe(true);

        // Ler o conteúdo do arquivo HTML
        const htmlContent = await fs.readFile(htmlPath, 'utf-8');

        // Verificar se não há conteúdo de analytics
        expect(htmlContent).not.toContain('analytics.riligar.click');
    });
}); 