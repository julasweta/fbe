export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    resetCode: string;
    newPassword: string;
}
