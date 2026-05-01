/* eslint-disable @typescript-eslint/no-explicit-any */
import { TQueryParam } from "@/types/api.types";
import { baseApi } from "../api/baseApi";

const epaperApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEpaper: builder.mutation({
      query: (data) => ({
        url: "/epapers",
        method: "POST",
        data,
      }),
      invalidatesTags: ["epaper"],
    }),

    getAllEpapers: builder.query<any, TQueryParam[] | void>({
      query: (args) => {
        const queryParams = new URLSearchParams();

        if (args && Array.isArray(args)) {
          args.forEach((item: TQueryParam) => {
            if (
              item.value !== undefined &&
              item.value !== null &&
              item.value !== ""
            ) {
              queryParams.append(item.name, String(item.value));
            }
          });
        }

        const queryString = queryParams.toString();
        const url = queryString ? `/epapers?${queryString}` : "/epapers";

        return {
          url: url,
          method: "GET",
        };
      },

      transformResponse: (response: any) => {
        console.log(
          "TransformResponse - Raw response from interceptor:",
          response,
        );

        return {
          data: response?.epapers || [],
          meta: response?.meta || {
            page: 1,
            limit: 10,
            total: 0,
            totalPage: 0,
          },
        };
      },
      providesTags: ["epaper"],
    }),

    getSingleEpaper: builder.query({
      query: (date) => ({
        url: `/epapers/date/${date}`,
        method: "GET",
      }),
      providesTags: ["epaper"],
    }),

    updateEpaper: builder.mutation({
      query: ({ date, edition, data }) => ({
        url: `/epapers/date/${date}?edition=${edition}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["epaper"],
    }),
    deleteEpaper: builder.mutation({
      query: (date) => ({
        url: `/epapers/date/${date}`,
        method: "DELETE",
      }),
      invalidatesTags: ["epaper"],
    }),

    toggleEpaperStatus: builder.mutation({
      query: ({ date, isActive }) => ({
        url: `/epapers/date/${date}/toggle-status`,
        method: "PATCH",
        data: { isActive },
      }),
      invalidatesTags: ["epaper"],
    }),
  }),
});

export const {
  useCreateEpaperMutation,
  useDeleteEpaperMutation,
  useGetAllEpapersQuery,
  useGetSingleEpaperQuery,
  useUpdateEpaperMutation,
  useToggleEpaperStatusMutation,
} = epaperApi;
