// ===== LENIS SMOOTH SCROLL INITIALIZATION =====
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Lenis animation frame
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Update ScrollTrigger on Lenis scroll
lenis.on('scroll', ScrollTrigger.update);

// Sync GSAP with Lenis
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ===== PARALLAX SCROLLING =====
gsap.utils.toArray('[data-speed]').forEach(element => {
    const speed = parseFloat(element.getAttribute('data-speed'));
    gsap.to(element, {
        y: (i, target) => (1 - speed) * ScrollTrigger.maxScroll(window) * -1,
        ease: 'none',
        scrollTrigger: {
            start: 0,
            end: 'max',
            invalidateOnRefresh: true,
            scrub: 0.5
        }
    });
});

// ===== REVEAL ANIMATIONS =====
gsap.utils.toArray('.reveal-up').forEach((element, index) => {
    gsap.from(element, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        onComplete: () => element.classList.add('revealed')
    });
});

gsap.utils.toArray('.reveal-text').forEach(element => {
    gsap.from(element, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
        },
        onComplete: () => element.classList.add('revealed')
    });
});

// ===== SPLIT TEXT ANIMATION =====
function splitText() {
    const titles = document.querySelectorAll('.split-text');
    titles.forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${index * 0.03}s`;
            title.appendChild(span);
        });
    });
}

splitText();

// Trigger split text animation
gsap.utils.toArray('.split-text').forEach(element => {
    ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => element.classList.add('revealed')
    });
});

// ===== TILT CARD EFFECT =====
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    });
});

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll('.magnetic-btn, .magnetic-icon').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const strength = 0.3; // Magnetic strength
        btn.style.setProperty('--mx', `${x * strength}px`);
        btn.style.setProperty('--my', `${y * strength}px`);
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
    });
});

// Sync Lenis with anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            lenis.scrollTo(target, {
                offset: -100,
                duration: 1.5,
            });
        }
    });
});

// ===== 3D NAME ROTATION ON SCROLL =====
const nameText = document.querySelector('.name-text');
let ticking = false;

lenis.on('scroll', ({ scroll }) => {
    if (!ticking && nameText) {
        window.requestAnimationFrame(() => {
            // Calculate rotation based on scroll position
            const scrollProgress = Math.min(scroll / 500, 1); // Max at 500px scroll
            const rotateY = scrollProgress * 360; // Full rotation
            const rotateX = Math.sin(scrollProgress * Math.PI * 2) * 20; // Wave effect
            const scale = 1 + (Math.sin(scrollProgress * Math.PI) * 0.1); // Subtle scale
            
            nameText.style.transform = `
                rotateY(${rotateY}deg) 
                rotateX(${rotateX}deg) 
                scale(${scale})
            `;
            
            ticking = false;
        });
        ticking = true;
    }
});

// Mouse movement parallax effect on name
if (nameText) {
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calculate rotation based on mouse position
        const rotateY = ((clientX / innerWidth) - 0.5) * 30; // -15 to 15 degrees
        const rotateX = ((clientY / innerHeight) - 0.5) * -30; // -15 to 15 degrees
        
        nameText.style.transform = `
            rotateY(${rotateY}deg) 
            rotateX(${rotateX}deg)
        `;
    });
}

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.cursor-dot');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    setTimeout(() => cursor.classList.remove('click'), 300);
});

// Cursor hover effects on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .icon, .project-card, .tech-item, .timeline-content, .contact-info-container');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.borderColor = 'var(--accent-color)';
        cursor.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderColor = 'var(--accent-color)';
        cursor.style.backgroundColor = 'transparent';
    });
});

// ===== HAMBURGER MENU =====
function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// ===== PAGE RELOAD HANDLING =====
window.onload = function () {
    if (performance.navigation.type === 1) {
        window.location.hash = "";
    }
    
    // Initialize all animations
    initializeAnimations();
};

function initializeAnimations() {
    // Set first section as visible
    const firstSection = document.querySelector('section');
    if (firstSection) {
        firstSection.classList.add('visible');
    }
}

// ===== PROGRESS BAR =====
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    const scrolled = progress * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
});

// ===== TYPING ANIMATION =====
const texts = ['Aspiring Engineer', 'Data Scientist', 'ML Enthusiast', 'IoT Developer'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function type() {
    const currentText = texts[textIndex];
    const typingElement = document.getElementById('typingText');
    
    if (!typingElement) return;
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, pauseTime);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }
    
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(type, speed);
}

// Start typing animation
type();

// ===== PARTICLES ANIMATION =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ===== ACTIVE NAVIGATION LINK =====
lenis.on('scroll', ({ scroll }) => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scroll >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===== THEME TOGGLE WITH WAVE TRANSITION =====
const btn = document.getElementById("modeToggle");
const btn2 = document.getElementById("modeToggle2");
const themeIcons = document.querySelectorAll(".icon");
const currentTheme = localStorage.getItem("theme");

// Create overlay for wave transition
const overlay = document.createElement('div');
overlay.className = 'theme-transition-overlay';
document.body.appendChild(overlay);

// Set initial theme
if (currentTheme === "dark") {
    setDarkMode(false); // false = no animation on initial load
}

// Event listeners for theme toggle
if (btn) {
    btn.addEventListener("click", function (e) {
        createWaveTransition(e, this);
    });
}

if (btn2) {
    btn2.addEventListener("click", function (e) {
        createWaveTransition(e, this);
    });
}

function createWaveTransition(event, button) {
    // Get button position
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Calculate the distance to the farthest corner
    const maxDistance = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );
    
    // Create wave element
    const wave = document.createElement('div');
    wave.className = 'theme-wave';
    wave.style.width = maxDistance * 2 + 'px';
    wave.style.height = maxDistance * 2 + 'px';
    wave.style.left = x + 'px';
    wave.style.top = y + 'px';
    wave.style.transform = 'translate(-50%, -50%) scale(0)';
    
    // Set the wave background to the new theme color
    let currentTheme = document.body.getAttribute("theme");
    if (currentTheme === "dark") {
        wave.style.background = '#ffffff'; // Light mode color
    } else {
        wave.style.background = '#212121'; // Dark mode color
    }
    
    overlay.appendChild(wave);
    
    // Trigger animation
    setTimeout(() => {
        wave.classList.add('active');
    }, 10);
    
    // Change theme after a slight delay for smooth transition
    setTimeout(() => {
        setTheme();
    }, 400);
    
    // Remove wave after animation
    setTimeout(() => {
        wave.remove();
    }, 1000);
}

function setTheme() {
    let currentTheme = document.body.getAttribute("theme");
    
    if (currentTheme === "dark") {
        setLightMode(true);
    } else {
        setDarkMode(true);
    }
}

function setDarkMode(animate = true) {
    document.body.setAttribute("theme", "dark");
    localStorage.setItem("theme", "dark");
    
    // Update theme toggle icons
    if (btn) btn.textContent = "☀️";
    if (btn2) btn2.textContent = "☀️";

    themeIcons.forEach((icon) => {
        const darkSrc = icon.getAttribute("src-dark");
        if (darkSrc) {
            icon.src = darkSrc;
        }
    });
}

function setLightMode(animate = true) {
    document.body.removeAttribute("theme");
    localStorage.setItem("theme", "light");
    
    // Update theme toggle icons
    if (btn) btn.textContent = "🌙";
    if (btn2) btn2.textContent = "🌙";

    themeIcons.forEach((icon) => {
        const lightSrc = icon.getAttribute("src-light");
        if (lightSrc) {
            icon.src = lightSrc;
        }
    });
}

// ===== SMOOTH SCROLL =====
// Already handled by Lenis above with anchor links

// Scroll indicator click
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            lenis.scrollTo(aboutSection, {
                offset: -100,
                duration: 1.5,
            });
        }
    });
}

// ===== BUTTON CLICK EFFECTS =====
document.querySelectorAll('.btn, .project-btn').forEach(button => {
    button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
        this.style.transform = '';
    });
});

// ===== PROJECT CARD INTERACTIONS =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(-8px) scale(0.98)';
    });
    
    card.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-10px)';
    });
});

// ===== PREVENT ICON TEXT SELECTION =====
document.querySelectorAll('.icon').forEach(icon => {
    icon.style.userSelect = 'none';
    icon.style.webkitUserSelect = 'none';
});

// ===== NAVIGATION SCROLL BEHAVIOR =====
let lastScroll = 0;
const nav = document.querySelector('#desktop-nav');
const hamburgerNav = document.querySelector('#hamburger-nav');

lenis.on('scroll', ({ scroll }) => {
    const currentScroll = scroll;
    
    if (currentScroll <= 0) {
        if (nav) nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        if (hamburgerNav) hamburgerNav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    } else {
        if (nav) nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        if (hamburgerNav) hamburgerNav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// ===== INITIALIZE ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth fade-in to body
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize theme based on saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        setDarkMode(false);
    } else {
        setLightMode(false);
    }
    
    // Initialize Experience Popups
    initializeExperiencePopups();
});

// ===== EXPERIENCE POPUP FUNCTIONALITY =====
function initializeExperiencePopups() {
    // Remove any existing overlays first
    const existingOverlays = document.querySelectorAll('.popup-overlay');
    existingOverlays.forEach(o => o.remove());
    
    // Create NEW overlay and append to body
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.zIndex = '9998';
    document.body.appendChild(overlay);
    
    console.log('Overlay created with z-index:', overlay.style.zIndex);
    
    // Get all timeline items
    const timelineItems = document.querySelectorAll('.timeline-content');
    
    console.log('Found timeline items:', timelineItems.length);
    
    timelineItems.forEach((item, index) => {
        const popup = item.querySelector('.timeline-popup');
        
        if (!popup) {
            console.warn('No popup found for timeline item', index);
            return;
        }
        
        // Force popup z-index
        popup.style.zIndex = '9999';
        console.log('Popup found for item', index, 'with z-index:', popup.style.zIndex);
        
        // Click to open popup
        item.addEventListener('click', function(e) {
            // Prevent opening if clicking on a link inside
            if (e.target.tagName === 'A') return;
            
            console.log('Timeline item clicked:', index);
            
            // Close any open popups first
            document.querySelectorAll('.timeline-popup.active').forEach(p => {
                if (p !== popup) {
                    p.classList.remove('active');
                }
            });
            
            // Toggle current popup
            const isActive = popup.classList.contains('active');
            popup.classList.toggle('active');
            overlay.classList.toggle('active', popup.classList.contains('active'));
            
            console.log('Popup active:', !isActive);
            console.log('Popup z-index when active:', window.getComputedStyle(popup).zIndex);
            console.log('Overlay z-index when active:', window.getComputedStyle(overlay).zIndex);
            
            // Prevent body scroll when popup is open
            if (popup.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                lenis.stop(); // Stop Lenis scroll
            } else {
                document.body.style.overflow = '';
                lenis.start(); // Resume Lenis scroll
            }
        });
    });
    
    // Close popup when clicking overlay
    overlay.addEventListener('click', function() {
        console.log('Overlay clicked - closing popups');
        document.querySelectorAll('.timeline-popup.active').forEach(popup => {
            popup.classList.remove('active');
        });
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start(); // Resume Lenis scroll
    });
    
    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('Escape pressed - closing popups');
            document.querySelectorAll('.timeline-popup.active').forEach(popup => {
                popup.classList.remove('active');
            });
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            lenis.start(); // Resume Lenis scroll
        }
    });
    
    // Prevent popup from closing when clicking inside it
    document.querySelectorAll('.timeline-popup').forEach(popup => {
        popup.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Clicked inside popup - preventing close');
        });
    });
}