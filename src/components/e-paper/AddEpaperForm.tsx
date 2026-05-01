/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AllImgModal from "@/components/Shared/AllImagesModal/AllImgModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  useCreateEpaperMutation,
  useUpdateEpaperMutation,
} from "@/redux/dailynews/e-paper";

import { AddEpaperFormProps } from "@/types/e-paper";
import DateTimeInput from "@/utils/Form_Inputs/DateTimeInput";
import RadioInput from "@/utils/Form_Inputs/RadioInput";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import PageCard from "./PageCard";
import TextInput from "@/utils/Form_Inputs/TextInput";
import { EDITION_OPTIONS } from "@/constant/epaper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetAllNewsQuery } from "@/redux/dailynews/news.api";
import { TQueryParam } from "@/types/api.types";
import debounce from "lodash.debounce";

const generateUniqueId = () => {
  return `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const transformBackendToFrontend = (data: any) => {
  if (!data) return null;

  return {
    date: data.date || "",
    title: data.title || "",
    edition: data.edition || "1st",
    isActive: data.isActive ?? true,
    footerInfo: {
      editor: data.footerInfo?.editor || "",
      publisher: data.footerInfo?.publisher || "",
      organization: data.footerInfo?.organization || "",
      copyright: data.footerInfo?.copyright || "",
    },
    pages:
      data.pages?.map((page: any, idx: number) => ({
        pageNumber: page.pageNumber || idx + 1,
        image: page.image || "",
        thumbnail: page.thumbnail || "",
        originalWidth: page.originalWidth || 1200,
        originalHeight: page.originalHeight || 1800,
        articles:
          page.articles?.map((article: any) => ({
            id: article.id || generateUniqueId(),
            newsId: article.newsId || "",
            newsSlug: article.newsSlug || "",
            title: article.titleSnapshot || article.title || "",
            content: article.contentSnapshot || article.content || "",
            category: article.category || "জাতীয়",
            articleImage: article.articleImage || article.imageSnapshot || "",
            x: article.x || 0,
            y: article.y || 0,
            width: article.width || 0,
            height: article.height || 0,
          })) || [],
      })) || [],
  };
};

const AddEpaperForm = ({
  initialData,
  isEditing = false,
}: AddEpaperFormProps) => {
  const router = useRouter();
  const [createEpaper] = useCreateEpaperMutation();
  const [updateEpaper] = useUpdateEpaperMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [newsSelectorOpen, setNewsSelectorOpen] = useState(false);
  const [selectedNewsForArticle, setSelectedNewsForArticle] = useState<{
    pageIndex: number;
    articleIndex: number;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const [imageType, setImageType] = useState<"page" | "thumbnail" | "article">(
    "page",
  );

  const pageIndexRef = useRef<number | null>(null);
  const articleIndexRef = useRef<number | null>(null);

  const [params, setParams] = useState<TQueryParam[]>([
    { name: "page", value: "1" },
    { name: "limit", value: "50" },
  ]);

  const transformedInitialData = transformBackendToFrontend(initialData);

  const methods = useForm<any>({
    defaultValues: transformedInitialData || {
      date: "",
      title: "",
      edition: "1st",
      pages: [],
      isActive: true,
      footerInfo: {
        editor: "",
        publisher: "",
        organization: "",
        copyright: "",
      },
    },
  });

  const {
    fields: pageFields,
    append: appendPage,
    remove: removePage,
    move: movePage,
  } = useFieldArray({ control: methods.control, name: "pages" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && initialData) {
    }
  }, [isMounted, initialData, transformedInitialData, methods]);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setParams((prev) => {
        const newParams = prev.filter((p) => p.name !== "searchTerm");
        if (searchTerm) {
          newParams.push({ name: "searchTerm", value: searchTerm });
        }
        newParams.push({ name: "page", value: "1" });
        newParams.push({ name: "limit", value: "50" });
        return newParams;
      });
    }, 500);

    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const { data: newsData, isLoading: isNewsLoading } =
    useGetAllNewsQuery(params);

  const newsList = newsData?.data || [];

  const handleImageSelect = useCallback(
    (images: any[]) => {
      const pageIdx = pageIndexRef.current;
      const articleIdx = articleIndexRef.current;

      if (imageType === "page" && pageIdx !== null) {
        methods.setValue(`pages.${pageIdx}.image`, images[0]?.url || "", {
          shouldDirty: true,
        });
      } else if (imageType === "thumbnail" && pageIdx !== null) {
        methods.setValue(`pages.${pageIdx}.thumbnail`, images[0]?.url || "", {
          shouldDirty: true,
        });
      } else if (
        imageType === "article" &&
        pageIdx !== null &&
        articleIdx !== null
      ) {
        methods.setValue(
          `pages.${pageIdx}.articles.${articleIdx}.articleImage`,
          images[0]?.url || "",
          { shouldDirty: true },
        );
      }

      setSheetOpen(false);
      pageIndexRef.current = null;
      articleIndexRef.current = null;
    },
    [imageType, methods],
  );

  const handleSelectNews = useCallback(
    (news: any) => {
      if (selectedNewsForArticle) {
        const { pageIndex, articleIndex } = selectedNewsForArticle;

        methods.setValue(
          `pages.${pageIndex}.articles.${articleIndex}.newsId`,
          news._id,
        );
        methods.setValue(
          `pages.${pageIndex}.articles.${articleIndex}.newsSlug`,
          news.slug,
        );
        methods.setValue(
          `pages.${pageIndex}.articles.${articleIndex}.title`,
          news.newsTitle,
        );
        methods.setValue(
          `pages.${pageIndex}.articles.${articleIndex}.content`,
          news.description || "",
        );
        methods.setValue(
          `pages.${pageIndex}.articles.${articleIndex}.category`,
          news.newsCategory || "জাতীয়",
        );
        if (
          !methods.getValues(
            `pages.${pageIndex}.articles.${articleIndex}.articleImage`,
          )
        ) {
          methods.setValue(
            `pages.${pageIndex}.articles.${articleIndex}.articleImage`,
            news.images?.[0] || "",
          );
        }

        setNewsSelectorOpen(false);
        setSelectedNewsForArticle(null);
        toast.success("নিউজ সফলভাবে সংযুক্ত করা হয়েছে");
      }
    },
    [selectedNewsForArticle, methods],
  );

  const addNewPage = useCallback(() => {
    appendPage({
      pageNumber: pageFields.length + 1,
      image: "",
      thumbnail: "",
      originalWidth: 1200,
      originalHeight: 1800,
      articles: [],
    });
  }, [pageFields.length, appendPage]);

  const addNewArticle = useCallback(
    (pageIndex: number) => {
      const currentArticles =
        methods.getValues(`pages.${pageIndex}.articles`) || [];

      const newArticle = {
        id: generateUniqueId(),
        newsId: "",
        newsSlug: "",
        title: "",
        content: "",
        category: "জাতীয়",
        articleImage: "",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };

      methods.setValue(`pages.${pageIndex}.articles`, [
        ...currentArticles,
        newArticle,
      ]);

      setSelectedNewsForArticle({
        pageIndex,
        articleIndex: currentArticles.length,
      });
      setNewsSelectorOpen(true);
    },
    [methods],
  );

  const removeArticle = useCallback(
    (pageIndex: number, articleIndex: number) => {
      const currentArticles =
        methods.getValues(`pages.${pageIndex}.articles`) || [];
      const updatedArticles = currentArticles.filter(
        (_: any, idx: number) => idx !== articleIndex,
      );
      methods.setValue(`pages.${pageIndex}.articles`, updatedArticles, {
        shouldDirty: true,
      });
    },
    [methods],
  );

  const updateArticleCoordinates = useCallback(
    (
      pageIndex: number,
      articleIndex: number,
      coordinates: { x: number; y: number; width: number; height: number },
    ) => {
      const base = `pages.${pageIndex}.articles.${articleIndex}`;
      methods.setValue(`${base}.x`, coordinates.x, { shouldDirty: true });
      methods.setValue(`${base}.y`, coordinates.y, { shouldDirty: true });
      methods.setValue(`${base}.width`, coordinates.width, {
        shouldDirty: true,
      });
      methods.setValue(`${base}.height`, coordinates.height, {
        shouldDirty: true,
      });
    },
    [methods],
  );

  const validateForm = (
    formData: any,
  ): { isValid: boolean; error?: string } => {
    if (!formData.date?.trim())
      return { isValid: false, error: "তারিখ নির্বাচন করুন" };
    if (!formData.title?.trim())
      return { isValid: false, error: "শিরোনাম লিখুন" };
    if (!formData.edition?.trim())
      return { isValid: false, error: "সংস্করণ নির্বাচন করুন" };
    if (!formData.pages?.length)
      return { isValid: false, error: "কমপক্ষে একটি পৃষ্ঠা যোগ করুন" };

    for (let i = 0; i < formData.pages.length; i++) {
      const page = formData.pages[i];
      if (!page.image?.trim())
        return {
          isValid: false,
          error: `পৃষ্ঠা ${page.pageNumber} এর মূল ছবি যোগ করুন`,
        };
      if (!page.thumbnail?.trim())
        return {
          isValid: false,
          error: `পৃষ্ঠা ${page.pageNumber} এর থাম্বনেইল যোগ করুন`,
        };
      if (!page.originalWidth || !page.originalHeight) {
        page.originalWidth = 1200;
        page.originalHeight = 1800;
      }

      for (let j = 0; j < (page.articles?.length || 0); j++) {
        const article = page.articles[j];
        if (!article.title?.trim())
          return {
            isValid: false,
            error: `পৃষ্ঠা ${page.pageNumber}, আর্টিকেল ${j + 1}: শিরোনাম লিখুন`,
          };
        if (!article.articleImage?.trim())
          return {
            isValid: false,
            error: `পৃষ্ঠা ${page.pageNumber}, আর্টিকেল ${j + 1}: ছবি যোগ করুন`,
          };
        const contentText = article.content?.replace(/<[^>]*>/g, "").trim();
        if (!contentText)
          return {
            isValid: false,
            error: `পৃষ্ঠা ${page.pageNumber}, আর্টিকেল ${j + 1}: বিবরণ লিখুন`,
          };
        if (!article.width || !article.height)
          return {
            isValid: false,
            error: `পৃষ্ঠা ${page.pageNumber}, আর্টিকেল ${j + 1}: কো-অর্ডিনেট সেট করুন`,
          };
      }
    }
    return { isValid: true };
  };

  const onSubmit = async (formData: any) => {
    if (isSubmitting) return;
    const validation = validateForm(formData);
    if (!validation.isValid) {
      toast.error(validation.error || "সব তথ্য পূরণ করুন");
      return;
    }
    setIsSubmitting(true);
    try {
      const processedData = {
        ...formData,
        pages: formData.pages.map((page: any, idx: number) => ({
          ...page,
          pageNumber: idx + 1,
          originalWidth: page.originalWidth || 1200,
          originalHeight: page.originalHeight || 1800,
          articles: page.articles.map((article: any) => ({
            ...article,
            id: article.id || generateUniqueId(),
            titleSnapshot: article.title,
            contentSnapshot: article.content,
            imageSnapshot: article.articleImage,
          })),
        })),
      };

      if (isEditing && initialData?.date) {
        const res = await updateEpaper({
          date: initialData.date,
          edition: initialData.edition,
          data: processedData,
        }).unwrap();
        if (res) {
          toast.success("ই-পেপার সফলভাবে আপডেট হয়েছে!");
          router.push("/dashboard/e-paper/list");
        }
      } else {
        await createEpaper(processedData).unwrap();
        toast.success("ই-পেপার সফলভাবে তৈরি হয়েছে!");
        router.push("/dashboard/e-paper/list");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(
        error?.data?.message || error?.message || "কিছু একটা ভুল হয়েছে!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="p-6">
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info Section */}
            <section className="bg-white border border-gray-300 rounded-lg p-5">
              <h1 className="text-xl font-semibold mb-4">📰 ই-পেপার তথ্য</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateTimeInput
                  control={methods.control}
                  name="date"
                  label="তারিখ"
                  type="date"
                  rules={{ required: "তারিখ প্রয়োজন" }}
                />
                <TextInput
                  control={methods.control}
                  name="title"
                  label="শিরোনাম"
                  placeholder="ই-পেপারের শিরোনাম"
                  rules={{ required: "শিরোনাম প্রয়োজন" }}
                />
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    সংস্করণ (Edition) <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...methods.register("edition", {
                      required: "সংস্করণ প্রয়োজন",
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {EDITION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {methods.formState.errors.edition && (
                    <p className="text-red-500 text-xs mt-1">
                      {String(methods.formState.errors.edition.message)}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <RadioInput
                    title="সক্রিয় করুন"
                    name="isActive"
                    value={methods.watch("isActive")}
                    onChange={(value: boolean) =>
                      methods.setValue("isActive", value)
                    }
                  />
                </div>
              </div>
            </section>

            {/* Pages Section */}
            <section className="bg-white border border-gray-300 rounded-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">📄 পৃষ্ঠাসমূহ</h1>
                <Button
                  type="button"
                  onClick={addNewPage}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus size={16} /> নতুন পৃষ্ঠা
                </Button>
              </div>

              <div className="space-y-6">
                {pageFields.map((pageField, pageIndex) => (
                  <PageCard
                    key={pageField.id}
                    pageIndex={pageIndex}
                    pageNumber={pageIndex + 1}
                    control={methods.control}
                    onRemove={() => removePage(pageIndex)}
                    onMoveUp={() => movePage(pageIndex, pageIndex - 1)}
                    onMoveDown={() => movePage(pageIndex, pageIndex + 1)}
                    isFirst={pageIndex === 0}
                    isLast={pageIndex === pageFields.length - 1}
                    onAddArticle={() => addNewArticle(pageIndex)}
                    onRemoveArticle={(articleIndex) =>
                      removeArticle(pageIndex, articleIndex)
                    }
                    onSelectImage={(type) => {
                      setImageType(type);
                      pageIndexRef.current = pageIndex;
                      setSheetOpen(true);
                    }}
                    onSelectArticleImage={(articleIndex) => {
                      setImageType("article");
                      pageIndexRef.current = pageIndex;
                      articleIndexRef.current = articleIndex;
                      setSheetOpen(true);
                    }}
                    onUpdateCoordinates={(articleIndex, coordinates) =>
                      updateArticleCoordinates(
                        pageIndex,
                        articleIndex,
                        coordinates,
                      )
                    }
                    onSelectNewsForArticle={(articleIndex) => {
                      setSelectedNewsForArticle({ pageIndex, articleIndex });
                      setNewsSelectorOpen(true);
                    }}
                  />
                ))}
              </div>

              {pageFields.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  কোন পৃষ্ঠা নেই। নতুন পৃষ্ঠা বাটনে ক্লিক করুন।
                </div>
              )}
            </section>

            {/* Footer Section */}
            <section className="bg-white border border-gray-300 rounded-lg p-5">
              <h1 className="text-xl font-semibold mb-4">📋 ফুটার তথ্য</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  control={methods.control}
                  name="footerInfo.editor"
                  label="সম্পাদক"
                  placeholder="সম্পাদকের নাম লিখুন"
                />
                <TextInput
                  control={methods.control}
                  name="footerInfo.publisher"
                  label="প্রকাশক"
                  placeholder="প্রকাশকের নাম লিখুন"
                />
                <TextInput
                  control={methods.control}
                  name="footerInfo.organization"
                  label="সংস্থা"
                  placeholder="সংস্থার নাম লিখুন"
                  className="col-span-2"
                />
                <TextInput
                  control={methods.control}
                  name="footerInfo.copyright"
                  label="কপিরাইট তথ্য"
                  placeholder="কপিরাইট তথ্য লিখুন"
                  className="col-span-2"
                  rules={{ required: "কপিরাইট তথ্য প্রয়োজন" }}
                />
              </div>
            </section>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/e-paper/list")}
              >
                বাতিল করুন
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-40">
                {isSubmitting
                  ? "সেভ হচ্ছে..."
                  : isEditing
                    ? "আপডেট করুন"
                    : "সেভ করুন"}
              </Button>
            </div>
          </form>
        </Form>

        {/* News Selector Dialog */}
        <Dialog open={newsSelectorOpen} onOpenChange={setNewsSelectorOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                নিউজ নির্বাচন করুন
              </DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="নিউজ সার্চ করুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {isNewsLoading ? (
                <div className="text-center py-8 text-gray-500">
                  লোড হচ্ছে...
                </div>
              ) : newsList.length > 0 ? (
                newsList.map((news: any) => (
                  <div
                    key={news._id}
                    className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => handleSelectNews(news)}
                  >
                    <div className="flex gap-3">
                      {news.images?.[0] && (
                        <img
                          src={news.images[0]}
                          alt={news.newsTitle}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{news.newsTitle}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {news.shortDescription}
                        </p>
                        <div className="flex gap-2 mt-1 text-xs text-gray-500">
                          <span>{news.newsCategory}</span>
                          <span>
                            {news.publishedDate
                              ? new Date(news.publishedDate).toLocaleDateString(
                                  "bn-BD",
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  কোন নিউজ পাওয়া যায়নি
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="right"
            className="pt-4 overflow-y-auto"
            style={{ maxWidth: "800px" }}
          >
            <SheetTitle>ছবি নির্বাচন করুন</SheetTitle>
            <AllImgModal
              onImageSelect={handleImageSelect}
              onClose={() => setSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </FormProvider>
  );
};

export default AddEpaperForm;
