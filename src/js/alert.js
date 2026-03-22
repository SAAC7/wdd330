export default class Alert {
  constructor(url) {
    this.url = url;
  }

  async init() {
    const alerts = await this.loadAlerts();

    if (alerts.length > 0) {
      this.renderAlerts(alerts);
    }
  }

  async loadAlerts() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      return data;
    } catch (error) {
      // console.error('Error loading alerts:', error);
      this.renderAlerts('Error loading alerts:', error);
      return [];
    }
  }

  renderAlerts(alerts) {
    const section = document.createElement('section');
    section.classList.add('alert-list');

    alerts.forEach(alert => {
      const p = document.createElement('p');
      p.textContent = alert.message;

      // aplicar estilos desde JSON
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;
      p.style.padding = '10px';
      p.style.margin = '0';

      section.appendChild(p);
    });

    // 🔥 insertar antes del main
    const main = document.querySelector('main');
    main.prepend(section);
  }
}