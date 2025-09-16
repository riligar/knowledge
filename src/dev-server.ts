import * as fs from 'fs-extra';
import * as path from 'path';
import chokidar, { type FSWatcher } from 'chokidar';
import type { DocumentationConfig } from './config.js';
import { DocumentationGenerator } from './generator.js';

export class DevServer {
    private generator: DocumentationGenerator;
    private watcher?: FSWatcher;
    private server?: any;

    constructor(private config: DocumentationConfig) {
        this.generator = new DocumentationGenerator(config);
    }

    public async start(): Promise<void> {
        console.log('🚀 Starting Documentation development server...');
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