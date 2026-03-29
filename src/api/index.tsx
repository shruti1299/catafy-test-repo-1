import axios from "axios";
import API_BASE_URL from "./api_base_url";
import { getToken } from "@/utils/get-token";
import { autoErrorHandle } from "./autoErrorHandle";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export const authorizeApi = (token:string) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

api.interceptors.request.use(
    async (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle responses and errors globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        autoErrorHandle(error)
        return Promise.reject(error);
    }
);

export default api;
