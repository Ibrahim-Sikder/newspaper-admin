/* eslint-disable @typescript-eslint/no-explicit-any */
import { TQueryParam } from "@/types/api.types";
import { baseApi } from "../api/baseApi";

const videoNewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createVideoNews: builder.mutation({
      query: (data) => ({
        url: "/video-news",
        method: "POST",
        data,
      }),
      invalidatesTags: ["videoNews"],
    }),

    deleteVideoNews: builder.mutation({
      query: (id) => ({
        url: `/video-news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["videoNews"],
    }),

    getAllVideoNews: builder.query({
      query: (args) => {
        const queryParams = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            queryParams.append(item.name, item.value as string);
          });
        }

        return {
          url: `/video-news?${queryParams.toString()}`,
          method: "GET",
        };
      },
      
      transformResponse: (response: any) => {
        return {
          data: response.videoNews,
          meta: response.meta,
        };
      },
      providesTags: ["videoNews"],
    }),

    getSingleVideoNews: builder.query({
      query: (id) => ({
        url: `/video-news/${id}`,
        method: "GET",
      }),
      providesTags: ["videoNews"],
    }),



    updateVideoNews: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/video-news/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["videoNews"],
    }),
  }),
});

export const {
  useCreateVideoNewsMutation,
  useDeleteVideoNewsMutation,
  useGetAllVideoNewsQuery,
  useGetSingleVideoNewsQuery,
  useUpdateVideoNewsMutation,
} = videoNewsApi;
