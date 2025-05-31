# 🚀 Guia de Instalação e Configuração

## 📋 Visão Geral

Este guia fornece instruções detalhadas para instalar, configurar e começar a usar o Knowledge em diferentes ambientes e cenários.

## 🔧 Pré-requisitos

### Requisitos Mínimos

- **Bun.js**: v1.0.0 ou superior (recomendado)
- **Node.js**: v18.0.0 ou superior (alternativo)
- **Sistema Operacional**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Memória RAM**: 2GB mínimo, 4GB recomendado
- **Espaço em Disco**: 500MB para instalação + espaço para documentação

### Ferramentas Opcionais

- **Git**: Para controle de versão
- **VS Code**: Editor recomendado com extensões TypeScript
- **Docker**: Para deployment em containers

## 📦 Instalação

### Método 1: Instalação com Bun (Recomendado)

```bash
# 1. Instalar Bun.js (se não estiver instalado)
curl -fsSL https://bun.sh/install | bash

# 2. Clonar o repositório
git clone https://github.com/riligar/knowledge.git
cd knowledge

# 3. Instalar dependências
bun install

# 4. Verificar instalação
bun run --version
```

### Método 2: Instalação com npm/yarn

```bash
# 1. Clonar o repositório
git clone https://github.com/riligar/knowledge.git
cd knowledge

# 2. Instalar dependências
npm install
# ou
yarn install

# 3. Verificar instalação
npm run build --dry-run
```

### Método 3: Instalação Global

```bash
# Instalar globalmente (futuro)
npm install -g @riligar/knowledge

# Usar em qualquer diretório
knowledge init my-docs
cd my-docs
knowledge dev
```

## ⚙️ Configuração Inicial

### 1. Inicializar Projeto

```bash
# Criar novo projeto de documentação
bun run init

# Ou especificar diretório
bun run init --dir ./minha-documentacao
```

Isso criará a seguinte estrutura:

```
minha-documentacao/
├── docs/                    # Documentação fonte
│   └── README.md           # Página inicial
├── docforge.config.ts      # Configuração principal
├── package.json            # Dependências do projeto
└── .gitignore             # Arquivos ignorados pelo Git
```

### 2. Configuração Básica

Edite o arquivo `docforge.config.ts`:

```typescript
import type { DocForgeConfig } from './src/config.js';

export default {
    // Diretórios
    inputDir: './docs',
    outputDir: './dist',
    themesDir: './themes',

    // Informações do site
    site: {
        title: 'Minha Documentação',
        description: 'Documentação completa do meu projeto',
        baseUrl: '/',
        author: 'Seu Nome'
    },

    // Tema e layout
    theme: 'default',
    layout: 'default',

    // Navegação
    navigation: {
        auto: true,  // Geração automática baseada na estrutura de arquivos
        // items: []  // Navegação manual (opcional)
    },

    // Funcionalidades
    features: {
        search: true,
        syntaxHighlight: true,
        darkMode: true,
        tableOfContents: true,
        breadcrumbs: true,
        editOnGithub: 'https://github.com/seu-usuario/seu-repo'
    },

    // Processamento Markdown
    markdown: {
        breaks: true,
        linkify: true,
        typographer: true
    },

    // Servidor de desenvolvimento
    dev: {
        port: 3000,
        host: 'localhost',
        livereload: true
    }
} as DocForgeConfig;
```

### 3. Estrutura de Documentação

Organize seus arquivos Markdown na pasta `docs/`:

```
docs/
├── README.md                # Página inicial (obrigatório)
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── configuration.md
├── guides/
│   ├── user-guide.md
│   ├── admin-guide.md
│   └── developer-guide.md
├── api/
│   ├── overview.md
│   ├── authentication.md
│   └── endpoints.md
└── assets/
    ├── images/
    └── files/
```

## 🎯 Configurações Avançadas

### Configuração de Site

```typescript
site: {
    title: 'Knowledge Base',
    description: 'Documentação técnica completa',
    baseUrl: '/',  // Para GitHub Pages: '/nome-do-repo/'
    author: 'Equipe de Desenvolvimento',
    
    // Metadados adicionais
    keywords: ['documentação', 'api', 'guias'],
    language: 'pt-BR',
    favicon: '/assets/favicon.ico',
    
    // SEO e Social
    ogImage: '/assets/og-image.png',
    twitterCard: 'summary_large_image',
    
    // Analytics
    googleAnalytics: 'GA_MEASUREMENT_ID',
    gtag: 'G-XXXXXXXXXX'
}
```

### Configuração de Navegação Manual

