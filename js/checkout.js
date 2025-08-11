// Checkout functionality
class CheckoutManager {
    constructor() {
        this.init();
    }

    init() {
        this.renderOrderSummary();
        this.setupForm();
        this.prefillUserInfo();
    }

    renderOrderSummary() {
        const orderItemsContainer = document.getElementById('orderItems');
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');

        if (!orderItemsContainer) return;

        const cart = window.luxeStore.cart;
        const subtotal = window.luxeStore.getCartTotal();
        const total = subtotal; // Free shipping

        // Render order items
        orderItemsContainer.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="item-details">
                    <strong>${item.name}</strong>
                    <span>Qty: ${item.quantity}</span>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        // Update totals
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    setupForm() {
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', this.handleCheckout.bind(this));
        }

        // Setup payment method toggle
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', this.togglePaymentFields.bind(this));
        });

        // Format card number input
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', this.formatCardNumber.bind(this));
        }

        // Format expiry date input
        const expiryInput = document.getElementById('expiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', this.formatExpiryDate.bind(this));
        }

        // Limit CVV input
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', this.formatCVV.bind(this));
        }
    }

    prefillUserInfo() {
        const user = window.luxeStore.user;
        if (user) {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.value = user.email;
            }
        }
    }

    togglePaymentFields(e) {
        const cardFields = document.querySelectorAll('#cardNumber, #expiryDate, #cvv');
        const isCredit = e.target.value === 'credit';

        cardFields.forEach(field => {
            field.required = isCredit;
            field.disabled = !isCredit;
            if (!isCredit) field.value = '';
        });
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
        e.target.value = formattedValue;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    formatCVV(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.substring(0, 4);
    }

    handleCheckout(e) {
        e.preventDefault();

        // Check if cart is empty
        if (window.luxeStore.cart.length === 0) {
            alert('Your cart is empty. Please add some items before checking out.');
            window.location.href = 'index.html';
            return;
        }

        const formData = new FormData(e.target);
        const orderData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                address: formData.get('address'),
                city: formData.get('city'),
                zipCode: formData.get('zipCode')
            },
            payment: {
                method: formData.get('paymentMethod'),
                cardNumber: formData.get('cardNumber')?.replace(/\s/g, '').slice(-4) || null
            },
            items: window.luxeStore.cart,
            total: window.luxeStore.getCartTotal(),
            orderDate: new Date().toISOString(),
            orderId: this.generateOrderId()
        };

        // Validate form
        if (!this.validateCheckoutForm(orderData)) {
            return;
        }

        // Simulate order processing
        this.processOrder(orderData);
    }

    validateCheckoutForm(orderData) {
        const { customer, payment } = orderData;
        
        // Basic validation
        if (!customer.firstName || !customer.lastName || !customer.email || 
            !customer.address || !customer.city || !customer.zipCode) {
            alert('Please fill in all shipping information fields.');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer.email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        // Payment validation for credit card
        if (payment.method === 'credit') {
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;

            if (!cardNumber || cardNumber.length < 13) {
                alert('Please enter a valid card number.');
                return false;
            }

            if (!expiryDate || expiryDate.length !== 5) {
                alert('Please enter a valid expiry date (MM/YY).');
                return false;
            }

            if (!cvv || cvv.length < 3) {
                alert('Please enter a valid CVV.');
                return false;
            }
        }

        return true;
    }

    processOrder(orderData) {
        // Show loading state
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            // Save order to localStorage (in a real app, this would be sent to a server)
            const orders = JSON.parse(localStorage.getItem('luxe_orders')) || [];
            orders.push(orderData);
            localStorage.setItem('luxe_orders', JSON.stringify(orders));

            // Clear cart
            window.luxeStore.clearCart();

            // Show success modal
            this.showSuccessModal(orderData.orderId);

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    generateOrderId() {
        return 'LX' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    showSuccessModal(orderId) {
        const modal = document.getElementById('successModal');
        if (modal) {
            // Update modal content with order ID
            const modalContent = modal.querySelector('.modal-content');
            modalContent.innerHTML = `
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase!</p>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p>A confirmation email will be sent to you shortly.</p>
                <button class="btn btn-primary" onclick="closeModal()">Continue Shopping</button>
            `;
            modal.style.display = 'block';
        }
    }
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        window.location.href = 'index.html';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Initialize checkout manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Redirect to cart if no items
    if (window.luxeStore && window.luxeStore.cart.length === 0) {
        alert('Your cart is empty. Please add some items before checking out.');
        window.location.href = 'cart.html';
        return;
    }
    
    window.checkoutManager = new CheckoutManager();
});