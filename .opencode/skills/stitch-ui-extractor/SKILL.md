---
name: stitch-ui-extractor
description: "Trigger: Stitch, ReferenciasUI, code.html, screen.png, extraer componentes. Analyze Stitch HTML/images and map designs to React modules."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Stitch UI Extractor

## Activation Contract

Use this skill when the user provides Stitch-generated HTML, rendered screenshots, or files under `ReferenciasUI/<screen-name>/` and wants component extraction before implementation.

## Hard Rules

- Inspect both `code.html` and `screen.png` when available; HTML provides structure and tokens, image provides final visual truth.
- Treat Stitch output as reference material, not production code. Do not copy CDN scripts, inline Tailwind config, Material Symbols links, or browser-only scripts directly.
- Preserve the visual direction, spacing rhythm, typography hierarchy, color palette, and responsive behavior from the rendered image.
- Build React with project conventions: TypeScript, Tailwind CSS, `src/modules/<dominio>/pages`, module-local `componentes`, and shared `src/componentes` only for reusable UI.
- Keep data hardcoded unless the user explicitly requests backend wiring. React Query hooks may return mocks.
- Prefer `lucide-react` icons over external icon font dependencies.
- After the user confirms the extraction, use the React 19 component rules and frontend design guidance before implementing.
- Respect role inheritance: productor can reuse consumidor UI where appropriate; administrador UI should stay isolated unless a component is truly shared.

## Decision Gates

| Finding | Action |
| --- | --- |
| Header, footer, buttons, cards appear reusable across roles | Place in `src/componentes` |
| Component belongs only to one domain screen | Place in `src/modules/<dominio>/componentes` |
| Screen is a route/view | Place in `src/modules/<dominio>/pages` |
| Stitch contains design tokens | Convert to Tailwind classes or CSS variables in `src/index.css` only when broadly reusable |
| Image and HTML disagree | Follow `screen.png` and mention the discrepancy |

## Execution Steps

1. Identify the reference folder, usually `ReferenciasUI/<screen-name>/`.
2. Read `code.html` for semantic regions, labels, tokens, breakpoints, and interaction hints.
3. Inspect `screen.png` for final composition, proportions, image treatment, whitespace, and visual hierarchy.
4. Produce an extraction report before coding: screen purpose, components detected, shared candidates, module-local components, route target, design tokens, mock data, and implementation notes.
5. Wait for user confirmation when the task is an extraction-only pass.
6. When the user confirms implementation, apply React 19 conventions: named imports, no unnecessary manual memoization, typed props, and small focused components.
7. After implementation, run `npm run build` and report any visual compromises or follow-up needs.

## Output Contract

Return the extraction in this format before implementation:

```txt
Pantalla:
Ruta sugerida:
Modulo destino:
Componentes compartidos:
Componentes del modulo:
Design tokens detectados:
Datos hardcodeados necesarios:
Notas de responsive/interaccion:
Archivos a crear/modificar:
```

## References

- `ReferenciasUI/` — source folders for Stitch HTML and rendered screenshots.
- `src/modules/` — module pages, hooks, schemas, and local components.
- `src/componentes/` — shared layout, UI, and form components.
