/*
  Fundo shader interativo (GLSL ES 1.0) com fallback Canvas2D.
  Um único fragment shader mistura cinco padrões; os pesos mudam
  suavemente quando o visitante troca de item na linha do tempo.
*/
(function () {
  var VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

  var FRAG = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;",
    "uniform float u_audio; uniform float u_warp; uniform float u_hue; uniform float u_pulse;",
    "uniform vec4 u_wa; uniform float u_wb;",
    "vec3 pal(float t){ return vec3(0.5 + 0.5 * cos(6.28318 * t)); }",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }",
    "float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { v += a * vnoise(p); p = p * 2.03 + 17.0; a *= 0.5; } return v; }",
    "mat2 rot(float a){ float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }",
    "float poly(vec2 p, float n, float r){",
    "  float a = atan(p.y, p.x) + 3.14159; float s = 6.28318 / n;",
    "  return cos(floor(0.5 + a / s) * s - a) * length(p) - r;",
    "}",
    "void main(){",
    "  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;",
    "  vec2 m = (u_mouse - 0.5) * vec2(u_res.x / u_res.y, 1.0);",
    "  float t = u_time;",
    "  float amp = 1.0 + u_audio * 2.0 + u_pulse * 2.0;",
    "  uv += u_warp * 0.06 * amp * vec2(sin(uv.y * 7.0 + t), cos(uv.x * 7.0 + t * 1.1));",
    "  vec3 col = vec3(0.0);",
    // 0: pixels de fita LED com onda de luz
    "  if (u_wa.x > 0.01) {",
    "    vec2 p = uv * vec2(16.0, 6.0); vec2 id = floor(p); vec2 g = fract(p) - 0.5;",
    "    float d = smoothstep(0.42, 0.08, length(g));",
    "    float chase = 0.5 + 0.5 * sin(id.x * 0.45 - t * 3.0 + id.y * 1.3);",
    "    col += pal(id.x * 0.035 + t * 0.05 + u_hue) * d * (0.12 + chase * 0.9 + u_audio + u_pulse) * u_wa.x;",
    "  }",
    // 1: anéis de Wi-Fi a partir do ponteiro
    "  if (u_wa.y > 0.01) {",
    "    float d = length(uv - m);",
    "    float r = 0.5 + 0.5 * sin(d * 30.0 - t * 4.0 - u_pulse * 6.0);",
    "    col += pal(d * 0.5 + u_hue + 0.2) * pow(r, 8.0) * exp(-d * 1.4) * amp * 1.4 * u_wa.y;",
    "  }",
    // 2: barras de equalizador
    "  if (u_wa.z > 0.01) {",
    "    float bx = uv.x * 8.0; float id = floor(bx); float cell = abs(fract(bx) - 0.5);",
    "    float h = 0.18 + 0.14 * sin(id * 1.7 + t * 3.0) + 0.12 * sin(id * 0.7 - t * 2.2) + u_audio * 0.45 + u_pulse * 0.3;",
    "    h = max(h, 0.04); float y = abs(uv.y);",
    "    float bar = step(cell, 0.36) * step(y, h);",
    "    col += pal(id * 0.06 + u_hue + 0.4) * bar * (0.5 + 0.8 * (1.0 - y / h)) * u_wa.z;",
    "  }",
    // 3: plasma
    "  if (u_wa.w > 0.01) {",
    "    vec2 q = vec2(fbm(uv * 2.0 + t * 0.12), fbm(uv * 2.0 + vec2(5.2, 1.3) - t * 0.1));",
    "    vec2 r = vec2(fbm(uv * 2.0 + 3.0 * q + vec2(1.7, 9.2) + t * 0.15), fbm(uv * 2.0 + 3.0 * q + vec2(8.3, 2.8) - t * 0.13));",
    "    float v = fbm(uv * 2.2 + 3.5 * r);",
    "    float lit = 0.35 / (1.0 + 9.0 * length(uv - m));",
    "    col += vec3(v * v * 1.7 + lit + u_audio * 0.35 + u_pulse * 0.25) * u_wa.w;",
    "  }",
    // 4: pentágonos wireframe girando
    "  if (u_wb > 0.01) {",
    "    for (int i = 0; i < 6; i++) {",
    "      float fi = float(i);",
    "      vec2 p = rot(t * 0.25 * (1.0 + fi * 0.15) + fi * 0.5) * (uv - m * 0.12 * fi);",
    "      float d = abs(poly(p, 5.0, 0.12 + 0.08 * fi + u_audio * 0.08 + u_pulse * 0.05));",
    "      float e = smoothstep(0.012, 0.0, d) + 0.0025 / (d + 0.006);",
    "      col += pal(u_hue + fi * 0.1 + 0.8) * e * 0.55 * u_wb;",
    "    }",
    "  }",
    "  vec3 base = vec3(0.035 + 0.04 * (uv.y + 0.5));",
    "  col = base + col * 0.8;",
    "  col += col * col * 0.7;",
    "  col /= 1.0 + col * 0.35;",
    "  col *= 1.0 - 0.6 * dot(uv, uv);",
    "  col += (hash(gl_FragCoord.xy + fract(t) * 91.0) - 0.5) * 0.03;",
    "  gl_FragColor = vec4(col, 1.0);",
    "}"
  ].join("\n");

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(s));
    }
    return s;
  }

  function hsl(h, s, l) { return "hsl(" + Math.round(h * 360) + "," + s + "%," + l + "%)"; }

  window.createShader = function (canvas) {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var api = {
      params: { speed: reduced ? 0.25 : 1, warp: 0.6, hueShift: 0, audio: 0 },
      target: { mode: 0, hue: 0 },
      mouse: { x: 0.5, y: 0.5 },
      pulse: function () { pulseValue = 1; },
      setTarget: function (mode, hue) { api.target.mode = mode; api.target.hue = hue; }
    };

    var pulseValue = 0;
    var weights = [1, 0, 0, 0, 0];
    var smooth = { x: 0.5, y: 0.5, hue: 0, audio: 0 };
    var time = 0, last = performance.now();

    var gl = canvas.getContext("webgl", { antialias: false, alpha: false }) ||
             canvas.getContext("experimental-webgl");
    var prog, loc = {}, ctx2d = null;

    if (gl) {
      try {
        prog = gl.createProgram();
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        gl.useProgram(prog);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        var pl = gl.getAttribLocation(prog, "p");
        gl.enableVertexAttribArray(pl);
        gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);
        ["u_res", "u_time", "u_mouse", "u_audio", "u_warp", "u_hue", "u_pulse", "u_wa", "u_wb"]
          .forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
      } catch (err) {
        console.warn("WebGL indisponível, usando Canvas2D:", err);
        gl = null;
      }
    }
    if (!gl) { ctx2d = canvas.getContext("2d"); }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.floor(canvas.clientWidth * dpr), h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        if (gl) gl.viewport(0, 0, w, h);
      }
    }
    window.addEventListener("resize", resize);

    function frame(now) {
      var dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      resize();

      time += dt * api.params.speed;
      var k = Math.min(1, dt * 3);
      for (var i = 0; i < 5; i++) {
        weights[i] += ((i === api.target.mode ? 1 : 0) - weights[i]) * k;
      }
      var mk = Math.min(1, dt * 6);
      smooth.x += (api.mouse.x - smooth.x) * mk;
      smooth.y += (api.mouse.y - smooth.y) * mk;
      smooth.hue += (api.target.hue - smooth.hue) * k;
      smooth.audio += (api.params.audio - smooth.audio) * Math.min(1, dt * 12);
      pulseValue *= Math.pow(0.04, dt);

      var hue = smooth.hue + api.params.hueShift;

      if (gl) {
        gl.uniform2f(loc.u_res, canvas.width, canvas.height);
        gl.uniform1f(loc.u_time, time);
        gl.uniform2f(loc.u_mouse, smooth.x, smooth.y);
        gl.uniform1f(loc.u_audio, smooth.audio);
        gl.uniform1f(loc.u_warp, api.params.warp);
        gl.uniform1f(loc.u_hue, hue);
        gl.uniform1f(loc.u_pulse, pulseValue);
        gl.uniform4f(loc.u_wa, weights[0], weights[1], weights[2], weights[3]);
        gl.uniform1f(loc.u_wb, weights[4]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else {
        var w = canvas.width, h = canvas.height;
        ctx2d.fillStyle = "#0b0b0c";
        ctx2d.fillRect(0, 0, w, h);
        var r = Math.min(w, h) * (0.35 + smooth.audio * 0.4 + pulseValue * 0.3);
        var cx = smooth.x * w + Math.sin(time) * 40, cy = (1 - smooth.y) * h + Math.cos(time * 1.2) * 40;
        var g = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, hsl(0, 0, 70));
        g.addColorStop(1, "rgba(11,11,12,0)");
        ctx2d.fillStyle = g;
        ctx2d.fillRect(0, 0, w, h);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return api;
  };
})();
