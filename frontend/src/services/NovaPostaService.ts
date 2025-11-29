import type { INovaPoshtaOrder } from "../interfaces/INovaPoshtaOrder";
import type { IArea, IBranch, ICity } from "../interfaces/INovaPosta";
import { apiService } from "./ApiServices";

const novaPoshtaService = {
  async getAreas(): Promise<IArea[]> {
    const response = await apiService.get("nova-poshta/areas");
    return response.data; // повертаємо масив областей
  },

  async getCities(areaRef?: string): Promise<ICity[]> {
    const response = await apiService.get(
      `nova-poshta/cities${areaRef ? `?areaRef=${areaRef}` : ""}`,
    );
    return response.data; // повертаємо масив міст
  },

  async getBranches(cityRef: string): Promise<IBranch[]> {
    const response = await apiService.get(
      `nova-poshta/warehouses?cityRef=${cityRef}`,
    );
    return response.data; // повертаємо масив відділень
  },

  async getTracking(ttn: string): Promise<INovaPoshtaOrder> {
    const response = await apiService.get(`nova-poshta/tracking?ttn=${ttn}`);
    return response.data[0]; // одразу повертаємо об’єкт
  },
};

export { novaPoshtaService };
