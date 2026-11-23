(function () {
  "use strict";
  const D = window.DeviceDemo, UI = window.DemoUI;
  const $ = function (id) { return document.getElementById(id); };
  const state = { device: "cellairone", activity: "therapy", step: 0, scenario: "normal", playing: false, timer: null };
  const stages = [
    { short: "Identify", name: "Connect and identify", description: "The device opens its connection and sends a boot report. Its serial number, software information and status allow the server to recognize the device.", direction: "Device to server", device: "AVAILABLE", server: "Boot report", operator: "Device recognized", a: null, b: "back", bLabel: "Boot report" },
    { short: "Connection", name: "Confirm connection", description: "Periodic Connection Ping messages tell the server that the device is communicating. Connection availability remains separate from the device's activity status.", direction: "Device to server", device: "AVAILABLE", server: "Connection Ping", operator: "Connection good", a: null, b: "back", bLabel: "Connection Ping" },
    { short: "Settings", name: "Assign settings", description: "The operator selects an available device and provides a patient name and activity settings. The server routes those settings through the device's existing connection.", direction: "Dashboard to server to device", device: "AVAILABLE", server: "Settings sent", operator: "Settings selected", a: "forward", b: "forward", aLabel: "Settings", bLabel: "Settings" },
    { short: "Validation", name: "Validate settings", description: "The device checks the settings and reports whether it accepts them. Accepted settings are followed by a RESERVED device status; a rejection gives the operator an explanation.", direction: "Device to server to dashboard", device: "RESERVED", server: "Settings approved", operator: "Ready to start", a: "back", b: "back", aLabel: "Validation", bLabel: "Validation" },
    { short: "Local start", name: "Start locally", description: "The operator starts the activity on the device. The device performs the activity locally and reports its transition to RUNNING. The server does not execute the treatment.", direction: "Device to server", device: "RUNNING", server: "Running status", operator: "Activity running", a: null, b: "back", bLabel: "Running status" },
    { short: "Live values", name: "Receive live measurements", description: "During the activity, the device sends measurement updates. The server makes these values available to the dashboard for display, alongside the current device status.", direction: "Device to server to dashboard", device: "RUNNING", server: "Live samples", operator: "Measurements visible", a: "back", b: "back", aLabel: "Display values", bLabel: "Live values" },
    { short: "Full results", name: "Send complete results", description: "Ongoing live updates are followed by one complete therapy or activity dataset at the end. The receiving server can process the results and make them available to the operator.", direction: "Device to server to dashboard", device: "COMPLETED", server: "Complete dataset", operator: "Results available", a: "back", b: "back", aLabel: "Display results", bLabel: "Complete JSON" }
  ];
  const stepButtons = [];
  stages.forEach(function (item, index) { const li = UI.element("li"); const button = UI.element("button", "step-button"); button.type = "button"; button.setAttribute("aria-label", "Step " + (index + 1) + ": " + item.name); button.append(UI.element("b", "", String(index + 1).padStart(2, "0")), document.createTextNode(item.short)); button.addEventListener("click", function () { stop(); state.step = state.scenario === "rejected" ? Math.min(index, 3) : index; renderStage(); }); li.append(button); $("stepper").append(li); stepButtons.push(button); });
  const activityButtons = [];
  Object.keys(D.activities).forEach(function (key) {
    const option = document.createElement("option"); option.value = key; option.textContent = D.activities[key].name; $("demo-activity").append(option);
    const button = UI.element("button", "", D.activities[key].name); button.type = "button"; button.dataset.activity = key; button.id = "activity-" + key; button.setAttribute("role", "tab"); button.setAttribute("aria-controls", "comparison-panel");
    button.addEventListener("click", function () { selectActivity(key); });
    button.addEventListener("keydown", function (event) { const keys = Object.keys(D.activities), position = keys.indexOf(key); let index = position; if (event.key === "ArrowRight") index = (position + 1) % keys.length; else if (event.key === "ArrowLeft") index = (position + keys.length - 1) % keys.length; else if (event.key === "Home") index = 0; else if (event.key === "End") index = keys.length - 1; else return; event.preventDefault(); selectActivity(keys[index]); $("activity-" + keys[index]).focus(); });
    $("activity-tabs").append(button); activityButtons.push(button);
  });
  function stop() { clearInterval(state.timer); state.timer = null; state.playing = false; }
  function play() {
    if (state.playing) { stop(); renderStage(); return; }
    if (state.scenario === "rejected" && state.step === 3) return;
    if (state.step === 6) state.step = 0;
    state.playing = true;
    state.timer = window.setInterval(function () { if (state.step < 6) state.step++; renderStage(); }, 6000);
    renderStage();
  }
  function connection(id, direction, label) {
    const node = $(id); node.classList.toggle("active", Boolean(direction));
    node.querySelector(".connector-label").textContent = direction ? label : "";
    node.querySelector(".connector-beam").setAttribute("d", direction === "back" ? "M152 32H8" : "M8 32H152");
  }
  function stageMessage() {
    if (state.step === 0) return D.boot(state.device);
    if (state.step === 1) return D.ping(state.device);
    if (state.step === 2) return D.settings(state.device, state.activity);
    if (state.step === 3) return D.validation(state.scenario !== "rejected");
    if (state.step === 4) return D.envelope("Device_status", { "Device status": "Running" });
    if (state.step === 5) return D.live(state.device, state.activity);
    return D.full(state.device, state.activity);
  }
  function renderStage() {
    const s = stages[state.step], rejected = state.step === 3 && state.scenario === "rejected";
    if (state.step === 6 || rejected) stop();
    $("step-count").textContent = "Step " + (state.step + 1) + " of 7";
    $("stage-title").textContent = rejected ? "Settings rejected" : s.name;
    $("stage-direction").textContent = s.direction;
    $("stage-description").textContent = rejected ? "The device rejects the example settings and remains AVAILABLE, not reserved. Its explanation is returned to the operator so the settings can be adjusted and sent again." : s.description;
    $("device-stage-status").textContent = rejected ? "AVAILABLE" : s.device;
    $("device-stage-status").className = "status " + (s.device === "RUNNING" ? "blue" : "good");
    $("server-state").textContent = rejected ? "Settings not approved" : s.server;
    $("operator-state").textContent = rejected ? "Correction needed" : s.operator;
    $("node-dashboard").classList.toggle("active", Boolean(s.a));
    $("node-server").classList.add("active"); $("node-device").classList.add("active");
    connection("connector-dashboard", s.a, s.aLabel); connection("connector-device", s.b, s.bLabel);
    $("rejection-message").hidden = !rejected; $("completion-note").hidden = state.step !== 6;
    $("previous-step").disabled = state.step === 0; $("next-step").disabled = state.step === 6 || rejected; $("play-demo").disabled = rejected;
    $("play-label").textContent = state.playing ? "Pause" : "Play"; $("play-icon").src = "./assets/icons/" + (state.playing ? "pause" : "play") + ".svg";
    $("play-demo").setAttribute("aria-label", state.playing ? "Pause automatic demo" : "Play automatic demo");
    stepButtons.forEach(function (button, index) { if (index === state.step) button.setAttribute("aria-current", "step"); else button.removeAttribute("aria-current"); button.classList.toggle("visited", index < state.step); });
    document.querySelectorAll("[data-scenario]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.scenario === state.scenario)); });
    const message = stageMessage(); $("demo-json").textContent = JSON.stringify(message, null, 2); $("demo-json-label").textContent = message["Message type"];
  }
  function selectDevice(device) { stop(); state.device = device; state.activity = "therapy"; state.step = 0; renderSelection(); renderStage(); }
  function selectActivity(activity) { stop(); state.activity = activity; state.step = 0; renderSelection(); renderStage(); }
  function drawCharts() {
    const p = D.profile(state.device, state.activity), data = D.series(state.device, state.activity);
    UI.chart($("comparison-chart"), p, data); UI.chart($("console-chart"), p, data);
  }
  function renderSelection() {
    const d = D.devices[state.device], p = D.profile(state.device, state.activity), data = D.series(state.device, state.activity);
    document.querySelectorAll("[data-device]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.device === state.device)); });
    document.querySelectorAll(".fleet-row").forEach(function (row) { const selected = row.dataset.device === state.device; const status = row.querySelector(".fleet-statuses .status:last-child"); status.textContent = selected ? "RUNNING" : "AVAILABLE"; status.className = "status " + (selected ? "blue" : "muted"); });
    $("demo-activity-field").hidden = state.device === "cellit"; $("activity-tabs").hidden = state.device === "cellit"; $("demo-activity").value = state.activity;
    activityButtons.forEach(function (button) { const selected = button.dataset.activity === state.activity; button.setAttribute("aria-selected", String(selected)); button.tabIndex = selected ? 0 : -1; });
    $("comparison-panel").setAttribute("aria-labelledby", state.device === "cellairone" ? "activity-" + state.activity : "comparison-name");
    [$("diagram-product"), $("comparison-image")].forEach(function (image) { image.src = d.image; image.alt = d.alt; });
    $("diagram-device-name").textContent = d.name; $("comparison-device").textContent = d.name; $("comparison-name").textContent = p.name; $("comparison-result").textContent = p.result;
    UI.rows($("settings-list"), p.sent); $("returned-list").replaceChildren(); p.returned.forEach(function (text) { $("returned-list").append(UI.element("li", "", text)); }); UI.rows($("result-list"), p.resultFields);
    $("comparison-chart-title").textContent = p.name + ": illustrative values";
    UI.legend($("comparison-legend"), p); UI.values($("comparison-values"), p, data);
    $("console-device").textContent = d.name; $("console-activity").textContent = p.name;
    $("console-settings").replaceChildren(); p.sent.slice(0, 3).forEach(function (pair) { const span = UI.element("span", "", pair[0] + ":"); span.append(UI.element("strong", "", pair[1])); $("console-settings").append(span); });
    $("console-result").textContent = p.result;
    UI.legend($("console-legend"), p); UI.values($("console-values"), p, data);
    drawCharts();
  }
  document.querySelectorAll("[data-device]").forEach(function (button) { button.addEventListener("click", function () { selectDevice(button.dataset.device); }); });
  document.querySelectorAll("[data-explore]").forEach(function (button) { button.addEventListener("click", function () { selectDevice(button.dataset.explore); $("devices").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }); });
  document.querySelectorAll("[data-scenario]").forEach(function (button) { button.addEventListener("click", function () { stop(); state.scenario = button.dataset.scenario; if (state.scenario === "rejected" && state.step > 3) state.step = 3; renderStage(); }); });
  $("demo-activity").addEventListener("change", function () { selectActivity(this.value); });
  $("previous-step").addEventListener("click", function () { stop(); if (state.step > 0) state.step--; renderStage(); });
  $("next-step").addEventListener("click", function () { stop(); if (state.step < 6) state.step++; renderStage(); });
  $("play-demo").addEventListener("click", play);
  $("restart-demo").addEventListener("click", function () { stop(); state.step = 0; state.scenario = "normal"; renderStage(); });
  $("resend-settings").addEventListener("click", function () { stop(); state.step = 2; state.scenario = "normal"; renderStage(); });
  window.addEventListener("pagehide", stop);
  if (window.ResizeObserver) { const observer = new ResizeObserver(drawCharts); observer.observe($("comparison-chart").parentElement); observer.observe($("console-chart").parentElement); } else window.addEventListener("resize", drawCharts);
  renderSelection(); renderStage();
})();
