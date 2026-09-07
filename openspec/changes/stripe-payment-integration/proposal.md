# Proposal: Stripe Payment Integration

## Intent

Replace hardcoded cart, checkout, address, and order flows with ready backend contracts. CONSUMER and PRODUCER can purchase; ADMIN cannot access cart, checkout, or payment routes.

## Scope

### In Scope
- Integrate cart, delivery, authenticated address, PaymentIntent, payment-status, order, and cancellation APIs.
- Use React Stripe.js `Elements` + `PaymentElement`; accept cards and 3DS only in the first frontend release.
- Make profile and checkout consume the same authenticated address source.
- Keep delayed webhook/manual-review outcomes recoverably pending. Success requires backend `SUCCEEDED` plus `orderId`.
- Replace affected mocks in cart, checkout, addresses, and consumer orders.

### Out of Scope
- All backend modifications.
- Stripe Embedded Checkout, non-card acceptance, refunds, and producer fulfillment.
- Automated TDD or test-runner installation.

## Capabilities

### New Capabilities
- `cart-integration`: Real cart behavior and checkout readiness.
- `checkout-delivery-selection`: Delivery selection and shared address.
- `stripe-payment-element`: PaymentElement card confirmation.
- `payment-return-flow`: Authoritative polling and pending outcomes.
- `consumer-orders-read`: Real order reads and cancellation.

### Modified Capabilities
None.

## Approach

Add Stripe.js and module-local API/schema/query layers. Guards permit CONSUMER and PRODUCER, excluding ADMIN. Create an address-aware intent, confirm through `PaymentElement`, then poll owner-scoped status; never infer success from redirects. Preserve server-authoritative totals and webhook-created orders. Use force-chained slices within an 800-line review budget.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `package.json`, `.env.example` | Modified | Stripe.js and publishable key. |
| `src/modules/carrito/` | Modified | Replace cart mocks. |
| `src/modules/perfil/`, `src/modules/pedidos/` | Modified | Address, checkout, return, orders. |
| `src/routes/AppRouter.tsx`, `src/lib/errorMessages.ts` | Modified | Guards, routes, errors. |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Delay/review is misreported | High | Bounded polling; require `SUCCEEDED` and `orderId`. |
| Role/address data diverges | Med | Central guards and one authenticated address source. |
| Manual-only verification misses regressions | Med | Run lint/build and record reproducible browser/Stripe matrices per slice. |

## Rollback Plan

Revert each frontend slice, remove its route and Stripe configuration, and restore the prior screen. Backend contracts remain unchanged.

## Dependencies

- Ready delivery, intent, status, webhook-order, and order-read backend contracts.
- Auth0/API connectivity, `VITE_STRIPE_PUBLISHABLE_KEY`, Stripe test mode, and a reachable webhook.

## Success Criteria

- [ ] CONSUMER and PRODUCER complete card/3DS flows; ADMIN is denied access.
- [ ] Cart, checkout, address, and order screens use authenticated backend data without mocks.
- [ ] Success appears only for backend `SUCCEEDED` with `orderId`; delayed/review states remain recoverable pending.
- [ ] Decline, 3DS, delay, review, role, and address cases have recorded results.
- [ ] Every chain slice passes `npm run lint` and `npm run build` within the 800-line review budget.
