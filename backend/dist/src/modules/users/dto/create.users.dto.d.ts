import { Role } from '@prisma/client';
export declare class CreateUserDto {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    dateOfBirth?: string;
    role?: Role;
    resetCode?: string;
    resetCodeExpiry?: Date;
}
