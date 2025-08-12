import { BaseUserDto } from './base-user.dto';

export class UserResponseMapper {
  static toResUserMapper(data: Partial<BaseUserDto>): Partial<BaseUserDto> {
    return {
      id: data?.id,
      email: data?.email,
      role: data?.role,
      first_name: data?.first_name,
      last_name: data?.last_name,
      phone: data?.phone,
      address: data?.address,
      city: data?.city,
      country: data?.country,
      postalCode: data?.postalCode,
      dateOfBirth: data?.dateOfBirth,
    };
  }

  static toResUsersArrayMapper(
    users: Partial<BaseUserDto>[],
  ): Partial<BaseUserDto>[] {
    return users.map((user) => this.toResUserMapper(user));
  }
}
