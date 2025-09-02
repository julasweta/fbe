import type { ICategory, ICreateCategory } from "../interfaces/ICategory";
import { apiService } from "./ApiServices";

const API_URL = "/categories";

export const CategoryService = {
  async getAll(): Promise<ICategory[]> {
    const response = await apiService.get<ICategory[]>(API_URL);
    return response.data;
  },

  async getOne(id: number): Promise<ICategory> {
    const response = await apiService.get(`${API_URL}/${id}`);
    return response.data;
  },

  async create(data: ICreateCategory): Promise<ICategory> {
    const response = await apiService.post(API_URL, data);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiService.delete(`${API_URL}/${id}`);
  },

  async update(id: number, data: Partial<ICategory>): Promise<ICategory> {
    const response = await apiService.patch(`${API_URL}/${id}`, data);
    return response.data;
  },
};
