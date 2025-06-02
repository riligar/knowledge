import type { KnowledgeConfig } from './src/config.js';

export default {
    inputDir: './docs',
    outputDir: './dist',
    templatesDir: './templates',
    themesDir: './themes',

    site: {
        title: 'Knowledge',
        description: 'A modern, open-source documentation platform that transforms how teams create, organize, and share knowledge.',
        baseUrl: '/',
        author: 'Ciro Cesar Maciel'
    },

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
        breadcrumbs: true,
        editOnGithub: 'https://github.com/riligar/knowledge'
    },

    analytics: {
        script: '<script defer src="https://analytics.riligar.click/script.js" data-website-id="02351e3d-4e59-4c69-8e6d-5624abdff94e"></script>'
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
} as KnowledgeConfig; 