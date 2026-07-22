# Delta for error-message-registry

## ADDED Requirements

### Requirement: Central resolver function

The system SHALL expose a single resolver `resolveErrorMessage(error: unknown): string` from `src/lib/errorMessages.ts`. The resolver SHALL be the ONLY function producer pages call to translate an error into user-facing copy. Pages MUST NOT inspect `ApiError.payload.code` directly or build their own error strings.

#### Scenario: Producer page renders an error

- GIVEN any producer page catches an error from a query or mutation
- WHEN it renders the error state
- THEN the visible copy is exactly the return value of `resolveErrorMessage(error)`

### Requirement: Registered AppError codes map to Spanish messages

The registry SHALL be a `Record<string, string>` keyed by backend `AppError` codes and valued by neutral, professional Spanish messages. When the resolver receives an error where `error instanceof ApiError` AND `error.payload?.code` is a key in the registry, it SHALL return the mapped string.

#### Scenario: Known code returns mapped message

- GIVEN an `ApiError` with `payload.code === "PRODUCER_NOT_FOUND"` and the registry contains `"PRODUCER_NOT_FOUND": "No encontramos tu perfil de productor."`
- WHEN `resolveErrorMessage(error)` runs
- THEN it returns `"No encontramos tu perfil de productor."`

#### Scenario: Registry is a plain string map

- GIVEN the registry module `src/lib/errorMessages.ts`
- WHEN the module is imported
- THEN it exports a `Record<string, string>` such that adding a new code is a single-line addition and no other module needs edits to consume it

### Requirement: Fallback for unknown ApiError code

When the resolver receives an `ApiError` whose `payload?.code` is missing or is not a key in the registry, it SHALL return `error.message`.

#### Scenario: Unknown code falls back to ApiError message

- GIVEN an `ApiError` with `payload.code === "UNMAPPED_CODE"` (not in the registry) and `error.message === "Solicitud inválida."`
- WHEN `resolveErrorMessage(error)` runs
- THEN it returns `"Solicitud inválida."`

#### Scenario: ApiError with no payload code falls back

- GIVEN an `ApiError` with no `payload` or `payload.code === undefined` and `error.message === "Fallo de red."`
- WHEN `resolveErrorMessage(error)` runs
- THEN it returns `"Fallo de red."`

### Requirement: Generic fallback for non-ApiError inputs

When the resolver receives an input that is NOT an `ApiError` (any other `Error`, thrown string, `undefined`, `null`, or arbitrary object), it SHALL return a single generic Spanish fallback string defined by the module. It MUST NOT throw and MUST NOT leak internal error text such as stack traces or JSON dumps.

#### Scenario: Standard Error input

- GIVEN a plain `new Error("boom")` is passed to the resolver
- WHEN `resolveErrorMessage(error)` runs
- THEN it returns the module's generic Spanish fallback (e.g. `"Ocurrió un error inesperado."`) and does not throw

#### Scenario: Non-Error input

- GIVEN the resolver is called with `undefined`, `null`, a string, or an arbitrary object
- WHEN `resolveErrorMessage(error)` runs
- THEN it returns the same generic Spanish fallback and does not throw

### Requirement: i18n-ready shape

The registry SHALL be structured so a future locale can be added without changing the resolver's public signature. For this change there is one locale (Spanish neutral). The single-locale implementation SHALL keep code-to-message pairs in a shape that can be trivially wrapped by `t(code)` or indexed by locale later (for example `{ [code]: string }` per locale, or a flat map that a future adapter can key by locale).

#### Scenario: Adding a locale is additive

- GIVEN the current single-locale registry
- WHEN a future change adds a second locale
- THEN the resolver's signature `resolveErrorMessage(error: unknown): string` does NOT change and existing call sites in producer pages require no edits
