# Exploration: Backend API Integration (Cycle 2 — Producer Environment)

> Artifact store: hybrid (Engram + OpenSpec)
> Change name: backend-api-integration
> Scope: producer-side domains only — consumer flows (cart, checkout) are NOT in-scope

---

## Current State

### What the frontend has today

| Layer | State |
|-------|-------|
| HTTP wrapper | `src/lib/api.ts` — `apiRequest<T>` with bearer injection, `ApiError`, base URL from `VITE_API_URL` |
| Auth token | `useAuthenticatedApi()` (`src/modules/auth/hooks/useAuthenticatedApi.ts`) wraps `apiRequest` and calls `getAccessTokenSilently({ audience })` per-request. Already works. |
| TanStack Query | Installed (`^5.101.0`), `QueryClient` configured (`src/lib/queryClient.ts`). Used in exactly ONE place: `useCurrentUser`. Pattern exists but is NOT extended. |
| Redux | `src/store/` — single `uiSlice` for `activeRole`. No server state in Redux. |
| Zod | Installed (`^4.4.3`). Used in `productos.schema.ts` and `pedidos.schema.ts` — both mock-only. |
| Module layout | `src/modules/{role}/` with `pages/`, `componentes/`, `hooks/` subdirs. Auth module has `.api.ts` and `.types.ts` as the only real API-connected code. |
| Tests | No test runner installed. |
| Mocks | ALL pages are 100% hardcoded. No API calls in any producer page. |

### Money representation today (RISK — see §5)

- `CarritoPage` stores `unitPriceValue: number` and does `item.unitPriceValue * item.quantity` as JS float arithmetic.
- Mock prices like `9.75`, `18.5` are JS `number` literals.
- `pedidos.schema.ts` defines `total: z.number().nonnegative()` — asserts numeric.
- `productos.schema.ts` defines `precio: z.number().positive()` — asserts numeric.
- Backend returns money as **decimal strings** (Prisma Decimal → string). Collision guaranteed if not fixed before wiring.

---

## API Surface Mapping (Cycle 2 → Frontend Modules)

| Backend Domain | Primary Consumer Module | Secondary / Shared |
|---|---|---|
| **producer-bootstrap** | `src/modules/productor/` — `EditarPerfilPublicoPage`, `PerfilProductorPublicoPage` | `src/modules/auth/` (profile data surfaced in `CurrentUser.producer`) |
| **product-catalog** | `src/modules/productor/` — `ProductosProductorPage` (CRUD, publish/unpublish) | `src/modules/productos/` — `CatalogoPage`, `DetalleProductoPage` (read-only consumer view — NOT Cycle 2 scope) |
| **product-taxonomy** | `src/modules/productor/` — filter dropdowns in `ProductosProductorPage`, `AgregarProductoModal` | Shared taxonomy constants could live in `src/modules/productos/` or `src/lib/` |
| **product-images** | `src/modules/productor/` — `AgregarProductoModal`, `EditarProductoModal` in `CatalogoProductorModals` | Multipart upload — requires special handling (not covered by `apiRequest` today) |
| **product-reporting** | `src/modules/productor/` — `EstadisticasProductorPage` (top products table) | Reused by `ProductosProductorPage` sorting |
| **inventory** | `src/modules/productor/` — `InventarioProductorPage` (stock editor) | Stock badge in `ProductosProductorPage` |
| **delivery-modes** | `src/modules/productor/` — `ModalidadesEntregaPage` | `shippingCostSnapshot` needed when orders are created — consumer scope, not Cycle 2 |
| **order-fulfillment** | `src/modules/productor/` — `PedidosProductorPage` (status transitions) | `isTerminalStatus()` guard needed client-side to disable actions |
| **sales-stats** | `src/modules/productor/` — `EstadisticasProductorPage` (KPI cards, revenue totals, low-stock envelope) | — |
| **error-handling** | `src/lib/api.ts` — `ApiError` already exists; needs mapping from backend `AppError` codes to UX messages | All modules |

