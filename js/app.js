// Local Storage Keys
const STORAGE_KEYS = {
    CART: 'keynest_cart',
    USER: 'keynest_user',
    AUTH_TOKEN: 'keynest_auth_token'
};

// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.error('LocalStorage is not available:', e);
        return false;
    }
}

// Cart Storage Functions
const CartStorage = {
    saveCart: (cart) => {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot save cart: localStorage is not available');
            return false;
        }
        try {
            console.log('Saving cart:', cart);
            localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
            console.log('Cart saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving cart:', error);
            return false;
        }
    },

    getCart: () => {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot get cart: localStorage is not available');
            return [];
        }
        try {
            const cart = localStorage.getItem(STORAGE_KEYS.CART);
            console.log('Retrieved cart:', cart);
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error getting cart:', error);
            return [];
        }
    },

    clearCart: () => {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot clear cart: localStorage is not available');
            return false;
        }
        try {
            localStorage.removeItem(STORAGE_KEYS.CART);
            console.log('Cart cleared successfully in localStorage.');
            // Ensure the in-memory cart is also cleared and UI updated
            cart = []; // Reset the global cart array
            updateCart(); // Re-render cart display and update count
            showNotification('Cart has been cleared!', 'success');
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    }
};

// User Storage Functions
const UserStorage = {
    saveUser: (user) => {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot save user: localStorage is not available');
            return false;
        }
        try {
            // Remove sensitive data before storing
            const safeUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                // Don't store password in localStorage
                createdAt: new Date().toISOString()
            };
            
            console.log('Saving user:', safeUser);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));
            console.log('User saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    },

    getUser: () => {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot get user: localStorage is not available');
            return null;
        }
        try {
            const user = localStorage.getItem(STORAGE_KEYS.USER);
            console.log('Retrieved user:', user);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },

    saveAuthToken: (token) => {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot save auth token: localStorage is not available');
            return false;
        }
        try {
            // Add expiration time to token
            const tokenData = {
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
            };
            
            console.log('Saving auth token');
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(tokenData));
            console.log('Auth token saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving auth token:', error);
            return false;
        }
    },

    getAuthToken: () => {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot get auth token: localStorage is not available');
            return null;
        }
        try {
            const tokenData = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            if (!tokenData) return null;

            const { token, expiresAt } = JSON.parse(tokenData);
            
            // Check if token is expired
            if (new Date(expiresAt) < new Date()) {
                this.clearUser();
                return null;
            }
            
            return token;
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    },

    clearUser: () => {
        if (!isLocalStorageAvailable()) {
            console.error('Cannot clear user data: localStorage is not available');
            return false;
        }
        try {
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            console.log('User data cleared successfully');
            return true;
        } catch (error) {
            console.error('Error clearing user data:', error);
            return false;
        }
    },

    isLoggedIn: () => {
        const token = UserStorage.getAuthToken();
        console.log('Checking login status:', !!token);
        return !!token;
    }
};

// DOM Elements
const keyboardGrid = document.getElementById('keyboardGrid');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const mobileSignInBtn = document.getElementById('mobileSignInBtn');
const mobileSignUpBtn = document.getElementById('mobileSignUpBtn');
const cartBtn = document.getElementById('cartBtn');
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const signInModal = document.getElementById('signInModal');
const signUpModal = document.getElementById('signUpModal');
const cartModal = document.getElementById('cartModal');
const totalModal = document.getElementById('totalModal');
const closeSignIn = document.getElementById('closeSignIn');
const closeSignUp = document.getElementById('closeSignUp');
const closeCart = document.getElementById('closeCart');
const closeTotal = document.getElementById('closeTotal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Mobile Menu Toggle
let isMobileMenuOpen = false;

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    mobileMenu.classList.toggle('hidden');
    
    // Update menu icon with smooth transition
    const menuIcon = menuBtn.querySelector('i');
    if (isMobileMenuOpen) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
        menuBtn.classList.add('bg-accent/20');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
        menuBtn.classList.remove('bg-accent/20');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMobileMenuOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        toggleMobileMenu();
    }
});

// Event Listeners
menuBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    toggleMobileMenu();
});

