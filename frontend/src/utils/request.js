
import axios from "axios";
import { getToken } from "./token";

const request = axios.create({
  baseURL: "http://localhost:8000/api/v1/", //http://localhost:8000/api/v1/
  timeout: 9999999,
});

request.interceptors.request.use(
  (config) => {
    //Get the token and inject
    const token = getToken();
    if (token) {
 
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


request.interceptors.response.use(
  (response) => {
  
    return response.data;
  },
  (error) => {
 
    return Promise.reject(error);
  }
);

export { request };
