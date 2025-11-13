const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const menu = document.getElementById('menu');

function buildMenu() {
  menu.innerHTML = '';
  const home = document.createElement('a'); home.href='/'; home.textContent='Home'; menu.appendChild(home);
  const products = document.createElement('a'); products.href='/products.html'; products.textContent='Products'; menu.appendChild(products);
  const dash = document.createElement('a'); dash.href='/dashboard.html'; dash.textContent='Dashboard'; 
  // show dashboard only to managers
  if (role === 'MANAGER') menu.appendChild(dash);
  const logout = document.createElement('a'); logout.href='#'; logout.textContent='Logout';
  logout.addEventListener('click', async ()=>{
    await fetch('/auth/logout', {method:'POST', headers: {'Authorization':'Bearer '+token}});
    localStorage.clear();
    window.location.href='/';
  });
  menu.appendChild(logout);
}
buildMenu();

if (!token) {
  document.getElementById('alerts').textContent = 'You must login to access products. Redirecting to login...';
  setTimeout(()=> window.location.href='/', 1000);
}

async function fetchProducts(){
  const res = await fetch('/products', {headers: {'Authorization':'Bearer '+token}});
  if (!res.ok) {
    const j = await res.json();
    document.getElementById('alerts').textContent = j.error || 'Failed';
    return;
  }
  const list = await res.json();
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML='';
  list.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>${p.category}</td><td>${p.quantity}</td><td>${p.price}</td><td></td>`;
    const actions = tr.querySelector('td:last-child');
    const edit = document.createElement('button'); edit.textContent='Edit';
    edit.addEventListener('click', ()=> openModal('edit', p));
    actions.appendChild(edit);
    tbody.appendChild(tr);
  });
}

fetchProducts();

const modal = document.getElementById('productModal');
const addBtn = document.getElementById('addBtn');
const closeModal = document.getElementById('closeModal');
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
    document.getElementById('pqty').value = 0;
    document.getElementById('pprice').value = 0;
  }
}

addBtn.addEventListener('click', ()=> openModal('add'));
closeModal.addEventListener('click', ()=> modal.classList.add('hidden'));

saveBtn.addEventListener('click', async ()=>{
  const p = {
    name: document.getElementById('pname').value,
    category: document.getElementById('pcat').value,
    quantity: parseInt(document.getElementById('pqty').value)||0,
    price: parseFloat(document.getElementById('pprice').value)||0
  };
  const headers = {'Content-Type':'application/json','Authorization':'Bearer '+token};
  let res;
  if (editId) {
    res = await fetch('/products/' + editId, {method:'PUT', headers, body: JSON.stringify(p)});
  } else {
    res = await fetch('/products', {method:'POST', headers, body: JSON.stringify(p)});
  }
  if (!res.ok) {
    const j = await res.json();
    alert(j.error || 'Failed');
  } else {
    modal.classList.add('hidden');
    fetchProducts();
  }
});
