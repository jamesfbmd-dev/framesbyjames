let currentFilter = 'all';

function renderGallery(filter = 'all', override) {
    const gallery = document.getElementById('gallery');

    if (!gallery) return;

    gallery.innerHTML = '';

    const images = getGalleryImages(filter, override);
    const shuffledImages = shuffleImages(images);

    shuffledImages.forEach(image => {
        gallery.appendChild(createGalleryItem(image));
    });
}

function getGalleryImages(filter, override) {
    if (override) {
        return imageData.filter(image =>
            override.includes(image.id) &&
            !image.hidden
        );
    }

    if (filter === 'all') {
        return imageData.filter(image => !image.hidden);
    }

    return imageData.filter(image =>
        image.category.includes(filter) &&
        !image.hidden
    );
}

function shuffleImages(images) {
    const shuffled = [...images];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[randomIndex]] =
        [shuffled[randomIndex], shuffled[i]];
    }

    return shuffled;
}

function createGalleryItem(image) {
    const item = document.createElement('div');

    item.className = 'gallery-item';
    item.dataset.category = image.category;
    item.dataset.fullSrc = image.src;
    item.dataset.originalIndex = imageData.findIndex(
        img => img.src === image.src
    );

    const ratioWrapper = document.createElement('div');
    ratioWrapper.className = `aspect-ratio-container ratio-${image.ratio}`;

    const contentHolder = document.createElement('div');
    contentHolder.className = 'aspect-ratio-content';

    const relativeWrapper = document.createElement('div');
    relativeWrapper.className = 'relative-wrapper';

    const img = createImageElement(image, relativeWrapper);

    relativeWrapper.appendChild(img);
    contentHolder.appendChild(relativeWrapper);
    ratioWrapper.appendChild(contentHolder);
    item.appendChild(ratioWrapper);

    contentHolder.addEventListener('click', () => {
        openLightbox(Number(item.dataset.originalIndex));
    });

    return item;
}

function createImageElement(image, relativeWrapper) {
    const img = document.createElement('img');

    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';

    img.className =
        image.positionOverride === 'bottom'
            ? 'img-thumbnail img-bottom'
            : 'img-thumbnail';

    img.onerror = function () {
        console.error(`Image failed to load: ${this.src}`);

        this.style.display = 'none';

        relativeWrapper.style.backgroundColor = '#312F2C';

        relativeWrapper.innerHTML = `
            <span style="
                color:white;
                font-size:1.125rem;
                text-transform:uppercase;
                display:flex;
                align-items:center;
                justify-content:center;
                width:100%;
                height:100%;
            ">
                Image not found
            </span>
        `;
    };

    return img;
}