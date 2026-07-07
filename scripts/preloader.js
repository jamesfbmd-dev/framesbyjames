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
    const pct = 90 * (1 - Math.exp(-elapsed / 1500));

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

  window.addEventListener('load', () => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, MIN_LOAD_TIME_MS - elapsed);

    setTimeout(finish, remaining);
  }, { once: true });
  
})();