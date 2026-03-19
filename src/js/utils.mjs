// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
// helper to get parameter from URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}


// function to the cart

export function getCartCount() {
  const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  return cart.length;
}

export function updateCartCount() {
  const count = getCartCount();
  const cartIcon = document.querySelector(".cart");

  if (!cartIcon) return;

  // delete existing badge if it exists
  const existing = cartIcon.querySelector(".cart-count");
  if (existing) existing.remove();

  if (count > 0) {
    const badge = document.createElement("span");
    badge.classList.add("cart-count");
    badge.textContent = count;

    cartIcon.appendChild(badge);
  }
}

// renderWithTemplate
export function renderWithTemplate(template, parentElement, data = null, callback = null) {
  parentElement.innerHTML = template;
  if (callback) callback(data);
}
// loadTemplate
export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${response.status} ${response.statusText}`);
  }
  return await response.text();
}
// loadHeaderFooter
export async function loadHeaderFooter() {
  try {

    const headerTemplate = await loadTemplate("/src/public/partials/header.html");
    const footerTemplate = await loadTemplate("/src/public/partials/footer.html");
    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");
    if (headerElement) {
      headerElement.innerHTML = headerTemplate;
    }
    if (footerElement) {
      footerElement.innerHTML = footerTemplate;
    }

  } catch (error) {
    console.error("Error loading header/footer:", error);
  }

}