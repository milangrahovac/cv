// Scroll-based fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // animate once
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.hero, .section').forEach(el => {
    el.classList.add('animate');
    observer.observe(el);
});


function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (_) {}
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
}

document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);

// Pipeline animation
(function () {
    const steps = Array.from(document.querySelectorAll('.pipeline-step'));
    if (!steps.length) return;

    const STEP_DURATION = 900;  // ms each step stays "running"
    const PAUSE_AFTER   = 2000; // ms to hold "all success" before restarting

    let rafId = null;
    let timerId = null;
    let stepIndex = 0;
    let phaseStart = null;

    function reset() {
        steps.forEach(s => s.classList.remove('running', 'success'));
        stepIndex = 0;
        phaseStart = null;
    }

    function startPause() {
        timerId = setTimeout(() => {
            reset();
            rafId = requestAnimationFrame(tick);
        }, PAUSE_AFTER);
    }

    function tick(now) {
        if (phaseStart === null) phaseStart = now;

        if (now - phaseStart >= STEP_DURATION) {
            if (stepIndex > 0) {
                steps[stepIndex - 1].classList.remove('running');
                steps[stepIndex - 1].classList.add('success');
            }
            if (stepIndex >= steps.length) {
                startPause();
                return;
            }
            steps[stepIndex].classList.add('running');
            stepIndex++;
            phaseStart = now;
        }

        rafId = requestAnimationFrame(tick);
    }

    // When tab becomes visible again, restart cleanly instead of catching up
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            cancelAnimationFrame(rafId);
            clearTimeout(timerId);
            reset();
            rafId = requestAnimationFrame(tick);
        }
    });

    rafId = requestAnimationFrame(tick);
})();
