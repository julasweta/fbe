export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  CUSTOMER = "CUSTOMER",
}

export interface IRegister {
  first_name: string;
  last_name: string;
  email?: string;
  role?: Role;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  dateOfBirth?: Date | string;
  isActive?: boolean;
  isVerified?: boolean;
  isBlocked?: boolean;
  isDeleted?: boolean;
  avatar?: string;
}
