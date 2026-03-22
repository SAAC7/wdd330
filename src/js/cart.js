import { getLocalStorage } from './utils.mjs';
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];

  if (cartItems.length > 0) {
    displayCartTotal(cartItems);
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  // 🔥 agregar listeners aquí
  const removeButtons = document.querySelectorAll('.remove-item');

  removeButtons.forEach(btn => {
    btn.addEventListener('click', removeItemFromCart);
  });
}

function displayCartTotal(cartItems) {
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
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
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
  return newItem;
}

function removeItemFromCart(event) {
  const id = event.target.dataset.id;

  let cart = getLocalStorage('so-cart') || [];

  // 🔥 encontrar solo UNA coincidencia
  const index = cart.findIndex(item => item.Id == id);

  if (index !== -1) {
    cart.splice(index, 1); // elimina SOLO uno
  }

  localStorage.setItem('so-cart', JSON.stringify(cart));

  renderCartContents();
}
renderCartContents();