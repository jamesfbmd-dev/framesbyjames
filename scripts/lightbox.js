import { getCurrentFilter, renderGallery } from './gallery.js';

let imageData = [];
let currentImageIndex = 0;

export function setLightboxData(data) {
    imageData = data;
}

let lastFocusedElement;

export function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    lastFocusedElement = document.activeElement;
    currentImageIndex = index;
    updateLightboxImage(true);
    lightbox.classList.add('visible');
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const imageId = imageData[currentImageIndex].id;
    history.pushState({ imageId: imageId }, '', `#/image/${imageId}`);

    // Focus close button initially for accessibility
    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn) closeBtn.focus();
}

export function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('visible');
    lightbox.classList.add('hidden');
    document.body.style.overflow = 'auto';
    history.replaceState(null, '', window.location.pathname);

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

function updateLightboxImage(open) {
    const lightboxImg = document.getElementById('lightbox-img');
    const currentImage = imageData[currentImageIndex];
    if (lightboxImg && currentImage) {
        lightboxImg.alt = currentImage.alt;
    }
    const currentFilter = getCurrentFilter();

    const currentGalleryImages = (currentFilter === 'all')
        ? imageData.filter(img => !img.hidden)
        : imageData.filter(img => img.category.includes(currentFilter) && !img.hidden);

    let currentLocalIndex = currentGalleryImages.findIndex(img => img.src === imageData[currentImageIndex].src);

    if (currentLocalIndex === -1 && currentGalleryImages.length > 0) {
        currentImageIndex = imageData.findIndex(img => img.src === currentGalleryImages[0].src);
    } else if (currentGalleryImages.length === 0) {
        closeLightbox();
        return;
    }

    const imgData = imageData[currentImageIndex];
    const lightboxImagePath = (imgData.hiRes?.useHiRes && imgData.hiRes?.hiResSrc)
        ? imgData.hiRes.hiResSrc
        : imgData.src;

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

export function showImage(direction) {
    const currentFilter = getCurrentFilter();
    const currentGalleryImages = (currentFilter === 'all') ? imageData.filter(img => !img.hidden) : imageData.filter(img => img.category.includes(currentFilter) && !img.hidden);

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

export function handleURLChange() {
    const hash = window.location.hash;
    if (hash.startsWith('#/image/')) {
        const imageId = parseInt(hash.substring(8));
        if (!isNaN(imageId)) {
            const imageIndex = imageData.findIndex(img => img.id === imageId);
            if (imageIndex !== -1) {
                openLightbox(imageIndex);
            }
        }
    } else {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('visible')) {
            closeLightbox();
        }
    }
}