```typescript
navigation: {
    auto: false,
    items: [
        {
            title: 'Início',
            url: '/',
            icon: 'home'
        },
        {
            title: 'Guias',
            children: [
                { title: 'Instalação', url: '/guides/installation.html' },
                { title: 'Configuração', url: '/guides/configuration.html' },
                { title: 'Uso Básico', url: '/guides/basic-usage.html' }
            ]
        },
        {
            title: 'API',
            children: [
                { title: 'Visão Geral', url: '/api/overview.html' },
                { title: 'Autenticação', url: '/api/auth.html' },
                { title: 'Endpoints', url: '/api/endpoints.html' }
            ]
        },
        {
            title: 'GitHub',
            url: 'https://github.com/riligar/knowledge',
            external: true
        }
    ]
}
```

### Configuração de Funcionalidades

```typescript
features: {
    // Busca
    search: {
        enabled: true,
        placeholder: 'Buscar na documentação...',
        noResultsText: 'Nenhum resultado encontrado',
        indexFields: {
            title: { boost: 10 },
            excerpt: { boost: 5 },
            content: { boost: 1 }
        }
    },
    
    // Syntax highlighting
    syntaxHighlight: {
        enabled: true,
        theme: 'github',  // github, monokai, dracula, etc.
        showLineNumbers: true,
        copyButton: true
    },
    
    // Modo escuro
    darkMode: {
        enabled: true,
        defaultTheme: 'auto',  // light, dark, auto
        storageKey: 'knowledge-theme'
    },
    
    // Índice de conteúdo
    tableOfContents: {
        enabled: true,
        levels: [2, 3, 4],  // h2, h3, h4
        position: 'right'   // left, right, inline
    },
    
    // Breadcrumbs
    breadcrumbs: {
        enabled: true,
        separator: '/',
        showHome: true
    },
    
    // Editar no GitHub
    editOnGithub: {
        enabled: true,
        baseUrl: 'https://github.com/seu-usuario/seu-repo',
        branch: 'main',
        text: 'Editar esta página'
    }
}
```

### Configuração de Markdown

```typescript
markdown: {
    // Configurações básicas
    breaks: true,        // Quebras de linha automáticas
    linkify: true,       // URLs automáticos
    typographer: true,   // Aspas e travessões inteligentes
    
    // Extensões
    extensions: {
        tables: true,
        strikethrough: true,
        tasklists: true,
        footnotes: true,
        math: true,          // Suporte a LaTeX
        mermaid: true,       // Diagramas Mermaid
        emoji: true          // Emojis :smile:
    },
    
    // Plugins customizados
    plugins: [
        'markdown-it-container',
        'markdown-it-deflist',
        'markdown-it-abbr'
    ]
}
```

## 🎨 Personalização de Tema

### Tema Customizado

```bash
# Criar tema personalizado
mkdir -p themes/meu-tema/layouts
mkdir -p themes/meu-tema/assets/css
mkdir -p themes/meu-tema/assets/js

# Copiar tema padrão como base
cp -r themes/default/* themes/meu-tema/
```

### Customização de CSS

```css
/* themes/meu-tema/assets/css/custom.css */

:root {
    /* Cores primárias */
    --primary-color: #007acc;
    --secondary-color: #6c757d;
    --accent-color: #28a745;
    
    /* Tipografia */
    --font-family: 'Inter', -apple-system, sans-serif;
    --font-size-base: 16px;
    --line-height-base: 1.6;
    
    /* Espaçamento */
    --spacing-unit: 8px;
    --container-max-width: 1200px;
    
    /* Modo escuro */
    --dark-bg: #1a1a1a;
    --dark-text: #e0e0e0;
    --dark-border: #333;
}

/* Customizações específicas */
.header {
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
}

.sidebar {
    border-right: 2px solid var(--primary-color);
}

.content {
    font-family: var(--font-family);
    line-height: var(--line-height-base);
}
```

### Layout Personalizado

```html
<!-- themes/meu-tema/layouts/default.html -->
<!DOCTYPE html>
<html lang="{{site.language}}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{page.title}} - {{site.title}}</title>
    <meta name="description" content="{{page.description || site.description}}">
    
    <!-- CSS -->
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/custom.css">
    
    <!-- Favicon -->
    <link rel="icon" href="{{site.favicon}}">
</head>
<body>
    <div class="layout">
        <!-- Header -->
        <header class="header">
            <div class="container">
                <h1 class="site-title">{{site.title}}</h1>
                <nav class="main-nav">{{navigation}}</nav>
            </div>
        </header>
        
        <!-- Main Content -->
        <main class="main">
            <aside class="sidebar">{{sidebar}}</aside>
            <article class="content">
                {{content}}
            </article>
            <aside class="toc">{{tableOfContents}}</aside>
        </main>
        
        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <p>&copy; {{currentYear}} {{site.author}}</p>
            </div>
        </footer>
    </div>
    
    <!-- JavaScript -->
    <script src="/assets/js/main.js"></script>
    <script src="/assets/js/search.js"></script>
</body>
</html>
```

## 🔧 Comandos e Scripts

