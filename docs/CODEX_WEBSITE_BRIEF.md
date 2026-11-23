# Cellit & CellAirOne — Interactive API Communication Demonstration

## Role and objective

Build a polished, customer-facing, **standalone website** to explain how the upgraded **Cellit** and **CellAirOne** applications communicate with an external server/API environment. This is a **guided visual demonstration**, not a new CRM, not a replacement for our existing FastAPI simulator, and not a live connection to a physical device.

Audience: clinic operators, customer stakeholders, non-technical decision-makers, and technical contacts who may optionally want more detail.

Primary message: **Both Cellit and CellAirOne now support API communication. Our existing API simulator was used to develop and verify their communication workflow before customer CRM integration.**

The website should make it easy to answer three questions:
1. What does the clinic/operator send to the device?
2. What does the device send back during and after the activity?
3. How does the server/dashboard use the received information?

Use plain language by default. Keep engineering details behind an optional expandable section. Do not expose proprietary internal technology stacks, private endpoints, credentials, or real patient data.

## Technology and deployment

- Create the website with **plain HTML, CSS and JavaScript** (no React, Vue, Angular, backend framework, database, or build tooling required).
- Suggested files: `index.html`, `styles.css`, `app.js`, `README.md`; optional `assets/` for self-created SVGs.
- It must run by opening `index.html` or from a minimal local static server. It must also work on any ordinary static host.
- No internet dependency, no external CDN, no telemetry/analytics, no third-party font requirement.
- No API connection is needed for version 1. **All animations and measurements are illustrative simulated examples**. Display a small, persistent label such as **“Illustrative simulation — no live device connected.”**
- No login. No real patient records or patient identifiers.
- Use semantic HTML, keyboard-friendly controls, visible focus, appropriate contrast, responsive layout, and respect `prefers-reduced-motion`.

## Look and interaction

Make this feel like a professional product demonstration rather than a technical API playground:
- Clean 16:9-friendly desktop presentation layout that also scales to laptop/tablet/mobile.
- White or very light background, restrained navy/blue/teal accent colors, legible typography, consistent cards and margins.
- Short headlines, large readable captions, plenty of whitespace.
- Use diagrams built with CSS/SVG/HTML, **not static screenshots**. Directional arrows should clearly show data movement.
- Do not use tiny text, dense engineering swimlanes, dense lists of endpoints, or decorative icons unrelated to the content.
- Limit each primary screen to one main concept. Provide a clear navigation header and a “Start demo” action.
- For the animated flow, offer **Next / Previous / Restart / Play-Pause** controls and a visible step counter. Auto-play may be off by default. Animations must not be required to understand the flow.

## Site structure

### Screen 1 — Overview / What was achieved

Headline: **Cellit & CellAirOne — API Communication**
Subheading: **Device-to-server communication, demonstrated through a controlled API simulation environment.**

Brief content:
- The upgraded Cellit and CellAirOne applications can exchange settings and results with an external API server.
- The devices execute therapies and activities locally.
- A simulator/dashboard was developed to reproduce the customer-style setup and verify the data exchange.

Provide two device cards:
- **Cellit:** IHHT therapy settings, live therapy values, complete therapy data.
- **CellAirOne:** Therapy, Hyperoxia, HT1, HT2, HRV, and BOLT; activity-specific settings, measurements, and results.

Avoid detailed migration stack disclosure on the public-facing page. You may mention modernized software, continuity of existing device functionality, and improved UI responsiveness as project context, without naming Windows or .NET versions.

### Screen 2 — Three-component system diagram

Diagram (left-to-right):

**Clinic Operator / Browser Dashboard** ⇄ **API Server / Simulator** ⇄ **Cellit or CellAirOne Device**

Use labeled two-way connections and brief descriptions:
- **Operator / Dashboard:** choose a device, send patient name and settings, see status and results.
- **API Server:** route settings to the selected device, receive live and completed data, make information available to the dashboard.
- **Device:** validate settings, perform the activity locally, report status, send measurements and complete data.

Show that the **dashboard communicates with the server**, and **each device has a single bidirectional WebSocket connection with the server**. Do not depict the dashboard as connecting directly to a device. Do not depict device communication as REST calls.

In an optional “Technical details” expander only: dashboard reads/assigns through HTTP REST; device ↔ server uses one WebSocket per device.

### Screen 3 — Guided two-way communication demo (main feature)

