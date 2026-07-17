# Proposal: Backend API Integration (Cycle 2 — Producer Environment)

## Intent

The frontend ships 100% hardcoded producer screens for the thesis defense. The sibling backend (`mercado-artesanal-backend`) has finished Cycle 2 with frozen contracts for the producer environment. This change wires the producer-side UI to real backend endpoints so the defense demo shows a working end-to-end system, not a mock. Money-typing debt in existing schemas (`z.number()` vs backend decimal strings) is fixed first as an isolated pre-step.

## Scope

### In Scope

- **PR#0 — money-fix (pre-integration)**: `precio: z.number()` → `z.string()` in `src/modules/productos/productos.schema.ts` (line 7); `total: z.number()` → `z.string()` in `src/modules/pedidos/pedidos.schema.ts`; adjust consumer-side formatting (e.g. `CarritoPage` numeric math on `unitPriceValue`).
- **PR#1 — `producer-bootstrap` slice**: end-to-end producer profile — login → `GET /producers/me` → `PATCH /producers/me` → cache invalidation via TanStack Query. Establishes the query+mutation template.
- **PR#N... — subsequent producer domain slices**: order to be decided by `sdd-tasks`. Domains available: `product-catalog`, `inventory`, `sales-stats`, `order-fulfillment`, `delivery-modes`, `product-images`, `product-taxonomy`, `product-reporting`.
- Centralized error-message registry at `src/lib/errorMessages.ts` (`ApiError.payload.code` → Spanish neutral message, fallback to `ApiError.message`).
- Hand-written Zod DTO mirrors per module (`{module}.schema.ts`), authored from backend `openspec/specs/**`.

### Out of Scope

- Consumer flows: cart, checkout, buyer catalog wiring — NOT Cycle 2.
- OpenAPI codegen — settled decision; do not re-investigate.
- Backend endpoints outside Cycle 2 producer-environment archive.
- Adding a test runner (Vitest / RTL) — see Approach § Test Strategy.

## Capabilities

> First change in the project — no existing `openspec/specs/`. All capabilities below are NEW and become `openspec/specs/<name>/spec.md` when authored by `sdd-spec`.

### New Capabilities

- `producer-api-client`: HTTP + auth + query-cache foundation. Extends `src/lib/api.ts` and `useAuthenticatedApi`, standardizes the TanStack Query hook pattern (`use{Entity}Query`, `use{Entity}Mutation`), and defines the co-located `.api.ts` + `hooks/` + `.schema.ts` module contract.
- `producer-bootstrap`: producer profile end-to-end — `GET /producers/me` fetch, `PATCH /producers/me` update, TanStack cache invalidation on mutation success, form validation via Zod, error surfaced through the shared error-message registry.
- `error-message-registry`: `src/lib/errorMessages.ts` — `code → user-facing Spanish message` lookup against backend `AppError` registry, with `ApiError.message` fallback.
- `money-typing`: money represented as `string` end-to-end in types/schemas; display via `Intl.NumberFormat`; no client-side money arithmetic.

### Modified Capabilities

- None (first change; existing modules will be extended under `producer-api-client` semantics rather than under a prior spec).

## Approach

**Data layer** — Option A (co-located per module) from exploration: each module owns `.api.ts`, `.types.ts`, `.schema.ts`, `hooks/`. Extends the existing `auth.api.ts` + `useCurrentUser` precedent. No axios, no interceptors — `apiRequest` remains a plain `fetch` wrapper.

**Type/DTO alignment** — Hand-written Zod mirrors authored by reading backend `openspec/specs/**` (frozen Cycle 2). Rules: `*DTO` = server shapes (types-only, not parsed at runtime), `*FormValues` = form shapes (Zod-validated), parse-at-edge only for critical enums (role, status). No OpenAPI codegen.

**Auth** — All new hooks use `useAuthenticatedApi()`. Bearer token injected per request via `getAccessTokenSilently({ audience })`.

**Error UX** — New `src/lib/errorMessages.ts`. Lookup `ApiError.payload.code`; fallback to `ApiError.message`. Spanish neutral tone for the user-facing strings (UI copy).

**Test Strategy — RESOLVED**: manual smoke verification (option b). Rationale: (1) thesis defense timeline favors visible integration progress over automated-test scaffolding; (2) adding Vitest + RTL + msw setup would compete for the same review budget as the integration work itself; (3) `strict_tdd: false` was already accepted at init. **Mitigation**: each chained PR MUST include a manual verification checklist in its PR body covering happy-path + at least one failure path (401, 4xx AppError, 5xx). Slice 1 (`producer-bootstrap`) is small enough to smoke-test exhaustively.

