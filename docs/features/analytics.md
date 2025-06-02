# Analytics

O Knowledge suporta a integração de scripts de analytics para monitorar o uso do seu site de documentação.

## Configuração

Para adicionar analytics ao seu site, configure o campo `analytics` no seu arquivo `knowledge.config.ts`:

```typescript
export default {
    // ... outras configurações

    analytics: {
        script: '<script defer src="https://analytics.riligar.click/script.js" data-website-id="cf3b194d-2130-4120-a6b0-686a8340cb24"></script>'
    },

    // ... outras configurações
} as KnowledgeConfig;
```

## Exemplos de Uso

### Umami Analytics

```typescript
analytics: {
    script: '<script defer src="https://analytics.riligar.click/script.js" data-website-id="cf3b194d-2130-4120-a6b0-686a8340cb24"></script>'
}
```

### Google Analytics 4

```typescript
analytics: {
    script: `
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID');
        </script>
    `
}
```

### Plausible Analytics

```typescript
analytics: {
    script: '<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>'
}
```

## Como Funciona

O script configurado no campo `analytics.script` será inserido automaticamente no `<head>` de todas as páginas geradas pelo Knowledge. Isso garante que o código de analytics seja carregado em todas as páginas do seu site de documentação.

## Considerações de Privacidade

Ao implementar analytics, considere:

1. **Conformidade com LGPD/GDPR**: Certifique-se de que sua solução de analytics está em conformidade com as leis de proteção de dados
2. **Transparência**: Informe aos usuários sobre o uso de analytics em sua política de privacidade
3. **Analytics Privacy-Friendly**: Considere usar soluções como Plausible ou Umami que são mais respeitosas à privacidade

## Desabilitando Analytics

Para desabilitar analytics, simplesmente remova ou comente o campo `analytics` do seu arquivo de configuração:

```typescript
export default {
    // ... outras configurações

    // analytics: {
    //     script: '...'
    // },

    // ... outras configurações
} as KnowledgeConfig;
``` 