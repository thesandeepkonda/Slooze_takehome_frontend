// Login and theme handling
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

// Theme handling
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('slooze-theme', theme);
}

// Initialize theme
const saved = localStorage.getItem('slooze-theme') || 'light';
setTheme(saved);

// Theme toggle
document.querySelectorAll('#theme-toggle').forEach(el => {
  el.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
});

// Login form submission
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous message
    message.textContent = '';
    message.style.display = 'none';

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      });

      if (!res.ok) {
        const err = await res.json();
        message.style.display = 'block';
        message.style.color = 'var(--error)';
        message.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))';
        message.style.border = '2px solid var(--error)';
        message.textContent = err.error || 'Login failed';
        return;
      }

      const data = await res.json();

      // Store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('email', data.email);

      // Show success message
      message.style.display = 'block';
      message.style.color = 'var(--success)';
      message.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))';
      message.style.border = '2px solid var(--success)';
      message.textContent = 'Login successful. Redirecting...';

      setTimeout(() => {
        window.location.href = '/products.html';
      }, 600);
    } catch (e) {
      message.style.display = 'block';
      message.style.color = 'var(--error)';
      message.textContent = 'Network error. Please try again.';
    }
  });
}