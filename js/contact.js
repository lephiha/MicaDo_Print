// ===================================
// CONTACT.JS - Contact Page Handler
// ===================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initContactPage();
});

function initContactPage() {
    initContactForm();
    initFAQ();
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // In real application, send data to server
    // For demo, just show success message
    submitForm(formData);
}

function validateForm(data) {
    // Name validation
    if (data.name.trim().length < 2) {
        window.MicaDo.showNotification('Vui lòng nhập họ tên hợp lệ', 'error');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        window.MicaDo.showNotification('Số điện thoại không hợp lệ', 'error');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        window.MicaDo.showNotification('Email không hợp lệ', 'error');
        return false;
    }
    
    // Subject validation
    if (data.subject.trim().length < 5) {
        window.MicaDo.showNotification('Tiêu đề quá ngắn', 'error');
        return false;
    }
    
    // Message validation
    if (data.message.trim().length < 10) {
        window.MicaDo.showNotification('Nội dung tin nhắn quá ngắn', 'error');
        return false;
    }
    
    return true;
}

function submitForm(data) {
    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Success
        window.MicaDo.showNotification('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Log data (for demo)
        console.log('Form submitted:', data);
    }, 1500);
}

// ===== FAQ =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===== SMOOTH SCROLL TO CONTACT FORM =====
function scrollToContactForm() {
    const contactForm = document.querySelector('.contact-form-wrapper');
    if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Make function available globally
window.scrollToContactForm = scrollToContactForm;