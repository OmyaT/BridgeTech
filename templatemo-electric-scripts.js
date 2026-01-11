// JavaScript Document

/*

TemplateMo 596 Electric Xtra

https://templatemo.com/tm-596-electric-xtra

*/

// Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
                
                // Randomly assign orange or blue color
                if (Math.random() > 0.5) {
                    particle.style.setProperty('--particle-color', '#00B2FF');
                    const before = particle.style.getPropertyValue('--particle-color');
                    particle.style.background = '#00B2FF';
                }
                
                particlesContainer.appendChild(particle);
            }
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Active navigation highlighting
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-link');

        function updateActiveNav() {
            const scrollPosition = window.pageYOffset + 100;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navItems.forEach(item => item.classList.remove('active'));
                    const currentNav = document.querySelector(`.nav-link[href="#${section.id}"]`);
                    if (currentNav) currentNav.classList.add('active');
                }
            });
        }

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            updateActiveNav();
        });

        // Initial active nav update
        updateActiveNav();

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

        // Feature tabs functionality
        const tabs = document.querySelectorAll('.tab-item');
        const panels = document.querySelectorAll('.content-panel');

        tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        // If it's locked, stop everything
        if (tab.classList.contains("locked")) {
            e.stopImmediatePropagation();
            e.preventDefault();
            alert("This section is locked until you complete the previous level!");
            return;
        }

        const tabId = tab.getAttribute('data-tab');

        // Remove active class from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

        // Form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Message sent! We\'ll get back to you soon.');
            this.reset();
        });

        // Initialize particles
        createParticles();

        // Text rotation with character animation
        const textSets = document.querySelectorAll('.text-set');
        let currentIndex = 0;
        let isAnimating = false;

        function wrapTextInSpans(element) {
            const text = element.textContent;
            element.innerHTML = text.split('').map((char, i) => 
                `<span class="char" style="animation-delay: ${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
        }

        function animateTextIn(textSet) {
            const glitchText = textSet.querySelector('.glitch-text');
            const subtitle = textSet.querySelector('.subtitle');
            
            // Wrap text in spans for animation
            wrapTextInSpans(glitchText);
            
            // Update data attribute for glitch effect
            glitchText.setAttribute('data-text', glitchText.textContent);
            
            // Show subtitle after main text
            setTimeout(() => {
                subtitle.classList.add('visible');
            }, 800);
        }

        function animateTextOut(textSet) {
            const chars = textSet.querySelectorAll('.char');
            const subtitle = textSet.querySelector('.subtitle');
            
            // Animate characters out
            chars.forEach((char, i) => {
                char.style.animationDelay = `${i * 0.02}s`;
                char.classList.add('out');
            });
            
            // Hide subtitle
            subtitle.classList.remove('visible');
        }

        function rotateText() {
            if (isAnimating) return;
            isAnimating = true;

            const currentSet = textSets[currentIndex];
            const nextIndex = (currentIndex + 1) % textSets.length;
            const nextSet = textSets[nextIndex];

            // Animate out current text
            animateTextOut(currentSet);

            // After out animation, switch sets
            setTimeout(() => {
                currentSet.classList.remove('active');
                nextSet.classList.add('active');
                animateTextIn(nextSet);
                
                currentIndex = nextIndex;
                isAnimating = false;
            }, 600);
        }

        // Initialize first text set
        textSets[0].classList.add('active');
        animateTextIn(textSets[0]);

        // Start rotation after initial display
        setTimeout(() => {
            setInterval(rotateText, 5000); // Change every 5 seconds
        }, 4000);

        // Add random glitch effect
        setInterval(() => {
            const glitchTexts = document.querySelectorAll('.glitch-text');
            glitchTexts.forEach(text => {
                if (Math.random() > 0.95) {
                    text.style.animation = 'none';
                    setTimeout(() => {
                        text.style.animation = '';
                    }, 200);
                }
            });

        }, 3000);

/* ---------------------------------------
   LEVEL LOCKING / PROGRESS SYSTEM
---------------------------------------- */

// Track saved progress
let progress = JSON.parse(localStorage.getItem("progress")) || 
{
    level1: false,
    level2: false,
    level3: false
};

// Update which tabs are locked or unlocked
function updateLocks() {
    const level1 = document.querySelector('[data-tab="network"]');     // Level 2
    const level2 = document.querySelector('[data-tab="analytics"]');   // Level 3
    const level3 = document.querySelector('[data-tab="integration"]'); // Completion

    // Level 2 locked until Level 1 complete
    if (!progress.level1) level1.classList.add("locked");
    else level1.classList.remove("locked");

    // Level 3 locked until Level 2 complete
    if (!progress.level2) level2.classList.add("locked");
    else level2.classList.remove("locked");

    // Completion locked until Level 3 complete
    if (!progress.level3) level3.classList.add("locked");
    else level3.classList.remove("locked");
}

// Prevent clicking locked tabs
document.querySelectorAll(".tab-item").forEach(tab => 
        {
    tab.addEventListener("click", e => 
            {
        if (tab.classList.contains("locked")) 
        {
            e.preventDefault();
            alert("This section is locked until you complete the previous level!");
        }
    });
});

// TEMP button to mark levels as complete (replace with quiz later)
document.querySelectorAll(".complete-level").forEach(btn => 
        {
    btn.addEventListener("click", () => 
            {
        const level = btn.dataset.level;

        if (level === "1") progress.level1 = true;
        if (level === "2") progress.level2 = true;
        if (level === "3") progress.level3 = true;

        localStorage.setItem("progress", JSON.stringify(progress));
        updateLocks();
        alert("Next level unlocked!");
    });
});

// Initialize lock states
updateLocks();

