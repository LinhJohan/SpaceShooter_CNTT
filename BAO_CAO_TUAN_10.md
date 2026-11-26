# Báo Cáo Tiến Độ & Phân Công Đồ Án Nhóm — Tuần 10 (13/11/2026)

**Môn học:** Nhập môn Công nghệ Thông tin  
**Đề tài:** Game Bắn Phi Thuyền 2D trên nền tảng Web (*Chiến Cơ Vũ Trụ*)  
**Thành viên nhóm (5 người):** Hoàng Linh (Nhóm trưởng), Đức, Thắng, Hoàng, Hiệp  
**Công nghệ:** HTML5, CSS3, JavaScript thuần (Canvas 2D), lưu trữ `localStorage`  
**Mục tiêu:** Hoàn thiện sản phẩm chạy trực tiếp trên trình duyệt, báo cáo & bảo vệ tháng 12.

---

## 1. Tổng quan (Nhóm trưởng báo cáo)

- **Tình trạng hiện tại:** Nhóm đã chốt xong đề tài, công nghệ và hoàn thành **Chặng 1 (bản chơi thử lõi)** chạy trực tiếp trên trình duyệt (`index.html`).
- **Quyết định điều chỉnh phạm vi:** Ban đầu nhóm có khảo sát bản đặc tả game sinh tồn *Absolute Despair*, nhưng sau khi đánh giá quỹ thời gian còn lại tới tháng 12 và năng lực kỹ thuật hiện tại, cả nhóm thống nhất chọn làm **Game Bắn Phi Thuyền 2D** để đảm bảo 100% có sản phẩm chạy mượt, dễ kiểm soát chất lượng và kịp làm báo cáo/slide.
- **Những phần đã chạy được ở Chặng 1:**
  - Giao diện khung game vừa khít màn hình, thanh thông số (Điểm, Kỷ lục, Đợt, Nút Tự bắn, Thanh máu), màn hình Bắt đầu / Tạm dừng / Kết thúc.
  - Điều khiển phi thuyền bằng phím `WASD` / mũi tên (đã xử lý chống kẹt phím khi bật Unikey) hoặc giữ kéo chuột; chế độ Tự động bắn (bật/tắt bằng phím `F` hoặc nút trên màn hình).
  - Hệ thống sinh quái theo đợt (2 loại quái: bay thẳng 1 máu và bay zigzag 2 máu), hiệu ứng hạt nổ, lưu điểm kỷ lục bằng `localStorage`.

---

## 2. Phân công công việc (5 thành viên)

| STT | Thành viên | Vai trò | Nhiệm vụ cụ thể | File / Sản phẩm phụ trách |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Hoàng Linh** | Nhóm trưởng & Code lõi | Quản lý tiến độ, dựng vòng lặp game, điều khiển & va chạm, ghép code, đưa web lên mạng (Netlify / GitHub Pages) | `js/main.js`, `js/player.js`, tổng hợp dự án |
| 2 | **Đức** | Gameplay & Cân bằng số liệu | Nghiên cứu số liệu game, thiết kế đợt quái (Wave), Boss xuất hiện mỗi 5 đợt, vật phẩm rơi (Hồi máu, Nâng cấp đạn 2–3 tia), cân chỉnh bảng thông số | `js/config.js`, `js/enemy.js` |
| 3 | **Thắng** | Giao diện (UI) & Bảng xếp hạng | Thiết kế Menu chọn độ khó (Dễ / Thường / Khó), chọn màu phi thuyền, nâng cấp Bảng xếp hạng Top 5 điểm cao nhất | `index.html`, `style.css`, `js/ui.js` |
| 4 | **Hoàng** | Tài nguyên Đồ họa & Âm thanh | Sưu tầm và xử lý âm thanh ngắn miễn phí (bắn, nổ, nhặt vật phẩm, Game Over, nhạc nền) và hình ảnh PNG phi thuyền/quái/Boss | Thư mục `assets/` (ảnh + âm thanh) |
| 5 | **Hiệp** | Kiểm thử (QA) & Thư ký Báo cáo | Test game trên nhiều máy/trình duyệt, ghi nhận lỗi, chụp ảnh tiến độ, soạn báo cáo tiến độ tuần, báo cáo Word cuối kỳ & Slide thuyết trình | Báo cáo Word, Slide, bảng test case |

