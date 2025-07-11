// Global State Management
const AppState = {
    cart: [],
    products: [],
    filteredProducts: [],
    currentCategory: 'all',
    currentSort: 'featured',
    searchQuery: '',
    currentPage: 1,
    productsPerPage: 12,
    isCartOpen: false,
    isMobileMenuOpen: false
};

// Sample Product Data
const sampleProducts = [
    {
        id: 1,
        title: "Luxusní wellness set",
        price: 1299,
        originalPrice: 1899,
        category: "wellness",
        rating: 4.8,
        ratingCount: 245,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center",
        description: "Prémiový wellness set pro ultimátní relaxaci a odpočinek. Obsahuje všechny potřebné komponenty.",
        inStock: true,
        featured: true
    },
    {
        id: 2,
        title: "Organická intimní kosmetika",
        price: 899,
        originalPrice: 1299,
        category: "cosmetics",
        rating: 4.9,
        ratingCount: 189,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center",
        description: "100% přírodní kosmetika vyrobená z organických ingrediencí pro jemnou a účinnou péči.",
        inStock: true,
        featured: true
    },
    {
        id: 3,
        title: "Elegantní designový doplněk",
        price: 2199,
        originalPrice: 2999,
        category: "accessories",
        rating: 4.7,
        ratingCount: 156,
        image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop&crop=center",
        description: "Stylový a elegantní doplněk vyrobený z prémiových materiálů s důrazem na detail a kvalitu.",
        inStock: true,
        featured: false
    },
    {
        id: 4,
        title: "Luxusní péče premium",
        price: 1599,
        originalPrice: 2199,
        category: "care",
        rating: 4.6,
        ratingCount: 198,
        image: "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?w=400&h=400&fit=crop&crop=center",
        description: "Prémiová péče s pokročilými ingrediencemi pro maximální účinnost a komfort.",
        inStock: true,
        featured: true
    },
    {
        id: 5,
        title: "Wellness rituál deluxe",
        price: 3299,
        originalPrice: 4599,
        category: "wellness",
        rating: 4.9,
        ratingCount: 87,
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop&crop=center",
        description: "Kompletní wellness rituál pro dokonalý odpočinek a regeneraci těla i mysli.",
        inStock: true,
        featured: true
    },
    {
        id: 6,
        title: "Přírodní kosmetická řada",
        price: 1899,
        originalPrice: 2599,
        category: "cosmetics",
        rating: 4.8,
        ratingCount: 234,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&crop=center",
        description: "Kompletní řada přírodní kosmetiky pro komplexní péči s dlouhodobými výsledky.",
        inStock: true,
        featured: false
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    AppState.products = [...sampleProducts];
    AppState.filteredProducts = [...sampleProducts];
    
    setupEventListeners();
    renderProducts();
    updateCartUI();
    loadCartFromStorage();
    
    // Initialize touch gestures for mobile
    initializeTouchGestures();
    
    // Initialize intersection observer for animations
    initializeScrollAnimations();
}

function setupEventListeners() {
    // Navigation
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    menuToggle?.addEventListener('click', toggleMobileMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            scrollToSection(target);
            setActiveNavLink(link);
            closeMobileMenu();
        });
    });

    // Search and Filters
    const searchInput = document.getElementById('searchInput');
    const searchSubmit = document.querySelector('.search-submit');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const sortSelect = document.getElementById('sortSelect');

    searchInput?.addEventListener('input', debounce(handleSearch, 300));
    searchSubmit?.addEventListener('click', handleSearch);
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => handleCategoryFilter(tab));
    });
    
    sortSelect?.addEventListener('change', handleSort);

    // Cart
    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartSidebar = document.getElementById('cartSidebar');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartBtn?.addEventListener('click', toggleCart);
    cartClose?.addEventListener('click', closeCart);
    checkoutBtn?.addEventListener('click', handleCheckout);

    // Product Modal
    const productModal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalAddToCart = document.getElementById('modalAddToCart');

    modalClose?.addEventListener('click', closeProductModal);
    modalOverlay?.addEventListener('click', closeProductModal);
    modalAddToCart?.addEventListener('click', handleModalAddToCart);

    // Load More
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn?.addEventListener('click', loadMoreProducts);

    // Window Events
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('scroll', debounce(handleScroll, 16));
    
    // Prevent body scroll when modals are open
    document.addEventListener('keydown', handleKeyboardEvents);
}

