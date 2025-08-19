export interface ICartItem {
  id?: number;
  productId: number;
  name: string;
  price: number;
  priceSale?: number;
  color: string;
  size: string;
  quantity: number;
  image?: string;
  finalPrice?: number;
}

export interface ICartResponse {
  id: number;
  userId: number | null;
  sessionId: string | null;
  guestId: number | null;
  updatedAt: string;
  items: ICartItem[];
}
