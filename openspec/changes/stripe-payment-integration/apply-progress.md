# Apply Progress: Stripe Payment Integration

## PR1 Foundation

**Mode:** Standard (manual-only; `strict_tdd: false`)

PR1 implementation and C04 manual verification are complete.

### Authorized Correction: PR1-01 and PR1-02

- **PR1-01:** A single `clearAuthenticatedCache()` boundary now clears all TanStack Query query and mutation state on definitive logout, identity changes, Auth0 `login_required`/`consent_required` token failures, and authenticated API `401` responses.
- **PR1-01 retry:** The same classifier and boundary now cover bootstrap token acquisition plus `syncAuthenticatedUser()` and `getCurrentUser()` backend `401` failures.
- **C04 observed failure and correction:** A producer returning directly to a purchaser route lacked context because `ConsumerLayout` read `sidebar-owner` from local storage. It now derives producer-as-consumer presentation from cached authoritative current-user role data.
- **PR1-02:** `hasStripePublishableKey` reports only syntactic key validity; the module-scoped `stripePromise` catches Stripe loading failures and resolves to `null`.
- **Correction verification:** `npm run lint` and `npm run build` exited 0; `git diff --check` exited 0.

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused quality command | `npm run lint` — exit 0; 0 errors and 1 pre-existing React Compiler warning in `EditarPerfilPublicoPage.tsx` (`watch()`). |
| Build/runtime harness | `npm run build` — exit 0; TypeScript and Vite production build completed. Browser/Auth0 runtime scenario C04 is pending user evidence. |
| Rollback boundary | Revert Stripe dependencies/configuration, `stripeClient.ts`, auth cache/return handling, purchaser route guard, and payment error mappings from this PR1 slice only. |

### Manual Verification Checklist: C04 — Purchaser Access, Sign-out, and Safe Return

#### Setup

1. Use a local environment with valid `VITE_API_URL`, Auth0 variables, and a valid `VITE_STRIPE_PUBLISHABLE_KEY` only if the application configuration requires it. Do not place an `sk_` key in any client environment file.
2. Prepare three Auth0/backend users: one `CONSUMER`, one `PRODUCER`, and one `ADMIN`.
3. Start the application with `npm run dev` and record the branch name and commit SHA (or `uncommitted PR1 foundation`) in the evidence.
4. In browser developer tools, enable the Network panel with “Preserve log” and the React Query inspector if available.

#### C04-A: Purchaser access and ADMIN exclusion

1. Sign in as the CONSUMER and open `/carrito?case=C04-consumer`, `/checkout?case=C04-consumer`, and `/pedidos?case=C04-consumer`.
2. Repeat step 1 as the PRODUCER.
3. Sign out, then sign in as the ADMIN and request the same three URLs.

**Expected results:** CONSUMER and PRODUCER may reach the purchaser route shells. ADMIN is redirected to `/admin`; cart, checkout, and purchaser-order content does not render. Existing producer and admin areas remain available for their respective roles.

For a PRODUCER who returns to `/checkout?case=C04-return&source=manual`, the consumer navigation MUST show “Área consumidor · Productor” and “Volver al panel productor”.

**Capture:** URL before and after each navigation, screenshot/video of the rendered destination, authenticated role identity, and Network entries proving no purchaser API response is displayed to ADMIN.

#### C04-B: Authentication loss clears protected presentation

1. Sign in as CONSUMER or PRODUCER and open a protected purchaser URL with a query, for example `/checkout?case=C04-signout`.
2. Trigger a normal Auth0 sign-out from the application, or expire/clear the Auth0 session using the test tenant controls.
3. Return to the protected URL while unauthenticated.

**Expected results:** protected route content is replaced by the login flow. No authenticated query or mutation state remains visible after authentication loss.

**Capture:** before/after screenshots, Network/console output, and React Query cache state (when available) showing query and mutation caches cleared.

#### C04-C: Safe return preserves pathname and query

1. While unauthenticated, request `/checkout?case=C04-return&source=manual`.
2. Complete login as CONSUMER or PRODUCER.
3. Confirm the post-login destination is exactly `/checkout?case=C04-return&source=manual`.
4. Repeat with an attempted external `returnTo` value through the login navigation state or callback state, such as `https://attacker.invalid/path` and `//attacker.invalid/path`.

**Expected results:** an internal protected request retains its pathname and query after successful login. External or protocol-relative return values are rejected and cannot navigate away from the application origin.

**Capture:** initial URL, Auth0 callback URL, final URL, browser origin, and screenshots/video for both rejection attempts.

### C04 Final Manual Result — PASS

| Field | Record |
|---|---|
| Date / branch | 2026-08-07 / `feat/stripe-payment-integration-pr1-foundation` |
| Initial observation | All C04 cases passed except producer safe return: checkout rendered but lacked producer-aware purchaser context. |
| Correction history | `ConsumerLayout` now derives producer-as-consumer mode from the authenticated backend role rather than `sidebar-owner` local storage. |
| Focused rerun | Maintainer-observed manual browser result: “Ahora funciona.” |
| Final observation | Producer safe return preserved the requested checkout pathname and query and displayed the producer-aware consumer sidebar with the return link. |
| Evidence source / limitation | Maintainer-observed manual browser result; no screenshot or video attachment was supplied in chat. |

