let currentImageIndex = 0;

/**
 * Lightbox functions
 */
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    currentImageIndex = index;
    updateLightboxImage('open');
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

// 'open' used to determine if this is lightbox opening for the first time.
function updateLightboxImage(open) {
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

    //FADE IMAGES OUT AND IN
    lightboxImg.style.opacity = 0;

    const showImage = () => {
        lightboxImg.src = lightboxImagePath;

        lightboxImg.decode()
            .then(() => {
                lightboxImg.style.opacity = 1;
            })
            .catch(() => {
                lightboxImg.style.opacity = 1;
            });
    };

    if (open) {
        showImage();
    } else {
        setTimeout(showImage, 400);
    }
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
