(function () {
  var projects = window.PROJECTS;
  var shader = window.createShader(document.getElementById("gl"));
  var railEl = document.getElementById("rail");
  var stageEl = document.getElementById("stage");
  var current = -1;

  /* ---------- linha do tempo ---------- */
  projects.forEach(function (p, i) {
    var li = document.createElement("li");
    if (p.sub) li.className = "sub";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "node";
    btn.innerHTML = '<span class="dot"></span><span class="when"></span><span class="name"></span>';
    btn.querySelector(".when").textContent = p.when;
    btn.querySelector(".name").textContent = p.title;
    btn.addEventListener("click", function () { go(i); });
    li.appendChild(btn);
    railEl.appendChild(li);
  });

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  /* ---------- palco do item ativo ---------- */
  function render(p, i) {
    var card = el("article", "card");
    card.appendChild(el("p", "when", p.when));
    card.appendChild(el("h2", null, p.title));
    card.appendChild(el("p", "subtitle", p.subtitle));
    card.appendChild(el("p", "text", p.text));

    if (p.tags && p.tags.length) {
      var ul = el("ul", "tags");
      p.tags.forEach(function (t) { ul.appendChild(el("li", null, t)); });
      card.appendChild(ul);
    }
    if (p.specs && p.specs.length) {
      var dl = el("dl", "specs");
      p.specs.forEach(function (s) {
        dl.appendChild(el("dt", null, s[0]));
        dl.appendChild(el("dd", null, s[1]));
      });
      card.appendChild(dl);
    }
    if (p.links) {
      var lu = el("ul", "links");
      p.links.forEach(function (l) {
        var li = document.createElement("li");
        if (l.length === 2) { li.className = "group"; li.appendChild(el("h3", null, l[1])); lu.appendChild(li); return; }
        var a = document.createElement("a");
        a.href = l[2];
        a.target = l[2].indexOf("http") === 0 ? "_blank" : "_self";
        a.rel = "noopener noreferrer";
        a.appendChild(el("span", "k", l[0]));
        a.appendChild(el("span", "v", l[1]));
        a.appendChild(el("span", "go", "Abrir ↗"));
        li.appendChild(a);
        if (l[3] === "copy") {
          var cb = el("button", "btn ghost", "Copiar");
          cb.type = "button";
          cb.addEventListener("click", function () {
            var txt = l[0] === "WhatsApp" ? l[1] : l[2].replace(/^mailto:/, "");
            var done = function () { cb.textContent = "Copiado"; setTimeout(function () { cb.textContent = "Copiar"; }, 1500); };
            if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, done); else done();
          });
          li.appendChild(cb);
        }
        lu.appendChild(li);
      });
      card.appendChild(lu);
    }

    if (p.images && p.images.length) {
      var gal = el("ul", "gallery");
      p.images.forEach(function (im) {
        var gi = document.createElement("li");
        var a = document.createElement("button");
        a.type = "button"; a.className = "thumb";
        a.setAttribute("aria-label", "Ampliar: " + im[1]);
        a.addEventListener("click", function () { openLightbox(im); });
        var img = document.createElement("img");
        img.src = "img/" + im[0]; img.alt = im[1]; img.loading = "lazy";
        a.appendChild(img);
        gi.appendChild(a);
        gi.appendChild(el("span", "cap", im[1]));
        gal.appendChild(gi);
      });
      card.appendChild(gal);
    }

    var actions = el("div", "actions");
    var fire = el("button", "btn", "Ouvir e disparar");
    fire.type = "button";
    fire.addEventListener("click", function () {
      shader.pulse();
      window.SoleAudio.play(p.tone || [262, 330]);
    });
    var prev = el("button", "btn ghost", "Anterior");
    prev.type = "button";
    prev.disabled = i === 0;
    prev.addEventListener("click", function () { go(i - 1); });
    var next = el("button", "btn ghost", "Próximo");
    next.type = "button";
    next.disabled = i === projects.length - 1;
    next.addEventListener("click", function () { go(i + 1); });
    (p.jump || []).forEach(function (j) {
      var jb = el("button", "btn ghost", j[0]);
      jb.type = "button";
      jb.addEventListener("click", function () {
        for (var q = 0; q < projects.length; q++) if (projects[q].id === j[1]) go(q);
      });
      actions.appendChild(jb);
    });
    actions.appendChild(fire);
    actions.appendChild(prev);
    actions.appendChild(next);
    card.appendChild(actions);
    return card;
  }

  function go(i, fromHash) {
    if (i < 0 || i >= projects.length || i === current) return;
    var p = projects[i];
    var first = current === -1;
    current = i;

    // marca a linha do tempo
    var items = railEl.children;
    for (var k = 0; k < items.length; k++) {
      items[k].classList.toggle("done", k < i);
      var b = items[k].firstChild;
      if (k === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    }
    items[i].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });

    // o shader passa a dialogar com o item
    shader.setTarget(p.mode, p.hue);
    if (!first) shader.pulse();

    // troca o cartão com uma transição curta
    var old = stageEl.firstChild;
    var show = function () {
      var card = render(p, i);
      stageEl.innerHTML = "";
      stageEl.appendChild(card);
      stageEl.scrollTop = 0;
    };
    if (old && !first) {
      old.classList.add("swap");
      setTimeout(show, 200);
    } else {
      show();
    }
    if (!fromHash && history.replaceState) history.replaceState(null, "", "#" + p.id);
  }

  function fromHash() {
    var id = location.hash.slice(1);
    for (var k = 0; k < projects.length; k++) if (projects[k].id === id) return k;
    return 0;
  }
  window.addEventListener("hashchange", function () { go(fromHash(), true); });

  /* ---------- ponteiro, teclado e deslize ---------- */
  window.addEventListener("pointermove", function (e) {
    shader.mouse.x = e.clientX / window.innerWidth;
    shader.mouse.y = 1 - e.clientY / window.innerHeight;
  }, { passive: true });

  window.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.getElementById("lb").open) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { go(current + 1); e.preventDefault(); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { go(current - 1); e.preventDefault(); }
  });

  var sx = null;
  stageEl.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  stageEl.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    sx = null;
    if (Math.abs(dx) > 70) go(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- controles do shader ---------- */
  var speed = document.getElementById("c-speed");
  var warp = document.getElementById("c-warp");
  var hue = document.getElementById("c-hue");
  var sens = document.getElementById("c-sens");
  var micBtn = document.getElementById("c-mic");
  var note = document.getElementById("c-note");

  speed.value = shader.params.speed;
  speed.addEventListener("input", function () { shader.params.speed = parseFloat(speed.value); });
  warp.addEventListener("input", function () { shader.params.warp = parseFloat(warp.value); });
  hue.addEventListener("input", function () { shader.params.hueShift = parseFloat(hue.value); });

  micBtn.addEventListener("click", function () {
    if (window.SoleAudio.active) {
      window.SoleAudio.stop();
      shader.params.audio = 0;
      document.documentElement.style.setProperty("--lvl", "0");
      micBtn.textContent = "Ativar microfone";
      note.textContent = "Microfone desligado.";
      return;
    }
    window.SoleAudio.start().then(function () {
      micBtn.textContent = "Desativar microfone";
      note.textContent = "Microfone ativo. Fale, bata palmas ou toque música.";
    }).catch(function () {
      note.textContent = "Não foi possível acessar o microfone. Permita o acesso no navegador e tente de novo.";
    });
  });

  setInterval(function () {
    if (window.SoleAudio.active) {
      shader.params.audio = window.SoleAudio.read(parseFloat(sens.value));
      document.documentElement.style.setProperty("--lvl", shader.params.audio.toFixed(3));
    }
  }, 16);

  /* ---------- ocultar interface ---------- */
  var bare = document.getElementById("c-bare");
  bare.addEventListener("click", function () {
    var on = document.body.classList.toggle("bare");
    bare.setAttribute("aria-pressed", String(on));
    bare.textContent = on ? "Mostrar interface" : "Ocultar interface";
  });

  /* ---------- ampliação de fotos ---------- */
  var lb = document.getElementById("lb");
  var lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p");
  function openLightbox(im) {
    lbImg.src = "img/" + im[0]; lbImg.alt = im[1]; lbCap.textContent = im[1];
    if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
  }
  lb.addEventListener("click", function (e) { if (e.target !== lbImg) lb.close(); });

  /* ---------- logos interativos ---------- */
  function logoGo(id, notes) {
    for (var q = 0; q < projects.length; q++) if (projects[q].id === id) go(q);
    shader.pulse();
    window.SoleAudio.play(notes);
  }
  document.getElementById("logo-sole").addEventListener("click", function () { logoGo("bio", [262, 392]); });
  document.getElementById("logo-v").addEventListener("click", function () { logoGo("v1su4rt", [330, 440, 660]); });

  /* ---------- vista: desktop, tablet, celular ---------- */
  var viewSel = document.getElementById("c-view");
  function applyView() {
    var mode = viewSel.value, w = window.innerWidth, v;
    v = mode === "auto" ? (w < 700 ? "mobile" : (w < 1100 ? "tablet" : "desktop")) : mode;
    var b = document.body.classList;
    b.remove("v-desktop", "v-tablet", "v-mobile", "framed");
    b.add("v-" + v);
    if (mode !== "auto" && ((v === "mobile" && w > 460) || (v === "tablet" && w > 860))) b.add("framed");
  }
  viewSel.addEventListener("change", applyView);
  window.addEventListener("resize", applyView);
  applyView();

  go(fromHash(), true);
})();
