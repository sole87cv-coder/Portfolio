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
  var shapeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-fractal-shape]"));
  var scaleOutput = document.getElementById("fractal-size-value");
  var colorOutput = document.getElementById("fractal-color-value");
  var depthOutput = document.getElementById("fractal-depth-value");
  var depthLabel = document.getElementById("fractal-depth-label");
  var visualLabel = document.querySelector(".fractal-stage-label");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var visible = false, frame = 0, last = 0, width = 0, height = 0;
  var audio = { level: 0, bass: 0, treble: 0, attack: 0 }, pointer = { x: 0, y: 0 };
  var displayedScale = Number(scaleControl.value), lastScaleStep = 0;
  var displayedFragment = 0, lastFragmentStep = 0;
  var frogSprite = document.createElement("canvas"); frogSprite.width = 512; frogSprite.height = 512;
  var frogSpriteContext = frogSprite.getContext("2d");
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
  function drawTreeLeafCluster(size, hue, pulse, time, spinSpeed, phase, opacity) {
    var beat = Math.min(1, Math.max(0, pulse));
    context.save();
    context.rotate(Math.sin(time * spinSpeed * .72 + phase) * (.055 + beat * .075));
    context.scale(1 + beat * .07, 1 + beat * .045);
    context.fillStyle = "hsla(" + ((hue + 106) % 360) + ", 44%, " + (53 + beat * 7) + "%, " + opacity + ")";
    context.beginPath();
    context.ellipse(0, 0, size * .72, size * .38, 0, 0, Math.PI * 2);
    context.ellipse(-size * .45, -size * .2, size * .56, size * .29, -.52, 0, Math.PI * 2);
    context.ellipse(size * .45, -size * .2, size * .56, size * .29, .52, 0, Math.PI * 2);
    context.ellipse(-size * .16, -size * .47, size * .48, size * .25, -.82, 0, Math.PI * 2);
    context.ellipse(size * .2, -size * .45, size * .45, size * .24, .78, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "hsla(" + ((hue + 128) % 360) + ", 40%, 82%, " + (opacity * .62) + ")";
    context.lineWidth = Math.max(.45, size * .035);
    context.beginPath(); context.moveTo(0, size * .27); context.lineTo(0, -size * .34);
    context.moveTo(-size * .03, -size * .04); context.lineTo(-size * .34, -size * .34);
    context.moveTo(size * .03, -size * .05); context.lineTo(size * .34, -size * .34); context.stroke();
    context.restore();
  }
  function drawTreeBranch(length, depth, intensity, hue, time, pulse, spinSpeed, direction, branchRatio, canopyRadius, pixelScale) {
    var beat = Math.min(1, Math.max(0, pulse));
    context.strokeStyle = "hsla(" + ((hue + depth * 7) % 360) + ", 54%, " + (57 + beat * 9) + "%, .94)";
    context.lineWidth = Math.max(1, width / 570) * Math.max(.68, (depth + 1) / (intensity + 4)) / pixelScale;
    var bend = Math.sin(time * spinSpeed + depth * 1.9 + direction) * length * (.035 + beat * .055);
    context.beginPath(); context.moveTo(0, 0); context.quadraticCurveTo(bend, -length * .54, 0, -length); context.stroke(); context.translate(0, -length);
    var leafSize = canopyRadius * (.055 + intensity * .0035);
    if (depth === 2) drawTreeLeafCluster(leafSize * .62, hue + 18, beat, time, spinSpeed, direction + depth, .48);
    if (depth <= 0) { drawTreeLeafCluster(leafSize, hue + 10, beat, time, spinSpeed, direction, .86); return; }
    var sway = Math.sin(time * spinSpeed + depth + direction * 2) * .025 +
      Math.sin(time * spinSpeed * 1.7 + direction + depth) * beat * .026;
    var next = length * branchRatio, spread = .84 + intensity * .022 + beat * .06;
    var leftDirection = Math.max(-1.45, direction - spread + sway - beat * .015);
    var rightDirection = Math.min(1.45, direction + spread + sway + beat * .015);
    context.save(); context.rotate(leftDirection - direction);
    drawTreeBranch(next, depth - 1, intensity, hue - 12, time, beat, spinSpeed, leftDirection, branchRatio, canopyRadius, pixelScale); context.restore();
    context.save(); context.rotate(rightDirection - direction);
    drawTreeBranch(next, depth - 1, intensity, hue + 12, time, beat, spinSpeed, rightDirection, branchRatio, canopyRadius, pixelScale); context.restore();
  }  function drawTreeRoots(radius, intensity, hue, time, pulse, spinSpeed, pixelScale) {
    var rootCount = 7 + intensity * 2, baseWidth = Math.max(1.2, width / 520) / pixelScale;
    context.save(); context.lineCap = "round"; context.lineJoin = "round";
    for (var i = 0; i < rootCount; i++) {
      var angle = -1.12 + i * 2.24 / (rootCount - 1);
      var length = radius * (.34 + .13 * (1 - Math.abs(angle) / 1.12));
      var sway = Math.sin(time * spinSpeed + i * 1.7) * radius * .009;
      var endX = Math.sin(angle) * length + sway, endY = Math.cos(angle) * length;
      context.strokeStyle = "hsla(" + ((hue - 12 + i * 3) % 360) + ", 48%, " + (48 + pulse * 8) + "%, .9)";
      context.lineWidth = baseWidth * (1.2 + (1 - Math.abs(angle) / 1.12) * .85);
      context.beginPath(); context.moveTo(0, 0);
      context.bezierCurveTo(endX * .2, endY * .24, endX * .7, endY * .7, endX, endY); context.stroke();
      [-1, 1].forEach(function (side) {
        var forkX = endX * .54 + side * radius * .09, forkY = endY * .55 + radius * .1;
        context.strokeStyle = "hsla(" + ((hue - 4 + i * 3) % 360) + ", 45%, " + (53 + pulse * 7) + "%, .74)";
        context.lineWidth = baseWidth * .72;
        context.beginPath(); context.moveTo(forkX, forkY);
        context.quadraticCurveTo(forkX + side * radius * .035, forkY + radius * .045,
          forkX + side * radius * .09, forkY + radius * .1); context.stroke();
        var twigX = forkX + side * radius * .09, twigY = forkY + radius * .1;
        context.strokeStyle = "hsla(" + ((hue + i * 4) % 360) + ", 42%, " + (57 + pulse * 6) + "%, .58)";
        context.lineWidth = baseWidth * .48;
        context.beginPath(); context.moveTo(twigX, twigY);
        context.quadraticCurveTo(twigX + side * radius * .03, twigY + radius * .04,
          twigX + side * radius * .07, twigY + radius * .08); context.stroke();
      });
    }
    context.restore();
  }  function treeBranchRatio(intensity) { return .68 - intensity * .005; }
  function treeBounds(intensity, time, spinSpeed, pulse) {
    var bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    var beat = Math.min(1, Math.max(0, pulse));
    var ratio = treeBranchRatio(intensity), spread = .84 + intensity * .022 + beat * .06;
    var leafReach = (.055 + intensity * .0035) * 1.22;
    function include(x, y, pad) {
      bounds.minX = Math.min(bounds.minX, x - pad); bounds.maxX = Math.max(bounds.maxX, x + pad);
      bounds.minY = Math.min(bounds.minY, y - pad); bounds.maxY = Math.max(bounds.maxY, y + pad);
    }
    function measure(x, y, length, depth, direction) {
      var endX = x + Math.sin(direction) * length, endY = y - Math.cos(direction) * length;
      include(x, y, Math.max(.018, length * .06));
      include(endX, endY, depth <= 0 ? leafReach : depth === 2 ? leafReach * .72 : Math.max(.018, length * .08));
      if (depth <= 0) return;
      var sway = Math.sin(time * spinSpeed + depth + direction * 2) * .025 + Math.sin(time * spinSpeed * 1.7 + direction + depth) * beat * .026;
      var leftDirection = Math.max(-1.45, direction - spread + sway - beat * .015);
      var rightDirection = Math.min(1.45, direction + spread + sway + beat * .015);
      measure(endX, endY, length * ratio, depth - 1, leftDirection);
      measure(endX, endY, length * ratio, depth - 1, rightDirection);
    }
    measure(0, 0, 1, intensity + 3, 0);
    var rootCount = 7 + intensity * 2;
    for (var i = 0; i < rootCount; i++) {
      var angle = -1.12 + i * 2.24 / (rootCount - 1);
      var length = .34 + .13 * (1 - Math.abs(angle) / 1.12);
      var endX = Math.sin(angle) * length, endY = Math.cos(angle) * length;
      include(endX, endY, .025);
      [-1, 1].forEach(function (side) {
        var forkX = endX * .54 + side * .09, forkY = endY * .55 + .1;
        var twigX = forkX + side * .09, twigY = forkY + .1;
        include(forkX, forkY, .025); include(twigX, twigY, .02);
        include(twigX + side * .07, twigY + .08, .025);
      });
    }
    return bounds;
  }
  function drawTree(cx, cy, stageWidth, stageHeight, intensity, hue, time, pulse, spinSpeed, scaleFactor, audioScale) {
    pulse = Math.min(1, Math.max(0, pulse));
    var bounds = treeBounds(intensity, time, spinSpeed, pulse);
    var spanX = Math.max(.1, bounds.maxX - bounds.minX), spanY = Math.max(.1, bounds.maxY - bounds.minY);
    var fillLevel = .87 + intensity * .035;
    var pixelScale = Math.min(stageWidth / spanX, stageHeight / spanY) * Math.min(.96, fillLevel * scaleFactor * audioScale);
    var centerX = (bounds.minX + bounds.maxX) * .5, centerY = (bounds.minY + bounds.maxY) * .5;
    var branchRatio = treeBranchRatio(intensity);
    context.save(); context.translate(cx - centerX * pixelScale, cy - centerY * pixelScale); context.scale(pixelScale, pixelScale);
    drawTreeRoots(1, intensity, hue, time, pulse, spinSpeed, pixelScale);
    drawTreeBranch(1, intensity + 3, intensity, hue, time, pulse, spinSpeed, 0, branchRatio, 1, pixelScale);
    context.restore();
  }
  function drawFrogMotif(radius, hue, pulse) {
    var outline = "hsla(" + ((hue + 188) % 360) + ", 56%, 44%, .98)";
    var highlight = "hsla(" + ((hue + 184) % 360) + ", 48%, 82%, .9)";
    var field = context.createRadialGradient(-radius * .22, -radius * .28, radius * .04, 0, 0, radius);
    field.addColorStop(0, "hsla(" + ((hue + 8) % 360) + ", 78%, 69%, .96)");
    field.addColorStop(1, "hsla(" + ((hue + 25) % 360) + ", 82%, 39%, .96)");
    context.save(); context.lineJoin = "miter"; context.lineCap = "square";
    context.fillStyle = field; context.strokeStyle = outline;
    context.lineWidth = Math.max(1.2, radius * .018) * (1 + pulse * .12);
    context.beginPath(); context.arc(0, 0, radius * .94, 0, Math.PI * 2); context.fill(); context.stroke();
    context.strokeStyle = highlight; context.lineWidth = Math.max(.8, radius * .009);
    context.beginPath(); context.arc(0, 0, radius * .86, 0, Math.PI * 2); context.stroke();

    /* Broad stepped limbs and spread toes echo carved glyph silhouettes. */
    context.strokeStyle = outline; context.lineWidth = radius * .105;
    [-1, 1].forEach(function (side) {
      context.beginPath(); context.moveTo(side * .22 * radius, -.13 * radius);
      context.lineTo(side * .67 * radius, -.13 * radius); context.lineTo(side * .67 * radius, -.34 * radius);
      context.lineTo(side * .81 * radius, -.34 * radius); context.stroke();
      context.beginPath(); context.moveTo(side * .2 * radius, .14 * radius);
      context.lineTo(side * .48 * radius, .35 * radius); context.lineTo(side * .48 * radius, .56 * radius);
      context.lineTo(side * .68 * radius, .56 * radius); context.stroke();
      [-1, 0, 1].forEach(function (toe) {
        context.beginPath(); context.moveTo(side * .81 * radius, -.34 * radius);
        context.lineTo(side * (.81 + toe * .075) * radius, (-.62 + Math.abs(toe) * .04) * radius); context.stroke();
        context.beginPath(); context.moveTo(side * .68 * radius, .56 * radius);
        context.lineTo(side * (.68 + toe * .075) * radius, (.76 - Math.abs(toe) * .035) * radius); context.stroke();
      });
    });

    /* A stepped crest frames the eyes like a ceremonial mask. */
    context.fillStyle = field; context.strokeStyle = outline; context.lineWidth = Math.max(1, radius * .018);
    context.beginPath(); context.moveTo(-.3 * radius, -.29 * radius); context.lineTo(-.3 * radius, -.48 * radius);
    context.lineTo(-.22 * radius, -.64 * radius); context.lineTo(-.13 * radius, -.7 * radius);
    context.lineTo(-.13 * radius, -.55 * radius); context.lineTo(0, -.66 * radius);
    context.lineTo(.13 * radius, -.55 * radius); context.lineTo(.13 * radius, -.7 * radius);
    context.lineTo(.22 * radius, -.64 * radius); context.lineTo(.3 * radius, -.48 * radius);
    context.lineTo(.3 * radius, -.29 * radius); context.closePath(); context.fill(); context.stroke();
    context.strokeStyle = highlight; context.lineWidth = Math.max(.8, radius * .009);
    context.beginPath(); context.moveTo(-.22 * radius, -.5 * radius); context.lineTo(-.1 * radius, -.61 * radius);
    context.lineTo(0, -.53 * radius); context.lineTo(.1 * radius, -.61 * radius); context.lineTo(.22 * radius, -.5 * radius); context.stroke();

    var body = context.createLinearGradient(0, -radius * .4, 0, radius * .4);
    body.addColorStop(0, "hsla(" + ((hue + 8) % 360) + ", 70%, 82%, 1)");
    body.addColorStop(.55, "hsla(" + ((hue + 15) % 360) + ", 77%, 58%, 1)");
    body.addColorStop(1, "hsla(" + ((hue + 24) % 360) + ", 80%, 42%, 1)");
    context.fillStyle = body; context.strokeStyle = outline; context.lineWidth = Math.max(1.2, radius * .02);
    context.beginPath();
    context.moveTo(0, -.42 * radius); context.lineTo(.13 * radius, -.29 * radius);
    context.lineTo(.27 * radius, -.29 * radius); context.lineTo(.27 * radius, -.17 * radius);
    context.lineTo(.39 * radius, -.06 * radius); context.lineTo(.29 * radius, .04 * radius);
    context.lineTo(.29 * radius, .17 * radius); context.lineTo(.17 * radius, .17 * radius);
    context.lineTo(0, .38 * radius); context.lineTo(-.17 * radius, .17 * radius);
    context.lineTo(-.29 * radius, .17 * radius); context.lineTo(-.29 * radius, .04 * radius);
    context.lineTo(-.39 * radius, -.06 * radius); context.lineTo(-.27 * radius, -.17 * radius);
    context.lineTo(-.27 * radius, -.29 * radius); context.lineTo(-.13 * radius, -.29 * radius);
    context.closePath(); context.fill(); context.stroke();

    function steppedDiamond(size, strokeStyle, lineWidth) {
      context.strokeStyle = strokeStyle; context.lineWidth = lineWidth; context.beginPath();
      context.moveTo(0, -size); context.lineTo(size * .22, -size * .72); context.lineTo(size * .48, -size * .72);
      context.lineTo(size * .48, -size * .48); context.lineTo(size * .72, -size * .48); context.lineTo(size * .72, -size * .22);
      context.lineTo(size, 0); context.lineTo(size * .72, size * .22); context.lineTo(size * .72, size * .48);
      context.lineTo(size * .48, size * .48); context.lineTo(size * .48, size * .72); context.lineTo(size * .22, size * .72);
      context.lineTo(0, size); context.lineTo(-size * .22, size * .72); context.lineTo(-size * .48, size * .72);
      context.lineTo(-size * .48, size * .48); context.lineTo(-size * .72, size * .48); context.lineTo(-size * .72, size * .22);
      context.lineTo(-size, 0); context.lineTo(-size * .72, -size * .22); context.lineTo(-size * .72, -size * .48);
      context.lineTo(-size * .48, -size * .48); context.lineTo(-size * .48, -size * .72); context.lineTo(-size * .22, -size * .72);
      context.closePath(); context.stroke();
    }
    steppedDiamond(radius * .205, outline, Math.max(1, radius * .016));
    steppedDiamond(radius * .105, highlight, Math.max(.8, radius * .012));
    context.fillStyle = highlight; context.beginPath(); context.arc(0, 0, radius * .035, 0, Math.PI * 2); context.fill();
    [-1, 1].forEach(function (side) {
      context.fillStyle = highlight; context.beginPath(); context.arc(side * radius * .15, -radius * .31, radius * .055, 0, Math.PI * 2); context.fill(); context.fillStyle = outline; context.beginPath(); context.arc(side * radius * .15, -radius * .31, radius * .027, 0, Math.PI * 2); context.fill();
    });
    context.restore();
  }
  function drawFrogFragments(radius, hue, pulse, time, spinSpeed, amount) {
    var spriteSize = frogSprite.width, targetSize = radius * 2.2;
    if (!frogSpriteContext) { drawFrogMotif(radius * 1.08, hue, pulse); return; }
    var mainContext = context; context = frogSpriteContext;
    try {
      context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, spriteSize, spriteSize);
      context.save(); context.translate(spriteSize * .5, spriteSize * .5);
      context.scale(1 + pulse * .04, 1 + pulse * .04);
      drawFrogMotif(spriteSize * 1.08 / 2.2, hue, pulse); context.restore();
    } finally { context = mainContext; }
    if (amount < .002) {
      context.drawImage(frogSprite, -targetSize * .5, -targetSize * .5, targetSize, targetSize); return;
    }

    var grid = 8, tile = spriteSize / grid, tileSize = targetSize / grid;
    var inset = Math.min(width, height) * .055;
    var reachX = Math.max(targetSize * .5, width * .5 - inset);
    var reachY = Math.max(targetSize * .5, height * .5 - inset);
    var ease = amount * amount * (3 - 2 * amount), beat = Math.min(1, Math.max(0, pulse));
    var ghost = 1 - amount;
    if (ghost > .005) {
      context.save(); context.globalAlpha = ghost;
      context.drawImage(frogSprite, -targetSize * .5, -targetSize * .5, targetSize, targetSize);
      context.restore();
    }

    for (var row = 0; row < grid; row++) for (var column = 0; column < grid; column++) {
      var nx = (column + .5) / grid - .5, ny = (row + .5) / grid - .5;
      var seed = Math.sin((column + 1) * 12.9898 + (row + 1) * 78.233);
      var sourceX = -targetSize * .5 + (column + .5) * tileSize;
      var sourceY = -targetSize * .5 + (row + .5) * tileSize;
      var targetX = nx * 2 * (reachX - tileSize * .5);
      var targetY = ny * 2 * (reachY - tileSize * .5);
      var drift = amount * tileSize * (.025 + beat * .055) * Math.sin(time * spinSpeed * .85 + seed * 4);
      var cellX = sourceX + (targetX - sourceX) * ease + nx * drift;
      var cellY = sourceY + (targetY - sourceY) * ease + ny * drift;
      var half = tileSize * .5, sx = column * tile, sy = row * tile;
      var triangles = (row + column) % 2 === 0 ?
        [[[-half, -half], [half, -half], [half, half]], [[-half, -half], [half, half], [-half, half]]] :
        [[[-half, -half], [half, -half], [-half, half]], [[half, -half], [half, half], [-half, half]]];
      for (var part = 0; part < 2; part++) {
        var vertices = triangles[part], centroidX = (vertices[0][0] + vertices[1][0] + vertices[2][0]) / 3;
        var centroidY = (vertices[0][1] + vertices[1][1] + vertices[2][1]) / 3;
        var direction = Math.atan2(centroidY, centroidX);
        var separation = amount * tileSize * (.045 + beat * .035);
        var shardX = cellX + Math.cos(direction) * separation;
        var shardY = cellY + Math.sin(direction) * separation;
        var rotation = amount * (seed * .24 + Math.sin(time * spinSpeed * .62 + seed * 5 + part) * .12 + beat * .14);
        var shrink = 1 - amount * .16;
        context.save(); context.translate(shardX, shardY); context.rotate(rotation);
        context.translate(-centroidX, -centroidY); context.globalAlpha = amount;
        context.beginPath();
        for (var point = 0; point < 3; point++) {
          var vx = centroidX + (vertices[point][0] - centroidX) * shrink;
          var vy = centroidY + (vertices[point][1] - centroidY) * shrink;
          if (point === 0) context.moveTo(vx, vy); else context.lineTo(vx, vy);
        }
        context.closePath(); context.clip();
        context.drawImage(frogSprite, sx, sy, tile, tile, -half - centroidX, -half - centroidY, tileSize, tileSize);
        context.restore();
      }
    }
  }  function drawFrog(cx, cy, radius, intensity, hue, time, pulse, spinSpeed, fragment) {
    context.save(); context.translate(cx, cy); context.rotate(reduced.matches ? 0 : time * spinSpeed * .4 * (1 - fragment * .45));
    context.save(); context.globalAlpha = 1 - fragment * .86;
    var ornaments = 4 + intensity * 2, orbit = radius * .62;
    context.strokeStyle = "hsla(" + hue + ", 58%, 62%, .34)"; context.lineWidth = Math.max(1, width / 760);
    [1.04, 1.16].forEach(function (factor, ring) {
      context.setLineDash(ring ? [Math.max(2, radius * .035), Math.max(3, radius * .06)] : []);
      context.beginPath(); context.ellipse(0, 0, radius * factor, radius * factor * .78, 0, 0, Math.PI * 2); context.stroke();
    }); context.setLineDash([]);
    for (var i = 0; i < ornaments; i++) {
      var angle = i * Math.PI * 2 / ornaments - time * spinSpeed * .6;
      var x = Math.cos(angle) * orbit, y = Math.sin(angle) * orbit;
      context.save(); context.translate(x, y); context.rotate(angle);
      context.fillStyle = "hsla(" + ((hue + i * 360 / ornaments) % 360) + ", 68%, 72%, .82)";
      context.beginPath(); context.moveTo(0, -radius * .035); context.lineTo(radius * .035, 0);
      context.lineTo(0, radius * .035); context.lineTo(-radius * .035, 0); context.closePath(); context.fill(); context.restore();
    }
    context.restore();
    drawFrogFragments(radius, hue + 8, pulse, time, spinSpeed, fragment);
    context.restore();
  }
  function easeScale(now) {
    var target = Number(scaleControl.value);
    if (reduced.matches) { displayedScale = target; lastScaleStep = now; return target; }
    if (!lastScaleStep) { lastScaleStep = now; return displayedScale; }
    var elapsed = Math.max(0, Math.min(80, now - lastScaleStep));
    displayedScale += (target - displayedScale) * (1 - Math.exp(-elapsed / 115));
    lastScaleStep = now;
    if (Math.abs(target - displayedScale) < .01) displayedScale = target;
    return displayedScale;
  }
  function easeFragment(now, target) {
    if (reduced.matches) { displayedFragment = target; lastFragmentStep = now; return target; }
    if (!lastFragmentStep) { lastFragmentStep = now; return displayedFragment; }
    var elapsed = Math.max(0, Math.min(80, now - lastFragmentStep));
    displayedFragment += (target - displayedFragment) * (1 - Math.exp(-elapsed / 245));
    lastFragmentStep = now;
    if (Math.abs(target - displayedFragment) < .002) displayedFragment = target;
    return displayedFragment;
  }  function draw(now) {
    if (!width || !height) return;
    var t = reduced.matches ? 0 : now * .001;
    var level = audio.level, bass = audio.bass, treble = audio.treble, pulse = level * .7 + audio.attack * .5;
    var shortSide = Math.min(width, height), pointerShift = shortSide * (shapeControl.value === "tree" ? .004 : .018);
    var centerX = width * .5 + pointer.x * pointerShift, centerY = height * .5 + pointer.y * pointerShift;
    var hue = (Number(colorControl.value) * 3.25 + 24 + treble * 42 + 360) % 360;
    var shape = shapeControl.value, intensity = Number(depthControl.value);
    var scaleValue = easeScale(now), scaleFactor = .62 + scaleValue * .0034;
    var fragmentTarget = shape === "frog" ? Math.min(1, (intensity - 1) / 5 + Math.min(.08, (pulse + bass * .3) * .075)) : 0;
    var fragment = easeFragment(now, fragmentTarget);
    var audioScale = 1 + Math.min(.14, Math.max(0, bass) * .1 + Math.max(0, audio.attack) * .07 + Math.max(0, level) * .03);
    var fit = shape === "flower" ? .68 : .43;
    var fitLimit = shape === "flower" ? .78 : .45;
    var depth = intensity - 1;
    var ringCount = 2 + Math.ceil(intensity / 2);
    var spinSpeed = .05 + (intensity - 1) * .046 + treble * .14;
    var radius = shape === "tree" ? shortSide * .28 : shape === "frog" ? shortSide * .47 * scaleFactor * audioScale :
      Math.min(shortSide * fitLimit, shortSide * fit * Number(scaleControl.value) / 78 * (1 + bass * .015));
    context.fillStyle = "#100d0c"; context.fillRect(0, 0, width, height);
    var glow = context.createRadialGradient(centerX, centerY, radius * .03, centerX, centerY, radius * 1.25);
    glow.addColorStop(0, "hsla(" + hue + ", 65%, 48%, " + (.09 + pulse * .12) + ")");
    glow.addColorStop(1, "hsla(" + hue + ", 65%, 35%, 0)");
    context.fillStyle = glow; context.fillRect(0, 0, width, height);
    var inset = shortSide * (shape === "tree" ? .012 : .035);
    context.save(); context.beginPath(); context.rect(inset, inset, width - inset * 2, height - inset * 2); context.clip();
    context.translate(centerX, centerY);
    var spin = reduced.matches ? 0 : t * spinSpeed;
    if (shapeControl.value === "triangle") {
      for (var ring = 0; ring < ringCount; ring++) {
        var ringRadius = radius * (1 - ring * .13) * (1 + Math.sin(t * .8 + ring) * .018 + pulse * .035);
        triangle(0, 0, ringRadius, spin + ring * Math.PI / ringCount, depth, hue + ring * 22, .76 - ring * .07, t, pulse, spinSpeed);
      }
    } else if (shape === "flower") drawFlower(0, 0, radius, intensity, hue, t, pulse, spinSpeed);
    else if (shape === "tree") drawTree(0, 0, width, height, intensity, hue, t, pulse + bass * .32, spinSpeed, scaleFactor, audioScale);
    else drawFrog(0, 0, radius * .74, intensity, hue, t, pulse, spinSpeed, fragment);
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
    shapeButtons.forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.fractalShape === shapeControl.value)); });
    var intensity = Number(depthControl.value), shape = shapeControl.value, label, amount, unit;
    if (shape === "triangle") {
      label = "Triângulos + giro"; unit = " △";
      amount = ((Math.pow(3, intensity) - 1) / 2) * (2 + Math.ceil(intensity / 2));
      visualLabel.textContent = "GEOMETRIA / TRIÂNGULOS";
    } else if (shape === "flower") {
      label = "Pétalas + giro"; unit = " pétalas"; amount = (6 + intensity * 2) * (1 + Math.floor(intensity / 3));
      visualLabel.textContent = "BOTÂNICA / FLOR";
    } else if (shape === "tree") {
      label = "Ramos + giro"; unit = " ramos"; amount = Math.pow(2, intensity + 4) - 1 + (5 + intensity * 2) * 3;
      visualLabel.textContent = "BOTÂNICA / ÁRVORE";
    } else {
      label = "Fragmentação + giro"; unit = "%"; amount = Math.round((intensity - 1) * 20);
      visualLabel.textContent = "ORNAMENTO / SAPO";
    }
    depthLabel.textContent = label;
    depthOutput.value = intensity + " · " + amount.toLocaleString("pt-BR") + unit;
    depthOutput.title = intensity + " níveis · " + amount + unit.trim();
    var palette = palettes[Math.min(palettes.length - 1, Math.floor(Number(colorControl.value) / 20))];
    colorOutput.value = palette;
    draw(performance.now()); wake();
  }
  [scaleControl, colorControl, depthControl].forEach(function (control) { control.addEventListener("input", updateControls); });
  shapeControl.addEventListener("change", updateControls);
  shapeButtons.forEach(function (button) {
    button.addEventListener("click", function () { shapeControl.value = button.dataset.fractalShape; updateControls(); });
  });
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