### Task State

- [x] 1.1 PR1 foundation — implementation and C04 complete.

## PR2 Cart

**Mode:** Standard (manual-only; `strict_tdd: false`)

PR2 replaces local cart state with the authenticated cart API, Zod response boundary, TanStack Query cache, corrective mutation errors, and a server-derived cart badge. Checkout is unavailable for an empty or server-unavailable cart.

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused quality command | `npm run lint` — exit 0; 0 errors and 1 pre-existing React Compiler warning in `EditarPerfilPublicoPage.tsx` (`watch()`). |
| Runtime harness | `npm run build` — exit 0; TypeScript and Vite production build completed. Browser scenarios C01–C03 require maintainer observation and are not claimed as passed. |
| Rollback boundary | Revert `src/modules/carrito/{carrito.api,carrito.schema,carrito.queryKeys}.ts`, `src/modules/carrito/hooks/useCart.ts`, and the PR2 cart integrations in `CarritoPage.tsx`, `DetalleProductoPage.tsx`, and `AuthenticatedTopbar.tsx`. |

### Manual Verification Checklist: C01–C03

| Case | Steps | Expected result | Observed |
|---|---|---|---|
| C01 — valid mutation and refresh | Sign in as purchaser, add an available product, change its quantity, then reload `/carrito`. | Network uses cart item endpoints; page and topbar badge converge on the reloaded server cart. | Maintainer-observed manual browser result: confirmed passing. |
| C02 — corrective mutation failure | Attempt a quantity above server stock or mutate a stale item. | No false success; confirmed cart remains visible and an actionable error is shown. | Maintainer-observed manual browser result: confirmed passing. |
| C03 — empty/unavailable checkout | Empty the cart, then repeat with a server item marked unavailable. | Empty state renders; unavailable item remains visible with guidance and checkout is blocked. | Maintainer-observed manual browser result: confirmed passing. |

### PR2 Final Manual Result — PASS

| Field | Record |
|---|---|
| Final observation | Maintainer confirmed the cart flow (C01–C03) works in the browser: valid mutation/refresh, corrective mutation-failure handling, and empty/unavailable checkout blocking all behave as specified. |
| Evidence source / limitation | Maintainer-observed manual browser result; no screenshot or video attachment was supplied in chat. |

### Task State

- [x] 1.2 PR2 cart — implementation, bounded checks, and maintainer-confirmed C01–C03 browser pass are complete.

## PR3 Addresses — Original Candidate Evidence

**Mode:** Standard (manual-only; `strict_tdd: false`)

The original PR3 candidate replaces the profile's hardcoded address list with the authenticated address-book CRUD
(`GET/POST/PATCH/DELETE /api/v1/users/me/addresses`), a Zod response boundary, one shared
`addressKeys` query-key factory, and TanStack Query hooks. Profile is now the first consumer of
the shared address cache that checkout (PR4) will also read.

### Backend Contract Confirmation

Verified directly against the backend repository (not assumed) before writing the Zod schema:

- Response fields (`src/modules/addresses/services/addresses.service.ts` + Prisma `Address`
  model): `id` (cuid string), `userId`, `line1`, `line2` (nullable string), `city`, `postalCode`,
  `province`, `country`, `isDefault` (boolean), `createdAt`/`updatedAt` (ISO strings),
  `deletedAt` (null for active rows — the controller returns the full Prisma row, no field
  stripping). The frontend schema only requires the UI-consumed subset and uses `.passthrough()`
  so the extra fields never break parsing.
- Create body (`AddressBaseSchema` in `addresses.controller.ts`): `line1` non-empty, `line2`
  nullable/optional, `city` non-empty, `postalCode` must match `^\d{5}$` (Spanish 5-digit),
  `province` non-empty, `country` optional 2-letter (defaults `ES` server-side — omitted from the
  UI since this is a Spain-only project), `isDefault` optional boolean. Update body is the same
  shape, `.partial()`.
- Error codes confirmed against `src/shared/errors/errors.ts`: `NOT_FOUND` (404, owner-safe on
  foreign/deleted/unowned IDs), `INVALID_DEFAULT_TRANSITION` (422, demoting the current default
  without promoting another), `ADDRESS_DEFAULT_CONFLICT` (409, concurrent-write race on the
  partial unique index). All three — plus `VALIDATION_FAILED` — were **already** present in
  `src/lib/errorMessages.ts` before this PR; no new error codes were added, so no risk of
  repeating the "frontend assumes a field the backend doesn't return" bug from a prior PR.

### Files Changed

