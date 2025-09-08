// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    // Simple preloader without Lottie
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// Smooth scrolling for navigation links (only for anchor links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active navigation link on scroll and handle section visibility
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

// Function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
        rect.bottom >= 0
    );
}

// Function to handle section visibility
function handleSectionVisibility() {
    sections.forEach((section) => {
        // Skip hero section as it's handled separately
        if (section.id === 'home') return;
        
        if (isInViewport(section)) {
            section.classList.add('visible');
            
            // Handle section-specific content
            const content = section.querySelector('.hero-content, .about-content, .contact-container');
            if (content) {
                content.classList.add('visible');
            }
            
            // Handle experience items
            const experienceItems = section.querySelectorAll('.experience-item');
            if (experienceItems.length) {
                experienceItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 200);
                });
            }
            
            // Handle project cards
            const projectCards = section.querySelectorAll('.project-card');
            if (projectCards.length) {
                projectCards.forEach((card) => {
                    card.classList.add('visible');
                });
            }
        }
    });
}

// Handle scroll events
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    // Update active navigation link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Handle section visibility
    handleSectionVisibility();

    // Navigation scroll effect
    const nav = document.querySelector('.nav-container');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});



// Typed.js initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typing animation
    if (document.querySelector('#typed') && typeof Typed !== 'undefined') {
        try {
            new Typed('#typed', {
                strings: ['Software Developer', 'Web Developer', 'Problem Solver', 'C++ Programmer', 'Full Stack Developer'],
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 2000,
                startDelay: 1000,
                loop: true,
                showCursor: false,
                cursorChar: '',
                autoInsertCss: false,
                smartBackspace: true
            });
        } catch (error) {
            console.error('Typed.js error:', error);
            // Fallback: just show the text
            document.querySelector('#typed').textContent = 'Software Developer';
        }
    } else if (document.querySelector('#typed')) {
        // Fallback if Typed.js is not loaded
        document.querySelector('#typed').textContent = 'Software Developer';
    }

    // Initialize AI Assistant
    const aiAssistant = document.getElementById('ai-animation');
    if (aiAssistant) {
        // Temporarily disable AI assistant Lottie
        /*
        const assistantAnimation = lottie.loadAnimation({
            container: aiAssistant,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://app.lottiefiles.com/share/9575adb0-2d25-4810-9028-b88e0478d7ec'
        });
        */

        // Add click handler for the assistant
        document.getElementById('ai-assistant').addEventListener('click', () => {
            // You can add your chatbot or help system initialization here
            showNotification('AI Assistant is here to help!', 'success');
        });
    }

    // Make hero section visible immediately
    const heroSection = document.querySelector('#home');
    const heroContent = document.querySelector('.hero-content');
    if (heroSection) {
        heroSection.classList.add('visible');
    }
    if (heroContent) {
        heroContent.classList.add('visible');
    }

    // Handle other sections
    handleSectionVisibility();
    animateSkills();
    
    // Initialize enhanced skills functionality
    initSkillsFiltering();
    initSkillsHoverEffects();
    
    // Observe all sections except hero
    document.querySelectorAll('section:not(#home)').forEach(section => {
        observer.observe(section);
    });
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-element').forEach(element => {
        observer.observe(element);
    });

    // Initialize project cards
    initProjectCards();
});

// Scroll to top button
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Project filters
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Enhanced Skills Animation and Functionality
function animateSkills() {
    const skills = document.querySelectorAll('.skill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const skill = entry.target;
                
                // Add staggered animation delay
                setTimeout(() => {
                    skill.classList.add('animate');
                }, index * 100);
                
                // Animate progress bars
                const progressBar = skill.querySelector('.progress-bar');
                const percentage = parseInt(skill.style.getPropertyValue('--percentage')) || 0;
                
                if (progressBar && percentage) {
                    const circumference = 2 * Math.PI * 18; // r=18
                    const offset = circumference - (percentage / 100) * circumference;
                    
                    setTimeout(() => {
                        progressBar.style.strokeDashoffset = offset;
                    }, index * 100 + 300);
                }
                
                // Animate skill counter
                animateSkillCounter(skill, percentage);
            }
        });
    }, { threshold: 0.3 });

    skills.forEach(skill => observer.observe(skill));
}

