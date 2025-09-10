import { BaseUserDto } from './base-user.dto';
export declare class UserResponseMapper {
    static toResUserMapper(data: Partial<BaseUserDto>): Partial<BaseUserDto>;
    static toResUsersArrayMapper(users: Partial<BaseUserDto>[]): Partial<BaseUserDto>[];
}
