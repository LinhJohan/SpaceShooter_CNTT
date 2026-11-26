// Bộ tổng hợp hiệu ứng âm thanh bằng Web Audio API (không cần file .mp3 ngoài)
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = this.loadMutedState();
  }

  loadMutedState() {
    try {
      return localStorage.getItem(GAME_CONFIG.SOUND_MUTED_KEY) === "1";
    } catch {
      return false;
    }
  }

  saveMutedState() {
    try {
      localStorage.setItem(GAME_CONFIG.SOUND_MUTED_KEY, this.muted ? "1" : "0");
    } catch {
      // Bỏ qua nếu trình duyệt chặn localStorage
    }
  }

  ensureContext() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    this.saveMutedState();
    if (!this.muted) {
      this.ensureContext();
    }
    return this.muted;
  }

  playTone(type, startFreq, endFreq, durationSec, volume = 0.08, delaySec = 0) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime + delaySec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(20, startFreq), now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + durationSec);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durationSec + 0.01);
    } catch {
      // Bỏ qua lỗi audio nếu trình duyệt chưa cho phát
    }
  }

  playShoot(weaponLevel = 1) {
    if (weaponLevel >= 3) {
      this.playTone("triangle", 880, 260, 0.08, 0.07);
    } else if (weaponLevel === 2) {
      this.playTone("triangle", 760, 240, 0.075, 0.065);
    } else {
      this.playTone("square", 660, 220, 0.065, 0.05);
    }
  }

  playHit() {
    this.playTone("triangle", 320, 140, 0.05, 0.06);
  }

  playExplosion(isBig = false) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const duration = isBig ? 0.48 : 0.18;
    const volume = isBig ? 0.16 : 0.1;

    try {
      // Tạo nhiễu trắng lọc qua low-pass cho tiếng nổ
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.floor(sampleRate * duration);
      const buffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(isBig ? 900 : 1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      // Kèm thêm tiếng trầm nhẹ tạo lực
      this.playTone("sawtooth", isBig ? 140 : 180, 40, duration, volume * 0.65);
    } catch {
      // Bỏ qua nếu context chưa sẵn sàng
    }
  }

  playPowerUp(type) {
    if (type === "weapon") {
      this.playTone("sine", 523, 659, 0.08, 0.09, 0);
      this.playTone("sine", 659, 880, 0.1, 0.09, 0.07);
      this.playTone("sine", 880, 1175, 0.12, 0.09, 0.14);
    } else if (type === "shield") {
      this.playTone("triangle", 440, 660, 0.1, 0.08, 0);
      this.playTone("triangle", 660, 990, 0.14, 0.08, 0.08);
    } else {
      this.playTone("sine", 494, 740, 0.09, 0.09, 0);
      this.playTone("sine", 740, 988, 0.13, 0.09, 0.08);
    }
  }

  playPlayerHit() {
    this.playTone("sawtooth", 210, 70, 0.22, 0.12);
  }

  playBossWarning() {
    this.playTone("sawtooth", 340, 240, 0.22, 0.11, 0);
    this.playTone("sawtooth", 340, 220, 0.28, 0.11, 0.28);
  }

  playGameOver() {
    this.playTone("triangle", 440, 392, 0.16, 0.1, 0);
    this.playTone("triangle", 349, 294, 0.18, 0.1, 0.18);
    this.playTone("triangle", 262, 165, 0.34, 0.11, 0.38);
  }
}
