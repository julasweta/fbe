import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { NovaPoshtaService } from './nova-poshta.service';

@ApiTags('Nova Poshta')
@Controller('nova-poshta')
export class NovaPoshtaController {
  constructor(private readonly npService: NovaPoshtaService) {}

  @Get('warehouses')
  @ApiOperation({ summary: 'Отримати список відділень' })
  @ApiQuery({
    name: 'cityRef',
    required: false,
    description: 'Ref міста з довідника Нової Пошти',
  })
  @ApiResponse({ status: 200, description: 'Список відділень' })
  async getWarehouses(@Query('cityRef') cityRef?: string) {
    return this.npService.getWarehouses(cityRef);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Отримати список міст' })
  @ApiQuery({
    name: 'areaRef',
    required: false,
    description: 'Ref області для фільтру',
  })
  @ApiResponse({ status: 200, description: 'Список міст' })
  async getCities(@Query('areaRef') areaRef?: string) {
    return this.npService.getCities(areaRef);
  }

  @Get('areas')
  @ApiOperation({ summary: 'Отримати список областей' })
  @ApiResponse({ status: 200, description: 'Список областей' })
  async getAreas() {
    return this.npService.getAreas();
  }

  @Get('tracking')
  @ApiOperation({ summary: 'Отримати інформацію про відправлення (ТТН)' })
  @ApiQuery({
    name: 'ttn',
    required: true,
    description: 'Номер ТТН відправлення',
  })
  @ApiResponse({ status: 200, description: 'Інформація про відправлення' })
  async getTracking(@Query('ttn') ttn: string) {
    if (!ttn) {
      return { error: 'Необхідно вказати номер ТТН (ttn)' };
    }
    return this.npService.getTrackingInfo(ttn);
  }

  // 🔹 GET /nova-poshta/warehouses-by-city?cityName=Львів
  @Get('warehouses-by-city')
  @ApiOperation({ summary: 'Отримати відділення за назвою міста' })
  @ApiQuery({
    name: 'cityName',
    required: true,
    description: 'Назва міста українською',
  })
  @ApiResponse({ status: 200, description: 'Список відділень міста' })
  async getWarehousesByCityName(@Query('cityName') cityName: string) {
    return await this.npService.getWarehousesByCityName(cityName);
  }
}
