let currentImageIndex = 0;

/**
 * Lightbox functions
 */
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('visible');
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const imageId = imageData[currentImageIndex].id;
    history.pushState({ imageId: imageId }, '', `#/image/${imageId}`);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('visible');
    lightbox.classList.add('hidden');
    document.body.style.overflow = 'auto';
    history.replaceState(null, '', window.location.pathname);
}

function updateLightboxImage() {
    const lightboxImg = document.getElementById('lightbox-img');
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

    // Smooth fade transition logic
    const absoluteImagePath = new URL(lightboxImagePath, window.location.origin).href;

    if (lightboxImg.src !== absoluteImagePath) {
        lightboxImg.classList.add('loading');

        const handleLoad = () => {
            lightboxImg.classList.remove('loading');
            lightboxImg.removeEventListener('load', handleLoad);
        };

        lightboxImg.addEventListener('load', handleLoad);
        lightboxImg.src = lightboxImagePath;
    } else {
        lightboxImg.src = lightboxImagePath;
        lightboxImg.classList.remove('loading');
    }

    preloadAdjacentImages(currentGalleryImages, currentLocalIndex);
}

function preloadAdjacentImages(filteredImages, currentIndex) {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;

    [nextIndex, prevIndex].forEach(idx => {
        const imgData = filteredImages[idx];
        const src = (imgData.hiRes?.useHiRes && imgData.hiRes?.hiResSrc)
            ? imgData.hiRes.hiResSrc
            : imgData.src;

        const img = new Image();
        img.src = src;
    });
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

function handleURLChange() {
    const lightbox = document.getElementById('lightbox');
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