// Close mobile menu when window is resized to desktop size
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isMobileMenuOpen) { // 768px is the md breakpoint
        toggleMobileMenu();
    }
});

// Mobile sign in/up handlers
mobileSignInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMobileMenu();
    openModal(signInModal);
});

mobileSignUpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMobileMenu();
    openModal(signUpModal);
});

// Cart state
let cart = [];
try {
    cart = CartStorage.getCart();
    console.log('Initial cart loaded:', cart);
    // Update cart count immediately on page load
    updateCartCount();
} catch (error) {
    console.error('Error loading initial cart:', error);
    cart = [];
}

// Display keyboards
function displayKeyboards() {
    keyboardGrid.innerHTML = keyboards.map(keyboard => `
        <div class="bg-white rounded-xl shadow-lg mt-3 overflow-hidden hover:shadow-xl transition duration-300 product-card hover-scale" data-id="1">
            <div class="relative group w-full  md:h-64 sm:h-56 h-36 ">
                <img src="${keyboard.image}" alt="${keyboard.name}" class="w-full h-full  object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div class="flex space-x-2">
                        <button
                        onclick="addToCart(${keyboard.id})"
                        class="add-to-cart bg-white text-gray-800   md:px-4 md:py-2 px-1 py-2   rounded-lg text-[10px] :md-text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105">
                            <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                        </button>
                        <button 
                        onclick="handleBuyNow(${keyboard.id})"
                        class="buy-now bg-blue-600 text-white px-1 py-2  md:px-4 md:py-2 rounded-lg text-[10px] :md-text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                            <i class="fas fa-bolt mr-2"></i>Buy Now
                        </button>
                    </div> 
                </div>
            </div>
            <div class="sm:p-2 px-2 md:p-6 sm:px-2  lg:p-6 w-full lg:h-60 md:h-52 sm:h-40 h-28   ">
                <div class="w-full h-10 my-1 flex justify-between items-start sm:mb-5 mb-1">
                    <h3 class=" text-xs sm:text-lg md:text-xl font-bold ">${keyboard.name}</h3>
                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold sm:px-2.5 sm:py-0.5 px-1.5 py-0  rounded">${keyboard.featured}</span>
                </div>
                <p class="text-gray-600 my-2 text-[10px] sm:text-sm md:text-xl w-full xl:h-20 md:h-16 lg:mb-6 xl:mb-0 mb-0">${keyboard.description}</p>
                <div class="flex justify-between items-center w-full h-20 lg:mb-0 sm:pb-6 pb-10">
                    <span class="text-sm sm:text-2xl font-bold text-accent price ">$ ${keyboard.price}</span>
                    <div class="flex items-center md:space-x-3 space-x-1">
                        <span class="md:text-xl text-xs text-gray-500 ">${keyboard.store}</span>
                        <i class="fas fa-truck text-green-500 md:text-xl text-xs"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal functions
function openModal(modal) {
    modal.classList.remove('hidden');
}

function closeModal(modal) {
    modal.classList.add('hidden');
}

function switchToSignUp() {
    closeModal(signInModal);
    openModal(signUpModal);
}

function switchToSignIn() {
    closeModal(signUpModal);
    openModal(signInModal);
}

// Cart functions
function addToCart(keyboardId) {
    if (!UserStorage.isLoggedIn()) {
        showNotification('Please sign in to add items to cart', 'error');
        openModal(signInModal);
        return;
    }

    try {
        console.log('Adding to cart:', keyboardId);
        
        // Find the keyboard in the database
        const keyboard = keyboards.find(k => k.id === keyboardId);
        if (!keyboard) {
            console.error('Keyboard not found:', keyboardId);
            return;
        }
        console.log('Found keyboard:', keyboard);

        // Get current cart from storage
        let currentCart = CartStorage.getCart();
        console.log('Current cart from storage:', currentCart);

        // Find if item already exists in cart
        const existingItem = currentCart.find(item => item.id === keyboardId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            console.log('Increased quantity for existing item:', existingItem);
        } else {
            currentCart.push({
                ...keyboard,
                quantity: 1
            });
            console.log('Added new item to cart:', keyboard);
        }

        // Save updated cart
        const saveSuccess = CartStorage.saveCart(currentCart);
        if (!saveSuccess) {
            console.error('Failed to save cart to storage');
            showNotification('Error saving cart. Please try again.');
            return;
        }
        
        // Update local cart variable
        cart = currentCart;
        
        // Update UI
        showNotification(`${keyboard.name} added to cart!`);
        updateCart();
        
    } catch (error) {
        console.error('Error in addToCart:', error);
        showNotification('Error adding item to cart');
    }
}

function removeFromCart(keyboardId) {
    try {
        console.log('Removing from cart:', keyboardId);
        
        // Get current cart from storage
        let currentCart = CartStorage.getCart();
        
        const item = currentCart.find(item => item.id === keyboardId);
        if (!item) {
            console.error('Item not found in cart:', keyboardId);
            return;
        }

        if (item.quantity > 1) {
            item.quantity -= 1;
            console.log('Decreased quantity for item:', item);
        } else {
            currentCart = currentCart.filter(item => item.id !== keyboardId);
            console.log('Removed item from cart');
        }

        // Save updated cart
        const saveSuccess = CartStorage.saveCart(currentCart);
        if (!saveSuccess) {
            console.error('Failed to save cart to storage');
            showNotification('Error updating cart. Please try again.');
            return;
        }

        // Update local cart variable
        cart = currentCart;
        
        // Update UI
        updateCart();
        
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        showNotification('Error updating cart');
    }
}

function deleteFromCart(keyboardId) {
    try {
        console.log('Deleting from cart:', keyboardId);
        
        // Get current cart from storage
        let currentCart = CartStorage.getCart();
        
        // Remove the item
        currentCart = currentCart.filter(item => item.id !== keyboardId);
        
        // Save updated cart
        const saveSuccess = CartStorage.saveCart(currentCart);
        if (!saveSuccess) {
            console.error('Failed to save cart to storage');
            showNotification('Error removing item. Please try again.');
            return;
        }

        // Update local cart variable
        cart = currentCart;
        
        // Update UI
        showNotification('Item removed from cart');
        updateCart();
        
    } catch (error) {
        console.error('Error in deleteFromCart:', error);
        showNotification('Error removing item from cart');
    }
}

function updateCartCount() {
    try {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        console.log('Updated cart count:', totalItems);
    } catch (error) {
        console.error('Error updating cart count:', error);
        cartCount.textContent = '0';
    }
}

function initializeCartDisplay() {
    try {
        console.log('Initializing cart display...');
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) {
            console.error('Cart items container not found');
            return;
        }

        // Get latest cart from storage
        const currentCart = CartStorage.getCart();
        console.log('Current cart for display in initializeCartDisplay:', currentCart);

        if (currentCart.length === 0) {
            cartItems.innerHTML = '<div class="text-center text-gray-500 py-4">Your cart is empty</div>';
            console.log('Cart display set to empty.');
            return;
        }

        // Update cart items display
        const cartHtml = currentCart.map(item => `
            <div class="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div>
                        <h4 class="font-semibold text-gray-800">${item.name}</h4>
                        <p class="text-gray-600">$${item.price}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button 
                        onclick="removeFromCart(${item.id})"
                        class="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="font-semibold text-gray-800">${item.quantity}</span>
                    <button 
                        onclick="addToCart(${item.id})"
                        class="text-gray-500 hover:text-green-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <i class="fas fa-plus"></i>
                    </button>
                    <button 
                        onclick="deleteFromCart(${item.id})"
                        class="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors ml-2"
                        title="Remove item"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        cartItems.innerHTML = cartHtml;
        console.log('Cart items HTML updated.');

        // Update total
        const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = total.toFixed(2);
            console.log('Cart total updated:', total);
        }
        console.log('Cart display initialized with total:', total);
    } catch (error) {
        console.error('Error initializing cart display:', error);
    }
}

