/**
 * ZIP Download Manager
 * Handles downloading all markdown files as a ZIP archive
 */
class ZipDownloadManager {
    constructor() {
        this.isLoading = false;
        this.markdownFiles = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.discoverMarkdownFiles();
    }

    bindEvents() {
        const downloadBtn = document.querySelector('.download-zip-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.handleDownload());
        }
    }

    /**
     * Discover all markdown files from the navigation
     */
    discoverMarkdownFiles() {
        const navLinks = document.querySelectorAll('.navigation a');
        this.markdownFiles = [];
        const baseUrl = this.getBaseUrl();

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();

            if (href && text && !href.startsWith('#') && !href.startsWith('http')) {
                // Convert HTML URL to markdown URL
                let markdownUrl = href;

                // Remove baseUrl if present
                if (baseUrl && markdownUrl.startsWith(baseUrl)) {
                    markdownUrl = markdownUrl.substring(baseUrl.length);
                }

                // Convert .html to .md
                if (markdownUrl.endsWith('.html')) {
                    markdownUrl = markdownUrl.replace('.html', '.md');
                } else if (!markdownUrl.endsWith('.md')) {
                    // If it's a directory link, try to find index.md
                    markdownUrl = markdownUrl.replace(/\/$/, '') + '/index.md';
                }

                // Ensure we have a proper path
                const finalPath = this.getMarkdownPath(markdownUrl);
                const finalUrl = this.buildMarkdownUrl(markdownUrl);

                this.markdownFiles.push({
                    name: text,
                    url: finalUrl,
                    path: finalPath
                });
            }
        });

        // Add main index.md if not already included
        const hasMainIndex = this.markdownFiles.some(file =>
            file.path === 'index.md' || file.path === './index.md'
        );
        if (!hasMainIndex) {
            this.markdownFiles.unshift({
                name: 'Início',
                url: this.buildMarkdownUrl('index.md'),
                path: 'index.md'
            });
        }

        // Remove duplicates based on path
        this.markdownFiles = this.markdownFiles.filter((file, index, self) =>
            index === self.findIndex(f => f.path === file.path)
        );
    }

    /**
     * Get base URL from current page
     */
    getBaseUrl() {
        const baseElement = document.querySelector('base');
        if (baseElement) {
            return baseElement.href;
        }

        // Try to extract from current location
        const currentPath = window.location.pathname;
        const segments = currentPath.split('/');

        // If we're in a subdirectory, try to determine base
        if (segments.length > 2) {
            return segments.slice(0, -1).join('/') + '/';
        }

        return '/';
    }

    /**
     * Build proper markdown URL
     */
    buildMarkdownUrl(markdownPath) {
        // Remove leading slash
        const cleanPath = markdownPath.replace(/^\/+/, '');

        // Get current directory
        const currentDir = window.location.pathname.split('/').slice(0, -1).join('/');

        // Build absolute URL
        if (currentDir && currentDir !== '/') {
            return `${currentDir}/${cleanPath}`;
        }

        return cleanPath;
    }

    /**
     * Convert URL to markdown file path
     */
    getMarkdownPath(url) {
        // Remove leading slash and baseUrl if present
        let path = url.replace(/^\/+/, '');

        // Preserve directory structure
        return path;
    }

    /**
     * Handle download button click
     */
    async handleDownload() {
        if (this.isLoading) return;

        const downloadBtn = document.querySelector('.download-zip-btn');

        try {
            this.setLoadingState(true);

            // Generate filename with current date and time
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 19).replace(/[T:]/g, '-');
            const filename = `knowledge-docs-${dateStr}.zip`;

            // Create ZIP file
            const zipBlob = await this.createZipFile();

            // Download the file
            this.downloadBlob(zipBlob, filename);

            // Show success notification
            this.showNotification('✅ Download concluído com sucesso!', 'success');

        } catch (error) {
            console.error('Error creating ZIP file:', error);
            this.showNotification('❌ Erro ao criar arquivo ZIP', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Create ZIP file with all markdown content
     */
    async createZipFile() {
        // Import JSZip dynamically
        const JSZip = await this.loadJSZip();
        const zip = new JSZip();

        // Add README with information
        const readmeContent = this.generateReadmeContent();
        zip.file('README.md', readmeContent);

        // Fetch and add all markdown files
        const fetchPromises = this.markdownFiles.map(async (file) => {
            try {
                const response = await fetch(file.url);
                if (response.ok) {
                    const content = await response.text();
                    zip.file(file.path, content);
                    return { success: true, file: file.path };
                } else {
                    console.warn(`Failed to fetch ${file.url}:`, response.status);
                    return { success: false, file: file.path, error: response.status };
                }
            } catch (error) {
                console.warn(`Error fetching ${file.url}:`, error);
                return { success: false, file: file.path, error: error.message };
            }
        });

        const results = await Promise.all(fetchPromises);
        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;

        console.log(`Successfully added ${successCount}/${totalCount} markdown files to ZIP`);

        // Generate ZIP blob
        return await zip.generateAsync({ type: 'blob' });
    }

    /**
     * Generate README content for the ZIP file
     */
    generateReadmeContent() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR');

        return `# Knowledge - Documentação Completa

Este arquivo ZIP contém toda a documentação do Knowledge em formato Markdown.

## Informações do Download

- **Data do Download:** ${dateStr}
- **Hora do Download:** ${timeStr}
- **Total de Arquivos:** ${this.markdownFiles.length}

## Estrutura dos Arquivos

${this.markdownFiles.map(file => `- \`${file.path}\` - ${file.name}`).join('\n')}

