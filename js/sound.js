// Bộ tổng hợp hiệu ứng âm thanh bằng Web Audio API + Nhạc nền Dynamic Music đồng bộ 2 track
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = this.loadMutedState();

    // Dynamic Music: bản thường (khi có Boss) và bản underscore (khi không có Boss)
    const musicCfg = (typeof GAME_CONFIG !== "undefined" && GAME_CONFIG.MUSIC) || {
      NORMAL_SRC: "audio/bgm_normal.mp3",
      UNDERSCORE_SRC: "audio/bgm_underscore.mp3",
      VOLUME: 0.45,
      CROSSFADE_MS: 600,
      SYNC_THRESHOLD_SEC: 0.04
    };

    this.musicVolume = musicCfg.VOLUME;
    this.crossfadeMs = musicCfg.CROSSFADE_MS;
    this.syncThresholdSec = musicCfg.SYNC_THRESHOLD_SEC;

    this.normalAudio = this._createMusicTrack(musicCfg.NORMAL_SRC);
    this.underscoreAudio = this._createMusicTrack(musicCfg.UNDERSCORE_SRC);

    this.musicActive = false;
    this.musicPaused = false;
    this.isBossMusic = false;
    this.musicBlend = 0; // 0 = underscore, 1 = normal
    this._lastMusicTick = 0;
    this._lastSyncCheck = 0;
    this._rafId = null;
  }

  _createMusicTrack(src) {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.muted = this.muted;
    return audio;
  }

  _applyMusicVolumes() {
    const normalVol = Math.max(0, Math.min(1, this.musicVolume * this.musicBlend));
    const underVol = Math.max(0, Math.min(1, this.musicVolume * (1 - this.musicBlend)));
    this.normalAudio.volume = normalVol;
    this.underscoreAudio.volume = underVol;
    this.normalAudio.muted = this.muted;
    this.underscoreAudio.muted = this.muted;
  }

  _syncTracks(forceTargetToActive = true) {
    const active = this.isBossMusic ? this.normalAudio : this.underscoreAudio;
    const inactive = this.isBossMusic ? this.underscoreAudio : this.normalAudio;

    if (active.readyState < 1 || inactive.readyState < 1) return;

    const drift = Math.abs(active.currentTime - inactive.currentTime);
    if (drift > this.syncThresholdSec) {
      if (forceTargetToActive) {
        inactive.currentTime = active.currentTime;
      } else {
        active.currentTime = inactive.currentTime;
      }
    }
  }

  _startMusicLoop() {
    if (this._rafId !== null) return;
    this._lastMusicTick = performance.now();
    const tick = (now) => {
      if (!this.musicActive || this.musicPaused) {
        this._rafId = null;
        return;
      }

      const dtMs = Math.min(100, Math.max(0, now - this._lastMusicTick));
      this._lastMusicTick = now;

      const targetBlend = this.isBossMusic ? 1 : 0;
      if (this.musicBlend !== targetBlend) {
        const step = this.crossfadeMs > 0 ? dtMs / this.crossfadeMs : 1;
        if (this.musicBlend < targetBlend) {
          this.musicBlend = Math.min(targetBlend, this.musicBlend + step);
        } else {
          this.musicBlend = Math.max(targetBlend, this.musicBlend - step);
        }
        this._applyMusicVolumes();
      }

      // Định kỳ kiểm tra và cân chỉnh độ lệch thời gian giữa 2 track
      if (now - this._lastSyncCheck >= 500) {
        this._lastSyncCheck = now;
        this._syncTracks(true);
      }

      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  _stopMusicLoop() {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  startMusic(isBossActive = false) {
    this.musicActive = true;
    this.musicPaused = false;
    this.isBossMusic = Boolean(isBossActive);
    this.musicBlend = this.isBossMusic ? 1 : 0;

    try {
      this.normalAudio.currentTime = 0;
      this.underscoreAudio.currentTime = 0;
    } catch {
      // Bỏ qua nếu metadata chưa nạp xong
    }

    this._applyMusicVolumes();
    this.normalAudio.play().catch(() => {});
    this.underscoreAudio.play().catch(() => {});
    this._lastSyncCheck = performance.now();
    this._startMusicLoop();
  }

  setBossMusic(isBossActive) {
    const nextState = Boolean(isBossActive);
    if (this.isBossMusic === nextState) return;

    // Đồng bộ track sắp chuyển tới đúng vị trí của track đang phát trước khi crossfade
    const prevActive = this.isBossMusic ? this.normalAudio : this.underscoreAudio;
    const nextActive = nextState ? this.normalAudio : this.underscoreAudio;
    if (prevActive.readyState >= 1 && nextActive.readyState >= 1) {
      if (Math.abs(prevActive.currentTime - nextActive.currentTime) > 0.02) {
        nextActive.currentTime = prevActive.currentTime;
      }
    }

    this.isBossMusic = nextState;
    if (this.musicActive && !this.musicPaused) {
      if (this.normalAudio.paused) this.normalAudio.play().catch(() => {});
      if (this.underscoreAudio.paused) this.underscoreAudio.play().catch(() => {});
      this._startMusicLoop();
    }
  }

  pauseMusic() {
    if (!this.musicActive || this.musicPaused) return;
    this.musicPaused = true;
    this._stopMusicLoop();
    this.normalAudio.pause();
    this.underscoreAudio.pause();
  }

  resumeMusic() {
    if (!this.musicActive || !this.musicPaused) return;
    this.musicPaused = false;
    this._syncTracks(true);
    this._applyMusicVolumes();
    this.normalAudio.play().catch(() => {});
    this.underscoreAudio.play().catch(() => {});
    this._startMusicLoop();
  }

  stopMusic() {
    this.musicActive = false;
    this.musicPaused = false;
    this._stopMusicLoop();
    this.normalAudio.pause();
    this.underscoreAudio.pause();
    try {
      this.normalAudio.currentTime = 0;
      this.underscoreAudio.currentTime = 0;
    } catch {
      // Bỏ qua nếu chưa sẵn sàng
    }
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
    this._applyMusicVolumes();
    if (!this.muted) {
      this.ensureContext();
      if (this.musicActive && !this.musicPaused) {
        this._syncTracks(true);
        if (this.normalAudio.paused) this.normalAudio.play().catch(() => {});
        if (this.underscoreAudio.paused) this.underscoreAudio.play().catch(() => {});
        this._startMusicLoop();
      }
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