function updateCart() {
    try {
        console.log('Updating cart display in updateCart.');
        
        // Get latest cart from storage
        cart = CartStorage.getCart();
        console.log('Global cart after CartStorage.getCart() in updateCart:', cart);
        
        // Update cart count
        updateCartCount();

        // Initialize cart display
        initializeCartDisplay();
        
    } catch (error) {
        console.error('Error in updateCart:', error);
        showNotification('Error updating cart display');
    }
}

// Custom Alert System
const alertSounds = {
    success: new Audio('asset/sounds/success.mp3'),
    error: new Audio('asset/sounds/error.mp3'),
    warning: new Audio('asset/sounds/warning.mp3'),
    info: new Audio('asset/sounds/info.mp3')
};

// Preload sounds
Object.values(alertSounds).forEach(sound => {
    sound.load();
});

function showCustomAlert(title, message, type = 'info') {
    const alert = document.getElementById('customAlert');
    const alertIcon = alert.querySelector('.custom-alert-icon i');
    const alertTitle = alert.querySelector('.custom-alert-title');
    const alertMessage = alert.querySelector('.custom-alert-message');
    const closeBtn = alert.querySelector('.custom-alert-close');

    // Set alert type and icon
    alert.className = `custom-alert ${type}`;
    alertIcon.className = 'fas ' + getAlertIcon(type);

    // Set content
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    // Show alert
    alert.classList.add('show');

    // Play sound with error handling
    try {
        const sound = alertSounds[type] || alertSounds.info;
        sound.currentTime = 0; // Reset sound to start
        sound.play().catch(error => {
            console.warn('Could not play alert sound:', error);
        });
    } catch (error) {
        console.warn('Error with alert sound:', error);
    }

    // Auto hide after 5 seconds
    setTimeout(() => {
        hideAlert();
    }, 5000);

    // Close button handler
    closeBtn.onclick = hideAlert;
}

