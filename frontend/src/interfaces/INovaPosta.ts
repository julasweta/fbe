/* eslint-disable @typescript-eslint/no-explicit-any */
// interfaces/INovaPoshta.ts

// Область
export interface IArea {
  Ref: string;
  Description: string;
  DescriptionRu: string;
}

// Місто
export interface ICity {
  Ref: string;
  Description: string;
  DescriptionRu: string;
  Area: string;
  AreaDescription: string;
  AreaDescriptionRu: string;
}

// Відділення (коротко для UI)
export interface IBranch {
  Ref: string;
  Number: string;
  Description: string;
  ShortAddress: string;
  CityRef: string;
  CityDescription: string;
  Latitude?: string;
  Longitude?: string;
}

// ТТН
export interface ITracking {
  Number: string;
  Status: string;
  Date: string;
  WarehouseSender?: string;
  WarehouseRecipient?: string;
  [key: string]: any; // для інших полів, які приходять
}
