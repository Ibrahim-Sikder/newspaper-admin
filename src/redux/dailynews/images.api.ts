/* eslint-disable @typescript-eslint/no-explicit-any */
import { TQueryParam } from "@/types/api.types";
import { baseApi } from "../api/baseApi";

const imagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createImages: builder.mutation({
      query: (formData) => ({
        url: "/gallery/upload",
        method: "POST",
        data: formData,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: ["images"],
    }),
    deleteImages: builder.mutation({
      query: (data: { id: string; public_id: string }) => {
        return {
          url: "/gallery/delete",
          method: "POST",
          data,
        };
      },
      invalidatesTags: ["images"],
    }),

    getAllImages: builder.query({
      query: (args) => {
        const queryParams = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            queryParams.append(item.name, item.value as string);
          });
        }

        return {
          url: `/gallery/all?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const dataArray = Array.isArray(response)
          ? response
          : (response?.data ?? response?.images ?? []);

        const total = dataArray.length;

        return {
          data: dataArray,
          meta: response?.meta ?? {
            total,
            totalPage: 1,
            page: 1,
            limit: 20,
          },
        };
      },
      providesTags: ["images"],
    }),
    getImagesByFolder: builder.query({
      query: (id) => ({
        url: `/gallery/folder/${id}`,
        method: "GET",
      }),
      providesTags: ["images"],
    }),

    getSingleImages: builder.query({
      query: (id) => ({
        url: `/gallery/${id}`,
        method: "GET",
      }),
      providesTags: ["images"],
    }),
    updateImages: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/gallery/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["images"],
    }),
  }),
});

export const {
  useCreateImagesMutation,
  useDeleteImagesMutation,
  useGetAllImagesQuery,
  useGetSingleImagesQuery,
  useUpdateImagesMutation,
  useGetImagesByFolderQuery,
} = imagesApi;
