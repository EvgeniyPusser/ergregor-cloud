# Egregor Cloud MVP

Static prototype for the first public nucleus of Egregor Cloud.

## What is included

- `index.html` - landing page with manifesto, seed library, lab, and join flow
- `styles.css` - visual language for the first public portal
- `models.js` - seed data based on the current project folders
- `app.js` - client-side filtering for the model library
- `supabase.config.js` - optional cloud connection settings

## Local launch

Run:

```bash
npm run dev
```

Then open `http://127.0.0.1:4173`.

## Why static first

This version is intentionally simple:

- zero backend required for the first demo
- cheap to host on almost any provider
- easy to move later to Cloudflare Pages, Hostinger, or a framework app
- gives a public face for outreach before the full cloud exists

## Auto deploy from GitHub

Recommended hosting: `Cloudflare Pages`.

Use these settings:

- Repository: `EvgeniyPusser/ergregor-cloud`
- Branch: `main`
- Framework preset: `None`
- Build command: leave empty
- Output directory: `.`

After that, every push to `main` deploys automatically.

## Recommended next steps

1. Add real images and links to source documents.
2. Keep filling Supabase with real models and thoughts.
3. Add a model detail page for each seed object.
4. Add roles, access levels, and contribution history.
5. Introduce payments only after trust and attention exist.

## Thermal calculator

Choose **Thermal calculator** inside Buildings (or the buttons on Heat & tests). It opens the live calculator published by GitHub Pages from `living-things-sim`:
- Russian: https://evgeniypusser.github.io/living-things-sim/calc/stend.html
- English: https://evgeniypusser.github.io/living-things-sim/calc/bench.html

Source: https://github.com/EvgeniyPusser/living-things-sim (`calc/`). Every push to its `main` branch updates the published calculator within a minute or two, so the portal always shows the latest one. Needs an internet connection. The research project's Python experiments are not run by the website.

## Living Building Assembly (3D)

Choose **Living Building** inside Buildings. It opens the live version published by GitHub Pages: https://evgeniypusser.github.io/living-building-assembly/

Source: https://github.com/EvgeniyPusser/living-building-assembly. Every push to its `main` branch updates the published version within a minute or two, so the portal always shows the latest one. Needs an internet connection.
