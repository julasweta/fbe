import type { ICollection } from "../interfaces/IColection";
import { apiService } from "./ApiServices";

const API_URL = '/collections';

export const CollectionService = {
  async getAll(): Promise<ICollection[]> {
    const response = await apiService.get(API_URL);
    return response.data;
  },

  async getOne(id: number): Promise<ICollection> {
    const response = await apiService.get(`${API_URL}/${id}`);
    return response.data;
  },

  async create(data: Partial<ICollection>): Promise<ICollection> {
    const response = await apiService.post(API_URL, data);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiService.delete(`${API_URL}/${id}`);
  },
};
