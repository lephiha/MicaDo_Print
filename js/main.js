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
    initUserMenu();       
    loadHomeProducts();
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
                <a href="profile.html" class="user-dropdown-item">
                    <i class="fas fa-user"></i> Tài khoản
                </a>
                <a href="orders.html" class="user-dropdown-item">
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

function createProductCard(product) {
    const badgeHtml = product.status && product.status.includes('new') 
        ? '<span class="product-badge">NEW</span>' 
        : product.status && product.status.includes('sale') 
        ? '<span class="product-badge sale-badge">SALE</span>' 
        : '';
    
    let priceHtml = '';
    if (product.originalPrice && product.originalPrice > product.price) {
        const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);
        priceHtml = `
            <div class="product-price-wrapper">
                <small style="font-size: 11px; color: #999; margin-bottom: 4px;">Giá tham khảo</small>
                <span class="product-price-sale">${formatPrice(product.price)}</span>
                <span class="product-price-original">${formatPrice(product.originalPrice)}</span>
                <span class="product-discount">-${discountPercent}%</span>
            </div>
        `;
    } else {
        priceHtml = `
            <div style="display: flex; flex-direction: column; gap: 2px;">
                <small style="font-size: 11px; color: #999;">Giá tham khảo</small>
                <span class="product-price">${formatPrice(product.price)}</span>
            </div>
        `;
    }
    
    return `
        <div class="product-card">
            ${badgeHtml}
            <a href="product-detail.html?id=${product.id}" class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="product-info">
                <h3 class="product-title">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-footer">
                    ${priceHtml}
                    <button class="contact-price-btn" onclick="contactForPrice('${product.name}')">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}



async function loadHomeProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        
        // Render sản phẩm HOT
        const hotProducts = data.products.filter(p => p.status && p.status.includes('hot')).slice(0, 4);
        renderProductsToGrid(hotProducts, 'hotProducts');
        
        // Render sản phẩm MỚI
        const newProducts = data.products.filter(p => p.status && p.status.includes('new')).slice(0, 4);
        renderProductsToGrid(newProducts, 'newProducts');
        
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProductsToGrid(products, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Add event listeners for add to cart buttons
    grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) {
                window.MicaDo.addToCart(product);
            }
        });
    });
}

// ===== PRICING POPUP =====
document.addEventListener('DOMContentLoaded', function() {
    initPricingPopup();
});

function initPricingPopup() {
    // Create popup trigger button
    const triggerBtn = document.createElement('button');
    triggerBtn.className = 'pricing-popup-trigger';
    triggerBtn.innerHTML = `
        <i class="fas fa-tag"></i>
        <span>Xem Bảng Giá</span>
    `;
    document.body.appendChild(triggerBtn);
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'pricing-popup-overlay';
    overlay.innerHTML = `
        <div class="pricing-popup-content">
            <button class="pricing-popup-close">
                <i class="fas fa-times"></i>
            </button>
            <img src="https://res.cloudinary.com/df2upzfb9/image/upload/v1769070962/8396308f-b68a-4712-8d86-d20ce51303a2.png" alt="Bảng giá MicaDo">
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Open popup
    triggerBtn.addEventListener('click', function() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close popup
    const closeBtn = overlay.querySelector('.pricing-popup-close');
    closeBtn.addEventListener('click', function() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close when clicking outside
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

window.handleLogout = handleLogout;

// Contact for price
function contactForPrice(productName) {
    const phone = '0392405600';
    const message = `Xin chào! Tôi muốn hỏi giá sản phẩm: ${productName}`;
    const zaloUrl = `https://zalo.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(zaloUrl, '_blank');
}

window.contactForPrice = contactForPrice;
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