| File | Action | Lines | What Was Done |
|---|---|---|---|
| `src/modules/perfil/direcciones.schema.ts` | Created | 49 | Zod `addressSchema`/`addressListSchema` (response) and `createAddressInputSchema`/`updateAddressInputSchema` (request), matching the confirmed backend shape exactly. |
| `src/modules/perfil/direcciones.api.ts` | Created | 24 | `getAddresses`/`createAddress`/`updateAddress`/`deleteAddress` — URL building + Zod parsing, `AbortSignal` accepted for the list read. |
| `src/modules/perfil/direcciones.queryKeys.ts` | Created | 3 | `addressKeys.all()` — the one shared cache key for profile and future checkout. |
| `src/modules/perfil/hooks/useAddressesQuery.ts` | Created | 18 | Authenticated list query, `enabled` gated on Auth0 state. |
| `src/modules/perfil/hooks/useCreateAddressMutation.ts` | Created | 16 | Create mutation; invalidates `addressKeys.all()` only `onSuccess`. |
| `src/modules/perfil/hooks/useUpdateAddressMutation.ts` | Created | 16 | Update mutation (used for both edit-save and mark-default); invalidates only `onSuccess`. |
| `src/modules/perfil/hooks/useDeleteAddressMutation.ts` | Created | 15 | Delete mutation; invalidates only `onSuccess`. |
| `src/modules/perfil/componentes/ProfileModals.tsx` | Modified | 100 ins / 126 del | Removed the `alias`/`Destinatario`/decorative-phone mock fields (no backend equivalent); modal fields now map 1:1 to `line1`, `line2` (floor/door, nullable), `city`, `postalCode`, `province`, `isDefault`; added `error`/`isSaving` props so mutation failures/pending state surface in the modal instead of always closing on submit. |
| `src/modules/perfil/pages/PerfilPage.tsx` | Modified | 115 ins / 77 del | Removed the local mock `Address` type/state; wired `useAddressesQuery` + the three mutations; added loading/error/empty states for the address section; `AddressCard` now renders real fields (`city` as the editorial heading instead of the removed `alias`) and disables per-row actions while their mutation is pending. |

### Decisions and Deviations from Design

- **Alias field removed.** The backend `Address` model has no per-address label (`design.md`
  §"Interfaces and Presentation" lists the exact field set and it is not there). The mock UI's
  "Casa"/"Trabajo" alias was demo-only. `AddressCard` now uses `address.city` (uppercase) as the
  editorial heading in the same visual slot — this preserves the card's look without inventing
  data the backend doesn't store.
- **Decorative phone field removed.** It was already inert in the mock (no `value`/`onChange`,
  never sent) and has no backend field to bind to. Keeping a non-functional input that looks
  functional was judged worse than removing it.
- **`line2` now maps to floor/door**, not a concatenated "postal code + city" string as the mock
  did. This matches the backend's actual second address line more faithfully.
- **Two independent `useUpdateAddressMutation()` instances** in `PerfilPage` (`editAddressMutation`
  for the modal, `markDefaultMutation` for the inline "Marcar predeterminada" action) so a failure
  in one flow never shows a stale error in the other, and each can compute its own per-row pending
  state via `mutation.variables`.
- **No optimistic updates.** Every mutation invalidates `addressKeys.all()` only `onSuccess`; a
  failed mutation leaves the previously confirmed server list untouched, satisfying design.md's
  "failures retain confirmed cache" requirement by construction (nothing to roll back).
- **422 demotion path is real, not simulated.** Editing the current default address and
  unchecking "Marcar como dirección predeterminada" sends `PATCH {isDefault:false}` on the
  default address, which the backend correctly rejects with `INVALID_DEFAULT_TRANSITION` (422).
  The edit modal surfaces this through its `error` prop (mapped via `resolveErrorMessage`) and
  stays open so the user can correct it instead of promoting another address first.

### Historical Review Workload Flag — Resolved by PR3a/PR3b Split

The original candidate measured **559 changed lines** (`356 insertions + 203 deletions` per
`git diff --numstat` including untracked new files), against the assigned target (~400) and
**hard ceiling (450)**. The maintainer authorized a safe split rather than a size exception.

- New files (schema/api/keys/hooks): 141 lines — lean, additive only.
- Modified files (`ProfileModals.tsx` + `PerfilPage.tsx`): 418 changed lines — this is where the
  overage comes from. It is driven by the `alias`-field removal forcing a coupled rewrite of both
  the modal field set and the card/query wiring in the same slice; splitting it further would
  leave the UI referencing a mock `Address` shape that no longer type-checks against the modals,
  or vice versa.
- Both `npm run lint` and `npm run build` passed on the original candidate (see Work Unit
  Evidence below). This was a **review-budget governance** issue, not a correctness issue.

The candidate was not committed, staged, pushed, or discarded. The maintainer authorized this
delivery path:

1. **PR3a — address contracts:** retain the 141 source-line API/schema/query-key/hook boundary
   in the worktree on `feat/stripe-payment-integration-pr3a-address-contracts`.
2. **PR3b — profile address UI:** preserve the two UI diffs in the path-scoped named Git stash
   `pr3b-addresses-ui`, restore it only on an immediate PR3a child branch, and then perform the
   A01–A06 browser matrix.

