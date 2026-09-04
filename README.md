# Mercado Artesanal

Vite and React single-page application for the Mercado Artesanal thesis project.

## Local setup

Prerequisites:

- Node.js 22 LTS (`>=22.13.0 <23`)
- npm 10 (`>=10.9.0 <11`); the repository declares npm 10.9.3

Create the local environment file and replace its placeholders with the public configuration for your environment:

```bash
cp .env.example .env
npm ci
npm run dev
```

All `VITE_*` variables are injected at build time and are visible in the browser bundle. See `.env.example` for required Auth0/API values and the optional Stripe setting.
