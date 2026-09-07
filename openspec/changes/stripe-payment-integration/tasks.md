# Tasks: Stripe Payment Integration

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 1,980–2,550 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1→PR2→PR3→PR4→PR5→PR6→PR7 |
| Delivery strategy | force-chained |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| PR / forecast | Base → finish | Verification / rollback |
|---|---|---|
| PR1 280–360 | tracker → foundation | `npm run lint && npm run build`; C04; revert session/config |
| PR2 280–360 | PR1 → cart | `npm run lint && npm run build`; C01–C03; revert cart |
| PR3a 141 source lines | PR2 → address contracts | `npm run lint && npm run build`; revert address API/schema/query-key/hooks |
| PR3b 418 source lines | PR3a → profile address UI | `npm run lint && npm run build`; A01–A06; revert profile address UI |
| PR4 260–340 | PR3 → delivery | `npm run lint && npm run build`; D01–D05; revert delivery |
| PR5 320–390 | PR4 → payment | `npm run lint && npm run build`; P01–P06; revert Stripe form |
| PR6 240–340 | PR5 → outcomes | `npm run lint && npm run build`; R01–R05; revert processing route |
| PR7 300–380 | PR6 → orders | `npm run lint && npm run build`; O01–O05; revert order UI/API |

PR1 targets tracker; each child targets its predecessor. Retarget polluted diffs; only verified tracker merges to `main`.

### PR3 Delivery Slice Status

- **PR3a — address contracts:** Autonomous contract/query-key/hook slice on `feat/stripe-payment-integration-pr3a-address-contracts`. It contains only the seven new address boundary files and the SDD split evidence; it is under the 450 changed-line native ceiling.
- **PR3b — profile address UI:** `PerfilPage.tsx` and `ProfileModals.tsx` were verified in the browser for CONSUMER and PRODUCER: A01–A06 all PASS. The retained `pr3b-addresses-ui` stash is a redundant backup and must not be mutated.
- **Task 2.1 remains checked:** PR3a `ffa27f3` is an ancestor of PR3b `c0e2e10`; both were merged into the tracker at `68c5589` (merges #19/#20). Administrator is intentionally out of scope because it has no commerce or commerce-management functions.

## Phase 1: Foundation and Cart

- [x] 1.1 PR1 — Start: auth/session. CREATE `src/modules/auth/componentes/AuthSessionCacheGuard.tsx` and `src/modules/pedidos/stripeClient.ts`; MODIFY `src/{main.tsx,routes/ProtectedRoutes.tsx,lib/{api,errorMessages}.ts,modules/auth/{componentes/AuthProvider.tsx,hooks/useAuthenticatedApi.ts}}`, `.env.example`, `vite-env.d.ts`, `package.json`. Finish: guard preserves path+query; AbortSignal/cache clear on auth loss; key fail-closed; `main.tsx` wires cache guard only. Manual C04: ADMIN/sign-out request hides content and preserves safe return.
- [x] 1.2 PR2 — Start: cart mocks. CREATE `src/modules/carrito/{carrito.api,carrito.schema,carrito.queryKeys}.ts` and hooks; MODIFY `src/modules/{carrito/pages/CarritoPage.tsx,productos/pages/DetalleProductoPage.tsx}`, `src/componentes/layout/AuthenticatedTopbar.tsx`. Finish: server cart/badge. Manual C01–C03: valid/rejected mutation, empty/unavailable; refresh, corrective error, blocked checkout.

## Phase 2: Addresses and Delivery

- [x] 2.1 PR3 — Start: profile address mocks. CREATE `src/modules/perfil/{direcciones.api,direcciones.schema,direcciones.queryKeys}.ts` and address hooks; MODIFY `src/modules/perfil/{pages/PerfilPage.tsx,componentes/ProfileModals.tsx}`. Finish: shared cache. Manual A01–A06: first/default, partial edit, ordering, 422 demotion, delete promotion, owner-safe 404; retain server state.
- [x] 2.2 PR4 — Start: fresh cart/address cache. CREATE `src/modules/pedidos/{pagos.api,pagos.schema,hooks/useDeliveryModesQuery.ts,componentes/CheckoutDeliveryStep.tsx}`; MODIFY `src/modules/pedidos/pages/CheckoutPage.tsx`. Finish: one active mode/producer. Static milestone complete; maintainer-observed Manual D01–D05 browser verification PASS: complete/changed selections, shipping, pickup omission, invalid address; require bijection and hide ownership.

## Phase 3: Payment and Return

- [x] 3.1 PR5 — Start: valid checkout. CREATE `src/modules/pedidos/{hooks/useCreatePaymentIntentMutation.ts,componentes/StripePaymentForm.tsx}`; MODIFY `src/modules/pedidos/pages/CheckoutPage.tsx`. Finish: module-local dynamic-`clientSecret` `Elements`, card-only lock, stale-secret recovery; never mount Elements in `main.tsx`. Manual P01–P06: intent/rejection, 3DS/redirect, decline, duplicate submit, missing key; guidance/no sensitive values.
- [x] 3.2 PR6 — Start: Stripe intent ID. CREATE `src/modules/pedidos/{hooks/usePaymentStatusQuery.ts,pages/PagoProcesandoPage.tsx,componentes/PaymentOutcomePanel.tsx}`; MODIFY `src/routes/AppRouter.tsx`. Finish: bounded authoritative outcome. Static verification complete; Manual R01–R05 remain pending maintainer browser observation.

## Phase 4: Purchaser Orders and Closure

- [x] 4.1 PR7 — Start: purchaser order mocks. CREATE `src/modules/pedidos/{pedidos.api,pedidos.queryKeys}.ts` and order hooks; MODIFY `src/modules/pedidos/{pedidos.schema.ts,pages/HistorialPedidosPage.tsx,componentes/ConsumerOrderModals.tsx}`. Finish: cache-safe reads/cancellation. Manual O01–O05: list/detail, 404, cancel success/rejection, auth loss; preserve server state.
- [ ] 4.2 Each PR records environment/commit/case/evidence; verify responsive keyboard labels/errors and no raw card/secret values before tracker merge. PR8 completed an honest partial static audit, but required per-PR environment records and evidence links/captures for PR1–PR7 are unavailable; see `apply-progress.md`.
