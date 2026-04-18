import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "/api";
const ASSET_BASE =
  process.env.REACT_APP_ASSET_URL ||
  (API_BASE.startsWith("http") ? API_BASE.replace(/\/?api\/?$/, "") : "");

const API = axios.create({ baseURL: API_BASE });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("newsAdmin") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default API;

export const resolveImageUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (ASSET_BASE) {
    const needsSlash = url.startsWith("/") ? "" : "/";
    return `${ASSET_BASE}${needsSlash}${url}`;
  }
  return url;
};
