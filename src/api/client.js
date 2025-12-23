// src/api/client.js
import axios from "axios";

// 우선적으로 env 파일부터 적용, 없을경우 실제 서버 연결
export const BASE_URL = import.meta.env.REACT_APP_API_URL || "http://a083030-team14-ALB-934362219.ap-northeast-2.elb.amazonaws.com";

const api = axios.create({
  baseURL: BASE_URL, // 백엔드 주소
});
// 필요하다면 인터셉터도 여기서 설정 가능
// api.interceptors.request.use((config) => {
//   // 토큰 붙이기 등
//   return config;
// });

export default api;
