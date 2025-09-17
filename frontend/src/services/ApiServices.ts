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

/* ---------- REQUEST INTERCEPTOR ---------- */
apiService.interceptors.request.use(
  (req: InternalAxiosRequestConfig) => {
    if (req.data instanceof FormData) {
      delete req.headers["Content-Type"];
    } else {
      req.headers["Content-Type"] = "application/json";
    }

    req.headers["Accept"] = "*/*";

    // додаємо токен тільки якщо це не login/register
    if (
      req.url &&
      !req.url.includes("auth/login") &&
      !req.url.includes("auth/register") &&
      !req.url.includes("auth/refresh")
    ) {
      const access = localStorage.getItem("accessToken");
      if (access) {
        req.headers.Authorization = `Bearer ${access}`;
      }
    }

    return req;
  },
  (error: AxiosError) => Promise.reject(error),
);

/* ---------- RESPONSE INTERCEPTOR ---------- */
let isRefreshing = false;
const waitList: IWaitList[] = [];

apiService.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Якщо 401 і це не auth запити → пробуємо refresh
    if (
      error.response?.status === 401 &&
      originalRequest?.url &&
      !originalRequest.url.includes("auth/login") &&
      !originalRequest.url.includes("auth/register") &&
      !originalRequest.url.includes("auth/refresh")
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            await authService.refresh(); // оновлюємо токени
            isRefreshing = false;
            afterRefresh();

            // повторюємо оригінальний запит
            if (originalRequest.headers) {
              const newAccess = localStorage.getItem("accessToken");
              if (newAccess) {
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
              }
            }

            return apiService(originalRequest);
          } catch (e) {
            console.error("Помилка при оновленні токена:", e);
            useAuthStore.getState().logout();
            isRefreshing = false;
            return Promise.reject(error);
          }
        } else {
          isRefreshing = false;
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      }

      // Якщо refresh вже йде → чекаємо його завершення
      return new Promise((resolve, reject) => {
        subscribeToWaitList(() => {
          if (originalRequest) {
            const newAccess = localStorage.getItem("accessToken");
            if (newAccess && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            }
            resolve(apiService(originalRequest));
          } else {
            reject(new Error("Original request is undefined"));
          }
        });
      });
    }

    return Promise.reject(error);
  },
);

/* ---------- HELPERS ---------- */
type IWaitList = () => void;

const subscribeToWaitList = (cb: IWaitList): void => {
  waitList.push(cb);
};

const afterRefresh = (): void => {
  console.log("✅ Токени успішно оновлені");
  while (waitList.length) {
    const cb = waitList.pop();
    if (cb) cb();
  }
};

export { apiService, baseURL };
export type { IRes };
