// Products Module
class ProductManager {
  constructor() {
    this.products = [];
    this.loading = false;
  }

  async fetchProducts(filters = {}) {
    this.loading = true;
    try {
      const response = await api.getProducts(filters);
      this.products = response.data || [];
      return this.products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  async getProduct(id) {
    try {
      const response = await api.getProduct(id);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  }

  getProducts() {
    return this.products;
  }

  isLoading() {
    return this.loading;
  }
}

export const products = new ProductManager();