function hideAlert() {
    const alert = document.getElementById('customAlert');
    alert.classList.remove('show');
}

function getAlertIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-exclamation-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        default:
            return 'fa-info-circle';
    }
}

// Replace existing showNotification with custom alert
function showNotification(message, type = 'info') {
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    showCustomAlert(title, message, type);
}

// Event Listeners
signInBtn.addEventListener('click', () => openModal(signInModal));
signUpBtn.addEventListener('click', () => openModal(signUpModal));
cartBtn.addEventListener('click', () => {
    console.log('Cart button clicked');
    initializeCartDisplay();
    openModal(cartModal);
});

closeSignIn.addEventListener('click', () => closeModal(signInModal));
closeSignUp.addEventListener('click', () => closeModal(signUpModal));
closeCart.addEventListener('click', () => closeModal(cartModal));

document.getElementById('signInForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    // In a real application, you would validate credentials against a backend
    // For demo purposes, we'll use mock data
    const mockUser = {
        email,
        name: 'Test User',
        id: 1
    };
    
    UserStorage.saveUser(mockUser);
    UserStorage.saveAuthToken('mock-token-' + Date.now());
    
    showNotification('Successfully signed in!', 'success');
    closeModal(signInModal);
    updateAuthUI();
});

document.getElementById('signUpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // In a real application, you would send this data to a backend
    // For demo purposes, we'll use mock data
    const mockUser = {
        email,
        name,
        id: Date.now()
    };
    
    UserStorage.saveUser(mockUser);
    UserStorage.saveAuthToken('mock-token-' + Date.now());
    
    showNotification('Successfully registered!', 'success');
    closeModal(signUpModal);
    updateAuthUI();
});

function showTotalModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const tax = total * 0.1; // 10% tax
    const finalTotal = total + shipping + tax;

    const totalContent = document.getElementById('totalContent');
    totalContent.innerHTML = `
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-white">Order Summary</h2>
                <button id="closeTotal" class="text-gray-400 hover:text-accent transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                ${cart.map(item => `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <img src="${item.image}" alt="${item.name}" class="w-10 h-10 object-cover rounded-lg">
                            <div>
                                <h3 class="text-white font-medium text-sm">${item.name}</h3>
                                <p class="text-gray-400 text-xs">Quantity: ${item.quantity}</p>
                            </div>
                        </div>
                        <p class="text-accent text-sm">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                `).join('')}
            </div>

            <div class="border-t border-accent/30 pt-3 space-y-1">
                <div class="flex justify-between text-gray-300 text-sm">
                    <span>Subtotal</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-gray-300 text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div class="flex justify-between text-gray-300 text-sm">
                    <span>Tax (10%)</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-white font-bold text-base pt-2 border-t border-accent/30">
                    <span>Total</span>
                    <span class="text-accent">$${finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <div class="flex flex-col space-y-3">
                <div class="flex items-center justify-center space-x-3">
                    <button id="cardPaymentBtn" class="flex-1 bg-accent text-white py-2 rounded-lg font-semibold hover:bg-accent/80 transition-colors duration-300 text-sm">
                        <i class="fas fa-credit-card mr-2"></i>Card Payment
                    </button>
                    <button id="qrPaymentBtn" class="flex-1 bg-primary border border-accent text-accent py-2 rounded-lg font-semibold hover:bg-accent/10 transition-colors duration-300 text-sm">
                        <i class="fas fa-qrcode mr-2"></i>QR Payment
                    </button>
                </div>

                <div id="cardPaymentForm" class="space-y-3">
                    <div>
                        <label class="block mb-1 font-semibold text-accent text-sm">Card Number</label>
                        <input type="text" class="w-full p-2 bg-primary border border-accent/30 rounded-lg focus:outline-none focus:border-accent text-white placeholder-gray-400 text-sm" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block mb-1 font-semibold text-accent text-sm">Expiry Date</label>
                            <input type="text" class="w-full p-2 bg-primary border border-accent/30 rounded-lg focus:outline-none focus:border-accent text-white placeholder-gray-400 text-sm" placeholder="MM/YY" required>
                        </div>
                        <div>
                            <label class="block mb-1 font-semibold text-accent text-sm">CVV</label>
                            <input type="text" class="w-full p-2 bg-primary border border-accent/30 rounded-lg focus:outline-none focus:border-accent text-white placeholder-gray-400 text-sm" placeholder="123" required>
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-accent/80 transition-colors duration-300 text-sm">
                        Pay Now
                    </button>
                </div>

                <div id="qrPaymentSection" class="hidden space-y-3">
                    <div class="bg-white p-3 rounded-lg flex items-center justify-center">
                        <img src="asset/images/qr-code.png" alt="Payment QR Code" class="w-40 h-40">
                    </div>
                    <div class="text-center space-y-1">
                        <p class="text-white font-semibold text-sm">Scan QR Code to Pay</p>
                        <p class="text-gray-400 text-xs">Amount: $${finalTotal.toFixed(2)}</p>
                        <p class="text-gray-400 text-xs">Order ID: ${generateOrderId()}</p>
                    </div>
                    <div class="flex items-center justify-center space-x-2">
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p class="text-green-500 text-xs">Waiting for payment...</p>
                    </div>
                    <button id="confirmQrPayment" class="w-full bg-accent text-white py-2 rounded-lg font-semibold hover:bg-accent/80 transition-colors duration-300 text-sm">
                        I've Completed the Payment
                    </button>
                </div>
            </div>
        </div>
    `;

    openModal(totalModal);

    // Add event listeners
    document.getElementById('closeTotal').addEventListener('click', () => {
        closeModal(totalModal);
    });

    // Payment method toggle
    const cardPaymentBtn = document.getElementById('cardPaymentBtn');
    const qrPaymentBtn = document.getElementById('qrPaymentBtn');
    const cardPaymentForm = document.getElementById('cardPaymentForm');
    const qrPaymentSection = document.getElementById('qrPaymentSection');

    cardPaymentBtn.addEventListener('click', () => {
        cardPaymentBtn.classList.remove('bg-primary', 'border', 'text-accent');
        cardPaymentBtn.classList.add('bg-accent', 'text-white');
        qrPaymentBtn.classList.remove('bg-accent', 'text-white');
        qrPaymentBtn.classList.add('bg-primary', 'border', 'text-accent');
        cardPaymentForm.classList.remove('hidden');
        qrPaymentSection.classList.add('hidden');
    });

    qrPaymentBtn.addEventListener('click', () => {
        qrPaymentBtn.classList.remove('bg-primary', 'border', 'text-accent');
        qrPaymentBtn.classList.add('bg-accent', 'text-white');
        cardPaymentBtn.classList.remove('bg-accent', 'text-white');
        cardPaymentBtn.classList.add('bg-primary', 'border', 'text-accent');
        qrPaymentSection.classList.remove('hidden');
        cardPaymentForm.classList.add('hidden');
    });

    // Add function to play success sound
    function playSuccessSound() {
        const successSound = new Audio('asset/sounds/success.mp3');
        successSound.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }

    // Handle card payment form submission
    document.getElementById('cardPaymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        playSuccessSound(); // Play success sound
        showNotification('Payment successful! Your order has been placed.', 'success');
        closeModal(totalModal);
        closeModal(cartModal);
        clearCart();
    });

    // Handle QR payment confirmation
    document.getElementById('confirmQrPayment').addEventListener('click', () => {
        const paymentStatus = document.querySelector('#qrPaymentSection .text-green-500');
        if (paymentStatus) {
            paymentStatus.innerHTML = '<div class="flex items-center space-x-2"><i class="fas fa-check-circle"></i><span>Payment received!</span></div>';
            playSuccessSound(); // Play success sound
            showNotification('Payment successful! Your order has been placed.', 'success');
            closeModal(totalModal);
            closeModal(cartModal);
            clearCart();
        }
    });
}

