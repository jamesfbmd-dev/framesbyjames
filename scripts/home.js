document.addEventListener('DOMContentLoaded', () => {
    // Hero Section Parallax Effect
    const heroBg = document.getElementById('hero-bg');
    const parallax1 = document.getElementById('hero-parallax-1');
    const parallax2 = document.getElementById('hero-parallax-2');

    if (heroBg && parallax1 && parallax2) {
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
    }
});
