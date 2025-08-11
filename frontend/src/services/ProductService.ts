import type { IProduct } from "../store/useProductStore";
import { apiService } from "./ApiServices";
import { useProductStore } from "../store/useProductStore";

const productService = {
  // Отримати всі продукти
  async getAll(limit = 50, skip = 0): Promise<IProduct[]> {
    console.log('ProductService: Fetching products...');

    try {
      // Ваш backend повертає масив продуктів напряму, а не обгорнутий в об'єкт
      const { data } = await apiService.get<IProduct[]>(`products?limit=${limit}&skip=${skip}`);

      console.log('ProductService: Received data:', data);

      // Перевіряємо чи data є масивом
      const products = Array.isArray(data) ? data : [];

      console.log('ProductService: Processing products:', products.length);

      useProductStore.getState().setProducts(products);
      return products;
    } catch (error) {
      console.error('ProductService: Error fetching products:', error);

      // Встановлюємо помилку в store
      useProductStore.getState().setError(
        "Не вдалося отримати список продуктів: " + (error as Error).message
      );

      throw new Error(
        "Не вдалося отримати список продуктів: " + (error as Error).message
      );
    }
  },

  // Отримати один продукт по ID
  async getById(id: number): Promise<IProduct> {
    console.log('ProductService: Fetching product by ID:', id);

    try {
      const { data } = await apiService.get<IProduct>(`products/${id}`);
      console.log('ProductService: Received product:', data);
      return data;
    } catch (error) {
      console.error('ProductService: Error fetching product:', error);
      throw new Error(
        "Не вдалося отримати продукт: " + (error as Error).message
      );
    }
  },

  // Додати продукт
  async addProduct(productData: Partial<IProduct>): Promise<IProduct> {
    console.log('ProductService: Adding product:', productData);

    try {
      const { data } = await apiService.post<IProduct>("products", productData);
      console.log('ProductService: Product added:', data);

      useProductStore.getState().addProduct(data);
      return data;
    } catch (error) {
      console.error('ProductService: Error adding product:', error);
      throw new Error(
        "Не вдалося додати продукт: " + (error as Error).message
      );
    }
  },

  // Оновити продукт
  async updateProduct(
    id: number,
    productData: Partial<IProduct>
  ): Promise<IProduct> {
    console.log('ProductService: Updating product:', id, productData);

    try {
      const { data } = await apiService.patch<IProduct>(
        `products/${id}`,
        productData
      );
      console.log('ProductService: Product updated:', data);

      useProductStore.getState().updateProduct(data);
      return data;
    } catch (error) {
      console.error('ProductService: Error updating product:', error);
      throw new Error(
        "Не вдалося оновити продукт: " + (error as Error).message
      );
    }
  },

  // Видалити продукт
  async deleteProduct(id: number): Promise<void> {
    console.log('ProductService: Deleting product:', id);

    try {
      await apiService.delete(`products/${id}`);
      console.log('ProductService: Product deleted:', id);

      useProductStore.getState().removeProduct(id);
    } catch (error) {
      console.error('ProductService: Error deleting product:', error);
      throw new Error(
        "Не вдалося видалити продукт: " + (error as Error).message
      );
    }
  },

  // Додатковий метод для тестування з'єднання
  async testConnection(): Promise<boolean> {
    try {
      await apiService.get('products?limit=1');
      console.log('ProductService: Connection test successful');
      return true;
    } catch (error) {
      console.error('ProductService: Connection test failed:', error);
      return false;
    }
  }
};

export { productService };
