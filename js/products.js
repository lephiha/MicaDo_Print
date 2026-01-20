// ===================================
// PRODUCTS.JS - Products Page Handler
// ===================================

// State
let PRODUCTS_DATA = [];
let currentProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 12;
let currentView = 'grid';

// DOM Elements
let productsGrid, pagination, pageTitle, productsCount;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initProductsPage();
});

async function initProductsPage() {
    // Get DOM elements
    productsGrid = document.getElementById('productsGrid');
    pagination = document.getElementById('pagination');
    pageTitle = document.getElementById('pageTitle');
    productsCount = document.getElementById('productsCount');
    
    if (!productsGrid) return; // Not on products page
    
    // Load products data
    await loadProductsData();
    
    // Initialize filters
    initFilters();
    initSort();
    initViewMode();
    initUrlParams();
    
    // Render products
    renderProducts();
}

// ===== LOAD PRODUCTS DATA =====
async function loadProductsData() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        PRODUCTS_DATA = data.products;
        currentProducts = [...PRODUCTS_DATA];
        filteredProducts = [...PRODUCTS_DATA];
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to empty array if file not found
        PRODUCTS_DATA = [];
        currentProducts = [];
        filteredProducts = [];
    }
}

// ===== URL PARAMETERS =====
function initUrlParams() {
    const params = window.MicaDo.getUrlParams();
    
    // Set category from URL
    if (params.category) {
        const categoryRadio = document.querySelector(`input[name="category"][value="${params.category}"]`);
        if (categoryRadio) {
            categoryRadio.checked = true;
            updatePageTitle(params.category);
        }
    }
    
    // Set search from URL
    if (params.search) {
        const searchKeyword = params.search.toLowerCase();
        filteredProducts = currentProducts.filter(product => 
            product.name.toLowerCase().includes(searchKeyword)
        );
        pageTitle.textContent = `Kết quả tìm kiếm: "${params.search}"`;
    }
    
    applyFilters();
}

// ===== FILTERS =====
function initFilters() {
    // Category filter
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    categoryInputs.forEach(input => {
        input.addEventListener('change', function() {
            applyFilters();
            updatePageTitle(this.value);
        });
    });
    
    // Price filter
    const priceInputs = document.querySelectorAll('input[name="price"]');
    priceInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    // Status filter
    const statusInputs = document.querySelectorAll('input[name="status"]');
    statusInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
    
    // Clear filter button
    const clearBtn = document.getElementById('clearFilter');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }
}

function applyFilters() {
    let products = [...currentProducts];
    
    // Category filter
    const selectedCategory = document.querySelector('input[name="category"]:checked');
    if (selectedCategory && selectedCategory.value !== 'all') {
        products = products.filter(p => p.category === selectedCategory.value);
    }
    
    // Price filter
    const selectedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked'))
        .map(input => input.value);
    
    if (selectedPrices.length > 0) {
        products = products.filter(product => {
            return selectedPrices.some(range => {
                const [min, max] = range.split('-').map(Number);
                return product.price >= min && product.price <= max;
            });
        });
    }
    
    // Status filter
    const selectedStatuses = Array.from(document.querySelectorAll('input[name="status"]:checked'))
        .map(input => input.value);
    
    if (selectedStatuses.length > 0) {
        products = products.filter(product => {
            return selectedStatuses.some(status => product.status.includes(status));
        });
    }
    
    filteredProducts = products;
    currentPage = 1;
    renderProducts();
}

function clearFilters() {
    // Reset all filters
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    
    // Check "all" category
    const allCategory = document.querySelector('input[name="category"][value="all"]');
    if (allCategory) {
        allCategory.checked = true;
    }
    
    filteredProducts = [...currentProducts];
    currentPage = 1;
    updatePageTitle('all');
    renderProducts();
}

function updatePageTitle(category) {
    const titles = {
        'all': 'Tất cả sản phẩm',
        'mica-custom': 'Mẫu Mica Custom',
        'moc-chia-khoa': 'Móc chìa khóa',
        'standee': 'Standee',
        'wood-1-layer': 'Gỗ 1 lớp',
        'wood-2-layer': 'Gỗ 2 lớp',
        'wood-handmade': 'Đồ gỗ Handmade',
        'uv-led-light': 'UV LED',
        'name-night': 'Name Night',
        'accessories': 'Phụ kiện & Hộp quà'
    };
    
    pageTitle.textContent = titles[category] || 'Sản phẩm';
}

// ===== SORT =====
function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

function sortProducts(sortType) {
    switch(sortType) {
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            filteredProducts = [...currentProducts];
    }
    
    renderProducts();
}

// ===== VIEW MODE =====
function initViewMode() {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentView = this.dataset.view;
            
            if (currentView === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Update count
    if (productsCount) {
        productsCount.textContent = `Hiển thị ${productsToShow.length} / ${filteredProducts.length} sản phẩm`;
    }
    
    // Render products
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '';
    } else {
        productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                const product = PRODUCTS_DATA.find(p => p.id === productId);
                if (product) {
                    window.MicaDo.addToCart(product);
                }
            });
        });
    }
    
    // Render pagination
    renderPagination();
}

function createProductCard(product) {
    const badgeHtml = product.status.includes('new') 
        ? '<span class="product-badge">NEW</span>' 
        : product.status.includes('sale') 
        ? '<span class="product-badge" style="background: #28a745;">SALE</span>' 
        : '';
    
    return `
        <div class="product-card">
            ${badgeHtml}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-footer">
                    <span class="product-price">${window.MicaDo.formatPrice(product.price)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===== PAGINATION =====
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span>...</span>`;
        }
    }
    
    // Next button
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make changePage available globally
window.changePage = changePage;