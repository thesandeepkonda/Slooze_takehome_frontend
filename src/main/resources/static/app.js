// Login and theme handling
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
document.querySelectorAll('#theme-toggle').forEach(el=>{
  el.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
});
const saved = localStorage.getItem('theme') || 'light';
setTheme(saved);

loginForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email,password})
    });
    if (!res.ok) {
      const err = await res.json();
      message.textContent = err.error || 'Login failed';
      return;
    }
    const data = await res.json();
    // store in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('email', data.email);
    message.style.color='green';
    message.textContent = 'Login successful. Redirecting...';
    setTimeout(()=>{ window.location.href = '/products.html'; }, 600);
  } catch (e) {
    message.textContent = 'Network error';
  }
});
