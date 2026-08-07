# Stripe Payment Element Specification

## Purpose

Define card-only Payment Element intent creation and confirmation.

## Requirements

### Requirement: Server-authoritative intent

The frontend MUST call `POST /api/v1/pagos/intent` with only `deliverySelections` and conditional `addressId`, and MUST accept `{clientSecret}`. It MUST NOT submit amount, currency, totals, raw card data, or secret keys; it MUST surface `EMPTY_CART_CHECKOUT`, `CART_ITEM_NOT_AVAILABLE`, `INSUFFICIENT_STOCK`, `VALIDATION_FAILED`, and `PAYMENT_INTENT_CREATION_FAILED` safely.

#### Scenario: Intent is created
- GIVEN the authenticated checkout is valid and non-empty
- WHEN intent creation succeeds
- THEN Payment Element MUST initialize from `clientSecret` without client monetary fields

#### Scenario: Intent is rejected
- GIVEN the cart, stock, selection, address, or authentication is invalid
- WHEN intent creation fails
- THEN card collection MUST remain unavailable and corrective guidance MUST appear

### Requirement: Card-only confirmation

The frontend MUST use Stripe Payment Element as the sole card-data surface, support required authentication including 3DS and redirect flows, and obtain `paymentIntentId` from Stripe confirmation or the redirect query. It MUST prevent concurrent duplicate submissions and MUST NOT represent Stripe confirmation alone as order success.

#### Scenario: Card requires 3DS or redirect
- GIVEN valid card details require additional authentication
- WHEN confirmation is submitted
- THEN Stripe MUST complete authentication and continue with a `paymentIntentId`

#### Scenario: Card is declined
- GIVEN Stripe declines the card without authoritative success
- WHEN confirmation resolves
- THEN the form MUST remain usable and show Stripe's safe actionable message

#### Scenario: Submit is repeated
- GIVEN confirmation is already in progress
- WHEN the user submits again
- THEN the duplicate submission MUST be ignored until the attempt resolves

#### Scenario: Stripe configuration is unavailable
- GIVEN the publishable key is missing/invalid or Stripe cannot initialize
- WHEN payment renders
- THEN confirmation MUST fail closed without exposing protected values or crashing
