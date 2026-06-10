// =========================
// ======= PRELOADER =======
// =========================

(function () {
  const STORAGE_KEY       = 'pl_session_seen';
  const MAX_LOAD_TIME_MS  = 7000; // 7-second maximum safety net
  const FADE_OUT_DELAY_MS = 350;  // pause at 100% before hiding

  const html      = document.documentElement;
  const preloader = document.getElementById('preloader');
  const bar       = document.getElementById('preloader-bar');

  if (!preloader) return;

  // ── Session Storage Check ──────────────────────────────────────
  // If they have seen the preloader this session, bail out immediately.
  if (sessionStorage.getItem(STORAGE_KEY)) {
    html.classList.remove('pl-active');
    html.classList.add('pl-done');
    return; // Stop execution, no animation
  }

  // Otherwise, mark it as seen for next time
  try {
    sessionStorage.setItem(STORAGE_KEY, 'true');
  } catch (e) {
    // Failsafe for private browsing modes that restrict storage
  }

  // Ensure the active class is present
  html.classList.add('pl-active');

  let rafId = null;
  let animStart = null;
  let fallbackTimer = null;
  let isFinished = false;

  // ── Progress animation ─────────────────────────────────────────
  // Exponential easing: fast start, asymptotically approaches 90%.
  function step(timestamp) {
    if (!animStart) animStart = timestamp;
    const elapsed = timestamp - animStart;
    const pct = 90 * (1 - Math.exp(-elapsed / 1500));

    if (bar) bar.style.width = `${pct.toFixed(1)}%`;
    rafId = requestAnimationFrame(step);
  }

  function startAnimation() {
    rafId = requestAnimationFrame(step);
  }

  // ── Finish & hide ──────────────────────────────────────────────
  function finish() {
    if (isFinished) return; // Prevent double-firing
    isFinished = true;

    cancelAnimationFrame(rafId);
    if (fallbackTimer) clearTimeout(fallbackTimer);

    if (bar) bar.style.width = '100%';

    setTimeout(() => {
      html.classList.remove('pl-active');
      html.classList.add('pl-done'); // CSS handles the fade out
    }, FADE_OUT_DELAY_MS);
  }

  // ── Initialization ─────────────────────────────────────────────
  startAnimation();

  // The 7-second maximum. If 'load' hasn't fired by now, force it closed.
  fallbackTimer = setTimeout(() => {
    finish();
  }, MAX_LOAD_TIME_MS);

  // Listen for actual page load to finish normally
  window.addEventListener('load', finish, { once: true });

}());
