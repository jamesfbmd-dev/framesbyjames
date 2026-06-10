document.addEventListener('DOMContentLoaded', () => {

    // Device scaling detector (should work on modern browsers running Windows)
    const scale = window.devicePixelRatio;

    if (scale === 1.25) {
      document.body.classList.add('scale-125');
      console.log('scaling')
    } else if (scale === 1.5) {
      document.body.classList.add('scale-150');
      console.log('scaling')
    }


    // Override for showing only curated images (dev use)
    const dev = document.getElementById('dev');

    dev.style.position = 'absolute';
    dev.style.opacity = '0'
    dev.style.top = '100px';
    dev.style.right = '20px';
    dev.style.width = '30px';
    dev.style.height = '30px';
    dev.style.zIndex = '9999';

    const override = [1, 3, 8, 9, 15, 16, 21, 22]

    dev.addEventListener('click', () => {
        console.log('Curated')
        renderGallery('all', override)
    })

    const gallery = document.getElementById('gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const arrowLink = document.getElementById('hero-arrow-link');


    // HERO ARROW SCROLL BEHAVIOUR
    const offset = 250; // distance in pixels from the top

    arrowLink.addEventListener('click', function(e) {
        e.preventDefault(); // prevent default jump

        const target = document.getElementById('gallery');
        const topPos = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: topPos,
            behavior: 'smooth'
        });
    });


    /**
     * Event Listeners
     */
    
    // Gallery Filter Logic
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            if (button.classList.contains('active')) return; // Don't re-filter if already active

            currentFilter = filter;

            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Adjust gallery class for responsive columns
            if (filter === 'all') {
                gallery.classList.remove('gallery-filtered');
            } else {
                gallery.classList.add('gallery-filtered');
            }

            // Animate out existing items by adding a class
            gallery.querySelectorAll('.gallery-item').forEach(item => {
                item.classList.add('gallery-item--hidden');
            });

            // After fade-out animation, re-render and fade in new items
            setTimeout(() => {
                // Set the gallery to a "loading" state to hide new items initially
                gallery.classList.add('gallery--loading');

                renderGallery(filter); // Re-build the gallery content

                // Use a minimal timeout to allow the browser to apply the 'loading' state
                // before we remove it to trigger the fade-in transition.
                setTimeout(() => {
                    gallery.classList.remove('gallery--loading');
                }, 15); // A small delay for the next paint cycle

            }, 300); // Match CSS transition duration
        });
    });

    // Lightbox Controls
    lightboxClose.addEventListener('click', closeLightbox);

    lightboxPrev && lightboxPrev.addEventListener('click', () => showImage('prev'));
    lightboxNext && lightboxNext.addEventListener('click', () => showImage('next'));
    
    // Close lightbox on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.lightbox-content')) {
            // Check if click is on the image or controls, if not, close
            if (!e.target.closest('.lightbox-image') && !e.target.closest('.lightbox-btn')) {
                closeLightbox();
            }
        }
    });

    // Keyboard controls for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage('prev');
            if (e.key === 'ArrowRight') showImage('next');
        }
    });

    // Swipe navigation for touch devices
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD_PX = 50;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        if (!lightbox.classList.contains('visible')) return;

        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;

        if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
        if (Math.abs(deltaY) > Math.abs(deltaX)) return; // axis lock

        showImage(deltaX < 0 ? 'next' : 'prev');
    }, { passive: true });
    
    // Mobile Menu Toggler
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.mobile-nav-link, .desktop-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });


    // Listen for browser navigation events (back/forward)
    window.addEventListener('popstate', handleURLChange);

    // Initial render
    renderGallery();

    // Check URL on initial load
    handleURLChange();

    // Hero Section Parallax Effect
    const heroBg = document.getElementById('hero-bg');
    const parallax1 = document.getElementById('hero-parallax-1');
    const parallax2 = document.getElementById('hero-parallax-2');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Only apply parallax if scrolling down the page
        if (scrollY >= 0) {
            // Check if elements exist before trying to style them
            if (heroBg) {
                heroBg.style.transform = `translateY(${scrollY * 0.8}px)`;
            }
            if (parallax1) {
                parallax1.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
            if (parallax2) {
                parallax2.style.transform = `translateY(${scrollY * 0.2}px)`;
            }
        }
    });
});
