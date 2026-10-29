/* common.js - dữ liệu localStorage, đăng nhập, định dạng (không dùng CSDL server) */
function $(id) { return document.getElementById(id); }
function read(k, d) {
    try {
        const v = JSON.parse(localStorage.getItem(k));
        return v === null || v === undefined ? d : v;
    } catch (e) { return d; }
}
function save(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); }
    catch (e) { alert("Bộ nhớ trình duyệt đầy, không lưu được dữ liệu."); }
}
function formatVND(n) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(n) || 0);
}
function norm(s) {
    return String(s || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .toLowerCase()
        .trim();
}

const CATEGORIES = [
    "Moto",
    "Xe máy điện",
    "Pickup",
    "SUV",
    "Phụ kiện",
    "Roadster",
    "Hypercar",
    "Sedan"
];

const PRICE_RANGES = [
    { value: "", label: "Tất cả khoảng giá" },
    { value: "under-50m", label: "Dưới 50 Triệu VNĐ", test: (p) => p < 50000000 },
    { value: "50m-1b", label: "50 Triệu - 1 Tỷ VNĐ", test: (p) => p >= 50000000 && p < 1000000000 },
    { value: "1b-10b", label: "1 Tỷ - 10 Tỷ VNĐ", test: (p) => p >= 1000000000 && p <= 10000000000 },
    { value: "over-10b", label: "Trên 10 Tỷ VNĐ", test: (p) => p > 10000000000 }
];

const ORDER_STATUS = ["Chưa xác nhận", "Đã xác nhận", "Đã giao (Thành công)", "Hủy đơn"];
const STATUS_FLOW = {
    "Chưa xác nhận": ["Đã xác nhận", "Hủy đơn"],
    "Đã xác nhận": ["Đã giao (Thành công)", "Hủy đơn"],
    "Đã giao (Thành công)": [],
    "Hủy đơn": []
};

const vietnamData = {
    "TP. Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 5", "Quận 7", "Thành phố Thủ Đức"],
    "Hà Nội": ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Cầu Giấy", "Quận Đống Đa"],
    "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà"]
};

const FALLBACK_IMG = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#1e293b"/><text x="50%" y="50%" fill="#d4af37" font-size="40" text-anchor="middle" font-family="Segoe UI">LUXURY AUTO</text></svg>'
);
document.addEventListener("error", function (e) {
    if (e.target && e.target.tagName === "IMG" && e.target.src !== FALLBACK_IMG) e.target.src = FALLBACK_IMG;
}, true);

