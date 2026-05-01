import { BaseQueryApi } from "@reduxjs/toolkit/query";

export type TError = {
  data: {
    message: string;
    stack: string;
    success: boolean;
  };
  status: number;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type TResponse<T> = {
  data?: T;
  error?: TError;
  meta?: TMeta;
  success: boolean;
  message: string;
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;

export type TQueryParam = {
  name: string;
  value: boolean | React.Key;
};

export type TNews = {
  _id: string;
  newsTitle: string;
  category: { name: string };
  publishedDate: string;
  description: string;
  newsTag: string[];
  newsType: string;
  shortDescription: string;
  slug: string;
  images: string[];
};

export type TNewsResponse = {
  news: TNews[];
  meta: TMeta;
};