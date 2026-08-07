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
