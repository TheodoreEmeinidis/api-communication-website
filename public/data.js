(function () {
  "use strict";
  const common = { patient: "Example participant", timestamp: "2026-01-01T10:00:00Z" };
  const fields = {
    cellit: [["Patient name", common.patient], ["Hypoxia time", 3], ["Hypoxia oxygen", 12.5], ["Reoxia time", 2], ["Cycles", 5], ["Warmup time", 1], ["SpO2 cutoff", 85]],
    therapy: [["Patient name", common.patient], ["Therapy mode", 1], ["Therapy type", 3], ["Slope", 2], ["SpO2", 85], ["Cycles", 5], ["PreCondition time", 0.5], ["Phase_1_time", 2], ["Phase_1_oxygen", 12.5], ["Phase_2_time", 4], ["Phase_3_time", 3]],
    hyperoxia: [["Patient name", common.patient], ["Duration", 30]],
    ht1: [["Patient name", common.patient], ["SpO2", 85]],
    ht2: [["Patient name", common.patient]],
    hrv: [["Patient name", common.patient]],
    bolt: [["Patient name", common.patient]]
  };
  const activities = {
    therapy: { name: "Therapy", settings: "Therapy_settings", live: "Therapy_status", full: "Therapy_fulldata", timer: "Curr_Second", duration: 60, metrics: ["spo2", "o2", "hr", "rmssd"], sent: [["Patient", common.patient], ["Mode / type", "Manual / three phases"], ["Phases", "2 / 4 / 3 min"], ["Oxygen example", "12.5%"], ["Cycles", "5"]], returned: ["Elapsed time and current cycle", "SpO2, actual and planned O2, heart rate", "RMSSD, HTI, alarms and device status"], result: "Complete therapy samples and activity status.", resultFields: [["Samples", "61 illustrative samples"], ["Activity", "Therapy"], ["Transfer", "One complete JSON message"]] },
    hyperoxia: { name: "Hyperoxia", settings: "Hyperoxia_Therapy_settings", live: "Hyperoxia_Therapy_status", full: "Hyperoxia_Therapy_fulldata", timer: "Curr_H_Therapy_Second", duration: 60, metrics: ["spo2", "o2", "hr"], sent: [["Patient", common.patient], ["Duration example", "30 min"]], returned: ["Elapsed activity time", "SpO2, actual oxygen and heart rate", "Complete activity samples"], result: "Full hyperoxia activity measurements.", resultFields: [["Activity", "Hyperoxia"], ["Measurements", "SpO2, O2, heart rate"], ["Transfer", "One complete JSON message"]] },
    ht1: { name: "HT1", settings: "HT1_settings", live: "HT1_status", full: "HT1_fulldata", timer: "Curr_Test_second", duration: 60, metrics: ["spo2", "o2", "hr"], sent: [["Patient", common.patient], ["SpO2 example", "85%"]], returned: ["Planned and actual O2, SpO2, heart rate", "Seconds to the SpO2 goal", "Oxygen at the goal and termination reason"], result: "Time-to-goal and oxygen results, alongside the full test samples.", resultFields: [["Seconds to goal", "95 (example)"], ["O2 at goal", "10.5% (example)"], ["Result", "SpO2GoalReached"]] },
    ht2: { name: "HT2", settings: "HT2_settings", live: "HT2_status", full: "HT2_fulldata", timer: "Curr_Test_second", duration: 60, metrics: ["spo2", "hr"], sent: [["Patient", common.patient]], returned: ["Test phase, SpO2 and heart rate", "Seconds to the SpO2 goal", "Seconds to the baseline and termination reason"], result: "Baseline and phase-timing results, alongside complete test samples.", resultFields: [["SpO2 baseline", "97% (example)"], ["Seconds to goal", "110 (example)"], ["Seconds to baseline", "85 (example)"]] },
    hrv: { name: "HRV", settings: "HRV_settings", live: "HRV_status", full: "HRV_fulldata", timer: "Curr_Test_second", duration: 60, metrics: ["hr", "rmssd"], sent: [["Patient", common.patient]], returned: ["Heart rate and elapsed test time", "RMSSD in milliseconds", "RR intervals and termination reason"], result: "Complete HRV samples, including the reported RR intervals and RMSSD.", resultFields: [["Reported values", "Heart rate and RMSSD"], ["RR intervals", "Preserved in the full dataset"], ["Termination", "Completed (example)"]] },
    bolt: { name: "BOLT", settings: "BOLT_settings", live: "BOLT_status", full: "BOLT_fulldata", timer: "Hold_Breath_Secs", duration: 35, metrics: ["hold"], sent: [["Patient", common.patient]], returned: ["Breath-hold time in seconds", "Device status", "Complete activity samples"], result: "The recorded breath-hold duration and complete sample sequence.", resultFields: [["Breath-hold time", "35 sec (example)"], ["Activity", "BOLT"], ["Transfer", "One complete JSON message"]] }
  };
  const devices = {
    cellit: { name: "Cellit", image: "./assets/products/cellit.jpg", alt: "Black Cellit device", serial: "DEMO-CELLIT-001", description: "IHHT therapy communication", activities: ["therapy"] },
    cellairone: { name: "CellAirOne", image: "./assets/products/cellairone.jpg", alt: "White CellAirOne medical device", serial: "DEMO-CAO-001", description: "Six activity-specific communication profiles", activities: Object.keys(activities) }
  };
  const metrics = {
    spo2: { label: "SpO2", unit: "%", color: "#16765b" },
    o2: { label: "Actual O2", unit: "%", color: "#2464cd" },
    hr: { label: "Heart rate", unit: "bpm", color: "#c23d4b" },
    rmssd: { label: "RMSSD", unit: "ms", color: "#946416" },
    hold: { label: "Breath hold", unit: "sec", color: "#167c85" }
  };
  function profile(device, activity) {
    const item = activities[device === "cellit" ? "therapy" : activity] || activities.therapy;
    return device === "cellit" ? Object.assign({}, item, { name: "IHHT therapy", metrics: ["spo2", "o2", "hr"], sent: [["Patient", common.patient], ["Hypoxia / reoxia", "3 / 2 example values"], ["Hypoxia O2", "12.5%"], ["Cycles / warmup", "5 / 1 example values"], ["SpO2 cutoff", "85%"]], returned: ["Elapsed time and cycle", "SpO2, actual and planned O2, heart rate", "HTI, alarms, device status and full therapy data"] }) : item;
  }
  function series(device, activity) {
    const p = profile(device, activity);
    return Array.from({ length: p.duration + 1 }, function (_, i) {
      const phase = i / p.duration;
      let spo2 = 96 - 5 * Math.pow(Math.sin(phase * Math.PI * 2), 2);
      if (activity === "ht1") spo2 = 97 - phase * 12;
      if (activity === "ht2") spo2 = 97 - Math.sin(phase * Math.PI) * 11;
      if (activity === "hyperoxia") spo2 = 97 + Math.sin(i / 9) * 0.5;
      return { second: i, spo2: spo2, o2: activity === "hyperoxia" ? 35 + Math.sin(i / 7) * 0.8 : 21 - Math.min(phase * 3, 1) * 8.5 + Math.sin(i / 8) * 0.3, hr: 73 + Math.sin(i / 7) * 3 + Math.cos(i / 3) * 0.7, rmssd: 32 + Math.sin(i / 9) * 5, hold: i };
    });
  }
  function envelope(type, data) {
    return { "Protocol version": 1, "Message type": type, Timestamp: common.timestamp, Data: data };
  }
  function settings(device, activity) {
    return envelope(profile(device, activity).settings, Object.fromEntries(fields[device === "cellit" ? "cellit" : activity] || fields.therapy));
  }
  function sample(device, activity, second) {
    const p = profile(device, activity);
    const value = series(device, activity)[Math.min(second, p.duration)];
    const round = function (n) { return Math.round(n * 10) / 10; };
    const body = { Timestamp: common.timestamp, Device_Name: devices[device].serial, "Device status": "Running", Device_IP: "192.0.2.10", Patient_Name: common.patient };
    if (device === "cellit" || activity === "therapy") {
      Object.assign(body, { Curr_Second: second, Total_Seconds: device === "cellit" ? 1560 : 2730, Therapy_Curr_CycleNr: 1, Curr_SpO2: round(value.spo2), Curr_ActualO2: round(value.o2), Curr_PlannedO2: 12.5, Curr_HR: round(value.hr), Curr_Hti: 0.8, CutOff_SpO2_Min: 85, Curr_CutOff_HR_Min: 40, Curr_CutOff_HR_Max: 120, SpO2_Sensor_Ok: 1, Main_Serial_Port_Ok: 1, Alarm_SpO2_Min: 0 });
      Object.assign(body, { Therapy_PreCond_Seconds: device === "cellit" ? 60 : 30, Therapy_NrOfCycles: 5, Therapy_CycleStep1_Seconds: device === "cellit" ? 180 : 120, Therapy_CycleStep2_Seconds: device === "cellit" ? 120 : 240, Therapy_CycleStep1_O2: 12.5 });
      ["Alarm_SpO2_Bottom", "Alarm_HR_Min", "Alarm_HR_Max", "Alarm_Dev_Prs_Min", "Alarm_Dev_Prs_Max", "Alarm_Dev_Temp_Max", "Alarm_Blocked_AirOutput", "Alarm_Hyperoxia_Setting_Err_Level_1", "Alarm_Hyperoxia_Setting_Err_Level_2", "Alarm_Hypoxia_Setting_Err"].forEach(function (key) { body[key] = 0; });
      if (device === "cellairone") Object.assign(body, { Curr_RMSSD: round(value.rmssd), Therapy_Mode: 1, Therapy_Type: 3, Slope: 2, Therapy_CycleStep3_Seconds: 180 });
      else body.Therapy_CycleStep2_O2 = 21;
    } else if (activity === "hyperoxia") Object.assign(body, { Curr_H_Therapy_Second: second, H_Therapy_TotalSeconds: 1800, Curr_SpO2_val: round(value.spo2), Curr_Oxyg_val: round(value.o2), Curr_HR_val: round(value.hr) });
    else if (activity === "ht1") Object.assign(body, { Curr_Test_second: second, PlannedO2: 12.5, ActualO2: round(value.o2), SpO2: round(value.spo2), HR: round(value.hr) });
    else if (activity === "ht2") Object.assign(body, { Curr_Test_second: second, phase_Nr: second < 30 ? 1 : 2, Phase1_sec: second < 30 ? second : null, Phase2_sec: second >= 30 ? second - 30 : null, SpO2: round(value.spo2), HR: round(value.hr) });
    else if (activity === "hrv") Object.assign(body, { Curr_Test_second: second, HRVtest_TotalSeconds: 300, Curr_HR_Val_from_HRV: round(value.hr), Curr_RMSSD: round(value.rmssd), HRVtest_RR: [812, 805] });
    else Object.assign(body, { Hold_Breath_Secs: second });
    const record = { sampleNo: second + 1 };
    record[p.timer] = second;
    record.data = body;
    return record;
  }
  function live(device, activity) { return envelope(profile(device, activity).live, { samples: [sample(device, activity, 1)] }); }
  function full(device, activity) {
    const p = profile(device, activity);
    const records = [sample(device, activity, 0), sample(device, activity, 1)];
    if (device === "cellit" || activity === "therapy") records.forEach(function (r) { r.currSecond = r.Curr_Second; delete r.Curr_Second; });
    const body = { totalSamples: records.length, samples: records };
    if (device === "cellairone" && (activity === "ht1" || activity === "ht2")) {
      Object.assign(body, { Timestamp: common.timestamp, Device_Name: devices[device].serial, "Device status": "Stopped", Device_IP: "192.0.2.10", Patient_Name: common.patient });
      if (activity === "ht1") Object.assign(body, { O2_Level_Arx: 12, SpO2Goal: 85, SecondsToSpO2Goal: 95, O2_Level_On_Goal: 10.5, TerminationReason: "SpO2GoalReached" });
      else Object.assign(body, { SpO2_Baseline: 97, Seconds_To_SpO2_Goal: 110, Seconds_To_SpO2_Baseline: 85, TerminationReason: "SpO2BaselineReached" });
    }
    if (activity === "hrv" && device === "cellairone") body.TerminationReason = "Completed";
    return envelope(p.full, body);
  }
  function boot(device) {
    return envelope("Boot_report", { "Serial number": devices[device].serial, "Software version": "example", "Boot status": "Ok", Errors: [], Coordinates: { latitude: 0, longitude: 0 }, Location: "Example location", "Service deadline": "2028-01-01", "Device status": "Available" });
  }
  function ping(device) { return envelope("Ping", { "Serial number": devices[device].serial }); }
  function validation(approved) { return envelope("Therapy_settings_validation", { Approved: approved, Message: approved ? "Settings approved" : "Settings not approved", Errors: approved ? [] : [{ Field: "Example setting", Description: "Value not accepted by the device" }] }); }
  window.DeviceDemo = { devices: devices, activities: activities, metrics: metrics, profile: profile, series: series, settings: settings, live: live, full: full, boot: boot, ping: ping, validation: validation, envelope: envelope };
})();
