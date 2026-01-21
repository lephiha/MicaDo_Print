// ===================================
// PRODUCT-DETAIL.JS - Complete Version
// ===================================

// Current product data
let currentProductData = null;
let allProductsData = [];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initProductDetail();
});

async function initProductDetail() {
    // Load product data first
    await loadProductFromUrl();
    
    // Then initialize other features
    initThumbnails();
    initQuantity();
    initTabs();
    initAddToCart();
}

// ===== LOAD PRODUCT FROM URL =====
async function loadProductFromUrl() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        console.log('No product ID in URL');
        return;
    }
    
    try {
        // Load products data from JSON
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error('Failed to load products.json');
        }
        
        const data = await response.json();
        allProductsData = data.products;
        const product = data.products.find(p => p.id == productId);
        
        if (product) {
            console.log('Product found:', product);
            currentProductData = product;
            renderProductInfo(product);
            loadRelatedProductsByCategory(product.category);
        } else {
            console.error('Product not found with ID:', productId);
        }
    } catch (error) {
        console.error('Error loading product:', error);
    }
}

// ===== RENDER PRODUCT INFO =====
function renderProductInfo(product) {
    console.log('Rendering product:', product);
    
    // Update product name
    const productName = document.getElementById('productName');
    if (productName) {
        productName.textContent = product.name;
    }
    
    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumbProduct');
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }
    
    // Update main image and thumbnails
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }
    
    // Update thumbnails with same image (in real app, you'd have multiple images)
    const thumbnails = document.querySelectorAll('.thumbnail img');
    thumbnails.forEach(thumb => {
        thumb.src = product.image;
        thumb.alt = product.name;
    });
    
    // Update badge
    const badge = document.getElementById('productBadge');
    if (badge) {
        if (product.status && product.status.includes('new')) {
            badge.textContent = 'NEW';
            badge.style.background = '#dc3545';
            badge.style.display = 'block';
        } else if (product.status && product.status.includes('sale')) {
            badge.textContent = 'SALE';
            badge.style.background = '#28a745';
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
    
    // Update price with sale logic
    updateProductPrice(product);
    
    // Update description
    const description = document.getElementById('productDescription');
    if (description) {
        description.textContent = product.description || 'Sản phẩm chất lượng cao, thiết kế đẹp mắt, phù hợp làm quà tặng.';
    }
    
    // Update SKU
    const sku = document.getElementById('productSKU');
    if (sku) {
        sku.textContent = product.sku || 'MC-' + String(product.id).padStart(3, '0');
    }
    
    // Update category
    const category = document.getElementById('productCategory');
    if (category) {
        const categoryNames = {
            'mica-custom': 'Mica Custom',
            'moc-chia-khoa': 'Móc chìa khóa',
            'standee': 'Standee',
            'wood-1-layer': 'Gỗ 1 lớp',
            'wood-2-layer': 'Gỗ 2 lớp',
            'wood-handmade': 'Đồ gỗ Handmade',
            'uv-led-light': 'UV LED',
            'name-night': 'Name Night',
            'accessories': 'Phụ kiện & Hộp quà'
        };
        category.textContent = categoryNames[product.category] || product.category;
        category.href = 'products.html?category=' + product.category;
    }
}

// ===== UPDATE PRICE WITH SALE =====
function updateProductPrice(product) {
    const priceWrapper = document.querySelector('.product-price-wrapper');
    if (!priceWrapper) return;
    
    // Calculate discount if originalPrice exists
    if (product.originalPrice && product.originalPrice > product.price) {
        const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);
        
        priceWrapper.innerHTML = `
            <span class="product-price">${window.MicaDo.formatPrice(product.price)}</span>
            <span class="product-price-old">${window.MicaDo.formatPrice(product.originalPrice)}</span>
            <span class="discount-badge">-${discountPercent}%</span>
        `;
    } else {
        // No sale - show regular price
        priceWrapper.innerHTML = `
            <span class="product-price" style="color: #2d5f4f;">${window.MicaDo.formatPrice(product.price)}</span>
        `;
    }
}

// ===== THUMBNAILS =====
function initThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    if (!mainImage) return;
    
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
    
    if (!quantityInput) return;
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue < 99) {
                quantityInput.value = currentValue + 1;
            }
        });
    }
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > 99) {
            this.value = 99;
        }
    });
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
            const panel = document.getElementById(tabId);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });
}

// ===== ADD TO CART =====
function initAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            if (!currentProductData) {
                console.error('No product data loaded');
                return;
            }
            
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            
            // Add to cart multiple times based on quantity
            for (let i = 0; i < quantity; i++) {
                window.MicaDo.addToCart(currentProductData);
            }
            
            // Reset quantity to 1
            document.getElementById('quantity').value = 1;
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            if (!currentProductData) {
                console.error('No product data loaded');
                return;
            }
            
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            
            // Add to cart
            for (let i = 0; i < quantity; i++) {
                window.MicaDo.addToCart(currentProductData);
            }
            
            // Redirect to cart
            window.location.href = 'cart.html';
        });
    }
}

// ===== RELATED PRODUCTS =====
async function loadRelatedProductsByCategory(category) {
    const relatedProductsGrid = document.getElementById('relatedProducts');
    
    if (!relatedProductsGrid) return;
    
    try {
        // Filter products by same category, exclude current product
        let relatedProducts = allProductsData
            .filter(p => p.category === category && p.id !== currentProductData.id)
            .slice(0, 4);
        
        // If no related products, show random 4
        if (relatedProducts.length === 0) {
            relatedProducts = allProductsData
                .filter(p => p.id !== currentProductData.id)
                .slice(0, 4);
        }
        
        relatedProductsGrid.innerHTML = relatedProducts.map(product => {
            // Calculate sale price if exists
            let priceHtml = '';
            if (product.originalPrice && product.originalPrice > product.price) {
                const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);
                priceHtml = `
                    <div class="product-price-wrapper" style="flex-direction: column; gap: 4px; align-items: flex-start;">
                        <span class="product-price" style="color: #ff4444; font-size: 18px; font-weight: 700;">${window.MicaDo.formatPrice(product.price)}</span>
                        <div style="display: flex; gap: 6px; align-items: center;">
                            <span style="font-size: 14px; color: #999; text-decoration: line-through;">${window.MicaDo.formatPrice(product.originalPrice)}</span>
                            <span style="background: #ff4444; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">-${discountPercent}%</span>
                        </div>
                    </div>
                `;
            } else {
                priceHtml = `<span class="product-price">${window.MicaDo.formatPrice(product.price)}</span>`;
            }
            
            const badgeHtml = product.status && product.status.includes('new') 
                ? '<span class="product-badge">NEW</span>' 
                : product.status && product.status.includes('sale') 
                ? '<span class="product-badge" style="background: #28a745;">SALE</span>' 
                : '';
            
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
                            <button class="add-to-cart-btn" onclick="addRelatedToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

// Make function global for onclick
window.addRelatedToCart = function(productId) {
    const product = allProductsData.find(p => p.id === productId);
    if (product) {
        window.MicaDo.addToCart(product);
    }
};