**Delivery** — `force-chained`. Fixed chain prefix: **PR#0 money-fix → PR#1 producer-bootstrap → PR#N producer slices** (order of PR#N... deferred to `sdd-tasks`). Review budget 800 lines per PR. Chain strategy (stacked-to-main vs. feature-branch-chain) deferred to post-`sdd-tasks` forecast.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/api.ts` | Modified | `ApiError` payload code surfacing (already present); potential multipart wrapper later — not this slice. |
| `src/lib/queryClient.ts` | Reused | No change; existing 5min `staleTime` config stands. |
| `src/lib/errorMessages.ts` | New | `code → message` map + resolver function. |
| `src/modules/auth/hooks/useAuthenticatedApi.ts` | Reused as template | Every new hook depends on it. |
| `src/modules/productos/productos.schema.ts` | Modified (PR#0) | `precio: z.number()` → `z.string()`. |
| `src/modules/pedidos/pedidos.schema.ts` | Modified (PR#0) | `total: z.number()` → `z.string()`. |
| `src/modules/carrito/**` | Modified (PR#0) | Remove numeric arithmetic on `unitPriceValue`; format via `Intl.NumberFormat`. |
| `src/modules/productor/*.api.ts` + `hooks/` + `*.schema.ts` | New (PR#1+) | Per producer domain, following co-located pattern. |
| `src/modules/productor/pages/EditarPerfilPublicoPage.tsx` | Modified (PR#1) | Bind to real GET/PATCH via new hooks. |
| `src/modules/productor/pages/PerfilProductorPublicoPage.tsx` | Modified (PR#1) | Bind to real GET via new hook. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| No automated tests — regressions caught only manually | High | Mandatory PR verification checklist (happy + failure paths); small slices; smoke script per PR. |
| Money-string drift — a page still assumes `number` | Med | PR#0 grep sweep for `Number(precio)`, `precio *`, `total.toFixed`, etc.; type change surfaces most call sites via `tsc`. |
| Backend `AppError` codes drift from frontend registry | Med | Fallback to `ApiError.message` always renders something; codes centralized in one file for fast update. |
| Hand-written Zod mirrors diverge from backend specs | Med | Authored from frozen Cycle 2 specs; add module-level comment linking to source spec path. |
| Cache-key inconsistency across modules | Med | `producer-api-client` capability spec defines the key convention (e.g. `['producer', 'profile']`); enforced by review. |
| PR#0 (money-fix) breaks consumer pages | Low | Consumer flows are hardcoded/mock; blast radius limited to formatting sites; git revert scoped to schema + formatting files only. |

## Rollback Plan

- **PR#0 (money-fix)**: `git revert <sha>`. Impact isolated to two schema files + carrito formatting; safe to revert independently.
- **PR#1 (producer-bootstrap)**: `git revert <sha>` restores hardcoded `EditarPerfilPublicoPage` / `PerfilProductorPublicoPage`. Zod schema additions and new files are additive — reverting removes them without touching PR#0.
- **PR#N (subsequent slices)**: each slice is designed as an independent revert target — one domain per PR. Feature-branch-chain (if chosen) requires reverting later slices first, then the parent slice.
- **Environment fallback**: pointing `VITE_API_URL` at an unreachable host makes hooks fail-closed via `ApiError`; UI shows error state without crash.

## Dependencies

- Backend `mercado-artesanal-backend` Cycle 2 (producer-environment) archived and frozen. Archive report obs #690 in project `mercado-artesanal-backend`, topic_key `sdd/producer-environment/archive-report`. Specs at `mercado-artesanal-backend/openspec/specs/**` are the DTO source of truth.
- `VITE_API_URL` env var pointing to a running Cycle 2 backend instance (default `http://localhost:3000/api/v1`).
- Auth0 tenant with `VITE_AUTH0_AUDIENCE` matching the backend's expected audience claim.

## Success Criteria

- [ ] PR#0 merges: no page renders `NaN` or `undefined` for prices/totals; `tsc -b` clean; smoke test on `CarritoPage` passes.
- [ ] PR#1 merges: logged-in producer opens `EditarPerfilPublicoPage`, sees real data from `GET /producers/me`, edits + saves, `PATCH /producers/me` succeeds, page reflects updated data without full reload (cache invalidation works).
- [ ] `ApiError` with a known backend code renders the Spanish message from `errorMessages.ts`; unknown code falls back to `ApiError.message`.
- [ ] Every chained PR includes a manual verification checklist covering happy + failure paths.
- [ ] No `z.number()` remains on any money field across the codebase after PR#0.

## Locked Constraints (from product decisions — do NOT re-open)

1. Slice 1 is `producer-bootstrap`, not `sales-stats`.
2. Money-fix ships as PR#0 (separate, prior).
3. Hand-written Zod mirrors from backend specs. NO OpenAPI codegen.
4. Error UX = `src/lib/errorMessages.ts` code map, Spanish neutral tone.
5. Producer scope only; consumer flows are out-of-scope for this change.
6. Delivery strategy is `force-chained`. Chain-strategy (stacked vs. feature-branch) resolved after `sdd-tasks`.