// Helper function to generate a random order ID
function generateOrderId() {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Update checkout button click handler
checkoutBtn.addEventListener('click', () => {
    if (!UserStorage.isLoggedIn()) {
        showNotification('Please sign in to make a purchase', 'error');
        closeModal(cartModal);
        openModal(signInModal);
        return;
    }
    
    if (cart.length > 0) {
        closeModal(cartModal);
        showTotalModal();
    }
});

// Add function to update UI based on auth state
function updateAuthUI() {
    const isLoggedIn = UserStorage.isLoggedIn();
    const user = UserStorage.getUser();
    
    // Get all auth-related buttons
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const mobileSignInBtn = document.getElementById('mobileSignInBtn');
    const mobileSignUpBtn = document.getElementById('mobileSignUpBtn');
    
    if (isLoggedIn && user) {
        // Update desktop navigation
        signInBtn.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-user-circle text-accent"></i>
                <span>${user.name}</span>
            </div>
        `;
        signUpBtn.innerHTML = `
            <div class="flex items-center space-x-2 text-white hover:text-accent">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </div>
        `;
        
        // Update mobile navigation
        mobileSignInBtn.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-user-circle text-accent"></i>
                <span>${user.name}</span>
            </div>
        `;
        mobileSignUpBtn.innerHTML = `
            <div class="flex items-center space-x-2 text-white hover:text-accent">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </div>
        `;
        
        // Add logout functionality
        const handleLogout = () => {
            UserStorage.clearUser();
            updateAuthUI();
            showNotification('Successfully signed out!', 'success');
            // Clear cart when logging out
            CartStorage.clearCart();
            
            // Clear all form fields
            clearAuthForms();
        };
        
        signUpBtn.onclick = handleLogout;
        mobileSignUpBtn.onclick = handleLogout;
        
        // Remove sign in functionality
        signInBtn.onclick = null;
        mobileSignInBtn.onclick = null;
    } else {
        // Reset to default state
        signInBtn.innerHTML = 'Sign In';
        signUpBtn.innerHTML = 'Register';
        mobileSignInBtn.innerHTML = 'Sign In';
        mobileSignUpBtn.innerHTML = 'Register';
        
        // Restore sign in/up functionality
        signInBtn.onclick = () => openModal(signInModal);
        signUpBtn.onclick = () => openModal(signUpModal);
        mobileSignInBtn.onclick = () => {
            toggleMobileMenu();
            openModal(signInModal);
        };
        mobileSignUpBtn.onclick = () => {
            toggleMobileMenu();
            openModal(signUpModal);
        };
    }
}

// Add function to clear auth forms
function clearAuthForms() {
    // Clear sign in form
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.reset();
    }
    
    // Clear sign up form
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.reset();
    }
    
    // Clear forgot password form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.reset();
    }
}

