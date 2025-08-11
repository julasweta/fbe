import type { IAuth } from "../interfaces/IAuth";
import type { IRegister } from "../interfaces/IRegister";
import type { ITokens } from "../interfaces/ITokens";
import type { IUser } from "../interfaces/IUser";
import { useAuthStore } from "../store";
import { apiService, type IRes } from "./ApiServices";

const authService = {
  register: (user: IRegister): Promise<IRes<IRegister>> =>
    apiService.post("register", user),

  async login(authData: IAuth): Promise<IUser> {
    try {
      const { data } = await apiService.post<ITokens>("auth/login", authData);
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

      const { data: user } = await this.me();
      useAuthStore.getState().login(data.accessToken, data.refreshToken, user);
      return user;
    } catch (error) {
      throw new Error("Login failed: " + (error as Error).message);
    }
  },

  async refresh(): Promise<void> {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (refreshToken) {
      const { data } = await apiService.post<ITokens>("refresh", {
        refresh: refreshToken,
      });
      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
    } else {
      throw new Error("No refresh token available.");
    }
  },

  async me(): Promise<IRes<IUser>> {
    try {
      return await apiService.get("users/me");
    } catch (error) {
      if ((error as Error).message.includes("401")) {
        await this.refresh();
        return await apiService.get("me");
      }
      throw error;
    }
  },

  async updateUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const { data } = await apiService.patch<IUser>("me", userData);
      useAuthStore.getState().login(
        useAuthStore.getState().accessToken!,
        useAuthStore.getState().refreshToken!,
        data
      );
      return data;
    } catch (error) {
      throw new Error("Update failed: " + (error as Error).message);
    }
  },
};

export { authService };