# FUTURO BRASILEIRO — v4

Projeto escolar em React + Vite, responsivo e preparado para GitHub Pages.

## O que mudou nesta versão

- Cores de partido aplicadas automaticamente aos cards e perfis.
- Cores do partido podem ser alteradas pelo Admin.
- Fundo do perfil pode ser trocado pelo Admin.
- Propostas agora funcionam como acordeões: o visitante clica em cada seção para abrir o detalhamento.
- O Admin pode editar título, resumo, detalhamento e fonte de cada proposta, além de adicionar novas propostas.
- Configuração de fundos globais em `src/App.jsx`.
- Mais conteúdo de conscientização sobre voto.
- Página Sobre o Voto ampliada com artigos educativos.
- Página História ampliada com fatos históricos e links para fontes oficiais.
- Layout com tons azulados e fundos configuráveis para reduzir o excesso de preto.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173/`.

## Admin

Acesse `/admin`.

Senha de demonstração: `admin123`

As alterações deste MVP ficam no `localStorage` do navegador.

## Personalizar fundos

Coloque imagens em `public/backgrounds/` e altere `siteTheme` no começo de `src/App.jsx`:

```js
export const siteTheme = {
  heroBackground: "/backgrounds/hero.jpg",
  awarenessBackground: "/backgrounds/awareness.jpg",
  historyBackground: "/backgrounds/history.jpg",
  pageBackground: "/backgrounds/page.jpg",
  profileBackground: "/backgrounds/profile.jpg",
  backgroundOpacity: 0.72
};
```

## Cores dos partidos

A configuração fica em `PARTY_THEMES` no começo de `src/App.jsx`. Também é possível definir as cores individualmente pelo Admin.

## GitHub Pages

O projeto já possui workflow em `.github/workflows/deploy.yml` para publicação pelo GitHub Pages.
