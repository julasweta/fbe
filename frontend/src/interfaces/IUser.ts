export interface IUser {
  id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: string; // ISO-строка
  role?: "USER" | "ADMIN";
  createdAt?: string;
  updatedAt?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IUsersResponse {
  users: IUser[];
  total: 208;
  skip: 0;
  limit: 30;
  // можливо, є інші поля як total, page, etc.
}


export interface sendMessage{
  name: string;
  email: string;
  message: string;
}