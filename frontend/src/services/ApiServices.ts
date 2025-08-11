import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { authService } from "./AuthService";
import { useAuthStore } from "../store";

type IRes<DATA> = Promise<AxiosResponse<DATA>>;

const baseURL = import.meta.env.VITE_REACT_APP_API_URL;
const apiService: AxiosInstance = axios.create({ baseURL });


apiService.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    if (req.data instanceof FormData) {
      delete req.headers["Content-Type"]; 
    } else {
      req.headers["Content-Type"] = "application/json";
    }

    req.headers["Accept"] = "*/*";

    if (req.url && req.url !== "/profile/login") {
      const access = localStorage.getItem("accessToken") || null;
      if (access) {
        req.headers.Authorization = `Bearer ${access}`;
      }
    }

    return req;
  },
  (error: AxiosError) => Promise.reject(error),
);

let isRefreshing = false;
const waitList: IWaitList[] = [];

apiService.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken)
          try {
            await authService.refresh();
            isRefreshing = false;
            afterRefresh();

            if (originalRequest) {
              return apiService(originalRequest); 
            }
          } catch (e) {
            console.log("Помилка при оновленні токена:", e);
            useAuthStore.getState().logout();
            isRefreshing = false;
            console.log("Не вдалося оновити токен.");
            return Promise.reject(error);
          }
      }

      if (
        originalRequest &&
        originalRequest.url &&
        originalRequest.url.includes("/profile/token/refresh")
      ) {
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        subscribeToWaitList(() => {
          if (originalRequest) {
            resolve(apiService(originalRequest));
          } else {
            reject(new Error("Original request is undefined")); // Відхиляємо проміс, якщо `originalRequest` є `undefined`
          }
        });
      });
    }

    return Promise.reject(error);
  },
);

type IWaitList = () => void;


const subscribeToWaitList = (cb: IWaitList): void => {
  waitList.push(cb);
};


const afterRefresh = (): void => {
  console.log("Оновлення токенів успішно завершене.");
  while (waitList.length) {
    const cb = waitList.pop();
    if (cb) {
      cb(); 
    }
  }
};

export { apiService, baseURL };
export type { IRes };
