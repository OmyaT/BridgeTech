// ======================
// Floating Particles
// ======================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particle.style.background = Math.random() > 0.5 ? '#00B2FF' : '#FF5E00';
        particlesContainer.appendChild(particle);
    }
}
createParticles();

// ======================
// Mobile Menu Toggle
// ======================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ======================
// Navigation Highlight
// ======================
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const currentNav = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (!currentNav) return;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => item.classList.remove('active'));
            currentNav.classList.add('active');
        }
    });
}

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
    updateActiveNav();
});
updateActiveNav();

// ======================
// Smooth Scrolling
// ======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // allow anchors that are supposed to navigate to locked tabs to proceed (the locking logic will prevent it)
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ======================
// Text Rotator
// ======================
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
    wrapTextInSpans(glitchText);
    glitchText.setAttribute('data-text', glitchText.textContent);
    setTimeout(() => subtitle.classList.add('visible'), 800);
}

function animateTextOut(textSet) {
    const chars = textSet.querySelectorAll('.char');
    const subtitle = textSet.querySelector('.subtitle');
    chars.forEach((char, i) => {
        char.style.animationDelay = `${i * 0.02}s`;
        char.classList.add('out');
    });
    subtitle.classList.remove('visible');
}

function rotateText() {
    if (isAnimating) return;
    isAnimating = true;
    const currentSet = textSets[currentIndex];
    const nextIndex = (currentIndex + 1) % textSets.length;
    const nextSet = textSets[nextIndex];

    animateTextOut(currentSet);

    setTimeout(() => {
        currentSet.classList.remove('active');
        nextSet.classList.add('active');
        animateTextIn(nextSet);
        currentIndex = nextIndex;
        isAnimating = false;
    }, 600);
}

if (textSets.length) {
    textSets[0].classList.add('active');
    animateTextIn(textSets[0]);
    setTimeout(() => setInterval(rotateText, 5000), 4000);
}

// ======================
// Feature Tabs & Level Locking (GUARDED - Option B)
// - If you kept the unified inline script in the HTML, that script should own updateBridgetechLocks and submitQuiz.
// - These guarded definitions only create fallback implementations if the inline script did not.
// ======================
if (!window.bridgetechLocksManaged) {
    window.bridgetechLocksManaged = true;

    // Only define a local update function if the page hasn't defined updateBridgetechLocks
    if (typeof window.updateBridgetechLocks !== 'function') {
        const STORAGE_KEY = 'bridgetech_progress';
        const DEFAULT_PROGRESS = { level1: false, level2: false, level3: false };

        function readProgress() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? JSON.parse(raw) : Object.assign({}, DEFAULT_PROGRESS);
            } catch (e) {
                console.warn('Failed to read progress, using defaults', e);
                return Object.assign({}, DEFAULT_PROGRESS);
            }
        }
        function writeProgress(p) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        }

        function updateLocksLocal() {
            const progress = readProgress();

            const level2Tab = document.querySelector('[data-tab="network"]');
            const level3Tab = document.querySelector('[data-tab="analytics"]');
            const completionTab = document.querySelector('[data-tab="integration"]');

            if (level2Tab) (progress.level1 ? level2Tab.classList.remove("locked") : level2Tab.classList.add("locked"));
            if (level3Tab) (progress.level2 ? level3Tab.classList.remove("locked") : level3Tab.classList.add("locked"));
            if (completionTab) (progress.level3 ? completionTab.classList.remove("locked") : completionTab.classList.add("locked"));

            // Also lock/unlock quiz containers
            const quiz2 = document.getElementById('quiz-level-2');
            const quiz3 = document.getElementById('quiz-level-3');
            if (quiz2) (progress.level1 ? quiz2.classList.remove('locked') : quiz2.classList.add('locked'));
            if (quiz3) (progress.level2 ? quiz3.classList.remove('locked') : quiz3.classList.add('locked'));

            // Show/hide "Next Level" buttons for passed levels
            [1, 2, 3].forEach(l => {
                const nextBtn = document.getElementById(`next-btn-${l}`);
                if (!nextBtn) return;
                nextBtn.style.display = (progress[`level${l}`] ? 'inline-block' : 'none');
            });
        }

        // Expose under the same name the inline script expects, if it's not present
        window.updateBridgetechLocks = updateLocksLocal;

        // Initialize on DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function () {
            const existing = localStorage.getItem(STORAGE_KEY);
            if (!existing) writeProgress(Object.assign({}, DEFAULT_PROGRESS));
            updateLocksLocal();
        });
    } else {
        // Inline script provides updateBridgetechLocks, do not override. But ensure it runs once.
        document.addEventListener('DOMContentLoaded', function () {
            try { window.updateBridgetechLocks(); } catch (e) { /* no-op */ }
        });
    }
}

