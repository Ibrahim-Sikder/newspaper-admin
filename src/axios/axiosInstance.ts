/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { authKey } from "@/constant/authkey";
import { getNewAccessToken } from "@/services/actions/auth.services";
import { setAccessToken } from "@/services/actions/setAccessToken";
import { IGenericErrorResponse, ResponseSuccessType } from "@/types";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local.storage";
import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BASE_API_URL ||
    "https://api.dailytimes24.com/api/v1",
});

instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

// Request interceptor
instance.interceptors.request.use(
  function (config) {
    // Get access token from localStorage
    const accessToken = getFromLocalStorage(authKey);

    if (accessToken) {
      // Check if token already has "Bearer " prefix
      const token = accessToken.startsWith("Bearer ")
        ? accessToken
        : `Bearer ${accessToken}`;

      config.headers.Authorization = token;
    }

    if (typeof window !== "undefined") {
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Response interceptor
instance.interceptors.response.use(
  // @ts-ignore
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    };
    return responseObject;
  },
  async function (error) {
    const config = error.config;

    // If 401 error and we haven't retried yet
    if (error?.response?.status === 401 && !config.sent) {
      config.sent = true;

      try {
        const response = await getNewAccessToken();
        const accessToken = response?.data?.accessToken;

        if (accessToken) {
          // Store the new token
          const tokenWithBearer = `Bearer ${accessToken}`;
          setToLocalStorage(authKey, tokenWithBearer);
          setAccessToken(tokenWithBearer);

          // Update the failed request with new token
          config.headers.Authorization = tokenWithBearer;

          // Retry the original request
          return instance(config);
        }
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
          localStorage.removeItem(authKey);
        }
      }
    }

    // For other errors, format response
    const responseObject: IGenericErrorResponse = {
      statusCode: error?.response?.data?.statusCode || 500,
      message: error?.response?.data?.message || "Something went wrong!!!",
      errorMessages: error?.response?.data?.message,
    };

    return Promise.reject(responseObject);
  },
);

export { instance };
