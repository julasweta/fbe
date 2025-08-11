
export interface IUser {
  id?: number;
  name: string;
  email: string;
  role?: string;
  state?: "active" | "inactive";

  // Додаткові необов’язкові поля
  firstName?: string;
  lastName?: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  phone?: string;
  username?: string;
  password?: string;
  birthDate?: string;
  image?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: {
    color?: string;
    type?: string;
  };
  ip?: string;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    postalCode?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
    country?: string;
  };
  macAddress?: string;
  university?: string;
  bank?: {
    cardExpire?: string;
    cardNumber?: string;
    cardType?: string;
    currency?: string;
    iban?: string;
  };
  company?: {
    department?: string;
    name?: string;
    title?: string;
    address?: {
      address?: string;
      city?: string;
      state?: string;
      stateCode?: string;
      postalCode?: string;
      coordinates?: {
        lat?: number;
        lng?: number;
      };
      country?: string;
    };
  };
  ein?: string;
  ssn?: string;
  userAgent?: string;
  crypto?: {
    coin?: string;
    wallet?: string;
    network?: string;
  };
}

export interface IUsersResponse {
  users: IUser[];
  "total": 208,
  "skip": 0,
  "limit": 30
  // можливо, є інші поля як total, page, etc.
}
