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
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxPrevMobile = document.getElementById('lightbox-prev-mobile');
    const lightboxNextMobile = document.getElementById('lightbox-next-mobile');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const arrowLink = document.getElementById('hero-arrow-link');

    let currentImageIndex = 0;
    let currentFilter = 'all';


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
     * Renders the gallery items based on the active filter.
     * Uses the original image data and dynamic element creation.
     */
    function renderGallery(filter = 'all', override) {
        gallery.innerHTML = '';

        let filteredImages;

        // Check if override exists
        if (override) {
            filteredImages = imageData.filter(img => override.includes(img.id));
            console.log(filteredImages);
        } else {
            // Filter the images based on the active category
            filteredImages = (filter === 'all') ? imageData : imageData.filter(img => img.category.includes(filter));
        }

        // RANDOMISE ORDER OF IMAGES
        const filteredImagesRandomOrder = [...filteredImages];

        for (let i = filteredImagesRandomOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filteredImagesRandomOrder[i], filteredImagesRandomOrder[j]] = [filteredImagesRandomOrder[j], filteredImagesRandomOrder[i]];
        }

        // Use 'filteredImages' if you want to have them appear in order.
        // Use 'filteredImagesRandomOrder' if you want them to appear in a random order.
        filteredImagesRandomOrder.forEach((data, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item'; // Styles handled by CSS
            item.dataset.category = data.category;
            item.dataset.fullSrc = data.src;
            // Store the index in the original, unfiltered array for lightbox navigation
            item.dataset.originalIndex = imageData.findIndex(img => img.src === data.src);
            
            // 1. Aspect ratio wrapper (sets height via padding)
            const ratioWrapper = document.createElement('div');
            ratioWrapper.className = `aspect-ratio-container ratio-${data.ratio}`;

            // 2. Absolute filler (fills the space created by padding)
            const contentHolder = document.createElement('div');
            contentHolder.className = 'aspect-ratio-content';

            // 3. CRITICAL: Relative wrapper (correctly contains image and overlay)
            const relativeWrapper = document.createElement('div');
            relativeWrapper.className = 'relative-wrapper';

            const img = document.createElement('img');
            img.src = data.src;
            img.loading = 'lazy';
            img.onerror = function() {
                // Fallback for visual cue if image fails
                console.error("Image failed to load: " + this.src);
                this.style.display = 'none'; 
                relativeWrapper.style.backgroundColor = '#312F2C'; 
                relativeWrapper.innerHTML = '<span style="color:white; font-size: 1.125rem; text-transform:uppercase; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">Error</span>';
            };

            if(data.positionOverride) {
                if(data.positionOverride == 'bottom') {
                    img.className = 'img-thumbnail img-bottom';
                }
            } else {
               img.className = 'img-thumbnail'; // Pure CSS class for w-full h-full object-cover
            }

            img.alt = data.alt;
            img.loading = 'lazy';

            relativeWrapper.appendChild(img);
            contentHolder.appendChild(relativeWrapper);
            ratioWrapper.appendChild(contentHolder);
            item.appendChild(ratioWrapper);
            
            gallery.appendChild(item);

            // ATTACH CLICK LISTENER ONLY TO THE VISIBLE CONTENT AREA
            contentHolder.addEventListener('click', () => openLightbox(parseInt(item.dataset.originalIndex)));
        });
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

        const imageId = imageData[currentImageIndex].id;
        history.pushState({ imageId: imageId }, '', `#/image/${imageId}`);
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
        history.replaceState(null, '', window.location.pathname);
    }

    // function updateLightboxImage() {
    //     // Filter images based on the current filter setting
    //     const currentGalleryImages = (currentFilter === 'all')
    //         ? imageData
    //         : imageData.filter(img => img.category.includes(currentFilter));

    //     // Find the index of the currently viewed image within the filtered list
    //     let currentLocalIndex = currentGalleryImages.findIndex(img => img.src === imageData[currentImageIndex].src);

    //     // If the current image is not in the filtered list (e.g., filter changed while lightbox was closed)
    //     if (currentLocalIndex === -1 && currentGalleryImages.length > 0) {
    //         currentImageIndex = imageData.findIndex(img => img.src === currentGalleryImages[0].src);
    //     } else if (currentGalleryImages.length === 0) {
    //          // Handle case where filter returns no images
    //          closeLightbox();
    //          return;
    //     }

    //     let lightboxImagePath;
    //     let standardRes = imageData[currentImageIndex].src;
    //     let hires = imageData[currentImageIndex].hiResSrc;
    //     hires ? lightboxImagePath = hires : lightboxImagePath = standardRes;
    //     lightboxImg.src = lightboxImagePath;

    // }

    function updateLightboxImage() {
        // Filter images based on the current filter setting
        const currentGalleryImages = (currentFilter === 'all')
            ? imageData
            : imageData.filter(img => img.category.includes(currentFilter));

        // Find the index of the currently viewed image within the filtered list
        let currentLocalIndex = currentGalleryImages.findIndex(img => img.src === imageData[currentImageIndex].src);

        // If the current image is not in the filtered list (e.g., filter changed while lightbox was closed)
        if (currentLocalIndex === -1 && currentGalleryImages.length > 0) {
            currentImageIndex = imageData.findIndex(img => img.src === currentGalleryImages[0].src);
        } else if (currentGalleryImages.length === 0) {
            // Handle case where filter returns no images
            closeLightbox();
            return;
        }

        // Determine which image path to use
        const currentImage = imageData[currentImageIndex];
        const lightboxImagePath = (currentImage.hiRes?.useHiRes && currentImage.hiRes?.hiResSrc)
            ? currentImage.hiRes.hiResSrc
            : currentImage.src;

        lightboxImg.src = lightboxImagePath;
    }

    function showImage(direction) {
        const currentGalleryImages = (currentFilter === 'all') ? imageData : imageData.filter(img => img.category.includes(currentFilter));

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

        const imageId = imageData[currentImageIndex].id;
        history.replaceState({ imageId: imageId }, '', `#/image/${imageId}`);
    }


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

    function handleURLChange() {
        const hash = window.location.hash;
        if (hash.startsWith('#/image/')) {
            const imageId = parseInt(hash.substring(8));
            if (!isNaN(imageId)) {
                const imageIndex = imageData.findIndex(img => img.id === imageId);
                if (imageIndex !== -1) {
                    currentImageIndex = imageIndex;
                    updateLightboxImage();
                    lightbox.classList.add('visible');
                    lightbox.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }
        } else {
            lightbox.classList.remove('visible');
            lightbox.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

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

