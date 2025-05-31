// Knowledge Modern JavaScript - Flexbox Layout
class Knowledge {
    constructor() {
        this.init();
    }

    init() {
        this.initThemeToggle();
        this.initMobileMenu();
        this.initNavigation();
        this.initSmoothScrolling();
        this.initKeyboardShortcuts();
        this.initContentMenu();
        this.initContentMenuScrollSpy();
        this.initializeTheme();
    }

    // Mobile Menu
    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileClose = document.querySelector('.mobile-menu-close');
        const sidebar = document.querySelector('.main-sidebar');
        const overlay = document.querySelector('.mobile-overlay');

        if (mobileToggle && sidebar && overlay) {
            mobileToggle.addEventListener('click', () => this.openMobileMenu());
            mobileClose?.addEventListener('click', () => this.closeMobileMenu());
            overlay.addEventListener('click', () => this.closeMobileMenu());
        }
    }

    openMobileMenu() {
        const sidebar = document.querySelector('.main-sidebar');
        const overlay = document.querySelector('.mobile-overlay');

        if (sidebar && overlay) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            document.body.classList.add('mobile-menu-open');
        }
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.main-sidebar');
        const overlay = document.querySelector('.mobile-overlay');

        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
        }
    }

    // Navigation
    initNavigation() {
        // Primeiro, configurar pastas colapsáveis
        this.initCollapsibleFolders();

        // Depois marcar item ativo baseado na URL atual
        this.setActiveNavItem();
    }

    initCollapsibleFolders() {
        // Encontrar todos os itens de navegação que têm submenus
        const navItems = document.querySelectorAll('.navigation li');

        navItems.forEach(item => {
            const hasChildren = item.querySelector('ul');
            const folderHeader = item.querySelector('.folder-header');

            if (hasChildren) {
                // Inicialmente colapsar todas as pastas
                item.classList.add('collapsed');

                // Se tem um header de pasta, adicionar evento de clique
                if (folderHeader) {
                    folderHeader.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleFolder(item);
                    });

                    // Adicionar cursor pointer
                    folderHeader.style.cursor = 'pointer';
                }

                // Se não tem header mas tem texto, criar um
                const firstTextNode = this.getFirstTextNode(item);
                if (firstTextNode && !folderHeader) {
                    const span = document.createElement('span');
                    span.className = 'folder-header';
                    span.textContent = firstTextNode.textContent.trim();
                    span.style.cursor = 'pointer';

                    // Substituir o nó de texto pelo span
                    firstTextNode.parentNode.replaceChild(span, firstTextNode);

                    span.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleFolder(item);
                    });
                }
            }
        });
    }

    getFirstTextNode(element) {
        for (let child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
                return child;
            }
        }
        return null;
    }

    toggleFolder(folderItem) {
        const isCollapsed = folderItem.classList.contains('collapsed');
        const subList = folderItem.querySelector('ul');

        if (isCollapsed) {
            // Expandir
            folderItem.classList.remove('collapsed');
            if (subList) {
                subList.style.display = 'block';
                subList.style.maxHeight = '0px';
                subList.style.opacity = '0';

                // Animar expansão
                requestAnimationFrame(() => {
                    subList.style.maxHeight = subList.scrollHeight + 'px';
                    subList.style.opacity = '1';
                });

                // Limpar após animação
                setTimeout(() => {
                    subList.style.maxHeight = '';
                }, 300);
            }
        } else {
            // Colapsar
            folderItem.classList.add('collapsed');
            if (subList) {
                subList.style.maxHeight = subList.scrollHeight + 'px';

                requestAnimationFrame(() => {
                    subList.style.maxHeight = '0px';
                    subList.style.opacity = '0';
                });

                setTimeout(() => {
                    subList.style.display = 'none';
                    subList.style.maxHeight = '';
                    subList.style.opacity = '';
                }, 300);
            }
        }
    }

    setActiveNavItem() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navigation a');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (this.isCurrentPage(href, currentPath)) {
                link.classList.add('active');

                // Expandir pasta pai se necessário
                this.expandParentFolders(link);
            }
        });
    }

    isCurrentPage(href, currentPath) {
        if (!href) return false;

        return href === currentPath ||
            href === currentPath.replace(/\/$/, '') ||
            (currentPath.endsWith('/') && href === 'index.html') ||
            currentPath.includes(href.replace('.html', ''));
    }

    expandParentFolders(link) {
        let parent = link.closest('li');

        while (parent) {
            // Se é uma pasta colapsada, expandir
            if (parent.classList.contains('collapsed')) {
                parent.classList.remove('collapsed');

                const subList = parent.querySelector('ul');
                if (subList) {
                    subList.style.display = 'block';
                    subList.style.maxHeight = '';
                    subList.style.opacity = '';
                }
            }

            // Subir para o próximo nível
            const parentUl = parent.parentElement;
            parent = parentUl ? parentUl.closest('li') : null;
        }
    }

    // Smooth Scrolling
    initSmoothScrolling() {
        // Interceptar cliques em links âncora
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            }
        });
    }

    smoothScrollTo(element) {
        const mainContent = document.querySelector('.main-content');
        const contentWrapper = document.querySelector('.content-wrapper');

        // Sempre tentar scroll no main-content primeiro se ele existir
        if (mainContent && contentWrapper) {
            // Calcular offsetTop do elemento relativo ao content-wrapper
            let elementTop = 0;
            let currentElement = element;

            // Somar offsetTop até chegar ao content-wrapper
            while (currentElement && currentElement !== contentWrapper) {
                elementTop += currentElement.offsetTop;
                currentElement = currentElement.offsetParent;
                if (currentElement === contentWrapper) break;
            }

            // Ajustar offset para posição confortável (80px do topo)
            const targetPosition = elementTop - 80;

            mainContent.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });

        } else {
            // Fallback para scroll tradicional na window
            const headerHeight = document.querySelector('.header')?.offsetHeight || 64;
            const targetPosition = element.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Keyboard Shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Esc para fechar menus
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    // Content Menu - Atualizado para nova estrutura
    initContentMenu() {
        const menuDropdown = document.querySelector('.content-menu-dropdown');
        const contentArea = document.querySelector('.main-content article');

        if (menuDropdown && contentArea) {
            // Clear any existing content
            menuDropdown.innerHTML = '';

            // Find only H2 headings in the article
            const headings = contentArea.querySelectorAll('h2');

            if (headings.length === 0) {
                // Hide menu if no headings found
                const articleSidebar = document.querySelector('.article-sidebar');
                if (articleSidebar) {
                    articleSidebar.style.display = 'none';
                }
                return;
            }

            // Show menu
            const articleSidebar = document.querySelector('.article-sidebar');
            if (articleSidebar) {
                articleSidebar.style.display = 'block';
            }

            // Generate menu items from headings
            headings.forEach((heading, index) => {
                const text = heading.textContent.trim();

                // Generate ID if heading doesn't have one
                if (!heading.id) {
                    const cleanText = text.toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-')
                        .substring(0, 50);
                    heading.id = cleanText || `heading-${index}`;
                }

                // Create menu item
                const menuItem = document.createElement('a');
                menuItem.href = `#${heading.id}`;
                menuItem.className = 'content-menu-item';
                menuItem.textContent = text;

                // Set first item as active
                if (index === 0) {
                    menuItem.classList.add('active');
                }

                menuDropdown.appendChild(menuItem);
            });

            // Add click handlers for menu items
            menuDropdown.querySelectorAll('.content-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = item.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        this.smoothScrollTo(targetElement);

                        // Update active state
                        menuDropdown.querySelectorAll('.content-menu-item').forEach(menuItem => {
                            menuItem.classList.remove('active');
                        });
                        item.classList.add('active');
                    }
                });
            });
        }
    }

    initContentMenuScrollSpy() {
        const menuItems = document.querySelectorAll('.content-menu-item');
        const mainContent = document.querySelector('.main-content');

        if (menuItems.length === 0 || !mainContent) return;

        // Set up intersection observer for scroll spy
        // Usar o main-content como root para observar corretamente no container com scroll
        const observerOptions = {
            root: mainContent, // Observar dentro do main-content, não da window
            rootMargin: '-100px 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const activeMenuItem = document.querySelector(`.content-menu-item[href="#${id}"]`);

                    if (activeMenuItem) {
                        // Update active state
                        menuItems.forEach(item => item.classList.remove('active'));
                        activeMenuItem.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        // Observe only H2 headings that have corresponding menu items
        const articleElement = document.querySelector('.main-content article');
        if (articleElement) {
            const headingsToObserve = articleElement.querySelectorAll('h2');
            headingsToObserve.forEach(heading => {
                if (heading.id) {
                    const hasMenuItem = document.querySelector(`.content-menu-item[href="#${heading.id}"]`);
                    if (hasMenuItem) {
                        observer.observe(heading);
                    }
                }
            });
        }
    }

    initThemeToggle() {
        // Carregar tema salvo ou usar padrão
        this.loadSavedTheme();

        // Configurar botão de alternância
        const themeToggle = document.querySelector('.theme-toggle-header');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Escutar mudanças de preferência do sistema
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Só aplicar se não há preferência salva
                if (!localStorage.getItem('knowledge-theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    loadSavedTheme() {
        // Verificar tema salvo no localStorage
        const savedTheme = localStorage.getItem('knowledge-theme');

        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            // Usar preferência do sistema se disponível
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.setTheme('dark');
            } else {
                this.setTheme('light');
            }
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        this.setTheme(newTheme);

        // Salvar preferência
        localStorage.setItem('knowledge-theme', newTheme);

        // Feedback visual
        this.showThemeChangeNotification(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('knowledge-theme', theme);

        // Update toggle button
        const toggleBtn = document.querySelector('.theme-toggle-header');
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
            toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        }

        // Atualizar meta theme-color para mobile
        this.updateThemeColor(theme);

        // Disparar evento customizado para outros componentes
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    updateThemeColor(theme) {
        // Atualizar meta theme-color para navegadores mobile
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');

        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        // Cores baseadas no CSS
        const colors = {
            light: '#ffffff',
            dark: '#050509'
        };

        metaThemeColor.content = colors[theme] || colors.light;
    }

    showThemeChangeNotification(theme) {
        // Criar notificação temporária
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <div class="theme-notification-content">
                ${theme === 'dark' ? '🌙' : '☀️'} Tema ${theme === 'dark' ? 'escuro' : 'claro'} ativado
            </div>
        `;

        // Adicionar estilos inline para a notificação
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
        `;

        document.body.appendChild(notification);

        // Animar entrada
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Remover após 2 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    initializeTheme() {
        // Set default theme if none is saved
        if (!localStorage.getItem('knowledge-theme')) {
            this.setTheme('light');
        } else {
            // Apply saved theme
            const savedTheme = localStorage.getItem('knowledge-theme');
            if (savedTheme) {
                this.setTheme(savedTheme);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Knowledge();
});

// Add dynamic styles
const style = document.createElement('style');
style.textContent = `
    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
        z-index: 1000;
        transition: var(--transition);
    }

    .skip-link:focus {
        top: 0;
    }

    .code-language {
        position: absolute;
        top: 0.5rem;
        left: 1rem;
        background: var(--primary-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .external-link-icon {
        font-size: 0.8em;
        opacity: 0.7;
        margin-left: 0.25rem;
    }

    .navigation li.expanded > ul {
        display: block;
    }

    /* Navigation Animations */
    .nav-item-animate {
        opacity: 0;
        transform: translateX(-10px);
        animation: slideInNav 0.3s ease forwards;
    }

    @keyframes slideInNav {
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Search Enhancements */
    .search-container.search-focused {
        transform: scale(1.02);
    }

    .search-container.search-focused::before {
        color: var(--primary-color) !important;
        transform: scale(1.1);
    }

    /* Copy button hover effect */
    .copy-button:hover {
        background: var(--bg-secondary) !important;
        color: var(--text-primary) !important;
    }

    /* Keyboard navigation focus styles */
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
    }
`;

document.head.appendChild(style); 