// Search functionality
function searchKeyboards(searchTerm) {
    const clearButton = document.getElementById('clearSearchBtn');
    const searchInput = document.getElementById('searchInput');
    
    // Show/hide clear button based on search term
    if (clearButton) {
        clearButton.style.display = searchTerm ? 'block' : 'none';
    }

    if (!searchTerm) {
        displayKeyboards(); // Show all keyboards if search is empty
        return;
    }

    const filteredKeyboards = keyboards.filter(keyboard => {
        const searchLower = searchTerm.toLowerCase();
        return (
            keyboard.name.toLowerCase().includes(searchLower) ||
            keyboard.description.toLowerCase().includes(searchLower) ||
            keyboard.store.toLowerCase().includes(searchLower) ||
            keyboard.featured.toLowerCase().includes(searchLower)
        );
    });

    keyboardGrid.innerHTML = filteredKeyboards.map(keyboard => `
      <div class="bg-white rounded-xl shadow-lg mt-3 overflow-hidden hover:shadow-xl transition duration-300 product-card hover-scale" data-id="1">
            <div class="relative group w-full  md:h-64 sm:h-56 h-36 ">
                <img src="${keyboard.image}" alt="${keyboard.name}" class="w-full h-full  object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div class="flex space-x-2">
                        <button
                        onclick="addToCart(${keyboard.id})"
                        class="add-to-cart bg-white text-gray-800   md:px-4 md:py-2 px-1 py-2   rounded-lg text-[10px] :md-text-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105">
                            <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                        </button>
                        <button 
                        onclick="handleBuyNow(${keyboard.id})"
                        class="buy-now bg-blue-600 text-white px-1 py-2  md:px-4 md:py-2 rounded-lg text-[10px] :md-text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                            <i class="fas fa-bolt mr-2"></i>Buy Now
                        </button>
                    </div> 
                </div>
            </div>
            <div class="sm:p-2 px-2 md:p-6 sm:px-2  lg:p-6 w-full lg:h-60 md:h-52 sm:h-40 h-28   ">
                <div class="w-full h-10 my-1 flex justify-between items-start sm:mb-5 mb-1">
                    <h3 class=" text-xs sm:text-lg md:text-xl font-bold ">${keyboard.name}</h3>
                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold sm:px-2.5 sm:py-0.5 px-1.5 py-0  rounded">${keyboard.featured}</span>
                </div>
                <p class="text-gray-600 my-2 text-[10px] sm:text-sm md:text-xl w-full xl:h-20 md:h-16 lg:mb-6 xl:mb-0 mb-0">${keyboard.description}</p>
                <div class="flex justify-between items-center w-full h-20 lg:mb-0 sm:pb-6 pb-10">
                    <span class="text-sm sm:text-2xl font-bold text-accent price ">$ ${keyboard.price}</span>
                    <div class="flex items-center md:space-x-3 space-x-1">
                        <span class="md:text-xl text-xs text-gray-500 ">${keyboard.store}</span>
                        <i class="fas fa-truck text-green-500 md:text-xl text-xs"></i>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Show message if no results found
    if (filteredKeyboards.length === 0) {
        keyboardGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-600 text-lg">No keyboards found matching "${searchTerm}"</p>
            </div>
        `;
    }
}

// Clear Search Function
function clearSearch() {
    console.log('Clearing search...');
    
    // Get the search input and clear button elements
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    // Clear the search input if it exists
    if (searchInput) {
        console.log('Clearing search input...');
        searchInput.value = '';
        searchInput.focus(); // Keep focus on the search input
    } else {
        console.error('Search input element not found');
    }
    
    // Reset the keyboard display to show all keyboards
    console.log('Resetting keyboard display...');
    displayKeyboards();
    
    // Show a notification that search was cleared
    showNotification('Search cleared');
}

// Add event listeners for search and clear functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up search functionality...');
    
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');

    if (searchInput) {
        // Add input event listener for search
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value;
            console.log('Search term:', searchTerm);
            searchKeyboards(searchTerm);
        });

        // Add keydown event listener for Escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                console.log('Escape key pressed, clearing search...');
                clearSearch();
            }
        });
    } else {
        console.error('Search input element not found');
    }

    if (clearButton) {
        clearButton.addEventListener('click', function() {
            console.log('Clear button clicked...');
            clearSearch();
        });
    } else {
        console.error('Clear button element not found');
    }
});

