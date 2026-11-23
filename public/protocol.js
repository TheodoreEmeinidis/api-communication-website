(function () {
  "use strict";
  const D = window.DeviceDemo, UI = window.DemoUI;
  const $ = function (id) { return document.getElementById(id); };
  Object.keys(D.activities).forEach(function (key) {
    const p = D.activities[key], option = UI.element("option", "", p.name); option.value = key; $("protocol-activity").append(option);
    const row = UI.element("tr"); [p.name, p.settings, p.live, p.full].forEach(function (value) { row.append(UI.element("td", "", value)); }); $("message-family-table").append(row);
  });
  function render() {
    const device = $("protocol-device").value, activity = device === "cellit" ? "therapy" : $("protocol-activity").value;
    $("protocol-activity-field").hidden = device === "cellit";
    const settings = D.settings(device, activity), live = D.live(device, activity), full = D.full(device, activity);
    $("settings-json").textContent = JSON.stringify(settings, null, 2); $("settings-json-title").textContent = settings["Message type"];
    $("live-json").textContent = JSON.stringify(live, null, 2); $("live-json-title").textContent = live["Message type"];
    $("full-json").textContent = JSON.stringify(full, null, 2); $("full-json-title").textContent = full["Message type"];
    $("boot-json").textContent = JSON.stringify(D.boot(device), null, 2);
  }
  $("protocol-device").addEventListener("change", render); $("protocol-activity").addEventListener("change", render);
  $("envelope-json").textContent = JSON.stringify(D.envelope("Message_type", {}), null, 2);
  $("validation-json").textContent = JSON.stringify(D.validation(false), null, 2);
  render();
})();
