// Hiệu ứng nền vũ trụ ngẫu nhiên mờ phía sau: dải tinh vân, tinh vân, sao băng, hành tinh và trường sao
class SpaceBackground {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.reset();
  }

  _rand(min, max) {
    return min + Math.random() * (max - min);
  }

  reset() {
    this.stars = this._createStars(70);
    this.nebulaBand = this._createNebulaBand();
    this.nebulae = this._createInitialNebulae();
    this.planets = [];
    this.shootingStars = [];

    // Thỉnh thoảng có sẵn 1 hành tinh ở xa khi bắt đầu màn
    if (Math.random() < 0.45) {
      this.planets.push(this._createPlanet(this._rand(40, this.height * 0.45)));
    }

    this.nextNebulaTimer = this._rand(140, 420);
    this.nextPlanetTimer = this._rand(240, 780);
    this.nextShootingStarTimer = this._rand(120, 420);
  }

  _createStars(count) {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() < 0.3 ? 2 : 1.2,
        speed: 0.6 + Math.random() * 1.8
      });
    }
    return list;
  }

  _createNebulaBand() {
    const bandPalettes = [
      ["56, 189, 248", "99, 102, 241"],
      ["168, 85, 247", "59, 130, 246"],
      ["20, 184, 166", "129, 140, 248"],
      ["236, 72, 153", "99, 102, 241"]
    ];
    const palette = bandPalettes[Math.floor(Math.random() * bandPalettes.length)];
    const angle = this._rand(-0.55, 0.55);
    const centerX = this._rand(this.width * 0.25, this.width * 0.75);
    const bandWidth = this._rand(110, 165);

    // Các cụm mây sáng tạo nên dải tinh vân chéo mờ
    const clouds = [];
    const cloudCount = 7;
    for (let i = 0; i < cloudCount; i++) {
      const t = (i / (cloudCount - 1)) - 0.5;
      clouds.push({
        offsetAlong: t * this.height * 1.15 + this._rand(-30, 30),
        offsetAcross: this._rand(-bandWidth * 0.35, bandWidth * 0.35),
        radius: this._rand(bandWidth * 0.7, bandWidth * 1.15),
        alpha: this._rand(0.035, 0.065),
        color: i % 2 === 0 ? palette[0] : palette[1]
      });
    }

    // Các vì sao nhỏ mờ nằm rải rác dọc theo dải tinh vân
    const microStars = [];
    const microCount = 68;
    for (let i = 0; i < microCount; i++) {
      const spread = (Math.random() + Math.random() - 1) * bandWidth * 0.65;
      microStars.push({
        along: this._rand(-this.height * 0.75, this.height * 0.75),
        across: spread,
        size: this._rand(0.65, 1.2),
        alpha: this._rand(0.12, 0.36),
        twinklePhase: this._rand(0, Math.PI * 2),
        twinkleSpeed: this._rand(0.015, 0.04)
      });
    }

    return {
      centerX,
      centerY: this.height * 0.5,
      angle,
      driftY: 0,
      speedY: 0.08,
      clouds,
      microStars
    };
  }

  _randomColorRgb() {
    const hue = Math.floor(Math.random() * 360);
    // Chuyển HSL bão hòa vừa sang RGB để tinh vân đa dạng nhưng dịu mắt
    const s = 0.68;
    const l = 0.6;
    const k = (n) => (n + hue / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
    return `${f(0)}, ${f(8)}, ${f(4)}`;
  }

  _createNebula(yOverride = null) {
    const radius = this._rand(110, 210);
    const scaleY = this._rand(0.7, 1.25);
    return {
      x: this._rand(20, this.width - 20),
      y: yOverride !== null ? yOverride : -radius * scaleY - this._rand(20, 100),
      radius,
      speedY: this._rand(0.11, 0.25),
      alpha: this._rand(0.05, 0.11),
      c1: this._randomColorRgb(),
      c2: this._randomColorRgb(),
      scaleX: this._rand(0.8, 1.45),
      scaleY,
      rotation: this._rand(0, Math.PI * 2)
    };
  }

  _createInitialNebulae() {
    const count = 1 + Math.floor(Math.random() * 2); // 1 hoặc 2 tinh vân ban đầu ngẫu nhiên
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(this._createNebula(this._rand(50, this.height - 80)));
    }
    return list;
  }

  _createPlanet(yOverride = null) {
    const styles = [
      { kind: "ringed", base: "#38bdf8", shade: "#0c4a6e", rim: "#7dd3fc", ring: "rgba(186, 230, 253, 0.45)" },
      { kind: "ringed", base: "#f472b6", shade: "#831843", rim: "#fbcfe8", ring: "rgba(251, 207, 232, 0.38)" },
      { kind: "gas", base: "#c084fc", shade: "#4c1d95", rim: "#e9d5ff", band: "rgba(243, 232, 255, 0.22)" },
      { kind: "gas", base: "#2dd4bf", shade: "#134e4a", rim: "#99f6e4", band: "rgba(204, 251, 241, 0.2)" },
      { kind: "rocky", base: "#94a3b8", shade: "#1e293b", rim: "#cbd5e1", crater: "rgba(15, 23, 42, 0.32)" },
      { kind: "warm", base: "#fb923c", shade: "#7c2d12", rim: "#fed7aa", band: "rgba(254, 215, 170, 0.2)" }
    ];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const radius = this._rand(22, 56);
    return {
      x: this._rand(radius + 16, this.width - radius - 16),
      y: yOverride !== null ? yOverride : -radius - this._rand(35, 90),
      radius,
      speedY: this._rand(0.18, 0.38),
      alpha: this._rand(0.15, 0.26),
      tilt: this._rand(-0.55, 0.55),
      style
    };
  }

  _createShootingStar() {
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? this._rand(-20, this.width * 0.45) : this._rand(this.width * 0.55, this.width + 20);
    const startY = this._rand(15, this.height * 0.48);
    const speed = this._rand(7.5, 13);
    const angle = fromLeft ? this._rand(0.4, 0.9) : this._rand(Math.PI - 0.9, Math.PI - 0.4);
    return {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: this._rand(45, 90),
      life: 0,
      maxLife: this._rand(26, 46),
      alpha: this._rand(0.32, 0.54)
    };
  }

  updateAndDraw(ctx, dtFactor, shouldMove) {
    // 1. Dải tinh vân với các vì sao nhỏ mờ ở lớp xa nhất
    this._updateAndDrawNebulaBand(ctx, dtFactor, shouldMove);

    // 2. Tinh vân ngẫu nhiên
    if (shouldMove) {
      this.nextNebulaTimer -= dtFactor;
      if (this.nextNebulaTimer <= 0 && this.nebulae.length < 3) {
        this.nebulae.push(this._createNebula());
        this.nextNebulaTimer = this._rand(240, 560);
      }
    }
    for (let i = this.nebulae.length - 1; i >= 0; i--) {
      const neb = this.nebulae[i];
      if (shouldMove) {
        neb.y += neb.speedY * dtFactor;
      }
      this._drawNebula(ctx, neb);
      if (neb.y - neb.radius * Math.max(neb.scaleX, neb.scaleY) > this.height + 50) {
        this.nebulae.splice(i, 1);
      }
    }

    // 3. Hành tinh xuất hiện ngẫu nhiên và trôi chậm phía sau
    if (shouldMove) {
      this.nextPlanetTimer -= dtFactor;
      if (this.nextPlanetTimer <= 0 && this.planets.length < 2) {
        this.planets.push(this._createPlanet());
        this.nextPlanetTimer = this._rand(600, 1440);
      }
    }
    for (let i = this.planets.length - 1; i >= 0; i--) {
      const planet = this.planets[i];
      if (shouldMove) {
        planet.y += planet.speedY * dtFactor;
      }
      this._drawPlanet(ctx, planet);
      if (planet.y - planet.radius - 40 > this.height) {
        this.planets.splice(i, 1);
      }
    }

    // 4. Trường sao chính
    ctx.fillStyle = "#e2e8f0";
    for (const star of this.stars) {
      if (shouldMove) {
        star.y += star.speed * dtFactor;
        if (star.y > this.height) {
          star.y = 0;
          star.x = Math.random() * this.width;
        }
      }
      ctx.globalAlpha = star.size > 1.5 ? 0.85 : 0.45;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;

    // 5. Sao băng thỉnh thoảng vụt qua
    if (shouldMove) {
      this.nextShootingStarTimer -= dtFactor;
      if (this.nextShootingStarTimer <= 0) {
        this.shootingStars.push(this._createShootingStar());
        this.nextShootingStarTimer = this._rand(220, 620);
      }
    }
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      if (shouldMove) {
        s.x += s.vx * dtFactor;
        s.y += s.vy * dtFactor;
        s.life += dtFactor;
      }
      this._drawShootingStar(ctx, s);
      if (s.life >= s.maxLife) {
        this.shootingStars.splice(i, 1);
      }
    }
  }

  _updateAndDrawNebulaBand(ctx, dtFactor, shouldMove) {
    const band = this.nebulaBand;
    if (shouldMove) {
      band.driftY = (band.driftY + band.speedY * dtFactor) % (this.height * 1.5);
    }

    ctx.save();
    ctx.translate(band.centerX, band.centerY);
    ctx.rotate(band.angle);

    for (const cloud of band.clouds) {
      const grad = ctx.createRadialGradient(
        cloud.offsetAcross,
        cloud.offsetAlong,
        cloud.radius * 0.1,
        cloud.offsetAcross,
        cloud.offsetAlong,
        cloud.radius
      );
      grad.addColorStop(0, `rgba(${cloud.color}, ${cloud.alpha})`);
      grad.addColorStop(0.55, `rgba(${cloud.color}, ${cloud.alpha * 0.4})`);
      grad.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cloud.offsetAcross, cloud.offsetAlong, cloud.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#e2e8f0";
    for (const ms of band.microStars) {
      if (shouldMove) {
        ms.twinklePhase += ms.twinkleSpeed * dtFactor;
      }
      const twinkle = 0.65 + 0.35 * Math.sin(ms.twinklePhase);
      ctx.globalAlpha = ms.alpha * twinkle;
      ctx.fillRect(ms.across, ms.along, ms.size, ms.size);
    }

    ctx.restore();
  }

  _drawNebula(ctx, neb) {
    ctx.save();
    ctx.translate(neb.x, neb.y);
    ctx.rotate(neb.rotation);
    ctx.scale(neb.scaleX, neb.scaleY);

    const grad = ctx.createRadialGradient(0, 0, neb.radius * 0.08, 0, 0, neb.radius);
    grad.addColorStop(0, `rgba(${neb.c1}, ${neb.alpha})`);
    grad.addColorStop(0.5, `rgba(${neb.c2}, ${neb.alpha * 0.55})`);
    grad.addColorStop(1, "rgba(2, 6, 23, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, neb.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawPlanet(ctx, planet) {
    const { x, y, radius, alpha, tilt, style } = planet;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);

    if (style.kind === "ringed") {
      ctx.save();
      ctx.rotate(tilt);
      ctx.strokeStyle = style.ring;
      ctx.lineWidth = Math.max(3, radius * 0.14);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.85, radius * 0.42, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.clip();

    const sphereGrad = ctx.createRadialGradient(
      -radius * 0.32,
      -radius * 0.32,
      radius * 0.1,
      0,
      0,
      radius * 1.15
    );
    sphereGrad.addColorStop(0, style.rim);
    sphereGrad.addColorStop(0.42, style.base);
    sphereGrad.addColorStop(1, style.shade);
    ctx.fillStyle = sphereGrad;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

    if (style.kind === "gas" || style.kind === "warm") {
      ctx.fillStyle = style.band;
      ctx.fillRect(-radius, -radius * 0.42, radius * 2, radius * 0.18);
      ctx.fillRect(-radius, radius * 0.08, radius * 2, radius * 0.14);
    } else if (style.kind === "rocky") {
      ctx.fillStyle = style.crater;
      ctx.beginPath();
      ctx.arc(-radius * 0.25, -radius * 0.15, radius * 0.16, 0, Math.PI * 2);
      ctx.arc(radius * 0.28, radius * 0.22, radius * 0.22, 0, Math.PI * 2);
      ctx.arc(radius * 0.1, -radius * 0.38, radius * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (style.kind === "ringed") {
      ctx.save();
      ctx.rotate(tilt);
      ctx.strokeStyle = style.ring;
      ctx.lineWidth = Math.max(3, radius * 0.14);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.85, radius * 0.42, 0, 0, Math.PI);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  _drawShootingStar(ctx, s) {
    const progress = s.life / s.maxLife;
    const fade = progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);
    const alpha = s.alpha * fade;
    if (alpha <= 0.01) return;

    const mag = Math.hypot(s.vx, s.vy) || 1;
    const tailX = s.x - (s.vx / mag) * s.length;
    const tailY = s.y - (s.vy / mag) * s.length;

    ctx.save();
    const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
    grad.addColorStop(0, `rgba(224, 242, 254, ${alpha})`);
    grad.addColorStop(0.35, `rgba(56, 189, 248, ${alpha * 0.55})`);
    grad.addColorStop(1, "rgba(56, 189, 248, 0)");

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