### Scripts de Desenvolvimento

```json
{
  "scripts": {
    "dev": "bun run src/cli.ts dev",
    "build": "bun run src/cli.ts build",
    "serve": "bun run src/cli.ts serve",
    "clean": "rm -rf dist",
    "lint": "eslint src/**/*.ts",
    "type-check": "tsc --noEmit",
    "preview": "bun run build && bun run serve"
  }
}
```

### Comandos Úteis

```bash
# Desenvolvimento
bun run dev                    # Servidor de desenvolvimento
bun run dev --port 4000       # Porta customizada
bun run dev --host 0.0.0.0    # Acessível externamente

# Build
bun run build                  # Build completo
bun run build --config custom.config.ts  # Configuração customizada

# Servir
bun run serve                  # Servir dist/
bun run serve --port 8080     # Porta customizada
bun run serve --dir ./build   # Diretório customizado

# Limpeza
bun run clean                  # Limpar dist/
rm -rf node_modules && bun install  # Reinstalar dependências
```

## 🐳 Deploy com Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM oven/bun:1 as builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  knowledge:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./docs:/app/docs:ro
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Desenvolvimento
  knowledge-dev:
    build:
      context: .
      target: builder
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    command: bun run dev
    environment:
      - NODE_ENV=development
```

### Comandos Docker

```bash
# Build da imagem
docker build -t knowledge .

# Executar container
docker run -p 80:80 knowledge

# Com Docker Compose
docker-compose up -d

# Desenvolvimento
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## 🌐 Deploy em Produção

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install
    
    - name: Build
      run: bun run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Netlify

```toml
# netlify.toml
[build]
  command = "bun install && bun run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro de Instalação

```bash
# Limpar cache
bun pm cache rm
rm -rf node_modules bun.lock
bun install

# Verificar versão do Bun
bun --version

# Atualizar Bun
curl -fsSL https://bun.sh/install | bash
```

#### 2. Build Falha

```bash
# Verificar configuração
bun run src/cli.ts build --verbose

# Verificar arquivos Markdown
find docs -name "*.md" -exec echo "Checking: {}" \; -exec head -1 {} \;

# Verificar sintaxe do config
bun run -e "import('./docforge.config.ts')"
```

#### 3. Servidor Não Inicia

```bash
# Verificar porta em uso
lsof -i :3000

# Usar porta diferente
bun run dev --port 3001

# Verificar permissões
ls -la src/
```

#### 4. Assets Não Carregam

```bash
# Verificar estrutura de temas
ls -la themes/default/assets/

# Verificar caminhos no HTML
grep -r "assets/" dist/

# Verificar servidor estático
curl -I http://localhost:3000/assets/css/style.css
```

### Logs de Debug

```bash
# Habilitar logs detalhados
DEBUG=knowledge:* bun run dev

# Logs específicos
DEBUG=knowledge:generator bun run build
DEBUG=knowledge:search bun run build
DEBUG=knowledge:markdown bun run build
```

### Verificação de Saúde

```bash
# Script de verificação
#!/bin/bash
echo "🔍 Verificando instalação do Knowledge..."

# Verificar Bun
if command -v bun &> /dev/null; then
    echo "✅ Bun: $(bun --version)"
else
    echo "❌ Bun não encontrado"
fi

# Verificar dependências
if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
    bun run --dry-run build && echo "✅ Scripts funcionando"
else
    echo "❌ package.json não encontrado"
fi

# Verificar configuração
if [ -f "docforge.config.ts" ]; then
    echo "✅ Configuração encontrada"
else
    echo "⚠️  Configuração não encontrada - execute 'bun run init'"
fi

# Verificar documentação
if [ -d "docs" ] && [ -f "docs/README.md" ]; then
    echo "✅ Documentação encontrada"
    echo "📄 Arquivos: $(find docs -name "*.md" | wc -l) arquivos Markdown"
else
    echo "❌ Pasta docs/ ou README.md não encontrado"
fi

echo "🎉 Verificação concluída!"
```

## 📚 Próximos Passos

Após a instalação e configuração:

1. **Criar Conteúdo**: Adicione seus arquivos Markdown na pasta `docs/`
2. **Personalizar Tema**: Customize cores, fontes e layout
3. **Configurar Deploy**: Configure CI/CD para deploy automático
4. **Otimizar SEO**: Configure metadados e sitemap
5. **Monitorar Performance**: Configure analytics e métricas

## 🆘 Suporte

- 📖 **Documentação**: [knowledge.dev](https://knowledge.dev)
- 🐛 **Issues**: [GitHub Issues](https://github.com/riligar/knowledge/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/riligar/knowledge/discussions)
- 📧 **Email**: [suporte@riligar.click](mailto:suporte@riligar.click)

---

**Pronto para começar!** 🚀 Sua documentação moderna está a apenas alguns comandos de distância. 