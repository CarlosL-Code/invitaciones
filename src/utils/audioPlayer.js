/**
 * 🎵 Reproductor de Música Ambiental — Revelación de Sexo
 * 
 * Genera una melodía alegre estilo cajita musical / celesta con armonías
 * festivas, ideal para una revelación de sexo. Se reproduce automáticamente
 * al primer gesto del usuario y puede pausarse/reanudarse.
 *
 * Si quieres usar un archivo MP3 propio, colócalo en public/music.mp3
 * y el reproductor lo detectará automáticamente.
 */

const MP3_PATH = '/music.mp3';

class CelebrationMusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.step = 0;
    this.volume = 0.35; // Volumen inicial agradable (0-1)
    this.audioElement = null;
    this.usingMp3 = false;
    this.gainNode = null;
    this.hasAutoStarted = false;

    // 🎶 Melodía alegre y celebratoria — estilo cajita musical / celesta
    // Combinación de acordes mayores alegres con notas altas brillantes
    this.melody = [
      // Intro festiva (C mayor brillante)
      523.25, 659.25, 783.99, 1046.50,
      // Subida alegre (G mayor)
      587.33, 739.99, 880.00, 1174.66,
      // Tono dulce (F mayor)
      523.25, 698.46, 880.00, 1046.50,
      // Vuelta brillante (Am → C)
      659.25, 783.99, 880.00, 1046.50,
      // Puente festivo (Dm → G)
      587.33, 698.46, 880.00, 1174.66,
      // Clímax celebratorio (C → Em → G)
      523.25, 659.25, 783.99, 987.77,
      783.99, 987.77, 1174.66, 1318.51,
      // Resolución dulce
      1046.50, 880.00, 783.99, 659.25,
      523.25, 659.25, 783.99, 1046.50,
    ];
  }

  async init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this.volume;
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  // Intentar cargar MP3 externo
  async tryLoadMp3() {
    try {
      const res = await fetch(MP3_PATH, { method: 'HEAD' });
      if (res.ok) {
        this.audioElement = new Audio(MP3_PATH);
        this.audioElement.loop = true;
        this.audioElement.volume = this.volume;
        this.usingMp3 = true;
        return true;
      }
    } catch {
      // No hay MP3, se usa la melodía generada
    }
    return false;
  }

  // Nota con timbre de celesta / cajita musical (armónicos brillantes)
  playNote(freq) {
    if (!this.ctx || !this.isPlaying) return;

    try {
      const now = this.ctx.currentTime;

      // Fundamental (sine suave)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc1.connect(gain1);
      gain1.connect(this.gainNode);
      osc1.start(now);
      osc1.stop(now + 1.0);

      // 2do armónico (una octava arriba, muy suave — brillo de celesta)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(this.gainNode);
      osc2.start(now);
      osc2.stop(now + 0.6);

      // 3er armónico sutil (quinta perfecta — da calidez)
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(freq * 1.5, now);
      gain3.gain.setValueAtTime(0, now);
      gain3.gain.linearRampToValueAtTime(0.02, now + 0.01);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc3.connect(gain3);
      gain3.connect(this.gainNode);
      osc3.start(now);
      osc3.stop(now + 0.5);
    } catch {
      // Audio context restricted
    }
  }

  async start() {
    await this.init();

    // Si hay MP3 disponible, usarlo
    if (!this.usingMp3 && !this.audioElement) {
      await this.tryLoadMp3();
    }

    this.isPlaying = true;

    if (this.usingMp3 && this.audioElement) {
      this.audioElement.volume = this.volume;
      try {
        await this.audioElement.play();
      } catch {
        // Autoplay blocked
      }
      return;
    }

    // Melodía generada con Web Audio API
    this.step = 0;
    const playLoop = () => {
      if (!this.isPlaying) return;
      const freq = this.melody[this.step % this.melody.length];
      this.playNote(freq);
      this.step++;
      // Tempo alegre ~142 BPM (420ms entre notas)
      this.timerId = setTimeout(playLoop, 420);
    };
    playLoop();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.usingMp3 && this.audioElement) {
      this.audioElement.pause();
    }
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
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  // Autoarranque al primer gesto del usuario (click/touch/scroll)
  setupAutoStart() {
    if (this.hasAutoStarted) return;

    const autoStart = () => {
      if (this.hasAutoStarted) return;
      this.hasAutoStarted = true;
      this.start();
      // Remover listeners
      ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) =>
        document.removeEventListener(evt, autoStart, { capture: true })
      );
    };

    ['click', 'touchstart', 'scroll', 'keydown'].forEach((evt) =>
      document.addEventListener(evt, autoStart, { capture: true, once: false, passive: true })
    );
  }
}

export const musicBox = new CelebrationMusicBox();
