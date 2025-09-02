import type { IAuth } from "../interfaces/IAuth";
import type { ITokens } from "../interfaces/ITokens";
import type { IUser } from "../interfaces/IUser";
import { useAuthStore } from "../store";
import { apiService, type IRes } from "./ApiServices";

const authService = {
  register: (user: IUser): Promise<IRes<IUser>> =>
    apiService.post("auth/register", user),

  async login(authData: IAuth): Promise<IUser> {
    console.log("[AuthService] login() called with:", authData.email);

    let data: ITokens;

    try {
      console.log("[AuthService] Sending login request to /auth/login");
      const res = await apiService.post<ITokens>("auth/login", authData);
      console.log("[AuthService] /auth/login response:", res);
      data = res.data;
    } catch (error: any) {
      console.error("[AuthService] Error during /auth/login request:", error);
      console.error("[AuthService] Error response:", error?.response?.data);
      console.error("[AuthService] Error status:", error?.response?.status);

      // Детальна обробка помилок
      if (error?.response) {
        const status = error.response.status;
        const responseData = error.response.data || {};

        console.log("[AuthService] Processing error - status:", status);
        console.log("[AuthService] Response data:", responseData);

        if (status === 401) {
          // Пріоритет: message > error > стандартне повідомлення
          let message = "Неправильний email або пароль";

          if (typeof responseData === "string") {
            message = responseData;
          } else if (
            responseData.message &&
            typeof responseData.message === "string"
          ) {
            message = responseData.message;
          } else if (
            responseData.error &&
            typeof responseData.error === "string"
          ) {
            message = responseData.error;
          } else if (
            responseData.detail &&
            typeof responseData.detail === "string"
          ) {
            message = responseData.detail;
          }

          console.log(
            "[AuthService] Throwing 401 error with message:",
            message,
          );
          throw new Error(message);
        }

        if (status === 400) {
          let message = "Некоректні дані входу";

          if (typeof responseData === "string") {
            message = responseData;
          } else if (
            responseData.message &&
            typeof responseData.message === "string"
          ) {
            message = responseData.message;
          } else if (
            responseData.error &&
            typeof responseData.error === "string"
          ) {
            message = responseData.error;
          }

          throw new Error(message);
        }

        // Для інших статусів
        if (responseData.message && typeof responseData.message === "string") {
          throw new Error(responseData.message);
        } else if (
          responseData.error &&
          typeof responseData.error === "string"
        ) {
          throw new Error(responseData.error);
        }
      }

      // Якщо це вже Error об'єкт
      if (error instanceof Error) {
        throw error;
      }

      // Останній варіант - загальна помилка
      throw new Error("Помилка під час входу");
    }

    // Якщо токени є — зберігаємо
    console.log("[AuthService] Tokens received:", data);

    if (!data.accessToken || !data.refreshToken) {
      console.error("[AuthService] Missing tokens in response");
      throw new Error("Сервер не повернув токени авторизації");
    }

    console.log("[AuthService] Saving tokens to store");
    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

    // Тепер пробуємо отримати користувача
    try {
      console.log("[AuthService] Fetching current user with this.me()");
      const { data: user } = await this.me();
      console.log("[AuthService] User fetched successfully:", user);

      console.log("[AuthService] Saving user to store");
      useAuthStore.getState().login(data.accessToken, data.refreshToken, user);

      console.log("[AuthService] login() completed successfully");
      return user;
    } catch (error) {
      console.error("[AuthService] Failed to fetch user after login:", error);
      useAuthStore.getState().logout();
      throw new Error("Не вдалося отримати дані користувача");
    }
  },
  async refresh(): Promise<void> {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) throw new Error("Токен оновлення відсутній");

    try {
      const { data } = await apiService.post<ITokens>("auth/refresh", {
        refresh: refreshToken,
      });

      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Сервер не повернув нові токени");
      }

      useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
    } catch {
      useAuthStore.getState().logout();
      throw new Error("Сесія закінчилася. Увійдіть знову");
    }
  },

  async me(): Promise<IRes<IUser>> {
    try {
      return await apiService.get("users/me");
    } catch (error: any) {
      if (error?.response?.status === 401) {
        try {
          await this.refresh();
          return await apiService.get("users/me");
        } catch {
          useAuthStore.getState().logout();
          throw new Error("Сесія закінчилася. Увійдіть знову");
        }
      }
      throw error;
    }
  },

  async updateUser(userData: Partial<IUser>, id: number): Promise<IUser> {
    try {
      const { data } = await apiService.patch<IUser>(
        `users/update/${id}`,
        userData,
      );
      const state = useAuthStore.getState();

      if (state.accessToken && state.refreshToken) {
        useAuthStore
          .getState()
          .login(state.accessToken, state.refreshToken, data);
      }
      return data;
    } catch (error: any) {
      throw new Error(
        error ? error.response.data.error.message : "Помилка оновлення профілю",
      );
    }
  },

  async logout(): Promise<void> {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (refreshToken) {
      try {
        await apiService.post("auth/logout", { refresh: refreshToken });
      } catch {
        // ігноруємо помилку серверного logout
      }
    }
    useAuthStore.getState().logout();
  },

  async forgotPassword(email: string) {
    try {
      await apiService.post("auth/forgot-password", { email: email });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Помилка оновлення",
      );
    }
  },

  async resetPassword(email: string, resetCode: string, password: string) {
    const data = {
      email,
      resetCode,
      newPassword: password,
    };
    try {
      await apiService.post("auth/reset-password", data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Помилка оновлення",
      );
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const data = {
      currentPassword,
      newPassword,
    };

    try {
      await apiService.post("auth/change-password", data);
    } catch (error: any) {
      throw new Error(
        error ? error.response.data.error.message : "Помилка оновлення",
      );
    }
  },
};

export { authService };
