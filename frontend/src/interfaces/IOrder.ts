import { EColor, ESize, type IProduct } from "./IProduct";

export interface IOrderItem {
  id: number;
  productId: number | null;
  name: string;
  image?: string | null;
  quantity: number;
  price: number;
  priceSale?: number | null;
  finalPrice: number;
  color?: EColor | null;
  size?: ESize | null;
  product?: IProduct;
  trackingNumber?: string;
}

export interface IOrderResponse {
  id: number;
  userId?: number | null;
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  guestAddress?: string | null;
  novaPostCity?: string | null;
  novaPostBranch?: string | null;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: IOrderItem[];
  trackingNumber?: string;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}