// Mobile Menu Functions
function toggleMobileMenu() {
    AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (AppState.isMobileMenuOpen) {
        navMenu?.classList.add('open');
        menuToggle?.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        navMenu?.classList.remove('open');
        menuToggle?.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    AppState.isMobileMenuOpen = false;
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    
    navMenu?.classList.remove('open');
    menuToggle?.classList.remove('open');
    document.body.style.overflow = '';
}

// Navigation Functions
function scrollToSection(target) {
    const element = document.querySelector(target);
    if (element) {
        const navHeight = document.querySelector('.glass-nav')?.offsetHeight || 0;
        const targetPosition = element.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function setActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Search and Filter Functions
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    AppState.searchQuery = searchInput?.value.toLowerCase() || '';
    AppState.currentPage = 1;
    filterAndSortProducts();
}

function handleCategoryFilter(tab) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    AppState.currentCategory = tab.dataset.category;
    AppState.currentPage = 1;
    filterAndSortProducts();
}

function handleSort() {
    const sortSelect = document.getElementById('sortSelect');
    AppState.currentSort = sortSelect?.value || 'featured';
    filterAndSortProducts();
}

function filterAndSortProducts() {
    let filtered = [...AppState.products];
    
    // Apply category filter
    if (AppState.currentCategory !== 'all') {
        filtered = filtered.filter(product => product.category === AppState.currentCategory);
    }
    
    // Apply search filter
    if (AppState.searchQuery) {
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(AppState.searchQuery) ||
            product.description.toLowerCase().includes(AppState.searchQuery)
        );
    }
    
    // Apply sorting
    switch (AppState.currentSort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
        case 'featured':
        default:
            filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            break;
    }
    
    AppState.filteredProducts = filtered;
    renderProducts();
}

// Product Rendering Functions
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const startIndex = (AppState.currentPage - 1) * AppState.productsPerPage;
    const endIndex = startIndex + AppState.productsPerPage;
    const productsToShow = AppState.filteredProducts.slice(0, endIndex);
    
    if (AppState.currentPage === 1) {
        productsGrid.innerHTML = '';
    }
    
    const newProducts = AppState.filteredProducts.slice(startIndex, endIndex);
    
    newProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (endIndex >= AppState.filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    // Animate new products
    animateNewProducts(newProducts.length);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card glass-card';
    card.dataset.productId = product.id;
    
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    const hasDiscount = product.originalPrice > product.price;
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="rating-count">(${product.ratingCount})</span>
            </div>
            <div class="product-price">
                <span class="current-price">${formatPrice(product.price)}</span>
                ${hasDiscount ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Přidat do košíku
                </button>
                <button class="quick-view" onclick="openProductModal(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function loadMoreProducts() {
    AppState.currentPage++;
    renderProducts();
}

// Product Modal Functions
function openProductModal(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    // Populate modal content
    document.getElementById('modalMainImage').src = product.image;
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalCurrentPrice').textContent = formatPrice(product.price);
    document.getElementById('modalProductDescription').textContent = product.description;
    
    if (product.originalPrice > product.price) {
        document.getElementById('modalOriginalPrice').textContent = formatPrice(product.originalPrice);
        document.getElementById('modalOriginalPrice').style.display = 'inline';
    } else {
        document.getElementById('modalOriginalPrice').style.display = 'none';
    }
    
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    document.getElementById('modalProductStars').innerHTML = stars;
    document.getElementById('modalRatingCount').textContent = `(${product.ratingCount} hodnocení)`;
    
    // Reset quantity
    document.getElementById('modalQuantity').value = 1;
    
    // Show modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Store current product for modal actions
    modal.dataset.productId = productId;
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function handleModalAddToCart() {
    const modal = document.getElementById('productModal');
    const productId = parseInt(modal.dataset.productId);
    const quantity = parseInt(document.getElementById('modalQuantity').value) || 1;
    
    addToCart(productId, quantity);
    closeProductModal();
}

// Cart Functions
function addToCart(productId, quantity = 1) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = AppState.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        AppState.cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showAddToCartNotification(product.title);
}

function removeFromCart(productId) {
    AppState.cart = AppState.cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

function updateCartQuantity(productId, newQuantity) {
    const item = AppState.cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
            saveCartToStorage();
        }
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Update cart items
    if (cartItems && cartEmpty) {
        if (AppState.cart.length > 0) {
            cartItems.style.display = 'block';
            cartEmpty.style.display = 'none';
            
            cartItems.innerHTML = AppState.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn minus" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <input type="number" value="${item.quantity}" class="cart-item-qty" readonly>
                            <button class="qty-btn plus" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'block';
        }
    }
    
    // Update totals
    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(subtotal);
    }
    if (cartTotal) {
        cartTotal.textContent = formatPrice(subtotal); // Free shipping
    }
}

