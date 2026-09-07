# Consumer Orders Read Specification

## Purpose

Define authenticated purchaser order history, detail, and cancellation.

## Requirements

### Requirement: Owner-scoped order reads

For CONSUMER and PRODUCER purchasers, the frontend MUST read `GET /api/v1/pedidos` summaries (`id`, `createdAt`, string `totalAmount`, `status`, `producerCount`) and `GET /api/v1/pedidos/:id` detail (`payment.status`, `subOrders`, string `shippingCostSnapshot`, and `orderLines`). It MUST exclude ADMIN and MUST preserve backend values without client monetary derivation.

#### Scenario: History and detail load
- GIVEN an authenticated purchaser owns orders
- WHEN list and detail requests succeed
- THEN server summaries and nested detail MUST replace mocks

#### Scenario: Order is unknown or unowned
- GIVEN detail returns owner-scoped `404 NOT_FOUND`
- WHEN the response is handled
- THEN the same not-found state MUST appear without ownership disclosure

### Requirement: Order states and cancellation

The frontend MUST handle order `PENDING|PARTIAL|FULFILLED|CANCELLED`, sub-order `pending|preparing|sent|delivered|cancelled`, and payment `PENDING|SUCCEEDED|FAILED|CANCELED|REFUNDED` distinctly. It MUST call `PATCH /api/v1/pedidos/:id/cancelar` only for an owned `PENDING` order and refresh list/detail caches after success.

#### Scenario: Cancellation succeeds
- GIVEN an owned order is `PENDING`
- WHEN cancellation succeeds
- THEN list and detail MUST refresh to the returned `CANCELLED` state

#### Scenario: Cancellation is rejected
- GIVEN cancellation returns `INVALID_ORDER_TRANSITION` or owner-scoped `NOT_FOUND`
- WHEN the response is handled
- THEN server state MUST remain authoritative and a safe error MUST appear

#### Scenario: Authentication is lost
- GIVEN an order operation returns an authentication failure
- WHEN the response is handled
- THEN protected order caches MUST no longer be presented
