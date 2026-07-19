# Apply Progress: backend-api-integration (PR#0 + PR#1 + PR#2 + PR#2 corrective)

> Engram topic_key: `sdd/backend-api-integration/apply-progress`
> Updated: 2026-07-19 (PR#2 corrective run — RHF numeric fix + image hook)

---

## Result Contract

```yaml
status: success
next_recommended: sdd-verify
skill_resolution: paths-injected
```

**executive_summary**:
PR#2 corrective run fixes two CRITICAL gatekeeper findings from the first PR#2 apply run.
(1) Removed `as any` cast on `zodResolver` in `CatalogoProductorModals.tsx` by switching
numeric form fields from `z.number()` to `z.coerce.number()` and using RHF's
`useForm<InputType, unknown, OutputType>` input/output generics — Zod coerces DOM strings to
numbers at parse time, no valueAsNumber needed, `tsc -b` stays clean.
(2) Added `useUploadProductoImageMutation.ts` implementing the full two-step presign/confirm
S3 upload, and wired a functional `<input type="file">` into both `AgregarProductoModal` and
`EditarProductoModal`. The previous apply-progress claim that "the API and hook layer is
complete" for images was false — it is now truthful.

**artifacts**:
- `openspec/changes/backend-api-integration/apply-progress.md`
- `src/modules/productor/productos/hooks/useUploadProductoImageMutation.ts` (new)
- `src/modules/productor/productos/productos.schema.ts` (updated — coerce, input/output types)
- `src/modules/productor/componentes/CatalogoProductorModals.tsx` (updated — no as any, image wired)
- Engram topic_key: `sdd/backend-api-integration/apply-progress`

**risks**:
- Category filter in `ProductosProductorPage` currently shows `categoryId` (UUID) in the
  product card, not the category name. Categories are fetched in `useCategoriesQuery` but the
  join (map categoryId → name) in the filter selector is deferred to a follow-up PR.
  Not a spec violation for PR#2.
- Image upload is single-file only (first image uploaded always lands at `position: 0`).
  Multi-image ordering, drag-and-drop reordering, and an upload progress bar are deferred.
  These require additional UX scope beyond what this PR delivers. Documented in the hook source.
- `moderationStatus` badge shows `REPORTED` / `REMOVED` text — no admin action surface exists
  in Cycle 2 (spec invariant). These are display-only informational badges.

**git_state**:
- Branch: `feat/backend-api-integration-pr2-product-catalog`
- Base: `feat/backend-api-integration` (tracker at `1984e47`)
- All commits (previous run + corrective run):
  - `498fc5d` feat(producer): add product catalog schemas, api functions, and query/mutation hooks
  - `c54eb1f` feat(producer): wire product catalog page and modals to hooks — DTOs, mutations, error surfacing
  - `0c95a8c` docs(sdd): update apply-progress and tasks for PR#2 — product catalog complete
  - `4dc76c7` fix(producer): remove as any and correct RHF numeric field handling in catalog modals
  - `76b9a2b` feat(producer): add product image upload hook and wire single-file upload in modals
  - `f6a180f` docs(sdd): record PR#2 corrective run in apply-progress with full Result Contract
  - `25893e0` docs(sdd): fill corrective run commit SHA in apply-progress git_state
- `tsc -b`: ✅ clean
- `npm run build`: ✅ clean
- Diff stat vs `feat/backend-api-integration`: 13 files changed, 1535 insertions(+), 277 deletions(-)

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

**Status**: ✅ Complete — 5 commits on branch `feat/backend-api-integration-pr1-producer-bootstrap` (including 1 corrective fix)

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
- [x] R2 gate corrective — Refactor both profile hooks through `useAuthenticatedApi()`.
  - Gate: Automatic Mode Gatekeeper rejected for direct `getAccessTokenSilently` calls in profile hooks.
  - Fix: both hooks now call `useAuthenticatedApi()` and pass the `ApiCaller` to `profile.api.ts` functions.
  - `profile.api.ts` signatures updated: `(apiCaller: ApiCaller, ...)` instead of `(accessToken: string, ...)`.
  - Verified: `tsc -b` clean, `npm run build` clean

### Files Changed (PR#1, including corrective)

| File | Action | What Was Done |
|------|--------|---------------|
| `src/lib/errorMessages.ts` | Created | `ERROR_MESSAGES` registry (19 codes) + `resolveErrorMessage(error: unknown): string` |
| `src/modules/productor/profile/profile.schema.ts` | Created | `UserRoleSchema`, `AuthenticatedProducerProfile`, `UserMeResponse`, `PublicProducerProjection`, `producerProfileFormSchema`, `ProducerProfileFormValues` |
| `src/modules/productor/profile/profile.api.ts` | Created+Modified | `getUserMe(apiCaller)` — edge-parses role; `patchProducerMe(apiCaller, body)` — PATCH /producers/me; accepts `ApiCaller` (corrective: was `accessToken: string`) |
| `src/modules/productor/profile/hooks/useProducerMeQuery.ts` | Created+Modified | TanStack Query read hook; `queryKey: ['producer','me']`; `enabled` when authenticated; selects `producer`; corrective: routes through `useAuthenticatedApi()` |
| `src/modules/productor/profile/hooks/useUpdateProducerMeMutation.ts` | Created+Modified | TanStack mutation; `onSuccess` invalidates `['producer','me']`; no cache touch on error; corrective: `useAuth0` import fully removed |
| `src/modules/productor/pages/EditarPerfilPublicoPage.tsx` | Modified | Replaced hardcoded TIENDA/CUENTA constants with `useProducerMeQuery` + `useUpdateProducerMeMutation`; `react-hook-form` + zodResolver; `aria-live="polite"` success/error region |
| `src/modules/productor/pages/PerfilProductorPublicoPage.tsx` | Modified | Replaced `producerProfile` constant with `useProducerMeQuery`; loading/error states via `resolveErrorMessage` |
| `openspec/changes/backend-api-integration/tasks.md` | Modified | Tasks 2.1, 2.2, 2.3 marked `[x]` |

### Git State (PR#1 + corrective run)

- Branch: `feat/backend-api-integration-pr1-producer-bootstrap`
- Base: `feat/backend-api-integration` (tracker at commit `679e674`)
- Commits:
  - `eb9f48d` feat(errors): add central resolveErrorMessage registry
  - `09129a4` feat(producer): add profile schemas and api client
  - `a4fb511` feat(producer): wire profile hooks into edit and public pages
  - `c57b967` docs(sdd): update apply-progress for PR#1 — producer bootstrap complete
  - `f1232ca` refactor(producer): route profile hooks through useAuthenticatedApi per spec R2
  - `a2e541a` docs(sdd): record R2 corrective run in apply-progress
- `tsc -b`: ✅ clean
- `npm run build`: ✅ clean
- Estimated diff: ~475 lines total (original ~450 + corrective ~25)

### Workload / PR Boundary (PR#1)

- Mode: chained PR slice (feature-branch-chain)
- Current work unit: PR#1 producer-bootstrap + api-client foundation
- PR target when opened: `feat/backend-api-integration` (NOT master)
- Estimated review budget: ~475 lines
- Rollback: `git revert eb9f48d 09129a4 a4fb511 f1232ca` — fully autonomous

---

## Corrective Run — R2 Gate Failure Fix (PR#1)

**Gate**: Automatic Mode Gatekeeper rejected PR#1 for spec violation of R2.
**Fix commit**: `f1232ca` — `refactor(producer): route profile hooks through useAuthenticatedApi per spec R2`

---

## PR#2 — Product Catalog Domain

**Status**: ✅ Complete — 2 feat commits on branch `feat/backend-api-integration-pr2-product-catalog`

### Completed Tasks

- [x] 3.1 [PR#2] Wire product catalog under `src/modules/productor/productos/`.
  - AC met:
    - Hooks-only page imports: `ProductosProductorPage.tsx` imports only from `../productos/hooks/**` (zero direct `.api.ts` imports).
    - DTOs added: `ProductDTO`, `CategoryDTO`, `ProductImageDTO`, `ReportResponseDTO`, `PresignResponseDTO` in `productos.schema.ts`.
    - Money displayed via `formatMoney` — no arithmetic on price strings.
    - Errors surfaced via `resolveErrorMessage` in page (global banner) and modals (inline).
    - `ModerationStatusSchema` edge-parsed per product in `productos.api.ts#parseModerationStatus`.
    - Categories fetched via public `useCategoriesQuery` (no auth, per spec product-taxonomy).
    - All mutations route through `useAuthenticatedApi()` — R2 gate: zero `getAccessTokenSilently` in `src/modules/productor/productos/`.
  - Verified: `tsc -b` clean, `npm run build` clean

### Files Changed (PR#2)

| File | Action | What Was Done |
|------|--------|---------------|
| `src/modules/productor/productos/productos.schema.ts` | Created | `ModerationStatusSchema` (edge-parse), `ProductDTO`, `CategoryDTO`, `ProductImageDTO`, `ReportResponseDTO`, `PresignResponseDTO`, `createProductoFormSchema`, `updateProductoFormSchema`, `reportProductoFormSchema`, `presignImageFormSchema`, `confirmImageFormSchema` |
| `src/modules/productor/productos/productos.api.ts` | Created | `listProductos`, `createProducto`, `updateProducto`, `deleteProducto`, `reportProducto`, `presignProductoImage`, `confirmProductoImage` (all accept `ApiCaller`); `listCategorias` (public, plain `apiRequest`) |
| `src/modules/productor/productos/hooks/useProductosQuery.ts` | Created | TanStack Query list hook; `queryKey: ['producer','products','list']`; enabled when authenticated |
| `src/modules/productor/productos/hooks/useCreateProductoMutation.ts` | Created | POST mutation; invalidates list on 2xx |
| `src/modules/productor/productos/hooks/useUpdateProductoMutation.ts` | Created | PATCH mutation; invalidates list on 2xx |
| `src/modules/productor/productos/hooks/useDeleteProductoMutation.ts` | Created | DELETE mutation; invalidates list on 2xx |
| `src/modules/productor/productos/hooks/useReportProductoMutation.ts` | Created | POST report mutation; no list invalidation (moderation only) |
| `src/modules/productor/productos/hooks/useCategoriesQuery.ts` | Created | Public GET categories; `queryKey: ['categories']`; 5 min staleTime |
| `src/modules/productor/pages/ProductosProductorPage.tsx` | Modified | Replaced local `useState(productosIniciales)` with `useProductosQuery`; loading/error states; mutation handlers; `formatMoney` for price display; `resolveErrorMessage` for global error banner; modal props updated to `ProductDTO` |
| `src/modules/productor/componentes/CatalogoProductorModals.tsx` | Modified | All modal props updated from `ProductoCatalogo` to `ProductDTO`; `AgregarProductoModal` wired to `createMutation` + `react-hook-form` + Zod + `useCategoriesQuery`; `EditarProductoModal` wired to `updateMutation`; `EliminarProductoModal` / `AvisoStockModal` / `PublicacionProductoModal` accept `isPending` prop; loading spinners added to all action buttons |
| `openspec/changes/backend-api-integration/tasks.md` | Modified | Task 3.1 marked `[x]` |

### Deviations from Design (PR#2 original run)

1. **Category filter shows `categoryId` UUID**: The design did not specify that the page should resolve `categoryId` → `category.name` for filter labels. `useCategoriesQuery` fetches the taxonomy but the join (map categoryId → name) in the filter selector is deferred. Not a spec violation — the filter still works correctly by ID.
2. **Image upload UI (original run)**: The `AgregarProductoModal` showed a placeholder. **Fixed in corrective run** — see PR#2 corrective section below.
3. **`as any` cast on `zodResolver` (original run)**: Was identified as a bug masking RHF numeric field issues. **Fixed in corrective run** — see PR#2 corrective section below.

### Git State (PR#2 original run)

- Branch: `feat/backend-api-integration-pr2-product-catalog`
- Base: `feat/backend-api-integration` (tracker at `1984e47` — PR#1 merge)
- Commits:
  - `498fc5d` feat(producer): add product catalog schemas, api functions, and query/mutation hooks
  - `c54eb1f` feat(producer): wire product catalog page and modals to hooks — DTOs, mutations, error surfacing
- `tsc -b`: ✅ clean
- `npm run build`: ✅ clean
- Diff stat: 8 new files (544 insertions) + 3 modified files (513 insertions, 223 deletions)
- Net additions: ~834 lines (34 over 800-line soft target; reviewable since 223 are deletions of replaced code)

### Workload / PR Boundary (PR#2 original run)

- Mode: chained PR slice (feature-branch-chain)
- Current work unit: PR#2 product catalog — full domain (schema + api + hooks + page + modals)
- PR target when opened: `feat/backend-api-integration` (NOT master)
- Estimated review budget: ~834 net lines (544 new + 513 modified - 223 deleted) — original run only
- Budget note: 34 lines over 800-line soft cap. The overage is in modified files where 223 lines are deletions of replaced hardcoded data.
- Rollback (all PR#2 commits): `git revert 76b9a2b 4dc76c7 0c95a8c c54eb1f 498fc5d` — fully autonomous

### Manual Verification Checklist (PR#2 — task 4.1)

| Scenario | Page/Endpoint | Expected | Status |
|----------|--------------|----------|--------|
| Happy path: list products | `ProductosProductorPage` | Products load from `GET /producers/me/products`; price via `formatMoney` | ⬜ Pending smoke |
| Create product | `AgregarProductoModal` | Form validates; `POST /producers/me/products`; list refreshes | ⬜ Pending smoke |
| Edit product | `EditarProductoModal` | Form prefilled; `PATCH /producers/me/products/:id`; list refreshes | ⬜ Pending smoke |
| Delete product (no active orders) | `EliminarProductoModal` | `DELETE /producers/me/products/:id` → 204; removed from list | ⬜ Pending smoke |
| Delete product (active orders) | `EliminarProductoModal` | 409 `PRODUCT_HAS_ACTIVE_ORDERS` → error banner via `resolveErrorMessage` | ⬜ Pending smoke |
| Publish/unpublish | `PublicacionProductoModal` | `PATCH` with `isActive: true/false`; list refreshes | ⬜ Pending smoke |
| Publish without stock | `AvisoStockModal` | `PATCH` with `isActive: true`, `stock: 0`; shown as «Sin disponibilidad» | ⬜ Pending smoke |
| 401 session expired | Any mutation | Error banner: «Tu sesión ha expirado. Inicia sesión de nuevo para continuar.» | ⬜ Pending smoke |
| 5xx / offline | Any query or mutation | Error state rendered; no crash; `resolveErrorMessage` fallback | ⬜ Pending smoke |
| Report product | N/A (API ready, UI not exposed) | `POST /products/:id/report` via `useReportProductoMutation` | ⬜ API ready; smoke pending |
| Category selector loads | `AgregarProductoModal` | `GET /categories` populates selector without auth | ⬜ Pending smoke |
| `tsc -b` | — | ✅ clean | ✅ Done |
| `npm run build` | — | ✅ clean | ✅ Done |

---

## PR#2 Corrective Run — Gatekeeper FAIL Fix

**Gate result**: Fresh Gatekeeper FAIL on first PR#2 apply run.
**Retry**: Single allowed retry per Automatic Mode Gatekeeper protocol.

### Critical Findings Fixed

#### CRITICAL 1 — RHF numeric field bug hidden by `as any`

**Root cause**: Form schemas declared `stock`, `lowStockThreshold`, `weight` as `z.number()`.
`<input type="number">` sends a string from the DOM; RHF passes that string to Zod which rejects
it as a number. The `as any` cast suppressed the TypeScript error and masked the runtime failure.

**Fix (Option B — coerce)**: Switched all numeric form fields to `z.coerce.number().int().min(...)`.
Zod coerces the DOM string to a number at parse time.
Used `useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>` so RHF field state is
typed as strings (raw input) and `onSubmit` receives coerced numbers.
Removed ALL `as any` casts and `eslint-disable no-explicit-any` comments.
`tsc -b` clean after change.

**Files changed**:
- `src/modules/productor/productos/productos.schema.ts` — `z.coerce.number()` on all numeric form
  fields; exported `CreateProductoFormInput` and `UpdateProductoFormInput` (input side types)
- `src/modules/productor/componentes/CatalogoProductorModals.tsx` — removed `as any` on both
  `useForm` calls; updated `defaultValues.stock` to `'0'` / `String(producto.stock)` (string literal)
  to match input type; updated `UseMutationResult` generics from `any` to `unknown`

**Commit**: `4dc76c7`

#### CRITICAL 2 — Image hook layer missing despite apply-progress claiming it complete

**Root cause**: `productos.api.ts` had `presignProductoImage` and `confirmProductoImage` but no
corresponding React hook existed. `AgregarProductoModal` showed a static placeholder. The
apply-progress `risks` section called it "hooks/API layer is complete" — that was inaccurate.

**Fix**: Added `useUploadProductoImageMutation.ts` implementing the two-step flow:
1. POST presign → `{ uploadUrl, s3Key }`
2. PUT `uploadUrl` with raw bytes (no auth header — presigned URL is self-authenticating)
3. POST confirm → `ProductImageDTO`
Client-side guards: MIME type (jpeg/png/webp) and size (≤ 5 MB) validated before step 1.
On success: invalidates `['producer', 'products', 'list']`.

Wired a functional `<input type="file" accept="image/jpeg,image/png,image/webp">` into both
`AgregarProductoModal` and `EditarProductoModal`. Upload triggers after the product save
succeeds (uses the returned `productId`). Error from upload surfaces inline below the file picker.

**Deferred (documented in hook source and risks)**:
- Multi-image management and ordering (all images land at `position: 0`)
- Drag-and-drop reordering
- Upload progress bar / percentage indicator

**Files changed**:
- `src/modules/productor/productos/hooks/useUploadProductoImageMutation.ts` — new file (100 lines)
- `src/modules/productor/componentes/CatalogoProductorModals.tsx` — added image upload UI to both
  `AgregarProductoModal` and `EditarProductoModal`; imports `useUploadProductoImageMutation`

**Commit**: `76b9a2b`

### Verification Results (corrective run)

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `tsc -b` | ✅ clean — no output |
| Build | `npm run build` | ✅ clean — 2042 modules, built in 519ms |
| getAccessTokenSilently | `grep -r "getAccessTokenSilently" src/modules/productor/productos/` | ✅ zero hits |
| as any (code) | `grep -n "as any" CatalogoProductorModals.tsx` (excluding comments) | ✅ zero actual casts |
| as any in productos/ | `grep -rn "as any" src/modules/productor/productos/` (excluding comments) | ✅ zero actual casts |

### Git State (PR#2 — cumulative including corrective run)

- Branch: `feat/backend-api-integration-pr2-product-catalog`
- Base: `feat/backend-api-integration` (tracker at `1984e47`)
- All commits:
  - `498fc5d` feat(producer): add product catalog schemas, api functions, and query/mutation hooks
  - `c54eb1f` feat(producer): wire product catalog page and modals to hooks — DTOs, mutations, error surfacing
  - `0c95a8c` docs(sdd): update apply-progress and tasks for PR#2 — product catalog complete
  - `4dc76c7` fix(producer): remove as any and correct RHF numeric field handling in catalog modals
  - `76b9a2b` feat(producer): add product image upload hook and wire single-file upload in modals
  - `f6a180f` docs(sdd): record PR#2 corrective run in apply-progress with full Result Contract
  - `25893e0` docs(sdd): fill corrective run commit SHA in apply-progress git_state
- `tsc -b`: ✅ clean
- `npm run build`: ✅ clean
- Cumulative diff vs `feat/backend-api-integration`: 13 files changed, 1535 insertions(+), 277 deletions(-)

### Workload / PR Boundary (PR#2 corrective — cumulative)

- Mode: chained PR slice (feature-branch-chain) — corrective commits appended in-band
- PR target when opened: `feat/backend-api-integration` (NOT master)
- Cumulative diff: 1535 insertions(+), 277 deletions(-) across 13 files
- Budget note: The corrective run adds net lines beyond the original PR#2 (image hook + schema/modal
  refactor). This is a size:exception accepted by the gatekeeper retry protocol.
- Rollback (all PR#2 commits): `git revert 25893e0 f6a180f 76b9a2b 4dc76c7 0c95a8c c54eb1f 498fc5d` — autonomous

---

---

## PR#3 — Inventory + Delivery Modes

**Status**: ✅ Complete — 4 feat commits on branch `feat/backend-api-integration-pr3-inventory-delivery`

### Completed Tasks

- [x] 3.2 [PR#3] Wire inventory and delivery modes with namespaced hooks, delivery-mode enum parsing, and mutation invalidation.
  - AC met:
    - `useInventarioQuery` (cache key `['producer','inventory']`) and `useUpdateStockMutation` wired to `InventarioProductorPage`.
    - `useEntregasQuery` (cache key `['producer','delivery-modes']`) and `useUpdateEntregasMutation` wired to `ModalidadesEntregaPage`.
    - `DeliveryModeTypeSchema` edge-parsed in `entregas.api.ts` — unknown enum values fail closed (spec R6).
    - `AgregarPuntoModal` wired to RHF + `zodResolver(pickupPointFormSchema)` with input/output generics — no resolver casts (spec R5).
    - All mutations: failed mutations leave prior cache untouched (onError not touching cache — spec R4 / task AC).
    - All hooks route through `useAuthenticatedApi()` — zero `getAccessTokenSilently` in new modules (spec R2).
    - Errors surfaced via `resolveErrorMessage` in both pages — inline `aria-live` success/error regions.
  - Verified: `tsc -b` clean, `npm run build` clean
  - Verified: zero `getAccessTokenSilently` in `inventario/` and `entregas/`
  - Verified: zero `as any` in new modules and modified consumer files
  - Verified: zero `z.number()` for money-adjacent fields (none exist in inventory/delivery)

### Files Changed (PR#3)

| File | Action | What Was Done |
|------|--------|---------------|
| `src/modules/productor/inventario/inventario.schema.ts` | Created | `InventoryItemDTO`, `UpdateStockPayload`, `updateStockFormSchema` with `z.coerce.number()` for stock; input/output type split |
| `src/modules/productor/inventario/inventario.api.ts` | Created | `listInventario` (maps product list to inventory shape), `updateStock` (PATCH stock field only), `listCategoriasForInventory` (public) |
| `src/modules/productor/inventario/hooks/useInventarioQuery.ts` | Created | TanStack Query read hook; `queryKey: ['producer','inventory']`; enabled when authenticated |
| `src/modules/productor/inventario/hooks/useUpdateStockMutation.ts` | Created | PATCH mutation for stock update; `onSuccess` invalidates `['producer','inventory']`; cache untouched on error |
| `src/modules/productor/entregas/entregas.schema.ts` | Created | `DeliveryModeTypeSchema` (edge-parsed enum), `DeliveryModeDTO`, `UpdateDeliveryModePayload`, `deliveryModeFormSchema`, `pickupPointFormSchema` |
| `src/modules/productor/entregas/entregas.api.ts` | Created | `listEntregas` (edge-parses DeliveryModeType), `updateEntrega` (PATCH with decimal separator normalisation) |
| `src/modules/productor/entregas/hooks/useEntregasQuery.ts` | Created | TanStack Query read hook; `queryKey: ['producer','delivery-modes']`; enabled when authenticated |
| `src/modules/productor/entregas/hooks/useUpdateEntregasMutation.ts` | Created | PATCH mutation for delivery mode update; `onSuccess` invalidates `['producer','delivery-modes']`; cache untouched on error |
| `src/modules/productor/pages/InventarioProductorPage.tsx` | Modified | Replaced `useState(itemsIniciales)` with `useInventarioQuery` + `useUpdateStockMutation`; loading/error states; inline success feedback via `aria-live`; `resolveErrorMessage` on mutation error |
| `src/modules/productor/pages/ModalidadesEntregaPage.tsx` | Modified | Replaced local `useState(initialConfig)` with `useEntregasQuery` + `useUpdateEntregasMutation`; draft/save UX preserved; `mapDtosToConfig` maps PICKUP/SHIPPING_FLAT_RATE to display shapes; error/success banners |
| `src/modules/productor/componentes/ModalidadesEntregaModals.tsx` | Modified | `AgregarPuntoModal` wired to RHF + `zodResolver(pickupPointFormSchema)` with input/output generics and field-level error display; `EliminarPuntoModal` unchanged |
| `openspec/changes/backend-api-integration/tasks.md` | Modified | Task 3.2 marked `[x]` |

### Deviations from Design (PR#3)

1. **Backend delivery-modes endpoint shape**: The backend spec defines `DeliveryModeType: PICKUP | SHIPPING_FLAT_RATE` but the current page UI has 3 concepts (Entrega personal, Mensajería, Puntos de recogida). The `mapDtosToConfig` helper maps PICKUP to both "Entrega personal" and "Puntos de recogida" (first PICKUP → personal card; all PICKUPs → punto list). If the producer has no delivery modes configured (new producer), the page shows empty defaults rather than crashing.

2. **Pickup point add/remove is local-only (draft)**: Adding or removing a punto via the modals only updates local draft state. The backend's `/delivery-modes` endpoint doesn't expose a "create new delivery mode" endpoint in the current spec slice — so new PICKUP modes entered in the modal are held locally until a future PR adds the POST endpoint. The UX is preserved; persistence of NEW points requires backend route `POST /producers/me/delivery-modes` (not in current spec scope).

3. **Inventory image URL deferred**: `listInventario` maps `imageUrl: null` since the backend product list endpoint doesn't include pre-signed image URLs in the list response (image s3Key requires a separate presign step). The page displays a placeholder div instead of a broken `<img>`. This matches the original PR#2 single-image-at-position-0 approach. Deferred: add backend projection for primary image URL.

### Git State (PR#3)

- Branch: `feat/backend-api-integration-pr3-inventory-delivery`
- Base: `feat/backend-api-integration` (tracker at `1a5ad2a` — PR#2 merge)
- Commits:
  - `6f313d6` feat(producer): add inventory schemas, api client, and hooks
  - `6a5751b` feat(producer): add delivery-modes schemas, api client, and hooks
  - `1cccfd2` feat(producer): wire InventarioProductorPage to inventory hooks
  - `d3762a9` feat(producer): wire ModalidadesEntregaPage and modals to delivery hooks
- `tsc -b`: ✅ clean
- `npm run build`: ✅ clean

### Workload / PR Boundary (PR#3)

- Mode: chained PR slice (feature-branch-chain) — size:exception accepted by maintainer
- PR target when opened: `feat/backend-api-integration` (NOT master)
- Rollback: `git revert d3762a9 1cccfd2 6a5751b 6f313d6` — fully autonomous

### Manual Verification Checklist (PR#3 — task 4.1)

| Scenario | Page/Endpoint | Expected | Status |
|----------|--------------|----------|--------|
| Happy path: list inventory | `InventarioProductorPage` | Items load from `GET /producers/me/products`; summary cards count correctly | ⬜ Pending smoke |
| Edit stock: increment/decrement/type | `InventarioProductorPage` | Draft updates locally; spinner on Guardar | ⬜ Pending smoke |
| Save stock: success | `InventarioProductorPage` | `PATCH /producers/me/products/:id` with `{ stock }` → 200; "Stock actualizado" badge appears; list refreshes | ⬜ Pending smoke |
| Save stock: VALIDATION_FAILED | `InventarioProductorPage` | 422 → inline error via `resolveErrorMessage` | ⬜ Pending smoke |
| Save stock: 401 session expired | `InventarioProductorPage` | Inline error: «Tu sesión ha expirado. Inicia sesión de nuevo para continuar.» | ⬜ Pending smoke |
| Save stock: 5xx / offline | `InventarioProductorPage` | Inline error; prior cache untouched (list stays visible) | ⬜ Pending smoke |
| Load delivery modes | `ModalidadesEntregaPage` | Modes from `GET /producers/me/delivery-modes`; PICKUP/SHIPPING_FLAT_RATE mapped correctly | ⬜ Pending smoke |
| Edit delivery mode: toggle + save | `ModalidadesEntregaPage` | Draft updates; Guardar triggers `PATCH /producers/me/delivery-modes/:id`; success banner | ⬜ Pending smoke |
| Save delivery: 401 | `ModalidadesEntregaPage` | Error banner via `resolveErrorMessage`; prior cache kept | ⬜ Pending smoke |
| Save delivery: 5xx / offline | `ModalidadesEntregaPage` | Error banner; no crash | ⬜ Pending smoke |
| Add pickup point: valid form | `AgregarPuntoModal` | Zod validates; point added to draft list | ⬜ Pending smoke |
| Add pickup point: invalid postal code | `AgregarPuntoModal` | Field error "El código postal debe tener 5 dígitos."; form blocked | ⬜ Pending smoke |
| Filter inventory: stock bajo / agotados | `InventarioProductorPage` | Filter buttons narrow list correctly | ⬜ Pending smoke |
| Search inventory | `InventarioProductorPage` | Search by name or categoryName narrows list | ⬜ Pending smoke |
| `tsc -b` | — | ✅ clean | ✅ Done |
| `npm run build` | — | ✅ clean | ✅ Done |

---

## Remaining Tasks

- [ ] 3.3 [PR#4] Orders + stats + dashboard
- [ ] 4.1 [Each PR] Manual verification checklist (smoke pending before PR open)
