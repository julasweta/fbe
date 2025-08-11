import {
  Controller,
  Get,
  Param,
  Body,
  Patch,
  ParseIntPipe,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../../guards/admin.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @Get('all')
  getAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'Returns current user data' })
  @Get('me')
  me(@Req() req: Request) {
    return this.userService.findOne(req.user.id);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns user data' })
  @Get('byid/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user data by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @Patch('byid/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    if (data.role === Role.ADMIN) {
      throw new ForbiddenException('Role ADMIN cannot be assigned directly');
    }
    return this.userService.update(id, data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'), AdminGuard)
  @ApiOperation({ summary: 'Update user role by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @Patch(':id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() body: UpdateUserRoleDto,
    @Req() req: Request,
  ) {
    const userId = Number(id);

    if (req.user.id === userId) {
      throw new ForbiddenException('Admin cannot change their own role');
    }

    if (body.role === Role.ADMIN) {
      throw new ForbiddenException('Role ADMIN cannot be assigned directly');
    }

    return this.userService.updateRole(userId, body.role);
  }
}