const DB_VER = "7";
if (localStorage.getItem("db_ver") !== DB_VER) {
    localStorage.removeItem("db_products");
    localStorage.removeItem("db_orders");
    localStorage.removeItem("db_users");
    localStorage.removeItem("cart");
    localStorage.removeItem("session_user");
    localStorage.removeItem("session_admin");

    save("db_users", [
        {
            id: 101,
            name: "Nguyễn Văn A",
            email: "anguyen@gmail.com",
            password: "123456",
            addresses: ["123 Lê Văn Sỹ, Phường 14, Quận 3, TP. Hồ Chí Minh"],
            isLocked: false
        },
        {
            id: 102,
            name: "Trần Nguyên Phúc",
            email: "phuctran@gmail.com",
            password: "123456",
            addresses: ["12 Lê Lợi, Quận 1, TP. Hồ Chí Minh"],
            isLocked: false
        }
    ]);
    save("db_products", [
        { id: 1, name: "Kawasaki KLX 150 BF", category: "Moto", price: 79000000, img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", desc: "Mô tô cào cào địa hình chuyên dụng, động cơ 150cc mạnh mẽ.", isSold: false, hidden: false },
        { id: 2, name: "VinFast Evo Grand Premia", category: "Xe máy điện", price: 27900000, img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", desc: "Động cơ tối đa 2.250W, tốc độ 70 km/h, quãng đường tới 262 km/sạc, cốp rộng 35 lít.", isSold: false, hidden: false },
        { id: 3, name: "Ford Ranger Wildtrak 2.0L", category: "Pickup", price: 973000000, img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", desc: "Siêu bán tải hạng sang, động cơ Bi-Turbo 2.0L, hệ dẫn động 4x4.", isSold: false, hidden: false },
        { id: 4, name: "Ford Ranger Raptor", category: "Pickup", price: 1299000000, img: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80", desc: "Siêu bán tải hiệu suất cao, trang bị hệ thống treo Fox danh tiếng.", isSold: false, hidden: false },
        { id: 5, name: "Jeep Wrangler Rubicon", category: "SUV", price: 3688000000, img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80", desc: "SUV địa hình biểu tượng, khả năng vượt đá và lội nước cực đỉnh.", isSold: false, hidden: false },
        { id: 6, name: "Baga Nhôm Thế Hệ Mới Rhino", category: "Phụ kiện", price: 8500000, img: "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?auto=format&fit=crop&w=800&q=80", desc: "Baga mui nhôm siêu nhẹ, sơn tĩnh điện bền bỉ, dễ dàng lắp đặt.", isSold: false, hidden: false },
        { id: 7, name: "Kawasaki D-Tracker 150", category: "Moto", price: 79000000, img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", desc: "Dòng xe Supermoto bánh lốp đường phố, thiết kế năng động.", isSold: false, hidden: false },
        { id: 8, name: "Yamaha XTZ 125", category: "Moto", price: 45000000, img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80", desc: "Xe cào cào đa địa hình Dual-sport bền bỉ, vận hành linh hoạt.", isSold: false, hidden: false },
        { id: 9, name: "Honda XR150L", category: "Moto", price: 65000000, img: "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?auto=format&fit=crop&w=800&q=80", desc: "Moto cào cào đường trường, động cơ 150cc tiết kiệm.", isSold: false, hidden: false },
        { id: 10, name: "Honda CRF150L", category: "Moto", price: 78000000, img: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80", desc: "Cào cào địa hình chuyên nghiệp, trang bị phuộc USD cao cấp.", isSold: false, hidden: false },
        { id: 11, name: "Velocity GT Roadster", category: "Roadster", price: 12500000000, img: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80", desc: "Động cơ V8 Bi-Turbo 4.0L, 650 Mã lực.", isSold: true, hidden: false },
        { id: 12, name: "Phantom Hypercar Limited", category: "Hypercar", price: 35000000000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80", desc: "Phiên bản giới hạn 10 chiếc toàn cầu.", isSold: false, hidden: false }
    ]);
    save("db_orders", [
        {
            id: "ORD-1001",
            customerId: 102,
            customerName: "Trần Nguyên Phúc",
            customerEmail: "phuctran@gmail.com",
            date: "2026-03-15",
            items: [{ id: 11, name: "Velocity GT Roadster", price: 12500000000, qty: 1 }],
            address: "12 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
            paymentMethod: "Trực tuyến",
            total: 12500000000,
            status: "Đã giao (Thành công)"
        }
    ]);
    save("cart", []);
    localStorage.setItem("db_ver", DB_VER);
}

function fillCategorySelect(selectEl, includeAll) {
    if (!selectEl) return;
    const current = selectEl.value;
    selectEl.innerHTML = includeAll ? '<option value="">Tất cả phân loại</option>' : "";
    CATEGORIES.forEach(function (c) {
        selectEl.innerHTML += '<option value="' + c + '">' + c + "</option>";
    });
    if (current) selectEl.value = current;
}

function fillPriceSelect(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = PRICE_RANGES.map(function (r) {
        return '<option value="' + r.value + '">' + r.label + "</option>";
    }).join("");
}

function initProvinceAndDistrictSelectors(provId, distId) {
    const provSelect = document.getElementById(provId);
    const distSelect = document.getElementById(distId);
    if (!provSelect || !distSelect) return;

    provSelect.innerHTML = '<option value="">-- Chọn Tỉnh / Thành phố --</option>';
    Object.keys(vietnamData).forEach(function (province) {
        provSelect.innerHTML += '<option value="' + province + '">' + province + "</option>";
    });

    distSelect.innerHTML = '<option value="">-- Chọn Quận / Huyện --</option>';
    provSelect.onchange = function () {
        const selectedProv = this.value;
        distSelect.innerHTML = '<option value="">-- Chọn Quận / Huyện --</option>';
        (vietnamData[selectedProv] || []).forEach(function (dist) {
            distSelect.innerHTML += '<option value="' + dist + '">' + dist + "</option>";
        });
    };
}

function allDistrictOptions() {
    const list = [];
    Object.keys(vietnamData).forEach(function (p) {
        vietnamData[p].forEach(function (d) { list.push({ province: p, district: d }); });
    });
    return list;
}

function invoiceHtml(o) {
    if (!o) return '<p style="color:#b91c1c;text-align:center;">Không tìm thấy hóa đơn.</p>';
    const items = (o.items || []).map(function (i) {
        return "<tr><td>" + i.name + "</td><td>" + (i.qty || 1) + "</td><td>" + formatVND(i.price) + "</td><td>" + formatVND((i.price || 0) * (i.qty || 1)) + "</td></tr>";
    }).join("");
    return (
        '<h3 style="color:var(--primary-color);border-bottom:2px solid var(--accent-color);padding-bottom:8px;">HÓA ĐƠN ' + o.id + "</h3>" +
        "<p><strong>Khách hàng:</strong> " + o.customerName + (o.customerEmail ? " (" + o.customerEmail + ")" : "") + "</p>" +
        "<p><strong>Ngày lập:</strong> " + o.date + "</p>" +
        "<p><strong>Địa chỉ giao:</strong> " + o.address + "</p>" +
        "<p><strong>Thanh toán:</strong> " + o.paymentMethod + "</p>" +
        "<p><strong>Trạng thái:</strong> " + o.status + "</p>" +
        '<table class="admin-table" style="margin-top:12px;"><thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead><tbody>' +
        items +
        "</tbody></table>" +
        '<p style="margin-top:12px;font-size:18px;"><strong>Tổng tiền:</strong> <span style="color:var(--accent-color);">' + formatVND(o.total) + "</span></p>"
    );
}

function findOrder(id) {
    const key = String(id || "").trim().toUpperCase();
    return (read("db_orders", []) || []).find(function (o) { return o.id === key; }) || null;
}

function visibleProducts() {
    return (read("db_products", []) || []).filter(function (p) { return !p.hidden; });
}

function filterProducts(products, searchName, category, priceFilter) {
    let filtered = products.slice();
    if (searchName) {
        const q = norm(searchName);
        filtered = filtered.filter(function (p) { return norm(p.name).indexOf(q) !== -1; });
    }
    if (category) filtered = filtered.filter(function (p) { return p.category === category; });
    if (priceFilter) {
        const range = PRICE_RANGES.find(function (r) { return r.value === priceFilter; });
        if (range && range.test) filtered = filtered.filter(function (p) { return range.test(p.price); });
    }
    return filtered;
}

function nextOrderId() {
    const n = 1000 + Math.floor(Math.random() * 9000);
    const id = "ORD-" + n;
    const exists = (read("db_orders", []) || []).some(function (o) { return o.id === id; });
    return exists ? nextOrderId() : id;
}

const Auth = {
    user: function () {
        const id = read("session_user", null);
        if (!id) return null;
        return (read("db_users", []) || []).find(function (x) { return x.id === id; }) || null;
    },
    register: function (name, email, password, confirm) {
        name = String(name || "").trim();
        email = String(email || "").trim();
        if (!name) return "Vui lòng nhập họ tên.";
        if (!email) return "Vui lòng nhập tên đăng nhập / Gmail.";
        if (!password || String(password).length < 4) return "Mật khẩu tối thiểu 4 ký tự.";
        if (password !== confirm) return "Xác nhận mật khẩu không khớp.";
        const users = read("db_users", []) || [];
        if (users.some(function (u) { return u.email.toLowerCase() === email.toLowerCase(); })) {
            return "Tài khoản / Gmail đã tồn tại.";
        }
        const user = {
            id: Date.now(),
            name: name,
            email: email,
            password: String(password),
            addresses: [],
            isLocked: false
        };
        users.push(user);
        save("db_users", users);
        return "";
    },
    login: function (email, password) {
        email = String(email || "").trim();
        const u = (read("db_users", []) || []).find(function (x) {
            return x.email.toLowerCase() === email.toLowerCase();
        });
        if (!u) return "Sai tài khoản hoặc mật khẩu.";
        if (u.isLocked) return "Tài khoản đang bị khóa!";
        if (String(u.password) !== String(password)) return "Sai tài khoản hoặc mật khẩu.";
        save("session_user", u.id);
        return "";
    },
    logout: function () { localStorage.removeItem("session_user"); },
    adminLogin: function (account, password) {
        if (String(account || "").trim().toLowerCase() === "admin" && String(password) === "admin") {
            save("session_admin", true);
            return "";
        }
        return "Sai tài khoản quản trị. Dùng admin / admin.";
    },
    isAdmin: function () { return read("session_admin", false) === true; },
    adminLogout: function () { localStorage.removeItem("session_admin"); },
    addAddress: function (address) {
        const u = Auth.user();
        if (!u || !address) return;
        const users = read("db_users", []) || [];
        const found = users.find(function (x) { return x.id === u.id; });
        if (!found) return;
        found.addresses = found.addresses || [];
        if (found.addresses.indexOf(address) === -1) found.addresses.push(address);
        save("db_users", users);
    }
};

function requireLogin(nextPage) {
    if (Auth.user()) return true;
    const next = nextPage ? ("?next=" + encodeURIComponent(nextPage)) : "";
    alert("Vui lòng đăng nhập để tiếp tục.");
    location.href = "login.html" + next;
    return false;
}

function requireAdmin() {
    if (Auth.isAdmin()) return true;
    alert("Vui lòng đăng nhập quản trị.");
    location.href = "admin-login.html";
    return false;
}

function updateNav() {
    const u = Auth.user();
    const userEl = document.getElementById("nav-user");
    const loginEl = document.getElementById("nav-login");
    const logoutEl = document.getElementById("nav-logout");
    const nameEl = document.getElementById("nav-user-name");
    if (userEl && nameEl) {
        if (u) {
            userEl.style.display = "";
            nameEl.textContent = u.name + " (" + u.email + ")";
        } else {
            userEl.style.display = "none";
        }
    }
    if (loginEl) loginEl.style.display = u ? "none" : "";
    if (logoutEl) logoutEl.style.display = u ? "" : "none";
}

function getTopCustomers(fromDate, toDate) {
    let orders = (read("db_orders", []) || []).filter(function (o) { return o.status !== "Hủy đơn"; });
    if (fromDate) orders = orders.filter(function (o) { return o.date >= fromDate; });
    if (toDate) orders = orders.filter(function (o) { return o.date <= toDate; });
    const map = {};
    orders.forEach(function (o) {
        const key = o.customerId || o.customerName;
        if (!map[key]) map[key] = { customerName: o.customerName, total: 0, orders: [] };
        map[key].total += Number(o.total) || 0;
        map[key].orders.push(o);
    });
    return Object.keys(map).map(function (k) { return map[k]; })
        .sort(function (a, b) { return b.total - a.total; })
        .slice(0, 5);
}
