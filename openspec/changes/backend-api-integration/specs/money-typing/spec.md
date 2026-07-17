# Delta for money-typing

## ADDED Requirements

### Requirement: Money fields typed as string in schemas

All money fields in Zod schemas across the codebase SHALL be typed as `z.string()`. This applies to `precio` in `src/modules/productos/productos.schema.ts`, `total` in `src/modules/pedidos/pedidos.schema.ts`, and any future money field introduced by later slices. Using `z.number()` for a money field is prohibited.

#### Scenario: Existing schemas updated

- GIVEN `productos.schema.ts` and `pedidos.schema.ts` currently declare `precio` and `total` as `z.number()`
- WHEN this change lands
- THEN both fields are declared as `z.string()` and the inferred DTO types expose these fields as `string`

#### Scenario: New money field in a future slice

- GIVEN a subsequent producer slice introduces a new money field (e.g. `subtotal`, `unitPrice`)
- WHEN the schema is authored
- THEN the field is declared as `z.string()` and the reviewer rejects any `z.number()` declaration for money

### Requirement: No client-side arithmetic on money strings

The system MUST NOT perform numeric arithmetic (`+`, `-`, `*`, `/`, `parseFloat`, `Number(...)` for math, `.toFixed`) on money strings received from the backend. Aggregations, totals, and multiplications on money SHALL be sourced from backend-computed fields.

#### Scenario: Cart total sourced from server

- GIVEN a page displaying a total (e.g. `CarritoPage`, order summary)
- WHEN it renders
- THEN the displayed total is read from a server-provided money-string field and is NOT computed by multiplying or summing unit prices in the client

#### Scenario: PR#0 sweep removes numeric math on money

- GIVEN existing consumer code in `src/modules/carrito/**` performs numeric math on money-typed fields
- WHEN PR#0 lands
- THEN no arithmetic expressions operate on money-string fields in that module and the type-checker (`tsc -b`) surfaces any missed call site

### Requirement: Display formatting at the render site

The system SHALL format money for display using `Intl.NumberFormat` at the component that renders it. Formatting helpers MAY be shared, but the input to formatting SHALL always be a money-string value converted for display only (never persisted back or reused for math).

#### Scenario: Price rendered in a product card

- GIVEN a component renders a `precio` field
- WHEN it renders
- THEN the displayed string is produced by an `Intl.NumberFormat` call fed the money string, and the raw string is not shown unformatted

#### Scenario: Formatted display value is not reused for math

- GIVEN a component formats a money value for display
- WHEN it uses the formatted string
- THEN the formatted string is used ONLY for rendering and is not parsed back into a number, stored, or used as input to another calculation

### Requirement: No NaN or undefined leaks in money UI

After PR#0, no producer or consumer page reachable from the current routes SHALL render `NaN`, `undefined`, or `null` where a money value is expected.

#### Scenario: Manual smoke of money-rendering pages

- GIVEN the money-rendering pages reachable today (`CarritoPage`, product cards, order summaries)
- WHEN a reviewer walks the PR#0 verification checklist
- THEN every money display shows a formatted string and no page renders `NaN`, `undefined`, or `null` in a money slot

#### Scenario: TypeScript surfaces missed call sites

- GIVEN `precio` and `total` change from `z.number()` to `z.string()`
- WHEN `tsc -b` runs
- THEN any consumer that assumed `number` produces a type error, forcing an explicit fix in the same PR
