import { Role } from '@prisma/client';
export declare class UpdateUserDto {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    dateOfBirth?: Date | null;
    role?: Role;
}
