"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const config = JSON.parse(fs.readFileSync(path.join(root, "wrangler.json"), "utf8"));
const publicDir = path.resolve(root, config.pages_build_output_dir);
assert.equal(publicDir, path.join(root, "public"), "Deploy public/ only");
assert(!fs.existsSync(path.join(root, "functions")), "This static project must not include Pages Functions");
const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink(), "Do not deploy symlinks: " + filename);
    if (entry.isDirectory()) walk(filename);
    else if (entry.isFile()) files.push({ name: path.relative(publicDir, filename), path: filename, size: fs.statSync(filename).size });
  }
}
walk(publicDir);
assert(files.length <= 20000, "Cloudflare Free file-count limit exceeded");
for (const file of files) {
  assert(file.size <= 25 * 1024 * 1024, "Cloudflare per-file limit exceeded: " + file.name);
  assert(!/(^|[\\/])(?:functions|node_modules|\.git|docs)(?:[\\/]|$)/.test(file.name), "Private or runtime files in public/: " + file.name);
  assert(!/(?:^|[\\/])_worker\.js$/.test(file.name), "Do not add a Workers runtime to this static site");
  if (file.name.endsWith(".js")) new vm.Script(fs.readFileSync(file.path, "utf8"), { filename: file.name });
}
for (const required of ["index.html", "protocol.html", "styles.css", "app.js", "charts.js", "data.js", "protocol.js", "_headers"]) {
  assert(files.some(file => file.name === required), "Missing public file: " + required);
}
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(publicDir, "data.js"), "utf8"), sandbox);
const demo = sandbox.window.DeviceDemo;
let profiles = 0;
for (const [device, descriptor] of Object.entries(demo.devices)) {
  for (const activity of descriptor.activities) {
    const settings = demo.settings(device, activity);
    const live = demo.live(device, activity);
    const full = demo.full(device, activity);
    for (const message of [settings, live, full, demo.boot(device), demo.ping(device)]) {
      assert.deepEqual(Object.keys(message), ["Protocol version", "Message type", "Timestamp", "Data"]);
      assert.equal(message["Protocol version"], 1);
      assert(!Number.isNaN(Date.parse(message.Timestamp)));
      JSON.parse(JSON.stringify(message));
    }
    assert(!("Serial number" in settings.Data) && !("session_id" in settings.Data));
    assert(Array.isArray(live.Data.samples));
    assert.equal(full.Data.totalSamples, full.Data.samples.length);
    assert.equal(demo.series(device, activity).length, demo.profile(device, activity).duration + 1);
    profiles++;
  }
}
const largest = files.reduce((a, b) => a.size >= b.size ? a : b);
console.log(JSON.stringify({
  passed: true,
  publicFiles: files.length,
  totalMiB: Number((files.reduce((sum, file) => sum + file.size, 0) / 1048576).toFixed(2)),
  largestAsset: largest.name,
  largestAssetMiB: Number((largest.size / 1048576).toFixed(2)),
  javascriptSyntax: "passed",
  deviceActivityProfiles: profiles,
  cloudflareFreeLimits: { files: 20000, perFileMiB: 25 },
  runtimeBackend: "none"
}, null, 2));
