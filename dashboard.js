(function () {
  const SESSION_KEY = 'acme_session';

  if (!isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  const session = getSession();
  const displayName = session.name || 'Jane Doe';
  const firstName = displayName.split(' ')[0];
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  document.getElementById('user-name').textContent = displayName;
  document.getElementById('greeting-name').textContent = firstName;
  document.getElementById('user-avatar').textContent = initials;

  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  });

  initThemeToggle();
  initSearch();
})();

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const THEME_KEY = 'acme_theme';

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    localStorage.setItem(THEME_KEY, theme);
  }

  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved === 'dark' ? 'dark' : 'light');

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
}

function initSearch() {
  const search = document.getElementById('search');
  const toggle = document.getElementById('search-toggle');
  const input = document.getElementById('search-input');
  const closeBtn = document.getElementById('search-close');
  if (!search || !toggle || !input || !closeBtn) return;

  function openSearch() {
    search.classList.add('search--open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close search');
    window.requestAnimationFrame(() => input.focus());
  }

  function closeSearch() {
    search.classList.remove('search--open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open search');
    input.value = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (search.classList.contains('search--open')) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  closeBtn.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && search.classList.contains('search--open')) {
      closeSearch();
    }
  });

  document.addEventListener('click', (event) => {
    if (search.classList.contains('search--open') && !search.contains(event.target)) {
      closeSearch();
    }
  });
}

function isLoggedIn() {
  try {
    const raw = sessionStorage.getItem('acme_session');
    return raw !== null && JSON.parse(raw).loggedIn === true;
  } catch {
    return false;
  }
}

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem('acme_session')) || {};
  } catch {
    return {};
  }
}
