// Cấu hình chung toàn bộ thông số game (dễ chỉnh sửa và giải thích khi bảo vệ)
const GAME_CONFIG = {
  CANVAS_WIDTH: 480,
  CANVAS_HEIGHT: 680,

  // Thông số phi thuyền người chơi
  PLAYER: {
    WIDTH: 44,
    HEIGHT: 48,
    SPEED: 5.2,
    MAX_HP: 3,
    SHOOT_COOLDOWN_MS: 180,     // Khoảng cách giữa 2 phát bắn (mili-giây)
    INVINCIBLE_MS: 1200         // Thời gian miễn nhiễm sát thương sau khi trúng đạn
  },

  // Thông số đạn người chơi
  BULLET: {
    WIDTH: 5,
    HEIGHT: 16,
    SPEED: 9
  },

  // Thông số quái vật thường
  ENEMY: {
    BASE_SPAWN_MS: 1100,        // Tốc độ sinh quái ban đầu
    MIN_SPAWN_MS: 380,          // Nhanh nhất khi lên wave cao
    SCORE_PER_KILL: 10
  },

  // Cấu hình 3 mức độ khó
  DIFFICULTIES: {
    easy: {
      id: "easy",
      label: "Dễ",
      playerMaxHp: 5,
      enemySpeedMul: 0.8,
      spawnRateMul: 1.25,       // Hệ số giãn cách sinh quái (> 1 nghĩa là ra thưa hơn)
      enemyHpMul: 1.0,
      bossHpMul: 0.75,
      scoreMul: 0.8
    },
    normal: {
      id: "normal",
      label: "Thường",
      playerMaxHp: 3,
      enemySpeedMul: 1.0,
      spawnRateMul: 1.0,
      enemyHpMul: 1.0,
      bossHpMul: 1.0,
      scoreMul: 1.0
    },
    hard: {
      id: "hard",
      label: "Khó",
      playerMaxHp: 2,
      enemySpeedMul: 1.25,
      spawnRateMul: 0.8,        // Hệ số giãn cách nhỏ hơn => quái ra dày hơn
      enemyHpMul: 1.5,
      bossHpMul: 1.35,
      scoreMul: 1.5
    }
  },

  // Thông số Boss xuất hiện định kỳ
  BOSS: {
    EVERY_WAVES: 5,             // Mỗi 5 đợt gặp Boss 1 lần
    WIDTH: 112,
    HEIGHT: 76,
    BASE_HP: 36,
    HP_PER_APPEARANCE: 22,
    SPEED_X: 2.2,
    SHOOT_INTERVAL_MS: 1150,
    BULLET_SPEED: 4.4,
    SCORE_REWARD: 150
  },

  // Thông số vật phẩm rơi (Power-up)
  POWERUP: {
    SIZE: 28,
    SPEED_Y: 2.1,
    DROP_CHANCE: 0.22,          // 22% rơi vật phẩm khi diệt quái
    WEAPON_DURATION_MS: 10000,  // Đạn nâng cấp giữ trong 10 giây
    SHIELD_DURATION_MS: 8000    // Khiên bảo vệ giữ trong 8 giây
  },

  // Khóa lưu trữ trên trình duyệt (localStorage)
  HIGH_SCORE_KEY: "space_shooter_cntt_highscore",
  LEADERBOARD_KEY: "space_shooter_cntt_leaderboard_v2",
  LEADERBOARD_LIMIT: 5,
  LAST_PLAYER_NAME_KEY: "space_shooter_cntt_last_name",
  SOUND_MUTED_KEY: "space_shooter_cntt_muted",
  MUSIC: {
    NORMAL_SRC: "audio/bgm_normal.mp3",
    UNDERSCORE_SRC: "audio/bgm_underscore.mp3",
    VOLUME: 0.45,
    CROSSFADE_MS: 600,
    SYNC_THRESHOLD_SEC: 0.04
  }
};
