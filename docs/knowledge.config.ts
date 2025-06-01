import type { KnowledgeConfig } from '../src/config.js';

const config: KnowledgeConfig = {
    site: {
        title: 'Teste de Ordenação',
        description: 'Teste da priorização de arquivos index.md na navegação',
        author: 'Teste',
        baseUrl: '/'
    },
    inputDir: '.',
    outputDir: './dist',
    templatesDir: '../templates',
    themesDir: '../themes',
    theme: 'default',
    layout: 'default',
    navigation: {
        auto: true
    },
    features: {
        search: true,
        syntaxHighlight: true,
        darkMode: true,
        tableOfContents: true,
        breadcrumbs: true
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

export default config; 