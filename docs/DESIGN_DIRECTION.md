# Proposed Design Direction

Research date: 2026-11-23.

## Recommendation

A light, presentation-led design built around a readable communication diagram. Use white surfaces, graphite text, blue and teal accents, generous spacing, and large captions that work when projected.

The presentation should show one main concept at a time. Keep engineering details in optional disclosures or the separate client-integration section.

## 21st.dev references

### Klyv Animated Beam

https://21st.dev/@klyv-ui/components/klyv-animated-beam

The component demonstrates animated connectors between elements. Its page describes a connector that re-measures when layout changes.

Proposed use: the visual idea for highlighting data moving between the operator dashboard, API server, and device. Arrows and concise message labels will show the direction and purpose of each exchange.

The actual diagram must preserve the three roles and must never show a direct dashboard-to-device connection. Each device uses one bidirectional WebSocket connection to the server.

### Feature Tab Switcher

https://21st.dev/@mohammadshehadeh/components/feature-11

The component demonstrates selectable feature tabs with a corresponding preview panel and keyboard navigation.

Proposed use: Cellit/CellAirOne comparison and CellAirOne activity selection. The selected activity changes the displayed settings, example measurements, and results.

## Dependency decision

The referenced components use React and Tailwind. They are design references only for this project, not dependencies to install.

Implement the required visual behavior independently with local HTML, CSS, and JavaScript. No third-party source has been copied into this project. If source is reused later, check its license and preserve required attribution.

## Presentation structure

- Overview of Cellit and CellAirOne API communication.
- Three-role system diagram.
- Guided seven-stage communication demonstration.
- Device and activity comparison.
- Illustrative operator information view.
- Simulator verification and outcomes.

The separate API protocol section will be reachable from the main navigation.

## Interaction direction

- Previous, next, restart, and play/pause controls.
- A visible current-step indicator.
- Normal flow and settings-rejection scenarios.
- Device and activity tabs using standard keyboard behavior.
- Optional sanitized JSON examples.
- Motion that respects reduced-motion preferences.
- No autoplay by default.

The active sender, receiver, and message path should be obvious without relying on animation or color alone.

## Content guardrails

- Always label the demonstration as illustrative, not live.
- Use fictional example data only.
- The device performs the activity locally; the server routes and receives information.
- Live updates and the final single complete JSON message must be visually distinct.
- Do not introduce an application-level ACK stage.
- Use Connection Ping for network connectivity.
- Keep connection status separate from device/activity status.
- Use the current under-5 / 5-to-under-10 / at-least-10-second connection thresholds in optional technical details.
- Do not invent clinical, safety, regulatory, or production-readiness claims.
- Device-local retention and cleanup wording must not imply a receipt-confirmation mechanism that is not established.
- Do not include private endpoints, credentials, or internal implementation details in customer-facing content.

## First implementation milestone

Build the presentation overview and guided communication diagram. Prepare navigation for the separate protocol section. Validate desktop, tablet, and mobile layouts before expanding the remaining screens.

This document records a proposed direction, not a finished design or a completed website.