function toggleCart() {
    AppState.isCartOpen = !AppState.isCartOpen;
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (AppState.isCartOpen) {
        cartSidebar?.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        cartSidebar?.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function closeCart() {
    AppState.isCartOpen = false;
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar?.classList.remove('open');
    document.body.style.overflow = '';
}

function handleCheckout() {
    if (AppState.cart.length === 0) {
        alert('Váš košík je prázdný');
        return;
    }
    
    // Simulate checkout process
    alert('Přesměrování na pokladnu...\nCelkem: ' + formatPrice(AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)));
}

// Storage Functions
function saveCartToStorage() {
    try {
        localStorage.setItem('luxusshop_cart', JSON.stringify(AppState.cart));
    } catch (error) {
        console.error('Failed to save cart to storage:', error);
    }
}

function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('luxusshop_cart');
        if (savedCart) {
            AppState.cart = JSON.parse(savedCart);
            updateCartUI();
        }
    } catch (error) {
        console.error('Failed to load cart from storage:', error);
        AppState.cart = [];
    }
}

// Touch Gestures for Mobile
function initializeTouchGestures() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Swipe to close cart
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        cartSidebar.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        }, { passive: true });
        
        cartSidebar.addEventListener('touchend', (e) => {
            const diffX = currentX - startX;
            const diffY = Math.abs(currentY - startY);
            
            // Swipe right to close cart (minimum 100px, more horizontal than vertical)
            if (diffX > 100 && diffY < 100) {
                closeCart();
            }
        }, { passive: true });
    }
    
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('button, .glass-btn, .cta-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        }, { passive: true });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.category-card, .product-card, .glass-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function animateNewProducts(count) {
    const productCards = document.querySelectorAll('.product-card');
    const newCards = Array.from(productCards).slice(-count);
    
    newCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Event Handlers
function handleWindowResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768 && AppState.isMobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Close cart on very small screens when rotating
    if (window.innerWidth < 480 && AppState.isCartOpen) {
        closeCart();
    }
}

function handleScroll() {
    // Update navigation transparency
    const nav = document.querySelector('.glass-nav');
    if (nav) {
        const scrolled = window.scrollY > 50;
        nav.style.background = scrolled ? 
            'rgba(255, 255, 255, 0.35)' : 
            'rgba(255, 255, 255, 0.25)';
    }
    
    // Update active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function handleKeyboardEvents(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        if (AppState.isCartOpen) {
            closeCart();
        }
        if (document.getElementById('productModal').classList.contains('open')) {
            closeProductModal();
        }
        if (AppState.isMobileMenuOpen) {
            closeMobileMenu();
        }
    }
    
    // Quick search focus with Ctrl+K
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        searchInput?.focus();
    }
}

// Notification System
function showAddToCartNotification(productTitle) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification glass-card';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>Přidáno do košíku: ${productTitle}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1003;
        padding: 16px 20px;
        background: rgba(76, 175, 80, 0.9);
        color: white;
        border-radius: 8px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'CZK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance Optimization
function initializeImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // You could send error reports to a logging service here
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Handle promise rejections
});

// Initialize performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}
