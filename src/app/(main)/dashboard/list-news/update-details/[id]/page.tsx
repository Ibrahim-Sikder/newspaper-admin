/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import RichText from "@/utils/Form_Inputs/RichText";
import TextArea from "@/utils/Form_Inputs/TextArea";
import TextInput from "@/utils/Form_Inputs/TextInput";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import { CircleX, ImageUpIcon } from "lucide-react";
import DateTimeInput from "@/utils/Form_Inputs/DateTimeInput";
import {
  useGetSingleNewsQuery,
  useUpdateNewsMutation,
} from "@/redux/dailynews/news.api";
import AllImgModal from "@/components/Shared/AllImagesModal/AllImgModal";
import { useGetAllCategoriesQuery } from "@/redux/dailynews/category.api";
import TagSelector from "@/utils/Form_Inputs/TagSelector";
import RadioInput from "@/utils/Form_Inputs/RadioInput";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { use, useEffect, useState } from "react";
import MultiSelector from "@/utils/Form_Inputs/MultiSelector";
import { newsTagOption, reporterTypeOption } from "@/utils/options";
import toast from "react-hot-toast";
import Image from "next/image";
import Loading from "@/app/loading";
import UpdateTopBar from "../../_components/UpdateTopBar";
import SelecteWithSearch from "@/utils/Form_Inputs/SelecteWithSearch";
import NewsLocation from "@/utils/Form_Inputs/NewsLocation";
import { Inputs, newsProps } from "@/types/news";

