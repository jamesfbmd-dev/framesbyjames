import { fetchImageData } from './data-service.js';
import { initPreloader } from './preloader.js';
import { renderGallery, setGalleryData } from './gallery.js';
import { setLightboxData, closeLightbox, showImage, handleURLChange } from './lightbox.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Data
    const imageData = await fetchImageData();
    setGalleryData(imageData);
    setLightboxData(imageData);

    // Initialize Preloader
    initPreloader();

    // Device scaling detector
    const scale = window.devicePixelRatio;
    if (scale === 1.25) {
        document.body.classList.add('scale-125');
    } else if (scale === 1.5) {
        document.body.classList.add('scale-150');
    }

    // Elements
    const gallery = document.getElementById('gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const arrowLink = document.getElementById('hero-arrow-link');

    // Hero Arrow Scroll Behavior
    const offset = 250;
    if (arrowLink) {
        arrowLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById('gallery');
            const topPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: topPos,
                behavior: 'smooth'
            });
        });
    }

    // Gallery Filter Logic
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            if (button.classList.contains('active')) return;

            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            if (filter === 'all') {
                gallery.classList.remove('gallery-filtered');
            } else {
                gallery.classList.add('gallery-filtered');
            }

            gallery.querySelectorAll('.gallery-item').forEach(item => {
                item.classList.add('gallery-item--hidden');
            });

            setTimeout(() => {
                gallery.classList.add('gallery--loading');
                renderGallery(filter);
                setTimeout(() => {
                    gallery.classList.remove('gallery--loading');
                }, 15);
            }, 300);
        });
    });

    // Lightbox Controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showImage('prev'));
    if (lightboxNext) lightboxNext.addEventListener('click', () => showImage('next'));
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('.lightbox-content')) {
                if (!e.target.closest('.lightbox-image') && !e.target.closest('.lightbox-btn')) {
                    closeLightbox();
                }
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (lightbox && !lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage('prev');
            if (e.key === 'ArrowRight') showImage('next');

            // Focus trapping
            if (e.key === 'Tab') {
                const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // if shift key pressed for shift + tab combination
                    if (document.activeElement === firstElement) {
                        lastElement.focus(); // add focus for the last focusable element
                        e.preventDefault();
                    }
                } else { // if tab key is pressed
                    if (document.activeElement === lastElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                        firstElement.focus(); // add focus for the first focusable element
                        e.preventDefault();
                    }
                }
            }
        }
    });

    // Swipe navigation
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD_PX = 50;

    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const deltaY = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
            if (Math.abs(deltaY) > Math.abs(deltaX)) return;
            showImage(deltaX < 0 ? 'next' : 'prev');
        }, { passive: true });
    }
    
    // Mobile Menu
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', !isHidden);
        });
    }
    
    document.querySelectorAll('.mobile-nav-link, .desktop-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    window.addEventListener('popstate', handleURLChange);

    // Initial render
    renderGallery();
    handleURLChange();

    // Hero Parallax
    const heroBg = document.getElementById('hero-bg');
    const parallax1 = document.getElementById('hero-parallax-1');
    const parallax2 = document.getElementById('hero-parallax-2');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY >= 0) {
            if (heroBg) heroBg.style.transform = `translateY(${scrollY * 0.8}px)`;
            if (parallax1) parallax1.style.transform = `translateY(${scrollY * 0.5}px)`;
            if (parallax2) parallax2.style.transform = `translateY(${scrollY * 0.2}px)`;
        }
    });
});
