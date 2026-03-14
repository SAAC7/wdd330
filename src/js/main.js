import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// 1. Creamos el cargador de datos para 'tents' (carpas)
const dataSource = new ProductData("tents");

// 2. Seleccionamos el elemento <ul> del HTML donde irán los productos
const element = document.querySelector(".product-list");

// 3. Creamos la lista y la inicializamos
const listing = new ProductList("tents", dataSource, element);

listing.init();
