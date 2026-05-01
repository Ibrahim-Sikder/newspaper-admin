/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import RichText from "@/utils/Form_Inputs/RichText";
import TextArea from "@/utils/Form_Inputs/TextArea";
import TextInput from "@/utils/Form_Inputs/TextInput";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import { Delete, ImageUpIcon, PlusIcon } from "lucide-react";
import DateTimeInput from "@/utils/Form_Inputs/DateTimeInput";

import AllImgModal from "@/components/Shared/AllImagesModal/AllImgModal";
import { useGetAllCategoriesQuery } from "@/redux/dailynews/category.api";
import SelecteWithSearch from "@/utils/Form_Inputs/SelecteWithSearch";
import TagSelector from "@/utils/Form_Inputs/TagSelector";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { use, useEffect, useState } from "react";

import {
  districtOption,
  divisionOption,
  newsTagOption,
  reporterTypeOption,
  upazilaOption,
} from "@/utils/options";
import toast from "react-hot-toast";
import TopBar from "../../_components/TopBar";
import Image from "next/image";
import Loading from "@/app/loading";
import UpdateTopBar from "../../_components/UpdateTopBar";
import {
  useGetSingleVideoNewsQuery,
  useUpdateVideoNewsMutation,
} from "@/redux/dailynews/videoNews.api ";
import NewsLocation from "@/utils/Form_Inputs/NewsLocation";

type Inputs = {
  reportedDate: string;
  reporterType: string;
  reporterName: string;
  currentNews: boolean;
  displayLocation: string;
  selectedImage: string;
  imageTagline: string;
  photojournalistName: string;
  internationalArea: string;
  division: string;
  district: string;
  upazila: string;
  newsType: string;
  newsTitle: string;
  adminName: string;
  slug: string;
  category: string;
  publishedDate: string;
  shortDescription: string;
  description: string;
  videioJornalistName: string;
  videoUrl: string;
  newsTagLine: string;
  tags: {
    newsTagLine: string;
    videioJornalistName: string;
    videoUrl: string;
  }[];
  metaTitle: string;
  metaKeywords: string | string[];
  metaDescription: string;
};

type newsProps = {
  params: Promise<{ id: string }>;
};

