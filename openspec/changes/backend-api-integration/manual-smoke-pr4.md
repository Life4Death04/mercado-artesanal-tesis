# PR#4 Manual Smoke Checklist

> **Purpose**: Template for the producer to walk through the minimum required scenarios for every
> page touched in PR#4 (orders, stats, dashboard) and the PR#4 remediation slice (thumbnails,
> fail-closed dashboard). Evidence slots must be filled in during a live authenticated session.
> Do NOT fabricate results — run each scenario and record what you observed.
>
> **When to mark task 4.1 complete**: After every table below has a `[x] Pass` or documented
> `[x] Fail` (with a follow-up issue linked) for every scenario. Do NOT mark 4.1 complete before
> this file has been filled in.

---

## How to Use

1. Start the dev server: `npm run dev`
2. Log in as a producer account with at least some orders and products.
3. Walk each page in order. For each scenario, record:
   - **Evidence**: a screenshot path (relative to repo root), a console log excerpt, or a brief
     prose note describing what you saw.
   - **Result**: `[x] Pass` or `[ ] Fail` — if Fail, open a follow-up issue and link it here.
4. After all scenarios are covered, update `tasks.md` to check off `4.1`.

---

## Page: ProductorDashboardPage

> Route: `/productor/dashboard`

### Scenario 1 — Happy path: authenticated, has pending orders

| Field | Value |
|-------|-------|
| Pre-condition | Logged in as producer; at least 1 sub-order in `pending` status exists |
| Expected | KPI strip shows real revenue / order count / low-stock values; pending orders list renders ≥ 1 row |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 2 — Happy path: authenticated, zero pending orders

| Field | Value |
|-------|-------|
| Pre-condition | Logged in as producer; no sub-orders in `pending` status |
| Expected | KPI strip still loads; pending orders section shows "No hay pedidos pendientes en este momento." — the empty-success copy |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 3 — Fail-closed: 401 / expired token on pending-orders query

| Field | Value |
|-------|-------|
| Pre-condition | Clear auth cookies / use an expired token; load the dashboard |
| Expected | Pending orders section shows the error block ("No se pudieron cargar los pedidos pendientes.") with the resolved error message — NEVER shows the empty-success copy |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 4 — Fail-closed: 5xx / offline on pending-orders query

| Field | Value |
|-------|-------|
| Pre-condition | Block network for the `/producers/me/sub-orders` request (e.g. DevTools → offline or request block) while dashboard is loading |
| Expected | Pending orders section shows the error block — NEVER shows empty-success copy |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 5 — Revenue error handling (partial — pre-existing)

| Field | Value |
|-------|-------|
| Pre-condition | Block the `/producers/me/stats/revenue` request |
| Expected | Revenue error banner appears (top of page); other KPIs continue rendering with `'—'` fallback |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

---

## Page: PedidosProductorPage

> Route: `/productor/pedidos`

### Scenario 1 — Happy path: list sub-orders

| Field | Value |
|-------|-------|
| Pre-condition | Logged in as producer with existing orders |
| Expected | Sub-orders load from `GET /producers/me/sub-orders`; status badges show correct display labels (Pendiente, En preparación, etc.) |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 2 — Happy path: advance pending → preparing

| Field | Value |
|-------|-------|
| Pre-condition | A sub-order in `pending` status exists |
| Expected | Open detail modal; click advance CTA; `PATCH /producers/me/sub-orders/:id { status: 'preparing' }` → 200; list refreshes; modal closes |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 3 — Happy path: cancel an order

| Field | Value |
|-------|-------|
| Pre-condition | A cancellable sub-order exists |
| Expected | CancelarPedidoModal → confirm → `PATCH { status: 'cancelled' }` → 200; list refreshes |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 4 — Failure: 401 session-expired on advance

| Field | Value |
|-------|-------|
| Pre-condition | Expire the session mid-flow (e.g. revoke token in Auth0 dashboard or clear storage) |
| Expected | Mutation fails; error banner shows «Tu sesión ha expirado. Inicia sesión de nuevo para continuar.»; list stays visible |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 5 — Failure: mapped 4xx (INVALID_ORDER_TRANSITION)

| Field | Value |
|-------|-------|
| Pre-condition | Attempt a status transition the backend state machine rejects (e.g. `delivered → pending`) |
| Expected | 409 → `resolveErrorMessage` shows mapped message; cache untouched |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 6 — Failure: 5xx / offline while list is loading

| Field | Value |
|-------|-------|
| Pre-condition | Block network while navigating to the page |
| Expected | Error state rendered; no crash; list placeholder shown |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

