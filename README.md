# Chiến Cơ Vũ Trụ 2D — Đồ án Nhập môn CNTT (Nhóm 2)

**Chơi trực tiếp trên trình duyệt (PC & điện thoại):** [https://linhjohan.github.io/SpaceShooter_CNTT/](https://linhjohan.github.io/SpaceShooter_CNTT/)

## Cách chạy game
- **Chơi online:** Mở trực tiếp link GitHub Pages ở trên bằng Chrome, Edge hoặc Safari.
- **Chơi offline:** Tải mã nguồn về và mở trực tiếp file `index.html` — **không cần cài đặt thêm công cụ nào**.
- **Điều khiển:**
  - Di chuyển: Phím mũi tên, `W A S D`, hoặc nhấn giữ kéo chuột / cảm ứng
  - Bắn đạn: Tự động bắn (bật/tắt bằng phím `F` hoặc trong Cài đặt), hoặc giữ `Space`
  - Âm thanh: Bật/tắt bằng phím `M`, chỉnh âm lượng trong Menu Cài đặt
  - Tạm dừng / Menu: `P` hoặc `ESC`

## Cấu trúc thư mục
- `index.html`: Khung giao diện, Splash Art mở màn, chọn độ khó/phi thuyền, bảng Thành tựu, Cài đặt và Top 5
- `style.css`: Giao diện nền không gian, thanh HUD, menu và hiệu ứng thông báo
- `js/config.js`: Hằng số cấu hình độ khó, phi thuyền, Boss, vật phẩm rơi, danh sách nhạc nền và khóa `localStorage`
- `js/ships.js`: Định nghĩa 3 mẫu phi thuyền (`Phantom`, `Falcon`, `Titan`) và hàm vẽ tàu
- `js/sound.js`: Hiệu ứng âm thanh Web Audio API kết hợp Dynamic Music đồng bộ 2 lớp nhạc (thường / Boss)
- `js/background.js`: Hệ thống nền vũ trụ chuyển động nhiều lớp
- `js/player.js`: Logic phi thuyền, đạn 1–3 tia và khiên bảo vệ
- `js/enemy.js`: Logic quái thường, quái zigzag, Boss, đạn địch, vật phẩm rơi và hiệu ứng nổ
- `js/ui.js`: Quản lý giao diện, hệ thống 8 Thành tựu, hiệu ứng rung màn hình và bảng xếp hạng Top 5
- `js/main.js`: Vòng lặp game (`requestAnimationFrame`), xử lý va chạm và ghép các thành phần
- `audio/tracks/`: Thư viện 9 bản nhạc nền (mỗi bản gồm 2 lớp `underscore.mp3` và `normal.mp3`)

## Lộ trình 3 chặng
- **Chặng 1 (Đã hoàn thành):** Dựng lõi game — điều khiển tàu, bắn đạn, quái thường + quái zigzag, tính điểm, wave, kỷ lục và Game Over.
- **Chặng 2 (Đã hoàn thành):** Nâng cấp gameplay & trải nghiệm — vật phẩm rơi (Hồi máu `+`, Đạn 2–3 tia `W`, Khiên `S`), Boss mỗi 5 đợt, chọn độ khó (Dễ / Thường / Khó), chọn 3 mẫu phi thuyền, hệ thống 8 Thành tựu, rung màn hình, Splash Art, Menu Cài đặt âm lượng, nền vũ trụ mới và 9 bài nhạc nền Dynamic Music.
- **Chặng 3 (Đang thực hiện — Đóng gói bảo vệ):**
  - [x] Đưa dự án lên GitHub quản lý theo nhánh và xuất bản chơi online qua GitHub Pages.
  - [ ] Tinh chỉnh cân bằng quái/Boss, hoàn thiện các nâng cấp cuối (nếu có) và kiểm thử trên điện thoại/PC.
  - [ ] Hoàn thiện Báo cáo Word, Slide thuyết trình và chuẩn bị phần hỏi đáp cho 5 thành viên.
