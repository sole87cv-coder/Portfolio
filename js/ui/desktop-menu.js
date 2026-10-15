// desktop-menu.js (copied from src)
(function () {
  'use strict';

  function $$(sel, ctx){ return Array.prototype.slice.call((ctx||document).querySelectorAll(sel)); }
  function $(sel, ctx){ return (ctx||document).querySelector(sel); }

  var triggers = $$('.desktop-nav-trigger');
  var panels = $$('.desktop-menu-panel');

  function closeAll() {
    panels.forEach(function(p){
      p.hidden = true;
      var trig = p._trigger;
      if (trig) trig.setAttribute('aria-expanded','false');
    });
    document.documentElement.classList.remove('desktop-menu-open');
  }

  function openPanel(panel, trigger) {
    closeAll();
    panel.hidden = false;
    trigger.setAttribute('aria-expanded','true');
    panel._trigger = trigger;
    document.documentElement.classList.add('desktop-menu-open');
    var rect = panel.getBoundingClientRect();
    var over = rect.right - window.innerWidth;
    if (over > 8) {
      panel.style.left = 'auto';
      panel.style.right = '0';
    } else {
      panel.style.left = '';
      panel.style.right = '';
    }
  }

  triggers.forEach(function(trig){
    var panelId = trig.getAttribute('aria-controls');
    var panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;
    panel._trigger = trig;

    trig.addEventListener('click', function (ev) {
      ev.preventDefault();
      var isOpen = trig.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeAll(); else openPanel(panel, trig);
    });

    trig.addEventListener('keydown', function(ev){
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        trig.click();
      } else if (ev.key === 'Escape') {
        closeAll();
        trig.focus();
      }
    });

    panel.addEventListener('keydown', function(ev){
      if (ev.key === 'Escape') {
        closeAll();
        trig.focus();
      }
    });
  });

  document.addEventListener('click', function (ev) {
    var p = ev.target;
    if (p.closest && (p.closest('.desktop-nav-item') || p.closest('.desktop-menu-panel'))) return;
    closeAll();
  });

  window.addEventListener('resize', closeAll);
  window.addEventListener('scroll', closeAll, true);

})();
