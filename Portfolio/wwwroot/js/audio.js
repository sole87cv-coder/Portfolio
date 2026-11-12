/* Nenhum som é iniciado antes de uma ação explícita. */
(function () {
  "use strict";
  var context = null;
  var sequences = {
    sole: [523.25, 783.99, 1046.5],
    v1su4rt: [392.0, 587.33, 783.99]
  };

  function getContext() {
    var AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) return null;
    try {
      if (!context || context.state === "closed") context = new AudioContextType();
      return context;
    } catch (_) {
      return null;
    }
  }

  var menuSequences = {
    navigate: [659.25, 987.77],
    open: [523.25, 659.25],
    close: [659.25, 523.25],
    ambient: [329.63, 493.88, 659.25]
  };
  var lastMenu = -Infinity;

  function play(notes, volume = 0.055, step = 0.085) {
    var audio = getContext();
    if (!audio) return;

    function schedule() {
      var start = audio.currentTime;
      notes.forEach(function (frequency, index) {
        try {
          var oscillator = audio.createOscillator();
          var gain = audio.createGain();
          var onset = start + index * step;
          oscillator.type = "square";
          oscillator.frequency.setValueAtTime(frequency, onset);
          gain.gain.setValueAtTime(0.0001, onset);
          gain.gain.exponentialRampToValueAtTime(volume, onset + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, onset + step - 0.01);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          oscillator.start(onset);
          oscillator.stop(onset + step - 0.005);
        } catch (_) {
          /* A falha de áudio nunca deve impedir a navegação do portfólio. */
        }
      });
    }

    try {
      if (audio.state === "suspended") {
        var resume = audio.resume();
        if (resume && typeof resume.then === "function") resume.then(schedule, function () {});
        else schedule();
      } else schedule();
    } catch (_) {
      /* Web Audio indisponível ou bloqueado: falha silenciosa. */
    }
  }

  window.SoleAudio = {
    muted: false,
    playLogo: function (name) {
      if (this.muted || !sequences[name]) return;
      play(sequences[name]);
    },
    playMenu: function (name) {
      var now = performance.now();
      if (this.muted || !menuSequences[name] || now - lastMenu < 140) return;
      lastMenu = now;
      play(menuSequences[name], 0.018, 0.055);
    }
  };
})();
