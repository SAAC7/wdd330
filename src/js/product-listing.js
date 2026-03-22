import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

// 🔥 obtiene category desde URL
const category = getParam('category');

const titleElement = document.getElementById('title');
titleElement.innerText = `Top Products: ${category.charAt(0).toUpperCase() + category.slice(1)}`;


// data source
const dataSource = new ProductData();

// elemento
const element = document.querySelector('.product-list');

// lista dinámica
const listing = new ProductList(category, dataSource, element);

listing.init();