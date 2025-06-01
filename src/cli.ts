#!/usr/bin/env bun
import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import chokidar from 'chokidar';
import { defaultConfig, loadConfig, loadConfigAsync, type KnowledgeConfig } from './config.ts';
import { DocumentationGenerator } from './generator.ts';
import { DevServer } from './dev-server.ts';
import openBrowser from './open-browser.ts';
import { getAvailablePort } from './port-utils.ts';

// Importar versão do package.json
const packageJson = JSON.parse(await fs.readFile(path.join(import.meta.dir, '../package.json'), 'utf-8'));

const program = new Command();

program
    .name('knowledge')
    .description(packageJson.description)
    .version(packageJson.version);

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
            const preferredPort = parseInt(options.port || '3000');
            const host = options.host || 'localhost';

            // Encontrar uma porta disponível
            console.log(`🔍 Tentando iniciar servidor na porta ${preferredPort}...`);
            const { port, isPreferred } = await getAvailablePort(preferredPort);

            if (!isPreferred) {
                console.log(`⚠️  Porta ${preferredPort} já está em uso. Usando porta ${port} em vez disso.`);
            } else {
                console.log(`✅ Servidor iniciado na porta ${port}`);
            }

            // Atualizar configuração com a porta disponível
            config.dev.port = port;
            if (options.host) config.dev.host = host;

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
    .option('-c, --config <path>', 'Path to config file')
    .option('-p, --port <number>', 'Port for server', '8080')
    .option('-d, --dir <path>', 'Directory to serve')
    .option('--no-open', 'Do not open browser automatically')
    .action(async (options) => {
        try {
            // Carregar configuração para obter o outputDir correto
            const config = await loadConfigWithOptions(options);

            const preferredPort = parseInt(options.port || '8080');
            const dir = path.resolve(options.dir || config.outputDir);

            if (!await fs.pathExists(dir)) {
                console.error(`❌ Directory ${dir} does not exist. Run 'knowledge build' first.`);
                process.exit(1);
            }

            // Funções auxiliares para o servidor
            const isStaticFile = (pathname: string): boolean => {
                const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
                return staticExtensions.some(ext => pathname.toLowerCase().endsWith(ext));
            };

            const getContentType = (ext: string): string | null => {
                const contentTypes: Record<string, string> = {
                    '.html': 'text/html',
                    '.css': 'text/css',
                    '.js': 'application/javascript',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.svg': 'image/svg+xml',
                    '.ico': 'image/x-icon',
                    '.woff': 'font/woff',
                    '.woff2': 'font/woff2',
                    '.ttf': 'font/ttf',
                    '.eot': 'application/vnd.ms-fontobject'
                };
                return contentTypes[ext] || null;
            };

            // Encontrar uma porta disponível
            console.log(`🔍 Tentando iniciar servidor na porta ${preferredPort}...`);
            let port = preferredPort;
            let server: any;
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                try {
                    // Usar Bun.serve para servir arquivos estáticos
                    server = Bun.serve({
                        port,
                        async fetch(req) {
                            const url = new URL(req.url);
                            let filePath = path.join(dir, url.pathname);

                            // Se for um diretório, tentar servir index.html
                            if (await fs.pathExists(filePath) && (await fs.stat(filePath)).isDirectory()) {
                                filePath = path.join(filePath, 'index.html');
                            }

                            // Se não existir e não for um arquivo estático, tentar com .html
                            if (!await fs.pathExists(filePath) && !filePath.endsWith('.html') && !isStaticFile(url.pathname)) {
                                filePath += '.html';
                            }

                            try {
                                if (await fs.pathExists(filePath)) {
                                    const file = Bun.file(filePath);
                                    const response = new Response(file);

                                    // Definir Content-Type correto baseado na extensão
                                    const ext = path.extname(filePath).toLowerCase();
                                    const contentType = getContentType(ext);
                                    if (contentType) {
                                        response.headers.set('Content-Type', contentType);
                                    }

                                    return response;
                                } else {
                                    return new Response('404 Not Found', { status: 404 });
                                }
                            } catch (error) {
                                return new Response('500 Internal Server Error', { status: 500 });
                            }
                        }
                    });

                    // Se chegou até aqui, o servidor foi iniciado com sucesso
                    if (port !== preferredPort) {
                        console.log(`⚠️  Porta ${preferredPort} já está em uso. Usando porta ${port} em vez disso.`);
                    } else {
                        console.log(`✅ Servidor iniciado na porta ${port}`);
                    }
                    break;

                } catch (error: any) {
                    if (error.code === 'EADDRINUSE' || error.message?.includes('port') || error.message?.includes('use')) {
                        attempts++;
                        port = preferredPort + attempts;
                        console.log(`⚠️  Porta ${port - 1} já está em uso. Tentando porta ${port}...`);
                        continue;
                    } else {
                        throw error;
                    }
                }
            }

            if (attempts >= maxAttempts) {
                throw new Error(`Não foi possível encontrar uma porta disponível a partir da porta ${preferredPort} (tentativas: ${maxAttempts})`);
            }

            console.log(`🚀 Serving documentation at http://localhost:${port}`);
            console.log(`📁 Serving from: ${dir}`);

            // Abrir browser automaticamente se não foi desabilitado
            if (options.open !== false) {
                const url = `http://localhost:${port}`;
                console.log(`🌐 Opening browser at ${url}`);
                await openBrowser(url);
            }

            console.log('📖 Documentation server is running');
            console.log('Press Ctrl+C to stop');

            // Manter o processo vivo
            process.on('SIGINT', () => {
                console.log('\n👋 Shutting down server...');
                server.stop();
                process.exit(0);
            });

        } catch (error) {
            console.error('❌ Serve failed:', error);
            process.exit(1);
        }
    });

