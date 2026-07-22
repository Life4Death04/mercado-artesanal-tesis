## Verification Report

**Change**: `backend-api-integration`
**Slice**: PR#4 — task 3.3 + task 4.1 re-verification
**Version**: current delta specs/design/tasks
**Mode**: Standard
**Execution**: interactive, hybrid persistence (OpenSpec + Engram)

### Completeness
| Metric | Value |
|--------|-------|
| Tasks total | 9 |
| Tasks complete | 8 |
| Tasks incomplete | 1 (`4.1`) |

### Build & Tests Execution
**Type check**: ✅ Passed
```text
$ ./node_modules/.bin/tsc -b
(no output)
```

**Build**: ✅ Passed
```text
$ npm run build
> mercado-artesanal-tesis@0.0.0 build
> tsc -b && vite build

vite v8.0.16 building client environment for production...
transforming...✓ 2057 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                              0.47 kB │ gzip:   0.30 kB
dist/assets/LogoConsumidor-DlMTh14z.png  1,253.57 kB
dist/assets/Banner-B6BlZ_lN.png          1,261.82 kB
dist/assets/LogoProductor-DCGmWGbL.png   1,452.17 kB
dist/assets/Productor-16gYwiVC.png       1,550.49 kB
dist/assets/Producto-CNHvZatl.png        1,992.88 kB
dist/assets/index-CjWTiKEi.css             127.02 kB │ gzip:  17.53 kB
dist/assets/index-iqt2sZOC.js            1,149.47 kB │ gzip: 311.14 kB

✓ built in 522ms
[plugin builtin:vite-reporter]
(!) Some chunks are larger than 500 kB after minification.
```

**Automated tests**: ➖ Not available by project decision
```text
Proposal/design lock: no automated frontend test runner was added for this change.
Required verification remains manual smoke + runtime walkthrough evidence.
```

**Coverage**: ➖ Not available

### Additional Inspection Evidence
| Check | Evidence | Result |
|------|----------|--------|
| PR#4 diff scope | `git diff --name-only dd951e0...HEAD` | 16 files changed |
| PR#4 diff size | `git diff --stat dd951e0...HEAD` | `1633 insertions(+), 539 deletions(-)` |
| Bug 1 link target | `EditarPerfilPublicoPage.tsx:346-353` | `to={\`/productores/${producer.id}\`}` |
| Residual broken public-profile link | grep over `src/**/*.tsx` | No residual `/productor/perfil-publico` match found |
| Bug 3 delivery detail disable logic | `ModalidadesEntregaPage.tsx:439-486` | Delivery detail fields now use `disabled={!isEditing}` only |
| Bug 2 catalog thumbnail behavior | `ProductosProductorPage.tsx:384-387` | Still placeholder-only |
| Bug 2 inventory thumbnail behavior | `inventario.api.ts:66-80` | Still maps `imageUrl: null` |
| Backend list projection for images | `mercado-artesanal-backend/src/modules/products/services/products.service.ts:128-132` | `findAll()` still omits `images` |
| Backend image read endpoint | backend `src/modules/images/**` grep | Only `presign` + `confirm`; no GET/list endpoint found |

### Spec Compliance Matrix
| Requirement | Scenario | Test / Runtime proof | Result |
|-------------|----------|----------------------|--------|
| producer-api-client R2 | Missing or expired token surfaces an error state | No authenticated runtime smoke executed | ❌ UNTESTED |
| producer-api-client R3 | Read hooks expose standard query state to touched pages | No runtime walkthrough of touched pages | ❌ UNTESTED |
| producer-api-client R4 | Successful mutation invalidates read keys | No authenticated mutation walkthrough executed | ❌ UNTESTED |
| producer-api-client R4 | Failed mutation does not invalidate cache | No authenticated failure-path walkthrough executed | ❌ UNTESTED |
| producer-api-client R6 | Control-flow enums reject invalid values at the edge | No runtime rejection-path proof captured | ❌ UNTESTED |
| money-typing R2 | No client-side arithmetic on money strings in orders/stats/dashboard | No runtime walkthrough of money slots captured | ❌ UNTESTED |
| money-typing R4 | No `NaN` / `undefined` / `null` leaks in money UI | No runtime walkthrough of touched pages captured | ❌ UNTESTED |
| proposal test-strategy lock / task 4.1 | Manual checklist covers happy path + 401 + mapped 4xx + 5xx/offline for touched pages | Checklist still pending in artifacts | ❌ UNTESTED |

**Compliance summary**: `0/8` required scenarios have passing runtime evidence.

