import { loadHeaderFooter, getLocalStorage, updateCartCount, setLocalStorage } from './utils.mjs';

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];

  if (cartItems.length > 0) {
    displayCartTotal(cartItems);

    // 🔥 AÑADIR AQUÍ: Listener para el botón de Checkout
    const checkoutBtn = document.getElementById('checkoutButton');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        window.location.href = '../checkout/index.html';
      });
    }
  } else {
    // Opcional: Volver a ocultar si el carrito se vacía
    document.querySelector('.cart-footer').classList.add('hide');
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  // Listeners para eliminar items
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', removeItemFromCart);
  });

  // botones +
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', changeQuantity);
  });

  // botones -
  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', changeQuantity);
  });
}

function displayCartTotal(cartItems) {
  const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 0);
  const cartFooter = document.querySelector('.cart-footer');
  cartFooter.classList.remove('hide');

  document.querySelector('.cart-total').innerText =
    `Total: $${total.toFixed(2)}`;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">

  <span class="remove-item" data-id="${item.Id}">❌</span>

  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">
  <button class="decrease" data-id="${item.Id}">-</button>
  <span>${item.quantity || 1}</span>
  <button class="increase" data-id="${item.Id}">+</button>
</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
  return newItem;
}

function removeItemFromCart(event) {
  const id = event.target.dataset.id;

  let cart = getLocalStorage('so-cart') || [];

  const item = cart.find(item => item.Id == id);

  if (item) {
    if ((item.quantity || 1) > 1) {
      item.quantity -= 1;
    } else {
      cart = cart.filter(item => item.Id != id);
    }
  }

  setLocalStorage('so-cart', cart);
  updateCartCount();
  renderCartContents();
}


function changeQuantity(event) {
  const id = event.target.dataset.id;
  const isIncrease = event.target.classList.contains('increase');

  let cart = getLocalStorage('so-cart') || [];

  const item = cart.find(item => item.Id == id);

  if (!item) return;

  if (isIncrease) {
    item.quantity += 1;
  } else {
    item.quantity -= 1;

    // si llega a 0, eliminar
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.Id != id);
    }
  }

  setLocalStorage('so-cart', cart);
  updateCartCount();
  renderCartContents(); // 🔥 re-render
}

renderCartContents();
