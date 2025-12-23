// ===== DOM Elements =====
const mobileMenu = document.getElementById('mobile-menu');
const menu = document.querySelector('.menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const scrollToTopBtn = document.getElementById('scrollToTop');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const filterBtns = document.querySelectorAll('.filter-btn');
const carouselIndicators = document.querySelector('.carousel-indicators');
const skillBars = document.querySelectorAll('.skill-progress');

// ===== Mobile Menu Toggle =====
mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menu.classList.remove('active');
    });
});

// ===== Header Scroll Effect =====
window.addEventListener('scroll', () => {
    // Add shadow to header on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// ===== Scroll to Top =====
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Smooth Scrolling for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Update Active Nav Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== Contact Form Submission =====
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value.trim();
    const email = this.querySelector('input[type="email"]').value.trim();
    const message = this.querySelector('textarea').value.trim();
    
    // Simple validation
    if (!name || !email || !message) {
        showFormMessage('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFormMessage('Пожалуйста, введите корректный email', 'error');
        return;
    }
    
    // Simulate form submission
    showFormMessage('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.', 'success');
    
    // Reset form
    this.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.classList.remove('success');
        formMessage.textContent = '';
    }, 5000);
});

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = 'form-message ' + type;
}

// ===== Carousel Functionality =====
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

// Create indicators
slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(index));
    carouselIndicators.appendChild(indicator);
});

const indicators = document.querySelectorAll('.indicator');

function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Event listeners for carousel buttons
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Auto slide every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Pause auto-slide on hover
carouselTrack.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

carouselTrack.addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 5000);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
});

// ===== Portfolio Filtering =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        slides.forEach((slide, index) => {
            const category = slide.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                slide.style.display = 'block';
                // Update indicators based on visible slides
                indicators[index].style.display = 'block';
            } else {
                slide.style.display = 'none';
                indicators[index].style.display = 'none';
            }
        });
        
        // Reset to first visible slide
        const visibleSlides = Array.from(slides).filter(slide => 
            slide.style.display !== 'none'
        );
        
        if (visibleSlides.length > 0) {
            const firstVisibleIndex = Array.from(slides).indexOf(visibleSlides[0]);
            goToSlide(firstVisibleIndex);
        }
    });
});

// ===== Animate Skill Bars on Scroll =====
function animateSkillBars() {
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (barPosition < screenPosition) {
            bar.style.width = level + '%';
        }
    });
}

// Initial call and on scroll
window.addEventListener('scroll', animateSkillBars);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Animate skill bars on page load if already in view
    animateSkillBars();
    
    // Update active nav link on page load
    updateActiveNavLink();
});