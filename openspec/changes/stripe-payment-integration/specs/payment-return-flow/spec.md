# Payment Return Flow Specification

## Purpose

Define authoritative owner-scoped payment resolution.

## Requirements

### Requirement: Authoritative status lookup

The frontend MUST obtain `paymentIntentId` from Stripe confirmation or redirect query and call `GET /api/v1/pagos/status/:paymentIntentId`. It MUST treat only `{state:"SUCCEEDED",orderId}` as success; a redirect, Stripe result, or missing `orderId` MUST NOT imply success.

#### Scenario: Delayed webhook succeeds
- GIVEN status returns `PROCESSING` before the webhook creates an order
- WHEN a later bounded poll returns `SUCCEEDED` with `orderId`
- THEN polling MUST stop, cart/order caches MUST refresh, and the owned order MAY open

#### Scenario: Identifier is inaccessible
- GIVEN the identifier is missing, unknown, or unowned, or authentication is lost
- WHEN status lookup yields owner-scoped `404` or authentication failure
- THEN protected details MUST remain hidden and safe retry/sign-in guidance MUST appear

### Requirement: Distinct bounded outcomes

The frontend MUST poll only while `state` is `PROCESSING`, using a finite bound. At the bound it MUST present a recoverable pending state. It MUST present `PENDING`/`PAYMENT_NEEDS_REVIEW` as recoverable, and MUST distinguish terminal `FAILED` and `CANCELED` without an order link.

#### Scenario: Processing bound is reached
- GIVEN all permitted polls return `PROCESSING`
- WHEN the bound is reached
- THEN polling MUST stop without claiming success or terminal failure

#### Scenario: Payment needs review
- GIVEN status returns `PENDING` with `orderId: null`
- WHEN the response is shown
- THEN the user MUST receive recoverable review guidance and MAY retry status lookup

#### Scenario: Payment fails or is canceled
- GIVEN status returns `FAILED` or `CANCELED`
- WHEN the response is shown
- THEN polling MUST stop and the distinct terminal outcome MUST appear without an order link
