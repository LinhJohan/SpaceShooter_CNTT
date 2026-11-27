// ===== Hệ thống Thành tựu (lưu bằng localStorage) =====
const ACH_STORAGE_KEY = "space_shooter_cntt_achievements_v1";
const ACH_STATS_KEY = "space_shooter_cntt_stats_v1";
const SHAKE_STORAGE_KEY = "space_shooter_cntt_shake";

const ACHIEVEMENTS = [
  { id: "first_kill", icon: "🎯", title: "Phát súng đầu tiên", desc: "Hạ 1 kẻ địch", test: (st) => st.kills >= 1 },
  { id: "kills_100", icon: "💥", title: "Thợ săn", desc: "Hạ tổng cộng 100 kẻ địch", test: (st) => st.kills >= 100 },
  { id: "boss_slayer", icon: "👾", title: "Diệt Boss", desc: "Hạ Boss lần đầu", test: (st) => st.bosses >= 1 },
  { id: "score_500", icon: "⭐", title: "Điểm cao", desc: "Đạt 500 điểm trong một ván", test: (st, run) => run.score >= 500 },
  { id: "untouchable", icon: "🛡️", title: "Bất khả xâm phạm", desc: "Đạt Đợt 4 mà không mất máu", test: (st, run) => run.wave >= 4 && !run.hit },
  { id: "shield_master", icon: "🔰", title: "Bậc thầy khiên", desc: "Chắn 5 đòn bằng khiên", test: (st) => st.blocks >= 5 },
  { id: "collector", icon: "🎁", title: "Nhà sưu tầm", desc: "Nhặt 15 vật phẩm", test: (st) => st.powerups >= 15 },
  { id: "hard_300", icon: "🔥", title: "Bất khuất", desc: "Đạt 300 điểm ở độ khó Khó", test: (st, run) => run.difficulty === "hard" && run.score >= 300 }
];

class AchievementManager {
  constructor(onUnlock) {
    this.onUnlock = onUnlock;
    this.unlocked = this.load(ACH_STORAGE_KEY, {});
    this.stats = Object.assign({ kills: 0, bosses: 0, powerups: 0, blocks: 0, games: 0 }, this.load(ACH_STATS_KEY, {}));
    this.run = { score: 0, wave: 1, hit: false, difficulty: "normal" };
  }

  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : fallback;
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  save() {
    try {
      localStorage.setItem(ACH_STORAGE_KEY, JSON.stringify(this.unlocked));
      localStorage.setItem(ACH_STATS_KEY, JSON.stringify(this.stats));
    } catch {
      // Bỏ qua nếu trình duyệt chặn localStorage
    }
  }

  // Nhận sự kiện từ main.js: run_start | kill | boss_kill | powerup | shield_block | hit
  notify(eventName, data = {}) {
    if (eventName === "run_start") {
      this.run = { score: 0, wave: 1, hit: false, difficulty: data.difficulty || "normal" };
      this.stats.games += 1;
    } else if (eventName === "kill") this.stats.kills += 1;
    else if (eventName === "boss_kill") this.stats.bosses += 1;
    else if (eventName === "powerup") this.stats.powerups += 1;
    else if (eventName === "shield_block") this.stats.blocks += 1;
    else if (eventName === "hit") this.run.hit = true;
    this.evaluate(true);
  }

  // Điểm và đợt lấy từ updateHUD nên không cần thêm hook ở main.js
  trackProgress(score, wave) {
    this.run.score = score;
    this.run.wave = wave;
    this.evaluate(false);
  }

  evaluate(persist) {
    let changed = persist;
    for (const a of ACHIEVEMENTS) {
      if (this.unlocked[a.id]) continue;
      if (a.test(this.stats, this.run)) {
        this.unlocked[a.id] = true;
        changed = true;
        if (this.onUnlock) this.onUnlock(a);
      }
    }
    if (changed) this.save();
  }

  count() {
    return ACHIEVEMENTS.filter((a) => this.unlocked[a.id]).length;
  }
}

