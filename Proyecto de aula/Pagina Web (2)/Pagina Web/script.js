// ---------- Inicialización y helpers ----------
document.addEventListener('DOMContentLoaded', () => {
  // Elementos clave
  const cartButton = document.querySelector('.ri-shopping-cart-line') ? document.querySelector('.ri-shopping-cart-line').closest('button') : document.querySelector('.cart-btn');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const continueShopping = document.getElementById('continueShopping');
  const cartCounter = document.getElementById('cartCounter');
  const toastNotification = document.getElementById('toastNotification');
  const cartIcon = cartButton || document.querySelector('.cart-btn');
  let cartCount = parseInt(cartCounter.textContent) || 0;

  // Theme (guardar en localStorage)
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeIcon.className = 'ri-moon-line';
  } else {
    themeIcon.className = 'ri-sun-line';
  }

  // Abrir/Cerrar carrito
  if (cartButton) {
    cartButton.addEventListener('click', () => {
      cartModal.classList.remove('hidden');
    });
  }
  if (closeCart) closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));
  if (continueShopping) continueShopping.addEventListener('click', () => cartModal.classList.add('hidden'));
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) cartModal.classList.add('hidden');
    });
  }

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      if (document.body.classList.contains('dark')) {
        themeIcon.className = 'ri-moon-line';
        localStorage.setItem('theme', 'dark');
      } else {
        themeIcon.className = 'ri-sun-line';
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // ---------- Toast helpers ----------
  function showToast() {
    if (!toastNotification) return;
    toastNotification.classList.remove('hidden');
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
      toastNotification.classList.add('hidden');
    }, 3000);
  }

  function updateCartCounter() {
    cartCount++;
    cartCounter.textContent = cartCount;
    cartCounter.classList.add('pulse');
    setTimeout(() => cartCounter.classList.remove('pulse'), 600);
  }

  // Flying product animation
  function createFlyingProduct(button) {
    const productCard = button.closest('.product');
    if (!productCard) return;
    const productImage = productCard.querySelector('img');
    if (!productImage) return;
    const cartRect = cartIcon.getBoundingClientRect();
    const imageRect = productImage.getBoundingClientRect();
    const flyingImage = productImage.cloneNode(true);
    flyingImage.style.position = 'fixed';
    flyingImage.style.top = imageRect.top + 'px';
    flyingImage.style.left = imageRect.left + 'px';
    flyingImage.style.width = imageRect.width + 'px';
    flyingImage.style.height = imageRect.height + 'px';
    flyingImage.style.zIndex = '9999';
    flyingImage.style.pointerEvents = 'none';
    flyingImage.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    flyingImage.style.borderRadius = '8px';
    document.body.appendChild(flyingImage);
    setTimeout(() => {
      flyingImage.style.top = cartRect.top + 'px';
      flyingImage.style.left = cartRect.left + 'px';
      flyingImage.style.width = '20px';
      flyingImage.style.height = '20px';
      flyingImage.style.opacity = '0';
    }, 50);
    setTimeout(() => {
      try { document.body.removeChild(flyingImage); } catch(e){}
    }, 900);
  }

  // Delegate click para todos los botones "Agregar"
  document.addEventListener('click', function (e) {
    const button = e.target.closest('button');
    if (!button) return;
    const text = (button.textContent || button.innerText || '').trim();
    if (text.includes('Agregar')) {
      e.preventDefault();
      createFlyingProduct(button);
      setTimeout(() => {
        updateCartCounter();
        showToast();
      }, 400);
    }
  });

  // ---------- Quantity buttons inside cart modal ----------
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const isAdd = this.querySelector('.ri-add-line') !== null;
      const qtySpan = this.parentElement.querySelector('.qty');
      if (!qtySpan) return;
      let q = parseInt(qtySpan.textContent) || 1;
      if (isAdd) q++;
      else if (q > 1) q--;
      qtySpan.textContent = q;
    });
  });

  // ---------- Category dropdown ----------
  const categoryDropdown = document.getElementById('categoryDropdown');
  const categoryMenu = document.getElementById('categoryMenu');
  const selectedCategory = document.getElementById('selectedCategory');
  const categoryOptions = document.querySelectorAll('[data-category]');
  if (categoryDropdown && categoryMenu) {
    categoryDropdown.addEventListener('click', () => categoryMenu.classList.toggle('hidden'));
    categoryOptions.forEach(option => {
      option.addEventListener('click', function () {
        if (selectedCategory) selectedCategory.textContent = this.textContent;
        categoryMenu.classList.add('hidden');
      });
    });
    document.addEventListener('click', function (e) {
      if (!categoryDropdown.contains(e.target) && !categoryMenu.contains(e.target)) categoryMenu.classList.add('hidden');
    });
  }

  // ---------- Search & view toggle ----------
  const searchButton = document.getElementById('searchButton');
  const searchResults = document.getElementById('searchResults');
  const gridView = document.getElementById('gridView');
  const listView = document.getElementById('listView');
  const productsGrid = document.getElementById('productsGrid');
  const productsList = document.getElementById('productsList');
  const sortDropdown = document.getElementById('sortDropdown');
  const sortMenu = document.getElementById('sortMenu');
  const selectedSort = document.getElementById('selectedSort');
  const sortOptions = document.querySelectorAll('[data-sort]');

  // Si el botón buscar existe (en tu HTML original), mostrar resultados
  if (searchButton && searchResults) {
    searchButton.addEventListener('click', function () {
      searchResults.classList.remove('hidden');
      searchResults.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (gridView && listView) {
    gridView.addEventListener('click', () => {
      gridView.classList.add('active');
      listView.classList.remove('active');
      if (productsGrid) productsGrid.classList.remove('hidden');
      if (productsList) productsList.classList.add('hidden');
    });
    listView.addEventListener('click', () => {
      listView.classList.add('active');
      gridView.classList.remove('active');
      if (productsList) productsList.classList.remove('hidden');
      if (productsGrid) productsGrid.classList.add('hidden');
    });
  }

  if (sortDropdown && sortMenu) {
    sortDropdown.addEventListener('click', () => sortMenu.classList.toggle('hidden'));
    sortOptions.forEach(option => {
      option.addEventListener('click', function () {
        if (selectedSort) selectedSort.textContent = this.textContent;
        sortMenu.classList.add('hidden');
      });
    });
    document.addEventListener('click', function (e) {
      if (!sortDropdown.contains(e.target) && !sortMenu.contains(e.target)) sortMenu.classList.add('hidden');
    });
  }

  // End of DOMContentLoaded
});
