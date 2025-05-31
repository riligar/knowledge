export interface DocForgeConfig {
    // Diretórios
    inputDir: string;
    outputDir: string;
    templatesDir: string;
    themesDir: string;

    // Site metadata
    site: {
        title: string;
        description: string;
        baseUrl: string;
        author: string;
        logo?: string;
    };

    // Tema e layout
    theme: string;
    layout: string;

    // Navegação
    navigation: {
        auto: boolean;
        items?: NavigationItem[];
    };

    // Funcionalidades
    features: {
        search: boolean;
        syntaxHighlight: boolean;
        darkMode: boolean;
        tableOfContents: boolean;
        breadcrumbs: boolean;
        editOnGithub?: string;
    };

    // Markdown options
    markdown: {
        breaks: boolean;
        linkify: boolean;
        typographer: boolean;
    };

    // Servidor de desenvolvimento
    dev: {
        port: number;
        host: string;
        livereload: boolean;
    };
}

export interface NavigationItem {
    title: string;
    path: string;
    children?: NavigationItem[];
}

export const defaultConfig: DocForgeConfig = {
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

export function loadConfig(configPath?: string): DocForgeConfig {
    // TODO: Implementar carregamento de arquivo de configuração
    return defaultConfig;
} 