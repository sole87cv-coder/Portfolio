/* Sons breves 8-bit dos logotipos, sintetizados somente após interação do usuário. */
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

  function play(notes) {
    var audio = getContext();
    if (!audio) return;

    function schedule() {
      var start = audio.currentTime;
      notes.forEach(function (frequency, index) {
        try {
          var oscillator = audio.createOscillator();
          var gain = audio.createGain();
          var onset = start + index * 0.085;
          oscillator.type = "square";
          oscillator.frequency.setValueAtTime(frequency, onset);
          gain.gain.setValueAtTime(0.0001, onset);
          gain.gain.exponentialRampToValueAtTime(0.055, onset + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, onset + 0.075);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          oscillator.start(onset);
          oscillator.stop(onset + 0.08);
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
    }
  };
})();
