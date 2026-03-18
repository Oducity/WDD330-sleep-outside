function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
<<<<<<< HEAD
    this.path = `../public/json/${this.category}.json`;
=======
    this.path = `/json/${this.category}.json`;
>>>>>>> 5553a8f5d13522b1bb476294cdfab37352fd96dd
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}