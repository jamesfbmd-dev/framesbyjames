// =========================
// ======= PRELOADER =======
// =========================

(function () {
  const STORAGE_KEY = 'pl_session_seen';
  const MAX_LOAD_TIME_MS = 7000;
  const FADE_OUT_DELAY_MS = 750;
  const MIN_LOAD_TIME_MS = 2000;
  const startTime = performance.now();

  const html = document.documentElement;
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');

  // Array of images (element id's) that must load before the preloader completes.
  const REQUIRED_IMAGES = [
    'hero-bg',
    'hero-parallax-1',
    'hero-parallax-2'
  ];

  if (!preloader) return;

  // Already seen during this browser session?
  if (sessionStorage.getItem(STORAGE_KEY)) {
    html.classList.add('pl-done');
    return;
  }

  // Mark as seen immediately
  sessionStorage.setItem(STORAGE_KEY, 'true');

  // Activate preloader
  html.classList.add('pl-active');

  let rafId = null;
  let animStart = null;
  let fallbackTimer = null;
  let isFinished = false;

  function step(timestamp) {
      if (!animStart) animStart = timestamp;

      const elapsed = timestamp - animStart;

      // Slowly progress towards 90% while loading
      const pct = Math.min(
          90,
          20 + (70 * (1 - Math.exp(-elapsed / 5000)))
      );

      if (bar) {
          bar.style.width = `${pct.toFixed(1)}%`;
      }

      rafId = requestAnimationFrame(step);
  }

  function finish() {
    if (isFinished) return;
    isFinished = true;

    cancelAnimationFrame(rafId);
    clearTimeout(fallbackTimer);

    if (bar) {
      bar.style.width = '100%';
    }

    setTimeout(() => {
      html.classList.remove('pl-active');
      html.classList.add('pl-done');
    }, FADE_OUT_DELAY_MS);
  }

  rafId = requestAnimationFrame(step);

  fallbackTimer = setTimeout(finish, MAX_LOAD_TIME_MS);

  // Wait for any images defined in the REQUIRED_IMAGES array to load 
  function waitForImages() {
      const images = REQUIRED_IMAGES.map(id => {
          const img = document.getElementById(id);

          return new Promise(resolve => {
              if (!img) {
                  resolve();
                  return;
              }

              if (img.complete && img.naturalWidth > 0) {
                  resolve();
                  return;
              }

              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
          });
      });

      return Promise.all(images);
  }

  window.addEventListener('load', async () => {
    await waitForImages();
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, MIN_LOAD_TIME_MS - elapsed);

    setTimeout(finish, remaining);
  }, { once: true });
  
})();