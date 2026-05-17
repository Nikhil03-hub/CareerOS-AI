/* --- START: auth token bootstrap (inserted by AI) --- */
(function () {
    try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            try {
                localStorage.setItem('authToken', token);
            } catch (e) {
                console.warn('[auth] Failed to write token to localStorage', e);
            }

            // Remove token from URL
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            window.history.replaceState({}, document.title, url.toString());

            console.log('[auth] token saved');
        }
    } catch (err) {
        console.warn('[auth] token bootstrap error', err);
    }

    window.authHelpers = window.authHelpers || {};
    window.authHelpers.getAuthToken = function () {
        try {
            return localStorage.getItem('authToken');
        } catch (e) {
            return null;
        }
    };
})();
/* --- END: auth token bootstrap --- */
/* --------------------------------------------------- */

// Initialize GSAP and ScrollTrigger
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Initialize Lenis Smooth Scroll with momentum
let lenis;

function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Update ScrollTrigger on Lenis scroll
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target && lenis) {
                    lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.5,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    });
                }
            });
        });
    }
}

// Initialize smooth scroll when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
    initSmoothScroll();
}

// ========== GSAP Text Reveal Animations ==========
function splitTextIntoWords(element) {
    if (!element) return;

    const text = element.textContent.trim();
    const words = text.split(/\s+/);

    element.innerHTML = words.map(word => {
        return `<span class="word-wrapper"><span class="word">${word}</span></span>`;
    }).join(' ');

    return element.querySelectorAll('.word');
}

function splitTextIntoChars(element) {
    if (!element) return;

    const text = element.textContent.trim();
    const chars = text.split('');

    element.innerHTML = chars.map(char => {
        if (char === ' ') {
            return '<span class="char-space"> </span>';
        }
        return `<span class="char">${char}</span>`;
    }).join('');

    return element.querySelectorAll('.word, .char');
}

// Text reveal animation function
function animateTextReveal(selector, options = {}) {
    const {
        splitBy = 'words', // 'words' or 'chars'
        duration = 0.8,
        stagger = 0.05,
        delay = 0,
        y = 50,
        opacity = 0,
        ease = 'power3.out',
        scrollTrigger = true,
        scrollTriggerOptions = {}
    } = options;

    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
        let textElements;

        if (splitBy === 'chars') {
            textElements = splitTextIntoChars(element);
        } else {
            textElements = splitTextIntoWords(element);
        }

        if (!textElements || textElements.length === 0) return;

        // Set initial state
        gsap.set(textElements, {
            opacity: opacity,
            y: y,
            display: 'inline-block'
        });

        // Create animation
        const scrollTriggerConfig = scrollTrigger ? {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none',
            ...scrollTriggerOptions
        } : null;

        const tl = gsap.timeline({
            delay: delay + (index * 0.1),
            scrollTrigger: scrollTriggerConfig
        });

        tl.to(textElements, {
            opacity: 1,
            y: 0,
            duration: duration,
            stagger: stagger,
            ease: ease
        });
    });
}

// Initialize text reveal animations when DOM is ready
function initTextRevealAnimations() {
    if (typeof gsap === 'undefined') {
        setTimeout(initTextRevealAnimations, 100);
        return;
    }

    // We will use a more advanced animation system now
    initPremiumAnimations();
}

// ========== Premium Animations System ==========
function initPremiumAnimations() {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. HERO SECTION ANIMATIONS
    initHeroAnimations();

    // 2. COMPANIES SECTION (Ticker)
    initCompaniesAnimations();

    // 3. FEATURES / CATEGORIES SECTION
    initCategoriesAnimations();

    // 4. PLATFORM PREVIEW SECTION
    initPlatformPreviewAnimations();

    // 5. FAQ SECTION
    initFaqAnimations();

    // 6. CONTACT SECTION
    initContactAnimations();
}

// 1. HERO SECTION
function initHeroAnimations() {
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Split Hero Title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const words = splitTextIntoWords(heroTitle);

        // Animate Title: Fade up, unblur, rotate slightly
        heroTimeline.fromTo(words,
            {
                y: 80,
                opacity: 0,
                filter: "blur(10px)",
                rotation: 5,
                transformOrigin: "0% 50%"
            },
            {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                rotation: 0,
                stagger: 0.05,
                duration: 1.2,
                clearProps: "all" // Clean up for accessibility/interaction
            }
        );
    }

    // Animate Subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroTimeline.fromTo(heroSubtitle,
            { y: 30, opacity: 0, filter: "blur(5px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 },
            "-=0.8"
        );
    }

    // Animate Buttons
    const heroBtns = document.querySelectorAll('.hero-text button');
    if (heroBtns.length > 0) {
        heroTimeline.fromTo(heroBtns,
            { y: 20, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.8, ease: "back.out(1.7)" },
            "-=0.6"
        );
    }

    // Animate Social Proof
    const socialProof = document.querySelector('.social-proof');
    if (socialProof) {
        heroTimeline.fromTo(socialProof,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8 },
            "-=0.6"
        );
    }

    // Animate Hero Video (Slide in + Scale)
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
        gsap.fromTo(videoWrapper,
            {
                opacity: 0,
                x: 50,
                scale: 0.9,
                rotation: -5
            },
            {
                opacity: 1,
                x: 0,
                scale: 1,
                rotation: -2, // Keep slight tilt
                duration: 1.5,
                ease: "power2.out",
                delay: 0.5 // Start slightly after title
            }
        );

        // Parallax effect on video
        gsap.to(videoWrapper, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }
}

