/* Ambiente generativo monocromático com manchas de aquarela cromática ao toque. */
(function () {
  "use strict";
  var VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
  var FRAG = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "uniform vec2 u_res; uniform float u_time;",
    "uniform float u_warp; uniform float u_pulse; uniform float u_mode; uniform float u_palette; uniform float u_pigment;",
    "uniform vec4 u_stains[6];",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }",
    "float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y); }",
    "vec3 pigment(float h){ return 0.5 + 0.5*cos(6.28318*(h+vec3(0.0,0.33,0.67))); }",
    "void main(){",
    "  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;",
    "  float t=u_time; float mode=clamp(u_mode,0.0,4.0);",
    "  uv += u_warp*0.022*vec2(sin(uv.y*8.0+t*0.12),cos(uv.x*7.0-t*0.1));",
    "  float horizon=exp(-abs(uv.y-0.08)*18.0);",
    "  float radius=length(vec2(uv.x*0.78,uv.y-0.06));",
    "  float motif=0.0;",
    "  if(mode<0.5){",
    "    float band=1.0-smoothstep(0.46,0.5,abs(fract((uv.y+0.5)*30.0+sin(uv.x*3.0+t*0.04)*0.08)-0.5));",
    "    float tear=1.0-smoothstep(0.0,0.018,abs(uv.x-0.38*sin(uv.y*5.0+t*0.025)));",
    "    motif=band*0.09+tear*0.045;",
    "  }else if(mode<1.5){",
    "    float rings=1.0-smoothstep(0.46,0.5,abs(fract(radius*10.0-t*0.025)-0.5));",
    "    float sweep=1.0-smoothstep(0.0,0.025,abs(sin(atan(uv.y-0.06,uv.x*0.78)*2.0+t*0.035)));",
    "    motif=rings*0.13+sweep*0.055;",
    "  }else if(mode<2.5){",
    "    float angle=atan(uv.y-0.06,uv.x*0.78);",
    "    float spiral=1.0-smoothstep(0.44,0.5,abs(fract(angle*1.45+radius*12.0-t*0.018)-0.5));",
    "    motif=spiral*0.16+horizon*0.035;",
    "  }else if(mode<3.5){",
    "    float flow=noise(uv*4.2+vec2(t*0.025,-t*0.018));",
    "    float contour=1.0-smoothstep(0.0,0.11,abs(fract(flow*4.0+sin(uv.x*3.0+uv.y*4.0+t*0.025))-0.5));",
    "    motif=contour*0.14+flow*0.025;",
    "  }else{",
    "    float floorMask=1.0-smoothstep(-0.30,-0.06,uv.y);",
    "    float depth=1.0/max(0.11,0.22-uv.y);",
    "    vec2 gridUV=vec2(uv.x*depth*15.0,depth*13.0+t*0.035);",
    "    float gx=abs(fract(gridUV.x)-0.5); float gy=abs(fract(gridUV.y)-0.5);",
    "    float gridX=1.0-smoothstep(0.465,0.49,gx); float gridY=1.0-smoothstep(0.465,0.49,gy);",
    "    float columns=1.0-smoothstep(0.475,0.495,abs(fract((uv.x+0.8)*18.0)-0.5));",
    "    motif=clamp(gridX+gridY,0.0,1.0)*floorMask*0.15+columns*0.035;",
    "  }",
    "  float dither=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233))+t*0.17)*43758.5453);",
    "  float pulse=exp(-abs(radius-(0.14+u_pulse*0.23))*24.0)*u_pulse;",
    "  float grey=(0.018+horizon*0.105+motif+pulse*0.18+(dither-0.5)*0.012)*(1.0-0.24*dot(uv,uv));",
    "  vec3 col=vec3(clamp(grey,0.0,0.82));",
    "  for(int i=0;i<6;i++){",
    "    vec4 s=u_stains[i];",
    "    if(s.z>=0.0 && s.z<4.0){",
    "      vec2 center=vec2((s.x-0.5)*(u_res.x/u_res.y),s.y-0.5);",
    "      vec2 d=uv-center; float d2=dot(d,d);",
    "      if(d2<0.14){",
    "        float angle=atan(d.y,d.x);",
    "        float wobble=0.055*sin(angle*5.0+s.w*6.28)+0.032*sin(angle*9.0-s.z*2.0)+0.018*sin(angle*15.0+s.x*31.0);",
    "        float dist=sqrt(d2)*(1.0+wobble);",
    "        float spread=0.025+0.30*(1.0-exp(-s.z*1.35));",
    "        if(dist<spread+0.045){",
    "          float body=1.0-smoothstep(spread*0.70,spread+0.032,dist);",
    "          float rim=exp(-pow((dist-spread*0.86)/(spread*0.16+0.008),2.0));",
    "          float grain=0.82+0.18*hash(d*38.0+vec2(s.x*17.0,s.y*17.0));",
    "          float fade=1.0-smoothstep(2.65,4.0,s.z);",
    "          float alpha=clamp((body*0.48+rim*0.42)*fade*u_pigment*grain,0.0,0.88);",
    "          vec3 ink=pigment(s.w+u_palette+mode*0.035);",
    "          col=mix(col,ink,alpha); col+=ink*rim*fade*0.045;",
    "        }",
    "      }",
    "    }",
    "  }",
    "  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);",
    "}"
  ].join("\n");

  function compile(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }

  function hueColor(h, alpha) {
    return "hsla(" + Math.round((h % 1) * 360) + ",88%,62%," + alpha + ")";
  }

  window.createShader = function (initialCanvas) {
    var canvas = initialCanvas;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var lowCapacity = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4) || window.innerWidth <= 820 || (connection && connection.saveData);
    var maxDpr = lowCapacity ? 1 : 1.25;
    var frameDelay = lowCapacity ? 34 : 0;
    var gl = null, ctx2d = null, program = null, loc = {};
    var framePending = false, frameTimer = 0, stainTimer = 0, time = 0, last = performance.now();
    var pulseValue = 0, modeValue = 0, paletteValue = 0, stainCursor = 0;
    var stains = [null, null, null, null, null, null];
    var stainValues = new Float32Array(24);
    var api = {
      params: { speed: reducedMotion.matches ? 0 : 1, warp: 0.6, pigment: 1 },
      target: { mode: 0, hue: 0 },
      pulse: function () { pulseValue = 1; scheduleFrame(); },
      setTarget: function (mode, hue) { api.target.mode = mode || 0; api.target.hue = hue || 0; scheduleFrame(); },
      invalidate: function () { scheduleFrame(); },
      addStain: function (x, y) {
        stains[stainCursor] = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), born: performance.now(), hue: Math.random() * 0.19 };
        stainCursor = (stainCursor + 1) % stains.length;
        scheduleFrame();
      },
      clearStains: function () {
        stains = [null, null, null, null, null, null];
        if (stainTimer) window.clearTimeout(stainTimer);
        stainTimer = 0; scheduleFrame();
      }
    };

    function replaceWith2DCanvas() {
      var replacement = document.createElement("canvas");
      replacement.id = canvas.id;
      replacement.className = canvas.className;
      replacement.setAttribute("aria-hidden", "true");
      canvas.parentNode.replaceChild(replacement, canvas);
      canvas = replacement;
      gl = null;
      ctx2d = canvas.getContext("2d");
      return !!ctx2d;
    }

    try {
      gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "low-power" }) ||
        canvas.getContext("experimental-webgl");
      if (gl) {
        program = gl.createProgram();
        gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
        gl.useProgram(program);
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
        var position = gl.getAttribLocation(program, "p");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        ["u_res", "u_time", "u_warp", "u_pulse", "u_mode", "u_palette", "u_pigment"]
          .forEach(function (name) { loc[name] = gl.getUniformLocation(program, name); });
        loc.u_stains = gl.getUniformLocation(program, "u_stains[0]");
      }
    } catch (error) {
      console.warn("Shader indisponível; ativando o fallback 2D:", error);
      replaceWith2DCanvas();
    }
    if (!gl && !ctx2d) ctx2d = canvas.getContext("2d");
    if (!gl && !ctx2d) {
      canvas.style.display = "none";
      var status = document.getElementById("app-status");
      if (status) status.textContent = "O ambiente visual não está disponível neste navegador. Todo o conteúdo permanece acessível.";
      return api;
    }

    function scheduleFrame() {
      if (framePending || document.hidden || (!gl && !ctx2d)) return;
      framePending = true;
      var draw = function () { frameTimer = 0; requestAnimationFrame(frame); };
      if (frameDelay) frameTimer = window.setTimeout(draw, frameDelay);
      else draw();
    }
    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, maxDpr);
      var width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      var height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; canvas.height = height;
        if (gl) gl.viewport(0, 0, width, height);
      }
    }
    window.addEventListener("resize", function () { resize(); scheduleFrame(); }, { passive: true });
    document.addEventListener("visibilitychange", function () { if (!document.hidden) { last = performance.now(); scheduleFrame(); } });
    if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", function (event) { if (event.matches) api.params.speed = 0; scheduleFrame(); });
    else if (reducedMotion.addListener) reducedMotion.addListener(function (event) { if (event.matches) api.params.speed = 0; scheduleFrame(); });

    if (gl) canvas.addEventListener("webglcontextlost", function (event) {
      event.preventDefault();
      if (frameTimer) window.clearTimeout(frameTimer);
      frameTimer = 0;
      if (!replaceWith2DCanvas()) {
        canvas.style.display = "none";
        var status = document.getElementById("app-status");
        if (status) status.textContent = "O efeito visual foi interrompido. O conteúdo continua disponível.";
      } else {
        var fallbackStatus = document.getElementById("app-status");
        if (fallbackStatus) fallbackStatus.textContent = "O shader foi simplificado para manter a interação visual disponível.";
        resize();
        scheduleFrame();
      }
    });

    function drawFallback(now) {
      var width = canvas.width, height = canvas.height;
      var shortSide = Math.min(width, height), centerX = width * 0.5, centerY = height * 0.5;
      var mode = Math.round(modeValue), tick = now * 0.00012 * api.params.speed;
      ctx2d.fillStyle = "#0b0b0c"; ctx2d.fillRect(0, 0, width, height);
      ctx2d.save();
      ctx2d.strokeStyle = "rgba(235,235,235,0.14)";
      ctx2d.lineWidth = Math.max(1, width / Math.max(1, canvas.clientWidth));
      ctx2d.lineJoin = "round"; ctx2d.lineCap = "round";
      if (mode === 0) {
        for (var scan = 1; scan < 42; scan++) {
          var scanY = height * scan / 42;
          var jitter = Math.sin(scan * 13.17 + tick) * api.params.warp * shortSide * 0.001;
          ctx2d.beginPath(); ctx2d.moveTo(0, scanY); ctx2d.lineTo(width * 0.48 + jitter, scanY); ctx2d.lineTo(width, scanY + jitter); ctx2d.stroke();
        }
      } else if (mode === 1) {
        for (var ring = 1; ring <= 9; ring++) {
          ctx2d.beginPath(); ctx2d.arc(centerX, centerY, shortSide * ring / 20, 0, Math.PI * 2); ctx2d.stroke();
        }
        var sweep = tick % (Math.PI * 2);
        ctx2d.beginPath(); ctx2d.moveTo(centerX, centerY);
        ctx2d.lineTo(centerX + Math.cos(sweep) * shortSide * 0.46, centerY + Math.sin(sweep) * shortSide * 0.46); ctx2d.stroke();
        ctx2d.beginPath(); ctx2d.moveTo(centerX - shortSide * 0.46, centerY); ctx2d.lineTo(centerX + shortSide * 0.46, centerY);
        ctx2d.moveTo(centerX, centerY - shortSide * 0.46); ctx2d.lineTo(centerX, centerY + shortSide * 0.46); ctx2d.stroke();
      } else if (mode === 2) {
        ctx2d.beginPath();
        for (var spiralStep = 0; spiralStep <= 520; spiralStep++) {
          var theta = spiralStep * 0.045 + tick;
          var spiralRadius = shortSide * 0.0008 * spiralStep;
          var spiralX = centerX + Math.cos(theta) * spiralRadius;
          var spiralY = centerY + Math.sin(theta) * spiralRadius * 0.72;
          if (!spiralStep) ctx2d.moveTo(spiralX, spiralY); else ctx2d.lineTo(spiralX, spiralY);
        }
        ctx2d.stroke();
      } else if (mode === 3) {
        for (var wave = 0; wave < 9; wave++) {
          ctx2d.beginPath();
          for (var point = 0; point <= 48; point++) {
            var x = width * point / 48;
            var y = centerY + Math.sin(point * 0.17 + wave * 0.55 + tick) * shortSide * 0.045 +
              Math.sin(point * 0.075 - tick * 1.7 + wave) * shortSide * 0.08 + (wave - 4) * shortSide * 0.055;
            if (!point) ctx2d.moveTo(x, y); else ctx2d.lineTo(x, y);
          }
          ctx2d.stroke();
        }
      } else {
        var horizon = height * 0.54;
        ctx2d.beginPath(); ctx2d.moveTo(0, horizon); ctx2d.lineTo(width, horizon); ctx2d.stroke();
        for (var column = -10; column <= 10; column++) {
          ctx2d.beginPath(); ctx2d.moveTo(centerX + column * width / 22, horizon); ctx2d.lineTo(centerX + column * width / 2.2, height); ctx2d.stroke();
        }
        for (var row = 1; row < 10; row++) {
          var rowY = horizon + Math.pow(row / 9, 1.8) * (height - horizon);
          ctx2d.beginPath(); ctx2d.moveTo(0, rowY); ctx2d.lineTo(width, rowY); ctx2d.stroke();
        }
      }
      ctx2d.restore();
      if (pulseValue > 0.008) {
        ctx2d.save(); ctx2d.strokeStyle = "rgba(235,235,235," + (0.5*pulseValue) + ")";
        ctx2d.lineWidth = Math.max(1, width / Math.max(1, canvas.clientWidth));
        ctx2d.beginPath(); ctx2d.arc(centerX, centerY, shortSide * (0.14 + pulseValue * 0.23), 0, Math.PI * 2); ctx2d.stroke(); ctx2d.restore();
      }
      for (var j = 0; j < stains.length; j++) {
        var stain = stains[j]; if (!stain) continue;
        var age = (now-stain.born)/1000; if (age >= 4) { stains[j] = null; continue; }
        var fade = 1-age/4, radius = Math.min(width,height)*(0.025+0.30*(1-Math.exp(-age*1.35)));
        var cx = stain.x*width, cy = stain.y*height;
        var gradient = ctx2d.createRadialGradient(cx,cy,0,cx,cy,radius);
        gradient.addColorStop(0,hueColor(api.target.hue+stain.hue,0.42*fade*api.params.pigment));
        gradient.addColorStop(0.72,hueColor(api.target.hue+stain.hue+0.08,0.25*fade*api.params.pigment));
        gradient.addColorStop(1,hueColor(api.target.hue+stain.hue+0.16,0));
        ctx2d.fillStyle=gradient; ctx2d.fillRect(cx-radius,cy-radius,radius*2,radius*2);
      }
    }
    function frame(now) {
      framePending = false;
      if (document.hidden) return;
      var dt = Math.min(Math.max(0,(now-last)/1000),0.1); last = now;
      resize();
      var moving = !reducedMotion.matches;
      if (moving) time += dt * api.params.speed;
      var smoothing = moving ? Math.min(1,dt*3) : 1;
      modeValue += (api.target.mode-modeValue)*smoothing;
      paletteValue += (api.target.hue-paletteValue)*smoothing;
      if (moving) pulseValue *= Math.pow(0.035,dt);
      var active = false;
      for (var i=0;i<stains.length;i++) {
        var stain=stains[i];
        if (stain && now-stain.born<4000) {
          var age=(now-stain.born)/1000;
          stainValues[i*4]=stain.x; stainValues[i*4+1]=1-stain.y; stainValues[i*4+2]=age; stainValues[i*4+3]=stain.hue;
          active=true;
        } else {
          stains[i]=null; stainValues[i*4]=0; stainValues[i*4+1]=0; stainValues[i*4+2]=-1; stainValues[i*4+3]=0;
        }
      }
      if (gl) {
        gl.uniform2f(loc.u_res,canvas.width,canvas.height);
        gl.uniform1f(loc.u_time,time);
        gl.uniform1f(loc.u_warp,api.params.warp);
        gl.uniform1f(loc.u_pulse,pulseValue);
        gl.uniform1f(loc.u_mode,modeValue);
        gl.uniform1f(loc.u_palette,paletteValue);
        gl.uniform1f(loc.u_pigment,api.params.pigment);
        gl.uniform4fv(loc.u_stains,stainValues);
        gl.drawArrays(gl.TRIANGLES,0,3);
      } else if (ctx2d) drawFallback(now);
      if (!moving) pulseValue = 0;
      if (!moving && active) {
        var untilExpiry = 4000;
        for (var k = 0; k < stains.length; k++) if (stains[k]) untilExpiry = Math.min(untilExpiry, 4000 - (now - stains[k].born));
        if (stainTimer) window.clearTimeout(stainTimer);
        stainTimer = window.setTimeout(function () { stainTimer = 0; scheduleFrame(); }, Math.max(16, untilExpiry));
      } else if (stainTimer) {
        window.clearTimeout(stainTimer); stainTimer = 0;
      }
      if (moving && (api.params.speed>0 || active || pulseValue>0.008)) scheduleFrame();
    }

    resize(); scheduleFrame();
    return api;
  };
})();
