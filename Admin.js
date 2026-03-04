document.addEventListener("DOMContentLoaded", function() {
    // Bảo mật: Kiểm tra quyền admin
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = "login.html";
        return;
    }
    document.getElementById("adminEmailDisplay").innerText = currentUser.email;
    loadAdminData();
});

function loadAdminData() {
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const allExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    
    const userSearch = document.getElementById("userSearch").value.toLowerCase();
    const expenseFilter = document.getElementById("expenseUserFilter").value;

    // --- XỬ LÝ BẢNG NGƯỜI DÙNG ---
    let userHtml = "";
    let userCount = 0;
    for (let email in users) {
        const user = users[email];
        if (user.fullname.toLowerCase().includes(userSearch) || email.includes(userSearch)) {
            userCount++;
            const isLocked = user.isLocked || false;
            userHtml += `
                <tr>
                    <td><strong>${user.fullname}</strong></td>
                    <td>${email}</td>
                    <td><span class="badge ${isLocked ? 'locked' : 'active'}">${isLocked ? 'Đang khóa' : 'Đang mở khóa'}</span></td>
                    <td>
                        <button class="btn-lock" onclick="toggleLock('${email}')">${isLocked ? 'Mở khóa' : 'Khóa'}</button>
                        <button class="btn-delete" onclick="deleteUser('${email}')">Xóa</button>
                    </td>
                </tr>`;
        }
    }
    document.getElementById("userList").innerHTML = userHtml;

    // --- XỬ LÝ BẢNG CHI TIÊU ---
    let expenseHtml = "";
    let totalMoney = 0;
    let categories = new Set();

    allExpenses.forEach((exp, index) => {
        totalMoney += Number(exp.amount);
        if (exp.category) categories.add(exp.category);

        if (expenseFilter === "all" || exp.email === expenseFilter) {
            const userName = users[exp.email]?.fullname || "Người dùng ẩn";
            expenseHtml += `
                <tr>
                    <td>${userName}<br><small>${exp.email}</small></td>
                    <td><span class="tag">${exp.category}</span></td>
                    <td class="amount">${Number(exp.amount).toLocaleString()}đ</td>
                    <td>${exp.date || '---'}</td>
                    <td><button class="btn-delete-small" onclick="deleteExpense(${index})">Xóa</button></td>
                </tr>`;
        }
    });
    document.getElementById("expenseList").innerHTML = expenseHtml;

    // Cập nhật thẻ thống kê
    document.getElementById("statUsers").innerText = Object.keys(users).length;
    document.getElementById("statTotalMoney").innerText = totalMoney.toLocaleString() + "đ";
    document.getElementById("statCategories").innerText = categories.size;

    // Cập nhật danh sách filter người dùng (nếu cần)
    updateUserFilter(users);
}

function toggleLock(email) {
    let users = JSON.parse(localStorage.getItem("users"));
    users[email].isLocked = !users[email].isLocked;
    localStorage.setItem("users", JSON.stringify(users));
    loadAdminData();
}

function deleteUser(email) {
    if (confirm("Xóa người dùng này sẽ mất toàn bộ dữ liệu của họ?")) {
        let users = JSON.parse(localStorage.getItem("users"));
        delete users[email];
        localStorage.setItem("users", JSON.stringify(users));
        loadAdminData();
    }
}

function deleteExpense(index) {
    let allExpenses = JSON.parse(localStorage.getItem("expenses"));
    allExpenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(allExpenses));
    loadAdminData();
}

function updateUserFilter(users) {
    const filter = document.getElementById("expenseUserFilter");
    if (filter.options.length > 1) return;
    for (let email in users) {
        let opt = document.createElement("option");
        opt.value = email;
        opt.innerText = users[email].fullname;
        filter.appendChild(opt);
    }
}
//LOGOUT
function handleLogout() {
    
    const isConfirmed = confirm("Bạn có chắc chắn muốn đăng xuất không?");

    
    if (isConfirmed) {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }
   
}