(function () {
  "use strict";
  const shader = window.createShader(document.getElementById("gl"));
  const bar = document.getElementById("cabecalho");
  const main = document.getElementById("conteudo");
  const footer = document.getElementById("referencias");
  const ambientButton = document.getElementById("ambiente");
  const ambientLabel = ambientButton.textContent;
  const ambientHint = document.getElementById("ambient-hint");
  const vjPanel = document.getElementById("vj-panel");
  const vjToggle = document.getElementById("vj-toggle");
  const vjShape = document.getElementById("vj-shape");
  const geometryMixToggle = document.getElementById("vj-mix-toggle");
  const fractalStage = document.querySelector(".fractal-stage");
  const fractalStageParent = fractalStage.parentElement;
  const fractalStageNext = fractalStage.nextSibling;
  const dialog = document.getElementById("lb");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sections = [...main.querySelectorAll(":scope > section")];
  let activeSection = sections[0];
  let manualMode = null;
  let hashTimer = 0;
  let navigating = false;
  let ghostTimer = 0;
  let ghostStopped = false;
  let paint = null;
  let returnFocus = null;

  const demo = document.getElementById("demonstracao");
  const micButton = document.getElementById("demo-mic");
  const motionButton = document.getElementById("demo-motion");
  const micStatus = document.getElementById("mic-status");
  const motionStatus = document.getElementById("motion-status");
  const audioMeters = Array.from(document.querySelectorAll(".vj-audio-meter [data-band]"));
  const reactiveSurfaces = [demo, document.querySelector(".hero-copy")];
  const stage = document.getElementById("demo-stage");
  const modeSelect = document.getElementById("demo-mode");
  const vjMode = document.getElementById("vj-mode");
  stage.hidden = false;
  document.querySelector(".demo-tools").hidden = false;
  document.getElementById("demo-gesture").hidden = false;
  const preview = window.createShader(document.getElementById("demo-canvas"));
  preview.setActive(false);
  let stageVisible = false;
  let keyboardX = .5, keyboardY = .5;
  let micState = "off", motionState = "off", micGeneration = 0, motionGeneration = 0;
  let micStream = null, micContext = null, micSource = null, analyser = null, samples = null, frequencies = null;
  let orientationBase = null, motionTimer = 0, lastOrientation = 0;
  let level = 0, bass = 0, mid = 0, treble = 0, attack = 0, tiltX = 0, tiltY = 0, targetX = 0, targetY = 0;
  let previousBassTarget = 0, previousMidTarget = 0, previousTrebleTarget = 0;
  let inputFrame = 0, lastInputUpdate = 0;

  function updatePreviewVisibility() {
    preview.setActive(stageVisible && !document.hidden && !document.body.classList.contains("ambient"));
  }
  new IntersectionObserver(function (entries) {
    stageVisible = entries[0].isIntersecting;
    updatePreviewVisibility();
  }, { threshold: .05 }).observe(stage);
  modeSelect.addEventListener("change", function () {
    manualMode = Number(modeSelect.value);
    vjMode.value = modeSelect.value;
    preview.setTarget(manualMode, .7);
    applySection(activeSection);
  });
  vjMode.addEventListener("change", function () {
    modeSelect.value = vjMode.value;
    manualMode = Number(vjMode.value);
    shader.setTarget(manualMode, Number(activeSection.dataset.hue));
    applySection(activeSection);
  });
  vjShape.addEventListener("change", function () {
    if (window.fractalStudio) window.fractalStudio.setShape(vjShape.value);
  });
  function bindVjRange(id, outputId, parameter, scale, suffix, decimals) {
    const input = document.getElementById(id), output = document.getElementById(outputId);
    function update() {
      const value = Number(input.value);
      shader.params[parameter] = value / scale;
      output.value = decimals ? (value / scale).toFixed(decimals) + suffix : value + suffix;
      output.textContent = output.value;
      shader.invalidate();
    }
    input.addEventListener("input", update);
    update();
  }
  bindVjRange("vj-speed", "vj-speed-value", "speed", 100, "×", 1);
  bindVjRange("vj-warp", "vj-warp-value", "warp", 100, "%", 0);
  bindVjRange("vj-pigment", "vj-pigment-value", "pigment", 100, "%", 0);
  const micSensitivityControl = document.getElementById("mic-sensitivity");
  const micSensitivityValue = document.getElementById("mic-sensitivity-value");
  let micSensitivity = Number(micSensitivityControl.value) / 100;
  function updateMicSensitivity() {
    micSensitivity = Number(micSensitivityControl.value) / 100;
    micSensitivityValue.value = micSensitivityControl.value + "%";
    micSensitivityValue.textContent = micSensitivityValue.value;
    renderInput();
  }
  micSensitivityControl.addEventListener("input", updateMicSensitivity);
  function closeVjPanel(returnFocus) {
    vjPanel.hidden = true;
    vjToggle.setAttribute("aria-expanded", "false");
    if (returnFocus) vjToggle.focus({ preventScroll: true });
  }
  function toggleVjPanel() {
    const open = vjPanel.hidden;
    vjPanel.hidden = !open;
    vjToggle.setAttribute("aria-expanded", String(open));
    if (open) document.getElementById("vj-mode").focus({ preventScroll: true });
  }
  vjToggle.addEventListener("click", toggleVjPanel);
  document.getElementById("vj-close").addEventListener("click", function () { closeVjPanel(true); });
  document.getElementById("vj-hide").addEventListener("click", function () { closeVjPanel(true); });
  function setGeometryMix(enabled) {
    if (enabled) {
      document.body.appendChild(fractalStage);
      fractalStage.classList.add("ambient-fractal-layer");
    } else {
      fractalStage.classList.remove("ambient-fractal-layer");
      fractalStageParent.insertBefore(fractalStage, fractalStageNext && fractalStageNext.parentNode === fractalStageParent ? fractalStageNext : null);
    }
    if (window.fractalStudio) window.fractalStudio.setAmbientBlend(enabled);
    geometryMixToggle.setAttribute("aria-pressed", String(enabled));
    geometryMixToggle.textContent = enabled ? geometryMixToggle.dataset.on : geometryMixToggle.dataset.off;
  }
  geometryMixToggle.addEventListener("click", function () {
    if (document.body.classList.contains("ambient")) { setGeometryMix(geometryMixToggle.getAttribute("aria-pressed") !== "true"); return; }
    setAmbient(true);
    setGeometryMix(true);
  });
  document.addEventListener("pointerdown", function (event) {
    if (!vjPanel.hidden && !vjPanel.contains(event.target) && !vjToggle.contains(event.target)) closeVjPanel(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !vjPanel.hidden) { event.preventDefault(); closeVjPanel(true); }
  });
  document.getElementById("demo-clear").addEventListener("click", function () {
    releasePaint(); shader.clearStains(); preview.clearStains();
  });

  function sensorStatus(button, status, state, message) {
    button.dataset.state = state;
    button.setAttribute("aria-pressed", String(state !== "off"));
    button.setAttribute("aria-label", state === "off" ? button.dataset.off : button.dataset.on);
    button.textContent = button.dataset.short;
    status.textContent = status.dataset[message];
  }
  function renderInput() {
    const x = reduced.matches ? 0 : tiltX, y = reduced.matches ? 0 : tiltY;
    const audioLevel = Math.min(1, level * micSensitivity);
    const audioBass = Math.min(1, bass * micSensitivity);
    const audioMid = Math.min(1, mid * micSensitivity);
    const audioTreble = Math.min(1, treble * micSensitivity);
    const audioAttack = Math.min(1, attack * micSensitivity);
    shader.setInput(audioLevel, x, y, audioBass, audioTreble, audioAttack, audioMid);
    preview.setInput(audioLevel, x, y, audioBass, audioTreble, audioAttack, audioMid);
    if (window.fractalStudio) window.fractalStudio.setInput(audioLevel, x, y, audioBass, audioTreble, audioAttack, audioMid);
    micButton.style.setProperty("--mic-level", audioLevel.toFixed(3));
    micButton.style.boxShadow = audioLevel > 0 ? "0 0 " + (6 + audioLevel * 22).toFixed(1) + "px rgba(var(--accent-rgb)," + (.08 + audioLevel * .34).toFixed(2) + ")" : "";
    audioMeters.forEach(function (meter) {
      const value = meter.dataset.band === "low" ? audioBass : meter.dataset.band === "mid" ? audioMid : audioTreble;
      meter.style.setProperty("--band-level", value.toFixed(3));
    });
    reactiveSurfaces.forEach(function (surface) {
      surface.style.setProperty("--input-level", audioLevel.toFixed(3));
      surface.style.setProperty("--input-x", (x * 8).toFixed(2) + "px");
      surface.style.setProperty("--input-y", (y * 8).toFixed(2) + "px");
    });
  }
  function scheduleInput() {
    if (!inputFrame && (micState === "active" || motionState === "active")) inputFrame = requestAnimationFrame(updateInput);
  }
  function bandEnergy(from, to) {
    const binWidth = micContext.sampleRate / analyser.fftSize;
    const first = Math.max(1, Math.floor(from / binWidth));
    const last = Math.min(frequencies.length - 1, Math.ceil(to / binWidth));
    let sum = 0, firstPeak = 0, secondPeak = 0, thirdPeak = 0;
    for (let i = first; i <= last; i++) {
      const value = frequencies[i] / 255;
      sum += value * value;
      if (value > firstPeak) { thirdPeak = secondPeak; secondPeak = firstPeak; firstPeak = value; }
      else if (value > secondPeak) { thirdPeak = secondPeak; secondPeak = value; }
      else if (value > thirdPeak) thirdPeak = value;
    }
    const bandRms = Math.sqrt(sum / Math.max(1, last - first + 1));
    return Math.min(1, (firstPeak + secondPeak + thirdPeak) * .25 + bandRms * .25);
  }
  function updateInput(now) {
    inputFrame = 0;
    if (document.hidden) { stopDemo(); return; }
    if (now - lastInputUpdate >= (reduced.matches ? 100 : 32)) {
      const dt = Math.min((now - lastInputUpdate) / 1000, .1);
      lastInputUpdate = now;
      let targetLevel = 0, targetBass = 0, targetMid = 0, targetTreble = 0;
      if (analyser) {
        analyser.getFloatTimeDomainData(samples);
        analyser.getByteFrequencyData(frequencies);
        let sum = 0, mean = 0;
        for (let i = 0; i < samples.length; i++) mean += samples[i];
        mean /= samples.length;
        for (let i = 0; i < samples.length; i++) { const centered = samples[i] - mean; sum += centered * centered; }
        const rms = Math.sqrt(sum / samples.length);
        targetLevel = 1 - Math.exp(-Math.max(0, rms - .0025) * 26);
        const spectralGate = Math.max(0, targetLevel - .018) * 8.5;
        targetBass = Math.min(1, bandEnergy(45, 250) * spectralGate);
        targetMid = Math.min(1, bandEnergy(250, 1800) * spectralGate);
        targetTreble = Math.min(1, bandEnergy(1800, 9000) * spectralGate);
      }
      const rise = Math.max(0, targetLevel - level);
      const spectralRise = Math.max(0, targetBass - previousBassTarget, targetMid - previousMidTarget, targetTreble - previousTrebleTarget);
      previousBassTarget = targetBass;
      previousMidTarget = targetMid;
      previousTrebleTarget = targetTreble;
      const smoothing = 1 - Math.exp(-dt * (targetLevel > level ? 24 : 5));
      level += (targetLevel - level) * (reduced.matches ? 1 : smoothing);
      bass += (targetBass - bass) * (reduced.matches ? 1 : 1 - Math.exp(-dt * 13));
      mid += (targetMid - mid) * (reduced.matches ? 1 : 1 - Math.exp(-dt * 15));
      treble += (targetTreble - treble) * (reduced.matches ? 1 : 1 - Math.exp(-dt * 18));
      const transient = Math.min(1, Math.max(rise * 4.8, spectralRise * 2.2));
      attack += (transient - attack) * (1 - Math.exp(-dt * (transient > attack ? 30 : 6)));
      if (level < .001) level = 0;
      const tiltSmoothing = reduced.matches ? 1 : 1 - Math.exp(-dt * 10);
      tiltX += (targetX - tiltX) * tiltSmoothing;
      tiltY += (targetY - tiltY) * tiltSmoothing;
      if (motionState === "active" && now - lastOrientation > 6000) stopMotion("unavailable");
      renderInput();
    }
    scheduleInput();
  }
  function stopMic(message = "idle") {
    micGeneration += 1;
    micState = "off";
    if (micSource) micSource.disconnect();
    if (analyser) analyser.disconnect();
    if (micStream) micStream.getTracks().forEach(function (track) { track.stop(); });
    if (micContext) micContext.close().catch(function () {});
    micStream = null; micContext = null; micSource = null; analyser = null; samples = null; frequencies = null;
    level = 0; bass = 0; mid = 0; treble = 0; attack = 0;
    previousBassTarget = 0; previousMidTarget = 0; previousTrebleTarget = 0;
    sensorStatus(micButton, micStatus, "off", message);
    renderInput();
    if (motionState !== "active") { cancelAnimationFrame(inputFrame); inputFrame = 0; }
  }
  function stopMotion(message = "idle") {
    motionGeneration += 1;
    motionState = "off";
    window.removeEventListener("deviceorientation", onOrientation);
    clearTimeout(motionTimer); motionTimer = 0;
    orientationBase = null; targetX = 0; targetY = 0; tiltX = 0; tiltY = 0;
    sensorStatus(motionButton, motionStatus, "off", message);
    renderInput();
    if (micState !== "active") { cancelAnimationFrame(inputFrame); inputFrame = 0; }
  }
  function stopDemo() { stopMic(); stopMotion(); }
  micButton.hidden = false; motionButton.hidden = false;
  micButton.addEventListener("click", async function () {
    if (micState !== "off") { stopMic(); return; }
    if (!window.isSecureContext) { sensorStatus(micButton, micStatus, "off", "secure"); return; }
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!navigator.mediaDevices?.getUserMedia || !Context) { sensorStatus(micButton, micStatus, "off", "unavailable"); return; }
    const generation = ++micGeneration;
    micState = "pending";
    sensorStatus(micButton, micStatus, "pending", "pending");
    try {
      const context = new Context();
      micContext = context;
      const resumed = context.resume().then(function () { return true; }, function () { return false; });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
      if (generation !== micGeneration || document.hidden) { stream.getTracks().forEach(function (track) { track.stop(); }); return; }
      micStream = stream;
      if (!await resumed) throw new Error("AudioContext unavailable");
      if (generation !== micGeneration) return;
      analyser = context.createAnalyser(); analyser.fftSize = 2048;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -24;
      analyser.smoothingTimeConstant = .24;
      samples = new Float32Array(analyser.fftSize);
      frequencies = new Uint8Array(analyser.frequencyBinCount);
      micSource = context.createMediaStreamSource(stream);
      micSource.connect(analyser);
      micState = "active";
      sensorStatus(micButton, micStatus, "active", "active");
      stream.getAudioTracks().forEach(function (track) {
        track.addEventListener("ended", function () { if (generation === micGeneration) stopMic("unavailable"); }, { once: true });
      });
      scheduleInput();
    } catch (error) {
      if (generation === micGeneration) stopMic(error.name === "NotAllowedError" || error.name === "SecurityError" ? "denied" : "unavailable");
    }
  });
  function onOrientation(event) {
    if (!Number.isFinite(event.beta) || !Number.isFinite(event.gamma) || motionState === "off") return;
    lastOrientation = performance.now();
    if (!orientationBase) {
      orientationBase = { beta: event.beta, gamma: event.gamma };
      clearTimeout(motionTimer); motionTimer = 0;
      motionState = "active";
      sensorStatus(motionButton, motionStatus, "active", "active");
    }
    const beta = ((event.beta - orientationBase.beta + 540) % 360 - 180) / 30;
    const gamma = (event.gamma - orientationBase.gamma) / 30;
    const angle = (screen.orientation?.angle || window.orientation || 0) * Math.PI / 180;
    targetX = Math.max(-1, Math.min(1, gamma * Math.cos(angle) + beta * Math.sin(angle)));
    targetY = Math.max(-1, Math.min(1, beta * Math.cos(angle) - gamma * Math.sin(angle)));
    scheduleInput();
  }
  motionButton.addEventListener("click", async function () {
    if (motionState !== "off") { stopMotion(); return; }
    if (!window.isSecureContext) { sensorStatus(motionButton, motionStatus, "off", "secure"); return; }
    if (!window.DeviceOrientationEvent) { sensorStatus(motionButton, motionStatus, "off", "unavailable"); return; }
    const generation = ++motionGeneration;
    motionState = "pending";
    sensorStatus(motionButton, motionStatus, "pending", "pending");
    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function" && await DeviceOrientationEvent.requestPermission() !== "granted") {
        if (generation === motionGeneration) stopMotion("denied");
        return;
      }
      if (generation !== motionGeneration || document.hidden) return;
      window.addEventListener("deviceorientation", onOrientation, { passive: true });
      motionTimer = setTimeout(function () { stopMotion("unavailable"); }, 6000);
    } catch (_) { if (generation === motionGeneration) stopMotion("denied"); }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stopDemo(); releasePaint(); }
    updatePreviewVisibility();
  });
  window.addEventListener("pagehide", function () { stopDemo(); releasePaint(); preview.setActive(false); });
  reduced.addEventListener("change", renderInput);

  function applySection(section) {
    if (section.id !== "inicio" && (micState !== "off" || motionState !== "off")) stopDemo();
    activeSection = section;
    const mode = manualMode === null ? Number(section.dataset.mode) : manualMode;
    shader.setTarget(mode, Number(section.dataset.hue));
    if (section.id === "inicio") { modeSelect.value = String(mode); preview.setTarget(mode, .7); }
    bar.querySelectorAll("nav a").forEach(function (link) {
      if (link.hash === "#" + section.id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }
  function hashTarget() {
    try { return document.getElementById(decodeURIComponent(location.hash.slice(1))); }
    catch (_) { return null; }
  }
  function reveal(target) {
    let parent = target;
    while (parent && parent !== main) {
      if (parent.tagName === "DETAILS") parent.open = true;
      parent = parent.parentElement;
    }
  }
  function navigate(id, updateHistory, focus) {
    const target = document.getElementById(id);
    if (!target) { console.warn("Âncora quebrada:", id); return; }
    reveal(target);
    const section = target.closest("main > section");
    if (section) applySection(section);
    if (updateHistory && location.hash !== "#" + id) history.pushState(null, "", "#" + id);
    navigating = true;
    clearTimeout(hashTimer);
    requestAnimationFrame(function () {
      const destination = target.tagName === "DETAILS" ? target.querySelector("summary") : target;
      target.scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth", block: "start" });
      if (focus) {
        if (!destination.hasAttribute("tabindex") && !destination.matches("summary, button, a")) destination.setAttribute("tabindex", "-1");
        destination.focus({ preventScroll: true });
      }
      hashTimer = setTimeout(function () { navigating = false; }, reduced.matches ? 0 : 800);
    });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    const id = link.getAttribute("href").slice(1);
    if (!document.getElementById(id)) console.warn("Âncora quebrada:", id);
    link.addEventListener("click", function (event) {
      event.preventDefault();
      if (link.closest(".bar nav, .hero-actions")) window.SoleAudio.playMenu("navigate");
      navigate(id, true, true);
    });
  });
  window.addEventListener("hashchange", function () {
    const target = hashTarget();
    if (target) navigate(target.id, false, false);
    else if (location.hash) console.warn("Âncora quebrada:", location.hash);
  });
  window.addEventListener("popstate", function () {
    const target = hashTarget();
    navigate(target ? target.id : "inicio", false, false);
  });
  let observer;
  function observeSections() {
    const barHeight = bar.getBoundingClientRect().height;
    const readingLine = Math.min(innerHeight - 1, barHeight + Math.max(1, (innerHeight - barHeight) * .2));
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(function () {
      const current = sections.find(function (section) {
        const rect = section.getBoundingClientRect();
        return rect.top <= readingLine && rect.bottom > readingLine;
      });
      if (!current || current === activeSection) return;
      applySection(current);
      const target = hashTarget();
      if (!navigating && !document.body.classList.contains("ambient") && (!target || !current.contains(target))) history.replaceState(null, "", "#" + current.id);
    }, { rootMargin: "-" + readingLine + "px 0px -" + (innerHeight - readingLine - 1) + "px 0px", threshold: 0 });
    sections.forEach(function (section) { observer.observe(section); });
  }
  window.addEventListener("resize", observeSections, { passive: true });
  observeSections();

  function stopGhosts() { clearTimeout(ghostTimer); ghostTimer = 0; }
  function scheduleGhost(delay) {
    stopGhosts();
    if (reduced.matches || ghostStopped || !document.body.classList.contains("ambient")) return;
    ghostTimer = setTimeout(function () {
      if (document.hidden) { scheduleGhost(7000); return; }
      shader.addStain(.15 + Math.random() * .7, .25 + Math.random() * .5, 0, 0);
      shader.releasePointer();
      scheduleGhost(7000);
    }, delay);
  }
  function releasePaint() {
    if (paint && paint.painted) { shader.releasePointer(); preview.releasePointer(); }
    if (paint && stage.hasPointerCapture(paint.id)) stage.releasePointerCapture(paint.id);
    stage.dataset.interacting = "false";
    paint = null;
  }
  function setAmbient(on) {
    if (!on) setGeometryMix(false);
    if (on) stopDemo();
    releasePaint();
    document.body.classList.toggle("ambient", on);
    updatePreviewVisibility();
    ambientButton.setAttribute("aria-pressed", String(on));
    ambientButton.textContent = on ? ambientButton.dataset.readingLabel : ambientLabel;
    ambientButton.dataset.i18n = on ? "return-reading" : "ambient";
    ambientHint.hidden = !on;
    bar.querySelector("nav").inert = on;
    document.getElementById("logo-sole").inert = on;
    document.getElementById("idioma-header").inert = on;
    main.inert = on; footer.inert = on;
    if (on) scheduleGhost(3500);
    else { stopGhosts(); closeVjPanel(false); }
    ambientButton.focus({ preventScroll: true });
  }
  ambientButton.addEventListener("click", function () {
    window.SoleAudio.playMenu("ambient");
    setAmbient(!document.body.classList.contains("ambient"));
  });
  reduced.addEventListener("change", function () {
    if (reduced.matches) { stopGhosts(); releasePaint(); }
    else scheduleGhost(3500);
  });
  function canPaint(x, y) {
    const target = document.elementFromPoint(x, y);
    if (!target || target.closest("a, button, select, summary, dialog, .ambient-hint")) return false;
    return !!target.closest("#demo-stage") || document.body.classList.contains("ambient") || !target.closest(".sheet, .bar");
  }
  function stagePointer(x, y, vx = 0, vy = 0) {
    const bounds = stage.getBoundingClientRect();
    keyboardX = Math.max(0, Math.min(1, (x - bounds.left) / bounds.width));
    keyboardY = Math.max(0, Math.min(1, (y - bounds.top) / bounds.height));
    preview.setPointer(keyboardX, keyboardY, vx, vy);
    stage.style.setProperty("--pointer-x", (keyboardX * 100) + "%");
    stage.style.setProperty("--pointer-y", (keyboardY * 100) + "%");
    stage.dataset.interacting = "true";
    const background = document.getElementById("gl").getBoundingClientRect();
    shader.setPointer((x - background.left) / background.width, (y - background.top) / background.height, vx, vy);
  }
  function addPaint(x, y) {
    if (!paint.stage && !canPaint(x, y)) return;
    const bounds = document.getElementById("gl").getBoundingClientRect();
    const reference = Math.max(1, Math.min(bounds.width, bounds.height));
    const vx = paint.painted ? (x - paint.lastX) / reference : 0;
    const vy = paint.painted ? (y - paint.lastY) / reference : 0;
    shader.addStain((x - bounds.left) / bounds.width, (y - bounds.top) / bounds.height, vx, vy);
    if (paint.stage) {
      stagePointer(x, y, vx, vy);
      preview.addStain(keyboardX, keyboardY, vx, vy);
    }
    paint.painted = true; paint.lastX = x; paint.lastY = y;
    ghostStopped = true; stopGhosts();
  }
  stage.addEventListener("pointerleave", function () {
    if (!paint) { preview.releasePointer(); shader.releasePointer(); stage.dataset.interacting = "false"; }
  });
  stage.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " ", "Escape"].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    if (event.key === "Escape") {
      preview.clearStains(); shader.releasePointer(); stage.dataset.interacting = "false"; stopDemo(); return;
    }
    keyboardX = Math.max(0, Math.min(1, keyboardX + (event.key === "ArrowRight" ? .06 : event.key === "ArrowLeft" ? -.06 : 0)));
    keyboardY = Math.max(0, Math.min(1, keyboardY + (event.key === "ArrowDown" ? .06 : event.key === "ArrowUp" ? -.06 : 0)));
    const bounds = stage.getBoundingClientRect();
    stagePointer(bounds.left + keyboardX * bounds.width, bounds.top + keyboardY * bounds.height);
    if (event.key === "Enter" || event.key === " ") {
      preview.addStain(keyboardX, keyboardY, 0, 0);
      const background = document.getElementById("gl").getBoundingClientRect();
      shader.addStain((bounds.left + keyboardX * bounds.width - background.left) / background.width, (bounds.top + keyboardY * bounds.height - background.top) / background.height, 0, 0);
      preview.releasePointer(); shader.releasePointer();
    }
  });
  document.addEventListener("pointerdown", function (event) {
    if (!event.isPrimary || event.button !== 0 || !canPaint(event.clientX, event.clientY)) return;
    paint = { id: event.pointerId, type: event.pointerType, stage: !!event.target.closest("#demo-stage"), x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, painted: false };
    if (paint.stage && event.isTrusted && event.pointerType !== "touch") stage.setPointerCapture(event.pointerId);
    if (event.pointerType !== "touch" || document.body.classList.contains("ambient")) addPaint(event.clientX, event.clientY);
  }, { passive: true });
  document.addEventListener("pointermove", function (event) {
    if (!paint && event.pointerType === "mouse" && event.target.closest("#demo-stage")) {
      stagePointer(event.clientX, event.clientY); return;
    }
    if (!paint || event.pointerId !== paint.id) return;
    const dx = event.clientX - paint.x, dy = event.clientY - paint.y;
    if (paint.type === "touch" && !document.body.classList.contains("ambient") && !paint.painted) {
      // Pan-y reserva gestos verticais à rolagem; a tinta só começa com intenção horizontal.
      if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx)) { releasePaint(); return; }
      if (Math.abs(dx) < 10 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
    }
    if (Math.hypot(event.clientX - paint.lastX, event.clientY - paint.lastY) >= 10) {
      if (paint.stage && event.isTrusted && !stage.hasPointerCapture(event.pointerId)) stage.setPointerCapture(event.pointerId);
      addPaint(event.clientX, event.clientY);
    }
  }, { passive: true });
  document.addEventListener("pointerup", function (event) {
    if (!paint || event.pointerId !== paint.id) return;
    if (!paint.painted && Math.hypot(event.clientX - paint.x, event.clientY - paint.y) < 8) addPaint(event.clientX, event.clientY);
    releasePaint();
  }, { passive: true });
  document.addEventListener("pointercancel", releasePaint, { passive: true });
  window.addEventListener("scroll", function () { if (!document.body.classList.contains("ambient")) releasePaint(); }, { passive: true });
  window.addEventListener("blur", releasePaint);

  document.addEventListener("keydown", function (event) {
    if (dialog.open || event.ctrlKey || event.metaKey || event.altKey || event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    const key = event.key.toLowerCase();
    if (key === "escape" && document.body.classList.contains("ambient")) { event.preventDefault(); setAmbient(false); }
    else if (key === "escape" && (micState !== "off" || motionState !== "off")) { event.preventDefault(); stopDemo(); }
    else if (key === "a") { event.preventDefault(); setAmbient(!document.body.classList.contains("ambient")); }
    else if (key === "x") { event.preventDefault(); shader.clearStains(); }
    else if (key === "0") { event.preventDefault(); manualMode = null; applySection(activeSection); }
    else if (/^[1-5]$/.test(key)) { event.preventDefault(); manualMode = [1, 2, 3, 0, 4][Number(key) - 1]; applySection(activeSection); }
  });
  document.getElementById("logo-sole").addEventListener("click", function () { window.SoleAudio.playLogo("sole"); navigate("inicio", true, true); });
  document.getElementById("logo-v").addEventListener("click", function () { window.SoleAudio.playLogo("v1su4rt"); });
  main.querySelectorAll("details > summary").forEach(function (summary) {
    summary.addEventListener("click", function () {
      window.SoleAudio.playMenu(summary.parentElement.open ? "close" : "open");
    });
  });

  document.querySelectorAll(".gallery a").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const img = link.querySelector("img");
      const caption = link.closest("figure").querySelector("figcaption");
      returnFocus = link;
      document.getElementById("lb-img").src = link.href;
      document.getElementById("lb-img").alt = img.alt;
      document.getElementById("lb-caption").textContent = caption.innerText;
      stopDemo();
      dialog.showModal();
      document.getElementById("lb-fechar").focus();
    });
  });
  document.getElementById("lb-fechar").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", function () {
    document.getElementById("lb-img").removeAttribute("src");
    if (returnFocus) returnFocus.focus({ preventScroll: true });
  });
  const copyButton = document.getElementById("pix-copiar");
  copyButton.addEventListener("click", async function () {
    const status = document.getElementById("pix-status");
    try { await navigator.clipboard.writeText(copyButton.dataset.copy); status.textContent = copyButton.dataset.copied; }
    catch (_) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.getElementById("pix-chave"));
      selection.removeAllRanges(); selection.addRange(range);
      status.textContent = copyButton.dataset.copyFallback;
    }
  });
  const language = document.querySelector(".language");
  document.getElementById("idioma").addEventListener("change", function (event) {
    const destination = new URL(event.target.selectedOptions[0].dataset.href, document.baseURI);
    destination.hash = location.hash;
    location.assign(destination.href);
  });
  const small = window.matchMedia("(max-width: 480px)");
  function moveLanguage() {
    document.getElementById(small.matches ? "idioma-footer" : "idioma-header").appendChild(language);
  }
  small.addEventListener("change", moveLanguage); moveLanguage();
  document.querySelectorAll("a[href]").forEach(function (link) {
    const href = link.getAttribute("href");
    if (!/^(https:|mailto:|tel:|#|(?:\.\.\/)?img\/|(?:\.\.\/)?(?:(?:es|en|fr)\/)?index\.html(?:#|$))/.test(href)) console.warn("Link sem protocolo autorizado:", href);
  });
  document.querySelectorAll(".gallery img").forEach(function (img) {
    if (!img.alt || !img.closest("figure").querySelector("figcaption")?.textContent.trim()) console.warn("Imagem sem alt ou legenda:", img.getAttribute("src"));
  });
  document.documentElement.classList.add("js-ready");
  applySection(activeSection);
  const initial = hashTarget();
  if (initial) navigate(initial.id, false, false);
  else if (location.hash) console.warn("Âncora quebrada:", location.hash);
})();
