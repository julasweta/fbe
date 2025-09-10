import { UsersService } from './users.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getAll(): Promise<Partial<import("./dto/base-user.dto").BaseUserDto>[]>;
    me(req: Request): Promise<Partial<import("./dto/base-user.dto").BaseUserDto>>;
    getById(id: number): Promise<Partial<import("./dto/base-user.dto").BaseUserDto>>;
    update(id: number, data: UpdateUserDto): Promise<Partial<import("./dto/base-user.dto").BaseUserDto>>;
    updateUserRole(id: string, body: UpdateUserRoleDto, req: Request): Promise<Partial<import("./dto/base-user.dto").BaseUserDto>>;
}
