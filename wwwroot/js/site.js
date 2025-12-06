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

// Home link icon animation on hover
document.addEventListener('DOMContentLoaded', () => {
    const links = document.getElementsByClassName('link');
    const linksBack = document.getElementsByClassName('link-back');
    Array.from(links).forEach((link) => {
        const icon = link.querySelector('.link-icon');
        if (!icon) return;
        link.addEventListener('mouseover', () => icon.classList.add('link-icon-animation'));
        link.addEventListener('mouseout', () => icon.classList.remove('link-icon-animation'));
    });

    Array.from(linksBack).forEach((link) => {
        const iconBack = link.querySelector('.link-icon-back');
        if (!iconBack) return;
        link.addEventListener('mouseover', () => iconBack.classList.add('link-icon-animation-back'));
        link.addEventListener('mouseout', () => iconBack.classList.remove('link-icon-animation-back'));
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

// Skill animation — trigger when the row enters viewport
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
                    const iconDelay = idx * 120;
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

// Auto-shrink text to fit container height
(function () {
    function shrinkTextToFit(element, minFontSize = 10, maxFontSize = 16) {
        const maxHeight = element.offsetHeight;
        let fontSize = maxFontSize;

        element.style.fontSize = `${fontSize}px`;

        while (element.scrollHeight > maxHeight && fontSize > minFontSize) {
            fontSize -= 0.5;
            element.style.fontSize = `${fontSize}px`;
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const projectDetails = document.querySelectorAll('.project-title');

        projectDetails.forEach(detail => {
            shrinkTextToFit(detail, 10, 32);
        });

        // Re-calculate on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                projectDetails.forEach(detail => {
                    detail.style.fontSize = '1rem'; // reset
                    shrinkTextToFit(detail, 10, 16);
                });
            }, 250);
        });
    });
})();

// Reveal animations (trigger on enter viewport)
(function () {
    function revealOnce(el, delay = 0) {
        if (el.dataset._revealAnimated === '1') return;
        el.dataset._revealAnimated = '1';
        setTimeout(() => el.classList.add('show'), delay);
    }

    function handleTimelineAnimation(container, observer, allTimelineElements) {
        // Prevent duplicate timeline animation
        if (container.dataset._timelineAnimated === '1') return;
        container.dataset._timelineAnimated = '1';

        const line = container.querySelector('.edu-timeline-horizontal-line');
        const nodes = Array.from(container.querySelectorAll('.edu-timeline-node'));

        // Mark all timeline elements immediately to prevent race conditions
        allTimelineElements.forEach(el => el.dataset._revealAnimated = '1');

        // Draw the line first
        if (line) {
            line.classList.add('line-draw');
        }

        // Animate nodes in sequence
        const startDelay = 360;
        const nodeStagger = 600;

        nodes.forEach((node, i) => {
            const items = Array.from(node.querySelectorAll('.reveal, .reveal-fast, .reveal-faster'));
            const delay = startDelay + i * nodeStagger;

            setTimeout(() => {
                items.forEach((it, j) => {
                    // per-item stagger inside a node depends on reveal class
                    const perItemMs = it.classList.contains('reveal-faster') ? 120 : it.classList.contains('reveal-fast') ? 200 : 240;
                    setTimeout(() => it.classList.add('show'), j * perItemMs);
                });
            }, delay);
        });

        // Unobserve all timeline elements
        allTimelineElements.forEach(el => observer.unobserve(el));
    }

    document.addEventListener('DOMContentLoaded', () => {
        const reveals = Array.from(document.querySelectorAll('.reveal'));
        const revealsFast = Array.from(document.querySelectorAll('.reveal-fast'));
        const revealsFaster = Array.from(document.querySelectorAll('.reveal-faster'));
        const all = reveals.concat(revealsFast).concat(revealsFaster);

        if (!all.length) return;

        const obs = new IntersectionObserver((entries, observer) => {
            // Collect only the entries that just intersected
            let visibleEntries = entries.filter(e => e.isIntersecting);

            if (!visibleEntries.length) return;

            // Check if any entry is inside the timeline (special handling)
            const timelineEntry = visibleEntries.find(entry =>
                entry.target.closest('.abt-me-edu-div')
            );

            if (timelineEntry) {
                const container = timelineEntry.target.closest('.abt-me-edu-div');
                const allTimelineElements = container.querySelectorAll('.reveal, .reveal-fast, .reveal-faster');
                handleTimelineAnimation(container, observer, allTimelineElements);

                // Remove timeline-related entries so remaining visible entries still go through normal stagger logic
                visibleEntries = visibleEntries.filter(entry => !entry.target.closest('.abt-me-edu-div'));
            }

            if (!visibleEntries.length) return;

            // Normal reveal logic for non-timeline elements
            visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

            visibleEntries.forEach((entry, order) => {
                const el = entry.target;
                // faster class -> smallest stagger, then reveal-fast, then default
                const perItemDelay = el.classList.contains('reveal-faster') ? 60 : el.classList.contains('reveal-fast') ? 240 : 360;
                const delay = order * perItemDelay;
                revealOnce(el, delay);
                observer.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px 0px 0px' });

        all.forEach(a => obs.observe(a));

        setTimeout(() => {
            all.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

                if (isVisible && el.dataset._revealAnimated !== '1') {
                    // Check if it's a timeline element
                    const timelineContainer = el.closest('.abt-me-edu-div');
                    if (timelineContainer) {
                        const allTimelineElements = timelineContainer.querySelectorAll('.reveal, .reveal-fast, .reveal-faster');
                        handleTimelineAnimation(timelineContainer, obs, allTimelineElements);
                    } else {
                        // Normal reveal
                        revealOnce(el, 0);
                        obs.unobserve(el);
                    }
                }
            });
        }, 100); // small delay to ensure page is fully rendered
    });
})();