(function () {
  "use strict";
  var projects = window.PROJECTS || [];
  var shader = window.createShader(document.getElementById("gl"));
  var railEl = document.getElementById("rail");
  var stageEl = document.getElementById("stage");
  var filterEl = document.getElementById("c-category");
  var searchEl = document.getElementById("c-search");
  var countEl = document.getElementById("browse-count");
  var statusEl = document.getElementById("app-status");
  var lastObservedHash = null;
  var current = -1;
  var visible = [];
  var renderVersion = 0;
  var categories = {
    all: null,
    works: ["works"],
    workshop: ["workshop"],
    research: ["research"],
    collective: ["collective"],
    interactive: ["interactive"],
    education: ["education"],
    profile: ["profile"],
    info: ["info"]
  };
  var knownIds = Object.create(null);
  projects.forEach(function (project) {
    if (knownIds[project.id]) console.error("ID de projeto repetido:", project.id);
    knownIds[project.id] = true;
    if (!Object.prototype.hasOwnProperty.call(categories, project.category)) console.error("Categoria de projeto desconhecida:", project.id, project.category);
  });
  projects.forEach(function (project) {
    if (!project.id || !project.title || !project.category) console.warn("Registro sem id, título ou categoria:", project);
    (project.jump || []).forEach(function (link) {
      var target = link.target !== undefined ? link.target : link[1];
      if (!target || !knownIds[target]) console.warn("Destino de navegação inválido:", project.id, link);
    });
    (project.links || []).forEach(function (link) {
      var url = link.url !== undefined ? link.url : link[2];
      if (!url || !/^(https?:|mailto:|tel:)/i.test(url)) console.warn("Link inválido:", project.id, link);
    });
    (project.images || []).forEach(function (image) {
      var src = image.src !== undefined ? image.src : image[0];
      if (!src || /[\\/]/.test(src)) console.warn("Arquivo de imagem inválido:", project.id, image);
    });
  });

  function projectIndexById(id) {
    for (var i = 0; i < projects.length; i++) if (projects[i].id === id) return i;
    return -1;
  }
  function matches(p) {
    var allowed = categories[filterEl.value];
    if (allowed && allowed.indexOf(p.category) < 0) return false;
    var q = searchEl.value.trim().toLocaleLowerCase("pt-BR");
    if (!q) return true;
    var text = [p.title, p.subtitle, p.text, p.when, p.kind, p.role, p.collaborators, p.location,
      (p.tags || []).join(" "), (p.specs || []).map(function (pair) { return pair.label !== undefined ? pair.label + " " + pair.value : pair.join(" "); }).join(" "),
      (p.links || []).map(function (link) { return Array.isArray(link) ? link.join(" ") : [link.label, link.text, link.url].join(" "); }).join(" ")]
      .join(" ").toLocaleLowerCase("pt-BR");
    return text.indexOf(q) >= 0;
  }
  function make(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function rebuildRail() {
    visible = [];
    railEl.textContent = "";
    projects.forEach(function (p, i) {
      if (!matches(p)) return;
      visible.push(i);
      var li = make("li", p.sub ? "sub" : "");
      var btn = make("button", "node");
      btn.type = "button";
      btn.setAttribute("aria-label", [p.when, p.title].join(": "));
      var dot = make("span", "dot"); dot.setAttribute("aria-hidden", "true");
      var when = make("span", "when", p.when || "");
      var name = make("span", "name", p.title || "Sem título");
      btn.append(dot, when, name);
      btn.addEventListener("click", function () { go(i); });
      li.appendChild(btn);
      railEl.appendChild(li);
    });
    countEl.textContent = visible.length + (visible.length === 1 ? " item" : " itens");
    if (current >= 0 && visible.indexOf(current) < 0) current = -1;
    if (visible.length && current < 0) go(visible[0], true, true);
    if (!visible.length) showEmpty();
    else updateRailState();
  }
  function updateRailState() {
    var items = railEl.children;
    for (var j = 0; j < items.length; j++) {
      var index = visible[j];
      items[j].classList.toggle("done", index < current && index >= 0);
      var button = items[j].firstChild;
      if (index === current) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  }
  function addLinks(card, links) {
    if (!links || !links.length) return;
    var list = make("ul", "links");
    links.forEach(function (link) {
      var label = link.label !== undefined ? link.label : link[0];
      var value = link.text !== undefined ? link.text : link[1];
      var url = link.url !== undefined ? link.url : link[2];
      var copyEnabled = link.copy === true || link[3] === "copy";
      if ((link.type === "group") || (Array.isArray(link) && link.length === 2)) {
        var group = make("li", "group"); group.appendChild(make("h3", null, link.title || value)); list.appendChild(group); return;
      }
      if (!url || !/^(https?:|mailto:|tel:)/i.test(url)) return;
      var li = make("li");
      var a = document.createElement("a");
      a.href = url;
      var external = /^https?:/i.test(url);
      if (external) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      a.append(make("span", "k", label), make("span", "v", value), make("span", "go", external ? "Abrir em nova aba ↗" : "Abrir ↗"));
      li.appendChild(a);
      if (copyEnabled) {
        var copy = make("button", "btn ghost copy-button", "Copiar");
        copy.type = "button";
        copy.setAttribute("aria-label", "Copiar contato");
        var copyValue = link.copyValue || (label === "WhatsApp" ? value : url.replace(/^mailto:/, ""));
        copy.addEventListener("click", function () { copyText(copyValue, copy); });
        li.appendChild(copy);
      }
      list.appendChild(li);
    });
    card.appendChild(list);
  }
  function copyText(value, button) {
    function success() {
      button.textContent = "Copiado";
      button.setAttribute("aria-label", "Contato copiado");
      window.setTimeout(function () { button.textContent = "Copiar"; button.setAttribute("aria-label", "Copiar contato"); }, 1800);
    }
    function fallback() {
      var field = make("textarea"); field.value = value; field.setAttribute("readonly", "");
      field.style.position = "fixed"; field.style.opacity = "0"; document.body.appendChild(field); field.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
      field.remove();
      if (ok) success(); else { button.textContent = "Cópia indisponível"; button.setAttribute("aria-label", "Cópia indisponível; selecione o contato no link ao lado"); }
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(value).then(success, fallback);
    else fallback();
  }
  function addImages(card, images, projectTitle) {
    if (!images || !images.length) return;
    var gallery = make("ul", "gallery");
    images.forEach(function (item) {
      var filename = item.src !== undefined ? item.src : item[0];
      var caption = (item.caption !== undefined ? item.caption : item[1]) || projectTitle;
      var alt = (item.alt !== undefined ? item.alt : item[2]) || caption || projectTitle;
      if (!filename || /[\\/]/.test(filename)) return;
      var li = make("li"), button = make("button", "thumb");
      button.type = "button"; button.setAttribute("aria-label", "Ampliar imagem: " + alt);
      button.addEventListener("click", function () { openLightbox(filename, alt, caption); });
      var img = document.createElement("img"); img.src = "img/" + filename; img.alt = alt; img.loading = "lazy"; img.decoding = "async";
      img.addEventListener("error", function () { li.classList.add("image-unavailable"); button.disabled = true; });
      button.appendChild(img); li.appendChild(button); li.appendChild(make("span", "cap", caption)); gallery.appendChild(li);
    });
    card.appendChild(gallery);
  }
  function render(index) {
    var p = projects[index];
    var card = make("article", "card");
    card.setAttribute("aria-labelledby", "project-title");
    var head = make("div", "card-heading");
    head.append(make("p", "eyebrow", [p.kind, p.when].filter(Boolean).join(" · ")), make("h1", null, p.title || "Projeto"));
    head.lastChild.id = "project-title";
    if (p.subtitle) head.appendChild(make("p", "subtitle", p.subtitle));
    card.appendChild(head);
    if (p.text) card.appendChild(make("p", "text", p.text));
    if (p.tags && p.tags.length) {
      var tags = make("ul", "tags"); tags.setAttribute("aria-label", "Temas e linguagens");
      p.tags.forEach(function (tag) { tags.appendChild(make("li", null, tag)); }); card.appendChild(tags);
    }
    var meta = [];
    if (p.role) meta.push(["Atuação", p.role]);
    if (p.collaborators) meta.push(["Colaboração", p.collaborators]);
    if (p.location) meta.push(["Local", p.location]);
    if (p.status) meta.push(["Estado", p.status]);
    if (meta.length) {
      var details = make("dl", "project-meta");
      meta.forEach(function (pair) { details.append(make("dt", null, pair.label !== undefined ? pair.label : pair[0]), make("dd", null, pair.value !== undefined ? pair.value : pair[1])); });
      card.appendChild(details);
    }
    if (p.specs && p.specs.length) {
      var specs = make("dl", "specs");
      p.specs.forEach(function (pair) { specs.append(make("dt", null, pair.label !== undefined ? pair.label : pair[0]), make("dd", null, pair.value !== undefined ? pair.value : pair[1])); });
      card.appendChild(specs);
    }
    addLinks(card, p.links);
    addImages(card, p.images, p.title);
    var actions = make("div", "actions");
    (p.jump || []).forEach(function (item) {
      var targetId = item.target !== undefined ? item.target : item[1];
      var label = item.label !== undefined ? item.label : item[0];
      if (projectIndexById(targetId) < 0) return;
      var jump = make("button", "btn ghost", label); jump.type = "button";
      jump.addEventListener("click", function () { goToId(targetId); }); actions.appendChild(jump);
    });
    var sound = make("button", "btn", "Ouvir sinal e animar"); sound.type = "button";
    sound.setAttribute("aria-label", "Reproduzir sinal sonoro e animar o fundo, sem gravar áudio");
    sound.addEventListener("click", function () { shader.pulse(); window.SoleAudio.play(p.tone || [262, 330]); }); actions.appendChild(sound);
    var position = visible.indexOf(index);
    var prev = make("button", "btn ghost", "Anterior"); prev.type = "button"; prev.disabled = position <= 0;
    prev.addEventListener("click", function () { if (position > 0) go(visible[position - 1]); });
    var next = make("button", "btn ghost", "Próximo"); next.type = "button"; next.disabled = position < 0 || position >= visible.length - 1;
    next.addEventListener("click", function () { if (position >= 0 && position < visible.length - 1) go(visible[position + 1]); });
    actions.append(prev, next); card.appendChild(actions);
    return card;
  }
  function showEmpty() {
    var card = make("section", "card empty-state");
    card.append(make("p", "eyebrow", "Nenhum resultado"), make("h1", null, "Não encontrei esse conteúdo"), make("p", "text", "Tente outra palavra ou remova o filtro para voltar a explorar o portfólio."));
    var clear = make("button", "btn", "Limpar busca e filtros"); clear.type = "button";
    clear.addEventListener("click", function () { filterEl.value = "all"; searchEl.value = ""; rebuildRail(); }); card.appendChild(clear);
    stageEl.replaceChildren(card);
  }
  function go(index, fromHistory, force) {
    if (index < 0 || index >= projects.length) return;
    if (visible.indexOf(index) < 0 && !force) return;
    if (index === current && !force) return;
    var p = projects[index];
    current = index; updateRailState();
    var active = railEl.children[visible.indexOf(index)];
    if (active) active.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    shader.setTarget(p.mode || 0, p.hue || 0); shader.pulse();
    var version = ++renderVersion;
    var old = stageEl.firstElementChild;
    var show = function () {
      if (version !== renderVersion) return;
      stageEl.replaceChildren(render(index)); stageEl.scrollTop = 0;
    };
    if (old) { old.classList.add("swap"); window.setTimeout(show, 150); } else show();
    if (!fromHistory && location.hash !== "#" + p.id) history.pushState({ projectId: p.id }, "", "#" + p.id);
    lastObservedHash = location.hash;
  }
  function goToId(id) {
    var index = projectIndexById(id);
    if (index < 0) return;
    var p = projects[index];
    if (!matches(p)) { filterEl.value = "all"; searchEl.value = ""; rebuildRail(); }
    go(index, false, true);
  }
  function readHash() {
    var hash = location.hash;
    if (hash === lastObservedHash) return true;
    lastObservedHash = hash;
    var index = projectIndexById(hash.slice(1));
    if (index < 0) {
      if (hash) {
        statusEl.textContent = "Esse endereço não corresponde a um conteúdo. Apresentação inicial aberta.";
        history.replaceState(null, "", location.pathname + location.search);
        lastObservedHash = "";
      }
      filterEl.value = "all"; searchEl.value = ""; rebuildRail();
      var home = projectIndexById("bio"); if (home >= 0) go(home, true, true);
      return home >= 0;
    }
    var p = projects[index];
    if (!matches(p)) { filterEl.value = "all"; searchEl.value = ""; rebuildRail(); }
    go(index, true, true); return true;
  }
  filterEl.addEventListener("change", rebuildRail);
  searchEl.addEventListener("input", rebuildRail);
  window.addEventListener("popstate", readHash);
  window.addEventListener("hashchange", readHash);
  window.addEventListener("keydown", function (event) {
    var tag = event.target && event.target.tagName;
    if (event.key === "Escape" && document.body.classList.contains("bare")) { restoreInterface(); return; }
    if (document.getElementById("lb").open) return;
    if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].indexOf(tag) >= 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      var pos = visible.indexOf(current); if (pos < visible.length - 1) go(visible[pos + 1]); event.preventDefault();
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      var currentPos = visible.indexOf(current); if (currentPos > 0) go(visible[currentPos - 1]); event.preventDefault();
    }
  });
  var touchX = null, touchY = null;
  stageEl.addEventListener("touchstart", function (event) {
    if (!event.touches.length) return;
    touchX = event.touches[0].clientX; touchY = event.touches[0].clientY;
  }, { passive: true });
  stageEl.addEventListener("touchend", function (event) {
    if (touchX === null || !event.changedTouches.length) return;
    var delta = event.changedTouches[0].clientX - touchX;
    var vertical = event.changedTouches[0].clientY - touchY;
    touchX = null; touchY = null;
    if (Math.abs(vertical) > Math.abs(delta) * 0.75) return;
    var pos = visible.indexOf(current);
    if (Math.abs(delta) > 80 && pos >= 0) {
      var target = pos + (delta < 0 ? 1 : -1);
      if (target >= 0 && target < visible.length) go(visible[target]);
    }
  }, { passive: true });

  var speed = document.getElementById("c-speed"), warp = document.getElementById("c-warp"), hue = document.getElementById("c-hue"), sens = document.getElementById("c-sens");
  var micBtn = document.getElementById("c-mic"), note = document.getElementById("c-note");
  var outputs = [[speed, "o-speed"], [warp, "o-warp"], [hue, "o-hue"], [sens, "o-sens"]];
  function updateOutput(input, outputId) { document.getElementById(outputId).value = Number(input.value).toFixed(input === sens ? 1 : 2); }
  speed.value = shader.params.speed;
  outputs.forEach(function (pair) { updateOutput(pair[0], pair[1]); pair[0].addEventListener("input", function () { updateOutput(pair[0], pair[1]); }); });
  speed.addEventListener("input", function () { shader.params.speed = parseFloat(speed.value); if (shader.invalidate) shader.invalidate(); });
  warp.addEventListener("input", function () { shader.params.warp = parseFloat(warp.value); if (shader.invalidate) shader.invalidate(); });
  hue.addEventListener("input", function () { shader.params.hueShift = parseFloat(hue.value); if (shader.invalidate) shader.invalidate(); });
  sens.disabled = true;
  micBtn.addEventListener("click", function () {
    if (window.SoleAudio.active) {
      window.SoleAudio.stop(); shader.params.audio = 0; document.documentElement.style.setProperty("--lvl", "0");
      sens.disabled = true; micBtn.textContent = "Ativar microfone"; note.textContent = "Microfone desligado. Nenhum áudio foi gravado."; return;
    }
    micBtn.disabled = true; note.textContent = "Aguardando autorização do navegador...";
    window.SoleAudio.start().then(function () {
      sens.disabled = false; micBtn.textContent = "Desativar microfone"; note.textContent = "Microfone ativo. O nível de som é processado localmente e não é gravado.";
    }).catch(function () { note.textContent = "Não foi possível acessar o microfone. Verifique a permissão do navegador e tente novamente."; })
      .finally(function () { micBtn.disabled = false; });
  });
  var micWasActive = false;
  window.setInterval(function () {
    if (window.SoleAudio.active) { shader.params.audio = window.SoleAudio.read(parseFloat(sens.value)); document.documentElement.style.setProperty("--lvl", shader.params.audio.toFixed(3)); }
    if (window.SoleAudio.active) micWasActive = true;
    else if (micWasActive) {
      micWasActive = false; shader.params.audio = 0; sens.disabled = true;
      micBtn.textContent = "Ativar microfone"; note.textContent = "Microfone desligado. Nenhum áudio foi gravado.";
    }
  }, 50);
  window.addEventListener("pagehide", function () { window.SoleAudio.stop(); });

  var defaults = { speed: shader.params.speed, warp: 0.6, hue: 0, sensitivity: 1.8 };
  document.getElementById("c-reset").addEventListener("click", function () {
    if (window.SoleAudio.active) window.SoleAudio.stop();
    shader.params.audio = 0; document.documentElement.style.setProperty("--lvl", "0");
    sens.disabled = true; micBtn.textContent = "Ativar microfone";
    speed.value = defaults.speed; warp.value = defaults.warp; hue.value = defaults.hue; sens.value = defaults.sensitivity;
    shader.params.speed = defaults.speed; shader.params.warp = defaults.warp; shader.params.hueShift = defaults.hue;
    outputs.forEach(function (pair) { updateOutput(pair[0], pair[1]); }); note.textContent = "Ajustes restaurados. Microfone desligado.";
    if (shader.invalidate) shader.invalidate();
  });
  var bareButton = document.getElementById("c-bare");
  function restoreInterface() { document.body.classList.remove("bare"); bareButton.setAttribute("aria-pressed", "false"); bareButton.textContent = "Modo ambiente"; bareButton.focus(); }
  bareButton.addEventListener("click", function () {
    var on = document.body.classList.toggle("bare"); bareButton.setAttribute("aria-pressed", String(on)); bareButton.textContent = on ? "Mostrar portfólio" : "Modo ambiente";
  });

  var dialog = document.getElementById("lb"), dialogImage = dialog.querySelector("img"), dialogCaption = dialog.querySelector("p");
  var closeDialog = dialog.querySelector(".lb-close"), returnFocus = null;
  function openLightbox(filename, alt, caption) {
    returnFocus = document.activeElement; dialogImage.src = "img/" + filename; dialogImage.alt = alt; dialogCaption.textContent = caption;
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", ""); closeDialog.focus();
  }
  closeDialog.addEventListener("click", function () { if (dialog.close) dialog.close(); else dialog.removeAttribute("open"); });
  dialog.addEventListener("click", function (event) { if (event.target === dialog && dialog.close) dialog.close(); });
  dialog.addEventListener("keydown", function (event) {
    if (dialog.showModal || !dialog.hasAttribute("open")) return;
    if (event.key === "Escape") { dialog.removeAttribute("open"); if (returnFocus) returnFocus.focus(); return; }
    if (event.key !== "Tab") return;
    var focusable = dialog.querySelectorAll("button, a[href], input, [tabindex]");
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { last.focus(); event.preventDefault(); }
    else if (!event.shiftKey && document.activeElement === last) { first.focus(); event.preventDefault(); }
  });
  dialog.addEventListener("close", function () { if (returnFocus && returnFocus.focus) returnFocus.focus(); });

  document.getElementById("logo-sole").addEventListener("click", function () { goToId("bio"); });
  document.getElementById("nav-bio").addEventListener("click", function () { goToId("bio"); });
  document.getElementById("nav-contact").addEventListener("click", function () { goToId("contato"); });
  document.getElementById("nav-work").addEventListener("click", function () {
    filterEl.value = "works"; searchEl.value = ""; rebuildRail();
    var featured = visible.length ? visible[0] : -1; if (featured >= 0) go(featured, false, true);
  });
  document.getElementById("logo-v").addEventListener("click", function () { goToId("v1su4rt"); });

  var view = document.getElementById("c-view");
  function applyView() {
    var mode = view.value, width = window.innerWidth;
    var chosen = mode === "auto" ? (width < 700 ? "mobile" : (width < 1100 ? "tablet" : "desktop")) : mode;
    document.body.classList.remove("v-desktop", "v-tablet", "v-mobile", "framed"); document.body.classList.add("v-" + chosen);
    if (mode !== "auto" && ((chosen === "mobile" && width > 460) || (chosen === "tablet" && width > 860))) document.body.classList.add("framed");
  }
  view.addEventListener("change", applyView); window.addEventListener("resize", applyView); applyView();

  rebuildRail();
  if (location.hash && !readHash()) go(visible[0], true, true);
})();
