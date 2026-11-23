(function () {
  "use strict";
  const D = window.DeviceDemo;
  function element(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
  function rows(container, values) {
    container.replaceChildren();
    values.forEach(function (pair) { const row = element("div", "setting-row"); row.append(element("dt", "", pair[0]), element("dd", "", String(pair[1]))); container.append(row); });
  }
  function legend(container, profile) {
    container.replaceChildren();
    profile.metrics.forEach(function (key) { const item = element("span"); item.append(element("i", "legend-" + key), document.createTextNode(D.metrics[key].label)); container.append(item); });
  }
  function values(container, profile, data) {
    container.replaceChildren();
    const last = data[data.length - 1];
    profile.metrics.forEach(function (key) { const metric = D.metrics[key]; const item = element("div", "measurement-value"); item.append(element("span", "", metric.label + " (" + metric.unit + ")"), element("strong", "legend-" + key, String(Math.round(last[key] * 10) / 10))); container.append(item); });
  }
  function chart(canvas, profile, data) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.scale(ratio, ratio);
    const w = rect.width, h = rect.height;
    const dual = profile.metrics.includes("rmssd");
    const left = 35, right = dual ? 38 : 12, top = 16, bottom = 34;
    const pw = w - left - right, ph = h - top - bottom;
    const maximum = profile.metrics[0] === "hold" ? 40 : 150;
    const duration = data[data.length - 1].second || 1;
    ctx.clearRect(0, 0, w, h); ctx.font = "12px Arial, sans-serif"; ctx.textBaseline = "middle";
    ctx.strokeStyle = "#e0e7ed"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = top + ph * i / 4;
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(w - right, y); ctx.stroke();
      ctx.fillStyle = "#617181"; ctx.textAlign = "right"; ctx.fillText(String(Math.round(maximum * (1 - i / 4))), left - 8, y);
      if (dual) { ctx.fillStyle = D.metrics.rmssd.color; ctx.textAlign = "left"; ctx.fillText(String(100 * (1 - i / 4)), w - right + 8, y); }
    }
    const ticks = w < 460 ? 3 : 4;
    for (let i = 0; i <= ticks; i++) {
      const x = left + pw * i / ticks;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, top + ph); ctx.stroke();
      ctx.fillStyle = "#617181"; ctx.textAlign = "center"; ctx.fillText(String(Math.round(duration * i / ticks)), x, top + ph + 15);
    }
    ctx.textAlign = "center"; ctx.fillStyle = "#617181"; ctx.fillText("Seconds", left + pw / 2, h - 5);
    if (dual) { ctx.textAlign = "right"; ctx.fillStyle = D.metrics.rmssd.color; ctx.fillText("ms", w - 2, 5); }
    profile.metrics.forEach(function (key) {
      ctx.strokeStyle = D.metrics[key].color; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.beginPath();
      data.forEach(function (point, index) { const x = left + point.second / duration * pw; const y = top + ph - point[key] / (key === "rmssd" ? 100 : maximum) * ph; if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke();
    });
    canvas.setAttribute("aria-label", "Illustrative " + profile.name + " chart: " + profile.metrics.map(function (k) { return D.metrics[k].label; }).join(", ") + ". Example data only.");
  }
  async function copy(button) {
    const source = document.getElementById(button.dataset.copy); if (!source) return;
    const text = source.textContent; let copied = false;
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); copied = true; } } catch (_) { copied = false; }
    if (!copied) {
      const box = element("textarea", "copy-helper"); box.value = text; box.setAttribute("readonly", ""); document.body.append(box); box.select();
      try { copied = document.execCommand("copy"); } catch (_) { copied = false; } box.remove(); button.focus();
    }
    const label = button.querySelector("span"); if (label) { label.textContent = copied ? "Copied" : "Unavailable"; window.setTimeout(function () { label.textContent = "Copy"; }, 1800); }
  }
  document.addEventListener("click", function (event) { const button = event.target.closest("[data-copy]"); if (button) copy(button); });
  window.DemoUI = { element: element, rows: rows, legend: legend, values: values, chart: chart };
})();
