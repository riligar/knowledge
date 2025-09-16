#!/usr/bin/env bun
import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import chokidar from 'chokidar';
import { defaultConfig, loadConfig, loadConfigAsync, type DocumentationConfig } from './config.ts';
import { DocumentationGenerator } from './generator.ts';
import { DevServer } from './dev-server.ts';
import openBrowser from './open-browser.ts';
import { getAvailablePort } from './port-utils.ts';

// Importar versão do package.json
const packageJson = JSON.parse(await fs.readFile(path.join(import.meta.dir, '../package.json'), 'utf-8'));

const program = new Command();

// Configurar mensagens de erro personalizadas em português
program.configureOutput({
    writeErr: (str) => {
        // Interceptar erros comuns e mostrar mensagens em português
        if (str.includes('too many arguments')) {
            console.error('❌ Revise o comando, seu parâmetro está errado.');
            console.error('💡 Dica: Use --dir para especificar o diretório. Exemplo: documentation init --dir meu-projeto');
            return;
        }
        if (str.includes('unknown command')) {
            console.error('❌ Revise o comando, seu parâmetro está errado.');
            console.error('💡 Comandos disponíveis: init, dev, build, serve');
            return;
        }
        if (str.includes('unknown option')) {
            console.error('❌ Revise o comando, seu parâmetro está errado.');
            console.error('💡 Use --help para ver as opções disponíveis');
            return;
        }
        if (str.includes('required option')) {
            console.error('❌ Revise o comando, seu parâmetro está errado.');
            console.error('💡 Parâmetro obrigatório não foi fornecido');
            return;
        }
        // Para outros erros, mostrar a mensagem original
        process.stderr.write(str);
    }
});

// Interceptar erros de argumentos inválidos
program.exitOverride((err) => {
    if (err.code === 'commander.unknownCommand') {
        console.error('❌ Revise o comando, seu parâmetro está errado.');
        console.error('💡 Comandos disponíveis: init, dev, build, serve');
        console.error('💡 Use "documentation --help" para mais informações');
        process.exit(1);
    }
    if (err.code === 'commander.unknownOption') {
        console.error('❌ Revise o comando, seu parâmetro está errado.');
        console.error('💡 Use "documentation <comando> --help" para ver as opções disponíveis');
        process.exit(1);
    }
    if (err.code === 'commander.excessArguments') {
        console.error('❌ Revise o comando, seu parâmetro está errado.');
        console.error('💡 Muitos argumentos fornecidos para este comando');
        process.exit(1);
    }
    if (err.code === 'commander.missingArgument') {
        console.error('❌ Revise o comando, seu parâmetro está errado.');
        console.error('💡 Argumento obrigatório não foi fornecido');
        process.exit(1);
    }
    // Para outros erros, usar comportamento padrão
    process.exit(err.exitCode || 1);
});

