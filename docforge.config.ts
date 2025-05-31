import type { DocForgeConfig } from './src/config.js';

export default {
    inputDir: './docs',
    outputDir: './dist',
    templatesDir: './templates',
    themesDir: './themes',

    site: {
        title: 'Knowledge',
        description: 'A modern, open-source documentation platform that transforms how teams create, organize, and share knowledge.',
        baseUrl: '/',
        author: 'RiliGar'
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
} as DocForgeConfig; 