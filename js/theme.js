/**
 * MATH FORMULA LIBRARY - INSTANT & SMOOTH THEME ENGINE
 * High-performance 60fps switching without DOM traversal lag
 */

(function () {
  const THEME_KEY = 'math_library_theme_pref';

  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  // Set initial theme immediately to prevent any flash
  document.documentElement.setAttribute('data-theme', getSavedTheme());

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const target = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem(THEME_KEY, target);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(THEME_KEY)) {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      });
    }
  });
})();