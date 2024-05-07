//axios 封装
import axios from "axios";
import { getToken } from "./token";
// 1. 根域名配置
const request = axios.create({
  baseURL: "http://localhost:8000/api/v1/", //http://localhost:8000/api/v1/
  timeout: 5000,
});
// 添加请求拦截器,请求发送之前做拦截，
request.interceptors.request.use(
  (config) => {
    //Get the token and inject
    const token = getToken();
    if (token) {
      //前面是axios固定写法，后面后端要求怎么写
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器，在响应之后拦截，重点处理返回数据
request.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export { request };
