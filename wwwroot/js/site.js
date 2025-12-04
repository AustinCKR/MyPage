// Navbar blur on scroll
(function () {
    const nav = document.getElementById('mainNavbar');
    if (!nav) return;

    const scrollThreshold = 50;
    let ticking = false;

    // Set initial state
    nav.classList.add('navbar-transparent');

    function update() {
        const sc = window.pageYOffset || document.documentElement.scrollTop;
        if (sc > scrollThreshold) {
            nav.classList.add('navbar-scrolled');
            nav.classList.remove('navbar-transparent');
        } else {
            nav.classList.remove('navbar-scrolled');
            nav.classList.add('navbar-transparent');
        }
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }

    // init
    document.addEventListener('DOMContentLoaded', () => {
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
    });
})();

// Title reveal animation with rectangle placeholder — trigger on enter viewport
(function () {
    function animateTitle(el, idx) {
        if (el.dataset._titleAnimated === '1') return;
        el.dataset._titleAnimated = '1';

        const baseDelay = idx * 180; // small stagger between multiple titles

        // Stage 1: Show rectangle placeholder
        setTimeout(() => el.classList.add('stage-1'), baseDelay);

        // Stage 2: Shrink rectangle to right
        setTimeout(() => el.classList.add('stage-2'), baseDelay + 300);

        // Stage 3: Reveal text
        setTimeout(() => el.classList.add('stage-3'), baseDelay + 900);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const titleReveals = Array.from(document.querySelectorAll('.title-reveal'));
        if (!titleReveals.length) return;

        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const idx = titleReveals.indexOf(el);
                animateTitle(el, idx >= 0 ? idx : 0);
                observer.unobserve(el);
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

        titleReveals.forEach(tr => obs.observe(tr));
    });
})();

// Reveal animations (trigger on enter viewport)
(function () {
    function revealOnce(el, delay = 0) {
        if (el.dataset._revealAnimated === '1') return;
        el.dataset._revealAnimated = '1';
        setTimeout(() => el.classList.add('show'), delay);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const reveals = Array.from(document.querySelectorAll('.reveal'));
        const revealsFast = Array.from(document.querySelectorAll('.reveal-fast'));
        const all = reveals.concat(revealsFast);
        if (!all.length) return;

        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const idx = all.indexOf(el);
                const perItemDelay = el.classList.contains('reveal-fast') ? 240 : 360;
                const delay = idx >= 0 ? idx * perItemDelay : 0;
                revealOnce(el, delay);
                observer.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        all.forEach(a => obs.observe(a));
    });
})();

// Home link icon animation on hover
document.addEventListener('DOMContentLoaded', () => {
    const homeLinks = document.getElementsByClassName('home-link');
    Array.from(homeLinks).forEach((link) => {
        const icon = link.querySelector('.home-link-icon');
        if (!icon) return;
        link.addEventListener('mouseover', () => icon.classList.add('home-link-icon-animation'));
        link.addEventListener('mouseout', () => icon.classList.remove('home-link-icon-animation'));
    });
});

// Image tooltip helper: hover + focus + touch toggle + Escape to dismiss
(function () {
    function initImageTooltips() {
        const wrappers = document.querySelectorAll('.skill-img-wrapper');
        wrappers.forEach(w => {
            if (w.dataset._tooltipInit === '1') return;
            w.dataset._tooltipInit = '1';
            w.addEventListener('mouseenter', () => w.classList.add('tooltip-visible'));
            w.addEventListener('mouseleave', () => w.classList.remove('tooltip-visible'));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageTooltips);
    } else {
        initImageTooltips();
    }
})();

// Skill "portal" animation — trigger when the row enters viewport
(function () {
    function animateGroupFromLine(group) {
        if (group.dataset._skillAnimated === '1') return;
        group.dataset._skillAnimated = '1';

        const line = group.querySelector('.skill-straigt-line');
        const wrappers = Array.from(group.querySelectorAll('.skill-img-wrapper'));
        if (!line || wrappers.length === 0) return;

        const baseDelay = 240 * 6; // delay before drawing the line

        // Draw the line first
        setTimeout(() => {
            line.classList.add('line-draw');

            // micro-delay so CSS layout updates
            setTimeout(() => {
                const lineRect = line.getBoundingClientRect();
                const lineCenterX = lineRect.left + lineRect.width / 2;
                const lineCenterY = lineRect.top + lineRect.height / 2;

                // animate each wrapper from the line center to its natural position
                wrappers.forEach((w, idx) => {
                    const wRect = w.getBoundingClientRect();
                    const wCenterX = wRect.left + wRect.width / 2;
                    const wCenterY = wRect.top + wRect.height / 2;

                    // compute offsets so the wrapper appears to originate from the line center
                    const fromX = lineCenterX - wCenterX;
                    const fromY = lineCenterY - wCenterY;

                    // set CSS vars that initial transform uses
                    w.style.setProperty('--from-x', `${fromX}px`);
                    w.style.setProperty('--from-y', `${fromY}px`);

                    // stagger each icon slightly
                    const iconDelay = idx * 80;
                    setTimeout(() => w.classList.add('pop-in'), 120 + iconDelay);
                });
            }, 40);
        }, baseDelay);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const groups = Array.from(document.querySelectorAll('.d-flex.gap-3'));
        if (!groups.length) return;

        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const group = entry.target;
                animateGroupFromLine(group);
                observer.unobserve(group);
            });
        }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

        groups.forEach(g => obs.observe(g));
    });
})();