*(Ghi chú: Nếu nhóm cần hoán đổi vai trò giữa Đức, Thắng, Hoàng, Hiệp cho đúng sở trường từng người thì chỉnh lại trực tiếp trong bảng trên).*

---

## 3. Báo cáo công việc Tuần 10 của từng thành viên

- **Hoàng Linh (Nhóm trưởng):** Đã dựng xong toàn bộ khung sườn Chặng 1, sửa xong lỗi hiển thị khung hình và lỗi phím `WASD` khi bật Unikey, bổ sung chế độ Tự bắn và kéo chuột; lập kế hoạch chia việc cho nhóm.
- **Đức:** Đã hoàn thành khảo sát tính khả thi cho ý tưởng game sinh tồn cũ (*Absolute Despair*), đề xuất rút gọn phạm vi và đang đọc `js/config.js`, `js/enemy.js` để lên bộ thông số Boss & vật phẩm rơi cho Chặng 2.
- **Thắng:** Đã test thử giao diện Chặng 1, đang phác thảo bố cục Menu chọn độ khó và khung Bảng xếp hạng Top 5 lưu qua `localStorage`.
- **Hoàng:** Đang sưu tầm bộ hiệu ứng âm thanh (mp3/wav) và hình ảnh phi thuyền/quái không bản quyền để chuẩn bị đưa vào thư mục `assets/`.
- **Hiệp:** Đã chơi thử bản Chặng 1 cùng nhóm, ghi nhận lỗi mở trực tiếp file HTML trong app Tệp trên điện thoại bị chỉ hiện chữ do trình xem nhanh chặn file JS/CSS đi kèm; đã dựng khung báo cáo tuần 10.

---

## 4. Kịch bản nói nhanh khi báo cáo thầy tại lớp (Tuần 10)

- **Hoàng Linh nói Tổng quan & Phân công:** Trình bày lý do chọn Bắn Phi Thuyền 2D (rút kinh nghiệm sau khi đánh giá rủi ro của bản đặc tả game sinh tồn quá nặng), mở game chạy thử trên máy cho thầy xem, đọc nhanh bảng phân công 5 người.
- **Đức báo cáo:** Em đã khảo sát xong bản đặc tả game sinh tồn cũ và chốt chuyển sang cân bằng số liệu cho quái, Boss và vật phẩm rơi của game Bắn Phi Thuyền 2D.
- **Thắng báo cáo:** Em đã kiểm tra giao diện bản đầu và đang thiết kế Menu chọn độ khó cùng Bảng xếp hạng Top 5 điểm cao.
- **Hoàng báo cáo:** Em đang chuẩn bị bộ âm thanh bắn/nổ và hình ảnh tàu, quái để lắp vào ở tuần sau.
- **Hiệp báo cáo:** Em đã test bản đầu cùng nhóm, phát hiện các lỗi hiển thị/điện thoại để nhóm khắc phục và đang tổng hợp khung báo cáo Word.

---

## 5. Kế hoạch làm việc tiếp theo (Tuần 11 — Chặng 2)

1. **Hoàng Linh:** Đẩy bản game lên **Netlify / GitHub Pages** để cả 5 thành viên và thầy mở link chơi trực tiếp trên mọi điện thoại/máy tính mà không bị lỗi file cục bộ; ghép code tính năng Chặng 2.
2. **Đức:** Chốt bảng thông số Boss (mỗi 5 đợt) và 2–3 vật phẩm rơi (Hồi máu, Đạn đôi/3 tia) để đưa vào game.
3. **Thắng:** Chốt mẫu giao diện Menu chọn độ khó và bảng Top 5 điểm cao.
4. **Hoàng:** Bàn giao xong bộ file âm thanh + ảnh PNG (nếu dùng ảnh thay hình vẽ khối) vào thư mục `assets/`.
5. **Hiệp:** Test lại toàn bộ các tính năng Chặng 2, chụp ảnh tiến độ các màn chơi và viết tiếp phần Nội dung thực hiện trong báo cáo Word.
