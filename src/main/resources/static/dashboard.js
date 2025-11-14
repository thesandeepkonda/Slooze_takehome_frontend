// /dashboard.js
(() => {
  // Theme persistence
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

  // Set today's date
  const todayEl = document.getElementById('today-date');
  if (todayEl) {
    const d = new Date();
    const opts = { year: 'numeric', month: 'short', day: 'numeric' };
    todayEl.textContent = d.toLocaleDateString(undefined, opts);
  }

  // Demo summary data (replace with real API)
  const demoSummary = [
    { title: 'Active Products', value: 128, subtitle: 'SKUs available' },
    { title: 'Low Stock', value: 12, subtitle: 'Items to reorder' },
    { title: 'Open Orders', value: 34, subtitle: 'Awaiting fulfillment' },
    { title: 'Shipments Today', value: 8, subtitle: 'Scheduled' }
  ];

  function renderSummary(cards) {
    const container = document.getElementById('summary');
    if (!container) return;
    container.innerHTML = '';
    cards.forEach((c, idx) => {
      const el = document.createElement('div');
      el.className = 'glass-effect summary-card';
      el.style.animationDelay = `${idx * 0.1}s`;
      el.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="font-size:13px;font-weight:600;color:var(--fg);opacity:0.7;text-transform:uppercase;letter-spacing:0.5px">${c.title}</div>
          <div style="font-size:36px;font-weight:800;line-height:1;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${c.value}</div>
          <div style="font-size:13px;color:var(--fg);opacity:0.6;margin-top:4px">${c.subtitle}</div>
        </div>
      `;
      container.appendChild(el);
    });
  }

  // Table demo data
  const demoRows = [
    { product: 'Wheat Batch A', sku: 'WH-001', stock: 1200, status: 'Healthy' },
    { product: 'Rice Premium', sku: 'RC-010', stock: 40, status: 'Low' },
    { product: 'Corn Grade B', sku: 'CR-212', stock: 220, status: 'Healthy' },
    { product: 'Soybeans Lot 9', sku: 'SB-909', stock: 8, status: 'Critical' }
  ];

  function renderTable(rows) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (rows.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="5" style="text-align:center;padding:60px 20px;color:var(--fg);opacity:0.6">
          <div style="display:flex;flex-direction:column;align-items:center;gap:16px">
            <svg viewBox="0 0 24 24" width="64" height="64" style="opacity:0.3">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2"/>
            </svg>
            <div>
              <div style="font-weight:700;font-size:18px;margin-bottom:8px">No results found</div>
              <div style="font-size:14px;opacity:0.7">Try adjusting your search criteria</div>
            </div>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
      return;
    }

    rows.forEach(r => {
      const tr = document.createElement('tr');

      let statusClass = '';
      let statusColor = '';
      if (r.status === 'Healthy') {
        statusClass = 'status-healthy';
        statusColor = 'var(--success)';
      } else if (r.status === 'Low') {
        statusClass = 'status-low';
        statusColor = '#f97316';
      } else {
        statusClass = 'status-critical';
        statusColor = 'var(--error)';
      }

      tr.innerHTML = `
        <td style="font-weight:600;font-size:15px">${r.product}</td>
        <td style="font-family:monospace;color:var(--fg);opacity:0.7;font-size:14px">${r.sku}</td>
        <td style="font-weight:700;font-size:15px">${r.stock.toLocaleString()}</td>
        <td>
          <span class="status-badge ${statusClass}" style="color:${statusColor}">
            ${r.status}
          </span>
        </td>
        <td>
          <button class="action-btn" onclick="alert('View details for ${r.product}')">
            <svg viewBox="0 0 24 24" width="16" height="16" style="display:inline">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            View
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initial render
  renderSummary(demoSummary);
  renderTable(demoRows);

  // Refresh button
  const refreshBtn = document.getElementById('refreshBtn');
  refreshBtn && refreshBtn.addEventListener('click', () => {
    const btnContent = refreshBtn.querySelector('.btn-content span');
    const originalText = btnContent ? btnContent.textContent : 'Refresh';

    refreshBtn.disabled = true;
    refreshBtn.style.opacity = '0.7';
    refreshBtn.style.cursor = 'not-allowed';
    if (btnContent) btnContent.textContent = 'Refreshing...';

    setTimeout(() => {
      // in real app: fetch('/api/summary').then(...)
      renderSummary(demoSummary);
      renderTable(demoRows);

      refreshBtn.disabled = false;
      refreshBtn.style.opacity = '1';
      refreshBtn.style.cursor = 'pointer';
      if (btnContent) btnContent.textContent = originalText;

      // Show success notification
      showNotification('Data refreshed successfully!', 'success');
    }, 700);
  });

  // Search filter
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = demoRows.filter(r =>
        r.product.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)
      );
      renderTable(filtered);
    });
  }

  // Add item (demo)
  const addBtn = document.getElementById('addBtn');
  addBtn && addBtn.addEventListener('click', () => {
    showNotification('This is a demo. Implement add-item modal or navigation here.', 'info');
  });

  // Notification function
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');

    let icon = '';
    let color = 'var(--primary)';

    if (type === 'success') {
      color = 'var(--success)';
      icon = `<svg viewBox="0 0 24 24" width="20" height="20" style="flex-shrink:0">
        <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>`;
    } else if (type === 'error') {
      color = 'var(--error)';
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

    notification.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 16px 20px;
      border-radius: 14px;
      box-shadow: 0 8px 32px var(--shadow-lg);
      border: 2px solid ${color};
      font-weight: 600;
      color: ${color};
      animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10000;
      max-width: 400px;
      display: flex;
      align-items: center;
      gap: 12px;
    `;

    notification.innerHTML = `${icon}<span>${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

})();