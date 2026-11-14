(function () {
  "use strict";
  var canvas = document.getElementById("fractal-canvas");
  if (!canvas) return;
  var context = canvas.getContext("2d", { alpha: false });
  if (!context) return;
  var stage = canvas.parentElement;
  var scaleControl = document.getElementById("fractal-size");
  var colorControl = document.getElementById("fractal-color");
  var depthControl = document.getElementById("fractal-depth");
  var shapeControl = document.getElementById("fractal-shape");
  var scaleOutput = document.getElementById("fractal-size-value");
  var colorOutput = document.getElementById("fractal-color-value");
  var depthOutput = document.getElementById("fractal-depth-value");
  var depthLabel = document.getElementById("fractal-depth-label");
  var visualLabel = document.querySelector(".fractal-stage-label");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var visible = false, frame = 0, last = 0, width = 0, height = 0;
  var audio = { level: 0, bass: 0, treble: 0, attack: 0 }, pointer = { x: 0, y: 0 };
  var palettes = ["Âmbar", "Vermelho", "Magenta", "Índigo", "Ciano", "Verde"];
  function resize() {
    var rect = stage.getBoundingClientRect(), ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = Math.max(1, Math.round(rect.width * ratio));
    height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    draw(performance.now());
  }
  function triangle(x, y, radius, angle, depth, hue, alpha, time, pulse, spinSpeed) {
    var vertices = [];
    for (var i = 0; i < 3; i++) {
      var a = angle + i * Math.PI * 2 / 3 - Math.PI / 2;
      vertices.push([x + Math.cos(a) * radius, y + Math.sin(a) * radius]);
    }
    context.beginPath(); context.moveTo(vertices[0][0], vertices[0][1]);
    context.lineTo(vertices[1][0], vertices[1][1]); context.lineTo(vertices[2][0], vertices[2][1]); context.closePath();
    context.strokeStyle = "hsla(" + ((hue + depth * 17 + time * 4) % 360) + ", 68%, " + (65 + pulse * 12) + "%, " + alpha + ")";
    context.lineWidth = Math.max(0.7, width / 700) * (1 + depth * .035); context.stroke();
    if (depth <= 0 || radius < 3) return;
    var nextRadius = radius * .49, offset = radius * .5;
    for (var n = 0; n < 3; n++) {
      var childAngle = angle + n * Math.PI * 2 / 3 - Math.PI / 2;
      triangle(x + Math.cos(childAngle) * offset, y + Math.sin(childAngle) * offset,
        nextRadius, -angle * .42 + childAngle + time * spinSpeed * .28, depth - 1,
        hue + 11 + n * 8, alpha * .83, time, pulse, spinSpeed);
    }
  }
  function drawFlower(cx, cy, radius, intensity, hue, time, pulse, spinSpeed) {
    context.save(); context.translate(cx, cy);
    var petalCount = 6 + intensity * 2, petalLayers = 1 + Math.floor(intensity / 3);
    for (var layer = petalLayers - 1; layer >= 0; layer--) {
      var shrink = 1 - layer * .23;
      context.strokeStyle = "hsla(" + ((hue + layer * 30) % 360) + ", 68%, " + (68 - layer * 7) + "%, " + (.82 - layer * .16) + ")";
      context.lineWidth = Math.max(1, width / 650);
      for (var p = 0; p < petalCount; p++) {
        context.save(); context.rotate(p * Math.PI * 2 / petalCount + time * spinSpeed * (layer % 2 ? -.32 : .4));
        context.beginPath(); context.ellipse(0, -radius * .2 * shrink, radius * .11 * shrink,
          radius * (.34 + pulse * .025) * shrink, 0, 0, Math.PI * 2); context.stroke(); context.restore();
      }
    }
    var center = context.createRadialGradient(0, 0, radius * .02, 0, 0, radius * .16);
    center.addColorStop(0, "hsla(" + ((hue + 48) % 360) + ", 78%, 82%, .98)");
    center.addColorStop(1, "hsla(" + hue + ", 70%, 48%, .8)");
    context.fillStyle = center; context.beginPath(); context.arc(0, 0, radius * (.14 + pulse * .025), 0, Math.PI * 2); context.fill();
    context.restore();
  }
  function drawTreeBranch(length, depth, intensity, hue, time, pulse, spinSpeed) {
    context.strokeStyle = "hsla(" + ((hue + depth * 7) % 360) + ", 54%, " + (57 + pulse * 9) + "%, .9)";
    context.lineWidth = Math.max(1, width / 570) * Math.max(.45, (depth + 1) / (intensity + 1));
    context.beginPath(); context.moveTo(0, 0); context.lineTo(0, -length); context.stroke(); context.translate(0, -length);
    if (depth <= 0) {
      context.fillStyle = "hsla(" + ((hue + 36) % 360) + ", 62%, 68%, .9)";
      context.beginPath(); context.ellipse(0, 0, length * (.19 + pulse * .04), length * .1, time * spinSpeed, 0, Math.PI * 2); context.fill();
      return;
    }
    var sway = Math.sin(time * spinSpeed + depth) * .035;
    var next = length * .72, spread = .34 + intensity * .02;
    context.save(); context.rotate(-spread + sway); drawTreeBranch(next, depth - 1, intensity, hue - 9, time, pulse, spinSpeed); context.restore();
    context.save(); context.rotate(spread + sway); drawTreeBranch(next, depth - 1, intensity, hue + 9, time, pulse, spinSpeed); context.restore();
  }
  function drawTree(cx, cy, radius, intensity, hue, time, pulse, spinSpeed) {
    context.save(); context.translate(cx, cy + radius * .42); context.rotate(Math.sin(time * spinSpeed) * .04);
    drawTreeBranch(radius * .8, intensity, intensity, hue, time, pulse, spinSpeed); context.restore();
  }
  function drawFrogMotif(radius, hue, pulse) {
    context.lineWidth = Math.max(1, width / 620) * (1 + pulse * .15);
    context.strokeStyle = "hsla(" + hue + ", 64%, 70%, .92)";
    context.fillStyle = "hsla(" + ((hue + 24) % 360) + ", 60%, 62%, .27)";
    context.beginPath(); context.moveTo(-radius * .48, -radius * .08); context.lineTo(-radius * .32, -radius * .3);
    context.lineTo(-radius * .13, -radius * .22); context.lineTo(0, -radius * .3); context.lineTo(radius * .13, -radius * .22);
    context.lineTo(radius * .32, -radius * .3); context.lineTo(radius * .48, -radius * .08);
    context.quadraticCurveTo(radius * .42, radius * .38, 0, radius * .4); context.quadraticCurveTo(-radius * .42, radius * .38, -radius * .48, -radius * .08);
    context.closePath(); context.fill(); context.stroke();
    [-1, 1].forEach(function (side) {
      context.beginPath(); context.arc(side * radius * .27, -radius * .25, radius * .115, 0, Math.PI * 2); context.stroke();
      context.fillStyle = "hsla(" + ((hue + 52) % 360) + ", 78%, " + (74 + pulse * 8) + "%, .98)";
      context.beginPath(); context.arc(side * radius * .27, -radius * .25, radius * .043, 0, Math.PI * 2); context.fill();
      context.fillStyle = "hsla(" + ((hue + 24) % 360) + ", 60%, 62%, .27)";
      context.beginPath(); context.moveTo(side * radius * .3, radius * .2); context.lineTo(side * radius * .54, radius * .42);
      context.lineTo(side * radius * .28, radius * .35); context.moveTo(side * radius * .42, radius * .33); context.lineTo(side * radius * .55, radius * .23); context.stroke();
    });
    context.beginPath(); context.moveTo(-radius * .14, radius * .06); context.lineTo(0, radius * .12); context.lineTo(radius * .14, radius * .06); context.stroke();
  }
  function drawFrog(cx, cy, radius, intensity, hue, time, pulse, spinSpeed) {
    context.save(); context.translate(cx, cy); context.rotate(reduced.matches ? 0 : time * spinSpeed * .4);
    var ornaments = 4 + intensity * 2, orbit = radius * .58;
    context.strokeStyle = "hsla(" + hue + ", 58%, 62%, .38)"; context.lineWidth = Math.max(1, width / 760);
    [1, 1.13, 1.27].forEach(function (factor) { context.beginPath(); context.arc(0, 0, radius * factor, 0, Math.PI * 2); context.stroke(); });
    for (var i = 0; i < ornaments; i++) {
      var angle = i * Math.PI * 2 / ornaments - time * spinSpeed * .6;
      var x = Math.cos(angle) * orbit, y = Math.sin(angle) * orbit;
      context.save(); context.translate(x, y); context.rotate(angle);
      context.fillStyle = "hsla(" + ((hue + i * 360 / ornaments) % 360) + ", 68%, 72%, .82)";
      context.beginPath(); context.moveTo(0, -radius * .035); context.lineTo(radius * .035, 0);
      context.lineTo(0, radius * .035); context.lineTo(-radius * .035, 0); context.closePath(); context.fill(); context.restore();
    }
    context.save(); context.scale(1 + pulse * .04, 1 + pulse * .04); drawFrogMotif(radius * .66, hue + 8, pulse); context.restore();
    context.restore();
  }
  function draw(now) {
    if (!width || !height) return;
    var t = reduced.matches ? 0 : now * .001;
    var level = audio.level, bass = audio.bass, treble = audio.treble, pulse = level * .7 + audio.attack * .5;
    var centerX = width * (.5 + pointer.x * .035), centerY = height * (.5 + pointer.y * .035);
    var hue = (Number(colorControl.value) * 3.25 + 24 + treble * 42 + 360) % 360;
    var radius = Math.min(width, height) * (.48 * Number(scaleControl.value) / 78) * (1 + bass * .1);
    var intensity = Number(depthControl.value);
    var depth = intensity - 1;
    var ringCount = 2 + Math.ceil(intensity / 2);
    var spinSpeed = .05 + (intensity - 1) * .046 + treble * .14;
    context.fillStyle = "#100d0c"; context.fillRect(0, 0, width, height);
    var glow = context.createRadialGradient(centerX, centerY, radius * .03, centerX, centerY, radius * 1.25);
    glow.addColorStop(0, "hsla(" + hue + ", 65%, 48%, " + (.09 + pulse * .12) + ")");
    glow.addColorStop(1, "hsla(" + hue + ", 65%, 35%, 0)");
    context.fillStyle = glow; context.fillRect(0, 0, width, height);
    context.save(); context.translate(centerX, centerY);
    var spin = reduced.matches ? 0 : t * spinSpeed;
    if (shapeControl.value === "triangle") {
      for (var ring = 0; ring < ringCount; ring++) {
        var ringRadius = radius * (1 - ring * .13) * (1 + Math.sin(t * .8 + ring) * .018 + pulse * .035);
        triangle(0, 0, ringRadius, spin + ring * Math.PI / ringCount, depth, hue + ring * 22, .76 - ring * .07, t, pulse, spinSpeed);
      }
    } else if (shapeControl.value === "flower") drawFlower(0, 0, radius, intensity, hue, t, pulse, spinSpeed);
    else if (shapeControl.value === "tree") drawTree(0, 0, radius, intensity, hue, t, pulse, spinSpeed);
    else drawFrog(0, 0, radius * .74, intensity, hue, t, pulse, spinSpeed);
    context.restore();
  }
  function animate(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    if (reduced.matches || now - last > 32) { draw(now); last = now; }
    if (reduced.matches) return;
    frame = requestAnimationFrame(animate);
  }
  function wake() { if (visible && !document.hidden && !frame) frame = requestAnimationFrame(animate); }
  function updateControls() {
    scaleOutput.value = scaleControl.value + "%";
    var intensity = Number(depthControl.value), shape = shapeControl.value, label, amount, unit;
    if (shape === "triangle") {
      label = "Triângulos + giro"; unit = " △";
      amount = ((Math.pow(3, intensity) - 1) / 2) * (2 + Math.ceil(intensity / 2));
      visualLabel.textContent = "GEOMETRIA / TRIÂNGULOS";
    } else if (shape === "flower") {
      label = "Pétalas + giro"; unit = " pétalas"; amount = (6 + intensity * 2) * (1 + Math.floor(intensity / 3));
      visualLabel.textContent = "BOTÂNICA / FLOR";
    } else if (shape === "tree") {
      label = "Ramos + giro"; unit = " ramos"; amount = Math.pow(2, intensity + 1) - 1;
      visualLabel.textContent = "BOTÂNICA / ÁRVORE";
    } else {
      label = "Ornamentos + giro"; unit = " motivos"; amount = 4 + intensity * 2;
      visualLabel.textContent = "ORNAMENTO / SAPO";
    }
    depthLabel.textContent = label;
    depthOutput.value = intensity + " · " + amount.toLocaleString("pt-BR") + unit;
    depthOutput.title = intensity + " níveis · " + amount + unit.trim();
    var palette = palettes[Math.min(palettes.length - 1, Math.floor(Number(colorControl.value) / 20))];
    colorOutput.value = palette;
    draw(performance.now());
  }
  [scaleControl, colorControl, depthControl].forEach(function (control) { control.addEventListener("input", updateControls); });
  shapeControl.addEventListener("change", updateControls);
  stage.addEventListener("pointermove", function (event) {
    var bounds = stage.getBoundingClientRect();
    pointer.x = (event.clientX - bounds.left) / bounds.width - .5;
    pointer.y = (event.clientY - bounds.top) / bounds.height - .5;
    draw(performance.now());
  }, { passive: true });
  stage.addEventListener("pointerleave", function () { pointer.x = 0; pointer.y = 0; });
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) wake();
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }, { threshold: .05 }).observe(stage);
  document.addEventListener("visibilitychange", function () { if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; } else wake(); });
  window.fractalStudio = {
    setInput: function (level, x, y, bass, treble, attack) {
      audio = { level: level || 0, bass: bass || 0, treble: treble || 0, attack: attack || 0 };
      if (level > .04 || bass > .04 || treble > .04) wake();
      if (reduced.matches) draw(performance.now());
    }
  };
  updateControls(); resize();
})();
