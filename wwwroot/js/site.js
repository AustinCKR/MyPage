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

// Reveal text animation on initial page load
document.addEventListener('DOMContentLoaded', () => {
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    // Stagger reveal with small delay between items
    reveals.forEach((el, idx) => {
        // If element already has a CSS delay class we respect it — setTimeout still applies ordering
        setTimeout(() => el.classList.add('show'), idx * 120);
    });
});