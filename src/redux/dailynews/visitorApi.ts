import { baseApi } from "../api/baseApi";

const visitorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    trackVisitor: builder.mutation({
      query: (data) => ({
        url: "/visitor-tracker",
        method: "POST",
        data,
      }),
      invalidatesTags: ["visitor"],
    }),
    getVisitors: builder.query({
      query: () => ({
        url: "/visitor-tracker",
        method: "GET",
      }),
      providesTags: ["visitor"],
    }),
  }),
});

export const { useTrackVisitorMutation, useGetVisitorsQuery } = visitorApi;