**Key insight**: all 10 Cycle 2 domains map primarily to `src/modules/productor/`. The module already has all the pages; zero of them make API calls. `src/modules/productos/` owns the consumer-side product views and will share types but is NOT the primary producer API consumer.

---

## Approaches: Data-Layer Architecture

### Option A — Co-located per module (recommended)

Each `src/modules/{role}/` owns its API functions and hooks:

```
src/modules/productor/
  productor.api.ts          # typed fn per endpoint
  productor.types.ts        # TS types mirroring backend DTOs
  productor.schema.ts       # Zod shapes for form validation + parse-at-edge
  hooks/
    useProducerProfile.ts   # useQuery wrapping productor.api
    useProductCatalog.ts
    useSalesStats.ts
    useOrderFulfillment.ts
    useInventory.ts
    useDeliveryModes.ts
```

Each hook calls `useAuthenticatedApi()` internally or receives the authed request function — following the pattern already established in `useCurrentUser.ts`.

| | |
|---|---|
| **Pros** | Follows existing pattern (`auth.api.ts` + `useCurrentUser`). Co-location = obvious owner. Module tree stays self-contained. Bundle-split friendly (each module is lazy-loaded). Low friction for thesis demo. |
| **Cons** | Types duplicated across modules (e.g. `Product` type needed in both `productor` and `productos`). Risk of drift between modules. |
| **Effort** | Low — extends a pattern the codebase already has |

### Option B — Centralized typed API client

Single `src/lib/apiClient/` with typed endpoint groups:

```
src/lib/apiClient/
  producer.ts        # all producer endpoints
  products.ts        # all product endpoints (shared)
  orders.ts
index.ts             # re-exports
```

Hooks still live in modules but import from `src/lib/apiClient/`.

| | |
|---|---|
| **Pros** | Single source of truth for endpoint shapes and paths. Easier to update when backend changes. Type sharing is explicit. |
| **Cons** | More setup. Cross-cutting abstraction layer that doesn't exist today. Harder to demo as a "simple SPA" in thesis. Modules still need their own hooks anyway. |
| **Effort** | Medium — new abstraction layer |

### Option C — OpenAPI codegen

If the backend exposes an OpenAPI spec, generate types + a client (`openapi-typescript` + `openapi-fetch` or similar).

| | |
|---|---|
| **Pros** | Zero type drift by construction. Endpoint paths auto-generated. Best long-term DX. |
| **Cons** | Unknown: backend OpenAPI availability not confirmed. Adds codegen toolchain step (CI, npm script, schema versioning). Overkill for a thesis project. Generated types can be verbose. |
| **Effort** | High — unknown backend prerequisite + tooling setup |

### Verdict

**Option A (co-located) is the right call for this project.** The pattern is already established by `src/modules/auth/`. The entire producer surface lives in one module. The thesis context makes simplicity more valuable than architectural purity. Centralized client (B) is worth applying ONLY to shared types (`Product`, `Order`) that genuinely cross module boundaries — those can live in `src/modules/productos/productos.types.ts` as the canonical shared model.

---

## Auth Token Flow

### Current state (confirmed from code)

1. `useAuth0()` provides `getAccessTokenSilently`.
2. `useAuthenticatedApi()` (`src/modules/auth/hooks/useAuthenticatedApi.ts`) returns an `authenticatedApiRequest` function that calls `getAccessTokenSilently({ audience })` → passes token into `apiRequest()`.
3. `useCurrentUser` uses `getAccessTokenSilently` directly inside `queryFn`.
4. `apiRequest` accepts `accessToken?: string` and sets `Authorization: Bearer {token}` when provided.

### Recommended pattern for new hooks

**Per-request token injection via `useAuthenticatedApi()`** — already the established pattern. Each query hook calls it:

