import { baseApi } from "../api/baseApi";

const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategories: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        data,
      }),
      invalidatesTags: ["categories"],
    }),

    deleteCategories: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),

    getAllCategories: builder.query({
      query: () => ({
        url: "/categories?limit=100", 
        method: "GET",
      }),
      providesTags: ["categories"],
    }),

    getSingleCategories: builder.query({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: ["categories"],
    }),

    updateCategories: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useCreateCategoriesMutation,
  useDeleteCategoriesMutation,
  useGetAllCategoriesQuery,
  useGetSingleCategoriesQuery,
  useUpdateCategoriesMutation,
} = categoriesApi;
