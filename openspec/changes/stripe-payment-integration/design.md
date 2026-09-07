# Design: Stripe Payment Integration

## Technical Approach

Replace mocks through the existing module-local API → Zod schema → TanStack Query hook pattern. `Elements` and `PaymentElement` collect card/3DS data; backend status remains authoritative.

## Architecture Decisions

| Option | Tradeoff | Decision / rationale |
|---|---|---|
| Payment Element; `redirect: 'if_required'` | Requires two correlation paths | Use `elements.submit()` then `stripe.confirmPayment`; both paths converge on `/checkout/procesando?payment_intent=…`. Embedded Checkout and non-card methods are excluded. |
| Intent on validated payment transition | Changes invalidate the intent | Refresh cart, modes, and addresses first. After validation, create the intent. Later cart/delivery/address changes clear `clientSecret`, unmount Elements, and require explicit recreation; a decline keeps Elements reusable. |
| Module-scope Stripe bootstrap | Configuration can be absent | Validate a `pk_` publishable key and call `loadStripe` outside components. Missing/invalid configuration renders an unavailable state; no Elements mount or confirmation occurs. |
| One address cache for profile and checkout | Mutations can invalidate checkout selection | Use the owner-scoped address CRUD contract and one query-key factory. Successful writes invalidate the shared list; checkout clears a selected ID absent from refreshed active addresses. |
| Manual-only assurance | Less regression automation | Do not add a test runner. Every slice runs lint/build and records reproducible browser, Postman, and Stripe test-mode evidence. |

## Data Flow

```text
authenticated purchaser → fresh cart → delivery modes + shared addresses
  → POST intent(selections,addressId?) → clientSecret → Elements/PaymentElement
  → single confirm → Stripe result or redirect query → protected processing route
  → GET status → PROCESSING bounded poll → authoritative outcome → owned order
```

`POST /pagos/intent` never receives amount, currency, totals, or card data. Money remains decimal strings. A synchronous ref and disabled/busy UI lock before `elements.submit()`; actionable errors release the lock. Raw card fields remain inside Stripe.

Local confirmation uses `paymentIntent.id`; redirects use Stripe's `payment_intent` query. Missing/malformed IDs fail safely. Poll immediately, then after `1,2,4,4,4,4,4,4,4` seconds, only for `PROCESSING`; abort on unmount/key change. `PENDING` allows manual retry; `FAILED` and `CANCELED` are distinct terminal outcomes. Only `SUCCEEDED` with `orderId` invalidates cart/orders and enables order navigation. Cancellation invalidates order list/detail; 401/auth loss clears protected caches.

`ProtectedRoutes allowedRoles={['CONSUMER','PRODUCER']}` encloses cart, checkout, processing, and purchaser orders. ADMIN returns to its role home; unauthenticated users go to login with pathname plus query as `returnTo`.

Profile and checkout consume `addressKeys.all()` through `useAddressesQuery`. `POST`, `PATCH`, and `DELETE` mutations invalidate that key; failures retain confirmed cache. Checkout revalidates the selected active address before intent creation. A deleted/default-changed address therefore converges in both screens without duplicated local state.

## File Changes

| Paths | Action / responsibility |
|---|---|
| `src/modules/carrito/{carrito.api,carrito.schema,carrito.queryKeys}.ts`, `hooks/use{CartQuery,AddCartItemMutation,UpdateCartItemMutation,RemoveCartItemMutation,ClearCartMutation}.ts` | Create cart boundary and hooks. |
| `src/modules/perfil/{direcciones.api,direcciones.schema,direcciones.queryKeys}.ts`, `hooks/use{AddressesQuery,CreateAddressMutation,UpdateAddressMutation,DeleteAddressMutation}.ts` | Create shared authenticated address CRUD, parsing, keys, and invalidation. |
| `src/modules/pedidos/{pagos.api,pagos.schema,pedidos.api,pedidos.queryKeys,stripeClient}.ts`, `hooks/use{DeliveryModesQuery,CreatePaymentIntentMutation,PaymentStatusQuery,ConsumerOrdersQuery,ConsumerOrderQuery,CancelConsumerOrderMutation}.ts` | Create intent/status/order boundaries and keys; modify `pedidos.schema.ts`. |
| `src/modules/pedidos/componentes/{CheckoutDeliveryStep,StripePaymentForm,PaymentOutcomePanel}.tsx`, `pages/PagoProcesandoPage.tsx` | Create focused checkout and outcome UI. |
| Cart/checkout/profile/order pages and modals; `DetalleProductoPage.tsx`; `AuthenticatedTopbar.tsx` | Replace mocks, wire add-to-cart/badge, and preserve layouts. |
| `AppRouter.tsx`, `ProtectedRoutes.tsx`, `api.ts`, `useAuthenticatedApi.ts`, `AuthSessionCacheGuard.tsx`, `main.tsx`, `errorMessages.ts`, `vite-env.d.ts`, `.env.example`, `package.json` | Add purchaser routes, return/query preservation, abort/cache behavior, errors, and Stripe configuration. |

Planned count: **32 created, 16 modified, 0 deleted**.

## Interfaces and Presentation

Schemas parse documented DTOs and exhaustive payment, order, sub-order, and `REFUNDED` states. Unknown control states fail closed.

Address API contracts are `GET|POST /users/me/addresses` and `PATCH|DELETE /users/me/addresses/:id`. Create sends `line1`, nullable `line2`, `city`, Spanish `postalCode`, `province`, optional two-letter uppercase `country` (default `ES`), and optional `isDefault`; PATCH is partial. GET returns active addresses default-first then newest; POST returns 201 and auto-defaults the first address; PATCH returns 200; DELETE returns 204, soft-deletes, and auto-promotes the newest sibling when required. Foreign/deleted IDs share an owner-safe 404; invalid default demotion returns 422.

`Elements` receives `clientSecret` and Appearance configuration: primary `#7a2e3a`, background `#ffffff`, text `#1c1b1b`, danger `#ba1a1a`, Inter, `4px` radius/spacing. Supported `.Input`, `.Label`, and `.Tab` rules refine borders/focus; iframe internals are never targeted.

## Verification

Each PR records commit/environment, case ID, setup, steps, expected/observed result, pass/fail, evidence link, and exact lint/build outcome. Matrices cover address ordering, first-default, partial update, 422 demotion, delete promotion, owner-safe 404, roles, cart readiness, delivery selection, missing key, success, decline, 3DS/redirect, duplicate submit, all payment states, timeout/retry, auth loss, cancellation, responsive layout, and sensitive-field absence.

## Threat Matrix

| Boundary | Applicability | Reason |
|---|---|---|
| Documentation-like paths | N/A | No execution/classification. |
| Git repository selection | N/A | No VCS integration. |
| Commit state | N/A | No VCS integration. |
| Push state | N/A | No VCS integration. |
| PR commands | N/A | Delivery is planned, not automated. |

## Migration / Rollout

No data migration. Use a draft/no-merge `feature-branch-chain`; each child targets its immediate parent and aims for ≤400 changed lines (800 maximum session review budget): (1) contracts, auth/cache, configuration; (2) cart and badge; (3) shared address CRUD and delivery; (4) intent, Elements, return/outcomes; (5) purchaser orders, cancellation, final evidence. Every slice builds and records dependency, rollback, and evidence. Revert a child on the tracker; merge only the complete verified tracker to `main`, so partial checkout never reaches `main`.

## Open Questions

None.
