/* Microfone (nível 0 a 1) e tons curtos estilo 8-bit. */
(function () {
  var ctx = null, analyser = null, data = null, stream = null, level = 0;

  function getCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  window.SoleAudio = {
    active: false,

    start: function () {
      var c = getCtx();
      if (!c || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return Promise.reject(new Error("Microfone não suportado neste navegador."));
      }
      return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
        stream = s;
        analyser = c.createAnalyser();
        analyser.fftSize = 256;
        data = new Uint8Array(analyser.frequencyBinCount);
        c.createMediaStreamSource(s).connect(analyser);
        window.SoleAudio.active = true;
      });
    },

    stop: function () {
      if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null; analyser = null;
      window.SoleAudio.active = false;
      level = 0;
    },

    /* Nível suavizado das frequências graves e médias, multiplicado pela sensibilidade. */
    read: function (sensitivity) {
      if (!analyser) return 0;
      analyser.getByteFrequencyData(data);
      var sum = 0, n = 24;
      for (var i = 0; i < n; i++) sum += data[i];
      var raw = Math.min(1, (sum / n / 255) * sensitivity);
      level += (raw - level) * 0.35;
      return level;
    },

    /* Toca uma sequência de notas (Hz) com onda quadrada. */
    play: function (notes) {
      var c = getCtx();
      if (!c) return;
      var step = 0.11, t0 = c.currentTime;
      notes.forEach(function (f, i) {
        var o = c.createOscillator(), g = c.createGain();
        o.type = "square";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + i * step);
        g.gain.exponentialRampToValueAtTime(0.1, t0 + i * step + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * step + step * 1.6);
        o.connect(g).connect(c.destination);
        o.start(t0 + i * step);
        o.stop(t0 + i * step + step * 1.7);
      });
    }
  };
})();
