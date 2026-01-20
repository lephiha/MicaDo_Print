// ===================================
// PRODUCT-DETAIL.JS
// ===================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initProductDetail();
});

function initProductDetail() {
    initThumbnails();
    initQuantity();
    initTabs();
    initAddToCart();
    loadRelatedProducts();
}

// ===== THUMBNAILS =====
function initThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Change main image
            const imgSrc = this.querySelector('img').src;
            mainImage.src = imgSrc;
        });
    });
}

// ===== QUANTITY =====
function initQuantity() {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < 99) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 99) {
                this.value = 99;
            }
        });
    }
}

// ===== TABS =====
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active class from all tabs and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ===== ADD TO CART =====
function initAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const product = getCurrentProduct();
            const quantity = parseInt(document.getElementById('quantity').value);
            
            // Add to cart multiple times based on quantity
            for (let i = 0; i < quantity; i++) {
                window.MicaDo.addToCart(product);
            }
            
            // Reset quantity to 1
            document.getElementById('quantity').value = 1;
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const product = getCurrentProduct();
            const quantity = parseInt(document.getElementById('quantity').value);
            
            // Add to cart
            for (let i = 0; i < quantity; i++) {
                window.MicaDo.addToCart(product);
            }
            
            // Redirect to cart
            window.location.href = 'cart.html';
        });
    }
}

function getCurrentProduct() {
    // Get product info from page
    // In real app, this would come from URL parameter or API
    return {
        id: Date.now(), // Use timestamp as temporary ID
        name: document.getElementById('productName').textContent,
        price: parsePrice(document.getElementById('productPrice').textContent),
        image: document.getElementById('mainImage').src,
        quantity: 1
    };
}

function parsePrice(priceStr) {
    // Remove currency symbol and dots, parse to number
    return parseInt(priceStr.replace(/[^\d]/g, ''));
}

// ===== RELATED PRODUCTS =====
function loadRelatedProducts() {
    const relatedProductsGrid = document.getElementById('relatedProducts');
    
    if (!relatedProductsGrid) return;
    
    // Sample related products
    const relatedProducts = [
        {
            id: 101,
            name: 'Mica Custom - Mẫu khác',
            price: 120000,
            image: 'https://via.placeholder.com/300x300?text=Related+1'
        },
        {
            id: 102,
            name: 'Standee Mica - Design mới',
            price: 150000,
            image: 'https://via.placeholder.com/300x300?text=Related+2'
        },
        {
            id: 103,
            name: 'Móc chìa khóa cute',
            price: 45000,
            image: 'https://via.placeholder.com/300x300?text=Related+3'
        },
        {
            id: 104,
            name: 'UV LED đẹp',
            price: 280000,
            image: 'https://via.placeholder.com/300x300?text=Related+4'
        }
    ];
    
    relatedProductsGrid.innerHTML = relatedProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-footer">
                    <span class="product-price">${window.MicaDo.formatPrice(product.price)}</span>
                    <button class="add-to-cart-btn" onclick="addRelatedToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Make function global for onclick
window.addRelatedToCart = function(productId) {
    // Find product by ID and add to cart
    window.MicaDo.showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
};