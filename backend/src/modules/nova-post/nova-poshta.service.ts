import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NovaPoshtaService {
  private readonly apiKey = process.env.NOVA_POSHTA_API_KEY;
  private readonly defaultCityRef = 'db5c88f5-391c-11dd-90d9-001a92567626'; // Київ

  constructor(private readonly httpService: HttpService) {}

  async getWarehouses(cityRef: string = this.defaultCityRef) {
    const body = {
      apiKey: this.apiKey,
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: { CityRef: cityRef },
    };

    try {
      const observable = this.httpService.post(
        'https://api.novaposhta.ua/v2.0/json/',
        body,
      );
      const response = await firstValueFrom(observable);

      if (!response.data.success) {
        throw new HttpException(
          response.data.errors?.join(', ') || 'Помилка від Нової Пошти',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // 🔹 Вибираємо тільки потрібні поля
      const filtered = response.data.data.map((wh: any) => ({
        Ref: wh.Ref,
        Number: wh.Number,
        CityDescription: wh.CityDescription,
        ShortAddress: wh.ShortAddress,
        Phone: wh.Phone,
        WarehouseStatus: wh.WarehouseStatus,
        PostalCodeUA: wh.PostalCodeUA,
        Longitude: wh.Longitude,
        Latitude: wh.Latitude,
      }));

      return filtered;
    } catch (error) {
      throw new HttpException(
        error.message || error || 'Не вдалося отримати дані від Нової Пошти',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAreas() {
    const body = {
      apiKey: this.apiKey,
      modelName: 'Address',
      calledMethod: 'getAreas',
      methodProperties: {},
    };

    try {
      const observable = this.httpService.post(
        'https://api.novaposhta.ua/v2.0/json/',
        body,
      );
      const response = await firstValueFrom(observable);

      if (!response.data.success) {
        throw new HttpException(
          response.data.errors?.join(', ') || 'Помилка від Нової Пошти',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data.data;
    } catch {
      throw new HttpException(
        'Не вдалося отримати дані від Нової Пошти',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCities(areaRef?: string) {
    const body = {
      apiKey: this.apiKey,
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: { AreaRef: areaRef || '' },
    };

    try {
      const observable = this.httpService.post(
        'https://api.novaposhta.ua/v2.0/json/',
        body,
      );
      const response = await firstValueFrom(observable);

      if (!response.data.success) {
        throw new HttpException(
          response.data.errors?.join(', ') || 'Помилка від Нової Пошти',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Вибираємо тільки основні дані для короткої відповіді
      const citiesShort = response.data.data.map((city: any) => ({
        Ref: city.Ref,
        Description: city.Description, // Назва міста укр
        DescriptionRu: city.DescriptionRu, // Назва міста рос
        Area: city.Area, // Область
        SettlementType: city.SettlementTypeDescription,
      }));

      return citiesShort;
    } catch {
      throw new HttpException(
        'Не вдалося отримати дані від Нової Пошти',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTrackingInfo(ttn: string) {
    const body = {
      apiKey: this.apiKey,
      modelName: 'TrackingDocument',
      calledMethod: 'getStatusDocuments',
      methodProperties: { Documents: [{ DocumentNumber: ttn }] },
    };

    try {
      const observable = this.httpService.post(
        'https://api.novaposhta.ua/v2.0/json/',
        body,
      );
      const response = await firstValueFrom(observable);

      if (!response.data.success) {
        throw new HttpException(
          response.data.errors?.join(', ') || 'Помилка від Нової Пошти',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data.data;
    } catch {
      throw new HttpException(
        'Не вдалося отримати дані від Нової Пошти',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Метод для отримання відділень за назвою міста
  async getWarehousesByCityName(cityName: string) {
    if (!cityName) {
      throw new HttpException(
        'Необхідно вказати назву міста',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 1️⃣ Знаходимо місто по назві
    const cities = await this.getCities(); // отримуємо всі міста
    const city = cities.find(
      (c: any) => c.Description.toLowerCase() === cityName.toLowerCase(),
    );

    if (!city) {
      throw new HttpException('Місто не знайдено', HttpStatus.NOT_FOUND);
    }

    // 2️⃣ Отримуємо відділення для цього міста
    const warehouses = await this.getWarehouses(city.Ref);

    return warehouses; // уже відфільтрований масив
  }
}
