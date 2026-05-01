import { baseApi } from "../api/baseApi";

const foldersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createFolder: builder.mutation({
      query: (data) => ({
        url: "/gallery/folder",
        method: "POST",
        data,
      }),
      invalidatesTags: ["folder"],
    }),

    deleteFolder: builder.mutation({
      query: (id) => ({
        url: `/gallery/folder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["folder"],
    }),


    getAllFolder: builder.query({
      query: () => ({
        url: "/gallery/folders",
        method: "GET",
    
      }),
      providesTags: ["folder"],
    }),
    getSingleFolder: builder.query({
      query: (id) => ({
        url: `/gallery/folders/${id}`,
        method: "GET",
      }),
      providesTags: ["folder"],
    }),
    updateFolder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/gallery/folders/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["folder"],
    }),
  }),
});

export const {
  useCreateFolderMutation, 
  useDeleteFolderMutation, 
  useGetAllFolderQuery,
  useGetSingleFolderQuery,
  useUpdateFolderMutation
} = foldersApi; 