## Como Usar

Estes arquivos Markdown podem ser:
- Visualizados em qualquer editor de texto
- Renderizados em plataformas como GitHub, GitLab, etc.
- Convertidos para outros formatos (HTML, PDF, etc.)
- Importados em outras ferramentas de documentação

## Sobre o Knowledge

Knowledge é uma plataforma moderna e open-source para documentação que transforma como equipes criam, organizam e compartilham conhecimento.

Para mais informações, visite: https://github.com/riligar/knowledge
`;
    }

    /**
     * Load JSZip library dynamically
     */
    async loadJSZip() {
        if (window.JSZip) {
            return window.JSZip;
        }

        // Load JSZip from CDN
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => {
                if (window.JSZip) {
                    resolve(window.JSZip);
                } else {
                    reject(new Error('JSZip failed to load'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load JSZip'));
            document.head.appendChild(script);
        });
    }

    /**
     * Download blob as file
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    /**
     * Set loading state for download button
     */
    setLoadingState(loading) {
        this.isLoading = loading;
        const downloadBtn = document.querySelector('.download-zip-btn');

        if (downloadBtn) {
            if (loading) {
                downloadBtn.classList.add('loading');
                downloadBtn.setAttribute('aria-label', 'Preparando download...');
                downloadBtn.setAttribute('title', 'Preparando download...');
            } else {
                downloadBtn.classList.remove('loading');
                downloadBtn.setAttribute('aria-label', 'Download documentação completa');
                downloadBtn.setAttribute('title', 'Download ZIP com toda a documentação');
            }
        }
    }

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `zip-download-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--bg-primary);
            border: 1px solid var(--border-medium);
            border-radius: 8px;
            padding: 12px 16px;
            box-shadow: var(--shadow-md);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            font-size: 14px;
            color: var(--text-primary);
            max-width: 300px;
        `;

        // Add type-specific styles
        if (type === 'success') {
            notification.style.borderColor = 'var(--primary-color)';
            notification.style.background = 'var(--primary-light)';
        } else if (type === 'error') {
            notification.style.borderColor = '#ef4444';
            notification.style.background = 'rgba(239, 68, 68, 0.1)';
        }

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, type === 'error' ? 4000 : 3000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ZipDownloadManager();
    });
} else {
    new ZipDownloadManager();
} 