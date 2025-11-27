class FlexibleCarousel {
    constructor(carouselId) {
        this.carousel = document.getElementById(carouselId);
        if (!this.carousel) return;
        
        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = Array.from(this.carousel.querySelectorAll('.carousel-slide'));
        this.indicators = Array.from(this.carousel.querySelectorAll('.carousel-indicators button'));
        
        // Get configuration from data attributes
        this.totalSlides = parseInt(this.carousel.dataset.totalSlides) || 6;
        this.visibleSlides = 3; // Changed back to show 3 cards
        this.duplicatesCount = 3; // 3 duplicates on each side for smooth infinite scroll
        
        // Starting position: skip the first 3 duplicates to start at the real first slide
        this.currentIndex = this.duplicatesCount;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.setupCarousel();
        this.bindEvents();
        this.updateCarousel();
    }
    
    setupCarousel() {
        // Calculate dimensions based on viewport
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth <= 768) {
            this.slideWidth = 350;
            this.slideMargin = 0;
        } else if (viewportWidth <= 992) {
            this.slideWidth = 300;
            this.slideMargin = 30;
        } else if (viewportWidth <= 1200) {
            this.slideWidth = 320;
            this.slideMargin = 30;
        } else {
            this.slideWidth = 350;
            this.slideMargin = 30;
        }
        
        this.slideTotal = this.slideWidth + this.slideMargin;
    }
    
    updateCarousel() {
        const viewportWidth = window.innerWidth;
        
        if (viewportWidth <= 768) {
            // Mobile: show single card centered
            const containerWidth = this.carousel.querySelector('.carousel-inner').offsetWidth;
            const centerOffset = (containerWidth - this.slideWidth) / 2;
            const translateX = centerOffset - (this.currentIndex * this.slideWidth);
            this.track.style.transform = `translateX(${translateX}px)`;
            
            // Update visible slides count for mobile
            this.actualVisibleSlides = 1;
        } else {
            // Desktop/Tablet: show 3 cards with perfect centering
            const translateX = -(this.currentIndex * this.slideTotal) + this.slideTotal;
            this.track.style.transform = `translateX(${translateX}px)`;
            
            // Update visible slides count for desktop
            this.actualVisibleSlides = 3;
        }
        
        // Update active states
        this.updateActiveStates();
    }
    
    updateActiveStates() {
        // Remove all active classes
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
            indicator.removeAttribute('aria-current');
        });
        
        // Add active class to current slide
        if (this.slides[this.currentIndex]) {
            this.slides[this.currentIndex].classList.add('active');
        }
        
        // Update indicator (accounting for duplicates)
        const indicatorIndex = this.getActualIndex(this.currentIndex);
        if (this.indicators[indicatorIndex]) {
            this.indicators[indicatorIndex].classList.add('active');
            this.indicators[indicatorIndex].setAttribute('aria-current', 'true');
        }
    }
    
    getActualIndex(slideIndex) {
        // Convert slide index to actual project index (excluding duplicates)
        const adjustedIndex = slideIndex - this.duplicatesCount;
        if (adjustedIndex < 0) {
            // In the beginning duplicates area
            return this.totalSlides + adjustedIndex;
        } else if (adjustedIndex >= this.totalSlides) {
            // In the end duplicates area
            return adjustedIndex - this.totalSlides;
        } else {
            // In the main slides area
            return adjustedIndex;
        }
    }
    
    next() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex++;
        
        // Check if we need to loop back (reached the end duplicates)
        if (this.currentIndex >= this.totalSlides + this.duplicatesCount) {
            // We're at the end duplicates, animate there first
            this.updateCarousel();
            setTimeout(() => {
                // Then jump to the real beginning (first real slide)
                this.currentIndex = this.duplicatesCount;
                this.track.style.transition = 'none';
                this.updateCarousel();
                setTimeout(() => {
                    this.track.style.transition = 'transform 0.6s ease-in-out';
                    this.isTransitioning = false;
                }, 50);
            }, 600);
        } else {
            this.updateCarousel();
            setTimeout(() => {
                this.isTransitioning = false;
            }, 600);
        }
    }
    
    prev() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex--;
        
        // Check if we need to loop forward (reached the beginning duplicates)
        if (this.currentIndex < this.duplicatesCount) {
            // We're at the beginning duplicates, animate there first
            this.updateCarousel();
            setTimeout(() => {
                // Then jump to the real end (last real slide)
                this.currentIndex = this.totalSlides + this.duplicatesCount - 1;
                this.track.style.transition = 'none';
                this.updateCarousel();
                setTimeout(() => {
                    this.track.style.transition = 'transform 0.6s ease-in-out';
                    this.isTransitioning = false;
                }, 50);
            }, 600);
        } else {
            this.updateCarousel();
            setTimeout(() => {
                this.isTransitioning = false;
            }, 600);
        }
    }
    
    // UPDATED: Smart navigation that chooses the shortest path
    goToSlide(targetIndex) {
        if (this.isTransitioning) return;
        
        const currentActualIndex = this.getActualIndex(this.currentIndex);
        
        // If we're already on the target slide, do nothing
        if (currentActualIndex === targetIndex) return;
        
        // Calculate the shortest path to the target
        const forwardDistance = (targetIndex - currentActualIndex + this.totalSlides) % this.totalSlides;
        const backwardDistance = (currentActualIndex - targetIndex + this.totalSlides) % this.totalSlides;
        
        // Choose the shortest path
        if (forwardDistance <= backwardDistance) {
            // Go forward
            this.navigateForward(targetIndex, forwardDistance);
        } else {
            // Go backward
            this.navigateBackward(targetIndex, backwardDistance);
        }
    }
    
    // ADDED: Navigate forward with smooth infinite scroll
    navigateForward(targetIndex, distance) {
        this.isTransitioning = true;
        
        const stepForward = () => {
            if (distance <= 0) {
                this.isTransitioning = false;
                return;
            }
            
            this.currentIndex++;
            distance--;
            
            // Check if we need to loop back (reached the end duplicates)
            if (this.currentIndex >= this.totalSlides + this.duplicatesCount) {
                // We're at the end duplicates, animate there first
                this.updateCarousel();
                setTimeout(() => {
                    // Then jump to the real beginning and continue
                    this.currentIndex = this.duplicatesCount;
                    this.track.style.transition = 'none';
                    this.updateCarousel();
                    setTimeout(() => {
                        this.track.style.transition = 'transform 0.6s ease-in-out';
                        stepForward();
                    }, 50);
                }, 600);
            } else {
                this.updateCarousel();
                setTimeout(() => {
                    stepForward();
                }, 600);
            }
        };
        
        stepForward();
    }
    
    // ADDED: Navigate backward with smooth infinite scroll
    navigateBackward(targetIndex, distance) {
        this.isTransitioning = true;
        
        const stepBackward = () => {
            if (distance <= 0) {
                this.isTransitioning = false;
                return;
            }
            
            this.currentIndex--;
            distance--;
            
            // Check if we need to loop forward (reached the beginning duplicates)
            if (this.currentIndex < this.duplicatesCount) {
                // We're at the beginning duplicates, animate there first
                this.updateCarousel();
                setTimeout(() => {
                    // Then jump to the real end and continue
                    this.currentIndex = this.totalSlides + this.duplicatesCount - 1;
                    this.track.style.transition = 'none';
                    this.updateCarousel();
                    setTimeout(() => {
                        this.track.style.transition = 'transform 0.6s ease-in-out';
                        stepBackward();
                    }, 50);
                }, 600);
            } else {
                this.updateCarousel();
                setTimeout(() => {
                    stepBackward();
                }, 600);
            }
        };
        
        stepBackward();
    }
    
    bindEvents() {
        // Navigation buttons
        const prevBtn = this.carousel.querySelector('.carousel-control-prev');
        const nextBtn = this.carousel.querySelector('.carousel-control-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prev();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.next();
            });
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(index);
            });
        });
        
        // Card clicks
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                // Don't navigate if clicking on links/buttons
                if (e.target.tagName === 'A' || e.target.closest('a') || e.target.tagName === 'BUTTON') {
                    return;
                }
                
                const actualIndex = this.getActualIndex(index);
                if (actualIndex !== this.getActualIndex(this.currentIndex)) {
                    this.goToSlide(actualIndex);
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.next();
            }
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.setupCarousel();
            this.updateCarousel();
        });
    }
}

// Navbar Scroll Effect
class NavbarScrollEffect {
    constructor() {
        this.navbar = document.getElementById('mainNavbar');
        this.scrollThreshold = 50; // Pixels to scroll before effect kicks in
        
        if (this.navbar) {
            this.init();
        }
    }
    
    init() {
        // FORCE initial transparent state
        this.navbar.classList.add('navbar-transparent');
        this.navbar.classList.remove('navbar-scrolled');
        
        // Check initial scroll position after a small delay
        setTimeout(() => {
            this.handleScroll();
        }, 100);
        
        // Add scroll event listener with throttling for performance
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > this.scrollThreshold) {
            // User has scrolled down - add blur effect
            this.navbar.classList.remove('navbar-transparent');
            this.navbar.classList.add('navbar-scrolled');
        } else {
            // User is at top - transparent navbar
            this.navbar.classList.remove('navbar-scrolled');
            this.navbar.classList.add('navbar-transparent');
        }
    }
}

// SINGLE initialization when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    const carousel = new FlexibleCarousel('projectsCarousel');
    
    // Initialize navbar scroll effect
    const navbarEffect = new NavbarScrollEffect();
});
