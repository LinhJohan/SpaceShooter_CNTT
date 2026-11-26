# Hướng dẫn làm việc nhóm trên GitHub (không cần gõ dòng lệnh)

Tài liệu này dành cho **Đức, Thắng, Hoàng, Hiệp** và **Hoàng Linh** cùng cập nhật dự án **Chiến Cơ Vũ Trụ 2D** mà không bị ghi đè code của nhau.

---

## Phần 1: Cài đặt lần đầu (mỗi thành viên làm 1 lần)

1. Tạo tài khoản miễn phí tại [github.com](https://github.com) rồi gửi username/email cho **Hoàng Linh** để được mời vào kho code (**Collaborator**). Mở Gmail bấm **Accept invitation**.
2. Tải và cài đặt phần mềm **GitHub Desktop** tại [desktop.github.com](https://desktop.github.com), sau đó đăng nhập tài khoản GitHub của bạn.
3. Trong GitHub Desktop: chọn **File -> Clone repository... -> tab GitHub.com** -> tìm `LinhJohan/SpaceShooter_CNTT` -> bấm **Clone**.
4. **Tạo nhánh riêng theo tên của bạn** (cực kỳ quan trọng để không đụng code người khác):
   - Ở thanh trên cùng, bấm **Current Branch** -> **New Branch**.
   - Đặt tên nhánh đúng tên bạn viết thường không dấu: `duc`, `thang`, `hoang`, hoặc `hiep`.
   - Bấm **Create Branch** (sau đó bấm **Publish branch** nếu hiện nút này).

---

## Phần 2: Quy trình mỗi lần sửa hoặc nhờ AI nâng cấp code

1. **Lấy bản mới nhất về máy trước khi sửa:**
   - Mở GitHub Desktop, đảm bảo đang đứng ở nhánh riêng của bạn (`duc` / `thang` / `hoang` / `hiep`).
   - Bấm **Branch -> Update from main** (nếu nút sáng) để đồng bộ code mới nhất từ bản chính.
2. **Sửa code đúng phần việc được giao** (dùng VS Code, Notepad hoặc nhờ AI sửa trong thư mục vừa clone về máy).
3. **Chơi thử để kiểm tra:** Mở file `index.html` trên trình duyệt, test kỹ tính năng vừa thêm không bị lỗi đứng màn hình.
4. **Gửi bài lên cho nhóm trưởng kiểm tra:**
   - Quay lại GitHub Desktop, xem lại những dòng vừa sửa (màu xanh = thêm, màu đỏ = xóa).
   - Ở góc dưới bên trái: gõ mô tả ngắn (ví dụ: *Them nhac nen vu tru*) -> bấm **Commit to `<ten-nhanh>`**.
   - Bấm **Push origin** ở thanh trên cùng.
   - Bấm nút **Create Pull Request** (hoặc **Preview Pull Request**) để **Hoàng Linh** xem thay đổi, test thử bên máy nhóm trưởng rồi gộp (**Merge**) vào bản chính `main`.

---

## Phần 3: Phân chia vùng file (tránh 2 người sửa cùng 1 file)

| Thành viên | Nhánh Git | File phụ trách | Gợi ý nâng cấp tiếp theo |
| :--- | :--- | :--- | :--- |
| **Hoàng Linh** | `main` | `js/main.js`, `js/player.js` | Duyệt Pull Request, ghép code, quản lý GitHub Pages |
| **Đức** | `duc` | `js/enemy.js`, `js/config.js` | Thêm quái bắn đạn thường từ Đợt 3, chiêu laser cho Boss Đợt 10+, vật phẩm Bom/Nam châm |
| **Thắng** | `thang` | `index.html`, `style.css`, `js/ui.js` | Màn hình chọn 3 mẫu phi thuyền, hiệu ứng rung màn hình, bảng Thành tựu nhỏ |
| **Hoàng** | `hoang` | `js/sound.js` (và nền vũ trụ) | Nhạc nền Web Audio API (đổi nhịp khi gặp Boss), nút tắt/bật nhạc nền riêng, thêm tinh vân/hành tinh |
| **Hiệp** | `hiep` | Test web & Tài liệu báo cáo | Test bản GitHub Pages trên điện thoại, ghi chú lỗi cảm ứng, tổng hợp lịch sử Commit vào Báo cáo Word & Slide |
