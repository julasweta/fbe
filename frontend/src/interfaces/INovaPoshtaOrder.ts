export interface INovaPoshtaOrder {
  Number: string;
  StatusCode: string;
  Status: string;
  DateCreated: string;
  CitySender: string;
  WarehouseSender: string;
  CityRecipient: string;
  WarehouseRecipient: string;
  WarehouseRecipientNumber: number;
  WarehouseRecipientRef: string;
  DocumentCost: string;
  PaymentMethod: string;
  CargoType: string;
  CargoDescriptionString: string;
  DocumentWeight: number;
  SeatsAmount: string;
  ScheduledDeliveryDate: string;
  TrackingUpdateDate: string;
  // додаткові поля
  RefEW?: string;
  RefCitySender?: string;
  RefSettlementSender?: string;
  RefCityRecipient?: string;
  RefSettlementRecipient?: string;
  RecipientDateTime?: string;
  OwnerDocumentNumber?: string;
  OwnerDocumentType?: string;
  FactualWeight?: string;
  VolumeWeight?: string;
}
