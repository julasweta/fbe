"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseMapper = void 0;
class UserResponseMapper {
    static toResUserMapper(data) {
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
    static toResUsersArrayMapper(users) {
        return users.map((user) => this.toResUserMapper(user));
    }
}
exports.UserResponseMapper = UserResponseMapper;
//# sourceMappingURL=user-resp-mapper.js.map