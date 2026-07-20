# Tasks: Backend API Integration (Cycle 2 — Producer Environment)

## Phase 1: Money Typing Foundation
- [x] 1.1 [PR#0] Create `src/lib/formatMoney.ts`; switch `src/modules/productos/productos.schema.ts` + `src/modules/pedidos/pedidos.schema.ts` money fields to `z.string()`. AC: no money `z.number()` remains. Files: those 3 files. Spec: money-typing R1,R3. Verify: `tsc -b`, build.
- [x] 1.2 [PR#0] Sweep `src/modules/productos/hooks/useProductos.ts`, `src/modules/carrito/pages/CarritoPage.tsx`, and money renderers to remove arithmetic and show `'—'` where totals lack backend data. AC: no money math; no `NaN`. Files: `src/modules/productos/**`, `src/modules/carrito/**`. Spec: money-typing R2,R4. Verify: `tsc -b`, build, manual cart/catalog smoke.

## Phase 2: Bootstrap + API Client Foundation
- [x] 2.1 [PR#1] Add `src/lib/errorMessages.ts` as the only producer error resolver and register backend AppError codes. AC: `resolveErrorMessage(error)` handles known, unknown, and non-`ApiError` inputs. Files: `src/lib/errorMessages.ts`. Spec: error-message-registry R1-R5. Verify: `tsc -b`, build, manual 4xx/5xx smoke.
- [x] 2.2 [PR#1] Create `src/modules/productor/profile/profile.schema.ts` and `profile.api.ts` for `GET /api/v1/users/me` + `PATCH /producers/me`, with strict partial form schema and edge-parse for `User.role`. AC: DTOs mirror backend, unknown PATCH keys blocked, cache key fixed at `['producer','me']`. Files: `src/modules/productor/profile/*`. Spec: producer-api-client R1,R4-R6; producer-bootstrap R1-R2. Verify: `tsc -b`, build.
- [x] 2.3 [PR#1] Add `hooks/useProducerMeQuery.ts` + `useUpdateProducerMeMutation.ts`; wire `EditarPerfilPublicoPage.tsx` and `PerfilProductorPublicoPage.tsx` to real fetch/update, inline aria-live success, and resolver errors. AC: GET prefills pages, invalid form blocks PATCH, 2xx invalidates `['producer','me']`, 401/5xx fail closed. Files: profile hooks + both pages. Spec: producer-api-client R2-R4; producer-bootstrap R1-R4. Verify: `tsc -b`, build, manual happy/401/4xx/5xx smoke.

## Phase 3: Producer Domain Slices
- [x] 3.1 [PR#2] Wire product catalog under `src/modules/productor/productos/`: list/create/edit/publish, taxonomy selectors, image endpoints, moderation/reporting status, and page/modal consumers. AC: hooks-only page imports, DTOs added, mapped errors shown. Files: `pages/ProductosProductorPage.tsx`, `componentes/CatalogoProductorModals.tsx`, new `productor/productos/**`. Spec: producer-api-client R3-R6; money-typing R1-R3. Verify: `tsc -b`, build, manual CRUD/publish/report smoke.
- [x] 3.2 [PR#3] Wire inventory and delivery modes with namespaced hooks, delivery-mode enum parsing, and mutation invalidation. AC: stock and delivery settings persist; failed mutations keep prior cache. Files: `pages/InventarioProductorPage.tsx`, `ModalidadesEntregaPage.tsx`, related modals, new `productor/inventario/**`, `productor/entregas/**`. Spec: producer-api-client R2-R6. Verify: `tsc -b`, build, manual stock/update smoke.
- [ ] 3.3 [PR#4] Wire order fulfillment, reporting fallout, and sales stats/dashboard consumers using backend-computed money totals only. AC: status transitions parse enums, cancellation/errors use resolver, stats pages stop using hardcoded KPIs/orders. Files: `pages/PedidosProductorPage.tsx`, `EstadisticasProductorPage.tsx`, `ProductorDashboardPage.tsx`, `componentes/PedidosProductorModals.tsx`, new `productor/pedidos/**`, `productor/estadisticas/**`. Spec: producer-api-client R3-R6; money-typing R2-R4. Verify: `tsc -b`, build, manual order/status/stats smoke.

## Phase 4: Verification + Apply Readiness
- [ ] 4.1 [Each PR] Add a manual checklist covering happy path + one 401 + one mapped 4xx + one 5xx/offline path for touched pages. AC: every slice is reviewable/revertible. Files: `openspec/changes/backend-api-integration/tasks.md` during apply. Spec: proposal test-strategy lock. Verify: checklist completion.

## Review Workload Forecast
- Total estimated changed lines: 2,100-2,900
- Proposed PR slices: 5
- Per-slice estimate: PR#0 180-260; PR#1 360-520; PR#2 650-800; PR#3 450-650; PR#4 460-700
- Chained PRs recommended: Yes
- 400-line budget risk: High
- 800-line budget risk: Medium
- Decision needed before apply: Yes — choose chain strategy before `sdd-apply`
- Recommended chain_strategy: stacked-to-main; best for faster review on autonomous slices. Use feature-branch-chain only for one coordinated demo release/rollback boundary.

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High
