/* eslint-disable @typescript-eslint/no-explicit-any */
export type newsProps = {
  params: Promise<{ id: string }>;
};
export type Inputs = {
  reportedDate: string;
  reporterType: string;
  reporterName: string;
  currentNews: boolean;
  localNews: boolean;
  newsLocation: string;
  selectedImage: string;
  imageTagline: string;
  photojournalistName: string;
  internationalArea: string;
  division: string;
  district: string;
  upazila: string;
  newsTag: string;
  newsType: string;
  newsCategory: string;
  newsTitle: string;
  adminName: string;
  slug: string;
  category: string;
  publishedDate: string;
  shortDescription: string;
  description: string;
  tags: {
    imageTagline: string;
    photojournalistName: string;
    selectedImage: string;
  }[];
  metaTitle: string;
  metaKeywords: string | string[];
  metaDescription: string;
};

export type CourseFormProps = {
  editingId?: string | undefined;
  initialData?: any | undefined | null;
};
