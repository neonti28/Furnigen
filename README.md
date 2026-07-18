# FurniGen Studio

AI-powered furniture design studio — generate production-ready furniture specs
(BOM, cost analysis, manufacturing guides) and catalog visuals from a short brief.

This is a clean, real-coder rewrite of the original AI Studio export. Same UI/UX
and behaviour, but with a standard, maintainable project structure.

## Tech stack

- **Vite 7** — dev server & bundler
- **React 19** + **TypeScript** — UI
- **Tailwind CSS 3** — styling (real build, with the original custom animations)
- **@google/genai** — Gemini text + image generation (optional)
- **Chart.js 4** — dashboard chart (bundled module, not a CDN global)
- **Babylon.js 7** — interactive 3D furniture viewer (offline, no image model)

## Project structure

```
furnigen-studio/For Hermes/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── main.tsx              # React entry
    ├── App.tsx               # Page router (state-driven)
    ├── index.css             # Tailwind directives + global styles
    ├── vite-env.d.ts
    ├── config/
    │   ├── env.ts            # Typed env config (VITE_GEMINI_API_KEY)
    │   └── .env.example
    ├── types/
    │   └── index.ts          # Shared domain types
    ├── services/
    │   ├── ai/
    │   │   ├── types.ts      # DesignService interface
    │   │   ├── geminiService.ts   # Real Gemini backend
    │   │   ├── mockService.ts     # Offline deterministic generator
    │   │   └── index.ts      # Factory: picks backend by env
    │   ├── pdfService.ts     # HTML → print/PDF catalog export
    │   ├── chartService.ts   # Chart.js component registration
    │   └── babylon/
    │       └── furnitureBuilder.ts  # DesignData → live 3D scene
    └── components/
        ├── Header.tsx, Footer.tsx
        ├── HomePage.tsx, DashboardPage.tsx, StudioPage.tsx, AboutPage.tsx
        ├── DesignResult.tsx, DesignHistoryCard.tsx
        ├── Modal.tsx, ImageModal.tsx
        └── BabylonViewer.tsx   # React wrapper around the 3D scene
```

## Getting started

```bash
npm install
npm run dev
```

### With / without an API key

- **No key** → the app uses a built-in offline generator so every screen
  (Studio form, history, detail modal, zoom viewer, PDF export) is fully
  interactive with zero network calls.
- **With key** → copy `.env.example` to `.env`, set `VITE_GEMINI_API_KEY`, and
  the Studio uses real Gemini text + Imagen image generation. Restart `dev`.

## 3D furniture viewer (new in this build)

Every generated design also gets an **interactive 3D model** in the "3D View" tab
of its detail panel. The structured `DesignData` (dimensions, material, colour,
furniture type) is parsed at runtime and rebuilt as a real, rotatable Babylon.js
scene — PBR-ish standard materials, studio lighting, and soft shadows. This runs
fully offline: no Gemini key or image model is required for the 3D view.

- Parse logic lives in `src/services/babylon/furnitureBuilder.ts`
  (`parseDimensions`, `resolveColor`, `buildFurnitureScene`).
- The React wrapper that mounts/disposes the canvas is `src/components/BabylonViewer.tsx`.

## Build

```bash
npm run build      # tsc --noEmit + vite build
npm run preview    # preview the production build
```
