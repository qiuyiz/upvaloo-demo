// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Add active state to navbar on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Add particle effect on hero section (optional enhancement)
function createParticle() {
    const hero = document.querySelector('.hero-background');
    if (!hero) return;

    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particle-float ${5 + Math.random() * 10}s linear infinite;
    `;

    hero.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 15000);
}

// Create particles periodically
setInterval(createParticle, 300);

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Button click handlers with ripple effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Feature card hover tracking
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    });
});

// Waitlist form submission with EmailJS
const waitlistForm = document.getElementById('waitlist-form');
const waitlistFeedback = document.getElementById('waitlist-feedback');

if (waitlistForm) {
    waitlistForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = waitlistForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Get form values
        const name = document.getElementById('waitlist-name').value.trim();
        const email = document.getElementById('waitlist-email').value.trim();
        const state = document.getElementById('waitlist-state').value;

        // Basic validation
        if (!name || !email || !state) {
            showFeedback('Please fill in all fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFeedback('Please enter a valid email address.', 'error');
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Get EmailJS config from window (set by constants.js)
            const config = window.UPVALOO_CONFIG;

            if (!config || !config.EMAILJS_SERVICE_ID || !config.EMAILJS_TEMPLATE_ID) {
                throw new Error('EmailJS configuration not found');
            }

            // Send email via EmailJS
            const response = await emailjs.send(
                config.EMAILJS_SERVICE_ID,
                config.EMAILJS_TEMPLATE_ID,
                {
                    name: name,
                    email: email,
                    state: state
                }
            );

            if (response.status === 200) {
                showFeedback('Thanks for joining! We\'ll be in touch soon.', 'success');
                waitlistForm.reset();
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('EmailJS error:', error);
            showFeedback('Something went wrong. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Finfluencer Waitlist form submission
const finfluencerForm = document.getElementById('finfluencer-waitlist-form');
const finfluencerFeedback = document.getElementById('finfluencer-waitlist-feedback');

if (finfluencerForm) {
    finfluencerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = finfluencerForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Get form values
        const name = document.getElementById('finfluencer-name').value.trim();
        const email = document.getElementById('finfluencer-email').value.trim();
        const social = document.getElementById('finfluencer-social').value.trim();
        const state = document.getElementById('finfluencer-state').value;

        // Basic validation
        if (!name || !email || !social || !state) {
            showFinfluencerFeedback('Please fill in all fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFinfluencerFeedback('Please enter a valid email address.', 'error');
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Get EmailJS config from window
            const config = window.UPVALOO_CONFIG;

            if (!config || !config.EMAILJS_SERVICE_ID || !config.EMAILJS_FINFLUENCER_TEMPLATE_ID) {
                throw new Error('EmailJS configuration not found');
            }

            // Send email via EmailJS
            const response = await emailjs.send(
                config.EMAILJS_SERVICE_ID,
                config.EMAILJS_FINFLUENCER_TEMPLATE_ID,
                {
                    name: name,
                    email: email,
                    social_media: social,
                    state: state
                }
            );

            if (response.status === 200) {
                showFinfluencerFeedback('Thanks for joining! We\'ll be in touch soon.', 'success');
                finfluencerForm.reset();
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('EmailJS error:', error);
            showFinfluencerFeedback('Something went wrong. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

function showFinfluencerFeedback(message, type) {
    if (finfluencerFeedback) {
        finfluencerFeedback.textContent = message;
        finfluencerFeedback.className = `waitlist-feedback ${type}`;
        finfluencerFeedback.style.display = 'block';

        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                finfluencerFeedback.style.display = 'none';
            }, 5000);
        }
    }
}

function showFeedback(message, type) {
    if (waitlistFeedback) {
        waitlistFeedback.textContent = message;
        waitlistFeedback.className = `waitlist-feedback ${type}`;
        waitlistFeedback.style.display = 'block';

        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                waitlistFeedback.style.display = 'none';
            }, 5000);
        }
    }
}

// Finfluencer waitlist form submission with EmailJS
const finfluencerWaitlistForm = document.getElementById('finfluencer-waitlist-form');
const finfluencerWaitlistFeedback = document.getElementById('finfluencer-waitlist-feedback');

if (finfluencerWaitlistForm) {
    finfluencerWaitlistForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = finfluencerWaitlistForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Get form values
        const name = document.getElementById('finfluencer-name').value.trim();
        const email = document.getElementById('finfluencer-email').value.trim();
        const social_media = document.getElementById('finfluencer-social').value.trim();
        const state = document.getElementById('finfluencer-state').value;

        // Basic validation
        if (!name || !email || !social_media || !state) {
            showFinfluencerFeedback('Please fill in all fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFinfluencerFeedback('Please enter a valid email address.', 'error');
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Get EmailJS config from window (set by constants.js)
            const config = window.UPVALOO_CONFIG;

            if (!config || !config.EMAILJS_SERVICE_ID || !config.EMAILJS_FINFLUENCER_TEMPLATE_ID) {
                throw new Error('EmailJS configuration not found');
            }

            // Send email via EmailJS with finfluencer-specific template
            const response = await emailjs.send(
                config.EMAILJS_SERVICE_ID,
                config.EMAILJS_FINFLUENCER_TEMPLATE_ID,
                {
                    name: name,
                    email: email,
                    social_media: social_media,
                    state: state
                }
            );

            if (response.status === 200) {
                showFinfluencerFeedback('Thanks for joining! We\'ll be in touch soon.', 'success');
                finfluencerWaitlistForm.reset();
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('EmailJS error:', error);
            showFinfluencerFeedback('Something went wrong. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

function showFinfluencerFeedback(message, type) {
    if (finfluencerWaitlistFeedback) {
        finfluencerWaitlistFeedback.textContent = message;
        finfluencerWaitlistFeedback.className = `waitlist-feedback ${type}`;
        finfluencerWaitlistFeedback.style.display = 'block';

        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                finfluencerWaitlistFeedback.style.display = 'none';
            }, 5000);
        }
    }
}

console.log('Upvaloo website loaded successfully! 🚀');
