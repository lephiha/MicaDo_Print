// ===================================
// AUTH.JS - Login & Register Handler
// ===================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
});

function initAuth() {
    initTabs();
    initPasswordToggle();
    initPasswordStrength();
    initLoginForm();
    initRegisterForm();
    initSocialLogin();
}

// ===== TABS =====
function initTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const switchLinks = document.querySelectorAll('.switch-tab');
    
    // Tab buttons
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            switchToTab(targetTab);
        });
    });
    
    // Switch links
    switchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.dataset.tab;
            switchToTab(targetTab);
        });
    });
}

function switchToTab(tabName) {
    // Remove active from all tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.auth-form-container').forEach(container => {
        container.classList.remove('active');
    });
    
    // Add active to target tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// ===== PASSWORD TOGGLE =====
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// ===== PASSWORD STRENGTH =====
function initPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthBar = document.getElementById('passwordStrength');
    
    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            strengthBar.className = 'password-strength show ' + strength;
        });
    }
}

function calculatePasswordStrength(password) {
    if (password.length === 0) return '';
    
    let strength = 0;
    
    // Length
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Contains numbers
    if (/[0-9]/.test(password)) strength++;
    
    // Contains special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

// ===== LOGIN FORM =====
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate
    if (!validateEmail(email)) {
        window.MicaDo.showNotification('Email không hợp lệ', 'error');
        return;
    }
    
    if (password.length < 6) {
        window.MicaDo.showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Check credentials (demo - in real app, call API)
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Success
            saveCurrentUser(user, remember);
            window.MicaDo.showNotification('Đăng nhập thành công!', 'success');
            
            // Redirect after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            // Failed
            window.MicaDo.showNotification('Email hoặc mật khẩu không đúng', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

// ===== REGISTER FORM =====
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Validate
    if (name.trim().length < 2) {
        window.MicaDo.showNotification('Họ tên phải có ít nhất 2 ký tự', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        window.MicaDo.showNotification('Email không hợp lệ', 'error');
        return;
    }
    
    if (!validatePhone(phone)) {
        window.MicaDo.showNotification('Số điện thoại không hợp lệ', 'error');
        return;
    }
    
    if (password.length < 6) {
        window.MicaDo.showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        window.MicaDo.showNotification('Mật khẩu xác nhận không khớp', 'error');
        return;
    }
    
    if (!terms) {
        window.MicaDo.showNotification('Vui lòng đồng ý với điều khoản dịch vụ', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng ký...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Check if email exists
        const users = getUsers();
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            window.MicaDo.showNotification('Email đã được sử dụng', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        saveUsers(users);
        
        // Success
        window.MicaDo.showNotification('Đăng ký thành công!', 'success');
        
        // Switch to login tab after 1 second
        setTimeout(() => {
            switchToTab('login');
            // Pre-fill email
            document.getElementById('loginEmail').value = email;
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            e.target.reset();
        }, 1000);
    }, 1500);
}

// ===== SOCIAL LOGIN =====
function initSocialLogin() {
    const socialBtns = document.querySelectorAll('.social-btn');
    
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
            window.MicaDo.showNotification(`Đăng nhập với ${provider} đang được phát triển`, 'info');
        });
    });
}

// ===== VALIDATION =====
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhone(phone) {
    const regex = /^[0-9]{10,11}$/;
    return regex.test(phone.replace(/\s/g, ''));
}

// ===== LOCAL STORAGE =====
function getUsers() {
    const users = localStorage.getItem('micado_users');
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem('micado_users', JSON.stringify(users));
}

function saveCurrentUser(user, remember) {
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email
    };
    
    if (remember) {
        localStorage.setItem('micado_current_user', JSON.stringify(userData));
    } else {
        sessionStorage.setItem('micado_current_user', JSON.stringify(userData));
    }
}

function getCurrentUser() {
    const user = localStorage.getItem('micado_current_user') || 
                  sessionStorage.getItem('micado_current_user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('micado_current_user');
    sessionStorage.removeItem('micado_current_user');
    window.location.href = 'login.html';
}

// Export functions
window.MicaDo = window.MicaDo || {};
window.MicaDo.getCurrentUser = getCurrentUser;
window.MicaDo.logout = logout;