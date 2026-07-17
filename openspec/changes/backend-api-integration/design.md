# Design: Backend API Integration (Cycle 2 — Producer Environment) — v2

> Artifact store: hybrid (Engram + OpenSpec)
> Delivery: `force-chained`, review budget ≤ 800 lines/PR
> Chain strategy: deferred to `sdd-tasks`
> Citation convention: `[source: mercado-artesanal-backend/openspec/specs/<capability>/spec.md]` for backend-owned shapes; `[frontend-defined]` for form contracts and UI-only types.

## 1. Technical Approach

Wire producer UI to frozen backend Cycle 2 by extending existing `apiRequest` + `useAuthenticatedApi` + TanStack Query — no new infra. PR#0 fixes money-typing across schemas AND cart. Each subsequent PR wires ONE producer domain end-to-end using co-located layout: `{module}.api.ts` + `{module}.schema.ts` + `hooks/use{Entity}Query.ts` + `hooks/use{Entity}Mutation.ts`. All errors flow through `resolveErrorMessage(error)` from `src/lib/errorMessages.ts`. Maps 1:1 to specs: `producer-api-client` (§3), `producer-bootstrap` (§4), `error-message-registry` (§5), `money-typing` (§6).

## 2. Data Flow

```
Page ──► use{Entity}Query/Mutation ──► {module}.api.ts ──► useAuthenticatedApi()
                    │                        │                    │
                    │                        ▼                    ▼
                    │                 apiRequest<T>       getAccessTokenSilently
                    │                        │
                    ▼                        ▼
             QueryClient cache        fetch(VITE_API_URL, Bearer)
                    ▲                        │
                    │      2xx JSON ─────────┤     non-2xx ──► throw ApiError
                    │                        ▼                       │
                    └────── invalidate ◄─ typed data                 ▼
                                                          resolveErrorMessage(err)
```

## 3. Architecture Decisions

