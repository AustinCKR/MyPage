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

// Navigation link icon animation on hover
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.link');
    const linksBack = document.querySelectorAll('.link-back');

    // Right arrow animation (forward links)
    links.forEach((link) => {
        const icon = link.querySelector('.link-icon');
        if (!icon) return;

        link.addEventListener('mouseenter', () => {
            icon.classList.add('link-icon-animation');
        });

        link.addEventListener('mouseleave', () => {
            icon.classList.remove('link-icon-animation');
        });
    });

    // Left arrow animation (back links)
    linksBack.forEach((link) => {
        const iconBack = link.querySelector('.link-icon-back');
        if (!iconBack) return;

        link.addEventListener('mouseenter', () => {
            iconBack.classList.add('link-icon-animation-back');
        });

        link.addEventListener('mouseleave', () => {
            iconBack.classList.remove('link-icon-animation-back');
        });
    });
});

// Title reveal animation with rectangle - All parts animate together
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    const titleReveals = document.querySelectorAll('.title-reveal');

    if (titleReveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const titleElement = entry.target;

                // Create a timeline for this title
                const timeline = gsap.timeline();

                // Create a single rectangle that covers the entire title
                const rect = document.createElement('div');
                rect.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, var(--color-gradient4) 0%, var(--color-gradient5) 50%, var(--color-gradient6) 100%);
                    z-index: 1;
                `;

                // Make title container relative
                titleElement.style.position = 'relative';
                titleElement.appendChild(rect);

                // Hide title text initially
                gsap.set(titleElement, { opacity: 0 });

                // Step 1: Fade in the rectangle
                timeline.to(rect, {
                    duration: 0.3,
                    opacity: 1
                });

                // Step 2: Show text
                timeline.to(titleElement, {
                    opacity: 1,
                    duration: 0.2
                }, "+=0.2");

                // Step 3: Slide rectangle away (right to left)
                timeline.to(rect, {
                    duration: 0.6,
                    scaleX: 0,
                    transformOrigin: 'right center',
                    ease: "power2.inOut",
                    onComplete: () => {
                        rect.remove(); // Clean up
                    }
                }, "-=0.1");

                observer.unobserve(titleElement);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px'
    });

    titleReveals.forEach(title => observer.observe(title));
});

// Home page text reveal animation - Trigger immediately (already on screen)
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    const splitTexts = document.querySelectorAll('.home .split');

    if (splitTexts.length > 0) {
        // Set initial state
        gsap.set(splitTexts, { opacity: 0, y: 30 });

        // Animate each line with stagger - OK for home page since all elements load at once
        gsap.to(splitTexts, {
            duration: 2,
            opacity: 1,
            y: 0,
            stagger: 0.4,
            ease: "power3.out",
            delay: 0.2
        });
    }
});

// About Me page - Split elements with stagger (excluding education timeline elements)
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    const aboutMeSplits = document.querySelectorAll('.abt-me-div .split:not(.abt-me-skill-div .split):not(.abt-me-edu-div .split)');

    if (aboutMeSplits.length === 0) return;

    // Set initial state
    gsap.set(aboutMeSplits, { opacity: 0, y: 30 });

    let animationQueue = [];
    let isProcessing = false;

    function processQueue() {
        if (animationQueue.length === 0 || isProcessing) return;

        isProcessing = true;
        const batch = [...animationQueue];
        animationQueue = [];

        batch.forEach((element, index) => {
            gsap.to(element, {
                duration: 0.8,
                opacity: 1,
                y: 0,
                ease: "power2.out",
                delay: index * 0.15, // Stagger within batch
                onComplete: () => {
                    if (index === batch.length - 1) {
                        isProcessing = false;
                        processQueue();
                    }
                }
            });
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                animationQueue.push(element);
                observer.unobserve(element);
            }
        });

        // Small delay to batch entries
        setTimeout(processQueue, 50);
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    aboutMeSplits.forEach(el => observer.observe(el));
});

// Skills portal animation - Trigger when skill sections enter viewport
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    const skillDivs = document.querySelectorAll('.abt-me-skill-div');

    if (skillDivs.length === 0) return;

    skillDivs.forEach((skillDiv) => {
        const skillTitle = skillDiv.querySelector('p.mb-2');
        const skillLine = skillDiv.querySelector('.skill-straigt-line');
        const skillWrappers = skillDiv.querySelectorAll('.skill-img-wrapper');

        if (!skillTitle || !skillLine || skillWrappers.length === 0) return;

        // Create an Intersection Observer for each skill section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Create a timeline for this skill section
                    const timeline = gsap.timeline();

                    // Step 1: Show the skill title (e.g., "Front-end")
                    timeline.from(skillTitle, {
                        duration: 0.6,
                        opacity: 0,
                        y: 20,
                        ease: "power2.out"
                    });

                    // Step 2: Grow the vertical line from top to bottom
                    timeline.from(skillLine, {
                        duration: 0.8,
                        scaleY: 0,
                        transformOrigin: "top center",
                        ease: "power2.inOut"
                    }, "+=0.2");

                    // Step 3: Get line position for portal effect
                    timeline.call(() => {
                        const lineRect = skillLine.getBoundingClientRect();
                        const lineCenterX = lineRect.left + lineRect.width / 2;
                        const lineCenterY = lineRect.top + lineRect.height / 2;

                        // Animate each skill icon from the portal (line center)
                        skillWrappers.forEach((wrapper, index) => {
                            const wrapperRect = wrapper.getBoundingClientRect();
                            const wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;
                            const wrapperCenterY = wrapperRect.top + wrapperRect.height / 2;

                            // Calculate distance from line center to icon position
                            const deltaX = lineCenterX - wrapperCenterX;
                            const deltaY = lineCenterY - wrapperCenterY;

                            // Set initial position at the line (portal)
                            gsap.set(wrapper, {
                                x: deltaX,
                                y: deltaY,
                                scale: 0.3,
                                opacity: 0,
                                filter: "blur(5px)"
                            });

                            // Animate to final position
                            gsap.to(wrapper, {
                                duration: 0.8,
                                x: 0,
                                y: 0,
                                scale: 1,
                                opacity: 1,
                                filter: "blur(0px)",
                                ease: "back.out(1.4)",
                                delay: index * 0.1,
                            });
                        });
                    });

                    // Unobserve after animation starts
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -10% 0px'
        });

        // Observe the skill div
        observer.observe(skillDiv);
    });
});

// Education timeline animation - Sequential reveal
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    const eduDiv = document.querySelector('.abt-me-edu-div');

    if (!eduDiv) return;

    const horizontalLine = eduDiv.querySelector('.edu-timeline-horizontal-line');
    const timelineNodes = eduDiv.querySelectorAll('.edu-timeline-node');

    if (!horizontalLine || timelineNodes.length === 0) return;

    // Set initial states
    gsap.set(horizontalLine, { scaleX: 0, transformOrigin: 'left center' });

    timelineNodes.forEach(node => {
        const year = node.querySelector('p.gradient-text');
        const circle = node.querySelector('.edu-timeline-circle');
        const content = node.querySelector('.edu-timeline-content');

        gsap.set(year, { opacity: 0, y: 20 });
        gsap.set(circle, { scale: 0, opacity: 0 });
        gsap.set(content, { opacity: 0, y: 20 });
    });

    // Create observer for the education section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Create master timeline
                const masterTimeline = gsap.timeline();

                // Step 1: Draw the horizontal line from left to right
                masterTimeline.to(horizontalLine, {
                    duration: 1.2,
                    scaleX: 1,
                    ease: "power2.inOut"
                });

                // Step 2: Animate each education node sequentially
                timelineNodes.forEach((node, index) => {
                    const year = node.querySelector('p.gradient-text');
                    const circle = node.querySelector('.edu-timeline-circle');
                    const content = node.querySelector('.edu-timeline-content');

                    // Year appears
                    masterTimeline.to(year, {
                        duration: 0.5,
                        opacity: 1,
                        y: 0,
                        ease: "power2.out"
                    }, index === 0 ? "+=0.2" : "-=0.1"); // Slight delay between nodes

                    // Circle pops in with bounce
                    masterTimeline.to(circle, {
                        duration: 0.6,
                        scale: 1,
                        opacity: 1,
                        ease: "back.out(1.7)"
                    }, "-=0.2"); // Overlap slightly with year

                    // Content fades in
                    masterTimeline.to(content, {
                        duration: 0.6,
                        opacity: 1,
                        y: 0,
                        ease: "power2.out"
                    }, "-=0.3"); // Overlap with circle
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -15% 0px'
    });

    observer.observe(eduDiv);
});

// Projects page
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    const projectsSplits = document.querySelectorAll('.projects-div .split, .projects-div .reveal-fast');

    if (projectsSplits.length === 0) return;

    // Set initial state
    gsap.set(projectsSplits, { opacity: 0, y: 30 });

    let animationQueue = [];
    let isProcessing = false;

    function processQueue() {
        if (animationQueue.length === 0 || isProcessing) return;

        isProcessing = true;
        const batch = [...animationQueue];
        animationQueue = [];

        batch.forEach((element, index) => {
            // Different durations based on class
            let duration = 0.8;
            if (element.classList.contains('reveal-fast')) {
                duration = 0.6;
            }

            gsap.to(element, {
                duration: duration,
                opacity: 1,
                y: 0,
                ease: "power2.out",
                delay: index * 0.15, // Stagger within batch
                onComplete: () => {
                    if (index === batch.length - 1) {
                        isProcessing = false;
                        processQueue();
                    }
                }
            });
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                animationQueue.push(element);
                observer.unobserve(element);
            }
        });

        // Small delay to batch entries
        setTimeout(processQueue, 50);
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    projectsSplits.forEach(el => observer.observe(el));
});

// Project cards animation - Stagger within each batch
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    const projectCards = document.querySelectorAll('.project-card');

    if (projectCards.length === 0) return;

    // Set initial state
    gsap.set(projectCards, { opacity: 0, y: 50 });

    let animationQueue = [];
    let isProcessing = false;

    function processQueue() {
        if (animationQueue.length === 0 || isProcessing) return;

        isProcessing = true;
        const batch = [...animationQueue];
        animationQueue = [];

        batch.forEach((card, index) => {
            gsap.to(card, {
                duration: 0.8,
                y: 0,
                opacity: 1,
                ease: "power3.out",
                delay: index * 0.15, // Stagger within batch
                onComplete: () => {
                    if (index === batch.length - 1) {
                        isProcessing = false;
                        processQueue(); // Process next batch if any
                    }
                }
            });

            // Add hover animations (only once per card)
            if (!card.dataset.hoverAdded) {
                card.dataset.hoverAdded = 'true';

                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        duration: 0.3,
                        scale: 1.05,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                        ease: "power2.out"
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        duration: 0.3,
                        scale: 1,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        ease: "power2.out"
                    });
                });
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                animationQueue.push(card);
                observer.unobserve(card);
            }
        });

        // Small delay to batch entries that come in close together
        setTimeout(processQueue, 50);
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    projectCards.forEach(card => observer.observe(card));
});

// Credits page - Animate description and credit links
document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    const creditsSplits = document.querySelectorAll('.credits-div .split');

    if (creditsSplits.length === 0) return;

    // Set initial state
    gsap.set(creditsSplits, { opacity: 0, y: 30 });

    let animationQueue = [];
    let isProcessing = false;

    function processQueue() {
        if (animationQueue.length === 0 || isProcessing) return;

        isProcessing = true;
        const batch = [...animationQueue];
        animationQueue = [];

        batch.forEach((element, index) => {
            gsap.to(element, {
                duration: 0.6,
                opacity: 1,
                y: 0,
                ease: "power2.out",
                delay: index * 0.08, // Stagger within batch
                onComplete: () => {
                    if (index === batch.length - 1) {
                        isProcessing = false;
                        processQueue();
                    }
                }
            });
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                animationQueue.push(element);
                observer.unobserve(element);
            }
        });

        // Small delay to batch entries
        setTimeout(processQueue, 50);
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
    });

    creditsSplits.forEach(el => observer.observe(el));
});