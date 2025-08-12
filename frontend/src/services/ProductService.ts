// ProductService.ts
import { apiService } from "./ApiServices";
import type { IProduct } from "../interfaces/IProduct";

const productService = {
  async getAll(limit = 50, skip = 0): Promise<IProduct[]> {
    console.log('ProductService: Fetching products...');

    const { data } = await apiService.get<IProduct[]>(`products?limit=${limit}&skip=${skip}`);
    return Array.isArray(data) ? data : [];
  },

  async getById(id: number): Promise<IProduct> {
    console.log('ProductService: Fetching product by ID:', id);

    const { data } = await apiService.get<IProduct>(`products/${id}`);
    return data;
  },

  async addProduct(productData: Partial<IProduct>): Promise<IProduct> {
    console.log('ProductService: Adding product:', productData);

    const { data } = await apiService.post<IProduct>("products", productData);
    return data;
  },

  async updateProduct(id: number, productData: Partial<IProduct>): Promise<IProduct> {
    console.log('ProductService: Updating product:', id, productData);

    const { data } = await apiService.patch<IProduct>(`products/${id}`, productData);
    return data;
  },

  async deleteProduct(id: number): Promise<void> {
    console.log('ProductService: Deleting product:', id);

    await apiService.delete(`products/${id}`);
  },

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