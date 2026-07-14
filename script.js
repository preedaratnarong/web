// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Highlight Active Menu Item based on scroll position
    const sections = document.querySelectorAll('section, .dash-box[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(sec => {
        if (sec.id) {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.id;
            
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
});

// Smooth Scroll for Navigation
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
        
        window.scrollTo({
            top: section.offsetTop - 70,
            behavior: 'smooth'
        });
    }
}

// Add smooth scroll to all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Modal Management
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(event, modalId) {
    // If event is null, it means the close button was clicked
    // If event is present, check if clicked on overlay
    if (!event || event.target.id === modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
}

// Scroll Reveal Animations
document.addEventListener('DOMContentLoaded', () => {
    // Add reveal class to cards and boxes
    const cards = document.querySelectorAll('.feature-card, .dash-box');
    cards.forEach((card, index) => {
        card.classList.add('reveal');
        // Stagger effect
        card.style.transitionDelay = `${(index % 5) * 0.15}s`;
    });

    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => revealObserver.observe(el));
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Copy Account Number
function copyAccountNumber() {
    const accountNumber = document.getElementById('accountNumber').innerText;
    // Remove dashes for easier pasting into bank apps
    const cleanNumber = accountNumber.replace(/-/g, '');
    
    navigator.clipboard.writeText(cleanNumber).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalContent = copyBtn.innerHTML;
        
        copyBtn.innerHTML = '<i class="ph ph-check"></i> คัดลอกแล้ว';
        copyBtn.style.background = '#4CAF50';
        copyBtn.style.color = '#fff';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
            copyBtn.style.background = 'var(--gold-main)';
            copyBtn.style.color = '#000';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('ไม่สามารถคัดลอกได้ กรุณาคัดลอกด้วยตัวเอง');
    });
}
