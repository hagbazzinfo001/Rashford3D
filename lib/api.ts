// lib/api.ts
import axios from "axios";

// const api = axios.create({
//   baseURL: "http://rashroff3decommerce.somee.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
const api = axios.create({
  baseURL: "/api-proxy", // instead of the full API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
