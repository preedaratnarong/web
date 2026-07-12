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
