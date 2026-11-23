# Client Integration Section

This is a scope outline for a separate protocol section, not a published or complete integration specification.

## Audience and purpose

Technical contacts implementing the receiving API/server or integrating their operator/CRM environment with Cellit or CellAirOne.

Clearly distinguish the external server/API responsibilities from device firmware behavior and from the illustrative presentation website.

## Proposed topics

1. Architecture and responsibilities: dashboard to server, and one bidirectional WebSocket per device between device and server.
2. Connection setup: client-provided server address, WebSocket endpoint agreement, network reachability, and secure deployment requirements.
3. Device identification: serial number and the initial boot report.
4. Common JSON envelope: Protocol version, Message type, Timestamp, and Data.
5. Connection Ping and server-received connection activity.
6. Settings delivery to a selected device.
7. Acceptance/rejection reports and device status updates.
8. Local activity start and live measurement batches.
9. One complete JSON message at the end of the therapy/activity.
10. Reconnection and delayed sample handling.
11. Cellit-specific settings and telemetry.
12. CellAirOne Therapy, Hyperoxia, HT1, HT2, HRV, and BOLT contracts.
13. Sanitized examples and a client integration checklist.
14. Transport-level WebSocket Ping/Pong versus JSON Connection Ping and application-level ACK behavior.

## Boundaries

- The static presentation website will not host an API or open real device sockets.
- Do not expose private production URLs or credentials.
- Example endpoints must be placeholders until a client-facing endpoint contract is approved.
- Distinguish device-to-server WebSocket behavior from dashboard-to-server REST behavior.
- Authentication and ownership requirements must not be represented as implemented merely because they are mentioned in an integration outline.
- Confirm duration units, validation behavior, and final-data retention behavior with the applicable device contract before publishing them.
