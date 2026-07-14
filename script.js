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

// Fetch Data from Google Sheets
function fetchGoogleSheetsData() {
    const sheetId = '1gZ3TaIEuDQ3Uu6nPsl2TLpfyd-fwJMAZbPsPgoCv604';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    fetch(url)
        .then(res => res.text())
        .then(text => {
            // Remove the google visualization wrapper to get clean JSON
            const jsonString = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1];
            const data = JSON.parse(jsonString);
            
            const rows = data.table.rows;
            renderDynamicContent(rows);
        })
        .catch(err => {
            console.error("Error fetching Google Sheets:", err);
            const errorMsg = '<p class="text-center text-light" style="color: #ff6b6b;">ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง</p>';
            document.getElementById('dynamicNewsList').innerHTML = errorMsg;
            document.getElementById('dynamicModalCalendarList').innerHTML = errorMsg;
        });
}

function renderDynamicContent(rows) {
    const newsContainer = document.getElementById('dynamicNewsList');
    const calendarContainer = document.getElementById('dynamicModalCalendarList');
    const urgentBar = document.getElementById('urgent-announcement');
    const urgentTextEl = document.getElementById('dynamicUrgentText');
    
    let newsHTML = '';
    let calendarHTML = '';
    let urgentTexts = [];
    
    // Check if there's data (skipping header row if it is treated as data, but gviz usually separates cols)
    if (!rows || rows.length === 0) {
        const noData = '<p class="text-center text-light">ยังไม่มีประกาศใหม่ในขณะนี้</p>';
        newsContainer.innerHTML = noData;
        calendarContainer.innerHTML = noData;
        if (urgentBar) urgentBar.style.display = 'none';
        return;
    }
    
    rows.forEach((row, index) => {
        // Handle potential null cells and formatted values (like Dates)
        const dateStr = row.c[0] ? (row.c[0].f || row.c[0].v) : '';
        const titleStr = row.c[1] ? (row.c[1].f || row.c[1].v) : '';
        const urgentStr = row.c[2] ? (row.c[2].f || row.c[2].v) : '';
        
        // Parse Urgent Announcement (Column C)
        if (urgentStr) {
            urgentTexts.push(urgentStr);
        }
        
        // Parse News and Calendar (Column A and B)
        if (dateStr || titleStr) {
            // Build News Item HTML (Max 3-5 items for the dashboard)
            if (index < 4) { // Show up to 4 items on the main dashboard
                newsHTML += `
                    <div class="news-item">
                        <img src="assets/new.png" alt="ข่าว">
                        <div class="news-info">
                            <h4>${titleStr}</h4>
                            <span class="news-date">${dateStr}</span>
                        </div>
                    </div>
                `;
            }
            
            // Build Calendar Modal HTML
            calendarHTML += `
                <li style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <strong style="color: #fff;">${dateStr}</strong><br>
                    <span style="font-size: 0.95rem;">${titleStr}</span>
                </li>
            `;
        }
    });
    
    // Update DOM
    newsContainer.innerHTML = newsHTML || '<p class="text-center text-light">ยังไม่มีประกาศใหม่ในขณะนี้</p>';
    calendarContainer.innerHTML = calendarHTML || '<p class="text-center text-light">ยังไม่มีกิจกรรมในขณะนี้</p>';
    
    // Update Urgent Bar
    if (urgentBar && urgentTextEl) {
        if (urgentTexts.length > 0) {
            urgentTextEl.innerHTML = urgentTexts.join(' &nbsp;&nbsp;|&nbsp;&nbsp; ');
            urgentBar.style.display = 'flex'; // show bar
        } else {
            urgentBar.style.display = 'none'; // hide bar if no urgent announcements
        }
    }
}

// Initialize fetch when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchGoogleSheetsData();
});
