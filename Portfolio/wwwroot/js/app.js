(function () {
  "use strict";
  var projects = window.PROJECTS || [];
  if (!projects.length) return;
  var shader = window.createShader(document.getElementById("gl"));
  var railEl = document.getElementById("rail");
  var stageEl = document.getElementById("stage");
  var filterEl = document.getElementById("c-category");
  var railViewToggle = document.getElementById("rail-view-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var mobileMenuPanel = document.getElementById("mobile-menu-panel");
  var mainNavEl = document.querySelector(".main-nav");
  var headActionsEl = document.querySelector(".head-actions");
  var railContainer = railEl.parentNode;
  var appEl = document.getElementById("app");
  var mobileMenuSummary = mobileMenu.querySelector("summary");
  var mobileMenuState = document.getElementById("mobile-menu-state");
  var mobileTopicTabs = document.getElementById("mobile-topic-tabs");
  var desktopTopicPanel = document.getElementById("desktop-topic-panel");
  var topicFilter = document.getElementById("desktop-topic-filter");
  var brandEl = document.querySelector(".brand");
  var nativeDetails = "open" in document.createElement("details");
  // Browsers without <details> get a scripted open property so CSS [open] rules and JS keep working.
  function shimDetails(detailsEl, summaryEl) {
    if (nativeDetails || !detailsEl || !summaryEl) return;
    detailsEl.classList.add("fallback");
    summaryEl.setAttribute("role", "button");
    summaryEl.setAttribute("tabindex", "0");
    summaryEl.setAttribute("aria-expanded", "false");
    var toggle = function (value) {
      detailsEl.classList.toggle("is-open", value);
      if (value) detailsEl.setAttribute("open", "");
      else detailsEl.removeAttribute("open");
      summaryEl.setAttribute("aria-expanded", String(value));
    };
    try {
      Object.defineProperty(detailsEl, "open", {
        configurable: true,
        get: function () { return detailsEl.classList.contains("is-open"); },
        set: function (value) { toggle(!!value); }
      });
    } catch (_) {}
    summaryEl.addEventListener("click", function (event) { event.preventDefault(); toggle(!detailsEl.classList.contains("is-open")); });
    summaryEl.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle(!detailsEl.classList.contains("is-open"));
    });
  }
  if (!nativeDetails) document.body.classList.add("no-details");
  shimDetails(mobileMenu, mobileMenuSummary);
  if (!nativeDetails) mobileMenu.classList.add("mobile-menu-fallback");
  function isMobileMenuOpen() { return mobileMenu.open === undefined ? mobileMenu.hasAttribute("open") : !!mobileMenu.open; }
  function setMobileMenuOpen(open) { mobileMenu.open = open; }
  shimDetails(topicFilter, topicFilter.querySelector("summary"));
  var deferInitialSelection = false;
  function syncMobileMenu(isMobile) {
    if (isMobile) {
      // On small screens, keep navigation and project browsing ahead of visual controls.
      [mainNavEl, railContainer, headActionsEl].forEach(function (element) {
        if (element.parentNode !== mobileMenuPanel) mobileMenuPanel.appendChild(element);
      });
      return;
    }
    if (mainNavEl.parentNode === mobileMenuPanel) brandEl.appendChild(mainNavEl);
    if (headActionsEl.parentNode === mobileMenuPanel) brandEl.appendChild(headActionsEl);
    if (railContainer.parentNode === mobileMenuPanel) appEl.insertBefore(railContainer, stageEl);
    setMobileMenuOpen(false);
  }
  mobileMenuPanel.addEventListener("click", function (event) {
    var target = event.target;
    while (target && target !== mobileMenuPanel) {
      if (matchesSelector(target, ".node, .nav-link")) {
        window.setTimeout(function () {
          setMobileMenuOpen(false);
          mobileMenuSummary.focus();
        }, 0);
        return;
      }
      target = target.parentNode;
    }
  });
  railViewToggle.addEventListener("click", function () {
    var listView = railEl.parentNode.classList.toggle("list-view");
    railViewToggle.setAttribute("aria-pressed", String(listView));
    railViewToggle.textContent = listView ? "Ver cronologia em faixa" : "Ver cronologia em lista";
  });
  // No celular o painel é longo: o alternador fica no topo da lista para encurtar o caminho até a faixa.
  railEl.parentNode.insertBefore(railViewToggle, railEl);
  var searchEl = document.getElementById("c-search");
  var countEl = document.getElementById("browse-count");
  var statusEl = document.getElementById("app-status");
  var lastObservedHash = null;
  var effectEl = document.getElementById("c-effect");
  var desktopPage = null;
  function wantsReducedMotion() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function clockNow() { return window.performance && window.performance.now ? window.performance.now() : Date.now(); }
  var current = -1;
  var visible = [];
  var renderVersion = 0;
  var topics = [
    { key: "all", label: "Tudo", cats: null },
    { key: "works", label: "Trabalhos", cats: ["works"] },
    { key: "research", label: "Pesquisa", cats: ["research"] },
    { key: "collective", label: "Coletivos", cats: ["collective"] },
    { key: "workshop", label: "Oficinas", cats: ["workshop"] },
    { key: "interactive", label: "Interativos", cats: ["interactive"] },
    { key: "apps", label: "Apps", cats: ["apps"] },
    { key: "education", label: "Formação", cats: ["education"] },
    { key: "profile", label: "Perfil", cats: ["profile", "info"] }
  ];
  var categories = {};
  topics.forEach(function (topic) { categories[topic.key] = topic.cats; });
  function topicByKey(key) {
    for (var i = 0; i < topics.length; i++) if (topics[i].key === key) return topics[i];
    return null;
  }
  var timelineGroups = {
    featured: "Mestrado em destaque",
    research: "Pesquisa em andamento",
    dated: "Cronologia",
    ongoing: "Atuação contínua",
    development: "Em desenvolvimento",
    experiments: "Experimentos e dispositivos",
    undated: "Séries e conteúdos sem data",
    profile: "Perfil e links"
  };
  var knownIds = Object.create(null);
  var knownCategories = Object.create(null);
  topics.forEach(function (topic) {
    (topic.cats || []).forEach(function (name) { knownCategories[name] = true; });
  });
  projects.forEach(function (project) {
    if (knownIds[project.id]) console.error("ID de projeto repetido:", project.id);
    knownIds[project.id] = true;
    if (!knownCategories[project.category]) console.error("Categoria de projeto sem tema correspondente:", project.id, project.category);
  });
  projects.forEach(function (project) {
    if (!project.id || !project.title || !project.category) console.warn("Registro sem id, título ou categoria:", project);
    (project.jump || []).forEach(function (link) {
      if (!link.target || !knownIds[link.target]) console.warn("Destino de navegação inválido:", project.id, link);
    });
    (project.links || []).forEach(function (link) {
      if (!link.url || !/^(https?:|mailto:|tel:)/i.test(link.url)) console.warn("Link inválido:", project.id, link);
    });
    (project.images || []).forEach(function (image) {
      if (!image.src || /[\\/]/.test(image.src)) console.warn("Arquivo de imagem inválido:", project.id, image);
    });
  });
  function validateMenuTargets() {
    var refs = document.querySelectorAll("[data-project-id]");
    for (var i = 0; i < refs.length; i++) {
      var id = refs[i].getAttribute("data-project-id");
      if (!knownIds[id]) console.error("Menu aponta para conteúdo inexistente:", id);
    }
  }

  function projectIndexById(id) {
    for (var i = 0; i < projects.length; i++) if (projects[i].id === id) return i;
    return -1;
  }
  function matches(p) {
    if (p.mobileOnly && !document.body.classList.contains("v-mobile")) return false;
    var allowed = categories[filterEl.value];
    if (allowed && allowed.indexOf(p.category) < 0) return false;
    var q = searchEl.value.trim().toLocaleLowerCase("pt-BR");
    if (!q) return true;
    var text = [p.title, p.subtitle, p.text, p.when, p.kind, p.role, p.collaborators, p.location,
      (p.tags || []).join(" "), (p.specs || []).map(function (pair) { return pair.label + " " + pair.value; }).join(" "),
      (p.links || []).map(function (link) { return [link.label, link.text, link.url].join(" "); }).join(" ")]
      .join(" ").toLocaleLowerCase("pt-BR");
    return text.indexOf(q) >= 0;
  }
  function make(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  // Fallbacks for older Android DOM implementations.
  function appendChildren(parent) {
    for (var i = 1; i < arguments.length; i++) parent.appendChild(arguments[i]);
  }
  function replaceContent(parent, child) {
    while (parent.firstChild) parent.removeChild(parent.firstChild);
    if (child) parent.appendChild(child);
  }
  function matchesSelector(element, selector) {
    if (!element || element.nodeType !== 1) return false;
    var method = element.matches || element.msMatchesSelector || element.webkitMatchesSelector;
    if (method) return method.call(element, selector);
    var found = document.querySelectorAll(selector);
    for (var i = 0; i < found.length; i++) if (found[i] === element) return true;
    return false;
  }
  function isControlTarget(element) {
    while (element && element !== document) {
      if (matchesSelector(element, "button, a, input, select, summary, dialog")) return true;
      element = element.parentNode;
    }
    return false;
  }
  function visibleProjects() {
    var onMobile = document.body.classList.contains("v-mobile");
    var list = [];
    projects.forEach(function (p) { if (!p.mobileOnly || onMobile) list.push(p); });
    return list;
  }
  function topicCount(topic) {
    var total = 0;
    visibleProjects().forEach(function (p) {
      if (topic.cats && topic.cats.indexOf(p.category) < 0) return;
      total++;
    });
    return total;
  }
  function topicText(topic) { return topic.label + " (" + topicCount(topic) + ")"; }
  function makeTopicButton(attribute, topic) {
    var button = make("button", null, topicText(topic));
    button.type = "button";
    button.setAttribute(attribute, topic.key);
    button.setAttribute("aria-pressed", String(topic.key === (filterEl.value || "all")));
    button.addEventListener("click", function () { chooseTopic(topic.key, attribute === "data-topic"); });
    return button;
  }
  function buildTopicControls() {
    mobileTopicTabs.textContent = "";
    desktopTopicPanel.textContent = "";
    filterEl.textContent = "";
    topics.forEach(function (topic) {
      mobileTopicTabs.appendChild(makeTopicButton("data-mobile-topic", topic));
      desktopTopicPanel.appendChild(makeTopicButton("data-topic", topic));
      var option = make("option", null, topicText(topic));
      option.value = topic.key;
      filterEl.appendChild(option);
    });
  }
  function refreshTopicCounts() {
    var chips = mobileTopicTabs.querySelectorAll("[data-mobile-topic]");
    var panelButtons = desktopTopicPanel.querySelectorAll("[data-topic]");
    for (var i = 0; i < topics.length; i++) {
      var text = topicText(topics[i]);
      if (chips[i]) chips[i].textContent = text;
      if (panelButtons[i]) panelButtons[i].textContent = text;
      if (filterEl.options[i]) filterEl.options[i].textContent = text;
    }
  }
  function updateBrowseCount() {
    var total = visibleProjects().length;
    var hidden = projects.length - total;
    var text = visible.length === total
      ? total + (total === 1 ? " conteúdo" : " conteúdos")
      : visible.length + " de " + total + " conteúdos";
    var topic = topicByKey(filterEl.value);
    if (topic && topic.key !== "all") text += " · " + topic.label;
    var query = searchEl.value.trim();
    if (query) text += " · busca: " + query;
    if (hidden) text += " · " + hidden + (hidden === 1 ? " conteúdo só no celular" : " conteúdos só no celular");
    countEl.textContent = text;
  }
  function rebuildRail() {
    var focused = document.activeElement && matchesSelector(document.activeElement, "li[data-project-index] .node")
      ? document.activeElement.parentNode.getAttribute("data-project-index") : null;
    visible = [];
    railEl.textContent = "";
    var emittedGroups = {};
    projects.forEach(function (p, i) {
      if (!matches(p)) return;
      var group = p.timelineGroup || "undated";
      if (!emittedGroups[group]) {
        emittedGroups[group] = true;
        var heading = make("li", "rail-section");
        heading.setAttribute("role", "presentation");
        heading.appendChild(make("h2", null, timelineGroups[group] || timelineGroups.undated));
        railEl.appendChild(heading);
      }
      visible.push(i);
      var li = make("li", [p.sub ? "sub" : "", p.featured ? "featured" : ""].filter(Boolean).join(" "));
      li.setAttribute("data-project-index", String(i));
      var btn = make("button", "node");
      btn.type = "button";
      btn.setAttribute("aria-label", [p.title, p.when, p.featured ? "Em destaque" : ""].filter(Boolean).join(", "));
      var dot = make("span", "dot"); dot.setAttribute("aria-hidden", "true");
      var when = make("span", "when", p.when || "");
      var name = make("span", "name", p.title || "Sem título");
      appendChildren(btn, dot, name, when);
      btn.addEventListener("click", function () { go(i); });
      li.appendChild(btn);
      railEl.appendChild(li);
    });
    updateBrowseCount();
    if (current >= 0 && visible.indexOf(current) < 0) current = -1;
    if (visible.length && current < 0 && !deferInitialSelection) go(visible[0], true, false);
    if (!visible.length) showEmpty();
    else updateRailState();
    if (focused !== null) {
      var restored = railEl.querySelector('li[data-project-index="' + focused + '"] .node');
      if (restored) restored.focus();
    }
    updateDesktopNavigation();
  }
  function updateRailState() {
    var items = railEl.querySelectorAll("li[data-project-index]");
    for (var j = 0; j < items.length; j++) {
      var index = Number(items[j].getAttribute("data-project-index"));
      var button = items[j].querySelector(".node");
      if (index === current) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  }
  function addLinks(card, links) {
    if (!links || !links.length) return;
    var list = make("ul", "links");
    links.forEach(function (link) {
      var label = link.label;
      var value = link.text;
      var url = link.url;
      var copyEnabled = link.copy === true;
      if (!url || !/^(https?:|mailto:|tel:)/i.test(url)) return;
      var li = make("li");
      var a = document.createElement("a");
      a.href = url;
      var external = /^https?:/i.test(url);
      if (external) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      appendChildren(a, make("span", "k", label), make("span", "v", value), make("span", "go", external ? "Abrir em nova aba ↗" : "Abrir ↗"));
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
  function copyText(value, button, what) {
    var label = what || "contato";
    function success() {
      button.textContent = label.charAt(0).toUpperCase() + label.slice(1) + " copiado";
      button.setAttribute("aria-label", label.charAt(0).toUpperCase() + label.slice(1) + " copiado");
      window.setTimeout(function () { button.textContent = "Copiar"; button.setAttribute("aria-label", "Copiar " + label); }, 1800);
    }
    function fallback() {
      var field = make("textarea"); field.value = value; field.setAttribute("readonly", "");
      field.style.position = "fixed"; field.style.opacity = "0"; document.body.appendChild(field); field.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
      field.remove();
      if (ok) success(); else { button.textContent = "Não foi possível copiar"; button.setAttribute("aria-label", "Não foi possível copiar; selecione o contato no link ao lado"); }
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(value).then(success, fallback);
    else fallback();
  }
  function addSupport(card, support) {
    if (!support) return;
    var box = make("section", "support");
    // Ficha própria de Apoio: o título e o texto podem vir do registro (support.title/text) ou do cabeçalho da ficha.
    if (support.title) {
      var title = make("h2", "support-title", support.title); title.id = "support-title";
      box.setAttribute("aria-labelledby", "support-title");
      box.appendChild(title);
    }
    if (support.text) box.appendChild(make("p", "support-text", support.text));
    var body = make("div", "support-body");
    var img = document.createElement("img");
    img.src = "img/" + support.qr; img.alt = support.alt; img.decoding = "async";
    img.width = support.qrWidth; img.height = support.qrHeight;
    var key = make("div", "support-key");
    appendChildren(key, make("span", "k", support.keyLabel), make("code", null, support.key));
    var copy = make("button", "btn ghost copy-button", "Copiar"); copy.type = "button";
    copy.setAttribute("aria-label", "Copiar " + support.keyLabel.toLowerCase());
    copy.addEventListener("click", function () { copyText(support.copy, copy, "chave pix"); });
    key.appendChild(copy);
    appendChildren(body, img, key);
    box.appendChild(body);
    card.appendChild(box);
  }
  function addImages(card, images, projectTitle) {
    if (!images || !images.length) return;
    var gallery = make("ul", "gallery");
    images.forEach(function (item) {
      var filename = item.src;
      var caption = item.caption === undefined ? projectTitle : item.caption;
      var alt = item.alt || caption || projectTitle;
      if (!filename || /[\\/]/.test(filename)) return;
      var li = make("li"), button = make("button", "thumb"), picture = document.createElement("picture");
      button.type = "button"; button.setAttribute("aria-label", "Ampliar imagem: " + alt);
      button.addEventListener("click", function () { openLightbox(filename, alt, caption); });
      var img = document.createElement("img"); img.src = "img/" + filename; img.alt = alt; img.loading = "lazy"; img.decoding = "async";
      if (item.responsiveWidths && item.responsiveWidths.length) {
        var source = document.createElement("source");
        source.type = "image/webp";
        source.srcset = item.responsiveWidths.map(function (width) {
          return "img/responsive/" + filename.replace(/\.[^.]+$/, "") + "-" + width + ".webp " + width + "w";
        }).join(", ");
        source.sizes = "(max-width: 699px) 48vw, (max-width: 1100px) 32vw, 280px";
        picture.appendChild(source);
        img.sizes = source.sizes;
      }
      if (item.width && item.height) { img.width = item.width; img.height = item.height; }
      img.addEventListener("error", function () { li.classList.add("image-unavailable"); button.disabled = true; });
      picture.appendChild(img); button.appendChild(picture); li.appendChild(button);
      if (caption) li.appendChild(make("span", "cap", item.credit ? caption + " · Crédito: " + item.credit : caption));
      gallery.appendChild(li);
    });
    card.appendChild(gallery);
  }
  function render(index) {
    var p = projects[index];
    var card = make("article", "card");
    card.setAttribute("aria-labelledby", "project-title");
    var head = make("div", "card-heading");
    if (p.id === "bio") head.appendChild(make("p", "eyebrow mobile-only", "Minibio"));
    appendChildren(head, make("p", "eyebrow", [p.featured ? "Em destaque" : "", p.kind, p.when].filter(Boolean).join(" · ")), make("h1", null, p.title || "Projeto"));
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
      meta.forEach(function (pair) { appendChildren(details, make("dt", null, pair[0]), make("dd", null, pair[1])); });
      card.appendChild(details);
    }
    if (p.specs && p.specs.length) {
      var specs = make("dl", "specs");
      p.specs.forEach(function (pair) { appendChildren(specs, make("dt", null, pair.label), make("dd", null, pair.value)); });
      card.appendChild(specs);
    }
    addLinks(card, p.links);
    addImages(card, p.images, p.title);
    addSupport(card, p.support);
    var actions = make("div", "actions");
    (p.jump || []).forEach(function (item) {
      if (projectIndexById(item.target) < 0) return;
      var jump = make("button", "btn ghost", item.label); jump.type = "button";
      jump.addEventListener("click", function () { goToId(item.target); }); actions.appendChild(jump);
    });
    var pulse = make("button", "btn", "Pulso visual"); pulse.type = "button";
    pulse.setAttribute("aria-label", "Criar um pulso visual no ambiente");
    pulse.addEventListener("click", function () { shader.pulse(); }); actions.appendChild(pulse);
    var position = visible.indexOf(index);
    var prev = make("button", "btn ghost", "Anterior"); prev.type = "button"; prev.disabled = position <= 0;
    prev.addEventListener("click", function () { if (position > 0) go(visible[position - 1]); });
    var next = make("button", "btn ghost", "Próximo"); next.type = "button"; next.disabled = position < 0 || position >= visible.length - 1;
    next.addEventListener("click", function () { if (position >= 0 && position < visible.length - 1) go(visible[position + 1]); });
    appendChildren(actions, prev, next); card.appendChild(actions);
    return card;
  }
  function showEmpty() {
    var card = make("section", "card empty-state");
    appendChildren(card, make("p", "eyebrow", "Busca"), make("h1", null, "Não encontrei resultados"), make("p", "text", "Tente outra palavra ou limpe os filtros para ver mais trabalhos."));
    var clear = make("button", "btn", "Limpar busca e filtros"); clear.type = "button";
    clear.addEventListener("click", function () { filterEl.value = "all"; searchEl.value = ""; rebuildFromControls(); }); card.appendChild(clear);
    replaceContent(stageEl, card);
  }
  function go(index, fromHistory, force) {
    if (index < 0 || index >= projects.length) return;
    if (visible.indexOf(index) < 0 && !force) return;
    if (index === current && !force && !desktopPage) return;
    desktopPage = null;
    updateDesktopNavigation();
    var p = projects[index];
    current = index; updateRailState();
    var active = railEl.querySelector('li[data-project-index="' + index + '"] .node');
    if (active && active.scrollIntoView) {
      try { active.scrollIntoView({ block: "nearest", inline: "nearest", behavior: wantsReducedMotion() ? "auto" : "smooth" }); }
      catch (_) { active.scrollIntoView(false); }
    }
    var effectMode = effectEl.value === "auto" ? (isFinite(p.mode) ? p.mode : 1) : parseInt(effectEl.value, 10);
    shader.setTarget(isFinite(effectMode) ? effectMode : 1, p.hue || 0); shader.pulse();
    var version = ++renderVersion;
    var old = stageEl.firstElementChild;
    var show = function () {
      if (version !== renderVersion) return;
      replaceContent(stageEl, render(index)); stageEl.scrollTop = 0;
    };
    if (old) { old.classList.add("swap"); window.setTimeout(show, 150); } else show();
    if (!fromHistory && location.hash !== "#" + p.id) history.pushState({ projectId: p.id }, "", "#" + p.id);
    lastObservedHash = location.hash;
  }
  function goToId(id) {
    var index = projectIndexById(id);
    if (index < 0) return;
    var p = projects[index];
    if (!matches(p)) { filterEl.value = "all"; searchEl.value = ""; current = index; rebuildRail(); }
    go(index, false, true);
  }
  function readHash() {
    var hash = location.hash;
    if (hash === lastObservedHash) return true;
    lastObservedHash = hash;
    if (hash === "#servicos") return showDesktopPage("services", true);
    if (hash === "#pesquisa") return showDesktopPage("research", true);
    var index = projectIndexById(hash.slice(1));
    if (index < 0) {
      if (hash) {
        statusEl.textContent = "Esse endereço não corresponde a um conteúdo. Apresentação inicial aberta.";
        history.replaceState(null, "", location.pathname + location.search);
        lastObservedHash = "";
      }
      filterEl.value = "all"; searchEl.value = "";
      var home = projectIndexById("bio");
      if (home >= 0) current = home;
      rebuildRail();
      if (home >= 0) go(home, true, true);
      return home >= 0;
    }
    var p = projects[index];
    if (!matches(p)) { filterEl.value = "all"; searchEl.value = ""; current = index; rebuildRail(); }
    go(index, true, true); return true;
  }
  function rebuildFromControls() {
    rebuildRail();
    var desktopTopicButtons = document.querySelectorAll(".desktop-topic-panel [data-topic]");
    for (var topicIndex = 0; topicIndex < desktopTopicButtons.length; topicIndex++) {
      desktopTopicButtons[topicIndex].setAttribute("aria-pressed", String(desktopTopicButtons[topicIndex].getAttribute("data-topic") === filterEl.value));
    }
    var mobileTopicButtons = document.querySelectorAll(".mobile-topic-tabs [data-mobile-topic]");
    for (var mobileTopicIndex = 0; mobileTopicIndex < mobileTopicButtons.length; mobileTopicIndex++) {
      mobileTopicButtons[mobileTopicIndex].setAttribute("aria-pressed", String(mobileTopicButtons[mobileTopicIndex].getAttribute("data-mobile-topic") === filterEl.value));
    }
    syncMobileMenuState();
    if (current >= 0) {
      var selectedHash = "#" + projects[current].id;
      if (location.hash !== selectedHash) history.replaceState({ projectId: projects[current].id }, "", selectedHash);
      lastObservedHash = selectedHash;
    } else if (desktopPage) {
      var editorialHash = "#" + (desktopPage === "services" ? "servicos" : "pesquisa");
      if (location.hash !== editorialHash) history.replaceState({ editorialPage: desktopPage }, "", editorialHash);
      lastObservedHash = editorialHash;
    } else if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
      lastObservedHash = "";
    }
  }
  function syncMobileMenuState() {
    if (!mobileMenuState) return;
    var topic = topicByKey(filterEl.value);
    var query = searchEl.value.trim();
    mobileMenuState.textContent = topic && topic.key !== "all" ? " · " + topic.label : (query ? " · busca" : "");
  }
  function updateDesktopNavigation() {
    var active = desktopPage === "services" ? "services"
      : (desktopPage === "research" ? "research"
      : (current >= 0 && projects[current] ? "projects" : ""));
    var links = document.querySelectorAll(".desktop-nav [data-desktop-section]");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-desktop-section") === active) links[i].setAttribute("aria-current", "page");
      else links[i].removeAttribute("aria-current");
    }
    var activeId = current >= 0 && projects[current] ? projects[current].id : null;
    var refs = document.querySelectorAll("[data-project-id], [data-editorial-page]");
    for (var r = 0; r < refs.length; r++) {
      var projectId = refs[r].getAttribute("data-project-id");
      var editorial = refs[r].getAttribute("data-editorial-page");
      if ((projectId && projectId === activeId) || (editorial && editorial === desktopPage)) refs[r].setAttribute("aria-current", "page");
      else refs[r].removeAttribute("aria-current");
    }
  }
  function renderDesktopEditorial(key) {
    var card = make("article", "card desktop-editorial-card");
    card.setAttribute("aria-labelledby", "desktop-editorial-title");
    if (key === "research") {
      var research = projects[projectIndexById("pesquisa-arte-interativa")];
      var experimentRecord = projects[projectIndexById("v1su4rt")];
      if (!research || !experimentRecord) return card;
      appendChildren(card,
        make("p", "eyebrow", research.kind),
        make("h1", null, research.title),
        make("p", "subtitle", research.subtitle),
        make("p", "text", research.text));
      card.querySelector("h1").id = "desktop-editorial-title";
      card.appendChild(make("p", "research-status", "Esta pesquisa está em andamento. Os registros visuais serão incluídos quando estiverem prontos."));
      var experiment = make("section", "research-experiment");
      experiment.setAttribute("aria-labelledby", "research-experiment-title");
      experiment.appendChild(make("p", "eyebrow", [experimentRecord.kind, experimentRecord.when].join(" · ")));
      var experimentTitle = make("h2", null, experimentRecord.title);
      experimentTitle.id = "research-experiment-title";
      experiment.appendChild(experimentTitle);
      experiment.appendChild(make("p", "text", experimentRecord.text));
      var experimentLink = make("button", "btn ghost", "Ver registro do experimento");
      experimentLink.type = "button";
      experimentLink.addEventListener("click", function () { goToId(experimentRecord.id); });
      experiment.appendChild(experimentLink);
      card.appendChild(experiment);
      return card;
    }
    appendChildren(card,
      make("p", "eyebrow", "Trabalho · contratação"),
      make("h1", null, "Serviços"),
      make("p", "subtitle", "Atuação em projetos artísticos e culturais."),
      make("p", "text", "Entre em contato para conversar sobre o projeto, seu contexto e os próximos passos."));
    card.querySelector("h1").id = "desktop-editorial-title";
    var list = window.SERVICES || [];
    var grid = make("div", "service-grid");
    grid.setAttribute("aria-label", "Serviços oferecidos");
    for (var s = 0; s < list.length; s++) {
      var item = make("section", "service-item");
      item.id = "service-" + list[s].id;
      item.appendChild(make("h2", null, list[s].label));
      item.appendChild(make("p", null, "Conte um pouco sobre o projeto e o que você precisa nesta área."));
      grid.appendChild(item);
    }
    card.appendChild(grid);
    var action = make("div", "actions");
    var contact = make("button", "btn", "Conversar sobre um projeto");
    contact.type = "button";
    contact.addEventListener("click", function () { goToId("contato"); });
    action.appendChild(contact);
    card.appendChild(action);
    return card;
  }
  function showDesktopPage(key, fromHistory) {
    if (["services", "research"].indexOf(key) < 0) return false;
    desktopPage = key;
    current = -1;
    updateRailState();
    renderVersion++;
    replaceContent(stageEl, renderDesktopEditorial(key));
    stageEl.scrollTop = 0;
    updateDesktopNavigation();
    closeDesktopMenus();
    if (!fromHistory) {
      var editorialHash = key === "services" ? "#servicos" : "#pesquisa";
      if (location.hash !== editorialHash) history.pushState({ editorialPage: key }, "", editorialHash);
      lastObservedHash = location.hash;
    }
    return true;
  }
  function closeDesktopMenus(except) {
    var menus = document.querySelectorAll("[data-desktop-menu]");
    for (var i = 0; i < menus.length; i++) {
      if (menus[i] === except) continue;
      var trigger = menus[i].querySelector(".desktop-nav-trigger");
      var panel = trigger && document.getElementById(trigger.getAttribute("aria-controls"));
      menus[i].classList.remove("is-open");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
      menus[i].removeAttribute("data-open-source");
      if (menus[i]._closeTimer) { window.clearTimeout(menus[i]._closeTimer); menus[i]._closeTimer = 0; }
    }
  }
  function setDesktopMenuOpen(menu, open, source) {
    if (!menu) return;
    var trigger = menu.querySelector(".desktop-nav-trigger");
    var panel = trigger && document.getElementById(trigger.getAttribute("aria-controls"));
    if (!trigger || !panel) return;
    if (menu._closeTimer) { window.clearTimeout(menu._closeTimer); menu._closeTimer = 0; }
    if (open) closeDesktopMenus(menu);
    menu.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    if (open && source) menu.setAttribute("data-open-source", source);
    if (!open) menu.removeAttribute("data-open-source");
  }
  function buildDesktopMenus() {
    var projectsPanel = document.getElementById("desktop-projects-panel");
    if (projectsPanel) {
      projectsPanel.textContent = "";
      var all = make("button", "desktop-menu-link", "Ver cronologia completa");
      all.type = "button";
      all.setAttribute("data-desktop-action", "all-projects");
      var divider = make("span", "desktop-menu-divider");
      divider.setAttribute("role", "presentation");
      appendChildren(projectsPanel, all, divider);
      var lastGroup = null;
      projects.forEach(function (p) {
        if (!p.menu) return;
        var group = p.timelineGroup || "undated";
        if (group !== lastGroup) {
          lastGroup = group;
          projectsPanel.appendChild(make("span", "desktop-menu-group", timelineGroups[group] || timelineGroups.undated));
        }
        var item = make("button", "desktop-menu-link", p.title);
        item.type = "button";
        item.setAttribute("data-project-id", p.id);
        projectsPanel.appendChild(item);
      });
    }
    var servicesPanel = document.getElementById("desktop-services-panel");
    if (servicesPanel) {
      servicesPanel.textContent = "";
      (window.SERVICES || []).forEach(function (service) {
        var item = make("button", "desktop-menu-link", service.label);
        item.type = "button";
        item.setAttribute("data-service-target", service.id);
        servicesPanel.appendChild(item);
      });
    }
  }
  buildDesktopMenus();
  var desktopMenus = document.querySelectorAll("[data-desktop-menu]");
  for (var dm = 0; dm < desktopMenus.length; dm++) (function (menu) {
    var trigger = menu.querySelector(".desktop-nav-trigger");
    var panel = trigger && document.getElementById(trigger.getAttribute("aria-controls"));
    if (!trigger || !panel) return;
    menu.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse" && window.matchMedia && window.matchMedia("(min-width: 1100px) and (hover: hover) and (pointer: fine)").matches) {
        menu._openTimer = window.setTimeout(function () { setDesktopMenuOpen(menu, true, "hover"); }, 90);
      }
    });
    menu.addEventListener("pointerleave", function () {
      if (menu._openTimer) { window.clearTimeout(menu._openTimer); menu._openTimer = 0; }
      menu._closeTimer = window.setTimeout(function () {
        if (!menu.contains(document.activeElement) && menu.getAttribute("data-open-source") !== "click") setDesktopMenuOpen(menu, false);
      }, 320);
    });
    menu.addEventListener("focusin", function () { setDesktopMenuOpen(menu, true, "focus"); });
    menu.addEventListener("focusout", function (event) {
      if (!menu.contains(event.relatedTarget)) setDesktopMenuOpen(menu, false);
    });
    trigger.addEventListener("click", function () {
      var open = trigger.getAttribute("aria-expanded") === "true";
      if (open && menu.getAttribute("data-open-source") === "hover") { menu.setAttribute("data-open-source", "click"); return; }
      setDesktopMenuOpen(menu, !open, "click");
    });
    panel.addEventListener("click", function (event) {
      var target = event.target;
      while (target && target !== panel) {
        if (target.getAttribute("data-desktop-action") === "all-projects") {
          filterEl.value = "all"; searchEl.value = ""; rebuildFromControls();
          if (visible.length) go(visible[0], false, true);
          closeDesktopMenus(); return;
        }
        var projectId = target.getAttribute("data-project-id");
        if (projectId) { goToId(projectId); closeDesktopMenus(); return; }
        var editorial = target.getAttribute("data-editorial-page");
        if (editorial) { showDesktopPage(editorial, false); return; }
        var serviceTarget = target.getAttribute("data-service-target");
        if (serviceTarget) {
          showDesktopPage("services", false);
          closeDesktopMenus();
          window.setTimeout(function () {
            var section = document.getElementById("service-" + serviceTarget);
            if (section) section.scrollIntoView({ block: "nearest", behavior: wantsReducedMotion() ? "auto" : "smooth" });
          }, 0);
          return;
        }
        target = target.parentNode;
      }
    });
  })(desktopMenus[dm]);
  var desktopNavLinks = document.querySelectorAll(".desktop-nav-link");
  for (var dn = 0; dn < desktopNavLinks.length; dn++) desktopNavLinks[dn].addEventListener("click", function () {
    var id = this.getAttribute("data-project-id");
    if (id) goToId(id);
  });
  document.addEventListener("pointerdown", function (event) {
    if (!event.target.closest || !event.target.closest("[data-desktop-menu]")) closeDesktopMenus();
  }, true);
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var openMenu = document.querySelector("[data-desktop-menu].is-open");
    if (!openMenu) return;
    event.preventDefault();
    var trigger = openMenu.querySelector(".desktop-nav-trigger");
    setDesktopMenuOpen(openMenu, false);
    if (trigger) trigger.focus();
  });
  function chooseTopic(key, fromDesktopPanel) {
    filterEl.value = key;
    searchEl.value = "";
    rebuildFromControls();
    if (fromDesktopPanel) {
      topicFilter.open = false;
      topicFilter.querySelector("summary").focus();
      return;
    }
    var chip = mobileTopicTabs.querySelector('[data-mobile-topic="' + key + '"]');
    if (chip && chip.scrollIntoView) {
      try { chip.scrollIntoView({ block: "nearest", inline: "nearest", behavior: wantsReducedMotion() ? "auto" : "smooth" }); }
      catch (_) { chip.scrollIntoView(false); }
    }
    var firstResult = railEl.querySelector("li[data-project-index] .node");
    if (firstResult && isMobileMenuOpen()) firstResult.focus();
  }
  buildTopicControls();
  validateMenuTargets();
  filterEl.addEventListener("change", rebuildFromControls);
  var searchTimer = 0;
  searchEl.addEventListener("input", function () {
    if (searchTimer) window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(function () { searchTimer = 0; rebuildFromControls(); }, 140);
  });
  window.addEventListener("popstate", readHash);
  window.addEventListener("hashchange", readHash);
  window.addEventListener("keydown", function (event) {
    var tag = event.target && event.target.tagName;
    if (event.key === "Escape" && isMobileMenuOpen()) { setMobileMenuOpen(false); mobileMenuSummary.focus(); return; }
    if (event.key === "Escape" && controls.open) { closeControls(); controlsSummary.focus(); return; }
    if (event.key === "Escape" && document.body.classList.contains("bare")) { restoreInterface(); return; }
    if (document.getElementById("lb").open) return;
    if (["INPUT", "TEXTAREA", "SELECT"].indexOf(tag) >= 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      var pos = visible.indexOf(current); if (pos < visible.length - 1) go(visible[pos + 1]); event.preventDefault();
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      var currentPos = visible.indexOf(current); if (currentPos > 0) go(visible[currentPos - 1]); event.preventDefault();
    }
  });
  var stagePointer = null, lastFallbackTouch = 0;
  function finishStageGesture(pointerId, x, y, target) {
    if (!stagePointer || stagePointer.id !== pointerId) return;
    var start = stagePointer;
    stagePointer = null;
    if (isControlTarget(target) || matchesSelector(target, ".thumb")) return;
    var deltaX = x - start.x, deltaY = y - start.y;
    if (Math.abs(deltaY) > Math.abs(deltaX) * 0.75 || Math.abs(deltaX) < 80) return;
    var position = visible.indexOf(current), next = position + (deltaX < 0 ? 1 : -1);
    if (position >= 0 && next >= 0 && next < visible.length) go(visible[next]);
  }
  if (window.PointerEvent) {
    stageEl.addEventListener("pointerdown", function (event) {
      if (!event.isPrimary || event.button !== 0 || isControlTarget(event.target) || matchesSelector(event.target, ".thumb")) return;
      stagePointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }, { passive: true });
    document.addEventListener("pointerup", function (event) {
      if (stagePointer && stagePointer.id === event.pointerId) {
        if (stageEl.contains(event.target)) finishStageGesture(event.pointerId, event.clientX, event.clientY, event.target);
        else stagePointer = null;
      }
    }, { passive: true });
    document.addEventListener("pointercancel", function (event) { if (stagePointer && stagePointer.id === event.pointerId) stagePointer = null; }, { passive: true });
  } else {
    stageEl.addEventListener("touchstart", function (event) {
      if (event.touches.length !== 1 || isControlTarget(event.target) || matchesSelector(event.target, ".thumb")) { stagePointer = null; return; }
      lastFallbackTouch = Date.now(); stagePointer = { id: "touch", x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });
    stageEl.addEventListener("touchend", function (event) {
      if (!event.changedTouches.length) { stagePointer = null; return; }
      var touch = event.changedTouches[0]; finishStageGesture("touch", touch.clientX, touch.clientY, event.target);
    }, { passive: true });
    stageEl.addEventListener("touchcancel", function () { stagePointer = null; }, { passive: true });
    stageEl.addEventListener("mousedown", function (event) {
      if (Date.now() - lastFallbackTouch < 800 || event.button !== 0 || isControlTarget(event.target)) return;
      stagePointer = { id: "mouse", x: event.clientX, y: event.clientY };
    }, { passive: true });
    document.addEventListener("mouseup", function (event) {
      if (stagePointer && stagePointer.id === "mouse") {
        if (stageEl.contains(event.target)) finishStageGesture("mouse", event.clientX, event.clientY, event.target);
        else stagePointer = null;
      }
    }, { passive: true });
  }

  var speed = document.getElementById("c-speed"), warp = document.getElementById("c-warp"), pigment = document.getElementById("c-pigment");
  var outputs = [[speed, "o-speed"], [warp, "o-warp"], [pigment, "o-pigment"]];
  function updateOutput(input, outputId) { document.getElementById(outputId).value = Number(input.value).toFixed(2); }
  speed.value = shader.params.speed;
  var sliderFrame = null;
  function syncVisualSliders() {
    if (sliderFrame !== null) return;
    var request = window.requestAnimationFrame || function (callback) { return window.setTimeout(callback, 16); };
    sliderFrame = request(function () {
      sliderFrame = null;
      outputs.forEach(function (pair) { updateOutput(pair[0], pair[1]); });
      shader.params.speed = Number(speed.value);
      shader.params.warp = Number(warp.value);
      shader.params.pigment = Number(pigment.value);
      if (shader.invalidate) shader.invalidate();
    });
  }
  outputs.forEach(function (pair) { updateOutput(pair[0], pair[1]); pair[0].addEventListener("input", syncVisualSliders); });
  document.getElementById("c-clear-ink").addEventListener("click", function () { shader.clearStains(); });
  var paintPointer = null, lastPaintX = 0, lastPaintY = 0;
  var stopGhost = function () {};
  function paintStepReached(dx, dy) {
    var reference = Math.max(12, Math.min(window.innerWidth, window.innerHeight) * 0.022);
    return dx * dx + dy * dy >= reference * reference;
  }
  function addTouchStain(x, y, target) {
    if (isControlTarget(target)) return false;
    var activeCanvas = document.getElementById("gl");
    if (!activeCanvas) return false;
    var bounds = activeCanvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return false;
    var relativeX = (x - bounds.left) / bounds.width, relativeY = (y - bounds.top) / bounds.height;
    if (relativeX < 0 || relativeX > 1 || relativeY < 0 || relativeY > 1) return false;
    var reference = Math.max(1, Math.min(bounds.width, bounds.height));
    var start = !paintPointer;
    stopGhost();
    shader.addStain(relativeX, relativeY, start ? 0 : (x - lastPaintX) / reference, start ? 0 : (y - lastPaintY) / reference);
    lastPaintX = x; lastPaintY = y;
    return true;
  }
  function releasePaintPointer(pointerId) {
    if (!paintPointer || paintPointer.id !== pointerId) return;
    paintPointer = null;
    if (shader.releasePointer) shader.releasePointer();
  }
  if (window.PointerEvent) {
    appEl.addEventListener("pointerdown", function (event) {
      if (!event.isPrimary || event.button !== 0 || isControlTarget(event.target)) return;
      if (addTouchStain(event.clientX, event.clientY, event.target)) paintPointer = { id: event.pointerId };
    }, { passive: true });
    document.addEventListener("pointermove", function (event) {
      if (!paintPointer || paintPointer.id !== event.pointerId || !event.isPrimary) return;
      var dx = event.clientX - lastPaintX, dy = event.clientY - lastPaintY;
      if (paintStepReached(dx, dy)) addTouchStain(event.clientX, event.clientY, event.target);
    }, { passive: true });
    document.addEventListener("pointerup", function (event) { releasePaintPointer(event.pointerId); }, { passive: true });
    document.addEventListener("pointercancel", function (event) { releasePaintPointer(event.pointerId); }, { passive: true });
    document.addEventListener("pointerdown", function () { lastInputMethod = "pointer"; }, true);
  } else {
    appEl.addEventListener("touchstart", function (event) {
      if (!event.touches || !event.touches.length) return;
      if (event.touches.length > 1) { releasePaintPointer("touch"); return; }
      lastFallbackTouch = Date.now();
      paintPointer = { id: "touch" };
      addTouchStain(event.touches[0].clientX, event.touches[0].clientY, event.target);
      lastInputMethod = "pointer";
    }, { passive: true });
    appEl.addEventListener("touchmove", function (event) {
      if (!paintPointer || paintPointer.id !== "touch" || !event.touches || event.touches.length !== 1) return;
      var touch = event.touches[0], dx = touch.clientX - lastPaintX, dy = touch.clientY - lastPaintY;
      if (paintStepReached(dx, dy)) addTouchStain(touch.clientX, touch.clientY, event.target);
    }, { passive: true });
    appEl.addEventListener("touchend", function () { releasePaintPointer("touch"); }, { passive: true });
    appEl.addEventListener("touchcancel", function () { releasePaintPointer("touch"); }, { passive: true });
    appEl.addEventListener("mousedown", function (event) {
      if (Date.now() - lastFallbackTouch < 800 || event.button !== 0 || isControlTarget(event.target)) return;
      if (addTouchStain(event.clientX, event.clientY, event.target)) paintPointer = { id: "mouse" };
      lastInputMethod = "pointer";
    }, { passive: true });
    document.addEventListener("mousemove", function (event) {
      if (!paintPointer || paintPointer.id !== "mouse" || !(event.buttons & 1)) return;
      var dx = event.clientX - lastPaintX, dy = event.clientY - lastPaintY;
      if (paintStepReached(dx, dy)) addTouchStain(event.clientX, event.clientY, event.target);
    }, { passive: true });
    document.addEventListener("mouseup", function () { releasePaintPointer("mouse"); }, { passive: true });
    document.addEventListener("mousedown", function () { lastInputMethod = "pointer"; }, true);
  }
  window.addEventListener("blur", function () { if (paintPointer) releasePaintPointer(paintPointer.id); });
  var defaults = shader.defaults || { speed: shader.params.speed, warp: 0.6, pigment: 1 };
  document.getElementById("c-reset").addEventListener("click", function () {
    speed.value = defaults.speed; warp.value = defaults.warp; pigment.value = defaults.pigment;
    syncVisualSliders(); shader.clearStains();
  });
  var bareButton = document.getElementById("c-bare");
  var controls = document.getElementById("controls");
  var controlsSummary = controls.querySelector("summary");
  shimDetails(controls, controlsSummary);
  var ambientHint = document.getElementById("ambient-hint");
  var chromeTimer = 0;
  function withinControls(element) { return !!(element && element !== document && controls.contains(element)); }
  function closeControls() {
    if (!controls.open) return;
    if (withinControls(document.activeElement)) controlsSummary.focus();
    controls.open = false;
  }
  function bumpChrome() {
    document.body.classList.remove("chrome-dim");
    if (chromeTimer) window.clearTimeout(chromeTimer);
    chromeTimer = window.setTimeout(function () {
      chromeTimer = 0;
      closeControls();
      if (document.body.classList.contains("bare")) document.body.classList.add("chrome-dim");
    }, document.body.classList.contains("bare") ? 2800 : 9000);
  }
  controls.addEventListener("input", bumpChrome);
  controls.addEventListener("toggle", function () { if (controls.open) bumpChrome(); });
  ["wheel", "keydown", "touchstart"].forEach(function (type) { document.addEventListener(type, bumpChrome, { passive: true }); });
  // O mouse parado sobre a tela não acorda os ajustes: só movimento intencional (≥24px acumulados) ou perto da faixa superior.
  var moveAnchorX = null, moveAnchorY = 0, moveAccum = 0;
  document.addEventListener("pointermove", function (event) {
    if (moveAnchorX === null) { moveAnchorX = event.clientX; moveAnchorY = event.clientY; moveAccum = 0; }
    moveAccum += Math.abs(event.clientX - moveAnchorX) + Math.abs(event.clientY - moveAnchorY);
    moveAnchorX = event.clientX; moveAnchorY = event.clientY;
    if (event.clientY < 96 || moveAccum >= 24) {
      moveAccum = 0;
      bumpChrome();
    }
  }, { passive: true });
  // Em modo ambiente a tela desenha sozinha manchas-fantasma, um convite silencioso para pintar. A primeira mancha do usuário encerra o efeito por sessão.
  var ghostTimer = 0;
  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function ghostOnce() {
    if (!document.body.classList.contains("bare") || prefersReducedMotion()) return;
    var x = 0.15 + Math.random() * 0.7;
    var y = 0.25 + Math.random() * 0.5;
    shader.addStain(x, y, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
    if (shader.releasePointer) shader.releasePointer();
  }
  function scheduleGhost(delay) {
    window.clearTimeout(ghostTimer);
    ghostTimer = window.setTimeout(function () {
      ghostTimer = 0;
      ghostOnce();
      if (document.body.classList.contains("bare") && !prefersReducedMotion()) scheduleGhost(7000);
    }, delay);
  }
  function startGhost() {
    if (prefersReducedMotion()) return;
    scheduleGhost(3500);
  }
  stopGhost = function () {
    window.clearTimeout(ghostTimer);
    ghostTimer = 0;
  };
  document.addEventListener("pointerdown", function (event) {
    if (controls.open && !withinControls(event.target)) closeControls();
  }, true);
  function setInterfaceMode(on) {
    document.body.classList.toggle("bare", on);
    bareButton.setAttribute("aria-pressed", String(on));
    bareButton.textContent = on ? "Mostrar portfólio" : "Modo ambiente";
    ambientHint.classList.toggle("is-shown", on);
    // No celular os ajustes vivem dentro do <details> do menu, fechado em modo ambiente; eles voltam ao cabeçalho para permanecerem alcançáveis.
    syncMobileMenu(on ? false : window.innerWidth <= 699);
    if (on) startGhost(); else stopGhost();
    bumpChrome();
    if (on) return;
    if (window.innerWidth <= 699) { setMobileMenuOpen(true); mobileMenuSummary.focus(); }
    else bareButton.focus();
  }
  function restoreInterface() { setInterfaceMode(false); }
  function toggleBare() { setInterfaceMode(!document.body.classList.contains("bare")); }
  bareButton.addEventListener("click", toggleBare);
  effectEl.addEventListener("change", function () {
    if (current < 0) return;
    var project = projects[current];
    var mode = effectEl.value === "auto" ? (isFinite(project.mode) ? project.mode : 1) : parseInt(effectEl.value, 10);
    shader.setTarget(isFinite(mode) ? mode : 1, project.hue || 0); shader.pulse();
  });
  function fireControlChange(element) {
    try { element.dispatchEvent(new window.Event("change", { bubbles: true })); }
    catch (_) {
      var legacy = document.createEvent("HTMLEvents");
      legacy.initEvent("change", true, false);
      element.dispatchEvent(legacy);
    }
  }
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    var target = event.target, tag = target && target.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].indexOf(tag) >= 0 || (target && target.isContentEditable)) return;
    if (document.getElementById("lb").open) return;
    var key = (event.key || "").toLowerCase();
    if (key === "a") { event.preventDefault(); toggleBare(); return; }
    if (key === "c") {
      event.preventDefault();
      if (controls.open) closeControls();
      else { controls.open = true; controlsSummary.focus(); bumpChrome(); }
      return;
    }
    if (key === "x") { event.preventDefault(); shader.clearStains(); return; }
    if (key === "0") { event.preventDefault(); effectEl.value = "auto"; fireControlChange(effectEl); return; }
    if (key >= "1" && key <= "5") {
      var option = effectEl.options[Number(key)];
      if (!option) return;
      event.preventDefault();
      effectEl.value = option.value;
      fireControlChange(effectEl);
    }
  });

  var dialog = document.getElementById("lb"), dialogImage = dialog.querySelector("img"), dialogCaption = dialog.querySelector("p");
  var closeDialog = dialog.querySelector(".lb-close"), returnFocus = null;
  function openLightbox(filename, alt, caption) {
    returnFocus = document.activeElement; dialogImage.src = "img/" + filename; dialogImage.alt = alt; dialogCaption.textContent = caption;
    if (dialog.showModal) dialog.showModal();
    else { dialog.classList.add("fallback-open"); document.body.classList.add("lb-fallback"); dialog.setAttribute("open", ""); }
    closeDialog.focus();
  }
  function closeLightbox() {
    if (dialog.close) dialog.close();
    else { dialog.removeAttribute("open"); dialog.classList.remove("fallback-open"); document.body.classList.remove("lb-fallback"); if (returnFocus) returnFocus.focus(); }
  }
  closeDialog.addEventListener("click", closeLightbox);
  dialog.addEventListener("click", function (event) { if (event.target === dialog && dialog.showModal) closeLightbox(); });
  dialog.addEventListener("keydown", function (event) {
    if (dialog.showModal || !dialog.hasAttribute("open")) return;
    if (event.key === "Escape") { closeLightbox(); return; }
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
  document.getElementById("nav-support").addEventListener("click", function () { goToId("apoiar"); });
  document.getElementById("nav-services").addEventListener("click", function () { showDesktopPage("services", false); });
  function showTopicFromNav(key) {
    filterEl.value = key;
    searchEl.value = "";
    current = -1;
    rebuildFromControls();
    if (current >= 0) go(current, false, true);
    closeDesktopMenus();
  }
  document.getElementById("nav-work").addEventListener("click", function () { showTopicFromNav("works"); });
  document.getElementById("nav-apps").addEventListener("click", function () { showTopicFromNav("apps"); });
  var lastInputMethod = "pointer", lastLogoFocusSound = 0;
  document.addEventListener("keydown", function (event) {
    if (event.key === "Tab" || event.key.indexOf("Arrow") === 0 || event.key === "Enter" || event.key === " ") lastInputMethod = "keyboard";
  }, true);
  function attachLogoSound(element, name) {
    element.addEventListener("focus", function () {
      if (lastInputMethod !== "keyboard" || !window.SoleAudio) return;
      lastLogoFocusSound = clockNow();
      window.SoleAudio.playLogo(name);
    });
    element.addEventListener("click", function () {
      if (lastInputMethod === "keyboard" && clockNow() - lastLogoFocusSound < 350) return;
      if (window.SoleAudio) window.SoleAudio.playLogo(name);
    });
  }
  attachLogoSound(document.getElementById("logo-sole"), "sole");
  attachLogoSound(document.getElementById("logo-v"), "v1su4rt");
  document.getElementById("logo-v").addEventListener("click", function () { goToId("fotografia-vivitar"); });

  var view = document.getElementById("c-view");
  function applyView() {
    var mode = view.value, width = window.innerWidth;
    var chosen = mode === "auto" ? (width < 700 ? "mobile" : (width < 1100 ? "tablet" : "desktop")) : mode;
    document.body.classList.remove("v-desktop", "v-tablet", "v-mobile", "framed"); document.body.classList.add("v-" + chosen);
    if (mode !== "auto" && ((chosen === "mobile" && width > 460) || (chosen === "tablet" && width > 860))) document.body.classList.add("framed");
    syncMobileMenu(width <= 699 && !document.body.classList.contains("bare"));
    if (!document.body.classList.contains("v-mobile") && current >= 0 && projects[current].mobileOnly) {
      filterEl.value = "all"; searchEl.value = ""; current = -1;
      rebuildFromControls();
    }
    refreshTopicCounts();
  }
  view.addEventListener("change", applyView); window.addEventListener("resize", applyView); applyView();

  var initialHash = location.hash;
  var initialIndex = initialHash ? projectIndexById(initialHash.slice(1)) : -1;
  var mobileHome = !initialHash && window.innerWidth <= 699 ? projectIndexById("bio") : -1;
  if (initialIndex >= 0) current = initialIndex;
  else if (mobileHome >= 0) current = mobileHome;
  deferInitialSelection = true;
  rebuildRail();
  deferInitialSelection = false;
  syncMobileMenuState();
  if (initialHash) { lastObservedHash = null; readHash(); }
  else if (mobileHome >= 0) go(mobileHome, true, true);
  else if (visible.length) go(visible[0]);
  document.documentElement.classList.add("js-ready");
})();
