# Delta for producer-api-client

## ADDED Requirements

### Requirement: JSON-only HTTP wrapper

The system SHALL expose a single JSON HTTP wrapper (`apiRequest<T>` in `src/lib/api.ts`) that all producer-domain hooks use. The wrapper SHALL surface a typed `ApiError` on non-2xx responses. Multipart or non-JSON transports are out of scope for this change.

#### Scenario: 2xx JSON response

- GIVEN a producer domain endpoint returns HTTP 200 with a JSON body
- WHEN a hook calls the wrapper for that endpoint
- THEN the wrapper resolves with the parsed JSON typed as `T`

#### Scenario: Non-2xx response surfaces ApiError

- GIVEN a producer domain endpoint returns HTTP 4xx or 5xx with a JSON error body
- WHEN a hook calls the wrapper for that endpoint
- THEN the wrapper rejects with an `ApiError` instance carrying `status`, `message`, and the parsed error `payload` (including `payload.code` when the backend returns an `AppError`)

### Requirement: Authenticated request template

The system SHALL provide `useAuthenticatedApi()` as the single template for producer-domain requests that require a bearer token. Every producer query and mutation hook SHALL obtain its token per request via `getAccessTokenSilently({ audience })` and MUST NOT read the token from module scope, storage, or Redux.

#### Scenario: Authenticated GET carries a fresh token

- GIVEN a logged-in producer with a valid Auth0 session
- WHEN a producer hook triggers a GET through `useAuthenticatedApi()`
- THEN the request is issued with `Authorization: Bearer <token>` where the token was fetched fresh via `getAccessTokenSilently({ audience })` for this request

#### Scenario: Missing or expired token

- GIVEN Auth0 cannot produce a valid access token (session expired or user logged out)
- WHEN a producer hook triggers a request through `useAuthenticatedApi()`
- THEN the hook surfaces the auth failure as an error state (no silent success, no request sent without a bearer)

### Requirement: TanStack Query hook naming and shape

The system SHALL expose all producer server-state access through TanStack Query hooks named `use{Entity}Query` for reads and `use{Entity}Mutation` for writes. Ad-hoc `fetch`, `useEffect`-based fetching, or Redux for server state are prohibited for producer domain data.

#### Scenario: Read hook exposes standard query state

- GIVEN a producer page needs entity data
- WHEN it consumes `use{Entity}Query()`
- THEN the hook returns the standard TanStack Query result shape (`data`, `isLoading`, `isError`, `error`, `refetch`) sourced from the shared `QueryClient`

#### Scenario: Write hook exposes standard mutation state

- GIVEN a producer page needs to persist a change
- WHEN it consumes `use{Entity}Mutation()`
- THEN the hook returns the standard TanStack Query mutation shape (`mutate`, `mutateAsync`, `isPending`, `isError`, `error`) and executes the underlying request through `useAuthenticatedApi()`

### Requirement: Cache key convention and invalidation

The system SHALL namespace TanStack Query cache keys per producer module (for example `['producer', 'me']`, `['producer', 'products', 'list']`). On successful mutation, the corresponding mutation hook SHALL invalidate the affected read keys so consumers observe fresh server state without manual refetch.

#### Scenario: Successful mutation invalidates the read key

- GIVEN a producer read hook has cached data under `['producer', '<entity>']`
- WHEN the matching `use{Entity}Mutation()` completes with an HTTP 2xx
- THEN the mutation's `onSuccess` invalidates `['producer', '<entity>']` and any queries consuming that key refetch and expose the updated data

#### Scenario: Failed mutation does not invalidate

- GIVEN a producer read hook has cached data under `['producer', '<entity>']`
- WHEN the matching mutation rejects with an `ApiError`
- THEN the cache under `['producer', '<entity>']` is NOT invalidated and the read hook continues to expose the last known good data

### Requirement: Co-located module layout

The system SHALL co-locate each producer domain's data layer inside its module directory using this layout: `{module}.api.ts` (endpoint functions), `{module}.schema.ts` (Zod schemas and DTO types), and `hooks/use{Entity}Query.ts` + `hooks/use{Entity}Mutation.ts`. Cross-module imports of `.api.ts` files are prohibited; consumers import hooks only.

#### Scenario: A new producer domain follows the layout

- GIVEN a new producer domain is being wired
- WHEN its data layer is added
- THEN the module contains `{module}.api.ts`, `{module}.schema.ts`, and `hooks/` in the same directory, and any external consumer imports only from `hooks/`

### Requirement: Response validation at the edge

The system SHALL treat DTO Zod schemas as the source of TypeScript types (`z.infer`) for producer responses and SHALL NOT runtime-parse every response. Runtime `schema.parse()` on responses is REQUIRED only for fields whose exact value determines a control-flow branch (for example role, order status, or moderation enums). Form inputs SHALL always be validated at the edge with the corresponding `*FormValues` schema before submission.

#### Scenario: Critical enum parsed at edge

- GIVEN a producer response includes an enum field that drives client control flow (e.g. order status)
- WHEN the response arrives
- THEN the hook parses that field through the Zod schema and rejects the response as `ApiError` if the value is not one of the declared enum members

#### Scenario: Form values validated before submit

- GIVEN a producer form bound to a `{module}FormValues` Zod schema
- WHEN the user submits invalid data
- THEN the form blocks submission, surfaces field-level errors, and no request is issued
