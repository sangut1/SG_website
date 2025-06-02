/**
 * Main JavaScript for Santos Gutierrez Figueroa
 * Handles general website functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize navbar scroll behavior
    initNavbarScroll();
    
    // Initialize form validation and submission
    initContactForm();
    
    // Initialize animations
    initAnimations();
});

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Get header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Navbar scroll behavior
function initNavbarScroll() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const headerHeight = document.querySelector('header').offsetHeight;
            
            if (window.scrollY >= sectionTop - headerHeight - 10) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Contact form validation and submission
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('is-invalid');
                }
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                
                // Use FormSpree for form submission
                const formData = new FormData(contactForm);
                
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        // Success
                        formStatus.innerHTML = '<div class="alert alert-success">¡Gracias por tu mensaje! Te responderemos lo antes posible.</div>';
                        contactForm.reset();
                    } else {
                        // Error
                        formStatus.innerHTML = '<div class="alert alert-danger">Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.</div>';
                    }
                })
                .catch(error => {
                    formStatus.innerHTML = '<div class="alert alert-danger">Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.</div>';
                    console.error('Error:', error);
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
            } else {
                formStatus.innerHTML = '<div class="alert alert-warning">Por favor, completa todos los campos correctamente.</div>';
            }
        });
        
        // Clear validation on input
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('is-invalid');
                formStatus.innerHTML = '';
            });
        });
    }
}

// Initialize animations
function initAnimations() {
    // Simple reveal animations on scroll
    const revealElements = document.querySelectorAll('.card, .feature-image, .about-image, .nft-card');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });
        
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        revealElements.forEach(el => {
            el.classList.add('revealed');
        });
    }
}
