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
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
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
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
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
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll indicator click
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// ===== SKILL PROGRESS ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 100);
            });
            
            // Unobserve after animation to prevent re-triggering
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe skill categories
document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

// ===== STATS COUNTER ANIMATION =====
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const targetText = statNumber.textContent;
            
            // Only animate if it's a number
            if (!isNaN(parseInt(targetText))) {
                const target = parseInt(targetText);
                animateCounter(statNumber, target);
            }
            
            // Unobserve after animation
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// ===== PROJECT CARD INTERACTIONS =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
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

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
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
});

//document.addEventListener("DOMContentLoaded", function () {
//    fetch("https://github.com/users/justvarma/contributions")
//        .then(r => r.text())
//        .then(html => {
//            const parser = new DOMParser();
//            const doc = parser.parseFromString(html, "text/html");
//
//            const cells = doc.querySelectorAll("rect[data-count]");
//            let total = 0;
//
//          cells.forEach(cell => {
//                total += parseInt(cell.getAttribute("data-count"));
//            });
//
//            document.getElementById("githubCommits").innerText = total + "+";
//        })
//        .catch(err => {
//            document.getElementById("githubCommits").innerText = "N/A";
//            console.error(err);
//        });
//});
