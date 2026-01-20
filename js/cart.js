// ===================================
// CART.JS - Shopping Cart Handler
// ===================================

// Constants
const SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 500000;

// State
let cart = [];
let discountCode = '';
let discountAmount = 0;

// Coupon codes (for demo)
const COUPONS = {
    'MICADO10': 0.1,  // 10% discount
    'MICADO20': 0.2,  // 20% discount
    'FREESHIP': 'freeship'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initCart();
});

function initCart() {
    loadCart();
    renderCart();
    initCartActions();
}

// ===== LOAD CART =====
function loadCart() {
    cart = window.MicaDo.getCart();
}

// ===== RENDER CART =====
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartWrapper = document.getElementById('cartWrapper');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartWrapper.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    cartWrapper.style.display = 'grid';
    emptyCart.style.display = 'none';
    
    // Render cart items
    cartItems.innerHTML = cart.map(item => createCartItemHTML(item)).join('');
    
    // Update summary
    updateCartSummary();
    
    // Attach event listeners
    attachCartItemEvents();
}

function createCartItemHTML(item) {
    return `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <div class="cart-item-price">${window.MicaDo.formatPrice(item.price)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-id="${item.id}">
                    <button class="quantity-btn increase-btn" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-total">${window.MicaDo.formatPrice(item.price * item.quantity)}</div>
                <button class="remove-item-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                    <span>Xóa</span>
                </button>
            </div>
        </div>
    `;
}

// ===== UPDATE CART SUMMARY =====
function updateCartSummary() {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const discount = calculateDiscount(subtotal);
    const total = subtotal + shipping - discount;
    
    document.getElementById('subtotal').textContent = window.MicaDo.formatPrice(subtotal);
    document.getElementById('shipping').textContent = shipping === 0 ? 'Miễn phí' : window.MicaDo.formatPrice(shipping);
    document.getElementById('discount').textContent = window.MicaDo.formatPrice(discount);
    document.getElementById('total').textContent = window.MicaDo.formatPrice(total);
    
    // Show/hide discount row
    const discountRow = document.getElementById('discountRow');
    if (discount > 0) {
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateShipping(subtotal) {
    if (discountCode === 'FREESHIP') return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return SHIPPING_FEE;
}

function calculateDiscount(subtotal) {
    if (!discountCode || !COUPONS[discountCode]) return 0;
    
    const coupon = COUPONS[discountCode];
    if (coupon === 'freeship') return 0;
    
    return Math.floor(subtotal * coupon);
}

// ===== CART ACTIONS =====
function attachCartItemEvents() {
    // Decrease quantity
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            updateQuantity(id, -1);
        });
    });
    
    // Increase quantity
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            updateQuantity(id, 1);
        });
    });
    
    // Manual quantity input
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const id = parseInt(this.dataset.id);
            const newQuantity = parseInt(this.value);
            
            if (newQuantity < 1) {
                this.value = 1;
                return;
            }
            
            if (newQuantity > 99) {
                this.value = 99;
                return;
            }
            
            setQuantity(id, newQuantity);
        });
    });
    
    // Remove item
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            removeItem(id);
        });
    });
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity < 1) {
        item.quantity = 1;
    }
    
    if (item.quantity > 99) {
        item.quantity = 99;
    }
    
    window.MicaDo.saveCart(cart);
    renderCart();
}

function setQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    
    item.quantity = quantity;
    window.MicaDo.saveCart(cart);
    renderCart();
}

function removeItem(id) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        cart = cart.filter(item => item.id !== id);
        window.MicaDo.saveCart(cart);
        renderCart();
        window.MicaDo.showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    }
}

// ===== COUPON =====
function initCartActions() {
    const applyCouponBtn = document.getElementById('applyCoupon');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    const code = couponInput.value.trim().toUpperCase();
    
    if (!code) {
        window.MicaDo.showNotification('Vui lòng nhập mã giảm giá', 'error');
        return;
    }
    
    if (!COUPONS[code]) {
        window.MicaDo.showNotification('Mã giảm giá không hợp lệ', 'error');
        return;
    }
    
    discountCode = code;
    updateCartSummary();
    
    const message = code === 'FREESHIP' 
        ? 'Áp dụng miễn phí ship thành công!' 
        : `Áp dụng mã giảm giá ${COUPONS[code] * 100}% thành công!`;
    
    window.MicaDo.showNotification(message, 'success');
    couponInput.value = '';
}

// ===== CHECKOUT =====
function checkout() {
    if (cart.length === 0) {
        window.MicaDo.showNotification('Giỏ hàng của bạn đang trống', 'error');
        return;
    }
    
    // For demo purposes, just show alert
    // In real application, redirect to checkout page
    const total = calculateSubtotal() + calculateShipping(calculateSubtotal()) - calculateDiscount(calculateSubtotal());
    
    alert(`Tổng đơn hàng: ${window.MicaDo.formatPrice(total)}\n\nChức năng thanh toán đang được phát triển...`);
    
    // Clear cart after checkout (optional)
    // cart = [];
    // window.MicaDo.saveCart(cart);
    // renderCart();
}