```ts
// src/modules/productor/hooks/useProducerProfile.ts
export function useProducerProfile() {
  const authenticatedRequest = useAuthenticatedApi()

  return useQuery({
    queryKey: ['producer', 'profile'],
    queryFn: () => authenticatedRequest<ProducerProfileDTO>('/producers/me'),
  })
}
```

**Do NOT introduce a React Context interceptor or axios instance** — `apiRequest` is a plain `fetch` wrapper, not an axios instance, so interceptors don't apply. The `useAuthenticatedApi()` hook is the right abstraction already.

**Mutation pattern** (for profile edits, product CRUD, etc.):

```ts
export function useUpdateProducerProfile() {
  const authenticatedRequest = useAuthenticatedApi()

  return useMutation({
    mutationFn: (data: UpdateProducerProfileDTO) =>
      authenticatedRequest<ProducerProfileDTO>('/producers/me', { method: 'PATCH', body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['producer', 'profile'] }),
  })
}
```

---

## Zod Contract Strategy

### Backend policy

Backend enforces strict Zod DTO policy — every request body is validated. Responses are shaped by Prisma + service layer.

### Frontend options

| Option | Description | Drift risk |
|---|---|---|
| **Hand-written mirrors** | Each module has `.schema.ts` with Zod shapes mirroring backend DTOs. Used for form validation and parse-at-edge. | Medium — diverges silently on backend changes |
| **Shared npm package** | Extract types into a `@mercado-artesanal/types` package. Both apps depend on it. | Low, but requires monorepo or package registry setup |
| **Codegen from OpenAPI** | Backend OpenAPI → `openapi-typescript` → TS types. Then hand-write Zod on top (or use `zod-openapi`). | Low — depends on OpenAPI availability |

### Recommendation

**Hand-written mirrors** for this thesis. Rationale: no monorepo, no confirmed OpenAPI. The surface is bounded (producer side only). Key rule: **Zod schemas on the frontend are for form validation only — not for runtime-parsing API responses**. This avoids over-engineering while keeping form safety.

Exception: parse-at-edge is acceptable for critical safety fields (e.g. confirm `role` is a valid `BackendRole` before routing decisions).

**Convention to establish**: schemas named `*DTO` for server shapes, `*FormValues` for form-specific shapes (these differ for e.g. image uploads where the DTO sends a URL but the form works with a `File`).

---

## Money and Decimal Handling

### Backend contract

Revenue totals arrive as **decimal strings** from Prisma Decimal serialization. Example: `"total": "4250.00"` not `4250`.

### Current frontend status (CONFLICT FOUND)

- `pedidos.schema.ts`: `total: z.number().nonnegative()` — **WRONG** — will fail Zod parse on real backend data
- `productos.schema.ts`: `precio: z.number().positive()` — **WRONG** — same problem
- `CarritoPage`: stores `unitPriceValue: number` and does float arithmetic — consumer scope, not Cycle 2, but sets a bad precedent
- `EstadisticasProductorPage`, `PedidosProductorPage`, `ProductosProductorPage`: prices are string literals like `'18,50EUR'` — safe for display but not for math

### Rule to establish (must go into proposal)

1. **All money fields in types/schemas must be `string`** (matching backend Decimal serialization)
2. **Display formatting**: `new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(parseFloat(rawValue))`
3. **No arithmetic on money strings** — if totals are needed for UI (e.g. cart subtotal), derive them server-side or format-only client-side
4. **`pedidos.schema.ts` and `productos.schema.ts` must be corrected** before wiring (change `z.number()` → `z.string()`)

---

## Order of Integration — Recommended Sequence

Rationale: thesis defense narrative needs an end-to-end proof first, then visual demo value.