Task 2.1 below remains `[x]` because its original implementation and static-check milestone is
complete. This slicing continuation does not mark any additional product task complete; A01–A06
remain pending until PR3b UI is restored and browser-tested.

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused quality command | `npm run lint` — exit 0; 0 errors and 1 pre-existing React Compiler warning in `EditarPerfilPublicoPage.tsx` (`watch()`), unrelated to this PR. |
| Runtime harness | `npm run build` — exit 0; TypeScript project build (`tsc -b`) and Vite production build both completed. Browser scenarios A01–A06 require maintainer observation and are not claimed as passed. |
| `git diff --check` | Exit 0 — no whitespace errors. |
| Rollback boundary | Revert `src/modules/perfil/{direcciones.api,direcciones.schema,direcciones.queryKeys}.ts`, `src/modules/perfil/hooks/use{Addresses,CreateAddress,UpdateAddress,DeleteAddress}*.ts`, and the PR3 address integrations in `PerfilPage.tsx` and `ProfileModals.tsx`. No cart, checkout, payment, or order code was touched. |

### Manual Verification Checklist: A01–A06 (pending maintainer browser observation)

| Case | Steps | Expected result | Observed |
|---|---|---|---|
| A01 — first address auto-defaults | With zero saved addresses, add one via "Añadir dirección". | The new address is created with `isDefault: true` without checking the box. | Pending maintainer browser observation. |
| A02 — partial edit | Edit an existing address, changing only `city`. | `PATCH` sends only the changed field(s); other fields on the address are unchanged after refresh. | Pending maintainer browser observation. |
| A03 — default-first, newest ordering | Create two non-default addresses, then mark the second as default. | The list reorders default-first, then newest-first among the rest, after refetch. | Pending maintainer browser observation. |
| A04 — 422 demotion | Edit the current default address and uncheck "Marcar como dirección predeterminada". | Save is rejected; the modal stays open showing "Esta transición de estado no está permitida."; no client-side state changes. | Pending maintainer browser observation. |
| A05 — delete auto-promotion | Delete the current default address while another exists. | The deleted address disappears; the newest remaining address becomes default after refetch. | Pending maintainer browser observation. |
| A06 — owner-safe 404 | Trigger a delete/edit on an address ID that no longer exists (e.g. deleted in another tab, then retried). | A generic "No encontramos el recurso solicitado." error appears; no ownership details are leaked. | Pending maintainer browser observation. |

### Task State

- [x] 2.1 PR3 addresses — implementation and static checks (`npm run lint`, `npm run build`,
  `git diff --check`) complete. A01–A06 browser evidence pending in PR3b.

## PR3a Address Contracts — Delivery Slice Preparation

**Mode:** Standard (manual-only; `strict_tdd: false`)

**Chain strategy:** Feature-branch-chain. PR3a is the current autonomous child and targets its
immediate PR2 predecessor; PR3b must target PR3a, never `main`.

### Scope and Preservation

| Item | Result |
|---|---|
| PR3a worktree scope | `direcciones.api.ts`, `direcciones.queryKeys.ts`, `direcciones.schema.ts`, and the four address hooks only, plus SDD split artifacts. |
| PR3b preservation | Named path-scoped stash `stash@{0}` (`pr3b-addresses-ui`) contains exactly `src/modules/perfil/pages/PerfilPage.tsx` and `src/modules/perfil/componentes/ProfileModals.tsx`. |
| Branch and review count | Renamed safely to `feat/stripe-payment-integration-pr3a-address-contracts`; final PR3a worktree count is 322 changed lines (141 source + 181 SDD artifact lines), below the 450 native ceiling. No staging, commit, push, dependency install, or backend change occurred. |
| Product task state | No additional task marked complete; task 2.1 remains checked from the original candidate. |

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused quality command | `npm run lint` — exit 0; 0 errors and 1 pre-existing React Compiler warning in `src/modules/productor/pages/EditarPerfilPublicoPage.tsx` (`watch()`), unrelated to PR3a. |
| Runtime harness | `npm run build` — exit 0; `tsc -b` and Vite completed. The Vite reporter warned that existing production chunks exceed 500 kB after minification. Browser A01–A06 are intentionally N/A for PR3a because it has no UI consumer; they remain pending for PR3b. |
| `git diff --check` | Exit 0 — no whitespace errors. |
| Rollback boundary | Revert only `src/modules/perfil/direcciones.{api,queryKeys,schema}.ts`, `src/modules/perfil/hooks/use{AddressesQuery,CreateAddressMutation,UpdateAddressMutation,DeleteAddressMutation}.ts`, and this PR3a split documentation. The independently preserved PR3b stash remains untouched. |

### Manual Verification State

A01–A06 are intentionally **pending**. They exercise the profile UI isolated in PR3b and must be
recorded after that stash is restored on the immediate PR3a child branch and browser-tested.

## PR3b Profile Address UI — Restoration and Static Validation

**Mode:** Standard (manual-only; `strict_tdd: false`)

**Chain strategy:** Feature-branch-chain. `feat/stripe-payment-integration-pr3b-address-ui` is the
immediate child of `feat/stripe-payment-integration-pr3a-address-contracts` at commit
`ffa27f33fcca3af0b5747b76603721469fe8f091` (tree
`fe5523ceab7b57aa03179e7ca8efd24ba5aeb427`); it must target PR3a, never `main`.

