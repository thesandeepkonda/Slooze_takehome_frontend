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
    cards.forEach(c => {
      const el = document.createElement('div');
      el.className = 'glass-effect';
      el.style.padding = '18px';
      el.style.borderRadius = '14px';
      el.style.boxShadow = '0 8px 30px var(--shadow)';
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="font-weight:700">${c.title}</div>
          <div style="font-size:20px;font-weight:800;color:var(--primary)">${c.value}</div>
        </div>
        <div style="font-size:13px;color:var(--fg);opacity:0.7">${c.subtitle}</div>
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
    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.product}</td>
        <td>${r.sku}</td>
        <td>${r.stock}</td>
        <td>
          <span style="padding:6px 10px;border-radius:12px;font-weight:700;
            background:${r.status === 'Healthy' ? 'rgba(16,185,129,0.08)' : r.status === 'Low' ? 'rgba(249,115,22,0.08)' : 'rgba(239,68,68,0.08)'};
            color:${r.status === 'Healthy' ? 'var(--success)' : r.status === 'Low' ? 'orange' : 'var(--error)'}">
            ${r.status}
          </span>
        </td>
        <td>
          <button class="btn-primary" style="padding:8px 10px;border-radius:10px;font-size:13px">View</button>
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
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Refreshing...';
    setTimeout(() => {
      // in real app: fetch('/api/summary').then(...)
      renderSummary(demoSummary);
      renderTable(demoRows);
      refreshBtn.disabled = false;
      refreshBtn.textContent = 'Refresh';
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
    alert('This is a demo. Implement add-item modal or navigation here.');
  });

})();
