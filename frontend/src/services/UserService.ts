import type { IUser, IUsersResponse, sendMessage } from "../interfaces/IUser";
import { apiService } from "./ApiServices";
import { useUserStore } from "../store/useUserStore";

const userService = {
  // Отримати всіх користувачів
  async getAll(): Promise<IUser[]> {
    try {
      const { data } = await apiService.get<IUsersResponse>(
        "users?limit=10&skip=0",
      );
      useUserStore.getState().setUsers(data.users);
      return data.users;
    } catch (error) {
      throw new Error(
        "Не вдалося отримати список користувачів: " + (error as Error).message,
      );
    }
  },

  // Отримати одного користувача по ID
  async getById(id: number): Promise<IUser> {
    try {
      const { data } = await apiService.get<IUser>(`users/${id}`);
      return data;
    } catch (error) {
      throw new Error(
        "Не вдалося отримати користувача: " + (error as Error).message,
      );
    }
  },

  // Оновити користувача
  async updateUser(id: number, userData: Partial<IUser>): Promise<IUser> {
    try {
      const { data } = await apiService.patch<IUser>(`users/${id}`, userData);
      useUserStore.getState().updateUserInStore(data);
      return data;
    } catch (error) {
      throw new Error(
        "Не вдалося оновити користувача: " + (error as Error).message,
      );
    }
  },

  async sendMessageFromContact(data: sendMessage): Promise<void> {
    try {
      await apiService.post<sendMessage>(`telegram/message`, data);
    } catch (error) {
      throw new Error(
        "Не вдалося відправити повідомлення: " + (error as Error).message,
      );
    }
  },

  // Видалити користувача
  async deleteUser(id: number): Promise<void> {
    try {
      await apiService.delete(`users/${id}`);
      useUserStore.getState().removeUser(id);
    } catch (error) {
      throw new Error(
        "Не вдалося видалити користувача: " + (error as Error).message,
      );
    }
  },
};

export { userService };