// Skills Category Filtering
function initSkillsFiltering() {
    const categoryFilters = document.querySelectorAll('.category-filter');
    const skills = document.querySelectorAll('.skill');
    
    if (!categoryFilters.length || !skills.length) return;
    
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active filter
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const category = filter.getAttribute('data-category');
            
            // Filter skills with animation
            skills.forEach((skill, index) => {
                const skillCategory = skill.getAttribute('data-category');
                
                if (category === 'all' || skillCategory === category) {
                    skill.style.display = 'block';
                    setTimeout(() => {
                        skill.style.opacity = '1';
                        skill.style.transform = 'translateY(0) scale(1)';
                    }, index * 50);
                } else {
                    skill.style.opacity = '0';
                    skill.style.transform = 'translateY(20px) scale(0.8)';
                    setTimeout(() => {
                        skill.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Enhanced Skills Hover Effects
function initSkillsHoverEffects() {
    const skills = document.querySelectorAll('.skill');
    
    skills.forEach(skill => {
        const skillCard = skill.querySelector('.skill-card');
        const progressBar = skill.querySelector('.progress-bar');
        
        skill.addEventListener('mouseenter', (event) => {
            // Add ripple effect
            createRipple(skillCard, event);
            
            // Animate progress bar
            if (progressBar) {
                const percentage = parseInt(skill.style.getPropertyValue('--percentage')) || 0;
                const circumference = 2 * Math.PI * 18;
                const offset = circumference - (percentage / 100) * circumference;
                progressBar.style.strokeDashoffset = offset;
            }
        });
        
        skill.addEventListener('mouseleave', () => {
            // Reset progress bar
            if (progressBar) {
                progressBar.style.strokeDashoffset = 126; // Full circle
            }
        });
    });
}

// Create ripple effect
function createRipple(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add ripple animation CSS if not exists
    if (!document.getElementById('ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Skills Progress Counter Animation
function animateSkillCounter(skill, percentage) {
    const percentageElement = skill.querySelector('.skill-percentage');
    
    if (percentageElement && percentage > 0) {
        let count = 0;
        const increment = percentage / 50; // Animation duration
        
        const counter = setInterval(() => {
            count += increment;
            if (count >= percentage) {
                percentageElement.textContent = percentage + '%';
                clearInterval(counter);
            } else {
                percentageElement.textContent = Math.floor(count) + '%';
            }
        }, 20);
    }
}

// Visitor counter
const visitorCount = document.getElementById('visitor-count');
if (visitorCount) {
    let count = localStorage.getItem('visitorCount') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    visitorCount.textContent = count;
}

// Particles.js initialization
if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
    try {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#ffffff'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    } catch (error) {
        console.error('Particles.js error:', error);
    }
}

// Category switching
const categoryBtns = document.querySelectorAll('.category-btn');
const categorySections = document.querySelectorAll('.category-section');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and sections
        categoryBtns.forEach(b => b.classList.remove('active'));
        categorySections.forEach(s => s.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Show corresponding section
        const category = btn.getAttribute('data-category');
        document.getElementById(category).classList.add('active');
    });
});

// Contact Form Handling with Netlify Forms
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    console.log('Contact form found, adding event listener');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted, preventing default');

        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        console.log('Button state changed to loading');

        try {
            const formData = new FormData(contactForm);
            console.log('Form data created:', Array.from(formData.entries()));
            
            // Encode form data for Netlify
            const data = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                data.append(key, value);
            }
            
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data.toString()
            });
            
            console.log('Response received:', response.status, response.statusText);

            if (response.ok) {
                // Show success message
                console.log('Response is OK, showing success notification');
                showNotification('Message sent successfully to Youssef! Thank you for reaching out.', 'success');
                contactForm.reset();
            } else {
                console.log('Response not OK, error:', response.statusText);
                throw new Error(`Server responded with status ${response.status}`);
            }
        } catch (error) {
            console.error('Catch block - Error:', error);
            let errorMessage = 'Failed to send message. Please try again later.';
            
            // Provide more specific error messages
            if (error.message.includes('404')) {
                errorMessage = 'Form configuration error. Please contact the site administrator.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.message.includes('error')) {
                errorMessage = `Error: ${error.message}`;
            }
            
            console.log('Showing error notification:', errorMessage);
            showNotification(errorMessage, 'error');
        } finally {
            // Reset button state
            console.log('Resetting button state');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
} else {
    console.log('Contact form not found!');
}

// Notification system
function showNotification(message, type = 'info') {
    console.log('showNotification called with:', message, type);
    
    // Mobile-specific debugging
    const isMobile = window.innerWidth <= 768;
    console.log('Is mobile device:', isMobile);
    console.log('Viewport dimensions:', window.innerWidth, 'x', window.innerHeight);
    
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        console.log('Removing existing notification');
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add mobile-specific attributes
    if (isMobile) {
        notification.style.position = 'fixed';
        notification.style.zIndex = '999999';
        notification.style.top = '20px';
        notification.style.left = '10px';
        notification.style.right = '10px';
        notification.style.width = 'calc(100vw - 20px)';
        notification.style.transform = 'translateY(-100%)';
        notification.style.opacity = '0';
        console.log('Applied mobile-specific styles');
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    console.log('Notification element created:', notification);
    console.log('Notification computed styles before adding:', {
        position: notification.style.position,
        zIndex: notification.style.zIndex,
        top: notification.style.top
    });

    // Add to page
    document.body.appendChild(notification);
    console.log('Notification added to body');
    
    // Force a reflow to ensure styles are applied
    notification.offsetHeight;

    // Add click to close functionality with touch support
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Close button clicked');
        notification.remove();
    });
    
    // Add touch support for mobile
    if (isMobile) {
        closeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button touched');
            notification.remove();
        });
        
        // Make the entire notification clickable on mobile
        notification.addEventListener('touchend', (e) => {
            if (e.target === notification || e.target.classList.contains('notification-content')) {
                e.preventDefault();
                console.log('Notification touched - closing');
                notification.remove();
            }
        });
    }

    // Auto remove after 7 seconds (longer for mobile)
    const autoRemoveTime = isMobile ? 7000 : 5000;
    setTimeout(() => {
        if (notification.parentNode) {
            console.log(`Auto-removing notification after ${autoRemoveTime/1000} seconds`);
            notification.remove();
        }
    }, autoRemoveTime);

    // Trigger animation with a slight delay for mobile
    const animationDelay = isMobile ? 200 : 100;
    setTimeout(() => {
        console.log('Adding show class to notification');
        notification.classList.add('show');
        
        // Additional mobile animation trigger
        if (isMobile) {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
            console.log('Applied mobile animation styles manually');
        }
    }, animationDelay);
    
    // Log final computed styles
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(notification);
        console.log('Final notification computed styles:', {
            position: computedStyle.position,
            zIndex: computedStyle.zIndex,
            top: computedStyle.top,
            left: computedStyle.left,
            right: computedStyle.right,
            transform: computedStyle.transform,
            opacity: computedStyle.opacity,
            visibility: computedStyle.visibility
        });
    }, animationDelay + 100);
}

