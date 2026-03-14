import { getLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || []; // Añadimos [] por si el carrito está vacío

  // 1. Si hay productos, calculamos y mostramos el total
  if (cartItems.length > 0) {
    displayCartTotal(cartItems);
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
}

// Nueva función para manejar el total
function displayCartTotal(cartItems) {
  // Calculamos la suma de todos los FinalPrice
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);

  // Seleccionamos el elemento del footer (asegúrate de que exista en tu HTML)
  const cartFooter = document.querySelector('.cart-footer');

  // Lo hacemos visible quitando la clase 'hide' (debes tenerla en tu CSS)
  cartFooter.classList.remove('hide');

  // Insertamos el total formateado a 2 decimales
  document.querySelector('.cart-total').innerText = `Total: $${total.toFixed(2)}`;
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
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

renderCartContents();
