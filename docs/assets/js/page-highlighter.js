/**
 * Sistema de Destaque de Termos na Página
 * Destaca automaticamente termos de busca quando vindo dos resultados de busca
 */
class PageHighlighter {
    constructor() {
        this.highlightedElements = [];
        this.currentHighlights = [];
        this.searchTerms = [];
        this.isHighlighting = false;

        this.init();
    }

    init() {
        // Verificar se há termos para destacar na URL
        const urlParams = new URLSearchParams(window.location.search);
        const highlightParam = urlParams.get('highlight');

        if (highlightParam) {
            this.searchTerms = this.parseSearchTerms(highlightParam);

            // Aguardar o DOM estar completamente carregado
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.highlightTermsOnPage();
                    this.setupControls();
                });
            } else {
                this.highlightTermsOnPage();
                this.setupControls();
            }
        }
    }

    parseSearchTerms(query) {
        // Dividir a query em termos individuais
        return query.toLowerCase()
            .split(/\s+/)
            .filter(term => term.length > 1)
            .map(term => term.trim());
    }

    highlightTermsOnPage() {
        if (this.searchTerms.length === 0) return;

        this.isHighlighting = true;

        // Encontrar o container principal do conteúdo
        const contentContainer = this.findContentContainer();

        if (contentContainer) {
            this.highlightInElement(contentContainer);
            this.showHighlightControls();
            this.scrollToFirstHighlight();
        }

        this.isHighlighting = false;
    }

    findContentContainer() {
        // Tentar encontrar o container principal do conteúdo
        const selectors = [
            '.content',
            '.main-content',
            '.article-content',
            '.page-content',
            'main',
            'article',
            '.container .row .col',
            'body'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
        }

        return document.body;
    }

    highlightInElement(element) {
        // Percorrer todos os nós de texto
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Pular scripts, styles e elementos já destacados
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;

                    const tagName = parent.tagName.toLowerCase();
                    if (['script', 'style', 'mark', 'code', 'pre'].includes(tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    // Pular se já foi processado
                    if (parent.classList.contains('page-highlight-processed')) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Processar cada nó de texto
        textNodes.forEach(textNode => {
            this.highlightTextNode(textNode);
        });
    }

    highlightTextNode(textNode) {
        const text = textNode.textContent;
        const parent = textNode.parentElement;

        if (!text || !parent) return;

        let highlightedHTML = text;
        let hasHighlights = false;

        // Aplicar destaque para cada termo
        this.searchTerms.forEach((term, index) => {
            const regex = new RegExp(`\\b${this.escapeRegex(term)}\\w*\\b`, 'gi');
            const matches = text.match(regex);

            if (matches) {
                hasHighlights = true;
                matches.forEach(match => {
                    const highlightClass = `page-highlight page-highlight-${index % 5}`;
                    const replacement = `<mark class="${highlightClass}" data-term="${term}">${match}</mark>`;
                    highlightedHTML = highlightedHTML.replace(
                        new RegExp(`\\b${this.escapeRegex(match)}\\b`, 'gi'),
                        replacement
                    );
                });
            }
        });

        // Se encontrou highlights, substituir o conteúdo
        if (hasHighlights) {
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedHTML;
            wrapper.classList.add('page-highlight-processed');

            parent.replaceChild(wrapper, textNode);

            // Registrar highlights para navegação
            const highlights = wrapper.querySelectorAll('.page-highlight');
            highlights.forEach(highlight => {
                this.currentHighlights.push(highlight);
            });
        }
    }

    setupControls() {
        if (this.currentHighlights.length === 0) return;

        // Criar controles de navegação
        this.createHighlightControls();

        // Configurar atalhos de teclado
        this.setupKeyboardShortcuts();
    }

    createHighlightControls() {
        // Remover controles existentes
        const existingControls = document.querySelector('.page-highlight-controls');
        if (existingControls) {
            existingControls.remove();
        }

        const controls = document.createElement('div');
        controls.className = 'page-highlight-controls';
        controls.innerHTML = `
            <div class="highlight-info">
                <span class="highlight-count">${this.currentHighlights.length} destaque${this.currentHighlights.length !== 1 ? 's' : ''}</span>
                <span class="highlight-terms">para: ${this.searchTerms.join(', ')}</span>
            </div>
            <div class="highlight-navigation">
                <button class="highlight-prev" title="Anterior (Shift+F3)">↑</button>
                <span class="highlight-position">1 / ${this.currentHighlights.length}</span>
                <button class="highlight-next" title="Próximo (F3)">↓</button>
                <button class="highlight-close" title="Fechar destaques (Esc)">×</button>
            </div>
        `;

        document.body.appendChild(controls);

        // Configurar eventos dos botões
        this.currentHighlightIndex = 0;
        this.updateHighlightPosition();

        controls.querySelector('.highlight-prev').addEventListener('click', () => {
            this.navigateHighlight(-1);
        });

        controls.querySelector('.highlight-next').addEventListener('click', () => {
            this.navigateHighlight(1);
        });

        controls.querySelector('.highlight-close').addEventListener('click', () => {
            this.clearHighlights();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (this.currentHighlights.length === 0) return;

            switch (e.key) {
                case 'F3':
                    e.preventDefault();
                    this.navigateHighlight(e.shiftKey ? -1 : 1);
                    break;
                case 'Escape':
                    this.clearHighlights();
                    break;
            }
        });
    }

    navigateHighlight(direction) {
        if (this.currentHighlights.length === 0) return;

        this.currentHighlightIndex += direction;

        if (this.currentHighlightIndex >= this.currentHighlights.length) {
            this.currentHighlightIndex = 0;
        } else if (this.currentHighlightIndex < 0) {
            this.currentHighlightIndex = this.currentHighlights.length - 1;
        }

        this.scrollToHighlight(this.currentHighlightIndex);
        this.updateHighlightPosition();
    }

    scrollToHighlight(index) {
        const highlight = this.currentHighlights[index];
        if (!highlight) return;

        // Remover classe ativa de todos os highlights
        this.currentHighlights.forEach(h => h.classList.remove('active'));

        // Adicionar classe ativa ao highlight atual
        highlight.classList.add('active');

        // Scroll suave para o highlight
        highlight.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
    }

    scrollToFirstHighlight() {
        if (this.currentHighlights.length > 0) {
            this.currentHighlightIndex = 0;
            this.scrollToHighlight(0);
        }
    }

    updateHighlightPosition() {
        const positionElement = document.querySelector('.highlight-position');
        if (positionElement) {
            positionElement.textContent = `${this.currentHighlightIndex + 1} / ${this.currentHighlights.length}`;
        }
    }

    clearHighlights() {
        // Remover todos os highlights
        document.querySelectorAll('.page-highlight').forEach(highlight => {
            const parent = highlight.parentElement;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });

        // Remover controles
        const controls = document.querySelector('.page-highlight-controls');
        if (controls) {
            controls.remove();
        }

        // Limpar arrays
        this.currentHighlights = [];
        this.highlightedElements = [];

        // Remover parâmetro da URL
        const url = new URL(window.location);
        url.searchParams.delete('highlight');
        window.history.replaceState({}, '', url);
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    normalizeAccents(text) {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pageHighlighter = new PageHighlighter();
    });
} else {
    window.pageHighlighter = new PageHighlighter();
} 