# Cloudflare Pages Deployment

## Status and boundary

The static website is implemented and locally verified. It has not been deployed. No Cloudflare account, remote project, domain, credentials or billing changes were made.

Publish public/ only. Keep docs/, scripts/, README, Git metadata, local tool state and credentials outside the deployment folder. The same files work by opening public/index.html directly or on a static host.

## Cloudflare Free constraints

Checked against the official documentation on 2026-11-23:

| Resource | Free-plan constraint | Project approach |
| --- | --- | --- |
| Files per site | 20,000 | A small static folder; checked by scripts/check-static.cjs |
| Individual asset | 25 MiB maximum | Both supplied original photos are below the limit |
| Builds | 500 per month | No framework build; deploy only when changes are ready |
| Concurrent builds | 1 | No parallel production build workflow is needed |
| Build duration | 20-minute timeout | Build command exit 0 performs no compilation |
| Static requests | Free and unlimited when no Functions are invoked | HTML, CSS, JavaScript and image files only |
| Pages Functions | Consume Workers quotas | Not used |
| Additional storage or services | May introduce separate quotas/billing | No R2, D1, database, backend or paid add-ons |

This does not remove provider terms, abuse controls or plan limits. Do not add Functions, a _worker.js runtime, an API proxy or paid services without reviewing the associated limits and security requirements.

The original product photos total approximately 16 MB. They remain local and unchanged; the browser caches them after loading. Optional image optimization is separate from this implementation.

## Git-based deployment

Use the private website repository https://github.com/TheodoreEmeinidis/api-communication-website, branch main. It is separate from both API simulators.

In Cloudflare Pages:

1. Create a Pages application, import the website repository, and grant the Cloudflare GitHub app access to this repository when prompted.
2. Select main as the production branch.
3. Select framework preset None.
4. Set build command to exit 0.
5. Set build output directory to public.
6. Leave the root directory at the repository root.
7. Deploy and test navigation, controls, JSON examples and product assets.

Do not connect either API simulator repository. The production branch is a remote setting; wrangler.json does not select it.

After the Git integration is connected, pushes to main trigger production deployments by default. Check the Cloudflare deployment result before assuming a change is live. A private GitHub repository does not make the deployed website private; ordinary Pages production URLs are publicly accessible unless access restrictions are configured separately.

## Direct Upload

Alternatively, create a Direct Upload Pages project and upload the contents of public/, not the whole project. Choose Git integration or Direct Upload at project creation; do not assume that an existing project can switch between these setup modes.

The optional Wrangler CLI requires Node.js and internet access only for publishing:

~~~powershell
npx.cmd wrangler login
npx.cmd wrangler pages project create api-communication-website --production-branch main
npx.cmd wrangler pages deploy public --project-name api-communication-website --branch main
~~~

Create the project once. If it exists, skip creation and use its actual name/branch. The local name is proposed; no remote availability check or reservation has been made.

## Local configuration

wrangler.json declares:

- name: api-communication-website.
- pages_build_output_dir: ./public.
- compatibility_date: 2026-11-23.
- send_metrics: false.

No secrets or real device endpoints belong in configuration or public/. Local Wrangler state and development variables are ignored by Git.

public/_headers supplies static security headers, including a Content Security Policy that allows only bundled scripts/assets and blocks runtime network connections. These headers take effect on Cloudflare Pages, not when opening file:// pages. The site contains no inline scripts or third-party CDN dependencies.

## Before publishing

~~~powershell
node scripts/check-static.cjs
~~~

Also inspect the presentation and protocol pages at desktop/mobile sizes, verify keyboard/reduced-motion behavior, and confirm that no private notes or real patient/device data were added to public/. An account and deployment are still required before any public URL exists.

## Official references

- [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Static requests and Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Static HTML deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)
- [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Static response headers](https://developers.cloudflare.com/pages/configuration/headers/)
