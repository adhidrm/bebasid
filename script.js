// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const loginBtn = document.querySelector('.login-btn');
const toggleIcon = document.getElementById('toggleIcon');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Demo credentials for testing
const DEMO_CREDENTIALS = {
    'admin@test.com': 'admin123',
    'user@test.com': 'user123',
    'demo@test.com': 'demo123'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is remembered
    checkRememberedUser();
    
    // Add event listeners
    setupEventListeners();
    
    // Add smooth animations
    addAnimations();
});

function setupEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    emailInput.addEventListener('input', clearEmailError);
    passwordInput.addEventListener('input', clearPasswordError);
    
    // Social login buttons
    document.querySelector('.social-btn.google').addEventListener('click', handleGoogleLogin);
    document.querySelector('.social-btn.facebook').addEventListener('click', handleFacebookLogin);
    
    // Forgot password link
    document.querySelector('.forgot-password').addEventListener('click', handleForgotPassword);
    
    // Sign up link
    document.getElementById('signupLink').addEventListener('click', handleSignupLink);
}

function addAnimations() {
    // Add entrance animations to form elements
    const formElements = document.querySelectorAll('.form-group, .form-options, .login-btn, .divider, .social-login, .signup-link');
    
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Toggle password visibility
function togglePassword() {
    const isPassword = passwordInput.type === 'password';
    
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleIcon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    
    // Add a little animation
    toggleIcon.style.transform = 'scale(0.8)';
    setTimeout(() => {
        toggleIcon.style.transform = 'scale(1)';
    }, 150);
}

// Validation functions
function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showError(emailError, 'Email harus diisi');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showError(emailError, 'Format email tidak valid');
        return false;
    }
    
    clearError(emailError);
    return true;
}

function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        showError(passwordError, 'Password harus diisi');
        return false;
    }
    
    if (password.length < 6) {
        showError(passwordError, 'Password minimal 6 karakter');
        return false;
    }
    
    clearError(passwordError);
    return true;
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.opacity = '1';
    errorElement.style.transform = 'translateY(0)';
}

function clearError(errorElement) {
    errorElement.textContent = '';
    errorElement.style.opacity = '0';
    errorElement.style.transform = 'translateY(-10px)';
}

function clearEmailError() {
    if (emailError.textContent) {
        clearError(emailError);
    }
}

function clearPasswordError() {
    if (passwordError.textContent) {
        clearError(passwordError);
    }
}

// Login handling
async function handleLogin(e) {
    e.preventDefault();
    
    // Clear previous errors
    clearError(emailError);
    clearError(passwordError);
    
    // Validate inputs
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
        shakeForm();
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check credentials
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (authenticateUser(email, password)) {
        handleSuccessfulLogin(email);
    } else {
        handleFailedLogin();
    }
}

function authenticateUser(email, password) {
    // Check against demo credentials
    return DEMO_CREDENTIALS[email] === password;
}

function handleSuccessfulLogin(email) {
    hideLoadingState();
    
    // Save user data if remember me is checked
    if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMe', 'true');
    } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberMe');
    }
    
    // Save login session
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userEmail', email);
    
    // Show success message
    showMessage('Login berhasil! Mengarahkan...', 'success');
    
    // Add success animation
    loginForm.style.transform = 'scale(0.95)';
    loginForm.style.opacity = '0.8';
    
    // Redirect to success page
    setTimeout(() => {
        window.location.href = 'success.html';
    }, 1500);
}

function handleFailedLogin() {
    hideLoadingState();
    
    // Show error message
    showMessage('Email atau password salah. Silakan coba lagi.', 'error');
    
    // Clear password field
    passwordInput.value = '';
    
    // Shake animation
    shakeForm();
    
    // Focus on email field
    emailInput.focus();
}

function showLoadingState() {
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // Change button text
    const btnText = loginBtn.querySelector('i').nextSibling;
    btnText.textContent = ' Memproses...';
}

function hideLoadingState() {
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
    
    // Restore button text
    const btnText = loginBtn.querySelector('i').nextSibling;
    btnText.textContent = ' Masuk';
}

function shakeForm() {
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        loginCard.style.animation = 'slideUp 0.8s ease-out';
    }, 500);
}

// Add shake animation to CSS dynamically
const shakeKeyframes = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

function showMessage(text, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert before form
    const loginCard = document.querySelector('.login-card');
    loginCard.insertBefore(message, loginForm);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }
    }, 5000);
}

// Remember me functionality
function checkRememberedUser() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (rememberMe === 'true' && rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }
}

// Social login handlers
function handleGoogleLogin() {
    showMessage('Fitur login Google akan segera tersedia!', 'info');
}

function handleFacebookLogin() {
    showMessage('Fitur login Facebook akan segera tersedia!', 'info');
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (!email) {
        showMessage('Silakan masukkan email Anda terlebih dahulu.', 'error');
        emailInput.focus();
        return;
    }
    
    showMessage(`Link reset password telah dikirim ke ${email}`, 'success');
}

function handleSignupLink(e) {
    e.preventDefault();
    showMessage('Halaman pendaftaran akan segera tersedia!', 'info');
}

// Add info message style
const infoStyle = `
    .message.info {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
`;

const infoStyleSheet = document.createElement('style');
infoStyleSheet.textContent = infoStyle;
document.head.appendChild(infoStyleSheet);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key on email field moves to password
    if (e.key === 'Enter' && document.activeElement === emailInput) {
        e.preventDefault();
        passwordInput.focus();
    }
    
    // Escape key clears form
    if (e.key === 'Escape') {
        emailInput.value = '';
        passwordInput.value = '';
        clearError(emailError);
        clearError(passwordError);
        emailInput.focus();
    }
});

// Demo credentials helper
function showDemoCredentials() {
    const demoInfo = `
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem;">
            <strong>Demo Credentials:</strong><br>
            • admin@test.com / admin123<br>
            • user@test.com / user123<br>
            • demo@test.com / demo123
        </div>
    `;
    
    const loginCard = document.querySelector('.login-card');
    loginCard.insertAdjacentHTML('afterbegin', demoInfo);
}

// Show demo credentials on page load
setTimeout(showDemoCredentials, 2000);