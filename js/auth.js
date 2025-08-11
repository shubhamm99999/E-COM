// Authentication functionality
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoginForm();
        this.setupSignupForm();
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
    }

    setupSignupForm() {
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', this.handleSignup.bind(this));
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Clear previous errors
        this.clearErrors();

        // Validate form
        if (!this.validateLoginForm(email, password)) {
            return;
        }

        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('luxe_users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Login successful
            const userSession = {
                id: user.id,
                name: user.name,
                email: user.email,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('luxe_user', JSON.stringify(userSession));
            
            // Show success message
            this.showMessage('Login successful! Redirecting...', 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            this.showError('emailError', 'Invalid email or password');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Clear previous errors
        this.clearErrors();

        // Validate form
        if (!this.validateSignupForm(name, email, password, confirmPassword)) {
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('luxe_users')) || [];
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            this.showError('emailError', 'An account with this email already exists');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password, // In a real app, this would be hashed
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('luxe_users', JSON.stringify(users));

        // Auto-login the new user
        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('luxe_user', JSON.stringify(userSession));

        // Show success message
        this.showMessage('Account created successfully! Redirecting...', 'success');
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    validateLoginForm(email, password) {
        let isValid = true;

        if (!email) {
            this.showError('emailError', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            this.showError('passwordError', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    validateSignupForm(name, email, password, confirmPassword) {
        let isValid = true;

        if (!name || name.trim().length < 2) {
            this.showError('nameError', 'Name must be at least 2 characters long');
            isValid = false;
        }

        if (!email) {
            this.showError('emailError', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            this.showError('passwordError', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            this.showError('passwordError', 'Password must be at least 6 characters long');
            isValid = false;
        }

        if (!confirmPassword) {
            this.showError('confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 2000;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background-color: #27ae60;' : 'background-color: #3498db;'}
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});