| Decision | Choice | Alternative rejected | Rationale |
|---|---|---|---|
| Module layout | Nested `productor/{domain}/` with `api.ts` + `schema.ts` + `hooks/` | Flat `productor/*.api.ts` | Per-PR domain boundary; satisfies spec §"Co-located module layout". |
| Cache key convention | `['producer', <entity>, ...args]`; mutations invalidate matching read key on `onSuccess` | Global keys / manual refetch | Namespaces state per module; matches `producer-api-client` cache-invalidation requirement. |
| Zod parse strategy | Types-only via `z.infer`; runtime `.parse()` ONLY on control-flow enums (`User.role`, `SubOrderStatus`, `Product.moderationStatus`, `DeliveryModeType`) [source: user-profile, order-fulfillment, product-catalog, delivery-modes] | Runtime-parse every response | Bundle/perf; DTO shape enforced at compile-time; form inputs always Zod-validated at edge via `*FormValues.strict()`. |
| Optimistic updates | NO for PR#1 — invalidate-on-success only | `setQueryData` optimistic + rollback | Backend may reject with `VALIDATION_FAILED`; rollback noise on foundational PR. Later slices may adopt. |
| Success-feedback UX | **Inline status region** next to the form's submit action (aria-live="polite") — one region per producer page shows either the `resolveErrorMessage(error)` string on failure or a localized success label on 2xx | Toast library / global snackbar | No toast infra exists today; adding one competes with integration scope. An inline aria-live region is dependency-free, screen-reader-accessible, and gives `sdd-tasks` a concrete UX target. |
| Registry layout | Single file `src/lib/errorMessages.ts` holds both the map AND `resolveErrorMessage` | Split map/resolver | ~50 lines; indirection unwarranted until >40 codes. |
| Currency/locale | `Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })` in shared `src/lib/formatMoney.ts` | Inline per site | Backend evidence: NIF/CIF, `country="ES"`, Spanish category slugs [source: producer-bootstrap]. Locked (obs #705). |

## 4. Interfaces / Contracts

### 4.1 Authenticated producer read — via `GET /api/v1/users/me`

The authenticated producer profile is read exclusively through the user-me contract: `GET /api/v1/users/me` returns the current user with an embedded `producer` object [source: user-profile/spec.md — "GET /users/me — read current user"]. Producer-domain hooks derive the profile from `response.producer`.

```ts
// src/modules/productor/profile/profile.schema.ts  [frontend-defined mirrors backend]
export type AuthenticatedProducerProfile = {
  id: string
  businessName: string
  nif: string                 // read-only; PATCH rejects with VALIDATION_FAILED
  description: string
  address: {
    line1: string
    line2: string | null
    city: string
    postalCode: string        // ^\d{5}$
    province: string
    country: string           // default "ES"
  }
  categorySlugs: string[]     // authenticated shape [source: user-profile/spec.md]
  createdAt: string
  updatedAt: string
}

export type UserMeResponse = {
  id: string; email: string; emailVerified: boolean
  name: string | null; firstName: string | null; lastName: string | null
  avatar: string | null
  role: 'PENDING_ROLE' | 'CONSUMER' | 'PRODUCER' | 'ADMIN'   // control-flow → edge-parse
  onboardingCompleted: boolean
  producer: AuthenticatedProducerProfile | null
  createdAt: string; updatedAt: string
}
```

Used by: `useProducerMeQuery` → reads `data.producer` from `GET /api/v1/users/me` → `EditarPerfilPublicoPage`, `PerfilProductorPublicoPage`. Cache key: `['producer', 'me']` (invalidated by any producer mutation that changes profile).

### 4.2 Public producer projection — via `GET /producers/:id`

Anonymous, redacts PII (no `nif`, no `address.line1/line2/postalCode`) [source: producer-bootstrap/spec.md — "Public producer projection endpoint"].

```ts
export type PublicProducerProjection = {
  id: string
  businessName: string
  description: string
  address: { city: string; province: string; country: string }
  categories: Array<{ slug: string; name: string }>   // public shape
  createdAt: string
}
```

Used by: future public producer pages (out of scope for PR#1; type declared now to prevent conflation).

### 4.3 Edit input — `PATCH /producers/me`

Partial input; server rejects unknown keys with `VALIDATION_FAILED` (backend `.strict()` policy) [source: producer-bootstrap/spec.md — "Private profile edit endpoint"; error-handling/spec.md — Zod `.strict()`].

```ts
// [frontend-defined form contract]
export const producerProfileFormSchema = z.object({
  businessName: z.string().trim().min(1),
  description: z.string().trim().min(1),
  address: z.object({
    line1: z.string().trim().min(1),
    line2: z.string().nullable(),
    city: z.string().trim().min(1),
    postalCode: z.string().regex(/^\d{5}$/),
    province: z.string().trim().min(1),
    country: z.string().trim().min(2),
  }).partial(),                       // partial address allowed
  categorySlugs: z.array(z.string()).min(1),
}).strict().partial()                 // partial edit; mirror backend .strict()
export type ProducerProfileFormValues = z.infer<typeof producerProfileFormSchema>
```

Endpoints: `producerProfileEndpoints = { patchMe: '/producers/me' }`. Mutation `useUpdateProducerMeMutation` invalidates `['producer', 'me']` on 2xx.

### 4.4 Control-flow enums (edge-parsed at hook boundary)

| Enum | Values | Source |
|---|---|---|
| `User.role` | `PENDING_ROLE \| CONSUMER \| PRODUCER \| ADMIN` | user-profile/spec.md |
| `SubOrderStatus` | `pending \| preparing \| sent \| delivered \| cancelled` | order-fulfillment/spec.md |
| `Product.moderationStatus` (enum `ModerationStatus`) | `OK \| REPORTED \| REMOVED` | product-catalog/spec.md |
| `DeliveryMode.type` (enum `DeliveryModeType`) | `PICKUP \| SHIPPING_FLAT_RATE` | delivery-modes/spec.md |

Enums NOT referenced elsewhere (`Product.status`, `DeliveryMode.kind`) do not exist in backend specs — removed.

### 4.5 Error resolver — `src/lib/errorMessages.ts`

Registry keyed by exact codes from `error-handling/spec.md` (Cycle 1 + Cycle 2 = 19 codes total): `UNAUTHORIZED`, `FORBIDDEN`, `ONBOARDING_REQUIRED`, `NOT_FOUND`, `ROLE_ALREADY_SET`, `NIF_ALREADY_REGISTERED`, `VALIDATION_FAILED`, `UNKNOWN_CATEGORY`, `INVALID_DEFAULT_TRANSITION`, `ADDRESS_DEFAULT_CONFLICT`, `PRODUCT_NOT_FOUND`, `INSUFFICIENT_STOCK`, `PRODUCT_HAS_ACTIVE_ORDERS`, `PRODUCER_HAS_ACTIVE_ORDERS`, `INVALID_ORDER_TRANSITION`, `DELIVERY_MODE_NOT_FOUND`, `IMAGE_UPLOAD_INVALID`, `CATEGORY_NOT_FOUND`, `INTERNAL_ERROR`. Each maps to a neutral professional Spanish string. Fallback ladder: unknown-code → `error.message`; non-`ApiError` → generic `"Ocurrió un error inesperado. Intenta nuevamente."` (no leaked internals).

## 5. File Changes

| File | Action | Description |
|---|---|---|
| `src/lib/formatMoney.ts` | Create | Shared `Intl.NumberFormat('es-ES', currency EUR)`; returns `'—'` on `NaN`. |
| `src/lib/errorMessages.ts` | Create | Code map + `resolveErrorMessage(error: unknown): string`. |
| `src/modules/productos/productos.schema.ts` | Modify (PR#0) | `precio: z.number()` → `z.string().min(1)`. |
| `src/modules/pedidos/pedidos.schema.ts` | Modify (PR#0) | `total: z.number()` → `z.string().min(1)`. |
| `src/modules/productos/hooks/useProductos.ts` | Modify (PR#0) | Mock money literals `6.5`/`9.75` → `'6.50'`/`'9.75'`. |
| `src/modules/carrito/pages/CarritoPage.tsx` | Modify (PR#0) | Drop `unitPriceValue: number` + all numeric arithmetic on money (`+`, `*`, `.toFixed`); read money strings; render via `formatMoney`; when displayed totals require summation the value MUST be sourced from a server field once available. For hardcoded PR#0 state, group/cart totals are rendered as `'—'` (deferred label) until a checkout endpoint provides them. |
| `src/modules/productor/profile/profile.api.ts` | Create (PR#1) | `getUserMe(): Promise<UserMeResponse>`; `patchProducerMe(body: ProducerProfileFormValues): Promise<AuthenticatedProducerProfile>`. |
| `src/modules/productor/profile/profile.schema.ts` | Create (PR#1) | Types + Zod for `UserMeResponse`, `AuthenticatedProducerProfile`, `PublicProducerProjection`, `producerProfileFormSchema`. |
| `src/modules/productor/profile/hooks/useProducerMeQuery.ts` | Create (PR#1) | `useQuery(['producer','me'], getUserMe)`; select producer. |
| `src/modules/productor/profile/hooks/useUpdateProducerMeMutation.ts` | Create (PR#1) | `useMutation` on `PATCH /producers/me`; `onSuccess` invalidates `['producer','me']`. |
| `src/modules/productor/pages/EditarPerfilPublicoPage.tsx` | Modify (PR#1) | Bind form to hooks; inline aria-live status region for success/error. |
| `src/modules/productor/pages/PerfilProductorPublicoPage.tsx` | Modify (PR#1) | Bind to `useProducerMeQuery`. |

## 6. Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Automated unit/integration/E2E | None | `strict_tdd: false` (sdd-init obs #694); no runner installed. |
| Manual smoke per PR | Happy path; 401; 4xx AppError code (e.g. `VALIDATION_FAILED`); 5xx; offline; form-validation blocks submit | Mandatory checklist in each PR body, filled with endpoints/pages touched. |
| Type check | Money-string drift, DTO shape mismatch | `tsc -b` must be clean in each PR. |

## 7. Migration / Rollout

No data migration, no feature flags. Per-PR revert = `git revert <sha>`. Env: `VITE_API_URL` + `VITE_AUTH0_AUDIENCE` matching backend audience.

## 8. Open Questions

- [ ] Chain strategy (stacked-to-main vs feature-branch-chain) — deferred to `sdd-tasks` forecast.
- [ ] Whether `formatMoney` lands in PR#0 or PR#1 — `sdd-tasks` sizing call.
- [ ] `SubOrder`, `Product` list/details wiring order across PR#2..N — `sdd-tasks` decides.

## 9. Handoff to sdd-tasks

Ordered PR slices (chain prefix locked; order of PR#2..N deferred to task planner):

1. **PR#0 — money-fix sweep** (independent, no backend deps).
   Scope: `src/modules/productos/productos.schema.ts`, `src/modules/pedidos/pedidos.schema.ts`, `src/modules/productos/hooks/useProductos.ts`, `src/modules/carrito/pages/CarritoPage.tsx` (remove numeric money arithmetic; render `formatMoney`). Optionally include `src/lib/formatMoney.ts` here if size permits.
2. **PR#1 — `producer-bootstrap` slice** (foundational; sets query+mutation template).
   Scope: `src/lib/errorMessages.ts`, `src/modules/productor/profile/**` (api + schema + hooks), bind `EditarPerfilPublicoPage.tsx` + `PerfilProductorPublicoPage.tsx`. Reads via `GET /api/v1/users/me`; edits via `PATCH /producers/me`.
3. **PR#2..N — remaining producer domains** (order TBD by `sdd-tasks`): `product-catalog`, `inventory`, `order-fulfillment`, `delivery-modes`, `product-images`, `product-taxonomy`, `product-reporting`, `sales-stats`. Each follows the co-located layout and cache-key convention from §3.

Every PR MUST include the manual verification checklist (§6).

## Routing

next_recommended: tasks
