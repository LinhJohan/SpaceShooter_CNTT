// 3 mẫu phi thuyền (chỉ số + hình dạng). File riêng để không đụng code của người khác.
const SHIP_STORAGE_KEY = "space_shooter_cntt_ship";

const SHIP_MODELS = {
  phantom: {
    id: "phantom", name: "Phantom", desc: "Cân bằng",
    speedMul: 1, hpBonus: 0, cooldownMul: 1,
    body: "#38bdf8", wing: "#0284c7"
  },
  falcon: {
    id: "falcon", name: "Falcon", desc: "Nhanh, bắn dày, -1 máu",
    speedMul: 1.25, hpBonus: -1, cooldownMul: 0.8,
    body: "#a3e635", wing: "#4d7c0f"
  },
  titan: {
    id: "titan", name: "Titan", desc: "Trâu bò +1 máu, chậm",
    speedMul: 0.8, hpBonus: 1, cooldownMul: 1.15,
    body: "#fb923c", wing: "#c2410c"
  }
};

// Vẽ phi thuyền (dùng chung cho Player trong game và ảnh xem trước ở menu chọn tàu)
function drawShipShape(ctx, ship, x, y, w, h, opts = {}) {
  const cx = x + w / 2;
  const top = y;
  const bottom = y + h;
  const wing = opts.wing || ship.wing;
  const body = opts.body || ship.body;
  const flameLen = opts.flameLen !== undefined ? opts.flameLen : 10 + Math.random() * 8;

  // Ngọn lửa động cơ
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(cx - 7, bottom - 4);
  ctx.lineTo(cx + 7, bottom - 4);
  ctx.lineTo(cx, bottom + flameLen);
  ctx.closePath();
  ctx.fill();

  // Cánh
  ctx.fillStyle = wing;
  ctx.beginPath();
  if (ship.id === "falcon") {
    ctx.moveTo(cx, top + 8);
    ctx.lineTo(x + w, bottom);
    ctx.lineTo(cx + 5, bottom - 12);
    ctx.lineTo(cx - 5, bottom - 12);
    ctx.lineTo(x, bottom);
  } else if (ship.id === "titan") {
    ctx.moveTo(cx - 10, top + 14);
    ctx.lineTo(cx + 10, top + 14);
    ctx.lineTo(x + w, bottom - 14);
    ctx.lineTo(x + w - 4, bottom);
    ctx.lineTo(cx + 10, bottom - 8);
    ctx.lineTo(cx - 10, bottom - 8);
    ctx.lineTo(x + 4, bottom);
    ctx.lineTo(x, bottom - 14);
  } else {
    ctx.moveTo(cx, top + 10);
    ctx.lineTo(x + w, bottom - 4);
    ctx.lineTo(cx + 8, bottom - 10);
    ctx.lineTo(cx - 8, bottom - 10);
    ctx.lineTo(x, bottom - 4);
  }
  ctx.closePath();
  ctx.fill();

  // Thân
  ctx.fillStyle = body;
  ctx.beginPath();
  if (ship.id === "falcon") {
    ctx.moveTo(cx, top);
    ctx.lineTo(cx + 7, bottom - 6);
    ctx.lineTo(cx - 7, bottom - 6);
  } else if (ship.id === "titan") {
    ctx.moveTo(cx - 5, top + 2);
    ctx.lineTo(cx + 5, top + 2);
    ctx.lineTo(cx + 13, bottom - 6);
    ctx.lineTo(cx - 13, bottom - 6);
  } else {
    ctx.moveTo(cx, top);
    ctx.lineTo(cx + 10, bottom - 6);
    ctx.lineTo(cx - 10, bottom - 6);
  }
  ctx.closePath();
  ctx.fill();

  // Buồng lái
  ctx.fillStyle = "#e0f2fe";
  ctx.beginPath();
  ctx.ellipse(cx, top + 20, 4, 8, 0, 0, Math.PI * 2);
  ctx.fill();
}
