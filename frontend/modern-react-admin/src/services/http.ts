import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 默认配置
const defaultConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 创建axios实例
const http: AxiosInstance = axios.create(defaultConfig);

// 请求拦截器
http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 清除token并重定向到登录页
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
          break;
        case 403:
          // 无权限
          window.location.href = '/403';
          break;
        case 404:
          // 资源不存在
          break;
        case 500:
          // 服务器错误
          break;
        default:
          // 其他错误
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default http; 