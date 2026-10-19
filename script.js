(function () {
  const form = document.getElementById('login-form');
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('toggle-password');

  toggleBtn.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    toggleBtn.setAttribute('aria-pressed', String(!isVisible));
    toggleBtn.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const email = form.email.value.trim();
    const name = emailToDisplayName(email);

    sessionStorage.setItem('acme_session', JSON.stringify({
      loggedIn: true,
      email,
      name,
    }));

    window.location.href = 'dashboard.html';
  });

  initBrandOrbit();
})();

function emailToDisplayName(email) {
  const local = email.split('@')[0] || 'user';
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ') || 'Jane Doe';
}

function initBrandOrbit() {
  const mark = document.querySelector('.brand-mark');
  if (!mark) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) return;

  const orbs = [
    { el: mark.querySelector('.brand-mark__orb:not(.brand-mark__orb--secondary)'), radius: 26, speed: 0.00035, phase: 0 },
    { el: mark.querySelector('.brand-mark__orb--secondary'), radius: 22, speed: -0.00022, phase: Math.PI * 0.6 },
  ].filter((orb) => orb.el);

  let frameId = null;

  function tick(timestamp) {
    orbs.forEach(({ el, radius, speed, phase }) => {
      const angle = phase + timestamp * speed;
      el.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`;
    });
    frameId = requestAnimationFrame(tick);
  }

  frameId = requestAnimationFrame(tick);

  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      cancelAnimationFrame(frameId);
      orbs.forEach(({ el }) => {
        el.style.transform = '';
      });
    }
  });
}