// Quản lý giao diện (HUD, Độ khó, Start/Pause/Game Over, Bảng xếp hạng Top 5)
class GameUI {
  constructor() {
    this.scoreDisplay = document.getElementById("scoreDisplay");
    this.highScoreDisplay = document.getElementById("highScoreDisplay");
    this.waveDisplay = document.getElementById("waveDisplay");
    this.hpBarFill = document.getElementById("hpBarFill");
    this.hpText = document.getElementById("hpText");
    this.pauseMenuBtn = document.getElementById("pauseMenuBtn");

    this.introScreen = document.getElementById("introScreen");
    this.resetPromptScreen = document.getElementById("resetPromptScreen");
    this.resetPromptSummary = document.getElementById("resetPromptSummary");
    this.keepProgressBtn = document.getElementById("keepProgressBtn");
    this.confirmResetBtn = document.getElementById("confirmResetBtn");
    this.startScreen = document.getElementById("startScreen");
    this.pauseScreen = document.getElementById("pauseScreen");
    this.settingsScreen = document.getElementById("settingsScreen");
    this.gameOverScreen = document.getElementById("gameOverScreen");

    this.difficultyButtons = Array.from(document.querySelectorAll("#difficultyGroup .btn-diff"));
    this.selectedDifficultyId = "normal";

    this.finalScoreText = document.getElementById("finalScoreText");
    this.finalWaveText = document.getElementById("finalWaveText");
    this.finalDifficultyText = document.getElementById("finalDifficultyText");

    this.nameEntryBox = document.getElementById("nameEntryBox");
    this.playerNameInput = document.getElementById("playerNameInput");
    this.saveScoreBtn = document.getElementById("saveScoreBtn");

    this.startLeaderboardList = document.getElementById("startLeaderboardList");
    this.gameOverLeaderboardList = document.getElementById("gameOverLeaderboardList");

    this.canvasContainer = document.querySelector(".canvas-container");
    this.achScreen = document.getElementById("achievementsScreen");
    this.achList = document.getElementById("achList");
    this.achCountText = document.getElementById("achCountText");
    this.achToast = document.getElementById("achToast");
    this.musicToast = document.getElementById("musicToast");
    this.musicToastTimer = null;
    this.achOpenBtn = document.getElementById("achOpenBtn");
    this.resetProgressBtn = document.getElementById("resetProgressBtn");
    this.shipGroup = document.getElementById("shipGroup");
    this.toastQueue = [];
    this.toastBusy = false;

    this.selectedShipId = this.loadSavedShip();
    this.shakeEnabled = this.loadShakeSetting();
    this.achievements = new AchievementManager((a) => this.queueToast(a));

    this.bindDifficultyButtons();
    this.buildShipSelector();
    this.bindExtraButtons();
  }

  // ----- Chọn phi thuyền -----
  loadSavedShip() {
    try {
      const id = localStorage.getItem(SHIP_STORAGE_KEY);
      return SHIP_MODELS[id] ? id : "phantom";
    } catch {
      return "phantom";
    }
  }

  getSelectedShip() {
    return SHIP_MODELS[this.selectedShipId] || SHIP_MODELS.phantom;
  }

