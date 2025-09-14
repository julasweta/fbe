import type { IArea, IBranch, ICity, ITracking } from "../interfaces/INovaPosta";
import { apiService } from "./ApiServices";

const novaPoshtaService = {
  async getAreas(): Promise<IArea[]> {
    const response = await apiService.get("nova-poshta/areas");
    return response.data; // повертаємо масив областей
  },

  async getCities(areaRef?: string): Promise<ICity[]> {
    const response = await apiService.get(
      `nova-poshta/cities${areaRef ? `?areaRef=${areaRef}` : ""}`
    );
    return response.data; // повертаємо масив міст
  },

  async getBranches(cityRef: string): Promise<IBranch[]> {
    const response = await apiService.get(`nova-poshta/warehouses?cityRef=${cityRef}`);
    return response.data; // повертаємо масив відділень
  },

  async getTracking(ttn: string): Promise<ITracking> {
    const response = await apiService.get(`nova-poshta/tracking?ttn=${ttn}`);
    return response.data; // повертаємо об’єкт трекінгу
  },

 
};

export { novaPoshtaService };
