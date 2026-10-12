/* Ambiente generativo: fumaça em destaque, linguagem orgânica psicodélica e manchas cromáticas ao toque. */
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
    "uniform vec4 u_stains[6]; uniform vec3 u_pointer;",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }",
    "float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y); }",
    "float hashFast(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }",
    "float noiseFast(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hashFast(i),hashFast(i+vec2(1.0,0.0)),f.x),mix(hashFast(i+vec2(0.0,1.0)),hashFast(i+vec2(1.0,1.0)),f.x),f.y); }",
    "float fbm(vec2 p){ float value=0.0; float amplitude=0.5; for(int octave=0;octave<3;octave++){ value+=noiseFast(p)*amplitude; p=p*2.03+vec2(17.1,-11.7); amplitude*=0.5; } return value; }",
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
    "    vec2 touchCenter=vec2((u_pointer.x-0.5)*(u_res.x/u_res.y),u_pointer.y-0.5);",
    "    float touchInfluence=u_pointer.x>=0.0 ? exp(-dot(uv-touchCenter,uv-touchCenter)*5.0)*exp(-u_pointer.z*0.9) : 0.0;",
    "    vec2 smokeUV=uv+vec2(sin(uv.y*3.8+t*0.10),cos(uv.x*3.2-t*0.07))*0.09;",
    "    smokeUV+=(uv-touchCenter)*touchInfluence*0.22;",
    "    float vapor=fbm(smokeUV*3.2+vec2(t*0.025,-t*0.11));",
    "    float vaporDetail=fbm(smokeUV*6.4+vec2(-t*0.018,-t*0.16));",
    "    float density=0.34+u_warp*0.055;",
    "    float cloud=smoothstep(density,density+0.25,vapor+vaporDetail*0.22);",
    "    float wisps=smoothstep(density+0.12,density+0.30,vapor+vaporDetail*0.38);",
    "    motif=cloud*0.17+wisps*0.055;",
    "  }else if(mode<2.5){",
    "    float organicField=fbm(uv*3.4+vec2(t*0.018,-t*0.014));",
    "    vec2 organicUV=uv+0.12*vec2(sin(uv.y*5.0+organicField*5.0+t*0.025),cos(uv.x*4.0-organicField*4.0-t*0.02));",
    "    float organicRadius=length(vec2(organicUV.x*0.78,organicUV.y-0.06));",
    "    float petalAngle=atan(organicUV.y-0.06,organicUV.x*0.78);",
    "    float petals=abs(sin(petalAngle*5.0+sin(organicRadius*9.0+organicField*5.0)*1.8));",
    "    float organicBands=abs(sin(organicRadius*19.0-organicField*8.0+t*0.018));",
    "    motif=(1.0-smoothstep(0.12,0.88,petals))*0.10+(1.0-smoothstep(0.18,0.92,organicBands))*0.065+organicField*0.025;",
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
    "      if(d2<0.21){",
    "        float angle=atan(d.y,d.x);",
    "        float wobble=0.055*sin(angle*5.0+s.w*6.28)+0.032*sin(angle*9.0-s.z*2.0)+0.018*sin(angle*15.0+s.x*31.0);",
    "        float dist=sqrt(d2)*(1.0+wobble);",
    "        float spread=0.025+0.38*(1.0-exp(-s.z*1.35));",
    "        if(dist<spread+0.045){",
    "          float body=1.0-smoothstep(spread*0.70,spread+0.032,dist);",
    "          float rim=exp(-pow((dist-spread*0.86)/(spread*0.16+0.008),2.0));",
    "          float grain=0.82+0.18*hash(d*38.0+vec2(s.x*17.0,s.y*17.0));",
    "          float fade=1.0-smoothstep(2.65,4.0,s.z);",
    "          float halo=1.0-smoothstep(spread,spread+0.075,dist);",
    "          float released=s.w>=1.0 ? 1.0-smoothstep(0.0,1.6,s.w-1.0) : 1.0;",
    "          float alpha=clamp((body*0.58+rim*0.50+halo*0.16)*fade*released*u_pigment*grain,0.0,0.94);",
    "          vec3 ink=pigment(mod(s.w,1.0)+u_palette+mode*0.035);",
    "          col=mix(col,ink,alpha); col+=ink*rim*fade*released*0.09;",
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
    var nowTime = window.performance && window.performance.now ? function () { return window.performance.now(); } : function () { return Date.now(); };
    var reducedMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
    var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
      return window.setTimeout(function () { callback(nowTime()); }, 33);
    };
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var hasHardwareSignal = !!(navigator.hardwareConcurrency || navigator.deviceMemory);
    var lowCapacity = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4) || window.innerWidth <= 820 || (connection && connection.saveData) || !hasHardwareSignal;
    var maxDpr = lowCapacity ? 1 : 1.25;
    var frameDelay = lowCapacity ? 34 : 0;
    var gl = null, ctx2d = null, program = null, loc = {};
    var framePending = false, frameTimer = 0, stainTimer = 0, time = 0, last = nowTime();
    var pulseValue = 0, modeValue = 1, paletteValue = 0.7, stainCursor = 0;
    var pointer = { x: -1, y: -1, born: 0 };
    var stains = [null, null, null, null, null, null];
    var stainValues = new Float32Array(24);
    var api = {
      params: { speed: reducedMotion.matches ? 0 : 1, warp: 0.6, pigment: 1 },
      target: { mode: 1, hue: 0.7 },
      pulse: function () { pulseValue = 1; scheduleFrame(); },
      setTarget: function (mode, hue) { api.target.mode = mode || 0; api.target.hue = hue || 0; scheduleFrame(); },
      invalidate: function () { scheduleFrame(); },
      addStain: function (x, y) {
        pointer = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), born: nowTime() };
        stains[stainCursor] = { x: pointer.x, y: pointer.y, born: pointer.born, releasedAt: 0, hue: Math.random() * 0.19 };
        stainCursor = (stainCursor + 1) % stains.length;
        scheduleFrame();
      },
      releasePointer: function () {
        var releasedAt = nowTime();
        pointer = { x: -1, y: -1, born: 0 };
        stains.forEach(function (stain) { if (stain && !stain.releasedAt) stain.releasedAt = releasedAt; });
        scheduleFrame();
      },
      clearStains: function () {
        stains = [null, null, null, null, null, null];
        pointer = { x: -1, y: -1, born: 0 };
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
        ["u_res", "u_time", "u_warp", "u_pulse", "u_mode", "u_palette", "u_pigment", "u_pointer"]
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
      var draw = function () { frameTimer = 0; requestFrame.call(window, frame); };
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
    document.addEventListener("visibilitychange", function () { if (!document.hidden) { last = nowTime(); scheduleFrame(); } });
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
      var mode = Math.round(modeValue), tick = (reducedMotion.matches ? 0 : now * 0.00012) * api.params.speed;
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
        for (var puff = 0; puff < 9; puff++) {
          var drift = (tick * 0.035 + puff * 0.13) % 1;
          var puffX = centerX + Math.sin(puff * 1.73 + tick * 0.28) * width * 0.24;
          var puffY = height * (0.92 - drift * 0.78);
          var puffRadius = shortSide * (0.09 + (puff % 3) * 0.035);
          var cloud = ctx2d.createRadialGradient(puffX, puffY, puffRadius * 0.04, puffX, puffY, puffRadius);
          cloud.addColorStop(0, "rgba(225,225,225,0.075)");
          cloud.addColorStop(0.55, "rgba(205,205,205,0.045)");
          cloud.addColorStop(1, "rgba(190,190,190,0)");
          ctx2d.fillStyle = cloud;
          ctx2d.fillRect(puffX - puffRadius, puffY - puffRadius, puffRadius * 2, puffRadius * 2);
        }
        if (pointer.x >= 0 && now - pointer.born < 4000) {
          var touchX = pointer.x * width, touchY = pointer.y * height, touchRadius = shortSide * 0.22;
          var touchCloud = ctx2d.createRadialGradient(touchX, touchY, 0, touchX, touchY, touchRadius);
          touchCloud.addColorStop(0, "rgba(235,235,235,0.12)");
          touchCloud.addColorStop(1, "rgba(210,210,210,0)");
          ctx2d.fillStyle = touchCloud;
          ctx2d.fillRect(touchX - touchRadius, touchY - touchRadius, touchRadius * 2, touchRadius * 2);
        }
      } else if (mode === 2) {
        for (var petal = 0; petal < 7; petal++) {
          var petalAngle = petal * Math.PI * 2 / 7 + tick * 0.35;
          var petalX = centerX + Math.cos(petalAngle) * shortSide * 0.20;
          var petalY = centerY + Math.sin(petalAngle) * shortSide * 0.20;
          ctx2d.beginPath();
          ctx2d.arc(petalX, petalY, shortSide * 0.09, 0, Math.PI * 2);
          ctx2d.stroke();
        }
        for (var band = 1; band <= 7; band++) { ctx2d.beginPath(); ctx2d.arc(centerX, centerY, shortSide * band * 0.055, 0, Math.PI * 2); ctx2d.stroke(); }
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
        var fade = 1-age/4, radius = Math.min(width,height)*(0.025+0.38*(1-Math.exp(-age*1.35)));
        var cx = stain.x*width, cy = stain.y*height;
        var gradient = ctx2d.createRadialGradient(cx,cy,0,cx,cy,radius);
        var releaseFade = stain.releasedAt ? Math.max(0, 1 - (now - stain.releasedAt) / 1600) : 1;
        gradient.addColorStop(0,hueColor(api.target.hue+stain.hue,0.58*fade*releaseFade*api.params.pigment));
        gradient.addColorStop(0.72,hueColor(api.target.hue+stain.hue+0.08,0.36*fade*releaseFade*api.params.pigment));
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
          stainValues[i*4]=stain.x; stainValues[i*4+1]=1-stain.y; stainValues[i*4+2]=age; stainValues[i*4+3]=stain.hue+(stain.releasedAt ? 1+(now-stain.releasedAt)/1000 : 0);
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
        var pointerAge = pointer.x >= 0 ? (now - pointer.born) / 1000 : 4;
        gl.uniform3f(loc.u_pointer, pointerAge < 4 ? pointer.x : -1, pointerAge < 4 ? 1 - pointer.y : -1, pointerAge);
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
