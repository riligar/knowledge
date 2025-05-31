import * as fs from 'fs-extra';
import * as path from 'path';
import chokidar, { type FSWatcher } from 'chokidar';
import type { KnowledgeConfig } from './config.js';
import { DocumentationGenerator } from './generator.js';

export class DevServer {
    private generator: DocumentationGenerator;
    private watcher?: FSWatcher;
    private server?: any;

    constructor(private config: KnowledgeConfig) {
        this.generator = new DocumentationGenerator(config);
    }

    public async start(): Promise<void> {
        console.log('🚀 Starting Knowledge development server...');
        console.log(`📁 Watching: ${this.config.inputDir}`);
        console.log(`🌐 Server: http://${this.config.dev.host}:${this.config.dev.port}`);

        // Build inicial
        await this.generator.generate();

        // Configurar file watcher
        this.setupWatcher();

        // Iniciar servidor
        await this.startServer();
    }

    private setupWatcher(): void {
        const inputDir = path.resolve(this.config.inputDir);

        this.watcher = chokidar.watch(inputDir, {
            ignored: /(^|[\/\\])\../, // ignorar arquivos ocultos
            persistent: true
        });

        this.watcher
            .on('change', async (filePath: string) => {
                if (filePath.endsWith('.md')) {
                    console.log(`📝 File changed: ${path.relative(process.cwd(), filePath)}`);
                    await this.rebuild();
                }
            })
            .on('add', async (filePath: string) => {
                if (filePath.endsWith('.md')) {
                    console.log(`➕ File added: ${path.relative(process.cwd(), filePath)}`);
                    await this.rebuild();
                }
            })
            .on('unlink', async (filePath: string) => {
                if (filePath.endsWith('.md')) {
                    console.log(`🗑️  File removed: ${path.relative(process.cwd(), filePath)}`);
                    await this.rebuild();
                }
            });
    }

    private async rebuild(): Promise<void> {
        try {
            console.log('🔄 Rebuilding documentation...');
            await this.generator.generate();
            console.log('✅ Rebuild complete');
        } catch (error) {
            console.error('❌ Rebuild failed:', error);
        }
    }

    private async startServer(): Promise<void> {
        const { port, host } = this.config.dev;
        const outputDir = path.resolve(this.config.outputDir);

        console.log(`🌐 Server running at http://${host}:${port}`);
        console.log(`📁 Serving from: ${outputDir}`);
        console.log('👀 Watching for changes...');
        console.log('Press Ctrl+C to stop');

        this.server = Bun.serve({
            port,
            hostname: host,
            async fetch(req) {
                const url = new URL(req.url);
                let filePath = path.join(outputDir, url.pathname);

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
                        const response = new Response(file);

                        // Adicionar headers para desenvolvimento
                        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
                        response.headers.set('Pragma', 'no-cache');
                        response.headers.set('Expires', '0');

                        return response;
                    } else {
                        return new Response('404 Not Found', {
                            status: 404,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    }
                } catch (error) {
                    console.error('Server error:', error);
                    return new Response('500 Internal Server Error', {
                        status: 500,
                        headers: { 'Content-Type': 'text/plain' }
                    });
                }
            }
        });
    }

    public async stop(): Promise<void> {
        if (this.watcher) {
            await this.watcher.close();
        }
        if (this.server) {
            this.server.close();
        }
        console.log('🛑 Development server stopped');
    }
} 