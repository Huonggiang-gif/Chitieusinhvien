

//register
function register() {
    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();
    const agree = document.getElementById("agree").checked;
    const message = document.getElementById("message");

    if (!fullname || !email || !password || !confirm) {
        message.innerHTML = "Vui lòng nhập đầy đủ thông tin!";
        message.className = "message error";
        return;
    }

    if (password !== confirm) {
        message.innerHTML = "Mật khẩu xác nhận không khớp!";
        message.className = "message error";
        return;
    }

    if (!agree) {
        message.innerHTML = "Bạn phải đồng ý điều khoản!";
        message.className = "message error";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email]) {
        message.innerHTML = "Email đã tồn tại!";
        message.className = "message error";
        return;
    }
   let avatarInput = document.getElementById("avatar");
let avatarLink = avatarInput ? avatarInput.value.trim() : "";

if (!avatarLink) {
    avatarLink = "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/hinh-anh-nho-cute-1.jpg";
}
    users[email] = {
        fullname: fullname,
        password: password,
        avatar: avatarLink
    };

    localStorage.setItem("users", JSON.stringify(users));

    message.innerHTML = "Đăng ký thành công!";
    message.className = "message success";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

//login
function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("error");

    let users = JSON.parse(localStorage.getItem("users")) || {};

    // 1. Kiểm tra tài khoản có tồn tại và khớp pass không
    if (users[email] && users[email].password === password) {
        
        // --- CHÈN THÊM VÀO ĐÂY ---
        // Kiểm tra xem tài khoản có đang bị khóa hay không
        if (users[email].isLocked === true) {
            errorBox.innerText = "Tài khoản của bạn đã bị khóa bởi Admin!";
            errorBox.style.color = "red";
            return; // Dừng hàm tại đây, không cho đăng nhập tiếp
        }
        // -------------------------

        // 2. Xác định quyền hạn (Role)
        const isAdmin = (email === "admin@gmail.com"); 

        const userData = {
            email: email,
            fullname: users[email].fullname,
            avatar: users[email].avatar || "https://i.imgur.com/6VBx3io.png",
            role: isAdmin ? "admin" : "user"
        };

        // 3. Lưu phiên đăng nhập
        localStorage.setItem("currentUser", JSON.stringify(userData));

        // 4. Chuyển hướng
        if (userData.role === "admin") {
            alert("Đăng nhập Admin thành công!");
            window.location.href = "Admin.html"; 
        } else {
            window.location.href = "User.html";
        }

    } else {
        errorBox.innerText = "Email hoặc mật khẩu không đúng!";
        errorBox.style.color = "red";
    }
}



