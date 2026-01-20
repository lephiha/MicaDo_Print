// ===================================
// SEARCH.JS - Search Page Handler
// ===================================

// State
let ALL_PRODUCTS = [];
let searchKeyword = '';
let searchCategory = 'all';
let filteredResults = [];
let currentPage = 1;
let resultsPerPage = 12;
let currentView = 'grid';
let currentSort = 'relevance';

// DOM Elements
let searchResults, pagination, noResults, relatedSearches;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initSearchPage();
});

async function initSearchPage() {
    // Get DOM elements
    searchResults = document.getElementById('searchResults');
    pagination = document.getElementById('pagination');
    noResults = document.getElementById('noResults');
    relatedSearches = document.getElementById('relatedSearches');
    
    if (!searchResults) return;
    
    // Load products data
    await loadProductsData();
    
    // Get search params from URL
    const params = window.MicaDo.getUrlParams();
    searchKeyword = params.q || '';
    searchCategory = params.category || 'all';
    
    // Set search input value
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchKeyword) {
        searchInput.value = searchKeyword;
    }
    
    // Update page title
    updatePageTitle();
    
    // Perform search
    performSearchQuery();
    
    // Initialize filters
    initFilters();
    initViewMode();
    initSort();
    
    // Load popular products
    loadPopularProducts();
}

// ===== LOAD PRODUCTS DATA =====
async function loadProductsData() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        ALL_PRODUCTS = data.products;
    } catch (error) {
        console.error('Error loading products:', error);
        ALL_PRODUCTS = [];
    }
}

// ===== UPDATE PAGE TITLE =====
function updatePageTitle() {
    const keywordEl = document.getElementById('searchKeyword');
    if (keywordEl) {
        keywordEl.textContent = `"${searchKeyword}"`;
    }
    
    const noResultsKeywordEl = document.getElementById('noResultsKeyword');
    if (noResultsKeywordEl) {
        noResultsKeywordEl.textContent = searchKeyword;
    }
}

// ===== PERFORM SEARCH =====
function performSearchQuery() {
    // Filter products by keyword
    let results = ALL_PRODUCTS.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchKeyword.toLowerCase());
        const categoryMatch = searchCategory === 'all' || product.category === searchCategory;
        return nameMatch && categoryMatch;
    });
    
    filteredResults = results;
    updateSearchCount();
    renderResults();
}

function updateSearchCount() {
    const countEl = document.getElementById('searchCount');
    if (countEl) {
        countEl.textContent = `Tìm thấy ${filteredResults.length} kết quả`;
    }
}

// ===== FILTERS =====
function initFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active from all chips
            filterChips.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked chip
            this.classList.add('active');
            
            // Get filter value
            const filter = this.dataset.filter;
            
            // Apply filter
            applyFilter(filter);
        });
    });
}

function applyFilter(category) {
    searchCategory = category;
    currentPage = 1;
    performSearchQuery();
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
                searchResults.classList.add('list-view');
            } else {
                searchResults.classList.remove('list-view');
            }
        });
    });
}

// ===== SORT =====
function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortResults();
        });
    }
}

function sortResults() {
    switch(currentSort) {
        case 'newest':
            filteredResults.sort((a, b) => b.id - a.id);
            break;
        case 'price-asc':
            filteredResults.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredResults.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredResults.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredResults.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default: // relevance
            // Keep original order
            break;
    }
    
    renderResults();
}

// ===== RENDER RESULTS =====
function renderResults() {
    // Show/hide no results
    if (filteredResults.length === 0) {
        searchResults.style.display = 'none';
        noResults.style.display = 'block';
        relatedSearches.style.display = 'block';
        pagination.innerHTML = '';
        
        // Update showing text
        const showingText = document.getElementById('showingText');
        if (showingText) {
            showingText.textContent = 'Không có kết quả';
        }
        return;
    }
    
    searchResults.style.display = 'grid';
    noResults.style.display = 'none';
    relatedSearches.style.display = 'none';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    const resultsToShow = filteredResults.slice(startIndex, endIndex);
    
    // Update showing text
    const showingText = document.getElementById('showingText');
    if (showingText) {
        showingText.textContent = `Hiển thị ${startIndex + 1}-${Math.min(endIndex, filteredResults.length)} của ${filteredResults.length} kết quả`;
    }
    
    // Render products
    searchResults.innerHTML = resultsToShow.map(product => createProductCard(product)).join('');
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const product = ALL_PRODUCTS.find(p => p.id === productId);
            if (product) {
                window.MicaDo.addToCart(product);
            }
        });
    });
    
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
    const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changeSearchPage(${currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changeSearchPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span>...</span>`;
        }
    }
    
    // Next button
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changeSearchPage(${currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = html;
}

function changeSearchPage(page) {
    currentPage = page;
    renderResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== POPULAR PRODUCTS =====
function loadPopularProducts() {
    const popularProductsGrid = document.getElementById('popularProducts');
    
    if (!popularProductsGrid) return;
    
    // Get hot products
    const hotProducts = ALL_PRODUCTS.filter(p => p.status.includes('hot')).slice(0, 4);
    
    popularProductsGrid.innerHTML = hotProducts.map(product => createProductCard(product)).join('');
    
    // Add to cart buttons
    popularProductsGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const product = ALL_PRODUCTS.find(p => p.id === productId);
            if (product) {
                window.MicaDo.addToCart(product);
            }
        });
    });
}

// Make function available globally
window.changeSearchPage = changeSearchPage;