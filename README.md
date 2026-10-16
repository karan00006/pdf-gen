# Paperwork Invoice Generator

A React-based invoice builder with a live preview and PDF download.

## Run locally

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
```

## Deploy

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds the
static client and deploys it to GitHub Pages whenever changes are pushed to
`main`. The Vite base path is configured for this repository's Pages URL:

<https://karan00006.github.io/pdf-gen/>

In the repository settings, set **Pages → Build and deployment → Source** to
**GitHub Actions**.
