import { loadHeaderFooter } from './utils.mjs';
import Alert from './alert.js';

const alerts = new Alert('../json/alerts.json');
alerts.init();

loadHeaderFooter();