// 2. COMPANIES SECTION
function initCompaniesAnimations() {
    const tickerSection = document.querySelector('.ticker-section');
    if (!tickerSection) return;

    // Fade in the whole section
    gsap.fromTo(tickerSection,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: tickerSection,
                start: "top 85%"
            }
        }
    );

    // Staggered reveal for company pills (if they weren't in a ticker)
    // Since they are in a ticker, we just fade the container. 
    // But let's add a hover pulse effect to them
    const pills = document.querySelectorAll('.company-pill');
    pills.forEach(pill => {
        pill.addEventListener('mouseenter', () => {
            gsap.to(pill, { scale: 1.1, duration: 0.3, ease: "power1.out" });
        });
        pill.addEventListener('mouseleave', () => {
            gsap.to(pill, { scale: 1, duration: 0.3, ease: "power1.out" });
        });
    });
}

// 3. FEATURES / CATEGORIES SECTION
function initCategoriesAnimations() {
    const cards = document.querySelectorAll('.category-card');
    if (cards.length === 0) return;

    // Staggered reveal of cards
    gsap.fromTo(cards,
        {
            y: 60,
            opacity: 0,
            scale: 0.9,
            filter: "blur(5px)"
        },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".categories-grid",
                start: "top 80%"
            }
        }
    );

    // Title animation
    const title = document.querySelector('.categories-title');
    if (title) {
        gsap.fromTo(title,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%"
                }
            }
        );
    }
}

// 4. PLATFORM PREVIEW SECTION
function initPlatformPreviewAnimations() {
    const section = document.querySelector('.platform-works-section');
    if (!section) return;

    // Video playback control
    const video = document.getElementById('platform-preview-video');
    if (video) {
        ScrollTrigger.create({
            trigger: section,
            start: "top 70%",
            onEnter: () => {
                video.play().catch(e => console.log("Video autoplay prevented:", e));
            },
            onEnterBack: () => {
                video.play().catch(e => console.log("Video autoplay prevented:", e));
            },
            onLeave: () => {
                // Keep playing when leaving (as per requirement - should not stop)
            },
            onLeaveBack: () => {
                // Keep playing when leaving (as per requirement - should not stop)
            }
        });
    }

    // Left side: Feature Card (Image)
    const featureCard = section.querySelector('.feature-card');
    if (featureCard) {
        gsap.fromTo(featureCard,
            { x: -50, opacity: 0, rotationY: 10 },
            {
                x: 0,
                opacity: 1,
                rotationY: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%"
                }
            }
        );
    }

    // Right side: Steps
    const steps = section.querySelectorAll('.step-card');
    if (steps.length > 0) {
        gsap.fromTo(steps,
            { x: 50, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".steps-container",
                    start: "top 75%"
                }
            }
        );
    }
}

// 5. FAQ SECTION
function initFaqAnimations() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    gsap.fromTo(faqItems,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".faq-container",
                start: "top 80%"
            }
        }
    );
}

// 6. CONTACT SECTION
function initContactAnimations() {
    const contactSection = document.querySelector('.contact-section');
    if (!contactSection) return;

    // Animate Info Items
    const contactItems = contactSection.querySelectorAll('.contact-item');
    gsap.fromTo(contactItems,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            scrollTrigger: {
                trigger: ".contact-info",
                start: "top 80%"
            }
        }
    );

    // Animate Form
    const contactForm = contactSection.querySelector('.contact-form-wrapper');
    if (contactForm) {
        gsap.fromTo(contactForm,
            { y: 50, opacity: 0, scale: 0.95 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contactForm,
                    start: "top 75%"
                }
            }
        );
    }
}

// Initialize text reveal animations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initTextRevealAnimations, 300);
    });
} else {
    setTimeout(initTextRevealAnimations, 300);
}

// Also initialize after page fully loads
window.addEventListener('load', () => {
    setTimeout(initTextRevealAnimations, 100);
});

