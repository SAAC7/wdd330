import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

// 🔥 obtiene category desde URL
const category = getParam('category');

const titleElement = document.getElementById('title');
titleElement.innerText = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;


// 🔥 PASO 1: Pasa la categoría aquí también
const dataSource = new ExternalServices(category)

// elemento
const element = document.querySelector('.product-list');

// lista dinámica
const listing = new ProductList(category, dataSource, element);

listing.init();
// 🔥 Escucha el cambio en el selector de ordenamiento
const sortElement = document.querySelector('#sortBy');

if (sortElement) {
    sortElement.addEventListener('change', (e) => {
        const selectedCriterion = e.target.value;
        if (selectedCriterion) {
            listing.sortList(selectedCriterion);
        }
    });
}