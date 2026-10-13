/**
 * 🎵 Reproductor de Música Ambiental — Revelación de Sexo
 * 
 * Melodía alegre estilo celesta / cajita musical con armonías festivas.
 * Se reproduce automáticamente al primer gesto del usuario.
 * El usuario puede pausar/reanudar con el botón de la barra superior.
 */

class CelebrationMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.step = 0;
    this.volume = 0.35;
    this.gainNode = null;
    this.hasAutoStarted = false;
    this._onStartCallbacks = [];

    // 🎶 Melodía alegre y festiva — cajita musical / celesta
    this.melody = [
      // Frase 1: C mayor brillante (alegre, luminosa)
      523.25, 659.25, 783.99, 1046.50,
      // Frase 2: G mayor (subida festiva)
      587.33, 739.99, 880.00, 1174.66,
      // Frase 3: F mayor dulce
      523.25, 698.46, 880.00, 1046.50,
      // Frase 4: Am → C (emotiva → resolución)
      659.25, 783.99, 880.00, 1046.50,
      // Frase 5: Dm → G (puente)
      587.33, 698.46, 880.00, 1174.66,
      // Frase 6: Clímax ascendente
      523.25, 659.25, 783.99, 987.77,
      783.99, 987.77, 1174.66, 1318.51,
      // Frase 7: Resolución dulce descendente
      1046.50, 880.00, 783.99, 659.25,
      523.25, 659.25, 783.99, 1046.50,
    ];
  }

  _initContext() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.ctx.destination);
      } catch {
        return false;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  _playNote(freq) {
    if (!this.ctx || !this.isPlaying || !this.gainNode) return;

    try {
      const now = this.ctx.currentTime;

      // Fundamental (sine — cuerpo principal)
      const osc1 = this.ctx.createOscillator();
      const g1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.value = freq;
      g1.gain.setValueAtTime(0, now);
      g1.gain.linearRampToValueAtTime(0.14, now + 0.02);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc1.connect(g1);
      g1.connect(this.gainNode);
      osc1.start(now);
      osc1.stop(now + 1.0);

      // Armónico octava (brillo celesta)
      const osc2 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0, now);
      g2.gain.linearRampToValueAtTime(0.05, now + 0.01);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(g2);
      g2.connect(this.gainNode);
      osc2.start(now);
      osc2.stop(now + 0.6);

      // Quinta perfecta sutil (calidez)
      const osc3 = this.ctx.createOscillator();
      const g3 = this.ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.value = freq * 1.5;
      g3.gain.setValueAtTime(0, now);
      g3.gain.linearRampToValueAtTime(0.025, now + 0.01);
      g3.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc3.connect(g3);
      g3.connect(this.gainNode);
      osc3.start(now);
      osc3.stop(now + 0.5);
    } catch {
      // Contexto de audio restringido
    }
  }

  start() {
    if (this.isPlaying) return true;
    if (!this._initContext()) return false;

    this.isPlaying = true;
    this.step = 0;

    const loop = () => {
      if (!this.isPlaying) return;
      this._playNote(this.melody[this.step % this.melody.length]);
      this.step++;
      this.timerId = setTimeout(loop, 420); // ~142 BPM
    };
    loop();

    // Notificar a los callbacks de inicio
    this._onStartCallbacks.forEach((cb) => cb(true));
    return true;
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this._onStartCallbacks.forEach((cb) => cb(false));
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  // Registrar callback para saber cuándo arranca/para la música
  onStateChange(cb) {
    this._onStartCallbacks.push(cb);
  }

  // Configura autoarranque al primer gesto del usuario
  setupAutoStart() {
    if (this.hasAutoStarted) return;

    const handler = () => {
      if (this.hasAutoStarted) return;
      this.hasAutoStarted = true;
      this.start();
      ['click', 'touchstart', 'scroll', 'keydown'].forEach((e) =>
        document.removeEventListener(e, handler, true)
      );
    };

    ['click', 'touchstart', 'scroll', 'keydown'].forEach((e) =>
      document.addEventListener(e, handler, { capture: true, passive: true })
    );
  }
}

export const musicBox = new CelebrationMusicBox();