### Correctness (Static Evidence)
| Requirement / acceptance target | Status | Notes |
|---------------------------------|--------|-------|
| Task 3.3 orders/stats/dashboard wiring exists | ✅ Implemented | PR#4 files are present and `tsc -b` / `build` pass. |
| Dashboard uses backend hooks instead of hardcoded placeholder page | ✅ Implemented | `ProductorDashboardPage.tsx:18-22` consumes stats/orders hooks. |
| Orders/stats pages import hooks only | ✅ Implemented | `PedidosProductorPage.tsx:5-7`, `ProductorDashboardPage.tsx:3-6`, `EstadisticasProductorPage.tsx` hook imports. |
| Money invariant: no client-side arithmetic on backend money strings | ✅ Implemented | Static inspection shows `formatMoney(...)` display-only usage and explicit `'—'` placeholders instead of computed totals. |
| Bug 1 — public profile link routes to producer public path | ✅ Frontend fixed | `EditarPerfilPublicoPage.tsx:346-353` now links to `/productores/${producer.id}`; no residual `/productor/perfil-publico` link found. |
| Bug 2 — thumbnails display real product images | ❌ Backend-required / frontend still blocked | Catalog still renders `placehold.co`; inventory still sets `imageUrl: null`; backend list projection still omits images. |
| Bug 3 — delivery detail fields editable while editing | ✅ Frontend fixed | `ModalidadesEntregaPage.tsx:439-486` now uses `disabled={!isEditing}` for detail fields. |
| 401/5xx/offline paths fail closed on dashboard pending orders | ❌ Frontend failing | `ProductorDashboardPage.tsx:22` defaults query data to `[]`; `:120-126` renders empty-success copy on query failure. |

### Targeted Bug Re-verification
| Bug | Expected state | Evidence | Action class | Status |
|-----|----------------|----------|--------------|--------|
| 1. Public profile redirect | Link points to `/productores/${producer.id}` and no broken `/productor/perfil-publico` remains | `EditarPerfilPublicoPage.tsx:346-353`; grep across `src/**/*.tsx` found no residual broken path | Frontend | ✅ VERIFIED FIXED |
| 2. Missing thumbnails in catalog/inventory | Still deferred until backend exposes image data in list responses | `ProductosProductorPage.tsx:384-387`, `inventario.api.ts:77`, backend `products.service.ts:128-132`, backend images routes expose no GET/list endpoint | Backend-required (frontend blocked) | ⚠️ VERIFIED OPEN |
| 3. Delivery fields inactive while editing | Detail fields use `disabled={!isEditing}` only | `ModalidadesEntregaPage.tsx:439-486` | Frontend | ✅ VERIFIED FIXED |

### Coherence (Design)
| Decision | Followed? | Notes |
|----------|-----------|-------|
| Hooks-only consumer imports | ✅ Yes | Touched pages consume hooks, not `.api.ts` files. |
| `['producer', ...]` query-key namespace | ✅ Yes | New hooks remain within the producer namespace. |
| Control-flow enum edge parsing | ✅ Yes | `SubOrderStatusSchema` is parsed at the API edge. |
| Resolver-based visible failure UX | ⚠️ Partial | Orders page handles query/mutation errors visibly; dashboard only handles revenue errors and misses pending-orders error state. |
| Manual smoke per PR is mandatory | ❌ No | Task `4.1` remains unchecked and artifact evidence is missing. |

### Issues Found
**CRITICAL**
1. **[frontend] Dashboard pending-orders query fails open to a fake empty-success state.**  
   Evidence: `ProductorDashboardPage.tsx:22` destructures `data: pedidosPending = []` without `isError/error`; `ProductorDashboardPage.tsx:120-126` renders “No hay pedidos pendientes en este momento.” whenever the array is empty. On 401/5xx/offline, TanStack Query can leave `data` undefined and the page will present a false empty-success state instead of an error/blocked state.

2. **[frontend] Task 4.1 manual smoke evidence is still missing, so required runtime scenarios remain unverified.**  
   Evidence: `tasks.md:18` is still unchecked; `apply-progress.md:496-518` leaves all PR#4 manual smoke scenarios pending except `tsc -b` and `npm run build`. Per the proposal/design verification strategy, this blocks archive readiness.

**WARNING**
1. **[backend-required] Producer product list still cannot supply thumbnail-ready image data.**  
   Evidence: backend `products.service.ts:128-132` returns `findMany({ where, orderBy })` with no `include: { images: ... }`; backend image module exposes only presign/confirm routes; frontend catalog still uses `placehold.co` and inventory still hardcodes `imageUrl: null`.

2. **[frontend] Dashboard order-count and low-stock queries also lack explicit error branches.**  
   Evidence: `ProductorDashboardPage.tsx:19-20` reads `useOrderCountStatsQuery` and `useLowStockStatsQuery` without `isError/error`; render paths fall back to `'—'` on missing data, which hides backend failure even though it does not create a fake success list.

3. **[frontend] Build still emits an oversized chunk warning.**  
   Evidence: `npm run build` reports output JS chunk `index-iqt2sZOC.js` at `1,149.47 kB` and Vite warns about chunks larger than `500 kB`.

**SUGGESTION**
1. **[frontend] When bug 1 evolves into a true public profile flow, wire `PerfilProductorPublicoPage` to the public producer endpoint contract instead of relying on authenticated self-profile data.**

### Manual Smoke Status
**State**: ❌ UNTESTED  
**Why**: Authenticated browser smoke was intentionally not run in this verification pass, and no prior runtime evidence was recorded for PR#4.

