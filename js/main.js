// ===================================
// MAIN.JS - MicaDo Website
// ===================================

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSearch();
    initCartCount();
    initScrollEffects();
    initDropdownMobile();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    
    // Create mobile menu button if not exists
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        const navContainer = document.querySelector('.nav-container');
        navContainer.insertBefore(mobileBtn, navMenu);
        
        mobileBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const searchCategory = document.getElementById('searchCategory');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Search suggestions (optional)
        searchInput.addEventListener('input', function() {
            const keyword = this.value.trim();
            if (keyword.length >= 2) {
                showSearchSuggestions(keyword);
            } else {
                hideSearchSuggestions();
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchCategory = document.getElementById('searchCategory');
    
    const keyword = searchInput.value.trim();
    const category = searchCategory.value;
    
    if (keyword) {
        // Redirect to search results page
        let url = 'search.html?q=' + encodeURIComponent(keyword);
        if (category !== 'all') {
            url += '&category=' + category;
        }
        window.location.href = url;
    } else {
        window.MicaDo.showNotification('Vui lòng nhập từ khóa tìm kiếm', 'error');
    }
}

function showSearchSuggestions(keyword) {
    // Remove existing suggestions
    hideSearchSuggestions();
    
    // Sample suggestions (in real app, fetch from API)
    const suggestions = [
        'Mica Custom Valentine',
        'Móc chìa khóa dễ thương',
        'UV LED 7 màu',
        'Standee ảnh cưới',
        'Gỗ 2 lớp',
        'Name Night custom'
    ].filter(item => item.toLowerCase().includes(keyword.toLowerCase()));
    
    if (suggestions.length === 0) return;
    
    // Create suggestions container
    const suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'search-suggestions';
    suggestionsBox.innerHTML = suggestions.map(item => 
        `<div class="suggestion-item" data-keyword="${item}">
            <i class="fas fa-search"></i>
            <span>${item}</span>
        </div>`
    ).join('');
    
    // Insert after search box
    const searchBox = document.querySelector('.search-box');
    searchBox.style.position = 'relative';
    searchBox.appendChild(suggestionsBox);
    
    // Add click event to suggestions
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const keyword = this.dataset.keyword;
            document.getElementById('searchInput').value = keyword;
            hideSearchSuggestions();
            performSearch();
        });
    });
    
    // Close suggestions when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeSuggestionsOnClickOutside);
    }, 100);
}

function hideSearchSuggestions() {
    const suggestionsBox = document.querySelector('.search-suggestions');
    if (suggestionsBox) {
        suggestionsBox.remove();
        document.removeEventListener('click', closeSuggestionsOnClickOutside);
    }
}

function closeSuggestionsOnClickOutside(e) {
    const searchBox = document.querySelector('.search-box');
    if (!searchBox.contains(e.target)) {
        hideSearchSuggestions();
    }
}

// ===== CART COUNT =====
function initCartCount() {
    updateCartCount();
}

function updateCartCount() {
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
    }
}

function getCart() {
    const cart = localStorage.getItem('micado_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('micado_cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow to header on scroll
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== DROPDOWN MOBILE =====
function initDropdownMobile() {
    if (window.innerWidth <= 768) {
        const hasDropdown = document.querySelectorAll('.has-dropdown');
        
        hasDropdown.forEach(item => {
            const link = item.querySelector('.nav-link');
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                item.classList.toggle('active');
            });
        });
    }
}

// ===== NOTIFICATION =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        closeNotification(notification);
    });
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 3000);
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
            params[key] = decodeURIComponent(value || '');
        }
    });
    
    return params;
}

// ===== USER MENU =====
document.addEventListener('DOMContentLoaded', function() {
    initUserMenu();
});

function initUserMenu() {
    const userActionsContainer = document.querySelector('.user-actions');
    if (!userActionsContainer) return;
    
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        renderUserMenu(userActionsContainer, currentUser);
    } else {
        const loginLink = userActionsContainer.querySelector('.user-login');
        if (loginLink) loginLink.href = 'login.html';
    }
}

function renderUserMenu(container, user) {
    const loginLink = container.querySelector('.user-login');
    if (!loginLink) return;
    
    const firstLetter = user.name.charAt(0).toUpperCase();
    
    loginLink.outerHTML = `
        <div class="user-menu">
            <button class="user-menu-toggle">
                <div class="user-avatar">${firstLetter}</div>
                <span class="user-name">${user.name}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-dropdown">
                <div class="user-dropdown-header">
                    <div class="user-dropdown-name">${user.name}</div>
                    <div class="user-dropdown-email">${user.email}</div>
                </div>
                <a href="#" class="user-dropdown-item">
                    <i class="fas fa-user"></i> Tài khoản
                </a>
                <a href="#" class="user-dropdown-item">
                    <i class="fas fa-shopping-bag"></i> Đơn hàng
                </a>
                <a href="#" class="user-dropdown-item user-dropdown-logout" onclick="handleLogout(event)">
                    <i class="fas fa-sign-out-alt"></i> Đăng xuất
                </a>
            </div>
        </div>
    `;
    
    const toggle = document.querySelector('.user-menu-toggle');
    const menu = document.querySelector('.user-menu');
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
    });
    
    document.addEventListener('click', () => {
        menu.classList.remove('active');
    });
}

function getCurrentUser() {
    const user = localStorage.getItem('micado_current_user') || 
                  sessionStorage.getItem('micado_current_user');
    return user ? JSON.parse(user) : null;
}

function handleLogout(e) {
    e.preventDefault();
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('micado_current_user');
        sessionStorage.removeItem('micado_current_user');
        window.MicaDo.showNotification('Đã đăng xuất', 'success');
        setTimeout(() => location.href = 'index.html', 1000);
    }
}

window.handleLogout = handleLogout;

// Export functions for use in other files
window.MicaDo = {
    addToCart,
    getCart,
    saveCart,
    updateCartCount,
    showNotification,
    formatPrice,
    getUrlParams
};