/* eslint-disable @typescript-eslint/no-explicit-any */
import { USER_ROLE } from "@/constant/role";

export type userRole = keyof typeof USER_ROLE;

export type IMeta = {
  page: number;
  limit: number;
  total: number;
};

export interface DrawerItem {
  title: string;
  path: string;
  icon?: React.ElementType;
  child?: DrawerItem[];
}

export type ResponseSuccessType = {
  data: any;
  meta?: IMeta;
};

export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages?: string | string[];
}

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};
export type TImgGallery = {
  _id: string;
  title_of_bangla: string;
  title_of_english: string;
  slug: string;
  thumnailImages: string[];
  createdAt: string;
};

export type TBanner = {
  _id: string;
  thumnailImages: string[];
  english_title: string;
  bangla_title: string;
  english_short_description: string;
  bangla_short_description: string;
  category: string;
  date: string;
  createdAt: string;
};
export const category = [
  "Our Project",
  "Our Programm",
  "ZRF Rehabilitation Team",
  "Initiatives",
  "Covid",
  "Health Services",
  "Climate Change",
  "ZRF Education Programm",
];
export type TWhatWeDo = {
  _id: string;
  img_tagline_bangla: string;
  img_tagline_english: string;
  admin_name: string;
  date: string;
  bangla_title: string;
  english_title: string;
  bangla_short_description: string;
  english_short_description: string;
  bangla_description: string;
  english_description: string;
  meta_title: string;
  meta_keywords: string[];
  meta_description: string;
  thumnail_img: string;
  eng_images: string[];
  bng_Images: string[];
  slug: string;
  category: string;
};
export type TIntroduction = {
  _id: string;
  admin_name: string;
  date: string;
  bangla_title: string;
  english_title: string;
  bangla_description: string;
  english_description: string;
  eng_images: string[];
  bng_images: string[];
  category: string;
};
export const introductionCategory = [
  "Ziaur Rahman",
  "Begum Khaleda Zia",
  "Tarique Rahman",
  "Arafat Rahman Koko",
];
export const bannerCategory = ["Banner", "Welcome"];
export const activityCategory = ["News", "Activity"];
export const educationCategory = ["Education", "News"];
export const messageCategory = ["president", "exicutive","vice president"];
export const committeeCategory = ["Committee","president", "exicutive", "Volunteer"];
export const directorCategory = ["Board of Directors Committee","Advisory Council"];

export type TEducation = {
  _id: string;
  img_tagline_bangla: string;
  img_tagline_english: string;
  admin_name: string;
  date: string;
  bangla_title: string;
  english_title: string;
  bangla_short_description: string;
  english_short_description: string;
  bangla_description: string;
  english_description: string;
  meta_title: string;
  meta_keywords: string[];
  meta_description: string;
  thumnail_img: string;
  eng_images: string[];
  bng_Images: string[];
  slug: string;
  category: string;
};
export type TMessage = {
  _id: string;
  admin_name: string;
  date: string;
  name_bangla: string;
  name_english: string;
  designation_bangla: string;
  designation_english: string;
  bangla_description: string;
  english_description: string;
  eng_images: string[];
  bng_Images: string[];
  slug: string;
  category: string;
};

export type TCommitte = {
  _id: string;
  bangla_name: string;
  english_name: string;
  designation_bangla: string;
  designation_english: string;
  images: string[];
  category: string;
  date: string;
};

export type TAbout = {
  _id: string;
  title_bangla: string;
  title_english: string;
  description_banlga: string;
  description_enlgish: string;
  images: string[];
  date: string;
  admin_name: string;
  category: string;
};

export type TMembership = {
  _id:string,
  createdAt:string,
  name:string,
  email:string,
  phone:number,
  addreess:string
}


export type TContact = {
  _id:string,
  createdAt:string,
  name:string,
  phone:number,
  email:string,
  subject:string,
  message:string,
  amount:string,
}
export type TOverview = {
  _id:string,
  year_count_bangla: string;
  year_count_english: string;
  year_text_bangla: string;
  year_text_english: string;
  donation_count_bangla: string;
  donation_count_english: string;
  donation_text_banlga: string;
  donation_text_english: string;
  complete_project_count_bangla: string;
  complete_project_count_english: string;
  complete_project_text_english: string;
  complete_project_bangla_english: string;
  volunteer_count_bangla: string;
  volunteer_count_english: string;
  volunteer_text_english: string;
  volunteer_text_bangla: string;
  images: string[];
  description_bangla: string;
  description_english: string;
};
