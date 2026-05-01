/* eslint-disable @typescript-eslint/no-unused-vars */
import { TNewsResponse, TQueryParam, TResponseRedux } from "@/types/api.types";
import { baseApi } from "../api/baseApi";

const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNews: builder.mutation({
      query: (data) => ({
        url: "/news",
        method: "POST",
        data,
      }),
      invalidatesTags: ["news"],
    }),

    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["news"],
    }),

    getAllNews: builder.query({
      query: (args) => {
        const queryParams = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            queryParams.append(item.name, item.value as string);
          });
        }

        return {
          url: `/news?${queryParams.toString()}`,
          method: "GET",
        };
      },

      transformResponse: (response: TNewsResponse) => {
        return {
          data: response.news,
          meta: response.meta,
        };
      },
      providesTags: ["news"],
    }),


    getSingleNews: builder.query({
      query: (id) => ({
        url: `/news/${id}`,
        method: "GET",
      }),
      providesTags: ["news"],
    }),

    updateNews: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/news/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["news"],
    }),
  }),
});

export const {
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useGetAllNewsQuery,
  useGetSingleNewsQuery,
  useUpdateNewsMutation,
} = newsApi;
