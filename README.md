# Chiến Cơ Vũ Trụ 2D — Đồ án Nhập môn CNTT

## Cách chạy game
- Mở trực tiếp file `index.html` bằng trình duyệt bất kỳ (Chrome, Edge, Safari, Firefox) — **không cần cài đặt thêm công cụ nào**.
- Điều khiển:
  - Di chuyển: Phím mũi tên, `W A S D`, hoặc nhấn giữ kéo chuột / cảm ứng
  - Bắn đạn: Tự động bắn (bật/tắt bằng phím `F` hoặc nút trên HUD), hoặc giữ `Space`
  - Âm thanh: Bật/tắt bằng phím `M` hoặc nút loa trên HUD
  - Tạm dừng: `P` hoặc `ESC`

## Cấu trúc thư mục
- `index.html`: Khung giao diện, màn hình chọn độ khó và bảng xếp hạng Top 5
- `style.css`: Giao diện nền không gian, thanh máu/điểm (HUD), màn hình phủ
- `js/config.js`: Hằng số cấu hình độ khó, phi thuyền, Boss, vật phẩm rơi và `localStorage`
- `js/sound.js`: Bộ tổng hợp hiệu ứng âm thanh bằng Web Audio API (không phụ thuộc file âm thanh ngoài)
- `js/player.js`: Logic phi thuyền, đạn 1–3 tia và khiên bảo vệ
- `js/enemy.js`: Logic quái thường, quái zigzag, Boss, đạn địch, vật phẩm rơi và hiệu ứng nổ
- `js/ui.js`: Quản lý giao diện, chọn độ khó và bảng xếp hạng Top 5 qua `localStorage`
- `js/main.js`: Vòng lặp game (`requestAnimationFrame`), xử lý va chạm và ghép các thành phần

## Lộ trình 3 chặng
- **Chặng 1 (Đã hoàn thành):** Điều khiển tàu, bắn đạn, quái thường + quái zigzag, tính điểm, wave, kỷ lục, Game Over.
- **Chặng 2 (Đã hoàn thành):** Vật phẩm rơi (hồi máu `+`, nâng cấp đạn 2–3 tia `W`, khiên bảo vệ `S`), Boss xuất hiện mỗi 5 wave có thanh máu riêng & bắn đạn, hiệu ứng âm thanh Web Audio API, Menu chọn độ khó (Dễ / Thường / Khó) và Bảng xếp hạng Top 5 có nhập tên.
- **Chặng 3 (Đóng gói bảo vệ):** Đưa lên GitHub Pages / Netlify lấy link chơi online cho cả nhóm và thầy, hoàn thiện báo cáo Word + slide, tập trả lời câu hỏi vấn đáp cho 5 thành viên.