const Page = ({ params }: newsProps) => {
  const { id } = use(params);
  const { data, isLoading } = useGetAllCategoriesQuery({});
  const router = useRouter();
  const [firstPage, setFirstPage] = useState<string>("no");
  const [currentNews, setCurrentNews] = useState<boolean>(false);
  const [localNews, setLocalNews] = useState<boolean>(false);

  const [updateNews] = useUpdateNewsMutation();

  // So we extract the actual news object from response.data
  const { data: singleDataResponse } = useGetSingleNewsQuery(id);
  const news = singleDataResponse?.data ?? singleDataResponse ?? null;

  const [mainSelectedFiles, setMainSelectedFiles] = React.useState<
    { url: string }[]
  >([]);

  const [tagSelectedFiles, setTagSelectedFiles] = React.useState<
    { url: string }[][]
  >([]);

  const [openSheetIndex, setOpenSheetIndex] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [locationData, setLocationData] = useState<
    Record<string, Record<string, string[]>>
  >({});
  const [districtOptions, setDistrictOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [upazilaOptions, setUpazilaOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Load location data
  useEffect(() => {
    fetch("/data/location.json")
      .then((res) => res.json())
      .then((d) => setLocationData(d));
  }, []);

  const form = useForm<Inputs>({
    defaultValues: {
      firstPage: "",
      reportedDate: "",
      reporterType: "",
      reporterName: "",
      currentNews: false,
      localNews: false,
      newsLocation: "",
      selectedImage: "",
      imageTagline: "",
      photojournalistName: "",
      internationalArea: "",
      division: "",
      district: "",
      upazila: "",
      newsTag: [],
      newsType: "",
      newsCategory: "",
      newsTitle: "",
      adminName: "",
      category: "",
      publishedDate: "",
      shortDescription: "",
      description: "",
      tags: [{ imageTagline: "", photojournalistName: "", selectedImage: "" }],
      metaTitle: "",
      metaKeywords: [],
      metaDescription: "",
    },
  });

  const division = useWatch({ control: form.control, name: "division" });
  const district = useWatch({ control: form.control, name: "district" });
  const newsType = useWatch({ control: form.control, name: "newsType" });

  // Update district options when division changes
  useEffect(() => {
    if (division && locationData[division]) {
      setDistrictOptions(
        Object.keys(locationData[division]).map((d) => ({
          label: d,
          value: d,
        })),
      );
    }
  }, [division, locationData]);

  // Update upazila options when district changes
  useEffect(() => {
    if (division && district && locationData[division]?.[district]) {
      setUpazilaOptions(
        locationData[division][district].map((upazila) => ({
          label: upazila,
          value: upazila,
        })),
      );
    }
  }, [district, division, locationData]);

  // ✅ Populate form when news data is ready
  useEffect(() => {
    if (!news || Object.keys(news).length === 0) return;

    const formatDate = (isoString: string) =>
      isoString ? isoString.slice(0, 16) : "";

    // category can be object {_id, name} or a plain string id
    const categoryId = news.category?._id ?? news.category ?? "";

    form.reset({
      reportedDate: formatDate(news.reportedDate),
      reporterType: news.reporterType ?? "",
      reporterName: news.reporterName ?? "",
      currentNews: news.currentNews ?? false,
      localNews: news.localNews ?? false,
      firstPage: news.firstPage === true ? "yes" : "no",
      newsLocation: news.newsLocation ?? "",
      selectedImage: news.images?.[0] ?? "",
      imageTagline: news.imageTagline ?? "",
      photojournalistName: news.photojournalistName ?? "",
      internationalArea: news.internationalArea ?? "",
      division: news.division ?? "",
      district: news.district ?? "",
      upazila: news.upazila ?? "",
      newsTag: news.newsTag ?? [],
      newsType: news.newsType ?? "",
      newsCategory: news.newsCategory ?? "",
      newsTitle: news.newsTitle ?? "",
      adminName: news.adminName ?? "",
      category: categoryId,
      publishedDate: formatDate(news.publishedDate),
      shortDescription: news.shortDescription ?? "",
      description: news.description ?? "",
      tags:
        news.tags?.length > 0
          ? news.tags
          : [{ imageTagline: "", photojournalistName: "", selectedImage: "" }],
      metaTitle: news.metaTitle ?? "",
      metaKeywords: news.metaKeywords ?? [],
      metaDescription: news.metaDescription ?? "",
    });

    setCurrentNews(news.currentNews ?? false);
    setLocalNews(news.localNews ?? false);
    setFirstPage(news.firstPage === true ? "yes" : "no");

    setMainSelectedFiles(news.images?.map((url: string) => ({ url })) ?? []);

    setTagSelectedFiles(
      news.tags?.map((tag: any) =>
        tag.selectedImage ? [{ url: tag.selectedImage }] : [],
      ) ?? [],
    );
  }, [news]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Initialize location dropdowns once both locationData and news are ready
  useEffect(() => {
    if (!news || Object.keys(locationData).length === 0) return;

    if (news.division && locationData[news.division]) {
      setDistrictOptions(
        Object.keys(locationData[news.division]).map((d) => ({
          label: d,
          value: d,
        })),
      );

      if (news.district && locationData[news.division][news.district]) {
        setUpazilaOptions(
          locationData[news.division][news.district].map((upazila) => ({
            label: upazila,
            value: upazila,
          })),
        );
      }
    }
  }, [news, locationData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = async (formData: Inputs) => {
    const modifyData = {
      ...formData,
      firstPage: formData.firstPage === "yes",
      postDate: new Date().toISOString(),
      images: mainSelectedFiles.map((item) => item.url),
      tags: formData.tags?.map((tag, index) => ({
        ...tag,
        selectedImage:
          tagSelectedFiles[index]?.[0]?.url ?? tag.selectedImage ?? "",
      })),
    };

    try {
      const res = await updateNews({ ...modifyData, id }).unwrap();
      if (res) {
        toast.success("News Update Successfully!");
        router.push("/dashboard/list-news");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageSelect = (images: any[]) => {
    if (openSheetIndex === null) {
      const urls = images.map((img) => img.url);
      setMainSelectedFiles(images);
      form.setValue("selectedImage", urls[0] || "");
    } else {
      const newTagFiles = [...tagSelectedFiles];
      newTagFiles[openSheetIndex] = images;
      setTagSelectedFiles(newTagFiles);
      form.setValue(
        `tags.${openSheetIndex}.selectedImage`,
        images[0]?.url || "",
      );
    }
    setSheetOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <UpdateTopBar />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4 xl:6">
              <div className="lg:col-span-8 col-span-full space-y-3">
                {/* Reporter Info Section */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold">প্রতিনিধি তথ্য:</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div>
                      <SelectInput
                        control={form.control}
                        name="reporterType"
                        placeholder="প্রতিনিধি টাইপ নির্বাচন করুন"
                        options={reporterTypeOption}
                        rules={{}}
                      />
                    </div>
                    <div>
                      <DateTimeInput
                        control={form.control}
                        type="datetime-local"
                        name="reportedDate"
                        rules={{}}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <TextInput
                        control={form.control}
                        name="reporterName"
                        placeholder="প্রতিনিধি নাম"
                        rules={{}}
                      />
                    </div>
                  </div>
                </section>

                {/* News type and area */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold">নিউজ টাইপ:</h1>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <SelectInput
                        control={form.control}
                        name="newsType"
                        placeholder="নিউজ টাইপ নির্বাচন করুন"
                        rules={{}}
                        options={[
                          { label: "Bangladesh", value: "Bangladesh" },
                          { label: "International", value: "International" },
                        ]}
                      />
                    </div>
                    {newsType === "Bangladesh" && (
                      <>
                        <h1 className="mb-1 font-semibold">নিউজ এলাকা</h1>
                        <div className="col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <SelecteWithSearch
                            name="division"
                            options={Object.keys(locationData).map((div) => ({
                              label: div,
                              value: div,
                            }))}
                            label="বিভাগ নির্বাচন করুন"
                            onChange={() => {
                              form.setValue("district", "");
                              form.setValue("upazila", "");
                              setUpazilaOptions([]);
                            }}
                          />
                          <SelecteWithSearch
                            name="district"
                            options={districtOptions}
                            label="জেলা নির্বাচন করুন"
                            onChange={() => {
                              form.setValue("upazila", "");
                            }}
                          />
                          <SelecteWithSearch
                            name="upazila"
                            options={upazilaOptions}
                            label="উপজেলা নির্বাচন করুন"
                          />
                        </div>
                        <section className="bg-white py-3 border-2 border-dashed rounded-lg mt-2 md:col-span-2 xl:col-span-1">
                          <RadioInput
                            title={"জনপদের সংবাদ?"}
                            name="localNews"
                            value={localNews}
                            onChange={(value: boolean) => {
                              setLocalNews(value);
                              form.setValue("localNews", value);
                            }}
                          />
                        </section>
                      </>
                    )}
                    {newsType === "International" && (
                      <>
                        <h1 className="mb-1 font-semibold">নিউজ এলাকা</h1>
                        <div className="col-span-2">
                          <TextInput
                            control={form.control}
                            name="internationalArea"
                            placeholder="আন্তর্জাতিক এলাকা"
                            rules={{}}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* News Info Section */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold">সংবাদের তথ্য:</h1>
                  <div>
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                      <SheetTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="p-8 border rounded-full mb-5"
                          onClick={() => setOpenSheetIndex(null)}
                        >
                          <ImageUpIcon color="red" size={50} /> Add Image
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        style={{ maxWidth: "800px" }}
                        className="overflow-auto"
                      >
                        <SheetTitle className="sr-only">
                          Image Selection Modal
                        </SheetTitle>
                        <AllImgModal
                          onImageSelect={handleImageSelect}
                          onClose={() => setOpenSheetIndex(null)}
                        />
                      </SheetContent>
                    </Sheet>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3">
                    {mainSelectedFiles.map((file, index) => (
                      <div key={index} className="relative rounded-lg group">
                        <Image
                          src={file.url}
                          alt={`Preview ${index}`}
                          width={150}
                          height={150}
                          className="lg:h-[150px] lg:w-[150px] rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setMainSelectedFiles((files) =>
                              files.filter((_, i) => i !== index),
                            );
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <CircleX />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <TextInput
                          control={form.control}
                          name="photojournalistName"
                          placeholder="ফটো সাংবাদিক নাম"
                          rules={{}}
                        />
                      </div>

                      <SelectInput
                        control={form.control}
                        name="category"
                        placeholder="নিউজ ক্যাটাগরি নির্বাচন করুন"
                        rules={{}}
                        options={
                          data?.categories?.map(
                            (program: { name: string; _id: string }) => ({
                              label: program.name,
                              value: program._id,
                            }),
                          ) || []
                        }
                      />

                      <NewsLocation
                        form={form}
                        name="newsLocation"
                        className=""
                        rules={{}}
                        setFirstPage={setFirstPage}
                        initialFirstPage={news?.firstPage}
                      />
                    </div>

                    <div className="col-span-2">
                      <TextInput
                        control={form.control}
                        name="newsTitle"
                        placeholder="শিরোনাম"
                        rules={{}}
                      />
                    </div>
                    <div className="col-span-2">
                      <TextArea
                        control={form.control}
                        name="shortDescription"
                        placeholder="সংক্ষিপ্ত বিবরণ"
                        rules={{}}
                      />
                    </div>
                    <div className="col-span-2">
                      <RichText name="description" />
                    </div>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4 col-span-full space-y-5">
                {/* Tags Section */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold">সংবাদ ট্যাগ:</h1>
                  <TextInput
                    control={form.control}
                    name="imageTagline"
                    placeholder="ইমেজ ট্যাগ লাইন"
                    rules={{}}
                  />
                </section>

                {/* News showing position */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold">
                    কোথায় ট্যাগ করতে চাচ্ছেন ?
                  </h1>
                  <MultiSelector
                    name="newsTag"
                    placeholder="ট্যাগ নির্বাচন করুন"
                    options={newsTagOption}
                  />
                </section>

                <section className="bg-white border border-gray-300 rounded p-5">
                  <RadioInput
                    title="ক্যারেন্ট নিউজ হিসেবে রাখতে চাচ্ছেন ?"
                    name="currentNews"
                    value={currentNews}
                    onChange={(value: boolean) => {
                      setCurrentNews(value);
                      form.setValue("currentNews", value);
                    }}
                  />
                </section>

                {/* Admin Section */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold">Admin Section:</h1>
                  <div className="space-y-3">
                    <TextInput
                      control={form.control}
                      name="adminName"
                      placeholder="Admin Name"
                      rules={{}}
                    />
                    <DateTimeInput
                      control={form.control}
                      name="publishedDate"
                      label="Publish Date"
                      type="datetime-local"
                      rules={{}}
                    />
                  </div>
                </section>

                {/* SEO Section */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold">SEO Section:</h1>
                  <div className="space-y-3">
                    <TextInput
                      control={form.control}
                      name="metaTitle"
                      label="Meta Title"
                      type="text"
                      placeholder="Enter Meta Title"
                      rules={{}}
                    />
                    <TextArea
                      control={form.control}
                      name="metaDescription"
                      label="Meta Description"
                      placeholder="Enter Meta Description"
                      rules={{}}
                    />
                    <TagSelector name="metaKeywords" label="Meta Keywords" />
                  </div>
                </section>
              </div>
            </div>

            {/* Submit Section */}
            <section className="my-4 flex justify-end">
              <Button type="submit" className="w-[400px] text-white">
                Update
              </Button>
            </section>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Page;
