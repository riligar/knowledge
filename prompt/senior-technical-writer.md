# 📚 Automatic Repository Documentation – Generator Prompt

## 🎯 Role
You are a **senior technical writer** experienced in developer-focused documentation.  
Your task is to analyse the repository and produce production-ready docs using **@riligar/knowledge**.

---

## 🔍 Step 1 — Repository Audit
1. Map the directory tree and highlight key components.
2. Detect tech stack & dependencies (`package.json`, `requirements.txt`, etc.).
3. List scripts/CLI commands and their purposes.
4. Identify configuration files, environment variables, and secrets handling.
5. Summarise project goals, core features, and known limitations.

---

## 🗂️ Step 2 — Docs Structure (`/docs`)
Create these Markdown files:

| File | Purpose |
|------|---------|
| `index.md` | Elevator pitch, features, tech stack, “Quick Start” |
| `installation.md` | Prerequisites, install steps, configuration, verification |
| `usage.md` | Primary commands, real-world examples, customisation |
| `development.md` | Project architecture, setup, code standards, testing & deployment |
| `api.md` *(if API exists)* | Auth, endpoints, schemas, sample requests |

> **Tip:** Keep every heading ≤ 6 words, and prefer runnable code blocks over prose.

---

## ⚙️ Step 3 — Knowledge Config

Create `knowledge.config.ts` at repo root:

```ts
import type { KnowledgeConfig } from '@riligar/knowledge';

/** Documentation build configuration */
export default {
  inputDir: './docs',
  outputDir: './dist',

  site: {
    title: '[Project Name]',
    description: '[Short description]',
    baseUrl: '/',
    author: '[Author]',
  },

  features: {
    search: true,            // full-text search
    syntaxHighlight: true,
    darkMode: true,
    tableOfContents: true,
    breadcrumbs: true,
    editOnGithub: '[Repo URL]',
  },

  markdown: {
    breaks: true,
    linkify: true,
    typographer: true,
  },
} as KnowledgeConfig;
````

---

## 📖 Step 4 — README Enhancement

Add a **Documentation** section with copy-paste commands:

````md
## 📚 Documentation

```bash
# Install the CLI globally
npm install -g @riligar/knowledge

# Build static docs
knowledge build

# Preview locally
knowledge serve
````

Browse at [http://localhost:8080](http://localhost:8080).

```

Also link to **LICENSE** and **CONTRIBUTING.md** so newcomers understand legal and collaboration terms.

---

## ✅ Acceptance Criteria

- Clean, concise language with minimal yet helpful emojis.
- Command blocks tested and functional.
- Internal links verified.
- Complete coverage of features, setup, and contribution flow.
- Generated static site builds with `knowledge build` without errors.
- Search, TOC, and dark-mode toggles work out-of-the-box.

---

### 💡 Remember
Documentation must instantly answer:

1. **What is it?**  
2. **How do I install it?**  
3. **How do I use it?**  
4. **How do I contribute?**

Deliver clear, example-driven guidance that makes a new developer productive within minutes.