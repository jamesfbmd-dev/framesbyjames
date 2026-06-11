let currentFilter = 'all';

/**
 * Renders the gallery items based on the active filter.
 * Uses the original image data and dynamic element creation.
 */
function renderGallery(filter = 'all', override) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

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
            relativeWrapper.innerHTML = '<span style="color:white; font-size: 1.125rem; text-transform:uppercase; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">Image not found</span>';
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