  buildShipSelector() {
    if (!this.shipGroup) return;
    for (const ship of Object.values(SHIP_MODELS)) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "ship-card";
      card.dataset.ship = ship.id;

      const preview = document.createElement("canvas");
      preview.width = 52;
      preview.height = 64;
      drawShipShape(preview.getContext("2d"), ship, 4, 4, 44, 48, { flameLen: 9 });

      const name = document.createElement("span");
      name.className = "ship-name";
      name.textContent = ship.name;
      const desc = document.createElement("span");
      desc.className = "ship-desc";
      desc.textContent = ship.desc;

      card.append(preview, name, desc);
      card.addEventListener("click", () => {
        this.selectedShipId = ship.id;
        try {
          localStorage.setItem(SHIP_STORAGE_KEY, ship.id);
        } catch {
          // Bỏ qua nếu trình duyệt chặn localStorage
        }
        this.refreshShipSelection();
        card.blur();
      });
      this.shipGroup.appendChild(card);
    }
    this.refreshShipSelection();
  }

  refreshShipSelection() {
    for (const card of this.shipGroup.querySelectorAll(".ship-card")) {
      card.classList.toggle("active", card.dataset.ship === this.selectedShipId);
    }
  }

  // ----- Rung màn hình -----
  loadShakeSetting() {
    try {
      return localStorage.getItem(SHAKE_STORAGE_KEY) !== "off";
    } catch {
      return true;
    }
  }

  shake(intensity = 6, durationMs = 300) {
    if (!this.shakeEnabled || !this.canvasContainer || !this.canvasContainer.animate) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const steps = 9;
    const frames = [];
    for (let i = 0; i < steps; i++) {
      const decay = 1 - i / steps; // giảm dần về 0
      const dx = (Math.random() * 2 - 1) * intensity * decay;
      const dy = (Math.random() * 2 - 1) * intensity * decay;
      frames.push({ transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` });
    }
    frames.push({ transform: "translate(0px, 0px)" });
    this.canvasContainer.animate(frames, { duration: durationMs, easing: "linear" });
  }

  // ----- Thành tựu & Reset kỷ lục -----
  bindExtraButtons() {
    this.achOpenBtn.addEventListener("click", () => {
      this.renderAchievements();
      this.startScreen.classList.remove("active");
      this.achScreen.classList.add("active");
      this.achOpenBtn.blur();
    });
    document.getElementById("achCloseBtn").addEventListener("click", () => {
      this.achScreen.classList.remove("active");
      this.startScreen.classList.add("active");
    });
    if (this.resetProgressBtn) {
      this.resetProgressBtn.addEventListener("click", () => {
        if (window.confirm("Bạn có chắc muốn xóa toàn bộ kỷ lục và thành tựu?")) {
          this.resetProgress();
        }
        this.resetProgressBtn.blur();
      });
    }
    if (this.keepProgressBtn) {
      this.keepProgressBtn.addEventListener("click", () => {
        this.showScreen("start");
        this.keepProgressBtn.blur();
      });
    }
    if (this.confirmResetBtn) {
      this.confirmResetBtn.addEventListener("click", () => {
        this.resetProgress();
        this.showScreen("start");
        this.confirmResetBtn.blur();
      });
    }
    this.updateAchButtonLabel();
  }

  resetProgress() {
    try {
      localStorage.removeItem(GAME_CONFIG.HIGH_SCORE_KEY);
      localStorage.removeItem(GAME_CONFIG.LEADERBOARD_KEY);
      localStorage.removeItem(ACH_STORAGE_KEY);
      localStorage.removeItem(ACH_STATS_KEY);
    } catch {
      // Bỏ qua nếu trình duyệt chặn localStorage
    }
    this.achievements.unlocked = {};
    this.achievements.stats = { kills: 0, bosses: 0, powerups: 0, blocks: 0, games: 0 };
    this.achievements.run = { score: 0, wave: 1, hit: false, difficulty: "normal" };
    this.toastQueue = [];
    this.updateAchButtonLabel();
    this.renderAchievements();
    this.renderLeaderboard(this.startLeaderboardList);
    this.highScoreDisplay.textContent = "0";
  }

  playIntroSplash(durationMs = 2000) {
    if (!this.introScreen) {
      this.showScreen(this.resetPromptScreen ? "resetPrompt" : "start");
      return;
    }
    this.renderLeaderboard(this.startLeaderboardList);
    if (this.pauseMenuBtn) this.pauseMenuBtn.style.display = "none";
    this.introScreen.classList.remove("fade-out");
    this.introScreen.classList.add("active");

    setTimeout(() => {
      this.introScreen.classList.add("fade-out");
      this.showScreen(this.resetPromptScreen ? "resetPrompt" : "start");
      setTimeout(() => {
        this.introScreen.classList.remove("active", "fade-out");
      }, 450);
    }, durationMs);
  }

  updateAchButtonLabel() {
    this.achOpenBtn.textContent = `🏆 Thành tựu (${this.achievements.count()}/${ACHIEVEMENTS.length})`;
  }

  renderAchievements() {
    while (this.achList.firstChild) this.achList.removeChild(this.achList.firstChild);
    this.achCountText.textContent = `${this.achievements.count()}/${ACHIEVEMENTS.length} đã mở khóa`;

    for (const a of ACHIEVEMENTS) {
      const done = Boolean(this.achievements.unlocked[a.id]);
      const row = document.createElement("li");
      row.className = "ach-row" + (done ? " done" : "");

      const icon = document.createElement("span");
      icon.className = "ach-icon";
      icon.textContent = done ? a.icon : "🔒";

      const text = document.createElement("span");
      text.className = "ach-text";
      const title = document.createElement("strong");
      title.textContent = a.title;
      const desc = document.createElement("small");
      desc.textContent = a.desc;
      text.append(title, desc);

      row.append(icon, text);
      this.achList.appendChild(row);
    }
  }

  queueToast(achievement) {
    this.toastQueue.push(achievement);
    this.updateAchButtonLabel();
    if (!this.toastBusy) this.showNextToast();
  }

  showNextToast() {
    const next = this.toastQueue.shift();
    if (!next) {
      this.toastBusy = false;
      return;
    }
    this.toastBusy = true;
    this.achToast.textContent = `${next.icon} Thành tựu mới: ${next.title}`;
    this.achToast.classList.add("show");
    setTimeout(() => {
      this.achToast.classList.remove("show");
      setTimeout(() => this.showNextToast(), 350);
    }, 2600);
  }

  bindDifficultyButtons() {
    for (const btn of this.difficultyButtons) {
      btn.addEventListener("click", () => {
        const diffId = btn.dataset.difficulty;
        if (!GAME_CONFIG.DIFFICULTIES[diffId]) return;
        this.selectedDifficultyId = diffId;
        for (const item of this.difficultyButtons) {
          item.classList.toggle("active", item.dataset.difficulty === diffId);
        }
        btn.blur();
      });
    }
  }

  getSelectedDifficulty() {
    return GAME_CONFIG.DIFFICULTIES[this.selectedDifficultyId] || GAME_CONFIG.DIFFICULTIES.normal;
  }

  loadHighScore() {
    try {
      const saved = localStorage.getItem(GAME_CONFIG.HIGH_SCORE_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  saveHighScore(score) {
    try {
      localStorage.setItem(GAME_CONFIG.HIGH_SCORE_KEY, String(score));
    } catch {
      // Bỏ qua nếu trình duyệt chặn localStorage
    }
  }

  loadLeaderboard() {
    try {
      const raw = localStorage.getItem(GAME_CONFIG.LEADERBOARD_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && typeof item.score === "number" && item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, GAME_CONFIG.LEADERBOARD_LIMIT);
    } catch {
      return [];
    }
  }

  saveLeaderboard(entries) {
    try {
      localStorage.setItem(GAME_CONFIG.LEADERBOARD_KEY, JSON.stringify(entries));
    } catch {
      // Bỏ qua nếu trình duyệt chặn localStorage
    }
  }

  getTopScore() {
    const board = this.loadLeaderboard();
    const boardTop = board.length > 0 ? board[0].score : 0;
    return Math.max(this.loadHighScore(), boardTop);
  }

  qualifiesForLeaderboard(score) {
    if (score <= 0) return false;
    const board = this.loadLeaderboard();
    if (board.length < GAME_CONFIG.LEADERBOARD_LIMIT) return true;
    return score > board[board.length - 1].score;
  }

  loadLastPlayerName() {
    try {
      return localStorage.getItem(GAME_CONFIG.LAST_PLAYER_NAME_KEY) || "";
    } catch {
      return "";
    }
  }

  addLeaderboardEntry(name, score, wave, difficultyLabel) {
    const cleanName = (name || "").trim().slice(0, 16) || "Phi công";
    try {
      localStorage.setItem(GAME_CONFIG.LAST_PLAYER_NAME_KEY, cleanName);
    } catch {
      // Bỏ qua nếu trình duyệt chặn localStorage
    }

    const board = this.loadLeaderboard();
    board.push({
      name: cleanName,
      score,
      wave,
      difficulty: difficultyLabel || "Thường"
    });
    board.sort((a, b) => b.score - a.score);
    const trimmed = board.slice(0, GAME_CONFIG.LEADERBOARD_LIMIT);
    this.saveLeaderboard(trimmed);

    if (trimmed.length > 0 && trimmed[0].score > this.loadHighScore()) {
      this.saveHighScore(trimmed[0].score);
    }
    return trimmed;
  }

  renderLeaderboard(listElement) {
    if (!listElement) return;
    while (listElement.firstChild) {
      listElement.removeChild(listElement.firstChild);
    }

    const entries = this.loadLeaderboard();
    if (entries.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.className = "leaderboard-empty";
      emptyLi.textContent = "Chưa có kỷ lục nào — hãy là người đầu tiên!";
      listElement.appendChild(emptyLi);
      return;
    }

    entries.forEach((entry, index) => {
      const li = document.createElement("li");
      li.className = "leaderboard-row";

      const nameSpan = document.createElement("span");
      nameSpan.className = "lb-name";
      nameSpan.textContent = `#${index + 1} ${entry.name}`;

      const rightSpan = document.createElement("span");
      rightSpan.className = "lb-meta";

      const scoreStrong = document.createElement("span");
      scoreStrong.className = "lb-score";
      scoreStrong.textContent = `${entry.score}đ`;

      const detailText = document.createTextNode(` • Đợt ${entry.wave} (${entry.difficulty})`);
      rightSpan.appendChild(scoreStrong);
      rightSpan.appendChild(detailText);

      li.appendChild(nameSpan);
      li.appendChild(rightSpan);
      listElement.appendChild(li);
    });
  }

  updateSoundButton() {
    // Giữ lại để tương thích ngược; điều khiển âm thanh nằm trong menu Cài đặt
  }

  showNowPlaying(trackTitle, durationMs = 3000) {
    if (!this.musicToast || !trackTitle) return;
    if (this.musicToastTimer) {
      clearTimeout(this.musicToastTimer);
      this.musicToastTimer = null;
    }
    this.musicToast.textContent = `🎵 Đang phát: ${trackTitle}`;
    this.musicToast.classList.add("show");
    this.musicToastTimer = setTimeout(() => {
      this.musicToast.classList.remove("show");
      this.musicToastTimer = null;
    }, durationMs);
  }

  hideNowPlaying() {
    if (this.musicToastTimer) {
      clearTimeout(this.musicToastTimer);
      this.musicToastTimer = null;
    }
    if (this.musicToast) {
      this.musicToast.classList.remove("show");
    }
  }

  updateHUD(score, highScore, wave, hp, maxHp) {
    this.scoreDisplay.textContent = score;
    this.highScoreDisplay.textContent = highScore;
    this.waveDisplay.textContent = wave;
    this.achievements.trackProgress(score, wave);

    const percent = Math.max(0, (hp / maxHp) * 100);
    this.hpBarFill.style.width = `${percent}%`;
    this.hpText.textContent = `${hp}/${maxHp}`;

    if (percent > 60) {
      this.hpBarFill.style.background = "linear-gradient(90deg, #22c55e, #4ade80)";
    } else if (percent > 30) {
      this.hpBarFill.style.background = "linear-gradient(90deg, #eab308, #facc15)";
    } else {
      this.hpBarFill.style.background = "linear-gradient(90deg, #dc2626, #f87171)";
    }
  }

  showScreen(state, summary = {}) {
    if (this.resetPromptScreen) this.resetPromptScreen.classList.remove("active");
    this.startScreen.classList.remove("active");
    this.pauseScreen.classList.remove("active");
    if (this.settingsScreen) this.settingsScreen.classList.remove("active");
    this.gameOverScreen.classList.remove("active");
    this.achScreen.classList.remove("active");

    if (this.pauseMenuBtn) {
      const inGame = state === "playing" || state === "paused" || state === "settings";
      this.pauseMenuBtn.style.display = inGame ? "inline-flex" : "none";
    }

    if (state === "resetPrompt") {
      if (this.resetPromptSummary) {
        const topScore = this.getTopScore();
        const achCount = this.achievements.count();
        this.resetPromptSummary.textContent = `Kỷ lục: ${topScore} điểm • Thành tựu: ${achCount}/${ACHIEVEMENTS.length}`;
      }
      if (this.resetPromptScreen) this.resetPromptScreen.classList.add("active");
    } else if (state === "start") {
      this.renderLeaderboard(this.startLeaderboardList);
      this.startScreen.classList.add("active");
    } else if (state === "paused") {
      this.pauseScreen.classList.add("active");
    } else if (state === "settings") {
      if (this.settingsScreen) this.settingsScreen.classList.add("active");
    } else if (state === "gameover") {
      const finalScore = summary.score || 0;
      const finalWave = summary.wave || 1;
      const diffLabel = summary.difficultyLabel || "Thường";

      this.finalScoreText.textContent = finalScore;
      this.finalWaveText.textContent = finalWave;
      this.finalDifficultyText.textContent = diffLabel;

      const canSave = Boolean(summary.canSaveLeaderboard);
      this.nameEntryBox.classList.toggle("visible", canSave);
      if (canSave) {
        this.playerNameInput.value = this.loadLastPlayerName();
        this.saveScoreBtn.disabled = false;
        this.saveScoreBtn.textContent = "LƯU ĐIỂM";
      }

      this.renderLeaderboard(this.gameOverLeaderboardList);
      this.gameOverScreen.classList.add("active");
    }
  }
}
