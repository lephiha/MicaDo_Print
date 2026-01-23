// orders.js
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserInfo();
    initOrderTabs();
    loadOrders();
});

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
    }
}

function getCurrentUser() {
    const user = localStorage.getItem('micado_current_user') || 
                  sessionStorage.getItem('micado_current_user');
    return user ? JSON.parse(user) : null;
}

function loadUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
}

function initOrderTabs() {
    const tabs = document.querySelectorAll('.order-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const status = this.dataset.status;
            filterOrders(status);
        });
    });
}

function filterOrders(status) {
    // Filter logic here
    console.log('Filtering orders by:', status);
}

function loadOrders() {
    // Load orders from localStorage or API
    const orders = getOrders();
    
    if (orders.length === 0) {
        document.querySelector('.empty-orders').style.display = 'block';
    }
}

function getOrders() {
    const orders = localStorage.getItem('micado_orders');
    return orders ? JSON.parse(orders) : [];
}

function handleLogout(e) {
    e.preventDefault();
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('micado_current_user');
        sessionStorage.removeItem('micado_current_user');
        window.location.href = 'index.html';
    }
}

window.handleLogout = handleLogout;