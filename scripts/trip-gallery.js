document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const tripsData = {
        'great-ocean-road': {
            title: 'Great Ocean Road',
            images: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
        // Add other trips here
    };

    const galleryContainer = document.getElementById('trip-gallery-container');
    const tripTitleElement = document.getElementById('trip-title');

    // --- FUNCTIONS ---

    // 1. Get trip key from the current page's filename
    function getTripKeyFromURL() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename.replace('.html', ''); // e.g., "great-ocean-road"
    }

    // 2. Populate the gallery
    function populateGallery(trip) {
        if (!trip || !trip.images) {
            galleryContainer.innerHTML = '<p class="error-message">Trip data not found.</p>';
            return;
        }

        tripTitleElement.textContent = trip.title;

        trip.images.forEach(id => {
            const imageData = window.imageData.find(img => img.id === id);
            if (imageData) {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'trip-gallery-item';

                const img = document.createElement('img');
                img.src = `../${imageData.src}`;
                img.alt = imageData.alt || `Image ${id}`;

                galleryItem.appendChild(img);
                galleryContainer.appendChild(galleryItem);
            }
        });
    }

    // 3. Horizontal scroll animation
    function setupHorizontalScroll() {
        let current = 0;
        let target = 0;
        const ease = 0.075; // Smoothing factor

        const maxScroll = galleryContainer.scrollWidth - window.innerWidth;

        function lerp(start, end, t) {
            return start * (1 - t) + end * t;
        }

        function update() {
            target = window.scrollY;

            // Clamp the target to prevent overscrolling
            if (target < 0) target = 0;
            if (target > maxScroll) target = maxScroll;

            current = lerp(current, target, ease);

            if (galleryContainer) {
                 galleryContainer.style.transform = `translateX(-${current}px)`;
            }

            requestAnimationFrame(update);
        }

        // Set the body height to the scrollable width of the container
        // to create a "fake" scrollbar that we can use to drive the animation.
        document.body.style.height = `${galleryContainer.scrollWidth}px`;

        update();
    }

    // --- INITIALIZATION ---
    const tripKey = getTripKeyFromURL();
    const currentTrip = tripsData[tripKey];

    if (galleryContainer && tripTitleElement) {
        populateGallery(currentTrip);
        // Wait for images to load before setting up scroll, to get correct scrollWidth
        window.addEventListener('load', setupHorizontalScroll);
    }
});
