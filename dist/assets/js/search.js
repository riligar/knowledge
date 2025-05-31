/**
 * Sistema de Busca Full-Text usando Lunr.js
 * Implementa busca avançada em toda a documentação
 */
class DocumentationSearch {
    constructor() {
        this.searchIndex = null;
        this.documents = [];
        this.isIndexLoaded = false;
        this.searchInput = null;
        this.searchResults = null;
        this.searchOverlay = null;
        this.currentQuery = '';
        this.selectedResultIndex = -1;

        // Lista de stopwords em português para filtrar termos muito comuns
        this.stopwords = new Set([
            'a', 'à', 'ao', 'aos', 'as', 'às',
            'da', 'das', 'de', 'do', 'dos',
            'e', 'é', 'em', 'na', 'nas', 'no', 'nos',
            'o', 'os', 'ou', 'para', 'por', 'que',
            'se', 'um', 'uma', 'uns', 'umas',
            'com', 'como', 'mais', 'mas', 'não',
            'são', 'ser', 'sua', 'suas', 'seu', 'seus',
            'tem', 'ter', 'foi', 'foi', 'pelo', 'pela',
            'pelos', 'pelas', 'isso', 'esta', 'este',
            'estas', 'estes', 'essa', 'esse', 'essas', 'esses'
        ]);

        this.init();
    }

    async init() {
        // Carregar Lunr.js
        await this.loadLunr();

        // Carregar índice de busca
        await this.loadSearchIndex();

        // Configurar interface
        this.setupSearchInterface();

        // Configurar eventos
        this.setupEventListeners();
    }

    async loadLunr() {
        if (typeof lunr !== 'undefined') {
            return; // Já carregado
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/lunr@2.3.9/lunr.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async loadSearchIndex() {
        try {
            // Determinar o caminho correto para o search-index.json
            const indexPath = this.getSearchIndexPath();

            const response = await fetch(indexPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.documents = data.documents;

            // Reconstruir índice Lunr a partir dos dados serializados
            this.searchIndex = lunr.Index.load(data.indexData);
            this.isIndexLoaded = true;

            console.log('✅ Search index loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load search index:', error);
            this.isIndexLoaded = false;
        }
    }

    getSearchIndexPath() {
        // Calcular o caminho correto baseado na localização atual
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment);

        // Remover o arquivo HTML se presente
        if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.html')) {
            pathSegments.pop();
        }

        // Calcular quantos níveis subir para chegar à raiz
        const levelsUp = pathSegments.length;
        const relativePath = '../'.repeat(levelsUp);

        return `${relativePath}search-index.json`;
    }

    setupSearchInterface() {
        this.searchInput = document.querySelector('#global-search');

        if (!this.searchInput) {
            console.warn('Search input not found');
            return;
        }

        // Criar overlay de resultados
        this.createSearchOverlay();

        // Atualizar placeholder
        this.searchInput.placeholder = 'Buscar na documentação... (Ctrl+K)';
    }

    createSearchOverlay() {
        // Remover overlay existente se houver
        const existingOverlay = document.querySelector('.search-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Criar novo overlay
        this.searchOverlay = document.createElement('div');
        this.searchOverlay.className = 'search-overlay';
        this.searchOverlay.innerHTML = `
            <div class="search-results-container">
                <div class="search-results-header">
                    <span class="search-results-count"></span>
                    <button class="search-close" aria-label="Fechar busca">×</button>
                </div>
                <div class="search-results" id="search-results"></div>
                <div class="search-footer">
                    <span class="search-shortcuts">
                        <kbd>↑</kbd><kbd>↓</kbd> navegar • <kbd>Enter</kbd> abrir • <kbd>Esc</kbd> fechar
                    </span>
                </div>
            </div>
        `;

        document.body.appendChild(this.searchOverlay);
        this.searchResults = document.querySelector('#search-results');
    }

    setupEventListeners() {
        if (!this.searchInput) return;

        // Input de busca
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        this.searchInput.addEventListener('focus', () => {
            if (this.currentQuery) {
                this.showSearchOverlay();
            }
        });

        // Navegação por teclado
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Fechar overlay
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container') && !e.target.closest('.search-overlay')) {
                this.hideSearchOverlay();
            }
        });

