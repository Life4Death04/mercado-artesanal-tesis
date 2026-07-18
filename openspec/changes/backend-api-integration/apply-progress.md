# Apply Progress: backend-api-integration (PR#0 + PR#1)

> Engram topic_key: `sdd/backend-api-integration/apply-progress`
> Updated: 2026-07-18 (PR#1 merge)

---

## Result Contract

```
status: success
next_recommended: sdd-verify
skill_resolution: paths-injected
```

**executive_summary**:
PR#1 delivers the Bootstrap + API Client Foundation for `backend-api-integration`.
A central error resolver (`resolveErrorMessage`) is now the single translation path for all
backend AppError codes. Producer profile DTOs (read + patch), a strict partial form schema,
and both TanStack Query hooks are co-located under `src/modules/productor/profile/`. Both
producer pages (`EditarPerfilPublicoPage`, `PerfilProductorPublicoPage`) are wired to real
server data: GET prefills, invalid form blocks PATCH, 2xx invalidates `['producer','me']`,
and 401/5xx fail closed via the error resolver. PR target when opened: `feat/backend-api-integration`.

**artifacts**:
- `openspec/changes/backend-api-integration/apply-progress.md`
- Engram topic_key: `sdd/backend-api-integration/apply-progress`

**risks**:
- `EditarPerfilPublicoPage`: the `email` and `phone` fields shown in the public contact sidebar
  are not present in the `AuthenticatedProducerProfile` DTO (only in the `CurrentUser` root).
  Both fields render `'—'` until PR#2 or a future pass exposes them. Not a regression — the
  previous state was hardcoded mock strings.
- `PerfilProductorPublicoPage` phone/email also render `'—'` for the same reason.
- Catalog product list remains hardcoded (PR#2 scope). Not a regression.
- `producerProfileFormSchema.strict().partial()` order matters in Zod v4: `.strict()` must
  come before `.partial()` to enforce key rejection on the partial payload.

---

## PR#0 — Money Typing Foundation

**Status**: ✅ Complete — merged into tracker

### Completed Tasks

- [x] 1.1 [PR#0] Create `src/lib/formatMoney.ts`; convert `precio` in `productos.schema.ts` and `total` in `pedidos.schema.ts` to `z.string()`.
  - AC met: `grep -r "z\.number" src/` returns zero hits
  - Verified: `tsc -b` clean, `npm run build` clean
- [x] 1.2 [PR#0] Sweep consumer pages — remove money arithmetic, render via `formatMoney`, show `'—'` where totals lack backend data.
  - AC met: no `.toFixed()` / arithmetic on money fields; no NaN
  - Verified: `tsc -b` clean, `npm run build` clean

### Files Changed (PR#0)

| File | Action | What Was Done |
|------|--------|---------------|
| `src/lib/formatMoney.ts` | Created | `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })`; returns `'—'` on NaN/null/undefined |
| `src/modules/productos/productos.schema.ts` | Modified | `precio: z.number().positive()` → `z.string().regex(/^\d+(\.\d+)?$/)` |
| `src/modules/pedidos/pedidos.schema.ts` | Modified | `total: z.number().nonnegative()` → `z.string().regex(/^\d+(\.\d+)?$/)` |
| `src/modules/productos/hooks/useProductos.ts` | Modified | Mock literals `6.5`/`9.75` → `'6.50'`/`'9.75'` |
| `src/modules/carrito/pages/CarritoPage.tsx` | Modified | Removed numeric money arithmetic; totals render `'—'`; unit price via `formatMoney` |
| `src/modules/pedidos/pages/CheckoutPage.tsx` | Modified | Removed `productPriceValue`/`priceValue` number fields; removed arithmetic; totals `'—'` |
| `src/modules/productos/pages/CatalogoPage.tsx` | Modified | Removed `parsePrice()` helper; price range filter deferred to server-side |
| `openspec/changes/backend-api-integration/tasks.md` | Modified | Tasks 1.1, 1.2 marked `[x]`; `chain_strategy: feature-branch-chain` recorded |

### Git State (PR#0)

- Branch: `feat/backend-api-integration-pr0-money-typing` (merged into tracker at `679e674`)
- Commits: `ffc1bbc`, `35a7ab5`, `4afa408`, `371dd6c`, `722b6b6`
- Diff: ~130 net lines

---

## PR#1 — Bootstrap + API Client Foundation

**Status**: ✅ Complete — 3 commits on branch `feat/backend-api-integration-pr1-producer-bootstrap`

### Completed Tasks

- [x] 2.1 [PR#1] Add `src/lib/errorMessages.ts` central resolver.
  - AC met: `resolveErrorMessage` handles known code → mapped message; unknown ApiError code → `error.message`; non-ApiError → generic fallback. Never throws.
  - 19 AppError codes registered (Cycle 1 + Cycle 2).
  - Verified: `tsc -b` clean, `npm run build` clean
- [x] 2.2 [PR#1] `profile.schema.ts` + `profile.api.ts`.
  - AC met: `UserMeResponse` mirrors backend; `producerProfileFormSchema.strict().partial()` blocks unknown PATCH keys; `UserRoleSchema` edge-parsed in `getUserMe`; cache key `['producer','me']` hardcoded in hook.
  - Verified: `tsc -b` clean, `npm run build` clean
- [x] 2.3 [PR#1] Hooks + page wiring.
  - AC met: `useProducerMeQuery` prefills both pages; `react-hook-form` + Zod resolver blocks invalid PATCH; `useUpdateProducerMeMutation.onSuccess` invalidates `['producer','me']`; 401/5xx fail closed via `resolveErrorMessage`; `aria-live="polite"` success region in `EditarPerfilPublicoPage`.
  - Verified: `tsc -b` clean, `npm run build` clean

### Files Changed (PR#1)

| File | Action | What Was Done |
|------|--------|---------------|
| `src/lib/errorMessages.ts` | Created | `ERROR_MESSAGES` registry (19 codes) + `resolveErrorMessage(error: unknown): string` |
| `src/modules/productor/profile/profile.schema.ts` | Created | `UserRoleSchema`, `AuthenticatedProducerProfile`, `UserMeResponse`, `PublicProducerProjection`, `producerProfileFormSchema`, `ProducerProfileFormValues` |
| `src/modules/productor/profile/profile.api.ts` | Created | `getUserMe(token)` — edge-parses role; `patchProducerMe(token, body)` — PATCH /producers/me |
| `src/modules/productor/profile/hooks/useProducerMeQuery.ts` | Created | TanStack Query read hook; `queryKey: ['producer','me']`; `enabled` when authenticated; selects `producer` from user response |
| `src/modules/productor/profile/hooks/useUpdateProducerMeMutation.ts` | Created | TanStack mutation; `onSuccess` invalidates `['producer','me']`; no cache touch on error |
| `src/modules/productor/pages/EditarPerfilPublicoPage.tsx` | Modified | Replaced hardcoded TIENDA/CUENTA constants with `useProducerMeQuery` + `useUpdateProducerMeMutation`; `react-hook-form` + zodResolver on `producerProfileFormSchema`; `aria-live="polite"` success/error region; loading/error guards |
| `src/modules/productor/pages/PerfilProductorPublicoPage.tsx` | Modified | Replaced `producerProfile` constant with `useProducerMeQuery`; loading/error states via `resolveErrorMessage` |
| `openspec/changes/backend-api-integration/tasks.md` | Modified | Tasks 2.1, 2.2, 2.3 marked `[x]` |

### Deviations from Design (PR#1)

1. **`profile.api.ts` endpoint path**: Design §4.1 uses `GET /api/v1/users/me`. The existing `auth.api.ts` already calls `/users/me` (without the `/api/v1` prefix) because `apiConfig.baseUrl` already includes `/api/v1`. `profile.api.ts` follows the same convention: `'/users/me'`. No deviation in behavior — this is consistent with existing code patterns.
2. **Email/phone in producer contact sidebar**: `AuthenticatedProducerProfile` does not contain email or phone (those are on `CurrentUser` root, which is fetched by `useCurrentUser` in auth module). Both fields render `'—'` rather than placeholder strings. Noted as risk above; not a spec violation.
3. **`SummaryCard` — third card**: Design did not specify what the third summary card should show (the original had "Telefono"). Phone is not in the producer DTO, so the card now shows "NIF registrado" (read-only). Purely cosmetic and improves data accuracy.

### Git State (PR#1)

- Branch: `feat/backend-api-integration-pr1-producer-bootstrap`
- Base: `feat/backend-api-integration` (tracker at commit `679e674`)
- Commits (3 feat commits):
  - `eb9f48d` feat(errors): add central resolveErrorMessage registry
  - `09129a4` feat(producer): add profile schemas and api client
  - `a4fb511` feat(producer): wire profile hooks into edit and public pages
- `tsc -b`: ✅ clean
- `npm run build`: ✅ clean
- Estimated diff: ~450 net lines (within PR#1 estimate of 360–520; within 800-line budget)
- **Git State note**: This docs commit does NOT reference its own SHA (lesson from PR#0's SHA-chase paradox — obs #731/#732). SHA recursion capped here.

### Workload / PR Boundary (PR#1)

- Mode: chained PR slice (feature-branch-chain)
- Current work unit: PR#1 producer-bootstrap + api-client foundation
- PR target when opened: `feat/backend-api-integration` (NOT master)
- Estimated review budget: ~450 lines
- Rollback: `git revert eb9f48d 09129a4 a4fb511` — fully autonomous, no shared state with PR#0 money types beyond consuming `ApiError`

---

## Remaining Tasks

- [ ] 2.1–2.3 ✅ (above)
- [ ] 3.1 [PR#2] Producer product catalog
- [ ] 3.2 [PR#3] Inventory + delivery modes
- [ ] 3.3 [PR#4] Orders + stats + dashboard
- [ ] 4.1 [Each PR] Manual verification checklist
