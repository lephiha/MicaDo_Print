// profile.js
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserProfile();
    initProfileForm();
    initChangePasswordForm();
});

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
    }
}

function getCurrentUser() {
    const user = localStorage.getItem('micado_current_user') || 
                  sessionStorage.getItem('micado_current_user');
    return user ? JSON.parse(user) : null;
}

function loadUserProfile() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update sidebar
    document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    
    // Load profile data
    const profileData = getProfileData(user.id);
    document.getElementById('profileName').value = profileData.name || user.name;
    document.getElementById('profileEmail').value = user.email;
    document.getElementById('profilePhone').value = profileData.phone || '';
    document.getElementById('profileBirthday').value = profileData.birthday || '';
    document.getElementById('profileAddress').value = profileData.address || '';
}

function getProfileData(userId) {
    const profiles = JSON.parse(localStorage.getItem('micado_profiles') || '{}');
    return profiles[userId] || {};
}

function saveProfileData(userId, data) {
    const profiles = JSON.parse(localStorage.getItem('micado_profiles') || '{}');
    profiles[userId] = data;
    localStorage.setItem('micado_profiles', JSON.stringify(profiles));
}

function initProfileForm() {
    const form = document.getElementById('profileForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const user = getCurrentUser();
        const profileData = {
            name: document.getElementById('profileName').value,
            phone: document.getElementById('profilePhone').value,
            birthday: document.getElementById('profileBirthday').value,
            address: document.getElementById('profileAddress').value
        };
        
        saveProfileData(user.id, profileData);
        
        // Update current user name
        user.name = profileData.name;
        if (localStorage.getItem('micado_current_user')) {
            localStorage.setItem('micado_current_user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('micado_current_user', JSON.stringify(user));
        }
        
        window.MicaDo.showNotification('Cập nhật thông tin thành công!', 'success');
        setTimeout(() => location.reload(), 1000);
    });
}

function initChangePasswordForm() {
    const form = document.getElementById('changePasswordForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const current = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        
        if (newPass !== confirm) {
            window.MicaDo.showNotification('Mật khẩu xác nhận không khớp', 'error');
            return;
        }
        
        if (newPass.length < 6) {
            window.MicaDo.showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
            return;
        }
        
        window.MicaDo.showNotification('Đổi mật khẩu thành công!', 'success');
        form.reset();
    });
}

function handleLogout(e) {
    e.preventDefault();
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('micado_current_user');
        sessionStorage.removeItem('micado_current_user');
        window.location.href = 'index.html';
    }
}

window.handleLogout = handleLogout;