import axios from 'axios';
import {RootState, store} from "@/store/store";
import {updateUser} from "@/store/slices/auth-slice";
import RefreshTokenDTO from "@/DTOs/refresh-token-dto";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    withCredentials: true,
});

// === Добавляем токен в каждый запрос ===
api.interceptors.request.use(
    (config) => {
        const state: RootState = store.getState();
        const token = state.user.token;

        if (!config.url?.includes('/login') && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// === Очередь запросов во время обновления токена ===
let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

// === Перехват ошибок и обновление токена ===
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: unknown) => {
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            resolve(api(originalRequest));
                        },
                        reject: (err) => reject(err),
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const state: RootState = store.getState();
                const token: string = state.user.token ?? "";

                const refreshTokenDto: RefreshTokenDTO = {
                    token: token,
                };

                const response = await api.post("/auth/refresh-token", refreshTokenDto, {
                    withCredentials: true,
                });

                store.dispatch(updateUser(response.data));

                processQueue(null, response.data.token);

                originalRequest.headers["Authorization"] = "Bearer " + response.data.token;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
