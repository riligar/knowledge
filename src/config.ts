import * as fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';

export interface DocumentationConfig {
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

    // Analytics
    analytics?: {
        script: string;
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

export const defaultConfig: DocumentationConfig = {
    inputDir: './docs',
    outputDir: './dist',
    templatesDir: './templates',
    themesDir: './themes',

    site: {
        title: 'Documentation',
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

    analytics: {
        script: ''
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

export async function loadConfigAsync(configPath?: string): Promise<DocumentationConfig> {
    let config = { ...defaultConfig };

    // Lista de possíveis arquivos de configuração em ordem de prioridade
    const possibleConfigFiles = [
        configPath,
        'documentation.config.ts',
        'documentation.config.js',
        'documentation.config.mjs',
        'documentation.config.json',
        '.documentation.config.ts',
        '.documentation.config.js',
        '.documentation.config.mjs',
        '.documentation.config.json',
        'knowledge.config.ts',
        'knowledge.config.js',
        'knowledge.config.mjs',
        'knowledge.config.json',
        '.knowledge.config.ts',
        '.knowledge.config.js',
        '.knowledge.config.mjs',
        '.knowledge.config.json'
    ].filter(Boolean) as string[];

    for (const configFile of possibleConfigFiles) {
        try {
            const resolvedPath = path.resolve(configFile);

            // Verificar se o arquivo existe
            if (!await fs.pathExists(resolvedPath)) {
                continue;
            }

            let userConfig: Partial<DocumentationConfig>;

            if (configFile.endsWith('.json')) {
                // Carregar arquivo JSON
                const configContent = await fs.readFile(resolvedPath, 'utf-8');
                userConfig = JSON.parse(configContent);
            } else {
                // Carregar arquivo TypeScript/JavaScript
                const configModule = await import(resolvedPath);
                userConfig = configModule.default || configModule;
            }

            // Fazer merge profundo da configuração
            config = mergeConfig(config, userConfig);

            console.log(`✅ Loaded configuration from: ${configFile}`);
            break;

        } catch (error) {
            console.warn(`⚠️  Could not load config file ${configFile}:`, error instanceof Error ? error.message : error);
            continue;
        }
    }

    // Validar configuração final
    validateConfig(config);

    return config;
}

/**
 * Versão síncrona da função loadConfig
 * Recomenda-se usar loadConfigAsync quando possível
 */
export function loadConfig(configPath?: string): DocumentationConfig {
    try {
        // Para compatibilidade, tenta carregar de forma síncrona
        // Primeiro verifica se existe um arquivo de configuração
        const possibleConfigFiles = [
            configPath,
            'documentation.config.ts',
            'documentation.config.js',
            'documentation.config.mjs',
            'documentation.config.json',
            '.documentation.config.ts',
            '.documentation.config.js',
            '.documentation.config.mjs',
            '.documentation.config.json',
            'knowledge.config.ts',
            'knowledge.config.js',
            'knowledge.config.mjs',
            'knowledge.config.json',
            '.knowledge.config.ts',
            '.knowledge.config.js',
            '.knowledge.config.mjs',
            '.knowledge.config.json'
        ].filter(Boolean) as string[];

        for (const configFile of possibleConfigFiles) {
            try {
                const resolvedPath = path.resolve(configFile);

                // Verificar se o arquivo existe (síncrono)
                if (!fs.existsSync(resolvedPath)) {
                    continue;
                }

                let userConfig: Partial<DocumentationConfig>;

                if (configFile.endsWith('.json')) {
                    // Carregar arquivo JSON
                    const configContent = fs.readFileSync(resolvedPath, 'utf-8');
                    userConfig = JSON.parse(configContent);
                } else {
                    // Para arquivos TS/JS, usar require (limitação da versão síncrona)
                    console.warn(`⚠️  Synchronous loading of ${configFile} may not work with ES modules. Consider using loadConfigAsync().`);
                    delete require.cache[resolvedPath];
                    userConfig = require(resolvedPath);
                    if (userConfig && typeof userConfig === 'object' && 'default' in userConfig) {
                        userConfig = (userConfig as any).default;
                    }
                }

                // Fazer merge profundo da configuração
                const config = mergeConfig(defaultConfig, userConfig);

                // Validar configuração final
                validateConfig(config);

                console.log(`✅ Loaded configuration from: ${configFile}`);
                return config;

            } catch (error) {
                console.warn(`⚠️  Could not load config file ${configFile}:`, error instanceof Error ? error.message : error);
                continue;
            }
        }

        return defaultConfig;

    } catch (error) {
        console.warn(`⚠️  Error loading configuration, using defaults:`, error instanceof Error ? error.message : error);
        return defaultConfig;
    }
}

/**
 * Faz merge profundo de duas configurações
 */
function mergeConfig(base: DocumentationConfig, override: Partial<DocumentationConfig>): DocumentationConfig {
    const result = { ...base };

    for (const [key, value] of Object.entries(override)) {
        if (value !== undefined) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Merge profundo para objetos
                result[key as keyof DocumentationConfig] = {
                    ...result[key as keyof DocumentationConfig] as any,
                    ...value
                };
            } else {
                // Substituição direta para valores primitivos e arrays
                result[key as keyof DocumentationConfig] = value as any;
            }
        }
    }

    return result;
}

/**
 * Valida a configuração carregada
 */
function validateConfig(config: DocumentationConfig): void {
    const errors: string[] = [];

    // Validar campos obrigatórios
    if (!config.inputDir) errors.push('inputDir is required');
    if (!config.outputDir) errors.push('outputDir is required');
    if (!config.site?.title) errors.push('site.title is required');
    if (!config.site?.description) errors.push('site.description is required');

    // Validar tipos
    if (typeof config.dev?.port !== 'number' || config.dev.port < 1 || config.dev.port > 65535) {
        errors.push('dev.port must be a valid port number (1-65535)');
    }

    // Validar URLs
    if (config.site?.baseUrl && !config.site.baseUrl.startsWith('/')) {
        errors.push('site.baseUrl must start with "/"');
    }

    if (errors.length > 0) {
        throw new Error(`Configuration validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`);
    }
}

/**
 * Resolve o caminho correto para o diretório de temas
 * Considera tanto instalação local quanto global
 */
export function resolveThemesDir(configThemesDir: string): string {
    // Se o caminho é absoluto, usar como está
    if (path.isAbsolute(configThemesDir)) {
        return configThemesDir;
    }

    // Tentar caminho relativo primeiro (instalação local ou projeto com temas próprios)
    const localThemesDir = path.resolve(configThemesDir);

    if (fs.existsSync(localThemesDir)) {
        return localThemesDir;
    }

    // Se não encontrou localmente, tentar no diretório de instalação do pacote
    try {
        // Obter o diretório do módulo atual
        const currentModuleDir = path.dirname(fileURLToPath(import.meta.url));

        // Navegar para o diretório raiz do pacote (src -> raiz)
        const packageRootDir = path.resolve(currentModuleDir, '..');

        // Caminho para os temas no pacote instalado
        const packageThemesDir = path.join(packageRootDir, 'themes');

        if (fs.existsSync(packageThemesDir)) {
            console.log(`📁 Using themes from package installation: ${packageThemesDir}`);
            return packageThemesDir;
        }
    } catch (error) {
        console.warn('⚠️  Could not resolve package themes directory:', error);
    }

    // Fallback para o caminho original
    console.warn(`⚠️  Themes directory not found, using fallback: ${localThemesDir}`);
    return localThemesDir;
} 