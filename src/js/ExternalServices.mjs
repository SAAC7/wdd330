// En src/js/ExternalServices.mjs

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ExternalServices {
  constructor() { }

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await response.json();
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await response.json();
    return data.Result;
  }

  // --- NEW METHOD FOR STEP 4 ---

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${baseURL}checkout`, options);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      // This will route “Invalid Card” messages to the CheckoutProcess catch block

      throw { name: "servicesError", message: data };
    }
  }
}