program
    .name('documentation')
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
        } catch (error: any) {
            // Se for um erro conhecido (como diretório não encontrado), exibir apenas a mensagem
            if (error.message && error.message.startsWith('❌')) {
                console.error(error.message);
            } else {
                console.error('❌ Build failed:', error);
            }
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
                console.error(`❌ Directory ${dir} does not exist. Run 'documentation build' first.`);
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
    .description('Initialize a new Documentation project')
    .option('-d, --dir <path>', 'Directory to initialize', '.')
    .action(async (options) => {
        try {
            const targetDir = path.resolve(options.dir || '.');
            await initializeProject(targetDir);
            console.log('✅ Documentation project initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            process.exit(1);
        }
    });

async function loadConfigWithOptions(options: any): Promise<DocumentationConfig> {
    // Usar a nova função loadConfigAsync que já faz o merge e validação
    let config = await loadConfigAsync(options.config);

    // Sobrescrever com opções da linha de comando
    if (options.input) config.inputDir = options.input;
    if (options.output) config.outputDir = options.output;

    return config;
}

async function initializeProject(targetDir: string): Promise<void> {
    console.log('🚀 Initializing Documentation project...');

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

    await fs.writeFile(path.join(targetDir, 'documentation.config.ts'), configContent);

    // Criar documentação de exemplo
    console.log('📝 Creating example documentation...');

    // Página inicial
    const indexContent = `# Welcome to My Documentation

This is your documentation homepage. Edit this file to get started!

## Quick Start

1. Edit files in the \`docs/\` directory
2. Run \`documentation dev\` to start the development server  
3. Run \`documentation build\` to build for production
4. Run \`documentation serve\` to serve the built site

## Features

- 🚀 **Fast builds** with Bun
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

Welcome to the installation guide for Documentation.

## Prerequisites

Before you begin, make sure you have one of the following package managers installed:

- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Bun](https://bun.sh) (recommended for faster performance)
- [Yarn](https://yarnpkg.com/)
- [pnpm](https://pnpm.io/)

## Installation

### Global Installation (Recommended)

Install Documentation globally to use it from anywhere:

\`\`\`bash
# With npm
npm install -g @riligar/documentation

# With bun (recommended)
bun add -g @riligar/documentation

# With yarn
yarn global add @riligar/documentation

# With pnpm
pnpm add -g @riligar/documentation
\`\`\`

### Local Installation

For project-specific installation:

\`\`\`bash
# With npm
npm install @riligar/documentation

# With bun
bun add @riligar/documentation

# With yarn
yarn add @riligar/documentation

# With pnpm
pnpm add @riligar/documentation
\`\`\`

## Quick Start

### 1. Initialize a New Project

\`\`\`bash
# Create a new directory and initialize
mkdir my-docs
cd my-docs
documentation init
\`\`\`

Or initialize in an existing directory:

\`\`\`bash
documentation init .
\`\`\`

### 2. Start Development Server

\`\`\`bash
documentation dev
\`\`\`

Your documentation will be available at \`http://localhost:3000\`

### 3. Build for Production

\`\`\`bash
documentation build
\`\`\`

### 4. Serve Built Documentation

\`\`\`bash
documentation serve
\`\`\`

## Available Commands

| Command | Description | Options |
|---------|-------------|---------|
| \`documentation init [dir]\` | Initialize a new project | \`-d, --dir <path>\` |
| \`documentation dev\` | Start development server | \`-p, --port <number>\`, \`-h, --host <string>\` |
| \`documentation build\` | Build for production | \`-c, --config <path>\`, \`-i, --input <path>\`, \`-o, --output <path>\` |
| \`documentation serve\` | Serve built documentation | \`-p, --port <number>\`, \`-d, --dir <path>\`, \`--no-open\` |

## Configuration

Documentation uses a \`documentation.config.ts\` file for configuration:

\`\`\`typescript
export default {
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
};
\`\`\`

## Project Structure

After initialization, your project will have this structure:

\`\`\`
my-docs/
├── docs/                    # Your markdown files
│   ├── index.md            # Homepage
│   ├── installation.md     # This guide
│   ├── troubleshooting.md  # Common issues
│   └── api/                # API documentation
│       └── README.md
├── documentation.config.ts     # Configuration file
├── .gitignore             # Git ignore rules
└── dist/                  # Built site (after build)
\`\`\`

## Next Steps

- [API Reference](./api/README.md) - Learn about available APIs
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions
- [GitHub Repository](https://github.com/riligar/documentation) - Source code and issues
- [Documentation Site](https://mydocumentation.click) - Full documentation
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

## Installation Issues

### "Command not found: documentation"

**Problem:** The \`documentation\` command is not recognized.

**Solutions:**

1. **Global installation missing:**
   \`\`\`bash
   npm install -g @riligar/documentation
   # or
   bun add -g @riligar/documentation
   \`\`\`

2. **PATH not updated:** Restart your terminal or run:
   \`\`\`bash
   source ~/.bashrc
   # or
   source ~/.zshrc
   \`\`\`

3. **Permission issues (macOS/Linux):**
   \`\`\`bash
   sudo npm install -g @riligar/documentation
   \`\`\`

### "Cannot find module '@riligar/documentation'"

**Problem:** Package not found or corrupted installation.

**Solution:**
\`\`\`bash
# Uninstall and reinstall
npm uninstall -g @riligar/documentation
npm install -g @riligar/documentation
\`\`\`

## Project Setup Issues

### "Config file not found"

**Problem:** Missing \`documentation.config.ts\` file.

**Solution:**
\`\`\`bash
# Initialize project to create config
documentation init

# Or create manually
touch documentation.config.ts
\`\`\`

### "Input directory does not exist"

**Problem:** The \`docs/\` directory is missing.

**Solution:**
\`\`\`bash
# Create docs directory
mkdir docs
echo "# Welcome" > docs/index.md
\`\`\`

## Development Server Issues

### "Port already in use"

**Problem:** Default port 3000 is occupied.

**Solutions:**

1. **Use different port:**
   \`\`\`bash
   documentation dev -p 3001
   \`\`\`

2. **Kill process using port:**
   \`\`\`bash
   # Find process
   lsof -i :3000
   
   # Kill process (replace PID)
   kill -9 <PID>
   \`\`\`

### "Files not updating in browser"

**Problem:** Changes not reflected during development.

**Solutions:**

1. **Hard refresh:** Press \`Ctrl+F5\` or \`Cmd+Shift+R\`
2. **Check file location:** Ensure files are in the correct \`inputDir\`
3. **Restart dev server:** Stop with \`Ctrl+C\` and run \`documentation dev\` again

### "EACCES permission denied"

**Problem:** Permission issues on macOS/Linux.

**Solutions:**

1. **Use sudo (not recommended):**
   \`\`\`bash
   sudo documentation dev
   \`\`\`

2. **Fix npm permissions (recommended):**
   \`\`\`bash
   # Create global directory
   mkdir ~/.npm-global
   
   # Configure npm
   npm config set prefix '~/.npm-global'
   
   # Add to PATH in ~/.bashrc or ~/.zshrc
   export PATH=~/.npm-global/bin:$PATH
   \`\`\`

## Build Issues

### "Build failed: Cannot read config"

**Problem:** Invalid configuration file.

**Solution:**
\`\`\`bash
# Check config syntax
node -c documentation.config.ts

# Or recreate config
documentation init --force
\`\`\`

### "Out of memory" during build

**Problem:** Large documentation causing memory issues.

**Solutions:**

1. **Increase Node.js memory:**
   \`\`\`bash
   NODE_OPTIONS="--max-old-space-size=4096" documentation build
   \`\`\`

2. **Split large files** into smaller sections
3. **Remove unused assets** from docs directory

## Search Issues

### "Search not working"

**Problem:** Search functionality not available.

**Solutions:**

1. **Enable search in config:**
   \`\`\`typescript
   export default {
     features: {
       search: true
     }
   };
   \`\`\`

2. **Rebuild site:**
   \`\`\`bash
   documentation build
   \`\`\`

### "Search results incomplete"

**Problem:** Some content not appearing in search.

**Solutions:**

1. **Check file format:** Ensure files are valid Markdown
2. **Rebuild search index:**
   \`\`\`bash
   rm -rf dist/
   documentation build
   \`\`\`

## Performance Issues

### "Slow build times"

**Solutions:**

1. **Use Bun instead of Node:**
   \`\`\`bash
   bun add -g @riligar/documentation
   \`\`\`

2. **Optimize images:** Compress large images in docs
3. **Remove unused files** from input directory

### "Large bundle size"

**Solutions:**

1. **Disable unused features:**
   \`\`\`typescript
   export default {
     features: {
       search: false,        // If not needed
       syntaxHighlight: false // If not needed
     }
   };
   \`\`\`

2. **Optimize assets:** Use smaller images and remove unused files

## Browser Issues

### "Styles not loading"

**Problem:** CSS not applied correctly.

**Solutions:**

1. **Clear browser cache:** Hard refresh with \`Ctrl+F5\`
2. **Check baseUrl in config:**
   \`\`\`typescript
   export default {
     site: {
       baseUrl: '/' // Ensure correct base URL
     }
   };
   \`\`\`

### "JavaScript errors in console"

**Problem:** Client-side functionality not working.

**Solutions:**

1. **Check browser compatibility:** Use modern browser
2. **Disable browser extensions** temporarily
3. **Check console for specific errors**

## Getting Help

If you're still having issues:

1. **Check existing issues:** [GitHub Issues](https://github.com/riligar/documentation/issues)
2. **Create detailed bug report** with:
   - Operating system and version
   - Node.js/Bun version
   - Documentation version (\`documentation --version\`)
   - Full error message
   - Steps to reproduce
3. **Join community discussions** on GitHub
4. **Check documentation:** [mydocumentation.click](https://mydocumentation.click)

## Version Information

Check your versions:

\`\`\`bash
# Documentation version
documentation --version

# Node.js version
node --version

# npm version
npm --version

# Bun version (if using)
bun --version
\`\`\`

## Common Environment Setup

### Recommended Setup

\`\`\`bash
# 1. Install Bun (recommended)
curl -fsSL https://bun.sh/install | bash

# 2. Install Documentation globally
bun add -g @riligar/documentation

# 3. Verify installation
documentation --version
\`\`\`

### Alternative Setup (Node.js)

\`\`\`bash
# 1. Ensure Node.js 18+ is installed
node --version

# 2. Install Documentation globally
npm install -g @riligar/documentation

# 3. Verify installation
documentation --version
\`\`\`
`;

    await fs.writeFile(path.join(targetDir, 'docs/troubleshooting.md'), troubleshootingContent);

    // Criar .gitignore se não existir
    const gitignorePath = path.join(targetDir, '.gitignore');
    if (!await fs.pathExists(gitignorePath)) {
        console.log('📄 Creating .gitignore...');
        const gitignoreContent = `# Documentation build output
dist/
.documentation/

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

    console.log('✅ Documentation project initialized successfully!');
    console.log('');
    console.log('📋 Next steps:');
    if (targetDir !== process.cwd()) {
        console.log(`  1. cd ${path.relative(process.cwd(), targetDir)}`);
        console.log('  2. documentation dev');
        console.log('  3. documentation build');
        console.log('  4. documentation serve');
    } else {
        console.log('  1. documentation dev');
        console.log('  2. documentation build');
        console.log('  3. documentation serve');
    }
    console.log('');
    console.log('🌐 Your documentation will be available at http://localhost:3000');
    console.log('📚 Visit https://mydocumentation.click for full documentation');
    console.log('🐛 Report issues at https://github.com/riligar/documentation/issues');
}

// Executar CLI se este arquivo for executado diretamente
if (import.meta.main) {
    try {
        program.parse();
    } catch (error: any) {
        // Capturar erros não tratados e mostrar mensagem em português
        if (error.message?.includes('too many arguments') ||
            error.message?.includes('excess arguments') ||
            error.message?.includes('unknown command') ||
            error.message?.includes('unknown option')) {
            console.error('❌ Revise o comando, seu parâmetro está errado.');
            console.error('💡 Use "documentation --help" para ver os comandos disponíveis');
        } else {
            console.error('❌ Erro inesperado:', error.message);
        }
        process.exit(1);
    }
}