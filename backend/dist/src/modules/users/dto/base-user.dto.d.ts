import { Role } from '@prisma/client';
export declare class BaseUserDto {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    password: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    postalCode?: string | null;
    dateOfBirth?: null | Date;
    role?: Role;
    accessToken?: string | null;
    refreshToken?: string | null;
}
export declare class UserForTelegram {
    id?: number | null;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    novaPostCity?: string | null;
    novaPostBranch?: string | null;
}
