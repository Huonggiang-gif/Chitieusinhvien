document.addEventListener("DOMContentLoaded", function () {
    // Lấy dữ liệu từ LocalStorage
    let users = JSON.parse(localStorage.getItem("users")) || {}; // Sửa thành {}
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // 1. Hiển thị thông tin cũ lên form và header
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const welcomeText = document.getElementById("welcomeUser");
    const avatarImg = document.getElementById("userAvatar");

    if (nameInput) nameInput.value = currentUser.fullname || "";
    if (emailInput) emailInput.value = currentUser.email || "";
    if (welcomeText) welcomeText.innerText = `Welcome, ${currentUser.fullname} 👋`;
    if (avatarImg) avatarImg.src = currentUser.avatar || "https://i.imgur.com/6VBx3io.png";

    // 2. Xử lý Submit Form
    const profileForm = document.getElementById("profileForm");
    profileForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Load lại danh sách users mới nhất
        users = JSON.parse(localStorage.getItem("users")) || {}; 
        
        const newName = nameInput.value.trim();
        const oldPass = document.getElementById("oldPassword").value;
        const newPass = document.getElementById("newPassword").value;

        if (!newName) {
            alert("Tên không được để trống!");
            return;
        }

        // Tìm user trong Object bằng email (Vì login/register lưu theo email làm key)
        let userInList = users[currentUser.email];

        if (userInList) {
            // Kiểm tra đổi mật khẩu
            if (oldPass || newPass) {
                if (userInList.password !== oldPass) {
                    alert("Mật khẩu cũ không chính xác!");
                    return;
                }
                if (!newPass) {
                    alert("Vui lòng nhập mật khẩu mới!");
                    return;
                }
                // Cập nhật mật khẩu mới vào danh sách tổng
                userInList.password = newPass;
            }

            // Luôn cập nhật tên
            userInList.fullname = newName;

            // --- LƯU DỮ LIỆU ĐỒNG BỘ ---
            // 1. Cập nhật lại vào danh sách users tổng
            users[currentUser.email] = userInList;
            localStorage.setItem("users", JSON.stringify(users));

            // 2. Cập nhật lại currentUser (Phiên làm việc hiện tại)
            // Quan trọng: Phải gán lại để Dashboard và Header nhận tên mới
            currentUser.fullname = newName;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            alert("Cập nhật thành công!");
            location.reload(); 
        } else {
            alert("Lỗi: Không tìm thấy người dùng trong hệ thống!");
        }
    });
});