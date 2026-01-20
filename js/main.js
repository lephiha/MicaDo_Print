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
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchCategory = document.getElementById('searchCategory');
    
    const keyword = searchInput.value.trim();
    const category = searchCategory.value;
    
    if (keyword) {
        // Redirect to products page with search params
        let url = 'products.html?search=' + encodeURIComponent(keyword);
        if (category !== 'all') {
            url += '&category=' + category;
        }
        window.location.href = url;
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