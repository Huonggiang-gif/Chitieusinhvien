function setupProfile() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log("CurrentUser:", currentUser);

    if (!currentUser) return;

    // Hiện tên trực tiếp vào Welcome
    const welcome = document.getElementById("welcomeUser");
    if (welcome) {
        welcome.innerText = `Welcome, ${currentUser.fullname} 👋`;
    }

    // Avatar
    const avatarImg = document.getElementById("userAvatar");
    if (avatarImg) {
        avatarImg.src = currentUser.avatar && currentUser.avatar !== ""
            ? currentUser.avatar
            : "https://i.imgur.com/6VBx3io.png"; // avatar mặc định
    }

    // 3. Xử lý Dropdown (Hamburger Menu)
    const menuToggle = document.getElementById("menuToggle");
    const dropdown = document.getElementById("dropdownmenu");

    if (menuToggle && dropdown) {
        // Click vào 3 gạch để mở/đóng
        menuToggle.onclick = function (e) {
            e.stopPropagation(); // Ngăn việc click vào nút làm đóng menu ngay lập tức
            dropdown.classList.toggle("show-menu");
        };

        // Click ra ngoài vùng menu để tự động đóng
        document.addEventListener("click", function (e) {
            if (!dropdown.contains(e.target) && e.target !== menuToggle) {
                dropdown.classList.remove("show-menu");
            }
        });
    }

    // 4. Xử lý Logout (Đúng ID "Logout" của bạn)
    const logoutBtn = document.getElementById("Logout"); 
    if (logoutBtn) {
        logoutBtn.onclick = function () {
            if(confirm("Bạn có muốn đăng xuất không?")) {
                localStorage.removeItem("currentUser");
                window.location.href = "login.html";
            }
        };
    }
}

function updateDashboard() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const budgets = JSON.parse(localStorage.getItem("budgets")) || [];

    console.log("Current user:", currentUser.email);
    console.log("Budgets from localStorage:", budgets);

    // ===== LỌC EXPENSE THEO USER =====
    const userExpenses = expenses.filter(e =>
        e.email === currentUser.email
    );

    // ===== TÍNH TỔNG CHI THÁNG HIỆN TẠI =====
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    let total = 0;

    userExpenses.forEach(e => {
        const d = new Date(e.date);
        if (d.getMonth() === month && d.getFullYear() === year) {
            total += Number(e.amount);
        }
    });

    const totalEl = document.getElementById("totalExpense");
    if (totalEl) {
        totalEl.innerText = total.toLocaleString() + "đ";
        console.log("Total updated:", total);
    }

    // ===== LẤY NGÂN SÁCH =====
    const userBudget = budgets.find(b =>
        b.email === currentUser.email
    );

    const budgetAmount = userBudget ? Number(userBudget.amount) : 0;
    console.log("Budget amount found:", budgetAmount);

    const budgetEl = document.getElementById("budget");
    if (budgetEl) {
        budgetEl.innerText = budgetAmount.toLocaleString() + "đ";
        console.log("Budget element updated");
    } else {
        console.log("Budget element not found!");
    }

    // ===== VƯỢT NGÂN SÁCH =====
    let over = total - budgetAmount;
    if (over < 0) over = 0;

    const overEl = document.getElementById("overcome");
    if (overEl) {
        overEl.innerText = over.toLocaleString() + "đ";
    }
}
    //MỞ MODAL
    function openBudgetModal() {
    document.getElementById("budgetModal").style.display = "flex";
}
    //ĐÓNG MODAL
    function closeGoalModal() {
    document.getElementById("budgetModal").style.display = "none";
}

function saveBudget() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const input = document.getElementById("budgetInput");
    if (!input) return;

    const value = input.value.trim();

    console.log("Giá trị nhập:", value); // DEBUG

    if (value === "") {
        alert("Nhập ngân sách đi");
        return;
    }

    const amount = Number(value);

    console.log("Input raw:", input.value);
    console.log("After trim:", value);
    console.log("Amount:", amount);
    
    if (isNaN(amount)) {
        alert("Phải nhập số");
        return;
    }

    let budgets = JSON.parse(localStorage.getItem("budgets")) || [];

    const index = budgets.findIndex(b =>
        b.email === currentUser.email
    );

    if (index >= 0) {
        budgets[index].amount = amount;
    } else {
        budgets.push({
            email: currentUser.email,
            amount: amount
        });
    }

    localStorage.setItem("budgets", JSON.stringify(budgets));

    document.getElementById("budgetModal").style.display = "none";

    updateDashboard();
}
//===============//
    //EXPENSE//
//===============//

document.addEventListener("DOMContentLoaded", function () {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    renderExpenses();
    updateGoalUI();
    drawChart();
});

function getCurrentUser(){
    return JSON.parse(localStorage.getItem("currentUser"));
}

function getExpenses(){
    return JSON.parse(localStorage.getItem("expenses")) || [];
}

function saveExpenses(data){
    localStorage.setItem("expenses", JSON.stringify(data));
}
const form = document.getElementById("addexpense");

if(form){
    form.addEventListener("submit", function(e){
        e.preventDefault();

        const currentUser = getCurrentUser();
        let expenses = getExpenses();
        const newExpense = {
            id: Date.now(),
            email: currentUser.email,   
            category: document.getElementById("category").value,
            amount: Number(document.getElementById("amount").value),
            date: document.getElementById("date").value
        };

        expenses.push(newExpense);
        saveExpenses(expenses);

        renderExpenses();
        updateGoalUI();
        drawChart();

        form.reset();
    });
}
const table = document.getElementById("expenseTable");