// ======================
// Tab click logic (guarded)
// - Avoid adding duplicate handlers if the inline script already registered one
// ======================
if (!window.bridgetechTabHandlerAdded) {
    window.bridgetechTabHandlerAdded = true;

    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', e => {
            if (tab.classList.contains("locked")) {
                e.preventDefault();
                e.stopPropagation();
                alert("🔒 This level is locked! Complete the previous level with 80%+ to unlock.");
                return;
            }

            const targetId = tab.getAttribute('data-tab');
            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const panel = document.getElementById(targetId);
            if (panel) panel.classList.add('active');
        });
    });
}

// ======================
// Quiz Logic (guarded)
// - If an inline script defined window.submitQuiz already, do not overwrite it.
// - Otherwise provide a fallback that writes to the same localStorage key and calls updateBridgetechLocks
// ======================
if (typeof window.submitQuiz !== 'function') {
    window.submitQuiz = function submitQuizLegacy(level) {
        const quiz = document.getElementById(`quiz-level-${level}`);
        const feedback = document.getElementById(`quiz-feedback-${level}`);
        if (!quiz || !feedback) return;

        const questions = quiz.querySelectorAll('.quiz-question');
        let correctCount = 0;
        questions.forEach(q => {
            const selected = q.querySelector('input[type="radio"]:checked');
            if (selected && selected.value === "correct") correctCount++;
        });

        const totalQuestions = questions.length || 1;
        const score = (correctCount / totalQuestions) * 100;

        if (score >= 80) {
            feedback.textContent = `✅ You passed! Score: ${score.toFixed(0)}%`;
            feedback.style.color = 'limegreen';

            // update progress
            try {
                const STORAGE_KEY = 'bridgetech_progress';
                const raw = localStorage.getItem(STORAGE_KEY);
                const progress = raw ? JSON.parse(raw) : { level1: false, level2: false, level3: false };
                progress[`level${level}`] = true;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
                if (typeof window.updateBridgetechLocks === 'function') window.updateBridgetechLocks();
            } catch (e) {
                console.warn('Failed to persist progress', e);
            }
        } else {
            feedback.textContent = `❌ You did not pass. Score: ${score.toFixed(0)}%. Try again!`;
            feedback.style.color = 'red';
        }

        feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
}

// ======================
// Go to Next Level Function (keep as-is)
// ======================
function goToNextLevel(level) {
    const tabs = ['performance', 'security', 'network', 'analytics', 'integration'];
    const nextTabId = tabs[level]; // level corresponds to index in array
    const nextTab = document.querySelector(`.tab-item[data-tab="${nextTabId}"]`);
    if (!nextTab) return;

    // Remove active from all tabs and panels
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));

    // Activate next tab and its panel
    nextTab.classList.remove('locked');
    nextTab.classList.add('active');
    const panel = document.getElementById(nextTabId);
    if (panel) panel.classList.add('active');

    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
}

// Attach submit buttons dynamically (guarded)
if (!window.bridgetechSubmitButtonsAttached) {
    window.bridgetechSubmitButtonsAttached = true;
    document.querySelectorAll('button.submit-quiz').forEach(btn => {
        const level = parseInt(btn.getAttribute('data-level'));
        btn.addEventListener('click', () => {
            if (typeof window.submitQuiz === 'function') window.submitQuiz(level);
        });
    });
}

// ======================
// Contact Form
// ======================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Message sent! We\'ll get back to you soon.');
        this.reset();
    });
}