program
    .command('init')
    .description('Initialize a new Knowledge project')
    .option('-d, --dir <path>', 'Directory to initialize', '.')
    .action(async (options) => {
        try {
            const targetDir = path.resolve(options.dir || '.');
            await initializeProject(targetDir);
            console.log('✅ Knowledge project initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            process.exit(1);
        }
    });

async function loadConfigWithOptions(options: any): Promise<KnowledgeConfig> {
    // Usar a nova função loadConfigAsync que já faz o merge e validação
    let config = await loadConfigAsync(options.config);

    // Sobrescrever com opções da linha de comando
    if (options.input) config.inputDir = options.input;
    if (options.output) config.outputDir = options.output;

    return config;
}

async function initializeProject(targetDir: string): Promise<void> {
    console.log('🚀 Initializing Knowledge project...');

    // Verificar se o diretório já tem arquivos
    const files = await fs.readdir(targetDir).catch(() => []);
    if (files.length > 0) {
        console.log('⚠️  Directory is not empty. Continuing anyway...');
    }

    // Criar estrutura de diretórios
    console.log('📁 Creating directory structure...');
    await fs.ensureDir(path.join(targetDir, 'docs'));

    // Criar arquivo de configuração
    console.log('⚙️  Creating configuration file...');
    const configContent = `export default {
  site: {
    title: 'My Documentation',
    description: 'Beautiful documentation made simple',
    author: 'Your Name',
    baseUrl: '/'
  },
  
  features: {
    search: true,
    syntaxHighlight: true,
    darkMode: true,
    tableOfContents: true,
    breadcrumbs: true
  },
  
  inputDir: './docs',
  outputDir: './dist'
};`;

    await fs.writeFile(path.join(targetDir, 'knowledge.config.ts'), configContent);

    // Criar documentação de exemplo
    console.log('📝 Creating example documentation...');

    // Página inicial
    const indexContent = `# Welcome to My Documentation

This is your documentation homepage. Edit this file to get started!

## Quick Start

1. Edit files in the \`docs/\` directory
2. Run \`knowledge dev\` to start the development server  
3. Run \`knowledge build\` to build for production
4. Run \`knowledge serve\` to serve the built site

## Features

- 🚀 **Fast builds** with Bun.js
- 📝 **Markdown support** with syntax highlighting
- 🎨 **Beautiful default theme**
- 🔍 **Built-in search**
- 📱 **Mobile responsive**
- 🌙 **Dark mode support**
- 🧭 **Automatic navigation**

## Getting Started

Check out the [Installation Guide](./installation.md) to learn more.

Happy documenting! 📚
`;

    await fs.writeFile(path.join(targetDir, 'docs/index.md'), indexContent);

    // Guia de instalação
    const installationContent = `# Installation Guide

Welcome to the installation guide for this project.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Bun.js](https://bun.sh) (latest version)
- Node.js 18+ (for compatibility)

## Installation Steps

### 1. Install Dependencies

\`\`\`bash
bun install -g @riligar/knowledge
\`\`\`

### 2. Start Development Server

\`\`\`bash
knowledge dev
\`\`\`

### 3. Build for Production

\`\`\`bash
knowledge build
\`\`\`

### 4. Serve Built Site

\`\`\`bash
knowledge serve
\`\`\`

## Configuration

Edit the \`knowledge.config.ts\` file to customize your documentation:

\`\`\`typescript
export default {
  site: {
    title: 'My Documentation',
    description: 'Beautiful documentation made simple',
    author: 'Your Name'
  },
  
  features: {
    search: true,
    syntaxHighlight: true,
    darkMode: true
  }
};
\`\`\`

## Next Steps

- [API Reference](./api/README.md)
- [Troubleshooting](./troubleshooting.md)
`;

    await fs.writeFile(path.join(targetDir, 'docs/installation.md'), installationContent);

    // Criar diretório API com exemplo
    await fs.ensureDir(path.join(targetDir, 'docs/api'));
    const apiContent = `# API Reference

This section contains the API documentation.

## Authentication

All API requests require authentication using an API key.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.example.com/v1/users
\`\`\`

## Endpoints

### GET /users

Retrieve a list of users.

**Response:**

\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\`

### POST /users

Create a new user.

**Request:**

\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": 2,
  "name": "Jane Doe", 
  "email": "jane@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
\`\`\`
`;

    await fs.writeFile(path.join(targetDir, 'docs/api/README.md'), apiContent);

    // Troubleshooting
    const troubleshootingContent = `# Troubleshooting

Common issues and their solutions.

## Build Issues

### "Command not found: knowledge"

Make sure Knowledge is installed globally:

\`\`\`bash
bun install -g knowledge
\`\`\`

### "Config file not found"

Ensure you have a \`knowledge.config.ts\` file in your project root:

\`\`\`bash
knowledge init
\`\`\`

## Development Server Issues

### Port already in use

Change the port using the \`-p\` flag:

\`\`\`bash
knowledge dev -p 3001
\`\`\`

### Files not updating

Make sure you're editing files in the correct input directory (usually \`docs/\`).

## Search Issues

### Search not working

Ensure search is enabled in your config:

\`\`\`typescript
export default {
  features: {
    search: true
  }
};
\`\`\`

## Getting Help

If you're still having issues:

1. Check the [GitHub Issues](https://github.com/riligar/knowledge/issues)
2. Create a new issue with details about your problem
3. Join our community discussions
`;

    await fs.writeFile(path.join(targetDir, 'docs/troubleshooting.md'), troubleshootingContent);

    // Criar .gitignore se não existir
    const gitignorePath = path.join(targetDir, '.gitignore');
    if (!await fs.pathExists(gitignorePath)) {
        console.log('📄 Creating .gitignore...');
        const gitignoreContent = `# Knowledge build output
dist/
.knowledge/

# Dependencies
node_modules/
bun.lockb

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
`;
        await fs.writeFile(gitignorePath, gitignoreContent);
    }

    console.log('✅ Knowledge project initialized successfully!');
    console.log('');
    console.log('📋 Next steps:');
    if (targetDir !== '') {
        console.log('  1. cd ' + path.relative(process.cwd(), targetDir));
    }
    console.log('  1. knowledge dev');
    console.log('  2. knowledge build');
    console.log('  4. knowledge serve');
    console.log('');
    console.log('🌐 Your documentation will be available at http://localhost:3000');
}

// Executar CLI se este arquivo for executado diretamente
if (import.meta.main) {
    program.parse();
}