function renderExpenses(){
    if(!table) return;

    const currentUser = getCurrentUser();

    const expenses = getExpenses()
        .filter(e => e.email === currentUser.email);

    table.innerHTML = "";

    expenses.forEach(e => {
        table.innerHTML += `
            <tr>
                <td>${e.category}</td>
                <td>${e.amount.toLocaleString()} đ</td>
                <td>${e.date}</td>
                <td>
                    <button onclick="deleteExpense(${e.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
}
    //==============//    
        //DELETE//
    //=============//
function deleteExpense(id){
    let expenses = getExpenses();

    expenses = expenses.filter(e => e.id !== id);

    saveExpenses(expenses);

    renderExpenses();
    updateGoalUI();
    drawChart();
}
    //==============//
        //GOALS//
    //==============//

    // --- 1. HÀM ĐIỀU KHIỂN MODAL ---
function openGoalModal() {
    const modal = document.getElementById("goalModal");
    if (modal) modal.style.display = "flex";
}

function closeGoalModal() {
    const modal = document.getElementById("goalModal");
    if (modal) modal.style.display = "none";
}

// --- 2. HÀM LƯU MỤC TIÊU MỚI ---
function saveGoalAction() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return alert("Vui lòng đăng nhập!");

    const input = document.getElementById("goalInput");
    const amount = Number(input.value);

    if (!amount || amount <= 0) {
        alert("Vui lòng nhập mục tiêu hợp lệ!");
        return;
    }

    // Lấy danh sách mục tiêu từ máy
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    const index = goals.findIndex(g => g.email === currentUser.email);

    if (index >= 0) {
        goals[index].target = amount;
    } else {
        goals.push({ email: currentUser.email, target: amount });
    }

    // Lưu lại và cập nhật giao diện
    localStorage.setItem("goals", JSON.stringify(goals));
    closeGoalModal();
    input.value = ""; // Xóa trắng input
    updateGoalUI();
}

// --- 3. HÀM CẬP NHẬT GIAO DIỆN (CHẠY KHI LOAD TRANG) ---
function updateGoalUI() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const userGoal = goals.find(g => g.email === currentUser.email);
    const userBudget = budgets.find(b => b.email === currentUser.email);

    // 1. Lấy con số Mục tiêu
    const target = userGoal ? Number(userGoal.target) : 0;
    
    // 2. Lấy Ngân sách (Để tính số tiền tiết kiệm được)
    const budgetAmount = userBudget ? Number(userBudget.amount) : 0;

    // 3. Tính tổng chi tiêu
    const totalSpent = expenses
        .filter(e => e.email === currentUser.email)
        .reduce((sum, e) => sum + Number(e.amount), 0);

    // 4. Tiết kiệm = Ngân sách - Chi tiêu
    const saved = Math.max(budgetAmount - totalSpent, 0);

    // 5. Tính % hoàn thành
    const percent = target > 0 ? Math.min((saved / target) * 100, 100) : 0;

    // Đổ dữ liệu ra HTML (Khớp ID bạn gửi)
    document.getElementById("goalTarget").innerText = target.toLocaleString() + "đ";
    document.getElementById("goalSaved").innerText = saved.toLocaleString() + "đ";
    document.getElementById("goalSavedBig").innerText = saved.toLocaleString() + "đ";
    document.getElementById("goalPercent").innerText = percent.toFixed(1) + "% hoàn thành";

    // Chạy thanh progress
    const fill1 = document.getElementById("goalProgress");
    const fill2 = document.getElementById("goalProgressSmall");
    
    if (fill1) fill1.style.width = percent + "%";
    if (fill2) fill2.style.width = percent + "%";
}

// --- 4. GỌI KHI TRANG LOAD XONG ---
document.addEventListener("DOMContentLoaded", () => {
    updateGoalUI();
    
    // Gắn sự kiện click cho dấu ba chấm
    const dotMenu = document.querySelector(".dot_menu");
    if (dotMenu) {
        dotMenu.addEventListener("click", openGoalModal);
    }
});
// ======================
// CHART - USER EXPENSE
// ======================

let chartInstance = null;

function drawChart(){

    const canvas = document.getElementById("expenseChart");
    if(!canvas) return;

    const currentUser = getCurrentUser();
    if(!currentUser) return;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // 🔥 Lọc theo user + tháng
    const monthExpenses = getExpenses().filter(e => {

        const d = new Date(e.date);

        return e.email === currentUser.email &&
               d.getMonth() === currentMonth &&
               d.getFullYear() === currentYear;
    });

    // Gom theo category
    const categoryMap = {};

    monthExpenses.forEach(e => {
        categoryMap[e.category] =
            (categoryMap[e.category] || 0) + e.amount;
    });

    const labels = Object.keys(categoryMap);
    const data = Object.values(categoryMap);

    // Nếu chưa có dữ liệu
    if(labels.length === 0){
        if(chartInstance){
            chartInstance.destroy();
        }
        return;
    }

    // Tránh vẽ chồng
    if(chartInstance){
        chartInstance.destroy();
    }

    chartInstance = new Chart(canvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Chi tiêu tháng này",
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value){
                            return value.toLocaleString() + " đ";
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", function () {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    setupProfile();
    updateDashboard();
    renderExpenses();
    updateGoalUI();
    drawChart(); 
});