One large, understandable diagram with three columns and directionally animated labeled arrows. Make each step highlight only the active sender, receiver, arrow and message; de-emphasize unrelated items.

Seven stages:

1. **Connect and identify** — Device → Server. The device connects and sends a boot report with serial number, software/boot information, and status. Server/dashboard can recognize the device.
2. **Confirm connection** — Device → Server. The device sends periodic Connection Ping messages; server updates connection availability. Use the term **Connection Ping**, never “heartbeat” for network connectivity.
3. **Assign settings** — Operator → Server → Device. Operator selects an available device and provides patient name plus Cellit therapy settings or CellAirOne activity settings. Server sends settings through the device's existing WebSocket connection.
4. **Validate settings** — Device → Server. The device accepts or rejects received settings; accepted settings lead to the **RESERVED** status, while rejection shows an explanatory error to the operator.
5. **Start locally** — Device → Server. Operator starts the selected therapy/activity on the device; the server receives the status transition to **RUNNING**. Do not imply the external server controls the treatment itself.
6. **Live monitoring** — Device → Server → Dashboard. During operation the device sends updates; the server can display live values/graphs. Include simple sample values and a visibly illustrative chart. The chart is not a live clinical monitor.
7. **Send complete results** — Device → Server → Dashboard. **At the end, the device sends the complete therapy/activity data in one JSON message. The receiving server can process and display the results. After successful transfer, the device does not retain the session information locally.** Distinguish this one final message from the ongoing live updates.

Use visual message chips such as “Settings”, “Validation”, “Live values”, “Complete session” rather than exposing JSON by default. Include an optional “See example JSON” toggle for a short, clearly labeled sanitized example.

Include a toggle between **Normal flow** and **Settings rejected**. Settings rejection should visibly return the device to an unreserved state with a concise error message; show the operator can adjust and resend settings. This must be a UI-only illustration.

### Screen 4 — Compare the two devices

Top: tabs or segmented control **Cellit** / **CellAirOne**.

**Cellit**:
- Settings sent: patient name, hypoxia time, hypoxia oxygen, reoxia time, cycles, warmup time, SpO2 cutoff.
- Live values returned: elapsed time/cycle, SpO2, actual O2, planned O2, heart rate, HTI, alarms and device status.
- Final result: full therapy dataset sent in one message; server can display results.
- Small example chart: SpO2 (green), actual O2 (blue), heart rate (red). Label “Illustrative sample data”.

**CellAirOne**:
- Six clearly named activity cards: **Therapy**, **Hyperoxia**, **HT1**, **HT2**, **HRV**, **BOLT**.
- On activity selection, update a **Settings sent** panel and a **Measurements/results returned** panel.
- Activity-specific examples:
  - Therapy: therapy mode/type, phases, oxygen, SpO2, cycles; live values; RMSSD where available.
  - Hyperoxia: patient name and duration; activity measurements/results.
  - HT1: patient name and SpO2 setting; test data/results.
  - HT2: patient name; test data/results.
  - HRV: patient name; HRV / RR intervals and RMSSD.
  - BOLT: patient name; breath-hold time (seconds).
- Charts should change appropriately by activity rather than showing a generic identical plot for all six.
- Use clear caveat: “Example values shown for illustration only.”

### Screen 5 — What the operator sees

A simple **sample operator dashboard mockup** (HTML layout, not a functioning CRM):
- Device list with example serial numbers and readable statuses.
- Two distinct dimensions: **Connection status** (`GOOD`, `PROBLEM`, `OFFLINE`) and **Device/activity status** (`AVAILABLE`, `RESERVED`, `RUNNING`, `COMPLETED`; optionally `PAUSED`, `STOPPED`, `ATTENTION`, `ERROR` only when relevant).
- Example selected-device settings panel.
- Example live values chart.
- Example completed-results card.

Use the actual connection interpretation from the current implementation: server-received activity is **GOOD <5 seconds**, **PROBLEM from 5 to <10 seconds**, **OFFLINE at >=10 seconds**. These numbers can be hidden under the technical disclosure so the main audience sees only the statuses. Do not use previous 1-minute/2-minute/3-minute timing in this website; the latest Codex implementation description supersedes it.

### Screen 6 — Verification and outcomes