| Priority | Slice | Rationale |
|---|---|---|
| **1st** | **producer-bootstrap** (profile edit) | Smallest end-to-end path: GET profile, display real data, PATCH edit, see result. One mutation + one query. Proves the full wiring stack (auth → TanStack Query → backend → UI). |
| **2nd** | **product-catalog + inventory** | Widest visual coverage. Replaces the entire `ProductosProductorPage` + `InventarioProductorPage` hardcoded data. Two closely related domains — catalog CRUD unlocks inventory CRUD. |
| **3rd** | **sales-stats** | Highest demo visual value (KPI cards, charts). Endpoint reuse with product-reporting. Pure read-only — no mutations, no form validation, lowest risk. |
| **4th** | **order-fulfillment** | Important for thesis narrative (producer can manage orders). `isTerminalStatus()` guard needs client implementation. |
| **5th** | **delivery-modes** | More complex UX (multiple delivery types, pickup points). Lower narrative priority for defense. |
| **6th** | **product-images** | Needs multipart upload — `apiRequest` currently only sends JSON. Requires either extending the wrapper or a special-case branch. Highest implementation effort. |
| **7th** | **product-taxonomy, product-reporting** | Supporting domains. Taxonomy is needed by catalog filters (can hardcode initially). Reporting reused by stats. |
| **8th** | **error-handling** | Map `AppError` codes to UX feedback. Should be done alongside or right after the first wiring (slice 1) to establish error UX pattern. |

---

## Risks and Open Questions

### R1 — No test runner: correctness is manual
`strict_tdd: false`. There is no way to guard against regressions when wiring replaces mocks. Each wired page should at minimum have a manual smoke test checklist. Risk: **High for defense day**.

### R2 — Money type collision (confirmed)
`pedidos.schema.ts` and `productos.schema.ts` define numeric types for fields that the backend returns as strings. This will produce silent `undefined` values or failed Zod parses when real data arrives. Must be corrected before any wiring. Risk: **High**.

### R3 — Backend OpenAPI availability unknown
Option C (codegen) is blocked until we know if the backend exposes an OpenAPI spec. This is an open question. If available, even partial type generation for shared DTOs (Product, Order) would reduce drift significantly.

### R4 — `product-images` requires multipart
`apiRequest` only sends `Content-Type: application/json`. Product image upload requires `multipart/form-data`. The wrapper needs an extension (either a separate `apiUpload` function or a flag to skip `Content-Type` header and pass `FormData` directly as `body`). Discovery needed before scheduling this slice.

### R5 — Mock vs. real data switch
All pages render from hardcoded `const` arrays. Wiring means replacing `useState(mockData)` with `useQuery` results. This is a non-trivial refactor per page — especially `ProductosProductorPage` which has complex local mutation state (edit, delete, toggle publication) that will need to become server mutations.

### R6 — Moderation state UI
Backend `product-catalog` spec includes a moderation state. The frontend `ProductoStatus` enum (`Publicado | Despublicado | Sin disponibilidad`) doesn't map 1:1 to backend states. Proposal must clarify the mapping.

### R7 — `isTerminalStatus()` — client-side implementation needed
The backend documents `isTerminalStatus()` as a shared helper. The frontend needs to replicate the same terminal-state logic to disable UI actions (e.g. cancel button on a delivered order). Risk of divergence if the terminal state set ever changes.

---

## Ready for Proposal

**Yes.** All exploration questions are answered with real code evidence. The recommended path is clear:

- **Architecture**: Option A (co-located modules), following `auth.api.ts` + `useCurrentUser` as the template
- **First slice**: `producer-bootstrap` (profile edit + profile display)
- **Top risks to surface in proposal**: R2 (money type collision), R4 (multipart images), R5 (mock-to-real refactor complexity per page)

The orchestrator should ask the user to confirm:
1. Integration sequence priority (especially: does thesis defense need sales-stats visuals or just producer bootstrap?)
2. Whether to confirm backend OpenAPI availability before scheduling
3. Whether to fix `pedidos.schema.ts` / `productos.schema.ts` money types as a pre-step (strongly recommended)