**Minimum scenarios still required by touched page**

**PedidosProductorPage**
- Happy path: list sub-orders from `GET /producers/me/sub-orders`
- Happy path: advance `pending → preparing`
- Happy path: cancel an order
- Failure path: 401 session-expired on advance/cancel
- Failure path: mapped 4xx (`INVALID_ORDER_TRANSITION`)
- Failure path: 5xx/offline while list or mutation is in flight

**EstadisticasProductorPage**
- Happy path: revenue `30d` renders from backend data
- Happy path: order count `30d` renders from backend data
- Failure path: 401 on stats query
- Failure path: 5xx/offline on stats query

**ProductorDashboardPage**
- Happy path: KPI strip loads from backend stats hooks
- Happy path: pending-orders list renders when backend returns items
- Happy path: true empty state renders only after a successful empty response
- Failure path: `usePedidosQuery('pending')` 401/5xx/offline shows error/blocked state, never empty-success copy
- Happy path: low-stock alerts render when items exist

### Git State
- Branch: `feat/backend-api-integration-pr4-orders-reporting-stats`
- Base/tracker ref used for diff: `dd951e0`
- Diff stat vs base: `16 files changed, 1633 insertions(+), 539 deletions(-)`

## Action Plan — Frontend vs Backend

### Frontend actions
1. **Fail closed on dashboard pending-orders errors**
   - **File(s)**: `src/modules/productor/pages/ProductorDashboardPage.tsx`
   - **Root cause**: `usePedidosQuery('pending')` data is defaulted to `[]`, so auth/network/server failures are indistinguishable from a successful empty response.
   - **Proposed fix**: Read `isError`/`error` from the pending-orders query and render a resolver-based error/blocked state before the empty state branch.
   - **Acceptance criterion**: On forced 401/5xx/offline, the dashboard shows an error state and never shows “No hay pedidos pendientes...” unless the query completed successfully with `[]`.
   - **Est. lines**: 15-30

2. **Consume backend image projection for producer thumbnails** **(BLOCKED by Backend action #1)**
   - **File(s)**: `src/modules/productor/productos/productos.schema.ts`, `src/modules/productor/productos/productos.api.ts`, `src/modules/productor/inventario/inventario.api.ts`, `src/modules/productor/pages/ProductosProductorPage.tsx`, `src/modules/productor/pages/InventarioProductorPage.tsx`
   - **Root cause**: Current frontend list consumers do not receive a usable image URL from the backend, so catalog falls back to `placehold.co` and inventory returns `imageUrl: null`.
   - **Proposed fix**: Update DTOs/API mappers/pages to consume ordered image data from the backend and render `images[0].url` (or equivalent primary-image field) instead of placeholders.
   - **Acceptance criterion**: Uploaded products show their first image in both “Mi catálogo” and “Inventario”; placeholder renders only when the backend response has no images.
   - **Est. lines**: 40-90

3. **Complete and document PR#4 manual smoke evidence**
   - **File(s)**: `openspec/changes/backend-api-integration/apply-progress.md`, `openspec/changes/backend-api-integration/verify-report.md` (and PR checklist artifact, if maintained outside repo)
   - **Root cause**: The project accepted manual verification instead of an automated runner, but the required runtime evidence was never captured.
   - **Proposed fix**: Execute the minimum scenarios listed above and record pass/fail evidence per touched page, then mark task `4.1` complete only after evidence exists.
   - **Acceptance criterion**: Happy path + 401 + mapped 4xx + 5xx/offline are documented for every touched page in PR#4.
   - **Est. lines**: 20-40 (artifact-only)

### Backend actions
1. **Expose product images in producer list responses**
   - **Backend repo path**: `/home/life4death/WebDevelopment/mercado-artesanal-backend/src/modules/products/services/products.service.ts` (plus DTO/controller/route files as needed)
   - **Root cause**: `findAll(producerId)` returns products without `images`, and the backend image module exposes only upload `presign` / `confirm` endpoints, not a read/list projection.
   - **Proposed fix**: Either (a) include product `images` ordered by `position` in `products.service.ts findAll(producerId)`, or (b) expose a dedicated `GET /api/v1/products/:id/images` list endpoint. The contract must provide a frontend-consumable ordered image projection (expected frontend target: `images[0].url`).
   - **Contract impact on frontend**: Enables `productos.schema.ts`, `productos.api.ts`, `inventario.api.ts`, `ProductosProductorPage.tsx`, and `InventarioProductorPage.tsx` to replace placeholders with real thumbnails. **Unblocks Frontend action #2.**
   - **Acceptance criterion**: Producer product-list responses expose ordered image data suitable for rendering the first thumbnail without a second manual placeholder path.

### Verdict
**FAIL**

Task `3.3` remains statically implemented and both required build commands pass, but archive readiness is still blocked for two reasons: (1) the dashboard still has a real frontend fail-open bug on the pending-orders query path, and (2) task `4.1` has no runtime smoke evidence, so required spec scenarios remain unverified.