### Scope and Preservation

| Item | Result |
|---|---|
| Restored source scope | Applied (not popped) named stash `pr3b-addresses-ui` (`4b02269557095ba1d31fb62527e10dc0c75d0fd3`) and restored exactly `src/modules/perfil/componentes/ProfileModals.tsx` and `src/modules/perfil/pages/PerfilPage.tsx`. |
| Contract integration | The UI consumes the PR3a `Address` types, CRUD hooks, shared `addressKeys.all()` invalidation behavior, and safe error resolver. Mock aliases, recipient, phone, and local address state remain removed. |
| Bounded compatibility correction | The restored edit modal now constructs a partial `UpdateAddressInput`, sending only fields changed from the confirmed address. This satisfies A02 and avoids rewriting unchanged fields. |
| Preservation evidence | `git stash list` still reports `stash@{0}: ... pr3b-addresses-ui`; `git stash show --name-status 4b02269557095ba1d31fb62527e10dc0c75d0fd3` still lists the same two UI paths. Nothing was staged, committed, pushed, installed, or changed outside the two UI paths and this progress artifact. |
| Product task state | No additional product task was completed. `tasks.md` keeps 2.1 checked from the original implementation/static milestone. A01–A06 remain pending maintainer browser observation. |

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Whitespace check | `git diff --check` — exit 0; no whitespace errors. |
| Focused quality command | `npm run lint` — exit 0; 0 errors and 1 pre-existing React Compiler warning in `src/modules/productor/pages/EditarPerfilPublicoPage.tsx` (`watch()`). |
| Static build command | `npm run build` — exit 0; `tsc -b` and Vite completed. Vite warned that existing output chunks exceed 500 kB after minification. |
| Runtime harness | N/A for this static-validation preparation batch. Browser A01–A06 require maintainer observation and are not claimed. A parent-acquired native runtime attempt/ledger was neither acquired, settled, reset, nor mutated. |
| Rollback boundary | Revert only `src/modules/perfil/componentes/ProfileModals.tsx` and `src/modules/perfil/pages/PerfilPage.tsx` to the PR3a base; the address data layer, other feature slices, and retained named stash are independent. |

### Manual Verification State

A01–A06 remain **pending maintainer browser observation**. No browser evidence is claimed by this
static-validation batch.

### PR3 Final Browser and Merge Reconciliation