// Initialize storage
function initializeStorage() {
    if (!isLocalStorageAvailable()) {
        console.error('LocalStorage is not available. Some features may not work properly.');
        return;
    }

    // Initialize cart if it doesn't exist
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
        CartStorage.saveCart([]);
    }

    console.log('Storage initialized successfully');
}

// Add event listener for page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    try {
        // Initialize storage
        initializeStorage();
        
        // Load cart from storage
        cart = CartStorage.getCart();
        console.log('Cart loaded on page load:', cart);
        
        // Update cart count
        updateCartCount();
        
        // Display keyboards
        displayKeyboards();
        
        // Update auth UI
        updateAuthUI();
        
        // Initialize cart display
        initializeCartDisplay();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
    
    
});

// Handle Buy Now directly
function handleBuyNow(keyboardId) {
    if (!UserStorage.isLoggedIn()) {
        showNotification('Please sign in to make a purchase', 'error');
        openModal(signInModal);
        return;
    }
    
    addToCart(keyboardId); // Add the item to the cart
    showTotalModal();      // Open the total modal
}

// Add clearCart function
function clearCart() {
    try {
        // Clear cart from localStorage
        localStorage.removeItem(STORAGE_KEYS.CART);
        // Reset the cart array
        cart = [];
        // Update the UI
        updateCart();
        // Show success notification
        showNotification('Cart has been cleared!', 'success');
    } catch (error) {
        console.error('Error clearing cart:', error);
        showNotification('Error clearing cart', 'error');
    }
}

// Add Forgot Password Modal to the DOM
const forgotPasswordModal = document.createElement('div');
forgotPasswordModal.id = 'forgotPasswordModal';
forgotPasswordModal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
forgotPasswordModal.innerHTML = `
    <div class="bg-primary p-8 rounded-xl w-96 shadow-2xl transform transition-all border border-accent/30">
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center space-x-2">
                <i class="fas fa-key text-accent text-xl"></i>
                <h2 class="text-xl font-bold text-white tracking-tighter">Reset Your Password</h2>
            </div>
            <button id="closeForgotPassword" class="text-gray-400 hover:text-accent transition-colors">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <form id="forgotPasswordForm" class="space-y-4">
            <div>
                <label class="block mb-2 font-semibold text-accent">Email</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <i class="fas fa-envelope"></i>
                    </span>
                    <input type="email" class="w-full p-3 pl-10 bg-primary border border-accent/30 rounded-lg focus:outline-none focus:border-accent text-white placeholder-gray-400" placeholder="Enter your email" required>
                </div>
            </div>
            <button type="submit" class="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/80 transition-colors duration-300">
                Send Reset Link
            </button>
            <div class="text-center text-gray-300 text-sm">
                Remember your password? 
                <a href="#" onclick="switchToSignIn()" class="text-accent hover:text-white transition-colors">Sign in here</a>
            </div>
        </form>
    </div>
`;
document.body.appendChild(forgotPasswordModal);

// Add event listeners for forgot password functionality
document.querySelectorAll('a[href="#"][onclick="switchToSignIn()"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(signInModal);
    });
});

// Add forgot password link click handler
document.querySelectorAll('a[href="#"][class*="text-accent"]').forEach(link => {
    if (link.textContent.includes('Forgot password')) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(signInModal);
            openModal(forgotPasswordModal);
        });
    }
});

// Close forgot password modal
document.getElementById('closeForgotPassword').addEventListener('click', () => {
    closeModal(forgotPasswordModal);
});

// Handle forgot password form submission
document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Simulate sending reset email
    setTimeout(() => {
        showNotification('Password reset link has been sent to your email!', 'success');
        closeModal(forgotPasswordModal);
        
        // In a real application, you would:
        // 1. Generate a secure reset token
        // 2. Store it in your database with an expiration time
        // 3. Send an email with a reset link containing the token
        // 4. When the user clicks the link, verify the token and allow password reset
        
        console.log('Password reset email would be sent to:', email);
    }, 1000);
});