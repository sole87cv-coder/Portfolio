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
    "uniform float u_warp; uniform float u_pulse; uniform float u_mode; uniform float u_palette; uniform float u_pigment; uniform float u_quality;",
    "uniform vec4 u_stains[6]; uniform float u_stainGrow[6]; uniform vec3 u_pointer; uniform vec2 u_ptrVel;",
    "const float TAU=6.28318;",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }",
    "float hashFast(vec2 p){ vec3 p3=fract(vec3(p.xyx)*0.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }",
    "float noise(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y); }",
    "float noiseFast(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hashFast(i),hashFast(i+vec2(1.0,0.0)),f.x),mix(hashFast(i+vec2(0.0,1.0)),hashFast(i+vec2(1.0,1.0)),f.x),f.y); }",
    "float detailQ(){ return clamp(u_quality*0.5,0.0,1.0); }",
    "float cellScaleQ(){ return 13.0+detailQ()*4.0; }",
    "float fbm(vec2 p){ float value=0.0; float amplitude=0.5; int octaves=u_quality<0.75 ? 2 : 3; for(int octave=0;octave<3;octave++){ if(octave>=octaves) break; value+=noiseFast(p)*amplitude; p=p*2.03+vec2(17.1,-11.7); amplitude*=0.5; } return value; }",
    "vec3 pigment(float h){ return 0.5 + 0.5*cos(TAU*vec3(h,h+0.33,h+0.67)); }",
    "vec2 motifField(float m, vec2 uv, float t, float warp){",
    "  float aspect=u_res.x/u_res.y; float detail=detailQ(); vec2 p=uv; float motif=0.0; float medium=0.0;",
    "  if(m<0.5){",
    "    float clock=floor(t*1.7);",
    "    float burst=step(0.58,hash(vec2(clock,3.0)));",
    "    float tearY=hash(vec2(clock,7.0))*2.2-1.1;",
    "    float tear=burst*(1.0-smoothstep(0.02,0.11,abs(p.y-tearY)));",
    "    p.x+=tear*(hash(vec2(clock,11.0))-0.5)*(0.05+0.10*warp);",
    "    p.x+=(p.y*p.y)*0.05*(1.0+0.3*warp);",
    "    p.y+=(p.x*p.x)*0.02;",
    "    p.x+=sin(p.y*26.0+t*2.2)*0.004*(1.0+warp*2.2)+sin(p.y*71.0-t*4.3)*0.0015*warp;",
    "    float lines=1.0-smoothstep(0.40,0.5,abs(fract((p.y+0.5)*34.0+sin(p.x*3.0+t*0.05)*0.12)-0.5));",
    "    float barY=fract(-t*0.05)*2.4-1.2; float db=(p.y-barY)/0.07;",
    "    float syncBar=exp(-db*db)*(1.0-smoothstep(0.6,1.1,p.y));",
    "    float head=1.0-smoothstep(-0.92,-0.78,p.y);",
    "    float grain=hashFast(mod(gl_FragCoord.xy,2048.0)*0.5+vec2(t*11.0,-t*7.0));",
    "    motif=lines*0.075+lines*0.02+syncBar*0.05+detail*(tear*grain*0.09+head*grain*0.16+grain*0.02);",
    "  }else if(m<1.5){",
    "    vec2 touchCenter=vec2((u_pointer.x-0.5)*aspect,u_pointer.y-0.5);",
    "    float touchInfluence=u_pointer.x>=0.0 ? exp(-dot(uv-touchCenter,uv-touchCenter)*4.5) : 0.0;",
    "    float fold=0.055+warp*0.055;",
    "    vec2 q=uv; q.y+=t*0.055;",
    "    q.x*=1.0+max(0.0,q.y)*0.18;",
    "    q+=fold*vec2(sin(uv.y*3.6+t*0.10),cos(uv.x*3.1-t*0.07));",
    "    q+=(uv-touchCenter)*touchInfluence*0.30-u_ptrVel*4.0*touchInfluence;",
    "    q-=normalize(uv+vec2(0.0001,0.0))*u_pulse*0.05;",
    "    float far=fbm(q*2.6+vec2(t*0.012,-t*0.03));",
    "    float near=fbm(q*4.6+vec2(-t*0.02,-t*0.08)+far*0.85);",
    "    float fine=fbm(q*9.2+vec2(t*0.03,-t*0.13)+far*1.5)*detail;",
    "    float thr=0.36-warp*0.05;",
    "    float farCloud=smoothstep(thr+0.02,thr+0.34,far);",
    "    float nearCloud=smoothstep(thr,thr+0.28,near);",
    "    float shade=1.0;",
    "    if(u_quality>0.5){",
    "      float e=0.035;",
    "      vec2 grad=vec2(fbm((q+vec2(e,0.0))*4.6+vec2(-t*0.02,-t*0.08)+far*0.85)-near,fbm((q+vec2(0.0,-e))*4.6+vec2(-t*0.02,-t*0.08)+far*0.85)-near)/e;",
    "      shade=clamp(0.62+dot(normalize(vec3(-grad,1.0)),normalize(vec3(-0.45,0.6,0.7)))*0.9,0.25,1.7);",
    "    }",
    "    float cloud=clamp(mix(farCloud*0.55,nearCloud,0.75)*shade+abs(near-far)*0.5*detail*0.35,0.0,1.0);",
    "    float soft=1.0-smoothstep(0.25,0.95,length(uv))*0.35;",
    "    motif=cloud*0.15*soft+fine*0.012;",
    "    medium=clamp(cloud+farCloud*0.35,0.0,1.0);",
    "  }else if(m<2.5){",
    "    float organicField=fbm(uv*3.4+vec2(t*0.018,-t*0.014));",
    "    float fold=0.07+warp*0.075;",
    "    vec2 op=uv+fold*vec2(sin(uv.y*5.0+organicField*5.0+t*0.025),cos(uv.x*4.0-organicField*4.0-t*0.02));",
    "    float oRadius=length(vec2(op.x*0.78,op.y-0.06));",
    "    float lobes=5.0+floor(u_palette*3.0);",
    "    float petals=abs(sin(atan(op.y-0.06,op.x*0.78)*lobes+sin(oRadius*9.0+organicField*5.0)*1.8));",
    "    float bands=abs(sin(oRadius*19.0-organicField*8.0+t*0.018));",
    "    float petalsOn=1.0-smoothstep(0.12,0.88,petals);",
    "    float bandsOn=1.0-smoothstep(0.18,0.92,bands);",
    "    float rb=(bands-0.5)/0.07;",
    "    motif=petalsOn*0.085+bandsOn*0.05+exp(-rb*rb)*detail*0.05+organicField*0.02;",
    "    medium=clamp(petalsOn*0.7+bandsOn*0.4,0.0,1.0);",
    "  }else if(m<3.5){",
    "    vec2 fp=uv+(warp>0.0 ? 0.04*warp*vec2(-uv.y,uv.x) : vec2(0.0));",
    "    float s=2.6+warp*1.4; vec2 drift=vec2(t*0.02,-t*0.016);",
    "    float psi=fbm(fp*s+drift);",
    "    float e=0.03;",
    "    vec2 curl=vec2(fbm((fp+vec2(0.0,e))*s+drift)-psi,-(fbm((fp+vec2(e,0.0))*s+drift)-psi))/e;",
    "    float len=max(length(curl),0.0001); float speedMag=clamp(len*0.16,0.0,1.0); vec2 dir=curl/len;",
    "    vec2 adv=fp-dir*t*0.16-speedMag*dir*0.05;",
    "    float along=dot(adv,dir); float across=dot(adv,vec2(-dir.y,dir.x));",
    "    float fil=noiseFast(vec2(along*1.1,across*(7.0+warp*4.0)));",
    "    float strands=1.0-smoothstep(0.0,0.16+0.12*(1.0-detail),abs(fract(fil*3.0+along*0.5)-0.5));",
    "    motif=strands*(0.045+speedMag*0.13)+fil*0.018*detail;",
    "    medium=clamp(strands*(0.35+speedMag*0.65),0.0,1.0);",
    "  }else{",
    "    float horizon=0.14+0.02*sin(t*0.05); float vy=p.y-horizon;",
    "    float below=1.0-smoothstep(-0.03,0.05,vy);",
    "    float dz=1.0/max(0.05,-vy+0.05);",
    "    float pr=1.0-smoothstep(0.44,0.5,abs(fract(dz*(1.4+warp*0.5)+t*0.5*(1.0+warp*0.4))-0.5));",
    "    float pc=1.0-smoothstep(0.44,0.5,abs(fract(p.x*dz*(2.0+warp*0.7))-0.5));",
    "    float floorLines=clamp(pr+pc,0.0,1.0)*below*(1.0-smoothstep(1.2,9.0,dz));",
    "    float cs=cellScaleQ(); vec2 cq=p*cs; vec2 ci=floor(cq); vec2 cf=fract(cq)-0.5;",
    "    float led=exp(-dot(cf,cf)*30.0);",
    "    float lit=smoothstep(0.82,1.0,fract(hashFast(ci)*0.7-t*0.075));",
    "    float scan=1.0-smoothstep(0.03,0.14,abs(p.y-(fract(t*0.06)*2.2-1.1)));",
    "    motif=floorLines*0.085+led*(0.045+lit*(0.24+detail*0.12)+scan*0.12);",
    "    medium=clamp(led*lit*2.0+floorLines*0.3,0.0,1.0);",
    "  }",
    "  return vec2(motif,medium);",
    "}",
    "void main(){",
    "  vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;",
    "  float t=u_time; float mode=clamp(u_mode,0.0,4.0); float warp=clamp(u_warp,0.0,2.0);",
    "  float lo=floor(mode); float step_=mode-lo; float hi=min(lo+1.0,4.0);",
    "  vec2 field=motifField(lo,uv,t,warp);",
    "  if(step_>0.5){ vec2 other=motifField(hi,uv,t,warp); field=mix(field,other,smoothstep(0.5,1.0,step_)); }",
    "  float horizon=exp(-abs(uv.y-0.08)*18.0);",
    "  float radius=length(vec2(uv.x*0.78,uv.y-0.06));",
    "  float analog=1.0-clamp(abs(mode-0.0),0.0,1.0);",
    "  float grid=1.0-clamp(abs(mode-4.0),0.0,1.0);",
    "  float dither=fract(sin(dot(mod(gl_FragCoord.xy,2048.0),vec2(12.9898,78.233))+t*0.17)*43758.5453);",
    "  float pulse=exp(-abs(radius-(0.14+u_pulse*0.23))*24.0)*u_pulse;",
    "  float grey=(0.018+horizon*0.105+field.x+pulse*0.18+(dither-0.5)*0.012*(1.0+analog*2.0))*(1.0-(0.24+analog*0.10)*dot(uv,uv));",
    "  vec3 col=vec3(clamp(grey,0.0,0.82));",
    "  float cell=cellScaleQ();",
    "  for(int i=0;i<6;i++){",
    "    vec4 s=u_stains[i];",
    "    if(s.z>=0.0 && s.z<4.0){",
    "      vec2 center=vec2((s.x-0.5)*(u_res.x/u_res.y),s.y-0.5);",
    "      vec2 cc=(floor(uv*cell)+0.5)/cell;",
    "      vec2 d=mix(uv,cc,grid)-center;",
    "      float d2=dot(d,d);",
    "      if(d2<0.30){",
    "        float angle=atan(d.y,d.x);",
    "        float wobble=0.055*sin(angle*5.0+s.w*6.28)+0.032*sin(angle*9.0-s.z*2.0)+0.018*sin(angle*15.0+s.x*31.0);",
    "        wobble*=mix(1.0,0.15,grid)*(1.0+analog*1.2);",
    "        float dist=sqrt(d2)*(1.0+wobble);",
    "        float spread=(0.025+0.38*(1.0-exp(-s.z*1.35)))*(1.0+u_stainGrow[i]);",
    "        if(dist<spread+0.045){",
    "          float body=1.0-smoothstep(spread*0.70,spread+0.032,dist);",
    "          float rd=(dist-spread*0.86)/(spread*0.16+0.008);",
    "          float rim=exp(-rd*rd);",
    "          float grain=0.82+0.18*hashFast(d*38.0+vec2(s.x*17.0,s.y*17.0));",
    "          grain=mix(grain,1.0,grid*0.8);",
    "          float fade=1.0-smoothstep(2.65,4.0,s.z);",
    "          float halo=1.0-smoothstep(spread,spread+0.075,dist);",
    "          float released=s.w>=1.0 ? 1.0-smoothstep(0.0,1.6,s.w-1.0) : 1.0;",
    "          float alpha=clamp((body*0.58+rim*0.50+halo*0.16)*fade*released*u_pigment*grain,0.0,0.94);",
    "          vec3 ink=pigment(mod(s.w,1.0)+u_palette+mode*0.035);",
    "          float absorb=0.45+0.55*field.y;",
    "          col=mix(col,ink*absorb,alpha);",
    "          col*=mix(1.0,0.74,alpha*field.y);",
    "          col+=ink*rim*fade*released*0.09*(0.45+0.75*field.y);",
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

  function pigmentRGB(h) {
    var k = ((h % 1) + 1) % 1;
    return [
      Math.round((0.5 + 0.5 * Math.cos(6.28318 * k)) * 255),
      Math.round((0.5 + 0.5 * Math.cos(6.28318 * (k + 0.33))) * 255),
      Math.round((0.5 + 0.5 * Math.cos(6.28318 * (k + 0.67))) * 255)
    ];
  }

  function hueColor(h, alpha) {
    var c = pigmentRGB(h);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + alpha + ")";
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
    var maxDpr = lowCapacity ? 1 : 1.5;
    var frameDelay = lowCapacity ? 34 : 0;
    var quality = lowCapacity ? 0 : 2;
    var gl = null, ctx2d = null, program = null, loc = {};
    var framePending = false, frameTimer = 0, stainTimer = 0, time = 0, last = nowTime();
    var lastResizeAt = 0, frameTimes = [], nextDowngrade = 0;
    var pulseValue = 0, modeValue = 1, paletteValue = 0.7, stainCursor = 0;
    var pointer = { x: -1, y: -1, born: 0, vx: 0, vy: 0 };
    var stains = [null, null, null, null, null, null];
    var stainValues = new Float32Array(24);
    var stainGrow = new Float32Array(6);
    var STAIN_SPACING = 0.13, STAIN_GROW_MAX = 0.55;
    function velocityPart(value) {
      if (!isFinite(value)) return 0;
      return Math.max(-0.15, Math.min(0.15, value));
    }
    var api = {
      params: { speed: reducedMotion.matches ? 0 : 1, warp: 0.6, pigment: 1 },
      defaults: { speed: reducedMotion.matches ? 0 : 1, warp: 0.6, pigment: 1 },
      target: { mode: 1, hue: 0.7 },
      stats: function () { return { quality: quality, dpr: Math.min(window.devicePixelRatio || 1, maxDpr), frameDelay: frameDelay }; },
      pulse: function () { pulseValue = 1; scheduleFrame(); },
      setTarget: function (mode, hue) { api.target.mode = isFinite(mode) ? mode : 1; api.target.hue = hue || 0; scheduleFrame(); },
      invalidate: function () { scheduleFrame(); },
      addStain: function (x, y, vx, vy) {
        var anchorX = Math.max(0, Math.min(1, x)), anchorY = Math.max(0, Math.min(1, y));
        pointer = { x: anchorX, y: anchorY, born: nowTime(), vx: velocityPart(vx), vy: velocityPart(vy) };
        var current = stains[stainCursor];
        if (current && !current.releasedAt) {
          var dx = anchorX - current.x, dy = anchorY - current.y;
          var distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < STAIN_SPACING) {
            // Um traçado continuo alimenta o mesmo deposito: a ancora segue o dedo e o pigmento acumula onde ele anda devagar.
            current.x += dx * 0.22; current.y += dy * 0.22;
            current.grow = Math.min(STAIN_GROW_MAX, current.grow + 0.012 + Math.max(0, 0.04 - distance * 0.35));
            scheduleFrame();
            return;
          }
        }
        stainCursor = (stainCursor + 1) % stains.length;
        stains[stainCursor] = { x: anchorX, y: anchorY, born: pointer.born, releasedAt: 0, hue: Math.random() * 0.19, grow: 0.18 };
        scheduleFrame();
      },
      releasePointer: function () {
        var releasedAt = nowTime();
        pointer = { x: -1, y: -1, born: 0, vx: 0, vy: 0 };
        stains.forEach(function (stain) { if (stain && !stain.releasedAt) stain.releasedAt = releasedAt; });
        scheduleFrame();
      },
      clearStains: function () {
        stains = [null, null, null, null, null, null];
        stainCursor = 0;
        for (var i = 0; i < stainGrow.length; i++) stainGrow[i] = 0;
        pointer = { x: -1, y: -1, born: 0, vx: 0, vy: 0 };
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
        ["u_res", "u_time", "u_warp", "u_pulse", "u_mode", "u_palette", "u_pigment", "u_quality", "u_pointer", "u_ptrVel"]
          .forEach(function (name) { loc[name] = gl.getUniformLocation(program, name); });
        loc.u_stains = gl.getUniformLocation(program, "u_stains[0]");
        loc.u_stainGrow = gl.getUniformLocation(program, "u_stainGrow[0]");
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
        for (var scan = 1; scan < 54; scan++) {
          var scanY = height * scan / 54;
          var jitter = Math.sin(scan * 13.17 + tick * 6.0) * api.params.warp * shortSide * 0.004;
          ctx2d.beginPath(); ctx2d.moveTo(0, scanY); ctx2d.lineTo(width * 0.48 + jitter, scanY); ctx2d.lineTo(width, scanY + jitter); ctx2d.stroke();
        }
        var barY = ((tick * 0.9) % 1) * height;
        ctx2d.save(); ctx2d.strokeStyle = "rgba(235,235,235,0.26)";
        for (var bar = -3; bar <= 3; bar++) {
          var by = barY + bar * shortSide * 0.012;
          ctx2d.beginPath(); ctx2d.moveTo(0, by); ctx2d.lineTo(width, by); ctx2d.stroke();
        }
        ctx2d.restore();
        ctx2d.save(); ctx2d.strokeStyle = "rgba(235,235,235,0.2)";
        var headY = height - shortSide * 0.05;
        for (var noise = 0; noise < 26; noise++) {
          var ny = headY + Math.sin(noise * 7.3 + tick * 4.0) * shortSide * 0.02;
          var nx = ((noise * 0.137 + (tick * 0.6) % 1) % 1) * width;
          ctx2d.beginPath(); ctx2d.moveTo(nx, ny); ctx2d.lineTo(nx + shortSide * 0.03, ny); ctx2d.stroke();
        }
        ctx2d.restore();
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
        var cell = Math.max(26, shortSide / 11);
        ctx2d.save(); ctx2d.fillStyle = "rgba(235,235,235,0.42)";
        for (var cellRow = 0; cellRow * cell < horizon; cellRow++) {
          for (var cellColumn = 0; cellColumn * cell < width; cellColumn++) {
            var address = Math.abs(Math.sin(cellColumn * 12.9898 + cellRow * 78.233));
            if ((address + tick * 0.5) % 1 > 0.86) {
              ctx2d.fillRect(cellColumn * cell + cell * 0.3, cellRow * cell + cell * 0.3, cell * 0.4, cell * 0.4);
            }
          }
        }
        ctx2d.restore();
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
        var fade = 1-age/4, radius = Math.min(width,height)*(0.025+0.38*(1-Math.exp(-age*1.35)))*(1+(stain.grow||0));
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
      if (now - lastResizeAt > 250) { lastResizeAt = now; resize(); }
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
          stainGrow[i]=stain.grow;
          active=true;
        } else {
          stains[i]=null; stainValues[i*4]=0; stainValues[i*4+1]=0; stainValues[i*4+2]=-1; stainValues[i*4+3]=0; stainGrow[i]=0;
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
        gl.uniform1f(loc.u_quality,quality);
        gl.uniform4fv(loc.u_stains,stainValues);
        gl.uniform1fv(loc.u_stainGrow,stainGrow);
        var pointerAge = pointer.x >= 0 ? (now - pointer.born) / 1000 : 4;
        gl.uniform3f(loc.u_pointer, pointerAge < 4 ? pointer.x : -1, pointerAge < 4 ? 1 - pointer.y : -1, pointerAge);
        gl.uniform2f(loc.u_ptrVel, pointer.vx, -pointer.vy);
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
      if (gl && moving && api.params.speed > 0) {
        frameTimes.push(dt * 1000);
        if (frameTimes.length > 36) frameTimes.shift();
        if (frameTimes.length === 36 && quality > 0 && now > nextDowngrade) {
          var ordered = frameTimes.slice().sort(function (a, b) { return a - b; });
          if (ordered[18] > 24) {
            quality -= 1;
            if (quality === 0) maxDpr = 1;
            nextDowngrade = now + 3000;
            frameTimes.length = 0;
            resize();
          }
        }
      }
      if (moving && (api.params.speed>0 || active || pulseValue>0.008)) scheduleFrame();
    }

    resize(); scheduleFrame();
    return api;
  };
})();
