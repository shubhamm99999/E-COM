// Shopping cart functionality
class CartManager {
    constructor() {
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartSummary();
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCartDiv = document.getElementById('emptyCart');
        const cartContent = document.querySelector('.cart-content');

        if (!cartItemsContainer) return;

        const cart = window.luxeStore.cart;

        if (cart.length === 0) {
            if (cartContent) cartContent.style.display = 'none';
            if (emptyCartDiv) emptyCartDiv.style.display = 'block';
            return;
        }

        if (cartContent) cartContent.style.display = 'grid';
        if (emptyCartDiv) emptyCartDiv.style.display = 'none';

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="item-actions">
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-btn" onclick="cartManager.removeItem(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeItem(productId);
            return;
        }

        window.luxeStore.updateCartItemQuantity(productId, newQuantity);
        this.renderCart();
        this.updateCartSummary();
    }

    removeItem(productId) {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            window.luxeStore.removeFromCart(productId);
            this.renderCart();
            this.updateCartSummary();
        }
    }

    updateCartSummary() {
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!subtotalElement || !totalElement) return;

        const cart = window.luxeStore.cart;
        const subtotal = window.luxeStore.getCartTotal();
        const shipping = 0; // Free shipping
        const total = subtotal + shipping;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;

        // Disable checkout button if cart is empty
        if (checkoutBtn) {
            if (cart.length === 0) {
                checkoutBtn.style.opacity = '0.5';
                checkoutBtn.style.pointerEvents = 'none';
            } else {
                checkoutBtn.style.opacity = '1';
                checkoutBtn.style.pointerEvents = 'auto';
            }
        }
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});