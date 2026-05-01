// /* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosBaseQuery } from "@/axios/axiosBaseQuery";

import { createApi } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tagtype";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL as string,
  }),

  tagTypes: tagTypesList,

  endpoints: () => ({}),
});

export const {} = baseApi;
