# Notifications MVP: Known Debt

## Accepted Demo Constraints

- The inbox displays the backend's latest 50 notifications. The demo is expected to stay below that limit, so pagination is intentionally not simulated in the UI.
- Opening the tray marks every loaded unread notification as read by calling `PATCH /api/v1/notifications/:id/read` for each ID. Requests run with bounded concurrency; no bulk endpoint is assumed.
- The frontend uses 30-second polling while the authenticated notification queries are mounted. Background-tab polling is disabled.
- Notification list and unread-count cache entries are scoped by the authenticated Auth0 subject to prevent transient data reuse when users change within the same browser session.

## Production Follow-ups

- **Pagination and count consistency:** add cursor pagination. The unread count currently covers all database rows while the list is capped at 50, so accounts above the demo limit could retain a badge that the UI cannot fully clear.
- **Real read-all operation:** add an owner-scoped, idempotent backend endpoint implemented transactionally instead of issuing one request per notification.
- **Typed payloads and deep links:** define a discriminated `data` contract per notification type and only then add navigation targets. Current producers store `data: null`, so the UI deliberately does not invent links.
- **Realtime updates:** replace or supplement polling with a supported SSE or WebSocket contract, including reconnect and authorization behavior.
- **Preferences:** define per-user controls for notification categories, channels, frequency, and quiet periods.
- **Durable external delivery:** move email or other external channels to an outbox/queue with retries, idempotency, delivery status, and observability instead of synchronous best-effort delivery.
- **Incident production coverage:** `INCIDENT_REPORTED` and `INCIDENT_RESOLVED` are declared but were not found among the current notification producers. Both remain blocked on backend incident-flow wiring.
- **Payload evolution:** version or backward-compatibly parse future notification payloads. The current UI safely falls back to a generic icon for unknown `type` values and ignores `data`.
