/* eslint-disable @typescript-eslint/no-explicit-any */
import { TQueryParam } from "@/types/api.types";
import { baseApi } from "../api/baseApi";

const advertisementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdvertisement: builder.mutation({
      query: (data) => ({
        url: "/advertisement",
        method: "POST",
        data,
      }),
      invalidatesTags: ["advertisement"],
    }),

    deleteAdvertisement: builder.mutation({
      query: (id) => ({
        url: `/advertisement/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["advertisement"],
    }),

    getAllAdvertisement: builder.query({
      query: (args) => {
        const queryParams = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            queryParams.append(item.name, item.value as string);
          });
        }

        return {
          url: `/advertisement?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return {
          data: response.advertisements,
          meta: response.meta,
        };
      },
      providesTags: ["advertisement"],
    }),
    getSingleAdvertisement: builder.query({
      query: (id) => ({
        url: `/advertisement/${id}`,
        method: "GET",
      }),
      providesTags: ["advertisement"],
    }),

    updateAdvertisement: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/advertisement/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["advertisement"],
    }),
  }),
});

export const {
  useCreateAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useGetAllAdvertisementQuery,
  useGetSingleAdvertisementQuery,
  useUpdateAdvertisementMutation,
} = advertisementApi;
