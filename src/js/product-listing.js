import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam, renderBreadcrumbs } from './utils.mjs'; // 🔥 Añadido renderBreadcrumbs

loadHeaderFooter();

const category = getParam('category');

const titleElement = document.getElementById('title');
titleElement.innerText = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;

const dataSource = new ExternalServices(category);
const element = document.querySelector('.product-list');

const listing = new ProductList(category, dataSource, element);

// Modificamos esta parte para capturar los datos y renderizar breadcrumbs
async function initListing() {
    await listing.init();

    // Obtenemos la lista de productos para saber cuántos hay
    const products = await dataSource.getData(category);

    // 🔥 PASO 2: Renderizar los Breadcrumbs
    renderBreadcrumbs(category, products.length);
}

initListing();

// Escuchador para el ordenamiento (se mantiene igual)
const sortElement = document.querySelector('#sortBy');
if (sortElement) {
    sortElement.addEventListener('change', (e) => {
        const selectedCriterion = e.target.value;
        if (selectedCriterion) {
            listing.sortList(selectedCriterion);
        }
    });
}