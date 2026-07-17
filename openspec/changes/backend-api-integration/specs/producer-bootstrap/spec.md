# Delta for producer-bootstrap

## ADDED Requirements

### Requirement: Fetch authenticated producer profile

The system SHALL fetch the authenticated producer's profile from `GET /producers/me` via a TanStack Query hook (`useProducerMeQuery`) that uses `useAuthenticatedApi()`. The producer profile SHALL populate `EditarPerfilPublicoPage` and `PerfilProductorPublicoPage` from server data instead of hardcoded values.

#### Scenario: Producer opens the profile page

- GIVEN a logged-in producer navigates to `EditarPerfilPublicoPage`
- WHEN the page mounts
- THEN `useProducerMeQuery` issues `GET /producers/me` with a bearer token and the page renders form fields prefilled from the response DTO

#### Scenario: Unauthorized fetch (401)

- GIVEN the producer's session is invalid or expired
- WHEN `useProducerMeQuery` runs
- THEN the query rejects with an `ApiError` where `status === 401` and the page renders an error state (no crash, no partial UI leaking cached values)

#### Scenario: Server failure (5xx)

- GIVEN the backend is unreachable or returns 5xx
- WHEN `useProducerMeQuery` runs
- THEN the query rejects with an `ApiError` and the page renders an error state resolved through the error-message-registry

### Requirement: Update authenticated producer profile

The system SHALL update the authenticated producer's profile through `PATCH /producers/me` via a TanStack Query mutation hook (`useUpdateProducerMeMutation`) that uses `useAuthenticatedApi()`. The mutation SHALL send only the editable fields defined by `ProducerProfileFormValues` and SHALL block submission when the form is invalid.

#### Scenario: Producer saves valid edits

- GIVEN a producer edits allowed fields in `EditarPerfilPublicoPage` and the form is valid
- WHEN the user submits
- THEN `useUpdateProducerMeMutation` issues `PATCH /producers/me` with the form payload and, on HTTP 2xx, the mutation resolves successfully

#### Scenario: Form validation blocks submit

- GIVEN a producer submits the form with a value that violates `ProducerProfileFormValues` (e.g. missing required field, wrong shape)
- WHEN the user clicks save
- THEN the form displays field-level errors, no `PATCH` request is issued, and the mutation is not triggered

#### Scenario: Backend rejects with a mapped AppError

- GIVEN the backend rejects the update with an HTTP 4xx `AppError` payload including `code`
- WHEN the mutation runs
- THEN the mutation rejects with an `ApiError` whose `payload.code` is preserved for the error-message-registry to translate into a user-facing message

### Requirement: Cache invalidation on successful update

The system SHALL invalidate the `['producer', 'me']` cache key on successful `useUpdateProducerMeMutation` so that every consumer of `useProducerMeQuery` observes the updated profile without a page reload.

#### Scenario: Successful save reflects in subsequent renders

- GIVEN `EditarPerfilPublicoPage` and `PerfilProductorPublicoPage` are mounted and both consume `useProducerMeQuery`
- WHEN `useUpdateProducerMeMutation` completes with HTTP 2xx
- THEN `['producer', 'me']` is invalidated and both pages re-render with the updated profile data on the next render cycle, with no manual refetch call from page code

#### Scenario: Failed save leaves cache intact

- GIVEN the mutation rejects with an `ApiError`
- WHEN error handling runs
- THEN `['producer', 'me']` is NOT invalidated and consumers continue to see the last successfully fetched profile

### Requirement: User feedback on save

The system SHALL surface an explicit success signal in the UI on HTTP 2xx save (visible confirmation, not silent) and SHALL surface an error signal on failure using the message resolved by the error-message-registry.

#### Scenario: Success feedback visible

- GIVEN the producer submits a valid edit
- WHEN the mutation resolves with HTTP 2xx
- THEN the page renders a visible success indicator distinguishable from the idle state (e.g. toast, inline confirmation, or state change on the save button)

#### Scenario: Failure feedback uses the registry message

- GIVEN the mutation rejects with an `ApiError`
- WHEN error handling runs
- THEN the page renders the string returned by `resolveErrorMessage(error)` from the error-message-registry in a visible error location
