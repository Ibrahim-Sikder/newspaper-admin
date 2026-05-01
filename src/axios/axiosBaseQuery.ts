import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { IMeta } from "@/types";
import { instance } from "./axiosInstance";

export const axiosBaseQuery = (
  { baseUrl }: { baseUrl: string } = { baseUrl: "" }
): BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig["method"];
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    headers?: AxiosRequestConfig["headers"];
    meta?: IMeta;
    contentType?: string;
  },
  unknown,
  unknown
> =>
  async ({ url, method = "GET", data, params, headers, contentType }) => {
    try {
      const result: AxiosResponse = await instance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          "Content-Type": contentType || "application/json",
          ...headers,
        },
      });

      // Return proper RTK Query format
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      
      // Format error response for RTK Query
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };