// Lớp Đạn của người chơi (hỗ trợ bay thẳng và bay chéo khi nâng cấp đa tia)
class PlayerBullet {
  constructor(x, y, vx = 0, vy = -GAME_CONFIG.BULLET.SPEED, color = "#38bdf8") {
    this.width = GAME_CONFIG.BULLET.WIDTH;
    this.height = GAME_CONFIG.BULLET.HEIGHT;
    this.x = x - this.width / 2;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.active = true;
  }

  update(dtFactor) {
    this.x += this.vx * dtFactor;
    this.y += this.vy * dtFactor;

    if (
      this.y + this.height < 0 ||
      this.y > GAME_CONFIG.CANVAS_HEIGHT + 20 ||
      this.x + this.width < -20 ||
      this.x > GAME_CONFIG.CANVAS_WIDTH + 20
    ) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.save();
    // Vẽ tia laser sáng
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Lõi trắng giữa viên đạn
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(this.x + 1, this.y + 2, this.width - 2, this.height - 4);
    ctx.restore();
  }
}

// Lớp Phi thuyền của người chơi
class Player {
  constructor() {
    this.width = GAME_CONFIG.PLAYER.WIDTH;
    this.height = GAME_CONFIG.PLAYER.HEIGHT;
    this.speed = GAME_CONFIG.PLAYER.SPEED;
    this.maxHp = GAME_CONFIG.PLAYER.MAX_HP;
    this.autoFire = true; // Mặc định tự động bắn cho đỡ mỏi tay giữ Space
    this.weaponLevel = 1;
    this.weaponBoostUntil = 0;
    this.shieldUntil = 0;
    this.reset();
  }

  applyDifficulty(diffConfig) {
    this.maxHp = diffConfig.playerMaxHp;
  }

  reset() {
    this.x = (GAME_CONFIG.CANVAS_WIDTH - this.width) / 2;
    this.y = GAME_CONFIG.CANVAS_HEIGHT - this.height - 28;
    this.hp = this.maxHp;
    this.weaponLevel = 1;
    this.weaponBoostUntil = 0;
    this.shieldUntil = 0;
    this.lastShotTime = 0;
    this.invincibleUntil = 0;
    this.bullets = [];
  }

  clampPosition() {
    if (this.x < 8) this.x = 8;
    if (this.x + this.width > GAME_CONFIG.CANVAS_WIDTH - 8) {
      this.x = GAME_CONFIG.CANVAS_WIDTH - this.width - 8;
    }
    if (this.y < 12) this.y = 12;
    if (this.y + this.height > GAME_CONFIG.CANVAS_HEIGHT - 10) {
      this.y = GAME_CONFIG.CANVAS_HEIGHT - this.height - 10;
    }
  }

  moveTo(canvasX, canvasY) {
    this.x = canvasX - this.width / 2;
    this.y = canvasY - this.height / 2;
    this.clampPosition();
  }

  upgradeWeapon(currentTime) {
    this.weaponLevel = Math.min(3, this.weaponLevel + 1);
    this.weaponBoostUntil = currentTime + GAME_CONFIG.POWERUP.WEAPON_DURATION_MS;
    return this.weaponLevel;
  }

  activateShield(currentTime) {
    this.shieldUntil = currentTime + GAME_CONFIG.POWERUP.SHIELD_DURATION_MS;
  }

  heal(amount = 1) {
    const before = this.hp;
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return this.hp > before;
  }

  hasShield(currentTime) {
    return currentTime < this.shieldUntil;
  }

  spawnBullets() {
    const cx = this.x + this.width / 2;
    const topY = this.y - 6;
    const speed = GAME_CONFIG.BULLET.SPEED;

    if (this.weaponLevel === 1) {
      this.bullets.push(new PlayerBullet(cx, topY, 0, -speed, "#38bdf8"));
    } else if (this.weaponLevel === 2) {
      this.bullets.push(new PlayerBullet(cx - 11, topY + 4, 0, -speed, "#facc15"));
      this.bullets.push(new PlayerBullet(cx + 11, topY + 4, 0, -speed, "#facc15"));
    } else {
      this.bullets.push(new PlayerBullet(cx, topY, 0, -speed, "#f472b6"));
      this.bullets.push(new PlayerBullet(cx - 10, topY + 6, -1.7, -speed * 0.96, "#f472b6"));
      this.bullets.push(new PlayerBullet(cx + 10, topY + 6, 1.7, -speed * 0.96, "#f472b6"));
    }
  }

  update(inputState, currentTime, dtFactor) {
    // Hạ cấp đạn về 1 khi hết thời gian nâng cấp
    if (this.weaponLevel > 1 && currentTime >= this.weaponBoostUntil) {
      this.weaponLevel = 1;
    }

    let moveX = 0;
    let moveY = 0;

    if (inputState.left) moveX -= 1;
    if (inputState.right) moveX += 1;
    if (inputState.up) moveY -= 1;
    if (inputState.down) moveY += 1;

    // Chuẩn hóa đường chéo để đi chéo không nhanh hơn đi thẳng
    if (moveX !== 0 && moveY !== 0) {
      const invSqrt2 = 0.7071;
      moveX *= invSqrt2;
      moveY *= invSqrt2;
    }

    this.x += moveX * this.speed * dtFactor;
    this.y += moveY * this.speed * dtFactor;
    this.clampPosition();

    // Bắn đạn khi bật Tự bắn, hoặc khi giữ Space / giữ chuột
    let didShoot = false;
    if (this.autoFire || inputState.shoot) {
      if (currentTime - this.lastShotTime >= GAME_CONFIG.PLAYER.SHOOT_COOLDOWN_MS) {
        this.spawnBullets();
        this.lastShotTime = currentTime;
        didShoot = true;
      }
    }

    // Cập nhật vị trí toàn bộ đạn đang bay
    for (const bullet of this.bullets) {
      bullet.update(dtFactor);
    }
    this.bullets = this.bullets.filter((b) => b.active);

    return didShoot;
  }

  takeDamage(currentTime) {
    if (currentTime < this.invincibleUntil) {
      return "ignored";
    }
    if (this.hasShield(currentTime)) {
      this.shieldUntil = 0;
      this.invincibleUntil = currentTime + 650;
      return "shield";
    }
    this.hp = Math.max(0, this.hp - 1);
    this.invincibleUntil = currentTime + GAME_CONFIG.PLAYER.INVINCIBLE_MS;
    return "damaged";
  }

  draw(ctx, currentTime) {
    for (const bullet of this.bullets) {
      bullet.draw(ctx);
    }

    // Nhấp nháy khi vừa bị trúng đạn
    if (currentTime < this.invincibleUntil && Math.floor(currentTime / 90) % 2 === 0) {
      return;
    }

    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const top = this.y;
    const bottom = this.y + this.height;

    ctx.save();

    // Đổi màu điểm nhấn theo cấp vũ khí đang dùng
    const wingColor = this.weaponLevel === 3 ? "#db2777" : this.weaponLevel === 2 ? "#ca8a04" : "#0284c7";
    const bodyColor = this.weaponLevel === 3 ? "#f472b6" : this.weaponLevel === 2 ? "#facc15" : "#38bdf8";

    // Ngọn lửa động cơ phía sau nhấp nháy
    const flameLen = 10 + Math.random() * 8;
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(cx - 7, bottom - 4);
    ctx.lineTo(cx + 7, bottom - 4);
    ctx.lineTo(cx, bottom + flameLen);
    ctx.closePath();
    ctx.fill();

    // Cánh phi thuyền
    ctx.fillStyle = wingColor;
    ctx.beginPath();
    ctx.moveTo(cx, top + 10);
    ctx.lineTo(this.x + this.width, bottom - 4);
    ctx.lineTo(cx + 8, bottom - 10);
    ctx.lineTo(cx - 8, bottom - 10);
    ctx.lineTo(this.x, bottom - 4);
    ctx.closePath();
    ctx.fill();

    // Thân chính phi thuyền
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(cx, top);
    ctx.lineTo(cx + 10, bottom - 6);
    ctx.lineTo(cx - 10, bottom - 6);
    ctx.closePath();
    ctx.fill();

    // Buồng lái kính sáng
    ctx.fillStyle = "#e0f2fe";
    ctx.beginPath();
    ctx.ellipse(cx, top + 20, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vòng khiên bảo vệ nếu đang bật
    if (this.hasShield(currentTime)) {
      const remaining = this.shieldUntil - currentTime;
      const shouldDrawShield = remaining > 2000 || Math.floor(currentTime / 110) % 2 === 0;
      if (shouldDrawShield) {
        ctx.strokeStyle = "#22d3ee";
        ctx.fillStyle = "rgba(34, 211, 238, 0.14)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(this.width, this.height) * 0.68, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}
