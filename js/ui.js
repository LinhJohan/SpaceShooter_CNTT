// Quản lý giao diện (HUD, Độ khó, Start/Pause/Game Over, Bảng xếp hạng Top 5)
class GameUI {
  constructor() {
    this.scoreDisplay = document.getElementById("scoreDisplay");
    this.highScoreDisplay = document.getElementById("highScoreDisplay");
    this.waveDisplay = document.getElementById("waveDisplay");
    this.hpBarFill = document.getElementById("hpBarFill");
    this.hpText = document.getElementById("hpText");
    this.soundBtn = document.getElementById("soundBtn");

    this.startScreen = document.getElementById("startScreen");
    this.pauseScreen = document.getElementById("pauseScreen");
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

    this.bindDifficultyButtons();
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

  updateSoundButton(isMuted) {
    if (!this.soundBtn) return;
    this.soundBtn.textContent = isMuted ? "🔇" : "🔊";
    this.soundBtn.classList.toggle("active", !isMuted);
  }

  updateHUD(score, highScore, wave, hp, maxHp) {
    this.scoreDisplay.textContent = score;
    this.highScoreDisplay.textContent = highScore;
    this.waveDisplay.textContent = wave;

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
    this.startScreen.classList.remove("active");
    this.pauseScreen.classList.remove("active");
    this.gameOverScreen.classList.remove("active");

    if (state === "start") {
      this.renderLeaderboard(this.startLeaderboardList);
      this.startScreen.classList.add("active");
    } else if (state === "paused") {
      this.pauseScreen.classList.add("active");
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
