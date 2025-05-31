#!/usr/bin/env bun
import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import chokidar from 'chokidar';
import { defaultConfig, loadConfig, type DocForgeConfig } from './config.js';
import { DocumentationGenerator } from './generator.js';
import { DevServer } from './dev-server.js';

const program = new Command();

program
    .name('docforge')
    .description('Modern static documentation generator powered by Bun.js')
    .version('1.0.0');

program
    .command('build')
    .description('Build the documentation site')
    .option('-c, --config <path>', 'Path to config file')
    .option('-i, --input <path>', 'Input directory containing markdown files')
    .option('-o, --output <path>', 'Output directory for generated site')
    .action(async (options) => {
        try {
            const config = await loadConfigWithOptions(options);
            const generator = new DocumentationGenerator(config);
            await generator.generate();
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    });

program
    .command('dev')
    .description('Start development server with live reload')
    .option('-c, --config <path>', 'Path to config file')
    .option('-p, --port <number>', 'Port for development server', '3000')
    .option('-h, --host <string>', 'Host for development server', 'localhost')
    .action(async (options) => {
        try {
            const config = await loadConfigWithOptions(options);
            if (options.port) config.dev.port = parseInt(options.port);
            if (options.host) config.dev.host = options.host;

            const devServer = new DevServer(config);
            await devServer.start();
        } catch (error) {
            console.error('❌ Dev server failed:', error);
            process.exit(1);
        }
    });

program
    .command('serve')
    .description('Serve the built documentation')
    .option('-p, --port <number>', 'Port for server', '8080')
    .option('-d, --dir <path>', 'Directory to serve', './dist')
    .action(async (options) => {
        try {
            const port = parseInt(options.port || '8080');
            const dir = path.resolve(options.dir || './dist');

            if (!await fs.pathExists(dir)) {
                console.error(`❌ Directory ${dir} does not exist. Run 'docforge build' first.`);
                process.exit(1);
            }

            console.log(`🚀 Serving documentation at http://localhost:${port}`);
            console.log(`📁 Serving from: ${dir}`);

            // Usar Bun.serve para servir arquivos estáticos
            Bun.serve({
                port,
                async fetch(req) {
                    const url = new URL(req.url);
                    let filePath = path.join(dir, url.pathname);

                    // Se for um diretório, tentar servir index.html
                    if (await fs.pathExists(filePath) && (await fs.stat(filePath)).isDirectory()) {
                        filePath = path.join(filePath, 'index.html');
                    }

                    // Se não existir, tentar com .html
                    if (!await fs.pathExists(filePath) && !filePath.endsWith('.html')) {
                        filePath += '.html';
                    }

                    try {
                        if (await fs.pathExists(filePath)) {
                            const file = Bun.file(filePath);
                            return new Response(file);
                        } else {
                            return new Response('404 Not Found', { status: 404 });
                        }
                    } catch (error) {
                        return new Response('500 Internal Server Error', { status: 500 });
                    }
                }
            });

        } catch (error) {
            console.error('❌ Serve failed:', error);
            process.exit(1);
        }
    });

program
    .command('init')
    .description('Initialize a new DocForge project')
    .option('-d, --dir <path>', 'Directory to initialize', '.')
    .action(async (options) => {
        try {
            const targetDir = path.resolve(options.dir || '.');
            await initializeProject(targetDir);
            console.log('✅ DocForge project initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            process.exit(1);
        }
    });

async function loadConfigWithOptions(options: any): Promise<DocForgeConfig> {
    let config = { ...defaultConfig };

    // Carregar arquivo de configuração se especificado
    if (options.config) {
        try {
            const configPath = path.resolve(options.config);
            const configFile = await import(configPath);
            config = { ...config, ...configFile.default };
        } catch (error) {
            console.warn(`⚠️  Could not load config file: ${options.config}`);
        }
    }

    // Sobrescrever com opções da linha de comando
    if (options.input) config.inputDir = options.input;
    if (options.output) config.outputDir = options.output;

    return config;
}

async function initializeProject(targetDir: string): Promise<void> {
    // Criar estrutura de diretórios
    await fs.ensureDir(path.join(targetDir, 'docs'));
    await fs.ensureDir(path.join(targetDir, 'themes/default/layouts'));
    await fs.ensureDir(path.join(targetDir, 'themes/default/assets/css'));
    await fs.ensureDir(path.join(targetDir, 'themes/default/assets/js'));

    // Criar arquivo de configuração
    const configContent = `import { DocForgeConfig } from './src/config.js';

export default {
  inputDir: './docs',
  outputDir: './dist',
  
  site: {
    title: 'My Documentation',
    description: 'Beautiful documentation made simple',
    baseUrl: '/',
    author: 'Your Name'
  },
  
  features: {
    search: true,
    syntaxHighlight: true,
    darkMode: true,
    tableOfContents: true,
    breadcrumbs: true
  }
} as DocForgeConfig;
`;

    await fs.writeFile(path.join(targetDir, 'docforge.config.ts'), configContent);

    // Criar exemplo de documentação
    const exampleDoc = `# Welcome to DocForge

This is your documentation homepage. Edit this file to get started!

## Features

- 🚀 Fast builds with Bun.js
- 📝 Markdown support with syntax highlighting
- 🎨 Beautiful default theme
- 🔍 Built-in search
- 📱 Mobile responsive
- 🌙 Dark mode support

## Getting Started

1. Edit files in the \`docs/\` directory
2. Run \`bun run dev\` to start the development server
3. Run \`bun run build\` to build for production

Happy documenting! 📚
`;

    await fs.writeFile(path.join(targetDir, 'docs/README.md'), exampleDoc);

    console.log(`📁 Created project structure in ${targetDir}`);
    console.log('📝 Created example documentation');
    console.log('⚙️  Created configuration file');
}

// Executar CLI se este arquivo for executado diretamente
if (import.meta.main) {
    program.parse();
} 