        // Botão fechar
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('search-close')) {
                this.hideSearchOverlay();
                this.searchInput.blur();
            }
        });

        // Atalho de teclado global
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
                this.searchInput.select();
            }

            if (e.key === 'Escape') {
                this.hideSearchOverlay();
                this.searchInput.blur();
            }
        });
    }

    /**
     * Filtra termos de busca removendo stopwords e termos muito curtos
     */
    filterSearchTerms(query) {
        const terms = query.toLowerCase()
            .split(/\s+/)
            .filter(term => {
                // Remover termos muito curtos (< 3 caracteres)
                if (term.length < 3) return false;

                // Remover stopwords
                if (this.stopwords.has(term)) return false;

                // Remover termos que são apenas números
                if (/^\d+$/.test(term)) return false;

                return true;
            });

        return terms;
    }

    /**
     * Processa query para busca, mantendo termos significativos
     */
    processSearchQuery(query) {
        const filteredTerms = this.filterSearchTerms(query);

        // Se não sobrou nenhum termo significativo, usar a query original
        // mas com limite mínimo de 3 caracteres
        if (filteredTerms.length === 0) {
            const originalTerms = query.toLowerCase()
                .split(/\s+/)
                .filter(term => term.length >= 3);
            return originalTerms.join(' ');
        }

        return filteredTerms.join(' ');
    }

    handleSearchInput(query) {
        this.currentQuery = query.trim();

        if (this.currentQuery.length === 0) {
            this.hideSearchOverlay();
            return;
        }

        if (this.currentQuery.length < 2) {
            return; // Aguardar pelo menos 2 caracteres
        }

        // Processar query para remover stopwords
        const processedQuery = this.processSearchQuery(this.currentQuery);

        // Se não sobrou nenhum termo válido, mostrar mensagem
        if (processedQuery.length === 0) {
            this.showSearchMessage('Termos de busca muito comuns. Tente palavras mais específicas.');
            return;
        }

        this.performSearch(processedQuery);
    }

    performSearch(query) {
        if (!this.isIndexLoaded || !this.searchIndex) {
            this.showSearchMessage('Índice de busca não carregado');
            return;
        }

        try {
            // Realizar múltiplas estratégias de busca para melhor cobertura
            const searchResults = this.performMultipleSearchStrategies(query);

            this.displaySearchResults(searchResults, query);
            this.showSearchOverlay();

        } catch (error) {
            console.error('Search error:', error);
            this.showSearchMessage('Erro na busca');
        }
    }

    performMultipleSearchStrategies(query) {
        const allResults = new Map(); // Usar Map para evitar duplicatas

        // Estratégia 1: Busca exata (padrão do Lunr)
        try {
            const exactResults = this.searchIndex.search(query);
            this.addResultsToMap(allResults, exactResults, 'exact');
        } catch (e) {
            console.warn('Exact search failed:', e);
        }

        // Estratégia 2: Busca com wildcard
        try {
            const wildcardQuery = this.buildWildcardQuery(query);
            const wildcardResults = this.searchIndex.search(wildcardQuery);
            this.addResultsToMap(allResults, wildcardResults, 'wildcard');
        } catch (e) {
            console.warn('Wildcard search failed:', e);
        }

        // Estratégia 3: Busca fuzzy (tolerante a erros)
        try {
            const fuzzyQuery = this.buildFuzzyQuery(query);
            const fuzzyResults = this.searchIndex.search(fuzzyQuery);
            this.addResultsToMap(allResults, fuzzyResults, 'fuzzy');
        } catch (e) {
            console.warn('Fuzzy search failed:', e);
        }

        // Estratégia 4: Busca por termos individuais
        try {
            const individualResults = this.searchIndividualTerms(query);
            this.addResultsToMap(allResults, individualResults, 'individual');
        } catch (e) {
            console.warn('Individual terms search failed:', e);
        }

        // Estratégia 5: Busca manual em conteúdo (fallback)
        const manualResults = this.performManualSearch(query);
        this.addResultsToMap(allResults, manualResults, 'manual');

        // Converter Map para array e ordenar por relevância
        const finalResults = Array.from(allResults.values())
            .sort((a, b) => {
                // Priorizar por tipo de busca e score
                const typeWeight = {
                    'exact': 10,
                    'wildcard': 8,
                    'fuzzy': 6,
                    'individual': 4,
                    'manual': 2
                };

                const aWeight = (typeWeight[a.searchType] || 1) * a.score;
                const bWeight = (typeWeight[b.searchType] || 1) * b.score;

                return bWeight - aWeight;
            });

        return finalResults;
    }

    buildWildcardQuery(query) {
        // Usar termos filtrados para busca
        const filteredTerms = this.filterSearchTerms(query);
        const terms = filteredTerms.length > 0 ? filteredTerms :
            query.toLowerCase().split(/\s+/).filter(term => term.length >= 3);

        return terms.map(term => {
            if (term.length >= 3) {
                // Para termos maiores, adicionar wildcard no final
                return `${term}*`;
            } else {
                // Para termos menores, busca exata
                return term;
            }
        }).join(' ');
    }

    buildFuzzyQuery(query) {
        // Usar termos filtrados para busca fuzzy
        const filteredTerms = this.filterSearchTerms(query);
        const terms = filteredTerms.length > 0 ? filteredTerms :
            query.toLowerCase().split(/\s+/).filter(term => term.length >= 3);

        return terms.map(term => {
            if (term.length >= 4) {
                // Adicionar fuzzy search (~1 significa 1 erro permitido)
                return `${term}~1`;
            } else if (term.length >= 3) {
                // Para termos menores, wildcard
                return `${term}*`;
            } else {
                return term;
            }
        }).join(' ');
    }

    searchIndividualTerms(query) {
        // Usar termos filtrados para busca individual
        const filteredTerms = this.filterSearchTerms(query);
        const terms = filteredTerms.length > 0 ? filteredTerms :
            query.toLowerCase().split(/\s+/).filter(term => term.length >= 3);

        const allResults = [];

        terms.forEach(term => {
            try {
                // Tentar variações mais precisas do termo
                const variations = [];

                // Busca exata
                variations.push(term);

                // Wildcard apenas para termos >= 3 caracteres
                if (term.length >= 3) {
                    variations.push(`${term}*`);
                }

                // Fuzzy search apenas para termos >= 4 caracteres
                if (term.length >= 4) {
                    variations.push(`${term}~1`);
                }

                variations.forEach(variation => {
                    try {
                        const results = this.searchIndex.search(variation);
                        // Filtrar resultados com score muito baixo
                        const filteredResults = results.filter(result => result.score > 0.1);
                        allResults.push(...filteredResults);
                    } catch (e) {
                        // Ignorar erros de variações específicas
                    }
                });
            } catch (e) {
                console.warn(`Failed to search term: ${term}`, e);
            }
        });

        return allResults;
    }

    performManualSearch(query) {
        // Usar termos filtrados para busca manual
        const filteredTerms = this.filterSearchTerms(query);
        const terms = filteredTerms.length > 0 ? filteredTerms :
            query.toLowerCase().split(/\s+/).filter(term => term.length >= 3);

        const results = [];

        this.documents.forEach(doc => {
            let score = 0;
            let matches = 0;

            const searchableText = [
                doc.title || '',
                doc.excerpt || '',
                doc.content || ''
            ].join(' ').toLowerCase();

            // Verificar cada termo
            terms.forEach(term => {
                // Busca exata por palavra completa (não substring)
                const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'gi');
                const exactMatches = (searchableText.match(wordBoundaryRegex) || []).length;

                if (exactMatches > 0) {
                    score += exactMatches * 2;
                    matches++;
                } else {
                    // Busca parcial apenas para termos >= 4 caracteres e como palavra completa
                    if (term.length >= 4) {
                        const partialRegex = new RegExp(`\\b\\w*${this.escapeRegex(term)}\\w*\\b`, 'gi');
                        const partialMatches = (searchableText.match(partialRegex) || []).length;

                        if (partialMatches > 0) {
                            score += partialMatches * 0.5; // Score menor para matches parciais
                            matches++;
                        }
                    }
                }
            });

            // Se encontrou pelo menos um termo
            if (matches > 0) {
                // Normalizar score baseado no número de termos
                const normalizedScore = (score / terms.length) / 100;

                results.push({
                    ref: doc.id,
                    score: Math.min(normalizedScore, 1), // Limitar a 1
                    matchData: { metadata: {} }
                });
            }
        });

        return results;
    }

    addResultsToMap(resultsMap, newResults, searchType) {
        newResults.forEach(result => {
            const existing = resultsMap.get(result.ref);

            if (!existing || result.score > existing.score) {
                // Adicionar informação sobre o tipo de busca
                result.searchType = searchType;
                resultsMap.set(result.ref, result);
            }
        });
    }

    displaySearchResults(results, query) {
        if (!this.searchResults) return;

        // Filtrar resultados para garantir que realmente contêm os termos de busca
        const validatedResults = this.validateSearchResults(results, query);

        const resultsCount = document.querySelector('.search-results-count');
        if (resultsCount) {
            // Mostrar a query original para o usuário
            resultsCount.textContent = `${validatedResults.length} resultado${validatedResults.length !== 1 ? 's' : ''} para "${this.currentQuery}"`;
        }

        if (validatedResults.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>Nenhum resultado encontrado para "<strong>${this.escapeHtml(this.currentQuery)}</strong>"</p>
                    <p class="search-suggestions">Tente:</p>
                    <ul>
                        <li>Verificar a ortografia</li>
                        <li>Usar termos mais gerais</li>
                        <li>Usar palavras-chave diferentes</li>
                        <li>Usar apenas parte da palavra (ex: "doc" para "documento")</li>
                    </ul>
                </div>
            `;
            return;
        }

        // Renderizar resultados
        this.searchResults.innerHTML = validatedResults.map((result, index) => {
            const doc = this.documents.find(d => d.id === result.ref);
            if (!doc) return '';

            // Gerar excerpt dinâmico se necessário
            const dynamicExcerpt = this.generateDynamicExcerpt(doc, query);
            const excerptToUse = dynamicExcerpt || doc.excerpt;

            // Usar termos filtrados para highlight, mas mostrar query original
            const highlightedTitle = this.highlightSearchTerms(doc.title, query);
            const highlightedExcerpt = this.highlightSearchTerms(excerptToUse, query);
            const correctedUrl = this.getCorrectUrl(doc.url);

            // Ícone baseado no tipo de busca
            const searchTypeIcon = this.getSearchTypeIcon(result.searchType);
            const searchTypeLabel = this.getSearchTypeLabel(result.searchType);

            // Indicador se o excerpt foi gerado dinamicamente
            const isDynamic = dynamicExcerpt !== null;
            const excerptIndicator = isDynamic ? '<span class="dynamic-excerpt-indicator" title="Contexto encontrado no documento">📍</span>' : '';

            return `
                <div class="search-result-item" data-index="${index}" data-url="${correctedUrl}">
                    <div class="search-result-header">
                        <div class="search-result-title">${highlightedTitle}</div>
                        <div class="search-result-meta">
                            <span class="search-type" title="${searchTypeLabel}">
                                ${searchTypeIcon}
                            </span>
                            ${excerptIndicator}
                            <span class="search-score">${(result.score * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    <div class="search-result-excerpt${isDynamic ? ' dynamic-excerpt' : ''}">${highlightedExcerpt}</div>
                    <div class="search-result-url">${doc.url}</div>
                </div>
            `;
        }).filter(html => html).join('');

        // Configurar cliques nos resultados
        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                if (url) {
                    // Usar termos filtrados para highlight na página de destino
                    const searchParams = new URLSearchParams();
                    searchParams.set('highlight', query);

                    const separator = url.includes('?') ? '&' : '?';
                    const finalUrl = `${url}${separator}${searchParams.toString()}`;

                    window.location.href = finalUrl;
                }
            });
        });

        this.selectedResultIndex = -1;
    }

    /**
     * Valida se os resultados realmente contêm os termos de busca
     */
    validateSearchResults(results, query) {
        const filteredTerms = this.filterSearchTerms(query);

        // Se não há termos filtrados, usar termos originais com mínimo de 3 caracteres
        const terms = filteredTerms.length > 0 ? filteredTerms :
            query.toLowerCase().split(/\s+/).filter(term => term.length >= 3);

        return results.filter(result => {
            const doc = this.documents.find(d => d.id === result.ref);
            if (!doc) return false;

            const searchableText = [
                doc.title || '',
                doc.excerpt || '',
                doc.content || ''
            ].join(' ').toLowerCase();

            // Verificar se pelo menos um termo está presente como palavra completa
            return terms.some(term => {
                const wordBoundaryRegex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'i');
                return wordBoundaryRegex.test(searchableText);
            });
        });
    }

    /**
     * Gera um excerpt dinâmico centrado nos termos de busca
     */
    generateDynamicExcerpt(doc, query) {
        const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
        const content = doc.content.toLowerCase();
        const originalContent = doc.content;

        // Verificar se algum termo está no excerpt atual
        const currentExcerpt = doc.excerpt.toLowerCase();
        const hasTermInExcerpt = terms.some(term => {
            const normalizedTerm = this.normalizeAccents(term);
            const normalizedExcerpt = this.normalizeAccents(currentExcerpt);
            return normalizedExcerpt.includes(term) || normalizedExcerpt.includes(normalizedTerm);
        });

        // Se já tem termo no excerpt, não precisa gerar dinâmico
        if (hasTermInExcerpt) {
            return null;
        }

        // Encontrar todas as ocorrências de todos os termos
        const allMatches = [];

        for (const term of terms) {
            const normalizedTerm = this.normalizeAccents(term);
            const normalizedContent = this.normalizeAccents(content);

            // Buscar todas as ocorrências do termo exato
            let position = 0;
            while ((position = content.indexOf(term, position)) !== -1) {
                allMatches.push({ position, term, type: 'exact' });
                position++;
            }

            // Buscar todas as ocorrências do termo normalizado
            position = 0;
            while ((position = normalizedContent.indexOf(normalizedTerm, position)) !== -1) {
                // Verificar se não é duplicata de uma correspondência exata
                const isExactMatch = allMatches.some(match =>
                    Math.abs(match.position - position) < term.length
                );

                if (!isExactMatch) {
                    allMatches.push({ position, term: normalizedTerm, type: 'normalized' });
                }
                position++;
            }
        }

        // Se não encontrou nenhum termo, retornar null
        if (allMatches.length === 0) {
            return null;
        }

        // Encontrar a melhor posição (com mais termos próximos)
        const bestPosition = this.findBestExcerptPosition(allMatches, originalContent.length);

        // Gerar contexto ao redor da melhor posição
        const contextLength = 200; // Aumentar um pouco o contexto
        const startPos = Math.max(0, bestPosition - contextLength / 2);
        const endPos = Math.min(originalContent.length, bestPosition + contextLength / 2);

        let excerpt = originalContent.substring(startPos, endPos);

        // Ajustar para não cortar palavras
        excerpt = this.adjustExcerptBoundaries(excerpt, startPos, endPos, originalContent);

        // Adicionar indicadores de continuação
        const prefix = startPos > 0 ? '...' : '';
        const suffix = endPos < originalContent.length ? '...' : '';

        return `${prefix}${excerpt}${suffix}`;
    }

    /**
     * Encontra a melhor posição para o excerpt baseada na densidade de termos
     */
    findBestExcerptPosition(matches, contentLength) {
        if (matches.length === 1) {
            return matches[0].position;
        }

        // Agrupar matches por proximidade
        const windowSize = 100; // Janela de análise
        let bestScore = 0;
        let bestPosition = matches[0].position;

        for (const match of matches) {
            const windowStart = Math.max(0, match.position - windowSize);
            const windowEnd = Math.min(contentLength, match.position + windowSize);

            // Contar quantos matches estão nesta janela
            const matchesInWindow = matches.filter(m =>
                m.position >= windowStart && m.position <= windowEnd
            );

            // Calcular score baseado no número de matches e tipos
            let score = matchesInWindow.length;

            // Bonus para correspondências exatas
            const exactMatches = matchesInWindow.filter(m => m.type === 'exact').length;
            score += exactMatches * 0.5;

            if (score > bestScore) {
                bestScore = score;
                bestPosition = match.position;
            }
        }

        return bestPosition;
    }

    /**
     * Ajusta as bordas do excerpt para não cortar palavras
     */
    adjustExcerptBoundaries(excerpt, startPos, endPos, originalContent) {
        // Ajustar início
        if (startPos > 0) {
            const firstSpace = excerpt.indexOf(' ');
            if (firstSpace !== -1 && firstSpace < excerpt.length / 3) {
                excerpt = excerpt.substring(firstSpace + 1);
            }
        }

        // Ajustar fim
        if (endPos < originalContent.length) {
            const lastSpace = excerpt.lastIndexOf(' ');
            if (lastSpace !== -1 && lastSpace > excerpt.length * 2 / 3) {
                excerpt = excerpt.substring(0, lastSpace);
            }
        }

        return excerpt.trim();
    }

    getCorrectUrl(originalUrl) {
        // Se a URL já é absoluta ou começa com /, usar como está
        if (originalUrl.startsWith('http') || originalUrl.startsWith('/')) {
            return originalUrl;
        }

        // Calcular o caminho correto baseado na localização atual
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment);

        // Remover o arquivo HTML se presente
        if (pathSegments.length > 0 && pathSegments[pathSegments.length - 1].includes('.html')) {
            pathSegments.pop();
        }

        // Calcular quantos níveis subir para chegar à raiz
        const levelsUp = pathSegments.length;
        const relativePath = '../'.repeat(levelsUp);

        return `${relativePath}${originalUrl}`;
    }

    getSearchTypeIcon(searchType) {
        const icons = {
            'exact': '🎯',
            'wildcard': '🔍',
            'fuzzy': '🔤',
            'individual': '📝',
            'manual': '🔎'
        };
        return icons[searchType] || '📄';
    }

    getSearchTypeLabel(searchType) {
        const labels = {
            'exact': 'Correspondência exata',
            'wildcard': 'Busca com wildcard',
            'fuzzy': 'Busca tolerante a erros',
            'individual': 'Termos individuais',
            'manual': 'Busca manual no conteúdo'
        };
        return labels[searchType] || 'Busca padrão';
    }

    highlightSearchTerms(text, query) {
        if (!text || !query) return text;

        // Usar apenas termos filtrados para highlight
        const filteredTerms = this.filterSearchTerms(query);

        // Se não há termos filtrados, não fazer highlight
        if (filteredTerms.length === 0) return text;

        let highlightedText = text;

        // Criar um mapa de posições para evitar sobreposições
        const highlights = [];

        filteredTerms.forEach(term => {
            const termLower = term.toLowerCase();
            const textLower = text.toLowerCase();

            // Normalizar acentos para busca mais flexível
            const normalizedTerm = this.normalizeAccents(termLower);
            const normalizedText = this.normalizeAccents(textLower);

            // 1. Buscar correspondências exatas (com acentos originais)
            this.findMatches(text, textLower, termLower, highlights, 'exact');

            // 2. Buscar correspondências normalizadas (sem acentos)
            if (normalizedTerm !== termLower) {
                this.findMatchesNormalized(text, normalizedText, normalizedTerm, highlights, 'exact-normalized');
            }

            // 3. Buscar correspondências parciais (apenas para termos >= 4 caracteres)
            if (termLower.length >= 4) {
                this.findPartialMatches(text, textLower, termLower, highlights);

                // Buscar correspondências parciais normalizadas
                if (normalizedTerm !== termLower) {
                    this.findPartialMatchesNormalized(text, normalizedText, normalizedTerm, highlights);
                }
            }
        });

        // Ordenar highlights por posição (do final para o início para não afetar índices)
        highlights.sort((a, b) => b.start - a.start);

        // Aplicar highlights
        highlights.forEach(highlight => {
            const before = highlightedText.substring(0, highlight.start);
            const after = highlightedText.substring(highlight.end);
            const markClass = this.getHighlightClass(highlight.type);

            highlightedText = before +
                `<mark class="${markClass}">${highlight.term}</mark>` +
                after;
        });

        return highlightedText;
    }

    normalizeAccents(text) {
        // Remover acentos para busca mais flexível
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    findMatches(text, textLower, term, highlights, type) {
        let startIndex = 0;
        while (true) {
            const index = textLower.indexOf(term, startIndex);
            if (index === -1) break;

            if (!this.hasOverlap(highlights, index, index + term.length)) {
                highlights.push({
                    start: index,
                    end: index + term.length,
                    term: text.substring(index, index + term.length),
                    type: type
                });
            }

            startIndex = index + 1;
        }
    }

    findMatchesNormalized(text, normalizedText, normalizedTerm, highlights, type) {
        let startIndex = 0;
        while (true) {
            const index = normalizedText.indexOf(normalizedTerm, startIndex);
            if (index === -1) break;

            // Encontrar o comprimento real no texto original
            const originalLength = this.getOriginalLength(text, index, normalizedTerm.length);

            if (!this.hasOverlap(highlights, index, index + originalLength)) {
                highlights.push({
                    start: index,
                    end: index + originalLength,
                    term: text.substring(index, index + originalLength),
                    type: type
                });
            }

            startIndex = index + 1;
        }
    }

    findPartialMatches(text, textLower, term, highlights) {
        // Buscar palavras que contenham o termo
        const wordRegex = new RegExp(`\\b\\w*${this.escapeRegex(term)}\\w*\\b`, 'gi');
        let match;

        while ((match = wordRegex.exec(text)) !== null) {
            const matchStart = match.index;
            const matchEnd = matchStart + match[0].length;

            // Verificar se não é uma correspondência exata já encontrada
            const isExactMatch = match[0].toLowerCase() === term;
            if (isExactMatch) continue;

            if (!this.hasOverlap(highlights, matchStart, matchEnd)) {
                highlights.push({
                    start: matchStart,
                    end: matchEnd,
                    term: match[0],
                    type: 'partial'
                });
            }
        }
    }

    findPartialMatchesNormalized(text, normalizedText, normalizedTerm, highlights) {
        // Buscar palavras que contenham o termo normalizado
        const wordRegex = new RegExp(`\\b\\w*${this.escapeRegex(normalizedTerm)}\\w*\\b`, 'gi');
        let match;

        while ((match = wordRegex.exec(normalizedText)) !== null) {
            const matchStart = match.index;
            const originalLength = this.getOriginalLength(text, matchStart, match[0].length);
            const matchEnd = matchStart + originalLength;

            // Verificar se não é uma correspondência exata já encontrada
            const originalMatch = text.substring(matchStart, matchEnd);
            const isExactMatch = this.normalizeAccents(originalMatch.toLowerCase()) === normalizedTerm;
            if (isExactMatch) continue;

            if (!this.hasOverlap(highlights, matchStart, matchEnd)) {
                highlights.push({
                    start: matchStart,
                    end: matchEnd,
                    term: originalMatch,
                    type: 'partial-normalized'
                });
            }
        }
    }

    getOriginalLength(originalText, startIndex, normalizedLength) {
        // Calcular o comprimento real no texto original considerando acentos
        let realLength = 0;
        let normalizedCount = 0;

        for (let i = startIndex; i < originalText.length && normalizedCount < normalizedLength; i++) {
            realLength++;
            const char = originalText[i];
            const normalized = this.normalizeAccents(char);
            if (normalized) {
                normalizedCount++;
            }
        }

        return realLength;
    }

    hasOverlap(highlights, start, end) {
        return highlights.some(h =>
            (start >= h.start && start < h.end) ||
            (end > h.start && end <= h.end) ||
            (start <= h.start && end >= h.end)
        );
    }

    getHighlightClass(type) {
        switch (type) {
            case 'exact':
            case 'exact-normalized':
                return 'exact-match';
            case 'partial':
            case 'partial-normalized':
                return 'partial-match';
            default:
                return 'exact-match';
        }
    }

    handleKeyNavigation(e) {
        if (!this.searchOverlay || !this.searchOverlay.classList.contains('active')) {
            return;
        }

        const results = this.searchResults.querySelectorAll('.search-result-item');

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedResultIndex = Math.min(this.selectedResultIndex + 1, results.length - 1);
                this.updateSelectedResult(results);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.selectedResultIndex = Math.max(this.selectedResultIndex - 1, -1);
                this.updateSelectedResult(results);
                break;

            case 'Enter':
                e.preventDefault();
                if (this.selectedResultIndex >= 0 && results[this.selectedResultIndex]) {
                    const url = results[this.selectedResultIndex].dataset.url;
                    if (url) {
                        // Adicionar termos de busca como parâmetros na URL
                        const searchParams = new URLSearchParams();
                        searchParams.set('highlight', this.currentQuery);

                        const separator = url.includes('?') ? '&' : '?';
                        const finalUrl = `${url}${separator}${searchParams.toString()}`;

                        window.location.href = finalUrl;
                    }
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.hideSearchOverlay();
                this.searchInput.blur();
                break;
        }
    }

    updateSelectedResult(results) {
        results.forEach((result, index) => {
            result.classList.toggle('selected', index === this.selectedResultIndex);
        });

        // Scroll para o resultado selecionado
        if (this.selectedResultIndex >= 0 && results[this.selectedResultIndex]) {
            results[this.selectedResultIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }

    showSearchOverlay() {
        if (this.searchOverlay) {
            this.searchOverlay.classList.add('active');
            document.body.classList.add('search-active');
        }
    }

    hideSearchOverlay() {
        if (this.searchOverlay) {
            this.searchOverlay.classList.remove('active');
            document.body.classList.remove('search-active');
        }
        this.selectedResultIndex = -1;
    }

    showSearchMessage(message) {
        if (!this.searchResults) return;

        this.searchResults.innerHTML = `
            <div class="search-message">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        this.showSearchOverlay();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Inicializar busca quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.documentationSearch = new DocumentationSearch();
}); 