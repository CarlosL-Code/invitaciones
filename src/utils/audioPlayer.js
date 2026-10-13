/**
 * 🎵 Reproductor de Música Ambiental — Revelación de Sexo
 * 
 * Carga y reproduce el archivo de audio real `/musica.mp3` (o `/music.mp3`)
 * con repetición infinita (loop) y volumen agradable.
 * 
 * Se inicia de forma automática y suave al primer gesto del usuario
 * (toque, clic o scroll en el celular o PC) y cuenta con botón de pausa/reanudación
 * en la barra superior.
 * 
 * Si por cualquier motivo el MP3 no carga, cuenta con un sintetizador festivo de respaldo.
 */

class CelebrationMusicBox {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.volume = 0.45;
    this.hasAutoStarted = false;
    this._listeners = [];

    // Sintetizador de respaldo Web Audio API si no hay archivo de audio
    this.ctx = null;
    this.gainNode = null;
    this.timerId = null;
    this.step = 0;
    this.isUsingFallback = false;

    this.melody = [
      523.25, 659.25, 783.99, 1046.50,
      587.33, 739.99, 880.00, 1174.66,
      523.25, 698.46, 880.00, 1046.50,
      659.25, 783.99, 880.00, 1046.50,
      587.33, 698.46, 880.00, 1174.66,
      523.25, 659.25, 783.99, 987.77,
      783.99, 987.77, 1174.66, 1318.51,
      1046.50, 880.00, 783.99, 659.25,
      523.25, 659.25, 783.99, 1046.50,
    ];
  }

  _getAudio() {
    if (!this.audio) {
      // Priorizar el archivo subido por Carlos: /musica.mp3
      this.audio = new Audio('/musica.mp3');
      this.audio.loop = true;
      this.audio.volume = this.volume;
      this.audio.preload = 'auto';

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.isUsingFallback = false;
        this._notify(true);
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this._notify(false);
      });

      this.audio.addEventListener('error', () => {
        console.warn('Archivo /musica.mp3 no disponible, activando melodía festiva generada.');
        this._startFallback();
      });
    }
    return this.audio;
  }

  async start() {
    try {
      const audio = this._getAudio();
      audio.volume = this.volume;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      this.isPlaying = true;
      this._notify(true);
      return true;
    } catch {
      // Si el navegador bloquea la reproducción de audio HTML5, intentar el fallback
      return this._startFallback();
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
    }
    if (this.isUsingFallback) {
      this._stopFallback();
    }
    this.isPlaying = false;
    this._notify(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  onStateChange(cb) {
    this._listeners.push(cb);
  }

  _notify(playing) {
    this._listeners.forEach((cb) => {
      try {
        cb(playing);
      } catch {}
    });
  }

  // Autoarranque al primer gesto del usuario (toque, clic o scroll)
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

  // --- SINTETIZADOR DE RESPALDO (Por si falla el archivo MP3) ---
  _startFallback() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = this.volume;
        this.gainNode.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      this.isUsingFallback = true;
      this.isPlaying = true;
      this.step = 0;

      const loop = () => {
        if (!this.isPlaying || !this.isUsingFallback) return;
        this._playNote(this.melody[this.step % this.melody.length]);
        this.step++;
        this.timerId = setTimeout(loop, 420);
      };
      loop();
      this._notify(true);
      return true;
    } catch {
      return false;
    }
  }

  _playNote(freq) {
    if (!this.ctx || !this.isPlaying || !this.gainNode) return;
    try {
      const now = this.ctx.currentTime;
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
    } catch {}
  }

  _stopFallback() {
    this.isUsingFallback = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

export const musicBox = new CelebrationMusicBox();
