# Apply Progress: backend-api-integration PR#0 (Money Typing Foundation)

> Engram topic_key: `sdd/backend-api-integration/apply-progress` (obs #726)
> Updated: 2026-07-18

---

## Result Contract

```
status: success
next_recommended: sdd-verify
skill_resolution: paths-injected
```

**executive_summary**:
PR#0 establishes the money-typing foundation for `backend-api-integration`. All `z.number()` money fields
(`precio`, `total`) were converted to `z.string()` with decimal-regex validation. A `formatMoney` helper
using `Intl.NumberFormat` was added and wired into every consumer page that previously performed numeric
arithmetic on money values. Line totals that require server-computed data now render `'—'` per spec R2.
The branch `feat/backend-api-integration-pr0-money-typing` contains 4 commits targeting the tracker branch.

**artifacts**:
- `openspec/changes/backend-api-integration/apply-progress.md` (this file)
- Engram topic_key: `sdd/backend-api-integration/apply-progress`

**risks**:
- None material for PR#0. Future PRs must not re-introduce `z.number()` for money fields (`precio`, `total`).
  The `formatMoney` helper is the single display path — do not add parallel formatting utilities.

---

**Status**: ✅ Phase 1 complete — ready for sdd-verify

## Completed Tasks

- [x] 1.1 [PR#0] Create `src/lib/formatMoney.ts`; convert `precio` in `productos.schema.ts` and `total` in `pedidos.schema.ts` to `z.string()`.
  - AC met: `grep -r "z\.number" src/` returns zero hits
  - Verified: `tsc -b` clean, `npm run build` clean
- [x] 1.2 [PR#0] Sweep consumer pages — remove money arithmetic, render via `formatMoney`, show `'—'` where totals lack backend data.
  - AC met: no `.toFixed()` / arithmetic on money fields; no NaN
  - Verified: `tsc -b` clean, `npm run build` clean

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `src/lib/formatMoney.ts` | Created | `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`; returns `'—'` on NaN/null/undefined |
| `src/modules/productos/productos.schema.ts` | Modified | `precio: z.number().positive()` → `z.string().regex(/^\d+(\.\d+)?$/)` |
| `src/modules/pedidos/pedidos.schema.ts` | Modified | `total: z.number().nonnegative()` → `z.string().regex(/^\d+(\.\d+)?$/)` |
| `src/modules/productos/hooks/useProductos.ts` | Modified | Mock literals `6.5`/`9.75` → `'6.50'`/`'9.75'` |
| `src/modules/carrito/pages/CarritoPage.tsx` | Modified | Removed `unitPriceValue: number`; removed `productSubtotal`/`groupSubtotal` reduces; removed `formatPrice`; totals render `'—'`; unit price via `formatMoney(item.unitPriceDecimal)` |
| `src/modules/pedidos/pages/CheckoutPage.tsx` | Modified | Removed `productPriceValue`/`priceValue` number fields; removed arithmetic; `OrderSummaryPanel` totals all `'—'` |
| `src/modules/productos/pages/CatalogoPage.tsx` | Modified | Removed `parsePrice()` helper; price range filter deferred to server-side |
| `openspec/changes/backend-api-integration/tasks.md` | Modified | Tasks 1.1, 1.2 marked `[x]`; `chain_strategy: feature-branch-chain` recorded |

## Deviations from Design

1. **`CheckoutPage.tsx`** was not in design §5 file list for PR#0, but contained `productPriceValue: number` and `priceValue: number` with arithmetic. Included in sweep — AC requires zero money arithmetic anywhere.
2. **`CatalogoPage.tsx`** had `parsePrice()` calling `Number()` on display-format price strings. Removed; price range filter now deferred to server-side query (passes all products in hardcoded mode).
3. **`CarritoPage.tsx`** — `formatMoney` used for unit price display only. Line totals = `'—'` (backend-computed per spec R2).

## Git State

- Branch: `feat/backend-api-integration-pr0-money-typing`
- Base: `feat/backend-api-integration` (tracker)
- Commits (4 total):
  - `ffc1bbc` feat(money): add formatMoney helper and convert price schemas to string
  - `35a7ab5` feat(money): sweep consumer pages — remove money arithmetic, render via formatMoney
  - `4afa408` docs(sdd): add PR#0 apply-progress artifact
  - `371dd6c` docs(sdd): refine PR#0 apply-progress artifact with Result Contract and updated git state
- Diff: ~130 net lines (within 180-260 estimate; under 400-line budget)
- `tsc -b`: ✅ clean
- `npm run build`: ✅ clean

## Workload / PR Boundary

- Mode: chained PR slice (feature-branch-chain)
- Current work unit: PR#0 money-typing foundation
- PR target when opened: `feat/backend-api-integration` (NOT master)
- Estimated review budget: ~130 lines

## Manual Verification Checklist (PR#0)

- [ ] CarritoPage renders without NaN in any money slot
- [ ] CartItem unit price shows formatted EUR string (e.g. "18,50 €")
- [ ] Cart group subtotal, order summary subtotal, and total all show "—"
- [ ] CheckoutPage order summary subtotal / shipping / total all show "—"
- [ ] `tsc -b` passes
- [ ] `npm run build` passes
- [ ] `grep -r "z\.number" src/` returns zero hits

## Remaining Tasks

- [ ] 2.1 [PR#1] Add `src/lib/errorMessages.ts`
- [ ] 2.2 [PR#1] Producer profile schema + API client
- [ ] 2.3 [PR#1] Hooks + wire EditarPerfilPublicoPage + PerfilProductorPublicoPage
- [ ] 3.1–3.3 [PR#2–PR#4] Producer domain slices
- [ ] 4.1 [Each PR] Manual verification checklist
