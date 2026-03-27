import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

// 🔥 Get the category from the URL

const category = getParam('category');

const titleElement = document.getElementById('title');
titleElement.innerText = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;


// 🔥 STEP 1: Enter the category here as well

const dataSource = new ExternalServices(category)

const element = document.querySelector('.product-list');

const listing = new ProductList(category, dataSource, element);

listing.init();
// 🔥 Listen for changes to the sort selector
const sortElement = document.querySelector('#sortBy');

if (sortElement) {
    sortElement.addEventListener('change', (e) => {
        const selectedCriterion = e.target.value;
        if (selectedCriterion) {
            listing.sortList(selectedCriterion);
        }
    });
}