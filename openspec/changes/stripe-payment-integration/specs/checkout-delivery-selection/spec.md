# Checkout Delivery Selection Specification

## Purpose

Define delivery-mode and shared-address behavior before payment.

## Requirements

### Requirement: Delivery selection bijection

The frontend MUST read `GET /api/v1/pagos/delivery-modes` as `{producerId,modes[]}`, where each mode has `id`, `name`, `type: shipping|pickup`, and string `price`. It MUST submit exactly one `{producerId,deliveryModeId}` for every current cart producer and MUST block stale, inactive, mismatched, duplicate, or missing selections.

#### Scenario: Complete multi-producer selection
- GIVEN every cart producer has an active selected mode
- WHEN checkout is validated
- THEN `deliverySelections` MUST bijectively match the cart producer set

#### Scenario: Selection becomes invalid
- GIVEN a producer or selected mode changes before payment
- WHEN checkout revalidates
- THEN invalid selections MUST be cleared and intent creation MUST remain blocked

### Requirement: Authenticated address semantics

Profile and checkout MUST use `GET /api/v1/users/me/addresses` as one authenticated source with `id`, `line1`, nullable `line2`, `city`, `postalCode`, `province`, two-letter `country`, and `isDefault`. Checkout MUST submit only an owned active `addressId` when any mode is `shipping`; it MUST omit `addressId` for pickup-only checkout.

#### Scenario: Shipping uses an owned address
- GIVEN at least one selection has type `shipping`
- WHEN the user continues
- THEN a selected authenticated `addressId` MUST be submitted

#### Scenario: Pickup omits address
- GIVEN every selection has type `pickup`
- WHEN the user continues
- THEN checkout MUST NOT require or submit `addressId`

#### Scenario: Address is invalid
- GIVEN the address is missing, deleted, unknown, or unowned
- WHEN intent creation returns `VALIDATION_FAILED`
- THEN payment MUST remain blocked without revealing address ownership
