import axios from "axios";
import { useUserStore } from "@/stores/user";
import router from "@/router";
import { refreshTokenApi } from "./auth";
import { ElMessage } from "element-plus";
export const uploadUrl = import.meta.env.DEV
  ? "http://192.168.32.19:9000"
  : "https://线上地址待定";
// export const uploadUrl = import.meta.env.DEV
//   ? "http://192.168.31.97:9000"
//   : "https://线上地址待定";
export const socketUrl = import.meta.env.DEV
  ? "http://localhost:3000"
  : "wss://线上地址待定";
export const timeout = 50000;
// server服务端接口
export const serverApi = axios.create({
  baseURL: "/api/v1",
  timeout,
});

// 请求拦截器
serverApi.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.getAccessToken) {
    config.headers["Authorization"] = `Bearer ${userStore.getAccessToken}`;
  }
  return config;
});

let isRefreshing = false; // 是否正在刷新token
let requestQueue: ((newAccessToken: string) => void)[] = []; // 存储失败的请求
// 响应拦截器
serverApi.interceptors.response.use(
  (res) => {
    return res.data;
  },
  async (error) => {
    if (error.code === "ERR_NETWORK") {
      ElMessage.error("网络错误，请检查网络是否正常");
      return Promise.reject(error);
    }
    if (error.response.status !== 401) {
      ElMessage.error("服务器异常，请稍后再试");
      return Promise.reject(error);
    }
    const userStore = useUserStore();
    const accessToken = userStore.getAccessToken;
    const refreshToken = userStore.getRefreshToken;
    const originalRequest = error.config; // 读取原始请求配置
    if (!accessToken || !refreshToken) {
      ElMessage.error("登录过期，请重新登录");
      userStore.logout();
      router.replace("/");
      return Promise.reject(error);
    }
    if (isRefreshing) {
      return new Promise((resolve) => {
        requestQueue.push((newAccessToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(serverApi(originalRequest));
        });
      });
    }
    isRefreshing = true;
    try {
      const newToken = await refreshTokenApi({ refreshToken });
      if (newToken.success) {
        userStore.updateToken(newToken.data);
      } else {
        ElMessage.error("登录过期，请重新登录");
        userStore.logout();
        router.replace("/");
        return Promise.reject(error);
      }
      const newAccessToken = newToken.data.accessToken;
      requestQueue.forEach((callback) => callback(newAccessToken));
      return serverApi(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      requestQueue = [];
      isRefreshing = false;
    }
  },
);

// ai服务端接口
export const aiApi = axios.create({
  baseURL: "/ai/v1",
  timeout,
});

// 响应拦截器
aiApi.interceptors.response.use((res) => {
  return res.data;
});

export interface Response<T = any> {
  timestamp: string;
  path: string;
  message: string;
  code: number;
  success: boolean;
  data: T;
}
