/* ==========================================================================
   NEURAL NETWORK CANVAS BACKGROUND
   ========================================================================== */
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

// Particle Density control
const maxParticles = 80;
const connectionDistance = 120;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2.5 + 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.6)'; // violet transparent
        ctx.fill();
    }

    update() {
        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        this.x += this.vx;
        this.y += this.vy;

        // Mouse repelling interaction
        if (mouse.x !== null && mouse.y !== null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 1.5;
                this.y += Math.sin(angle) * force * 1.5;
            }
        }
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                let opacity = (1 - (dist / connectionDistance)) * 0.25;
                ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`; // blue connection
                ctx.lineWidth = 0.85;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }

        // Connect particles to mouse
        if (mouse.x !== null && mouse.y !== null) {
            let dx = particles[a].x - mouse.x;
            let dy = particles[a].y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                let opacity = (1 - (dist / mouse.radius)) * 0.35;
                ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`; // violet connection
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

// Track mouse positioning
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Initialize canvas background
resizeCanvas();
initParticles();
animateParticles();


/* ==========================================================================
   TYPEWRITER EFFECT
   ========================================================================== */
const phrases = [
    "AI / ML Solutions",
    "Computer Vision Architectures",
    "Deep Learning pipelines",
    "Natural Language Processing",
    "Intelligent Agents & RAG"
];

let currentPhraseIndex = 0;
let currentText = "";
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function type() {
    const fullText = phrases[currentPhraseIndex];
    
    if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
    } else {
        currentText = fullText.substring(0, currentText.length + 1);
    }
    
    typewriterElement.textContent = currentText;
    
    let typeSpeed = isDeleting ? 40 : 100;
    
    if (!isDeleting && currentText === fullText) {
        typeSpeed = 1800; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typeSpeed = 400; // Pause before typing next word
    }
    
    setTimeout(type, typeSpeed);
}

// Start typewriter
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000);
});


/* ==========================================================================
   NAVIGATION AND MOBILE MENU
   ========================================================================== */
const navbar = document.querySelector('.navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const navLinksContainer = document.getElementById('nav-links');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('back-to-top');

// Scroll events
window.addEventListener('scroll', () => {
    // Header styling on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        backToTop.classList.add('active');
    } else {
        navbar.classList.remove('scrolled');
        backToTop.classList.remove('active');
    }
    
    // Active Link highlighting on scroll
    highlightActiveLink();
});

function highlightActiveLink() {
    let scrollPosition = window.scrollY + 120; // offset for navbar height
    
    document.querySelectorAll('section').forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPosition >= top && scrollPosition < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Mobile Toggle Click Event
mobileToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    const isOpened = navLinksContainer.classList.contains('active');
    mobileToggle.innerHTML = isOpened ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});

// Close Mobile Menu when link clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});


/* ==========================================================================
   INTERNSHIP TABS HANDLER
   ========================================================================== */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Update active tab buttons
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active panel content
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.getAttribute('id') === targetTab) {
                // Trigger content display
                panel.classList.add('active');
            }
        });
    });
});


/* ==========================================================================
   PROJECTS FILTER SYSTEM
   ========================================================================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');
        
        // Update active filter button styling
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            
            if (filterValue === 'all' || categories.includes(filterValue)) {
                card.style.display = 'flex';
                // Animate entry
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300); // matches style transition duration
            }
        });
    });
});


/* ==========================================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
// Add reveal class dynamically to sections and cards for transition effect
const elementsToReveal = [
    ...document.querySelectorAll('section > .container'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.skill-category'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.achievement-card')
];

elementsToReveal.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // trigger animation once
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // trigger slightly before fully on-screen
});

elementsToReveal.forEach(el => revealObserver.observe(el));


/* ==========================================================================
   CONTACT FORM HANDLER & VALIDATION
   ========================================================================== */
const contactForm = document.getElementById('contact-form');
const formSubmitBtn = document.getElementById('form-submit-btn');
const formFeedback = document.getElementById('form-feedback');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Change UI state to Sending
    formSubmitBtn.disabled = true;
    formSubmitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
    
    // Fetch values (could be hooked up to EmailJS or Formspree)
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Simple verification
    if (!name || !email || !subject || !message) {
        showFeedback('Please fill out all fields.', 'error');
        resetSubmitBtn();
        return;
    }
    
    // Send dynamic POST request to Formspree
    fetch("https://formspree.io/f/meewwloa", {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showFeedback(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
            contactForm.reset();
        } else {
            showFeedback('Oops! There was a problem submitting your message. Please try again.', 'error');
        }
        resetSubmitBtn();
    })
    .catch(error => {
        showFeedback('Oops! There was a network connection error. Please try again.', 'error');
        resetSubmitBtn();
    });
});

function showFeedback(msg, status) {
    formFeedback.textContent = msg;
    formFeedback.className = `form-feedback ${status}`;
    
    // Clear feedback after 6 seconds
    setTimeout(() => {
        formFeedback.style.display = 'none';
        formFeedback.className = 'form-feedback';
    }, 6000);
}

function resetSubmitBtn() {
    formSubmitBtn.disabled = false;
    formSubmitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
}