Show a clean “What was tested using the simulator” visual checklist or six connected cards:
1. Connect and identify device.
2. Receive status/connection updates.
3. Send settings to the selected device.
4. Receive acceptance/rejection feedback.
5. Receive live values and show operator information.
6. Receive the complete therapy/activity dataset at the end.

Conclusion: **The simulator was developed to reproduce the communication conditions expected in the customer workflow and verify the exchange before integration with the customer’s production CRM.**

Do not suggest the simulator itself is the final customer CRM or imply that authentication, patient ownership or production integration is already delivered.

## Technical truth and guardrails

These points are important even if the public UI doesn't show them all:

- There are three actual roles: device application, FastAPI server, browser dashboard. We are building a **separate illustrative website** about them, not replacing or connecting to those applications.
- Device ↔ FastAPI: **one bidirectional WebSocket connection per device** handles boot report, JSON Connection Ping, settings reception, validation, status updates, live measurements and complete data.
- Dashboard ↔ API server: HTTP REST for assigning settings and reading server information.
- Devices are identified by **serial number**; the server associates serial numbers with device connections.
- The server does **not** calculate or execute the therapy; the device does.
- Device outputs differ between Cellit and CellAirOne and across CellAirOne's six activities.
- JSON messages use a common envelope: `Protocol version`, `Message type`, `Timestamp`, `Data`. This is an **optional technical example**, not primary presentation content.
- No application-level WebSocket ACK is currently sent automatically. **Do not claim per-message ACK is implemented.** Do not illustrate an application ACK step. If the final transfer is described as successful, describe the expected data-handling outcome rather than inventing a currently implemented ACK mechanism.
- Use the latest connectivity timing specified above.
- The demo must not claim live connected devices or production deployment. All simulated telemetry must be visibly labeled.
- Real names and real patient data must not be displayed.
- Do not describe features as tested/verified unless they are supported by the supplied current project description. Do not promise device-local automatic cleanup after a confirmed receipt protocol unless that behavior is established; the requested presentation wording states that after sending, the device does not retain session data, so show it as the intended documented device behavior without inventing an acknowledgement handshake.
- Avoid clinical benefit, diagnosis, safety, or regulatory claims.
- Do not mention “future work” or roadmap in the customer presentation content.

## Suggested implementation approach

- Create a reusable three-column `CommunicationDiagram` using HTML/SVG/CSS. The visible labels and arrow direction change with the selected demo stage.
- Use a small JavaScript data model for device variants, activity settings and sample charts.
- Do not embed large strings or all layouts inside one uncontrolled `innerHTML` block; use modular rendering functions.
- Optional JavaScript canvas or inline SVG for simple line charts (no external chart library required).
- Use deterministic example data so the demonstration behaves predictably on every run.
- Add accessible `aria-live` stage title and a reduced-motion mode.
- Provide a `README.md` with instructions to run, structure and a clear distinction between simulated examples and real integration.

## Acceptance criteria

1. Opening `index.html` shows the overview without any backend/server dependency.
2. A new user can understand **what the device receives** and **what it sends back** within 30 seconds of opening the main interactive communication diagram.
3. Next/Previous/Restart controls work on all seven stages; arrow direction and message label always match the explanation.
4. The diagram never shows a direct dashboard-to-device communication path.
5. The site consistently says **one WebSocket connection per device**, not separate REST calls for device-side communication.
6. Cellit and all six CellAirOne activities are available and show meaningfully different information.
7. Real-time samples and final full-data transfer are visibly distinct stages.
8. The final-data stage says **one complete JSON message** and explains the receiving server can display the results.
9. All simulated values/charts are marked as examples, not actual live device measurements.
10. Responsive behavior works at approximately 375px mobile, 768px tablet and 1366px desktop without horizontal content overflow.
11. Keyboard focus, buttons and reduced-motion behavior are usable.
12. No external dependencies or secret credentials required.
13. README explains how to serve locally and customize text/colors/examples.

## Codex execution instructions

1. First provide a short implementation plan and proposed file structure.
2. Build the full standalone website in the current project directory. Keep this demo isolated from any existing FastAPI backend files.
3. Implement all screens/sections and interactive logic, not just a static mockup.
4. Test the site at desktop and mobile sizes, fix overflow/overlap, test buttons and tab switching.
5. Summarize what was built and give exact instructions to open it locally. Do not claim real API connectivity.

Start with the visual overview and guided communication diagram. Prioritize simplicity, correctness and customer readability over implementation complexity.
