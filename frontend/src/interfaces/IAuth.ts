export interface IAuth {
  email?: string;
  password?: string;
}

export interface IResetPasswordForm {
  email: string;
  newPassword: string;
}
