# API communication website

Standalone presentation and client integration reference for Cellit and CellAirOne. This is a separate project, not a replacement for either API simulator.

## View locally

Open public/index.html in a browser. No installation, server, Python environment, npm packages, or internet connection is needed.

From PowerShell:

~~~powershell
Start-Process "C:\Users\TUR\Documents\VSCodeProjects\API communication website\public\index.html"
~~~

To edit in VS Code:

~~~powershell
code "C:\Users\TUR\Documents\VSCodeProjects\API communication website"
~~~

## Included

- Actual product photos: black Cellit and white CellAirOne.
- Seven-stage dashboard/server/device communication demonstration.
- Previous, Next, Restart and optional Play/Pause controls.
- Normal and rejected-settings scenarios, with adjustment and resend.
- CellAirOne Therapy, Hyperoxia, HT1, HT2, HRV and BOLT profiles.
- Activity-specific illustrative charts, including device-reported RMSSD where applicable.
- Sample operator view, with connection and activity status shown separately.
- Separate protocol page with selectable, copyable JSON examples.
- Keyboard controls, visible focus, responsive layouts and reduced-motion support.

All measurements, serial numbers, names and addresses shown are fictional examples. This website does not connect to devices, APIs or a CRM. Example settings are not clinical recommendations. It contains no authentication, patient records, database, analytics, CDN or remote fonts.

## Structure

~~~text
API communication website/
  public/                       Deploy only this folder
    index.html                  Presentation and guided demo
    protocol.html               Client integration reference
    styles.css                  Shared responsive styling
    data.js                     Shared illustrative device/message definitions
    charts.js                   Canvas charts and small DOM/copy helpers
    app.js                      Presentation state and interactions
    protocol.js                 Selectable protocol examples
    assets/                     Supplied photos/logo and local Lucide SVG icons
    _headers                    Cloudflare static security headers
    404.html
    THIRD_PARTY_NOTICES.txt
  scripts/
    check-static.cjs            Optional Node.js validation before deployment
  docs/                         Private project/reference notes, not published
  wrangler.json                 Cloudflare Pages output configuration
  README.md
~~~

The original brief is preserved in docs/CODEX_WEBSITE_BRIEF.md. Product mappings are documented in docs/PRODUCT_ASSETS.md. Both simulator projects remain separate and unchanged.

## Optional checks

Node.js is needed only to run this development check, not to view the site:

~~~powershell
node scripts/check-static.cjs
~~~

It checks JavaScript syntax, generated example envelopes, required files and Cloudflare Free asset limits. Browser verification is recorded in docs/VERIFICATION.md.

## Cloudflare Pages

The site is designed for static Cloudflare Pages hosting on the Free plan:

- Framework preset: None.
- Build command: exit 0.
- Build output directory: public.
- No Pages Functions, Workers runtime, R2, D1 or paid services.
- All assets bundled locally; no runtime network requests.

Repository: https://github.com/TheodoreEmeinidis/api-communication-website (private), production branch main.

The website has not been deployed to Cloudflare. Connect this repository to Cloudflare Pages using the settings above. Once connected, successful pushes to main trigger production deployments unless automatic builds are disabled. See docs/CLOUDFLARE.md for publishing instructions and official limits.

## Assets and licensing

Product images and the TUR logo are supplied TUR materials, retained without modification. Local Lucide SVG icons include their license under public/assets/icons/LICENSE.txt. See public/THIRD_PARTY_NOTICES.txt.