// Bubble particles for .btn-primary (Find Jobs Now)
function createBubbles(event, button) {
    // Get the inner div element
    const buttonDiv = button.querySelector('div');
    if (!buttonDiv) return;

    const rect = buttonDiv.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Create 4-6 small bubbles
    const bubbleCount = 4 + Math.floor(Math.random() * 3);

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('span');
        bubble.classList.add('bubble');

        // Random position near click point
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 10;

        bubble.style.left = (clickX + offsetX) + 'px';
        bubble.style.top = (clickY + offsetY) + 'px';

        // Random upward trajectory
        const bubbleX = (Math.random() - 0.5) * 15;
        const bubbleY = -(20 + Math.random() * 25);

        bubble.style.setProperty('--bubble-x', bubbleX + 'px');
        bubble.style.setProperty('--bubble-y', bubbleY + 'px');

        // Random size variation
        const size = 3 + Math.random() * 2;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';

        buttonDiv.appendChild(bubble);

        // Trigger animation
        requestAnimationFrame(() => {
            bubble.classList.add('animate');
        });

        // Remove after animation
        setTimeout(() => {
            bubble.remove();
        }, 600);
    }
}

// Ripple effect for .btn-header (Dashboard)
function createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 350);
}

// Sparkle effect for .btn-header
function createSparkles(button) {
    const sparkleCount = 3;
    const rect = button.getBoundingClientRect();

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('span');
        sparkle.classList.add('sparkle');

        // Random position within button
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;

        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.setProperty('--sparkle-x', (Math.random() * 20 - 10) + 'px');
        sparkle.style.setProperty('--sparkle-y', (Math.random() * -30 - 10) + 'px');

        button.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1200);
    }
}

// Add click bubble effect for .btn-primary
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function (e) {
        createBubbles(e, this);
    });
});

// Add click ripple effect for .btn-header
document.querySelectorAll('.btn-header').forEach(button => {
    button.addEventListener('click', function (e) {
        createRipple(e, this);
    });
});

// Add sparkle effect on hover for .btn-header
document.querySelectorAll('.btn-header').forEach(button => {
    let sparkleInterval;

    button.addEventListener('mouseenter', function () {
        createSparkles(this);
        sparkleInterval = setInterval(() => {
            createSparkles(this);
        }, 400);
    });

    button.addEventListener('mouseleave', function () {
        if (sparkleInterval) {
            clearInterval(sparkleInterval);
        }
    });
});

// Add click handlers for CTA buttons
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('click', function () {
        // Add your navigation logic here
        console.log('CTA button clicked');
    });
});

// Navigate to CareerOS graduate dashboard when header CTA is clicked
document.querySelectorAll('.btn-header').forEach(button => {
    button.addEventListener('click', function () {
        window.location.href = '/graduate/dashboard/';
    });
});

// Scroll to top when logo is clicked
function setupLogoScroll() {
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Scroll to top using Lenis if available
            if (lenis) {
                lenis.scrollTo(0, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                });
            } else {
                // Fallback to native smooth scroll
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }

            return false;
        };
    }
}

// Setup logo scroll after Lenis is initialized
function initLogoScroll() {
    if (lenis) {
        setupLogoScroll();
    } else {
        // Retry after a short delay if Lenis isn't ready
        setTimeout(initLogoScroll, 100);
    }
}

// Setup immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initLogoScroll, 200);
    });
} else {
    setTimeout(initLogoScroll, 200);
}

// Also try after page fully loads
window.addEventListener('load', () => {
    setTimeout(initLogoScroll, 200);
});

// FAQ Accordion functionality with blur blink effect
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function () {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const answer = this.nextElementSibling;
        const answerText = answer.querySelector('p');

        // Close all other FAQ items
        document.querySelectorAll('.faq-question').forEach(q => {
            if (q !== this) {
                q.setAttribute('aria-expanded', 'false');
                const otherAnswer = q.nextElementSibling;
                otherAnswer.style.maxHeight = '0';
                otherAnswer.style.padding = '0 28px';
                // Reset blur on closed items
                if (typeof gsap !== 'undefined' && otherAnswer.querySelector('p')) {
                    gsap.set(otherAnswer.querySelector('p'), { filter: 'blur(0px)' });
                }
            }
        });

        // Toggle current FAQ item
        if (isExpanded) {
            this.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = '0';
            answer.style.padding = '0 28px';
        } else {
            this.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.padding = '0 28px 24px 28px';

            // Apply blur blink effect using GSAP
            if (typeof gsap !== 'undefined' && answerText) {
                // Ensure text is visible and readable throughout
                answerText.style.opacity = '1';
                answerText.style.visibility = 'visible';

                // Create quick blur blink animation: blur in (clear) -> blur out (blurred) -> blur in (clear)
                const blurTimeline = gsap.timeline();

                // Start with slight blur
                gsap.set(answerText, { filter: 'blur(5px)' });

                // Blur in (clear) - very quick
                blurTimeline.to(answerText, {
                    filter: 'blur(0px)',
                    duration: 0.12,
                    ease: 'power1.out'
                })
                    // Blur out (blurred) - extremely quick blink
                    .to(answerText, {
                        filter: 'blur(4px)',
                        duration: 0.08,
                        ease: 'power1.in'
                    })
                    // Blur in (clear) - final clear state
                    .to(answerText, {
                        filter: 'blur(0px)',
                        duration: 0.15,
                        ease: 'power1.out'
                    });
            }
        }
    });
});