---

## Page: EstadisticasProductorPage

> Route: `/productor/estadisticas`

### Scenario 1 — Happy path: revenue 30d

| Field | Value |
|-------|-------|
| Pre-condition | Logged in; backend has revenue data for the last 30 days |
| Expected | `totalRevenue` rendered via `formatMoney`; no raw Decimal string visible; no NaN |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 2 — Happy path: order count 30d

| Field | Value |
|-------|-------|
| Pre-condition | Same as above |
| Expected | `count` shown as a plain integer; no NaN / undefined leaks |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 3 — Failure: 401 on stats query

| Field | Value |
|-------|-------|
| Pre-condition | Expired / missing token |
| Expected | Error text shown via `resolveErrorMessage`; page does not crash; fields show `'—'` |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 4 — Failure: 5xx / offline on stats query

| Field | Value |
|-------|-------|
| Pre-condition | Block the stats endpoint |
| Expected | Error text; no crash; spinner shown while loading, then error state |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 5 — Money invariant: no NaN / undefined in money slots

| Field | Value |
|-------|-------|
| Pre-condition | Normal authenticated view |
| Expected | No slot shows `NaN`, `undefined`, or `null` as rendered text — deferred slots show `'—'` |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

---

## Page: ProductosProductorPage (Mi catálogo)

> Route: `/productor/catalogo` (or equivalent)

### Scenario 1 — Happy path: products with uploaded images show thumbnail

| Field | Value |
|-------|-------|
| Pre-condition | At least one product has an uploaded image (confirmed via S3/backend); backend running on branch `feature/expose-product-images-in-producer-list` |
| Expected | Product card shows the real image from `images[0].url`; `<img>` element src is a valid URL (not `placehold.co`) |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 2 — Products with no images show accessible placeholder

| Field | Value |
|-------|-------|
| Pre-condition | A product has zero uploaded images |
| Expected | Product card shows the accessible `<div>` placeholder (no broken image icon); `alt` attribute is NOT rendered on a `<div>` (use `aria-label`) |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 3 — Failure: 401 on product list

| Field | Value |
|-------|-------|
| Pre-condition | Expired / missing token |
| Expected | Full-page error state shown via `resolveErrorMessage`; no product cards rendered |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 4 — Failure: offline / 5xx on product list

| Field | Value |
|-------|-------|
| Pre-condition | Block the product list endpoint |
| Expected | Full-page error state; spinner while loading, then error |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

---

## Page: InventarioProductorPage (Inventario)

> Route: `/productor/inventario`

### Scenario 1 — Happy path: products with uploaded images show thumbnail

| Field | Value |
|-------|-------|
| Pre-condition | Same as catalog Scenario 1 |
| Expected | Inventory row shows real image from `images[0].url`; `<img>` src is a valid URL |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 2 — Products with no images show accessible placeholder

| Field | Value |
|-------|-------|
| Pre-condition | A product has zero uploaded images |
| Expected | Inventory row shows the accessible `<div>` placeholder (background-colored block, no broken icon) |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 3 — Failure: 401 on inventory list

| Field | Value |
|-------|-------|
| Pre-condition | Expired / missing token |
| Expected | Error banner at top of page; summary cards show 0; list empty |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

### Scenario 4 — Failure: offline / 5xx on inventory list

| Field | Value |
|-------|-------|
| Pre-condition | Block the inventory endpoint |
| Expected | Error banner; no crash; spinner while loading, then error |
| Evidence | _(paste screenshot path or describe what you saw)_ |
| Result | `[ ] Pass` / `[ ] Fail` |

---

## Summary Checklist

Before marking task `4.1` complete, confirm:

- [ ] All ProductorDashboardPage scenarios above have results filled in
- [ ] All PedidosProductorPage scenarios above have results filled in
- [ ] All EstadisticasProductorPage scenarios above have results filled in
- [ ] All ProductosProductorPage (Mi catálogo) scenarios above have results filled in
- [ ] All InventarioProductorPage scenarios above have results filled in
- [ ] Any `[ ] Fail` entries have a follow-up GitHub issue linked
- [ ] `tasks.md` task `4.1` is updated to `[x]` after all evidence is captured

---

## Related Artifacts

- `openspec/changes/backend-api-integration/verify-report.md` — PR#4 verification FAIL context
- `openspec/changes/backend-api-integration/apply-progress.md` — cumulative progress across all PRs
- `openspec/changes/backend-api-integration/tasks.md` — task checklist (4.1 remains unchecked)
