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

    const gallery = document.getElementById('gallery');
    const filterButtons = document.querySelectorAll('#filter-buttons .filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxPrevMobile = document.getElementById('lightbox-prev-mobile');
    const lightboxNextMobile = document.getElementById('lightbox-next-mobile');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const arrowLink = document.getElementById('hero-arrow-link');
    const loadMoreBtn = document.getElementById('load-more-btn');

    let currentImageIndex = 0;
    let currentFilterType = 'filter';
    let currentFilterValue = 'all';
    let allFilteredImages = [];
    let imagesLoaded = 0;
    const imagesPerLoad = 6;


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

    //----------------------------
    //LOCATION FILTER BEHAVIOUR
    //----------------------------
    const filters = document.querySelectorAll('.location-filter');

    // Country letter spacing values
    let auIncrease = '4px';
    let auDecrease = '-1.25px';
    let jpIncrease = '6px';
    let jpDecrease = '-1.5px';
    let nzIncrease = '4px';
    let nzDecrease = '-1.25px';

    filters.forEach(filter => {
        filter.addEventListener('mouseenter', () => {
            filters.forEach(f => {
                const h3 = f.querySelector('h3');

                if (f === filter) {
                    if (f.classList.contains('australia')) {
                        h3.style.letterSpacing = auIncrease;
                    } else if (f.classList.contains('japan')) {
                        h3.style.letterSpacing = jpIncrease;
                    } else if (f.classList.contains('new-zealand')) {
                        h3.style.letterSpacing = nzIncrease;
                    }
                } else {
                    if (f.classList.contains('australia')) {
                        h3.style.letterSpacing = auDecrease;
                    }
                    else if (f.classList.contains('japan')) {
                        h3.style.letterSpacing = jpDecrease;
                    }
                    else if (f.classList.contains('new-zealand')) {
                        h3.style.letterSpacing = nzDecrease;
                    }
                }
            });
        });

        filter.addEventListener('mouseleave', () => {
            filters.forEach(f => f.querySelector('h3').style.letterSpacing = '0.5px');
        });

        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Remove active class from all location filters
                filters.forEach(f => f.classList.remove('active'));

                // Add active class to the clicked filter
                filter.classList.add('active');

                const location = filter.dataset.location;
                // Animate out existing items
                gallery.querySelectorAll('.gallery-item').forEach(item => {
                    item.classList.add('gallery-item--hidden');
                });
                // After fade-out, re-render
                setTimeout(() => {
                    gallery.classList.add('gallery--loading');
                    applyFilterAndRender('location', location);
                    setTimeout(() => {
                        gallery.classList.remove('gallery--loading');
                    }, 15);
                }, 300);
            });
        });
    });
    //----------------------------
    // EO LOCATION FILTER BEHAVIOUR
    //----------------------------

    function appendImages(images) {
        images.forEach((data) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.category = data.category;
            item.dataset.fullSrc = data.src;
            item.dataset.originalIndex = imageData.findIndex(img => img.src === data.src);

            const ratioWrapper = document.createElement('div');
            ratioWrapper.className = `aspect-ratio-container ratio-${data.ratio}`;

            const contentHolder = document.createElement('div');
            contentHolder.className = 'aspect-ratio-content';

            const relativeWrapper = document.createElement('div');
            relativeWrapper.className = 'relative-wrapper';

            const img = document.createElement('img');
            img.src = data.src;
            img.loading = 'lazy';
            img.alt = data.alt;

            img.onerror = function() {
                console.error("Image failed to load: " + this.src);
                this.style.display = 'none';
                relativeWrapper.style.backgroundColor = '#312F2C';
                relativeWrapper.innerHTML = '<span style="color:white; font-size: 1.125rem; text-transform:uppercase; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">Error</span>';
            };

            if (data.positionOverride && data.positionOverride === 'bottom') {
                img.className = 'img-thumbnail img-bottom';
            } else {
                img.className = 'img-thumbnail';
            }

            relativeWrapper.appendChild(img);
            contentHolder.appendChild(relativeWrapper);
            ratioWrapper.appendChild(contentHolder);
            item.appendChild(ratioWrapper);

            gallery.appendChild(item);

            contentHolder.addEventListener('click', () => openLightbox(parseInt(item.dataset.originalIndex)));
        });
    }

    function loadMoreImages() {
        const imagesToLoad = allFilteredImages.slice(imagesLoaded, imagesLoaded + imagesPerLoad);
        appendImages(imagesToLoad);
        imagesLoaded += imagesToLoad.length;

        if (imagesLoaded >= allFilteredImages.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }

    function applyFilterAndRender(type, filter = 'all') {
        currentFilterType = type;
        currentFilterValue = filter;

        if (type === 'location') {
            allFilteredImages = (filter === 'all') ? imageData : imageData.filter(img => img.location === filter);
        } else { // 'filter' or default
            allFilteredImages = (filter === 'all') ? imageData : imageData.filter(img => img.category.includes(filter));
        }

        // Randomize the order
        for (let i = allFilteredImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allFilteredImages[i], allFilteredImages[j]] = [allFilteredImages[j], allFilteredImages[i]];
        }

        gallery.innerHTML = '';
        imagesLoaded = 0;
        loadMoreImages();
    }


    /**
     * Lightbox functions
     */
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('visible');
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function updateLightboxImage() {
        const currentGalleryImages = getFilteredImages();

        if (currentGalleryImages.length === 0) {
            closeLightbox();
            return;
        }

        let currentLocalIndex = currentGalleryImages.findIndex(img => img.src === imageData[currentImageIndex].src);
        
        if (currentLocalIndex === -1) {
            currentImageIndex = imageData.findIndex(img => img.src === currentGalleryImages[0].src);
        }
        
        lightboxImg.src = imageData[currentImageIndex].src;
    }

    function showImage(direction) {
        const currentGalleryImages = getFilteredImages();
        if (currentGalleryImages.length === 0) return;

        let currentLocalIndex = currentGalleryImages.findIndex(img => img.src === imageData[currentImageIndex].src);
        
        if (direction === 'next') {
            currentLocalIndex = (currentLocalIndex + 1) % currentGalleryImages.length;
        } else if (direction === 'prev') {
            currentLocalIndex = (currentLocalIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        }
        
        const newGlobalSrc = currentGalleryImages[currentLocalIndex].src;
        currentImageIndex = imageData.findIndex(img => img.src === newGlobalSrc);
        updateLightboxImage();
    }

    function getFilteredImages() {
        if (currentFilterType === 'location') {
            return (currentFilterValue === 'all') ? imageData : imageData.filter(img => img.location === currentFilterValue);
        } else { // 'filter' or default
            return (currentFilterValue === 'all') ? imageData : imageData.filter(img => img.category.includes(currentFilterValue));
        }
    }


    /**
     * Event Listeners
     */
    
    // Gallery Filter Logic
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            if (button.classList.contains('active')) return; // Don't re-filter if already active

            currentFilterType = 'filter';
            currentFilterValue = filter;

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

                applyFilterAndRender('filter', filter); // Re-build the gallery content

                // Use a minimal timeout to allow the browser to apply the 'loading' state
                // before we remove it to trigger the fade-in transition.
                setTimeout(() => {
                    gallery.classList.remove('gallery--loading');
                }, 15); // A small delay for the next paint cycle

            }, 300); // Match CSS transition duration
        });
    });

    // Load More Button
    loadMoreBtn.addEventListener('click', loadMoreImages);

    // Lightbox Controls
    lightboxClose.addEventListener('click', closeLightbox);

    lightboxPrev && lightboxPrev.addEventListener('click', () => showImage('prev'));
    lightboxNext && lightboxNext.addEventListener('click', () => showImage('next'));
    lightboxPrevMobile && lightboxPrevMobile.addEventListener('click', () => showImage('prev'));
    lightboxNextMobile && lightboxNextMobile.addEventListener('click', () => showImage('next'));
    
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

    // Initial render
    applyFilterAndRender('filter', 'all');

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
