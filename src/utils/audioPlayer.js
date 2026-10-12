// Web Audio API based ambient music box to ensure 100% offline reliability without broken mp3 links
class MusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timerId = null;
    this.step = 0;
    // Calming lullaby chord arpeggio notes (frequencies in Hz)
    this.melody = [
      261.63, 329.63, 392.00, 523.25, // C - E - G - C
      293.66, 349.23, 440.00, 587.33, // D - F - A - D
      329.63, 392.00, 493.88, 659.25, // E - G - B - E
      349.23, 440.00, 523.25, 698.46, // F - A - C - F
      392.00, 493.88, 587.33, 783.99, // G - B - D - G
      329.63, 392.00, 523.25, 659.25, // E - G - C - E
      261.63, 329.63, 392.00, 523.25  // C - E - G - C
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq) {
    if (!this.ctx || !this.isPlaying) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sine wave with soft triangle harmonic for music-box chime effect
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  start() {
    this.init();
    this.isPlaying = true;
    this.step = 0;

    const playLoop = () => {
      if (!this.isPlaying) return;
      const freq = this.melody[this.step % this.melody.length];
      this.playNote(freq);
      this.step++;
      this.timerId = setTimeout(playLoop, 480);
    };

    playLoop();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
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
}

export const musicBox = new MusicBox();
