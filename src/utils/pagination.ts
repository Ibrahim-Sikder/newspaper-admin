import { TQueryParam } from "@/types/api.types";


export const updatePaginationParams = (
  prevParams: TQueryParam[],
  page: number,
  limit: number
): TQueryParam[] => {
  return [
    ...prevParams.filter((p) => p.name !== "page" && p.name !== "limit"),
    { name: "page", value: page.toString() },
    { name: "limit", value: limit.toString() },
  ];
};