- Maintainer-supplied browser evidence: A01, A02, A03, A04, A05, and A06 are all **PASS** for CONSUMER and PRODUCER flows.
- ADMIN is intentionally out of scope: that role has no commerce or commerce-management functions.
- Merge lineage is verified: PR3a `ffa27f3` is an ancestor of PR3b `c0e2e10`; PR3b is an ancestor of tracker merge `68c5589` (merged PRs #19 and #20).
- The retained `pr3b-addresses-ui` stash is a redundant verified backup and was not applied, dropped, or otherwise mutated.

## PR4 Checkout Delivery Selection

**Mode:** Standard (manual-only; `strict_tdd: false`)

PR4 replaces checkout delivery mocks with a server-backed delivery step. It reads the current cart, shared authenticated address cache, and `GET /api/v1/pagos/delivery-modes`; local state represents at most one valid mode per current cart producer. Invalid or changed modes are excluded from the active selection and are cleared on explicit validation. A shipping selection requires an active cached address; pickup-only selections do not require or carry an address into the future intent boundary.

### Backend Contract Confirmation

- `GET /api/v1/pagos/delivery-modes` is authenticated and returns `[{ producerId, modes: [{ id, name, type: "shipping"|"pickup", price: string }] }]`; groups include every current cart producer, including `modes: []` when no active option exists.
- The backend maps persisted `SHIPPING_FLAT_RATE`/`PICKUP` to the lowercase checkout discriminator and serializes `price` with two decimal places as a string.
- `POST /api/v1/pagos/intent` (not called in PR4) validates a producer/mode bijection against the live cart and requires an owned, non-deleted `addressId` only when a resolved selected mode is shipping; pickup-only ignores `addressId`. Its owner-safe invalid-address outcome is `VALIDATION_FAILED` without ownership disclosure.

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Whitespace check | `git diff --check` — exit 0; no whitespace errors. |
| Focused quality command | `npm run lint` — exit 0; 0 errors and one pre-existing React Compiler `watch()` warning in `src/modules/productor/pages/EditarPerfilPublicoPage.tsx`. |
| Runtime harness | `npm run build` — exit 0; `tsc -b` and Vite production build completed. Vite reported the existing >500 kB post-minification chunk warning. At this static milestone, browser D01–D05 were pending maintainer observation and were not claimed as passed. The parent-acquired native runtime ledger was not acquired, settled, reset, or mutated. |
| Rollback boundary | Revert only `src/modules/pedidos/pagos.{api,schema}.ts`, `src/modules/pedidos/hooks/useDeliveryModesQuery.ts`, `src/modules/pedidos/componentes/CheckoutDeliveryStep.tsx`, and the checkout delivery wiring in `src/modules/pedidos/pages/CheckoutPage.tsx`; no payment-intent, Stripe Element, order, backend, or unrelated behavior is removed. |

### Manual Verification Checklist: D01–D05

| Case | Setup and steps | Expected result | Observed |
|---|---|---|---|
| D01 — complete selections | Use a cart with two producers and choose one active mode for each. | Continue becomes available only with exactly one valid selection per current producer. | Maintainer-observed browser result: PASS. |
| D02 — changed selection | Change the cart or deactivate/remove a selected producer mode, then attempt to continue. | The stale selection is cleared and checkout remains blocked until a current mode is selected. | Maintainer-observed browser result: PASS. |
| D03 — shipping address | Select at least one shipping mode. | A current saved address is required; an owned active address can be selected. | Maintainer-observed browser result: PASS. |
| D04 — pickup omission | Select pickup for every producer. | No address selector or address requirement appears; future intent payload omits `addressId`. | Maintainer-observed browser result: PASS. |
| D05 — invalid address | Delete the selected address in another tab, refresh, then attempt to continue. | The stale address is cleared, checkout remains blocked, and no ownership information is exposed. | Maintainer-observed browser result: PASS. |

### PR4 Final Manual Result — PASS

| Field | Record |
|---|---|
| Final observation | The maintainer formally reported D01, D02, D03, D04, and D05 all passing in real-browser testing. |
| Covered behavior | Complete producer-mode selection, stale-mode correction, shipping-address requirement, pickup-only address omission, and stale-address rejection behaved as specified. |
| Evidence source / limitation | Maintainer-observed real-browser result supplied in chat; no screenshot, video, network export, environment record, or commit SHA was supplied with the report. |
| Deployment limitation | The producer delivery-mode backend contract used by the auxiliary producer work unit exists only in the backend working tree at the time of this record and is not yet committed; independent deployability is not claimed. |

### Task State

- [x] 2.2 PR4 checkout delivery selection — implementation and static milestone complete; maintainer-observed D01–D05 browser verification PASS.

## PR5 Payment Element

**Mode:** Standard (manual-only; `strict_tdd: false`)

PR5 creates a server-authoritative payment intent only after the checkout's live cart, delivery selection, and address validation complete. Its Zod boundary accepts only `deliverySelections` and an optional shipping `addressId`, then parses only the returned `clientSecret`. The delivery step is unmounted and cannot be changed after a successful intent response. `Elements` is module-local, mounts only with that dynamic secret and a resolved valid Stripe instance, and is never mounted in `main.tsx`.

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Whitespace check | `git diff --check` and untracked-file checks — exit 0; no whitespace errors. |
| Focused quality command | `npx eslint src/modules/pedidos/hooks/useCreatePaymentIntentMutation.ts src/modules/pedidos/componentes/StripePaymentForm.tsx src/modules/pedidos/pages/CheckoutPage.tsx src/modules/pedidos/pagos.api.ts src/modules/pedidos/pagos.schema.ts` — exit 0; 0 errors, 0 warnings. |
| Full lint | `npm run lint` — exit 0; 0 errors and 1 pre-existing React Compiler warning in `src/modules/productor/pages/EditarPerfilPublicoPage.tsx` (`watch()`). |
| Build/runtime harness | `npm run build` — exit 0; TypeScript and Vite production build completed. Vite reported the existing >500 kB post-minification chunk warning. Browser/Stripe P01–P06 are pending maintainer observation; no runtime result is claimed and the parent-owned native runtime ledger was not mutated. |
| Rollback boundary | Revert only `src/modules/pedidos/pagos.{api,schema}.ts`, `src/modules/pedidos/hooks/useCreatePaymentIntentMutation.ts`, `src/modules/pedidos/componentes/StripePaymentForm.tsx`, and the PR5 payment wiring in `src/modules/pedidos/pages/CheckoutPage.tsx`. This removes intent creation and payment collection without changing delivery, cart, outcome-route, order, or backend behavior. |

### Manual Verification Checklist: P01–P06

| Case | Setup and steps | Expected result | Observed |
|---|---|---|---|
| P01 — intent creation and rejection | With a valid purchaser cart, complete delivery and continue; repeat with an empty, unavailable, stale, or invalid delivery/address state. | Valid state sends only delivery selections and conditional address ID, then shows Stripe's card form. Rejection leaves card collection unavailable and shows safe corrective guidance. | Pending maintainer browser/Network observation. |
| P02 — 3DS or redirect | Use a Stripe test card/payment setup that requires 3DS or redirect and submit through the Payment Element. | Stripe completes required authentication and returns to `/checkout/procesando` with only the payment intent reference. No order success is shown by PR5. | Pending maintainer Stripe test-mode observation. |
| P03 — declined card | Use a Stripe test card that is declined. | Stripe's actionable safe message appears, the form remains reusable, and no delivery/cart selection unlocks. | Pending maintainer Stripe test-mode observation. |
| P04 — duplicate confirmation | With a valid Payment Element, activate “Confirmar pago seguro” twice before the first request resolves. | The button and synchronous ref allow exactly one `elements.submit()`/`confirmPayment` attempt until it resolves. | Pending maintainer browser/Network observation. |
| P05 — unavailable publishable configuration | Start with missing, malformed, or Stripe-load-failed `VITE_STRIPE_PUBLISHABLE_KEY`; reach a valid payment intent state. | A fail-closed unavailable message appears; Elements and confirmation do not mount or send card data. | Pending maintainer browser observation. |
| P06 — sensitive-data and guidance review | Inspect the checkout DOM, browser console, Network request body, and visible UI during P01–P05. | No raw card fields or client secret are rendered/logged; the intent request contains no amount, currency, total, secret key, or card value; secure-payment guidance is visible. | Pending maintainer browser/Network observation. |

### Task State

- [x] 3.1 PR5 payment — implementation and required static verification complete. P01–P06 remain pending maintainer browser/Stripe test-mode observation.

## PR5 Robustness Correction

`PaymentElement` now fails closed until `onReady`; `onLoadError` shows generic recovery without logging Stripe details. `Elements` remounts per `clientSecret`; recovery and BFCache `pageshow.persisted` discard only the secret, preserve delivery/cart choices, return to delivery, and require an explicit fresh intent request. No route or backend changed.

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused ESLint | `npx eslint src/modules/pedidos/componentes/StripePaymentForm.tsx src/modules/pedidos/pages/CheckoutPage.tsx` — exit 0; 0 errors, 0 warnings. |
| Whitespace | `git diff --check` plus untracked-file checks — exit 0. |
| Full checks | `npm run lint` — exit 0; 0 errors, 1 pre-existing `watch()` warning. `npm run build` — exit 0; existing >500 kB chunk warning. |
| Runtime / rollback | Runtime N/A: no browser harness was available. Revert only the two payment-form/checkout correction paths to remove load recovery, remount, and BFCache reset. |

### Runtime Status

| Case | Observed status |
|---|---|
| P01 | First Stripe payment reached `/checkout/procesando`; route remains PR6 scope. Second Element session request returned 400; exact subtype was not captured. |
| P04 | Pending; no duplicate-confirmation result is claimed. |
| P05 | Static fail-closed handling passes; live Element load failure was observed, while missing/invalid-key browser coverage remains pending. |

### Task State

- [x] 3.1 PR5 payment — correction static verification passed; runtime cases remain pending.

### PR5 Final Maintainer Validation — Commit Authorization

- The maintainer formally validates the frontend PR5 changes and authorizes commits.
- A real Stripe test payment processed successfully.
- Return to the landing/login flow is expected because `/checkout/procesando` is PR6 scope; PR5 does not claim that return flow as fixed.
- Repeating an equivalent checkout confirmed a backend dependency: deterministic idempotency can return a terminal PaymentIntent. This remains a backend blocker and MUST NOT be represented as a frontend PR5 pass.
- The robustness correction safely reports Element load failure and offers fresh-intent recovery, but cannot override backend terminal-intent reuse.
- P02–P06 are not broadly claimed passed unless evidence already exists above.

## PR6 Payment Return Outcomes

**Mode:** Standard (manual-only; `strict_tdd: false`)

PR6 adds the authenticated `/checkout/procesando` route and an owner-scoped status boundary for
`GET /pagos/status/:paymentIntentId`. The page reads only a syntactically safe `pi_` query value,
uses the exact backend status DTO, and fails closed for malformed, missing, unknown, unowned, or
authentication-failed lookups. It never treats a Stripe redirect as success.

`PROCESSING` polls immediately, then at 1, 2, and bounded 4-second intervals until the 31-second
limit. Polling is aborted by query cancellation on unmount/key change and stops for every terminal
state or the timeout. `PENDING` and timeout have manual status-refresh guidance. `FAILED` and
`CANCELED` have distinct terminal guidance and no order navigation. Only the strict validated
`SUCCEEDED` DTO (`orderId` required) invalidates the existing cart cache and renders the `/pedidos`
link. PR7 order APIs/query keys do not exist in this boundary and were not invented.

### Backend Contract Confirmation

Read-only verification against `mercado-artesanal-backend` confirmed:

- Route: `GET /api/v1/pagos/status/:paymentIntentId`.
- DTO: `{ state: "PROCESSING"|"SUCCEEDED"|"FAILED"|"PENDING"|"CANCELED", orderId: string|null, code }`.
- `SUCCEEDED` only carries a non-null order ID; no linked order maps to `PENDING` +
  `PAYMENT_NEEDS_REVIEW`.
- Missing and unowned IDs both return the same owner-safe `404 NOT_FOUND`; unauthenticated polls
  return `401`.

### Work Unit Evidence

| Evidence | Result |
|---|---|
| Focused ESLint | `npx eslint src/modules/pedidos/hooks/usePaymentStatusQuery.ts src/modules/pedidos/pages/PagoProcesandoPage.tsx src/modules/pedidos/componentes/PaymentOutcomePanel.tsx src/modules/pedidos/pagos.api.ts src/modules/pedidos/pagos.schema.ts src/modules/pedidos/paymentStatus.queryKeys.ts src/routes/AppRouter.tsx` — exit 0; 0 errors, 0 warnings. |
| Whitespace | `git diff --check` plus each untracked source file checked with `git diff --no-index --check /dev/null <file>` — exit 0; no whitespace errors. |
| Full lint | `npm run lint` — exit 0; 0 errors and 1 pre-existing React Compiler `watch()` warning in `src/modules/productor/pages/EditarPerfilPublicoPage.tsx`. |
| Build | `npm run build` — exit 0; TypeScript and Vite production build completed; existing >500 kB chunk warning remains. |
| Runtime harness | N/A: no browser harness was available. The parent-owned native runtime token `sha256:3123bac70fbfb3fc85fd548a008a4580c6daf2d4395df619176b6a75e148e210` was not acquired, settled, reset, or mutated. |
| Rollback boundary | Revert only `src/modules/pedidos/{pagos.api.ts,pagos.schema.ts,paymentStatus.queryKeys.ts,hooks/usePaymentStatusQuery.ts,pages/PagoProcesandoPage.tsx,componentes/PaymentOutcomePanel.tsx}` and the `/checkout/procesando` route in `src/routes/AppRouter.tsx`; cart, checkout payment collection, PR7 order APIs, and backend behavior remain untouched. |

### Manual Verification Checklist: R01–R05

| Case | Setup and steps | Expected result | Observed |
|---|---|---|---|
| R01 — delayed authoritative success | Complete a Stripe test payment whose status first returns `PROCESSING`, then arrange a backend `SUCCEEDED` response with an owned `orderId`. | The page polls on the bounded schedule, stops at `SUCCEEDED`, invalidates the cart cache, and shows the order link only then. | Pending maintainer browser/Network observation. |
| R02 — inaccessible ID or auth loss | Open with a missing/malformed `payment_intent`, then use unknown/unowned ID; repeat after session loss. | No status/order details render; safe sign-in or checkout guidance appears and protected cache handling remains in force. | Pending maintainer browser/Network observation. |
| R03 — bounded processing timeout | Keep every authoritative response at `PROCESSING` for at least 31 seconds and inspect Network requests. | Polling stops at the bound and presents recoverable pending guidance; it does not claim success or failure. | Pending maintainer browser/Network observation. |
| R04 — review and safe retry | Return `PENDING` / `PAYMENT_NEEDS_REVIEW`, select “Volver a consultar”, then inspect the next read. | Review guidance makes no duplicate-payment claim; manual retry performs one safe status read and can resume bounded processing only if the backend returns `PROCESSING`. | Pending maintainer browser/Network observation. |
| R05 — failed/canceled and no false order link | Return `FAILED`, then `CANCELED`; also return any non-success state with no order ID and inspect visible links. | Each terminal outcome is distinct, polling stops, checkout recovery is offered, and no `/pedidos?orderId=…` link is rendered outside valid `SUCCEEDED` with owned `orderId`. | Pending maintainer browser/Network observation. |

### Task State

- [x] 3.2 PR6 outcomes — implementation and required static verification complete. R01–R05 browser/Stripe evidence remains pending maintainer observation.

### PR6 Polling Correction

Fresh-context review found four scheduling defects in the original polling hook. The correction uses
only scalar/stable effect dependencies, refuses to arm a timer while authentication is unavailable,
the query is fetching/error, or a manual retry is pending, and prevents overlapping retry/refetches.
Manual retry uses TanStack Query v5 `refetch({ cancelRefetch: false })`; cached `PROCESSING` cannot
restart polling until that explicit request succeeds. The deterministic state machine makes reads at
`t=0,1,3,7,11,15,19,23,27,31` seconds, performs the final `t=31` read, then presents timeout if it
remains `PROCESSING`.

| Evidence | Result |
|---|---|
| Focused ESLint | Same PR6 focused ESLint command — exit 0; 0 errors, 0 warnings. |
| Whitespace | `git diff --check` plus untracked-file checks — exit 0. |
| Full lint | `npm run lint` — exit 0; 0 errors and 1 pre-existing `watch()` warning. |
| Build | `npm run build` — exit 0; TypeScript/Vite completed; existing >500 kB chunk warning. |
| Runtime | N/A; no browser harness was run and the parent-owned native token was not mutated. |

### PR6 Final-Target Jitter Correction

Removed the wall-clock cutoff inside an already armed timer callback. An armed target always issues
its one non-overlapping `refetch({ cancelRefetch: false })`, including the final 31-second target;
the next state evaluation alone transitions a still-`PROCESSING` result to timeout. This preserves
legitimate cleanup before callback execution for unmount, authentication loss, error, fetch, or
terminal-state changes.

### PR6 Final Maintainer Validation — Commit Authorization

- The maintainer reports the complete R01–R05 flow working and formally validates PR6 for commits.
- Return remains authenticated on `/checkout/procesando`.
- The backend-authoritative processing/success flow, bounded polling, terminal states, inaccessible/auth-loss handling, review/retry guidance, and safe order link were accepted.
- Evidence is maintainer-observed browser testing; no screenshot, video, or Network export was supplied in chat.
- The separate backend terminal-PaymentIntent reuse issue remains an external dependency and is not claimed fixed by PR6.
