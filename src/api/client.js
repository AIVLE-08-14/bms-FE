// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080", // 백엔드 주소
});

// 필요하다면 인터셉터도 여기서 설정 가능
// api.interceptors.request.use((config) => {
//   // 토큰 붙이기 등
//   return config;
// });

export default api;