const Update = ({ params }: newsProps) => {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetAllCategoriesQuery({});
  const router = useRouter();
  const [firstPage, setFirstPage] = useState("");
  const [updateVideoNews] = useUpdateVideoNewsMutation();
  const { data: singleData } = useGetSingleVideoNewsQuery(id);

  const [mainSelectedFiles, setMainSelectedFiles] = React.useState<
    { url: string }[]
  >([]);

  const [openSheetIndex, setOpenSheetIndex] = useState<number | null>(null);

  const form = useForm<Inputs>({
    defaultValues: {
      reportedDate: "",
      reporterType: "",
      reporterName: "",
      currentNews: false,
      displayLocation: "",
      selectedImage: "",
      imageTagline: "",
      photojournalistName: "",
      internationalArea: "",
      division: "",
      district: "",
      upazila: "",
      videioJornalistName: "",
      videoUrl: "",
      newsTagLine: "",
      // newsTag: "",
      newsType: "",
      newsTitle: "",
      adminName: "",
      slug: "",
      category: "",
      publishedDate: "",
      shortDescription: "",
      description: "",
      tags: [{ newsTagLine: "", videioJornalistName: "", videoUrl: "" }],
      metaTitle: "",
      metaKeywords: [],
      metaDescription: "",
    },
  });

  useEffect(() => {
    if (singleData && Object.keys(singleData).length > 0) {
      const formatDate = (isoString: string) =>
        isoString ? isoString.slice(0, 16) : "";

      form.reset({
        reportedDate: formatDate(singleData.reportedDate),
        // reportedDate: singleData.reportedDate || "",
        reporterType: singleData.reporterType || "own_representative",
        reporterName: singleData.reporterName || "",
        currentNews: singleData.currentNews || false,
        displayLocation: singleData.displayLocation || "",
        selectedImage: singleData.images?.[0] || "",
        imageTagline: singleData.imageTagline || "",
        photojournalistName: singleData.photojournalistName || "",
        internationalArea: singleData.internationalArea || "",
        division: singleData.division || "",
        district: singleData.district || "",
        upazila: singleData.upazila || "",
        // newsTag: singleData.newsTag || [],
        newsType: singleData.newsType || "",
        newsTitle: singleData.newsTitle || "",
        adminName: singleData.adminName || "",
        slug: singleData.slug || "",
        category: singleData.category || "",
        publishedDate: formatDate(singleData.publishedDate),
        shortDescription: singleData.shortDescription || "",
        description: singleData.description || "",

        videioJornalistName: singleData.description || "",
        videoUrl: singleData.videoUrl || "",
        newsTagLine: singleData.newsTagLine || "",

        tags: singleData.tags || [
          { imageTagline: "", photojournalistName: "", selectedImage: "" },
        ],
        metaTitle: singleData.metaTitle || "",
        metaKeywords: singleData.metaKeywords || [],
        metaDescription: singleData.metaDescription || "",
      });

      const mainImages =
        singleData.images?.map((url: string) => ({ url })) || [];
      setMainSelectedFiles(mainImages);

      // Initialize tag images from API
      // const initialTagFiles =
      //   singleData.tags?.map((tag: any) =>
      //     tag.selectedImage ? [{ url: tag.selectedImage }] : []
      //   ) || [];
      // setTagSelectedFiles(initialTagFiles);
    }
  }, [singleData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const newsType = useWatch({
    control: form.control,
    name: "newsType",
  });

  const onSubmit = async (data: Inputs) => {
    const modifyData = {
      ...data,
      category: data.category,
      postDate: new Date().toISOString(),
      images: mainSelectedFiles.map((item) => item.url),
    };

    try {
      const res = await updateVideoNews({ ...modifyData, id }).unwrap();

      if (res) {
        toast.success("Video News Update Successfully!");
        router.push("/dashboard/list-video-news");
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
    }
    // else {
    //   const newTagFiles = [...tagSelectedFiles];
    //   newTagFiles[openSheetIndex] = images;
    //   setTagSelectedFiles(newTagFiles);
    // }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <UpdateTopBar />
      <div>
        <Form {...form}>
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
                    />
                  </div>
                  <div>
                    <DateTimeInput
                      control={form.control}
                      type="datetime-local"
                      name="reportedDate"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <TextInput
                      control={form.control}
                      name="reporterName"
                      placeholder="প্রতিনিধি নাম"
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
                          options={divisionOption}
                          label="বিভাগ নির্বাচন করুন"
                        />
                        <SelecteWithSearch
                          name="district"
                          options={districtOption}
                          label="জেলা নির্বাচন করুন"
                        />
                        <SelecteWithSearch
                          name="upazila"
                          options={upazilaOption}
                          label="উপজেলা নির্বাচন করুন"
                        />
                      </div>
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
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="p-8 border rounded-full mb-5"
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
                <div className="grid grid-cols-2 md:grid-cols-6 mb-4 ">
                  {mainSelectedFiles.map((file, index) => (
                    <div key={index} className="rounded-lg">
                      <Image
                        src={file.url}
                        alt={`Preview ${index}`}
                        width={100}
                        height={0}
                        className="h-[150px] w-[150px] rounded-lg"
                      />
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
                      />
                    </div>

                    <SelectInput
                      control={form.control}
                      name="category"
                      placeholder="নিউজ ক্যাটাগরি নির্বাচন করুন"
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
                      name="displayLocation"
                      className="mb-4"
                      setFirstPage={setFirstPage}
                    />
                  </div>

                  <div className="col-span-2">
                    <TextInput
                      control={form.control}
                      name="newsTitle"
                      placeholder="শিরোনাম"
                    />
                  </div>
                  <div className="col-span-2">
                    <TextArea
                      control={form.control}
                      name="shortDescription"
                      placeholder="সংক্ষিপ্ত বিবরণ"
                    />
                  </div>
                  <div className="col-span-2">
                    <RichText
                      name="description"
                      placeholder="বিস্তারিত বর্ণনা"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 col-span-full space-y-5">
              {/* Tags Section */}
              <section className="bg-white border border-gray-300 rounded p-5">
                <h1 className="mb-2 font-semibold text-blue-500">
                  ভিডিও ট্যাগ:
                </h1>
                <div className="col-span-2">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <div key={index} className="grid grid-cols-1 gap-4">
                        <TextInput
                          control={form.control}
                          name="videioJornalistName"
                          // name={`tags.${index}.videioJornalistName`}
                          placeholder="ভিডিও সাংবাদিকের নাম"
                        />

                        <TextInput
                          control={form.control}
                          name="videoUrl"
                          // name={`tags.${index}.videoUrl`}
                          placeholder="ভিডিও লিঙ্ক"
                        />
                        <TextInput
                          control={form.control}
                          name="newsTagLine"
                          // name={`tags.${index}.newsTagLine`}
                          placeholder="সংবাদ ট্যাগ লাইন"
                        />
                      </div>
                      <div className="flex justify-end gap-4 py-2">
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <Delete className="w-4 h-4" />
                          </Button>
                        )}
                        {index === fields.length - 1 && (
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={() =>
                              append({
                                videoUrl: "",
                                videioJornalistName: "",
                                newsTagLine: "",
                              })
                            }
                          >
                            <PlusIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Admin Section */}
              <section className="bg-white border border-gray-300 rounded p-5">
                <h1 className="mb-2 font-semibold ">Admin Section:</h1>
                <div className="col-span-2">
                  <div className="col-span-2">
                    <TextInput
                      control={form.control}
                      name="adminName"
                      placeholder="Admin Name"
                    />
                  </div>

                  <div className="grid grid-cols-1  gap-4">
                    <DateTimeInput
                      control={form.control}
                      name="publishedDate"
                      label="Publish Date"
                      type="datetime-local"
                    />
                  </div>
                </div>
              </section>

              {/* SEO Section */}
              <section className="bg-white border border-gray-300 rounded p-5">
                <h1 className="mb-2 font-semibold ">SEO Section:</h1>

                <TextInput
                  control={form.control}
                  name="metaTitle"
                  label="Meta Title"
                  type="text"
                  placeholder="Enter Meta Title"
                />
                <TextArea
                  control={form.control}
                  name="metaDescription"
                  label="Meta Description"
                  placeholder="Enter Meta Description"
                />

                <TagSelector
                  name="metaKeywords"
                  label="Meta Keywords"
                  // defaultValues={singleData?.metaKeywords || []}
                />
              </section>
            </div>
          </div>

          {/* Submit Section */}
          <section className="my-4 flex justify-end">
            <Button
              type="submit"
              className="w-[400px] text-white "
              onClick={form.handleSubmit(onSubmit)}
            >
              Update
            </Button>
          </section>
        </Form>
      </div>
    </>
  );
};

export default Update;