// Test notification function for debugging
function testNotification() {
    console.log('Testing notification system...');
    showNotification('Test notification - this should appear!', 'success');
}

// Make test function available globally for debugging
window.testNotification = testNotification;

// Check if notification styles are loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, running checks...');
    
    // Test if notification CSS exists
    const testNotification = document.createElement('div');
    testNotification.className = 'notification';
    testNotification.style.position = 'fixed';
    testNotification.style.top = '-100px';
    document.body.appendChild(testNotification);
    
    const computedStyle = window.getComputedStyle(testNotification);
    console.log('Notification CSS check - position:', computedStyle.position);
    console.log('Notification CSS check - z-index:', computedStyle.zIndex);
    
    document.body.removeChild(testNotification);
    
    // Check if contact form exists
    const form = document.getElementById('contact-form');
    console.log('Contact form exists:', !!form);
    if (form) {
        console.log('Form action:', form.action);
    }
});

// ========================================
// MOBILE ADMIN ACCESS FUNCTION
// ========================================

// Function to trigger admin login from mobile menu
function triggerAdminLogin() {
    // Close mobile menu first
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
    }
    
    // Small delay to allow menu to close
    setTimeout(() => {
        if (window.visitorTracker) {
            window.visitorTracker.showAdminLogin();
        } else {
            // Fallback if visitor tracker isn't ready yet
            setTimeout(() => {
                if (window.visitorTracker) {
                    window.visitorTracker.showAdminLogin();
                } else {
                    alert('Admin system not ready. Please try again in a moment.');
                }
            }, 1000);
        }
    }, 300);
}

// Make function globally available
window.triggerAdminLogin = triggerAdminLogin;

// Initialize project cards
function initProjectCards() {
  document.querySelectorAll('.project-card').forEach(function(card) {
    const cardInner = card.querySelector('.project-card-inner');
    
    if (cardInner) {
      // Remove any existing click listeners
      card.removeEventListener('click', handleCardClick);
      
      // Add click handler
      card.addEventListener('click', handleCardClick);
    }
  });
}

// Handle card click event
function handleCardClick(e) {
  e.stopPropagation(); // Prevent click from propagating
  
  const cardInner = this.querySelector('.project-card-inner');
  if (!cardInner) return;
  
  // Unflip all other cards
  document.querySelectorAll('.project-card-inner').forEach(function(otherCard) {
    if (otherCard !== cardInner && otherCard.classList.contains('flipped')) {
      otherCard.classList.remove('flipped');
    }
  });
  
  // Add a small delay before flipping the clicked card
  setTimeout(() => {
    cardInner.classList.toggle('flipped');
  }, 50);
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initProjectCards();
});

// --- Floating Action Button Menu ---
const fabButton = document.getElementById('fab-button');
const fabMenu = document.querySelector('.fab-menu');
const fabIcon = document.getElementById('fab-icon');

function toggleFabMenu() {
  fabButton.classList.toggle('active');
  fabMenu.classList.toggle('active');
  
  // Change icon
  if (fabButton.classList.contains('active')) {
    fabIcon.className = 'fas fa-times';
  } else {
    fabIcon.className = 'fas fa-bars';
  }
}

function closeFabMenu() {
  fabButton.classList.remove('active');
  fabMenu.classList.remove('active');
  fabIcon.className = 'fas fa-bars';
}

if (fabButton && fabMenu) {
  fabButton.addEventListener('click', toggleFabMenu);
  
  // Close menu when clicking on menu items (with delay for external links)
  const fabItems = document.querySelectorAll('.fab-item');
  fabItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      
      // If it's an external link (not starting with #), add a small delay
      if (href && !href.startsWith('#')) {
        e.preventDefault();
        setTimeout(() => {
          window.location.href = href;
        }, 100);
      }
      
      closeFabMenu();
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!fabButton.contains(e.target) && !fabMenu.contains(e.target)) {
      closeFabMenu();
    }
  });
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fabButton.classList.contains('active')) {
      closeFabMenu();
    }
  });
}