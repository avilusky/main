// Main Application Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    JourneyManager.init();
    MatrixManager.init();
    
    // Set up global error handling
    window.addEventListener('error', function(e) {
        console.error('Application Error:', e.error);
    });
    
    // Performance monitoring
    if (window.performance && performance.navigation.type === 1) {
        console.log('Page reloaded');
    }
    
    // Browser compatibility check
    checkBrowserCompatibility();
    
    // Initialize smooth scroll polyfill if needed
    initSmoothScroll();
});

// Browser compatibility check
function checkBrowserCompatibility() {
    const features = {
        'CSS Grid': CSS.supports('display', 'grid'),
        'CSS Variables': CSS.supports('--test', '0'),
        'Flexbox': CSS.supports('display', 'flex'),
        'Backdrop Filter': CSS.supports('backdrop-filter', 'blur(10px)')
    };
    
    const unsupported = Object.entries(features)
        .filter(([feature, supported]) => !supported)
        .map(([feature]) => feature);
    
    if (unsupported.length > 0) {
        console.warn('Some features may not be fully supported:', unsupported);
    }
}

// Smooth scroll polyfill for older browsers
function initSmoothScroll() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Load smooth scroll polyfill here if needed
        console.log('Smooth scroll not natively supported');
    }
}

// Global utility functions
window.utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        const start = performance.now();
        
        const fade = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;
            
            element.style.opacity = Math.min(progress, 1);
            
            if (progress < 1) {
                window.requestAnimationFrame(fade);
            }
        };
        
        window.requestAnimationFrame(fade);
    },
    
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
        
        const fade = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = elapsed / duration;
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                window.requestAnimationFrame(fade);
            } else {
                element.style.display = 'none';
            }
        };
        
        window.requestAnimationFrame(fade);
    }
};

// Performance optimization
window.addEventListener('load', () => {
    // Lazy load images if needed
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});

// Analytics or tracking (placeholder)
window.trackEvent = function(category, action, label) {
    console.log('Event tracked:', { category, action, label });
    // Add actual analytics code here if needed
};