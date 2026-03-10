function resetPassword() {
    const email = document.getElementById("forgot-email").value.trim();
    const newPass = document.getElementById("new-password").value.trim();
    const confirmPass = document.getElementById("confirm-new-password").value.trim();
    const message = document.getElementById("reset-message");

    // 1. Kiểm tra để trống
    if (!email || !newPass || !confirmPass) {
        message.innerText = "Vui lòng nhập đầy đủ thông tin!";
        message.style.color = "#ff4d4d";
        return;
    }

    // 2. Kiểm tra định dạng Email bằng Regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        message.innerText = "Email không đúng định dạng!";
        message.style.color = "#ff4d4d";
        return;
    }

    // 3. Kiểm tra độ dài mật khẩu (Ít nhất 8 ký tự)
    if (newPass.length < 8) {
        message.innerText = "Mật khẩu mới phải có ít nhất 8 ký tự!";
        message.style.color = "#ff4d4d";
        return;
    }

    // 4. Kiểm tra mật khẩu khớp nhau
    if (newPass !== confirmPass) {
        message.innerText = "Mật khẩu xác nhận không khớp!";
        message.style.color = "#ff4d4d";
        return;
    }

    // 5. Kiểm tra tài khoản trong localStorage
    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email]) {
        // Cập nhật mật khẩu mới cho user
        users[email].password = newPass;
        
        // Lưu lại vào localStorage
        localStorage.setItem("users", JSON.stringify(users));

        message.innerText = "Đổi mật khẩu thành công! Đang quay lại trang đăng nhập...";
        message.style.color = "#28a745"; // Màu xanh lá cho thành công

        // Chuyển hướng về trang Login sau 2 giây
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    } else {
        message.innerText = "Email này chưa được đăng ký trong hệ thống!";
        message.style.color = "#ff4d4d";
    }

}
