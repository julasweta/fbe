import type {
  ICreateProduct,
  IProduct,
  IProductsResponse,
  ProductFilters,
} from "../interfaces/IProduct";
import { apiService } from "./ApiServices";

const productService = {
  async getAll(filters?: ProductFilters): Promise<IProduct[]> {
    const { data } = await apiService.get<IProductsResponse>(
      `products?limit=${filters?.limit}&skip=${filters?.skip}&category=${filters?.categorySlug}&collection=${filters?.collectionSlug}`,
    );
    return data.data; // тепер data — це об'єкт з ключем data
  },

  async getById(id: number): Promise<IProduct> {
    const { data } = await apiService.get<IProduct>(`products/${id}`);
    return data;
  },

  // Додатковий метод для зворотної сумісності
  async getProductById(id: number): Promise<IProduct> {
    return this.getById(id);
  },

  async addProduct(productData: ICreateProduct): Promise<IProduct> {
    const { data } = await apiService.post<IProduct>("products", productData);
    return data;
  },

  async updateProduct(
    id: number,
    productData: Partial<IProduct>,
  ): Promise<IProduct> {
    console.log("ProductService: Updating product:", id, productData);

    const { data } = await apiService.patch<IProduct>(
      `products/${id}`,
      productData,
    );
    return data;
  },

  async deleteProduct(id: number): Promise<void> {
    console.log("ProductService: Deleting product:", id);

    await apiService.delete(`products/${id}`);
  },
};

export { productService };
