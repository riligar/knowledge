# 🚀 Guia para o Primeiro Release

Este guia te ajudará a configurar e executar o primeiro release automatizado do Knowledge usando semantic-release.

## ✅ Pré-requisitos

- [x] Semantic-release configurado (já feito!)
- [x] Workflow do GitHub Actions criado (já feito!)
- [x] Commit seguindo conventional commits (já feito!)
- [ ] NPM Token configurado
- [ ] GitHub Secrets configurados

## 🔑 Passo 1: Criar NPM Token

1. **Acesse**: https://www.npmjs.com/settings/tokens
2. **Faça login** na sua conta NPM
3. **Clique em**: "Generate New Token"
4. **Escolha**: "Automation" (para CI/CD)
5. **Copie o token** gerado (algo como: `npm_xxxxxxxxxxxxxxxxxxxx`)

## 🔐 Passo 2: Configurar GitHub Secrets

1. **Acesse**: https://github.com/riligar/knowledge/settings/secrets/actions
2. **Clique em**: "New repository secret"
3. **Adicione**:
   - **Name**: `NPM_TOKEN`
   - **Secret**: Cole o token do NPM que você criou
4. **Clique em**: "Add secret"

> **Nota**: O `GITHUB_TOKEN` já existe automaticamente no GitHub Actions.

## 🚀 Passo 3: Disparar o Primeiro Release

Agora que tudo está configurado, vamos fazer o push para disparar o release:

```bash
# Fazer push para a branch prod (vai disparar o workflow)
git push origin prod
```

## 📊 Passo 4: Acompanhar o Release

1. **Acesse**: https://github.com/riligar/knowledge/actions
2. **Clique na action**: "Release"
3. **Acompanhe o progresso** do workflow

## 🎉 O que vai acontecer:

1. **Análise dos commits**: Semantic-release vai analisar os commits desde a última release
2. **Determinação da versão**: Com base nos commits `feat:`, `fix:`, etc.
3. **Geração do changelog**: Automático baseado nos commits
4. **Build do projeto**: Executar `bun run build-bin` e `bun run prepare-npm`
5. **Publicação no NPM**: Upload automático do pacote
6. **Criação do GitHub Release**: Com notas de versão
7. **Commit automático**: Atualização do `package.json` e `CHANGELOG.md`

## 🔍 Verificar o Resultado

Após o workflow completar:

1. **NPM**: https://www.npmjs.com/package/@riligar/knowledge
2. **GitHub Releases**: https://github.com/riligar/knowledge/releases
3. **Changelog**: Arquivo `CHANGELOG.md` criado automaticamente

## 🐛 Troubleshooting

### Erro: "No npm token specified"
- Verifique se o `NPM_TOKEN` está configurado corretamente nos GitHub Secrets
- O token deve ter permissão de "Automation"

### Erro: "No GitHub token specified"
- O `GITHUB_TOKEN` é automático, mas verifique as permissões do workflow
- Certifique-se que o workflow tem permissão de `contents: write`

### Erro: "No release published"
- Verifique se os commits seguem a convenção (feat:, fix:, etc.)
- Commits como `docs:`, `chore:` não geram releases

## 📝 Próximos Releases

Para releases futuros, simplesmente:

1. **Faça commits** seguindo a convenção:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   ```

2. **Push para prod**:
   ```bash
   git push origin prod
   ```

3. **Release automático** será criado! 🎉

## 🎯 Tipos de Release

- **Patch** (1.0.1): `fix:` - Correções de bugs
- **Minor** (1.1.0): `feat:` - Novas funcionalidades
- **Major** (2.0.0): `feat!:` ou `BREAKING CHANGE:` - Mudanças que quebram compatibilidade

---

**🎉 Parabéns! Você está pronto para fazer releases automatizados!** 