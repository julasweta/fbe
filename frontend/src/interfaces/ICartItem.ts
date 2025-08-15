export interface ICartItem {
  productId: number;
  name: string;
  price: number;
  priceSale?: number;
  color: string;
  size: string;
  quantity: number;
  image?: string;
}