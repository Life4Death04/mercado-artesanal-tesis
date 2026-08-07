# Cart Integration Specification

## Purpose

Define frontend use of the authenticated cart contract.

## Requirements

### Requirement: Owner cart read and mutation

The frontend MUST use `GET /api/v1/carrito`, `POST /api/v1/carrito/items` (`productId`, `quantity`), `PATCH /api/v1/carrito/items/:itemId` (`quantity`), `DELETE /api/v1/carrito/items/:itemId`, and `DELETE /api/v1/carrito`. It MUST preserve string `unitPriceSnapshot` and `product.price`, use server `isAvailable` and stock, and refresh all cart-derived views after successful mutations.

#### Scenario: Cart mutation converges
- GIVEN a CONSUMER or PRODUCER performs a valid cart mutation
- WHEN the server accepts it
- THEN the cart, badge, and checkout MUST show the refreshed server state

#### Scenario: Owner-safe mutation failure
- GIVEN an item is unknown/unowned or quantity exceeds stock
- WHEN the server returns `NOT_FOUND`, `QUANTITY_EXCEEDS_STOCK`, or validation failure
- THEN the frontend MUST retain no false success and MUST show a corrective state

### Requirement: Checkout readiness and access

The frontend MUST allow cart, checkout, and payment navigation only for authenticated CONSUMER and PRODUCER users. It MUST exclude ADMIN, clear protected cart presentation after authentication loss, and MUST NOT begin checkout from a missing, empty, unavailable, or stale cart.

#### Scenario: Cart is unavailable or empty
- GIVEN `GET /carrito` has no items, or an item has `isAvailable: false`
- WHEN checkout is requested
- THEN payment MUST remain blocked and the current cart state MUST be shown

#### Scenario: Access is unavailable
- GIVEN the user is ADMIN or authentication is lost
- WHEN a cart or checkout route is requested
- THEN protected cart content MUST NOT render and access MUST be denied safely
