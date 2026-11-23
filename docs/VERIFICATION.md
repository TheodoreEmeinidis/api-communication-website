# Local Verification

Date: 2026-11-23.

## Automated static checks

Run from the project root:

~~~powershell
node scripts/check-static.cjs
~~~

Results:

- 31 public files.
- Total public size: 15.92 MiB.
- Largest asset: assets/products/cellairone.jpg, 10.85 MiB.
- JavaScript syntax passed.
- Seven device/activity combinations passed example-envelope checks: Cellit therapy and six CellAirOne activities.
- Required output files present.
- No backend or Functions runtime included.
- Within the documented Cloudflare Free limits of 20,000 files and 25 MiB per asset.

The optional validator uses only Node.js built-ins. No npm install is needed.

## Browser checks

Verified using automated Playwright checks with headless Microsoft Edge on this Windows machine:

- Opened public/index.html directly using file://, without a web server.
- Walked all seven communication stages and checked message types, direction arrows, step counter and end state.
- Checked restart, previous/next boundaries and the rejected-settings/resend branch.
- Switched all six CellAirOne activities and Cellit.
- Checked chart legends and nonblank canvas pixels for each activity.
- Checked keyboard activity-tab navigation.
- Checked optional autoplay advances and pause stops it.
- Checked reduced-motion disables connector animation.
- Opened the separate protocol page and switched every device/activity example.
- Validated example envelopes, live sample arrays and completed sample counts.
- Checked that settings do not include device serial number or internal session ID.
- Checked layouts and horizontal overflow at 375, 768 and 1366 pixels.
- Confirmed supplied images loaded.
- Observed zero external HTTP requests, failed requests or JavaScript page errors.

Screenshots were reviewed for desktop, tablet and mobile layout. The full-page review led to a tablet connector-spacing correction.

## Scope and limits

These checks verify the standalone illustrative website, not the physical devices, APIs or clinical behavior. They are not a formal accessibility audit or a browser-support certification.

No remote Cloudflare deployment, DNS setup or Cloudflare account configuration was performed. The separate GitHub repository is recorded in README.md. Cloudflare response-header behavior must be checked on the hosted site after deployment.

The original device photographs are retained unchanged. Presentation values and shortened JSON examples are fictional demonstrations; actual firmware contracts govern real integrations.
