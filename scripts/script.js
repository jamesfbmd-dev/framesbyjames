document.addEventListener('DOMContentLoaded', () => {
    // Gallery Data with high-contrast placeholders
    const imageData = [
        { src: 'https://images.unsplash.com/photo-1546868762-b61266729c8a?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'portraits', alt: 'Portrait 1', ratio: '3x4' },
        { src: 'https://plus.unsplash.com/premium_photo-1733317293766-5606f74b765b?q=80&w=2748&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'landscapes', alt: 'Landscape 1', ratio: '4x3' },
        { src: 'https://images.unsplash.com/photo-1562162315-823bc0b8a3dd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'street', alt: 'Street 1', ratio: '3x4' },
        { src: 'https://images.unsplash.com/photo-1543557211-135d718a528c?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'portraits', alt: 'Portrait 2', ratio: '3x4' },
        { src: 'https://plus.unsplash.com/premium_photo-1733317231152-4018bb2ad04a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'landscapes', alt: 'Landscape 2', ratio: '4x3' },
        { src: 'https://images.unsplash.com/photo-1587968916653-f52a46826407?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'street', alt: 'Street 2', ratio: '3x4' },
        { src: 'https://images.unsplash.com/photo-1515199232915-d74ea00e6149?q=80&w=1484&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'portraits', alt: 'Portrait 3', ratio: '3x4' },
        { src: 'https://images.unsplash.com/photo-1594025376982-e0b77ef22c26?q=80&w=2477&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'landscapes', alt: 'Landscape 3', ratio: '4x3' },
        { src: 'https://images.unsplash.com/photo-1583565929583-c5aa76ab16f3?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'street', alt: 'Street 3', ratio: '4x3' },
        { src: 'https://images.unsplash.com/photo-1642740737476-5a7758172d2f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'portraits', alt: 'Portrait 4', ratio: '3x4' },
        { src: 'https://images.unsplash.com/photo-1545405197-2964efafb2c6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'landscapes', alt: 'Landscape 4', ratio: '4x3' },
        { src: 'https://images.unsplash.com/photo-1611840717112-30daa589f13b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'street', alt: 'Street 4', ratio: '3x4' }
    ];

    const gallery = document.getElementById('gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    let currentImageIndex = 0;
    let currentFilter = 'all';

    /**
     * Renders the gallery items based on the active filter.
     * Uses the original image data and dynamic element creation.
     */
    function renderGallery(filter = 'all') {
        gallery.innerHTML = '';
        // Filter the images based on the active category
        const filteredImages = (filter === 'all') ? imageData : imageData.filter(img => img.category === filter);
        
        filteredImages.forEach((data, index) => {
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
            img.onerror = function() {
                // Fallback for visual cue if image fails
                console.error("Image failed to load: " + this.src);
                this.style.display = 'none'; 
                relativeWrapper.style.backgroundColor = '#312F2C'; 
                relativeWrapper.innerHTML = '<span style="color:white; font-size: 1.125rem; text-transform:uppercase; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">Error</span>';
            };
            img.className = 'img-thumbnail'; // Pure CSS class for w-full h-full object-cover
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
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function updateLightboxImage() {
        // Filter images based on the current filter setting
        const currentGalleryImages = (currentFilter === 'all') 
            ? imageData 
            : imageData.filter(img => img.category === currentFilter);

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
        
        lightboxImg.src = imageData[currentImageIndex].src;
    }

    function showImage(direction) {
        const currentGalleryImages = (currentFilter === 'all') ? imageData : imageData.filter(img => img.category === currentFilter);
        
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


    /**
     * Event Listeners
     */
    
    // Gallery Filter Logic
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            currentFilter = filter;

            // Add or remove a class to the gallery for responsive column adjustments
            if (filter === 'all') {
                gallery.classList.remove('gallery-filtered');
            } else {
                gallery.classList.add('gallery-filtered');
            }
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            renderGallery(filter);
        });
    });

    // Lightbox Controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showImage('prev'));
    lightboxNext.addEventListener('click', () => showImage('next'));
    
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
    renderGallery();

    // Hero Section Mouse Follow Spotlight Effect
    const heroSection = document.getElementById('hero');
    const heroSpotlight = document.getElementById('hero-spotlight');

    if (heroSection && heroSpotlight) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate position as a percentage
            const mouseX = (x / rect.width) * 100;
            const mouseY = (y / rect.height) * 100;

            // Apply properties to the spotlight layer
            heroSpotlight.style.setProperty('--mouse-x', `${mouseX}%`);
            heroSpotlight.style.setProperty('--mouse-y', `${mouseY}%`);
            heroSpotlight.style.setProperty('--mouse-opacity', '1');
        });

        heroSection.addEventListener('mouseleave', () => {
            // Hide the spotlight layer
            heroSpotlight.style.setProperty('--mouse-opacity', '0');
        });
    }
});
