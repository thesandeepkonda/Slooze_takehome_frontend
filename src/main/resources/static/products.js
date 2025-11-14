// Theme handling
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function setTheme(t) {
  root.setAttribute('data-theme', t);
  localStorage.setItem('slooze-theme', t);
}

function initTheme() {
  const saved = localStorage.getItem('slooze-theme');
  if (saved) setTheme(saved);
  else setTheme('light');
}

function toggleTheme() {
  const cur = root.getAttribute('data-theme') || 'light';
  setTheme(cur === 'light' ? 'dark' : 'light');
}

themeToggle && themeToggle.addEventListener('click', toggleTheme);
initTheme();

// Get auth data
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const menu = document.getElementById('menu');

// Check authentication
if (!token) {
  const alertsDiv = document.getElementById('alerts');
  if (alertsDiv) {
    alertsDiv.innerHTML = `
      <div style="padding:16px 20px;border-radius:14px;background:var(--glass-bg);
        backdrop-filter:blur(20px);border:2px solid var(--error);color:var(--error);
        font-weight:600;text-align:center">
        You must login to access products. Redirecting to login...
      </div>
    `;
  }
  setTimeout(() => window.location.href = '/', 1500);
}

// Fetch and display products
async function fetchProducts() {
  try {
    const res = await fetch('/products', {
      headers: {'Authorization': 'Bearer ' + token}
    });

    if (!res.ok) {
      const j = await res.json();
      showAlert(j.error || 'Failed to load products', 'error');
      return;
    }

    const list = await res.json();
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:60px 20px;color:var(--fg);opacity:0.6">
            <div style="display:flex;flex-direction:column;align-items:center;gap:16px">
              <svg viewBox="0 0 24 24" width="64" height="64" style="opacity:0.3">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <div>
                <div style="font-weight:700;font-size:18px;margin-bottom:8px">No products yet</div>
                <div style="font-size:14px;opacity:0.7">Click "Add Product" to get started</div>
              </div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    list.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:600">${p.id}</td>
        <td style="font-weight:600;font-size:15px">${p.name}</td>
        <td style="opacity:0.8">${p.category}</td>
        <td style="font-weight:700">${p.quantity}</td>
        <td style="font-weight:700;color:var(--primary)">$${parseFloat(p.price).toFixed(2)}</td>
        <td>
          <button class="action-btn" data-id="${p.id}" data-action="edit">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Edit
          </button>
        </td>
      `;

      // Add edit button event listener
      const editBtn = tr.querySelector('[data-action="edit"]');
      editBtn.addEventListener('click', () => openModal('edit', p));

      tbody.appendChild(tr);
    });
  } catch (e) {
    showAlert('Network error while loading products', 'error');
  }
}

// Modal handling
const modal = document.getElementById('productModal');
const addBtn = document.getElementById('addBtn');
const closeModalBtn = document.getElementById('closeModal');
const saveBtn = document.getElementById('saveProduct');
let editId = null;

function openModal(mode, p) {
  modal.classList.remove('hidden');
  document.getElementById('modalTitle').textContent = mode === 'edit' ? 'Edit Product' : 'Add Product';

  if (p) {
    editId = p.id;
    document.getElementById('pname').value = p.name;
    document.getElementById('pcat').value = p.category;
    document.getElementById('pqty').value = p.quantity;
    document.getElementById('pprice').value = p.price;
  } else {
    editId = null;
    document.getElementById('pname').value = '';
    document.getElementById('pcat').value = '';
    document.getElementById('pqty').value = '';
    document.getElementById('pprice').value = '';
  }
}

function closeModal() {
  modal.classList.add('hidden');
  editId = null;
}

addBtn && addBtn.addEventListener('click', () => openModal('add'));
closeModalBtn && closeModalBtn.addEventListener('click', closeModal);

// Close modal on overlay click
modal && modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

// Save product
saveBtn && saveBtn.addEventListener('click', async () => {
  const p = {
    name: document.getElementById('pname').value.trim(),
    category: document.getElementById('pcat').value.trim(),
    quantity: parseInt(document.getElementById('pqty').value) || 0,
    price: parseFloat(document.getElementById('pprice').value) || 0
  };

  // Validation
  if (!p.name) {
    showAlert('Product name is required', 'error');
    return;
  }

  if (!p.category) {
    showAlert('Category is required', 'error');
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  };

  try {
    let res;
    if (editId) {
      res = await fetch('/products/' + editId, {
        method: 'PUT',
        headers,
        body: JSON.stringify(p)
      });
    } else {
      res = await fetch('/products', {
        method: 'POST',
        headers,
        body: JSON.stringify(p)
      });
    }

    if (!res.ok) {
      const j = await res.json();
      showAlert(j.error || 'Failed to save product', 'error');
    } else {
      closeModal();
      showAlert(editId ? 'Product updated successfully!' : 'Product added successfully!', 'success');
      fetchProducts();
    }
  } catch (e) {
    showAlert('Network error while saving product', 'error');
  }
});

// Alert notification function
function showAlert(message, type = 'info') {
  const alertsDiv = document.getElementById('alerts');
  if (!alertsDiv) return;

  let icon = '';
  let color = 'var(--primary)';
  let bgColor = 'rgba(99, 102, 241, 0.1)';

  if (type === 'success') {
    color = 'var(--success)';
    bgColor = 'rgba(16, 185, 129, 0.1)';
    icon = `<svg viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>`;
  } else if (type === 'error') {
    color = 'var(--error)';
    bgColor = 'rgba(239, 68, 68, 0.1)';
    icon = `<svg viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
    </svg>`;
  } else {
    icon = `<svg viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
      <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
      <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2"/>
    </svg>`;
  }

  const alert = document.createElement('div');
  alert.style.cssText = `
    padding: 16px 20px;
    border-radius: 14px;
    background: ${bgColor};
    backdrop-filter: blur(20px);
    border: 2px solid ${color};
    color: ${color};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 12px;
  `;

  alert.innerHTML = `${icon}<span>${message}</span>`;
  alertsDiv.appendChild(alert);

  setTimeout(() => {
    alert.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// Initial load
if (token) {
  fetchProducts();
}