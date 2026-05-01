/* eslint-disable @typescript-eslint/no-explicit-any */
import { TQueryParam } from "@/types/api.types";
import { baseApi } from "../api/baseApi";

const photoNewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPhotoNews: builder.mutation({
      query: (data) => ({
        url: "/photonews",
        method: "POST",
        data,
      }),
      invalidatesTags: ["photoNews"],
    }),

    deletePhotoNews: builder.mutation({
      query: (id) => ({
        url: `/photonews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["photoNews"],
    }),


    getAllPhotoNews: builder.query({
      query: (args) => {
        const queryParams = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            queryParams.append(item.name, item.value as string);
          });
        }

        return {
          url: `/photonews?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        return {
          data: response.photonews,
          meta: response.meta,
        };
      },
      providesTags: ["photonews"],
    }),

    getSinglePhotoNews: builder.query({
      query: (id) => ({
        url: `/photonews/${id}`,
        method: "GET",
      }),
      providesTags: ["photoNews"],
    }),
    getPhotoNewsByID: builder.query({
      query: (id) => ({
        url: `/photonews/${id}`,
        method: "GET",
      }),
      providesTags: ["photoNews"],
    }),

    updatePhotoNews: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/photonews/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["photoNews"],
    }),
  }),
});

export const {
  useCreatePhotoNewsMutation,
  useDeletePhotoNewsMutation,
  useGetAllPhotoNewsQuery,
  useGetSinglePhotoNewsQuery,
  useUpdatePhotoNewsMutation,
  useGetPhotoNewsByIDQuery,
} = photoNewsApi;
