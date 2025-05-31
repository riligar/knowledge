# Knowledge - Sistema de Documentação Moderno

[![GitHub stars](https://img.shields.io/github/stars/riligar/knowledge)](https://github.com/riligar/knowledge/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-knowledge.dev-blue)](https://knowledge.dev)

> Transforme como sua equipe cria, organiza e compartilha conhecimento

Um sistema de documentação moderno e open-source que transforma como equipes criam, organizam e compartilham conhecimento. Construído para desenvolvedores, projetado para todos.

## Por que Knowledge?

- **Developer First** - Construído por desenvolvedores, para desenvolvedores
- **Stack Moderno** - Tecnologias web mais recentes para melhor performance
- **Extensível** - Sistema de plugins para customização ilimitada
- **Community Driven** - Open source com suporte ativo da comunidade

## Características Principais

### Interface Moderna
- **Design Limpo**: Interface profissional com atenção aos detalhes
- **Responsivo**: Design mobile-first que funciona em todos os dispositivos
- **Modo Escuro**: Alternância automática de tema com transições suaves
- **Acessibilidade**: Compatível com WCAG e navegação por teclado

### Busca Avançada
- **Busca em Tempo Real**: Resultados instantâneos conforme você digita
- **Full-Text Search**: Busca em títulos, conteúdo e resumos
- **Atalhos de Teclado**: Ctrl/Cmd + K para focar na busca
- **Relevância Inteligente**: Algoritmo de pontuação por peso

### Recursos para Desenvolvedores
- **Syntax Highlighting**: Destaque de sintaxe com copy-to-clipboard
- **Navegação Automática**: Geração automática de navegação
- **Live Reload**: Servidor de desenvolvimento com recarga automática
- **TypeScript**: Desenvolvimento type-safe

## Stack Tecnológico

- **Runtime**: Bun.js para performance máxima
- **Linguagem**: TypeScript para type safety
- **Markdown**: Processamento avançado com extensões
- **Busca**: Lunr.js para busca full-text offline
- **CSS Moderno**: Grid, Flexbox, Custom Properties
- **JavaScript Vanilla**: Sem dependências de framework

## Estrutura do Projeto

```
knowledge/
├── src/                    # Código fonte
│   ├── cli.ts             # Interface de linha de comando
│   ├── generator.ts       # Gerador de documentação
│   ├── search.ts          # Sistema de busca
│   ├── markdown.ts        # Processador de Markdown
│   ├── config.ts          # Configurações
│   └── dev-server.ts      # Servidor de desenvolvimento
├── themes/                # Temas
│   └── default/
│       ├── layouts/       # Templates HTML
│       └── assets/
│           ├── css/       # Folhas de estilo
│           └── js/        # Scripts JavaScript
├── docs/                  # Documentação fonte
├── dist/                  # Saída gerada
└── docforge.config.ts     # Configuração principal
```

## Início Rápido

### Pré-requisitos

- [Bun.js](https://bun.sh/) v1.0+
- Node.js v18+ (opcional, para compatibilidade)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/riligar/knowledge.git
cd knowledge

# Instalar dependências
bun install

# Inicializar projeto
bun run init
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
bun run dev

# Acessar: http://localhost:3000
```

### Build para Produção

```bash
# Gerar documentação
bun run build

# Servir localmente
bun run serve
```

## Configuração

O arquivo `docforge.config.ts` contém todas as opções de configuração:

```typescript
export default {
    // Diretórios
    inputDir: './docs',
    outputDir: './dist',
    themesDir: './themes',

    // Informações do site
    site: {
        title: 'Sua Documentação',
        description: 'Descrição do seu site',
        baseUrl: '/',
        author: 'Seu Nome'
    },

    // Tema e layout
    theme: 'default',
    layout: 'default',

    // Navegação
    navigation: {
        auto: true  // Geração automática
    },

    // Funcionalidades
    features: {
        search: true,
        syntaxHighlight: true,
        darkMode: true,
        tableOfContents: true,
        breadcrumbs: true,
        editOnGithub: 'https://github.com/seu-usuario/docs'
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

## Comandos CLI

### `build`
Gera a documentação estática:
```bash
bun run build [opções]

Opções:
  -c, --config <path>   Caminho para arquivo de configuração
  -i, --input <path>    Diretório de entrada com arquivos markdown
  -o, --output <path>   Diretório de saída para site gerado
```

### `dev`
Inicia servidor de desenvolvimento:
```bash
bun run dev [opções]

Opções:
  -c, --config <path>   Caminho para arquivo de configuração
  -p, --port <number>   Porta do servidor (padrão: 3000)
  -h, --host <string>   Host do servidor (padrão: localhost)
```

### `serve`
Serve a documentação construída:
```bash
bun run serve [opções]

Opções:
  -p, --port <number>   Porta do servidor (padrão: 8080)
  -d, --dir <path>      Diretório para servir (padrão: ./dist)
```

### `init`
Inicializa um novo projeto:
```bash
bun run init [opções]
```

## Sistema de Design

### Paleta de Cores
- **Primária**: Azul (#3b82f6) com variações em gradiente
- **Secundária**: Cinza ardósia (#64748b)
- **Destaque**: Ciano (#06b6d4)
- **Sucesso**: Verde (#10b981)
- **Aviso**: Âmbar (#f59e0b)
- **Erro**: Vermelho (#ef4444)

### Tipografia
- **Família**: Montserrat (cabeçalhos e corpo)
- **Pesos**: 300, 400, 500, 600, 700, 800
- **Escala**: Sistema harmonioso com alturas de linha adequadas

### Espaçamento
- **Grid**: Sistema de unidade base de 8px
- **Containers**: Largura máxima de 1400px com padding responsivo
- **Componentes**: Espaçamento consistente usando propriedades CSS customizadas

## Sistema de Busca

### Características
- **Engine**: Lunr.js 2.3.9 para busca full-text
- **Performance**: Índice otimizado gerado durante o build
- **Offline**: Funciona sem conexão com a internet
- **Relevância**: Sistema de pontuação por peso (títulos > excerpts > conteúdo)

### Uso
- **Atalho**: Ctrl/Cmd + K para focar
- **Navegação**: Setas ↑/↓ para navegar, Enter para abrir
- **Sintaxe**: Suporte a wildcards, busca exata com aspas
- **Highlight**: Destaque visual dos termos encontrados

## Experiência Mobile

- **Touch-Friendly**: Alvos de toque mínimos de 44px
- **Navegação Responsiva**: Sidebar colapsável
- **Tipografia Otimizada**: Legível em todos os tamanhos de tela
- **Interações Rápidas**: Otimizado para performance mobile

## ♿ Acessibilidade

- **Navegação por Teclado**: Suporte completo a teclado
- **Screen Readers**: HTML semântico e labels ARIA
- **Alto Contraste**: Suporte para modo de alto contraste
- **Movimento Reduzido**: Respeita preferências de movimento do usuário

## 🌙 Modo Escuro

- **Detecção Automática**: Detecta preferência do sistema
- **Toggle Manual**: Alternância manual com persistência
- **Transições Suaves**: Animações otimizadas
- **Visuais Aprimorados**: Design específico para modo escuro

## 🎯 Performance

- **Carregamento Rápido**: CSS e JavaScript otimizados
- **Animações Suaves**: Transições aceleradas por hardware
- **Imagens Responsivas**: Otimização automática de imagens
- **Bundle Mínimo**: Sem dependências desnecessárias

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga os padrões de código TypeScript
- Adicione testes para novas funcionalidades
- Atualize a documentação conforme necessário
- Mantenha commits atômicos e descritivos

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Construído com padrões web modernos
- Inspirado pelos melhores sites de documentação
- Projetado para a felicidade do desenvolvedor

---

**Construído com ❤️ pela [RiliGar](http://riligar.click/) e a comunidade open source.**

## 📞 Suporte

- 📧 Email: [suporte@riligar.click](mailto:suporte@riligar.click)
- 🐛 Issues: [GitHub Issues](https://github.com/riligar/knowledge/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/riligar/knowledge/discussions)
- 📖 Documentação: [knowledge.dev](https://knowledge.dev) 