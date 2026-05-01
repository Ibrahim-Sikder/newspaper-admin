/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TextArea from "@/utils/Form_Inputs/TextArea";
import TextInput from "@/utils/Form_Inputs/TextInput";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import { CircleX, ImageUpIcon } from "lucide-react";
import DateTimeInput from "@/utils/Form_Inputs/DateTimeInput";
import { useCreateNewsMutation } from "@/redux/dailynews/news.api";
import AllImgModal from "@/components/Shared/AllImagesModal/AllImgModal";
import { useGetAllCategoriesQuery } from "@/redux/dailynews/category.api";
import TagSelector from "@/utils/Form_Inputs/TagSelector";
import RadioInput from "@/utils/Form_Inputs/RadioInput";
import { useForm, useWatch } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { useState, useEffect } from "react";
import MultiSelector from "@/utils/Form_Inputs/MultiSelector";
import { newsTagOption, reporterTypeOption } from "@/utils/options";
import toast from "react-hot-toast";
import Image from "next/image";
import DailyTimesEditor from "@/utils/Form_Inputs/JodiEditor";
import SelecteWithSearch from "@/utils/Form_Inputs/SelecteWithSearch";
import NewsLocation from "@/utils/Form_Inputs/NewsLocation";
import { CourseFormProps, Inputs } from "@/types/news";

const AddNews = ({ initialData }: CourseFormProps) => {
  const [mainSelectedFiles, setMainSelectedFiles] = React.useState<
    { url: string }[]
  >([]);

  const [tagSelectedFiles, setTagSelectedFiles] = React.useState<
    { url: string }[][]
  >([]);

  const [createNews] = useCreateNewsMutation({});

  const router = useRouter();

  const [firstPage, setFirstPage] = useState(""); // Remove this line if not needed

  const [currentNews, setCurrentNews] = useState<boolean>(
    initialData?.currentNews || false,
  );

  const [localNews, setLocalNews] = useState<boolean>(
    initialData?.localNews || false,
  );

  const { data, isLoading, isError } = useGetAllCategoriesQuery({});

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

  const now = new Date();
  const formattedNow = now.toISOString().slice(0, 16);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load location data
  useEffect(() => {
    fetch("/data/location.json")
      .then((res) => res.json())
      .then((data) => setLocationData(data));
  }, []);

  const form = useForm<Inputs>({
    defaultValues: {
      category: initialData?.category?._id || "",
      newsCategory: initialData?.newsCategory || "",
      reportedDate: formattedNow,
      reporterType: initialData?.reporterType || "",
      reporterName: initialData?.reporterName || "",
      currentNews: initialData?.currentNews || false,
      localNews: initialData?.localNews || false,
      newsLocation: initialData?.newsLocation || "",
      selectedImage: initialData?.selectedImage || "",
      imageTagline: initialData?.imageTagline || "",
      photojournalistName: initialData?.photojournalistName || "",
      internationalArea: initialData?.internationalArea || "",
      division: initialData?.division || "",
      district: initialData?.district || "",
      upazila: initialData?.upazila || "",
      newsTag: initialData?.newsTag || "",
      newsType: initialData?.newsType || "",
      newsTitle: initialData?.newsTitle || "",
      adminName: initialData?.adminName || "",
      slug: initialData?.slug || "",
      publishedDate: initialData?.publishedDate || "",
      shortDescription: initialData?.shortDescription || "",
      description: initialData?.description || "",
      tags: initialData?.tags || [
        { imageTagline: "", photojournalistName: "", selectedImage: "" },
      ],
      metaTitle: initialData?.metaTitle || "",
      metaKeywords: initialData?.metaKeywords || "",
      metaDescription: initialData?.metaDescription || "",
    },
  });

  const division = useWatch({ control: form.control, name: "division" });
  const district = useWatch({ control: form.control, name: "district" });
  const newsType = useWatch({ control: form.control, name: "newsType" });
  const category = useWatch({ control: form.control, name: "category" });

  useEffect(() => {
    if (division && locationData[division]) {
      setDistrictOptions(
        Object.keys(locationData[division]).map((district) => ({
          label: district,
          value: district,
        })),
      );
      form.setValue("district", "");
      form.setValue("upazila", "");
      setUpazilaOptions([]);
    }
  }, [division, locationData, form]);

  useEffect(() => {
    if (district && division && locationData[division][district]) {
      setUpazilaOptions(
        locationData[division][district].map((upazila) => ({
          label: upazila,
          value: upazila,
        })),
      );
      form.setValue("upazila", "");
    }
  }, [district, division, locationData, form]);

  // Update newsCategory when category changes
  useEffect(() => {
    if (category && data?.categories) {
      const selectedCategory = data.categories.find(
        (cat: any) => cat._id === category,
      );
      if (selectedCategory) {
        form.setValue("newsCategory", selectedCategory.name);
      }
    }
  }, [category, data]);

  const handleImageSelect = (images: any[]) => {
    if (openSheetIndex === null) {
      setMainSelectedFiles(images.map((img) => ({ url: img.url })));
    } else {
      const newTagFiles = [...tagSelectedFiles];
      newTagFiles[openSheetIndex] = images.map((img) => ({ url: img.url }));
      setTagSelectedFiles(newTagFiles);
    }
    setSheetOpen(false);
  };

  if (isLoading) {
    return <h1>loading</h1>;
  }

  const onSubmit = async (formData: Inputs) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Find the selected category name from categories data
      const selectedCategory = data?.categories?.find(
        (cat: any) => cat._id === formData.category,
      );

      const modifyData: Record<string, any> = {
        ...formData,
        currentNews: Boolean(formData.currentNews),
        localNews: Boolean(formData.localNews),
        metaKeywords: Array.isArray(formData.metaKeywords)
          ? formData.metaKeywords
          : [formData.metaKeywords].filter(Boolean),
        category: formData.category,
        newsCategory: selectedCategory?.name || "", // Add the category name
        postDate: new Date().toISOString(),
        images: mainSelectedFiles.map((item) => item.url),
        slug: formData.newsTitle.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-"),
        publishedNews: true,
        // Add firstPage as false by default since it's required
        firstPage: false, // Add this line
      };

      // Remove any undefined or empty fields
      Object.keys(modifyData).forEach((key) => {
        if (modifyData[key] === undefined || modifyData[key] === "") {
          delete modifyData[key];
        }
      });

      // Remove the tags array if it's empty or has empty objects
      if (modifyData.tags && Array.isArray(modifyData.tags)) {
        const hasContent = modifyData.tags.some(
          (tag: any) =>
            tag.imageTagline || tag.photojournalistName || tag.selectedImage,
        );
        if (!hasContent) {
          delete modifyData.tags;
        }
      }

      const res = await createNews(modifyData).unwrap();

      if (res) {
        toast.success("News Created Successfully!");
        router.push("/dashboard/list-news");
        return;
      }
    } catch (error: any) {
      console.error("Submission error:", error);

      // Handle specific error messages
      if (error?.data?.errorSources && Array.isArray(error.data.errorSources)) {
        error.data.errorSources.forEach((err: any) => {
          toast.error(`${err.message}`);
        });
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/");
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <Form {...form}>
          <div className="grid grid-cols-12 gap-4 xl:6">
            <div className="lg:col-span-8 col-span-full space-y-3">
              {/* Reporter Section */}
              <section className="bg-white border border-gray-300 rounded p-3 lg:p-5">
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
                      rules={{ required: "Reported date and time is required" }}
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

              {/* News Type Section */}
              <section className="bg-white border border-gray-300 rounded p-3 lg:p-5">
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
                      <div className="grid grid-cols-1 lg:grid-cols-3 col-span-2 gap-4">
                        <SelecteWithSearch
                          name="division"
                          options={Object.keys(locationData).map(
                            (division) => ({
                              label: division,
                              value: division,
                            }),
                          )}
                          label="বিভাগ নির্বাচন করুন"
                          onChange={(value) => {
                            form.setValue("district", "");
                            form.setValue("upazila", "");
                            setUpazilaOptions([]);

                            if (value && locationData[value]) {
                              setDistrictOptions(
                                Object.keys(locationData[value]).map(
                                  (district) => ({
                                    label: district,
                                    value: district,
                                  }),
                                ),
                              );
                            } else {
                              setDistrictOptions([]);
                            }
                          }}
                        />

                        <SelecteWithSearch
                          name="district"
                          options={districtOptions}
                          label="জেলা নির্বাচন করুন"
                          onChange={(value) => {
                            form.setValue("upazila", "");

                            const currentDivision = form.getValues("division");
                            if (
                              value &&
                              currentDivision &&
                              locationData[currentDivision][value]
                            ) {
                              setUpazilaOptions(
                                locationData[currentDivision][value].map(
                                  (upazila) => ({
                                    label: upazila,
                                    value: upazila,
                                  }),
                                ),
                              );
                            } else {
                              setUpazilaOptions([]);
                            }
                          }}
                        />

                        <SelecteWithSearch
                          name="upazila"
                          options={upazilaOptions}
                          label="উপজেলা নির্বাচন করুন"
                        />

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
              <section className="bg-white border border-gray-300 rounded p-3 lg:p-5">
                <h1 className="mb-2 font-semibold">সংবাদের তথ্য:</h1>
                <div>
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="p-8 border rounded-full mb-2"
                        onClick={() => setSheetOpen(true)}
                      >
                        <ImageUpIcon color="red" size={50} /> Add Image
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="pt-4 overflow-y-auto"
                      style={{ maxWidth: "800px" }}
                    >
                      <SheetTitle>সংবাদের তথ্য</SheetTitle>
                      <AllImgModal
                        onImageSelect={handleImageSelect}
                        onClose={() => setSheetOpen(false)}
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
                  <div className="col-span-2">
                    <TextInput
                      control={form.control}
                      name="photojournalistName"
                      placeholder="ফটো সাংবাদিক নাম"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div>
                      <SelectInput
                        control={form.control}
                        name="category"
                        placeholder="নিউজ ক্যাটাগরি নির্বাচন করুন"
                        rules={{ required: "News Category is required" }}
                        options={
                          data?.categories?.map(
                            (program: { name: string; _id: string }) => ({
                              label: program.name,
                              value: program._id,
                            }),
                          ) || []
                        }
                      />
                    </div>
                    <div>
                      <NewsLocation
                        form={form}
                        name="newsLocation"
                        className=""
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <TextInput
                        control={form.control}
                        name="newsTitle"
                        placeholder="শিরোনাম"
                        rules={{ required: "News title is required" }}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <TextArea
                      control={form.control}
                      name="shortDescription"
                      placeholder="সংক্ষিপ্ত বিবরণ"
                    />
                  </div>

                  <div className="col-span-2">
                    <DailyTimesEditor name="description" />
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 col-span-full space-y-5">
              {/* Tags Section */}
              <section className="bg-white border border-gray-300 rounded p-3 lg:p-5">
                <h1 className="mb-2 font-semibold">সংবাদ ট্যাগ:</h1>
                <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-0 gap-4">
                  <TextInput
                    control={form.control}
                    name="imageTagline"
                    placeholder="ইমেজ ট্যাগ লাইন"
                  />
                </div>
              </section>

              {/* News Showing Position */}
              <section className="bg-white border border-gray-300 rounded p-3 lg:p-5">
                <h1 className="mb-2 font-semibold">
                  কোথায় ট্যাগ করতে চাচ্ছেন ?
                </h1>
                <MultiSelector
                  name="newsTag"
                  placeholder="ট্যাগ নির্বাচন করুন"
                  options={newsTagOption}
                />
              </section>

              <section className="bg-white border border-gray-300 rounded p-3 lg:p-5 pb-5 lg:pb-5">
                <RadioInput
                  title={"ক্যারেন্ট নিউজ হিসেবে রাখতে চাচ্ছেন ?"}
                  name="currentNews"
                  value={currentNews}
                  onChange={(value: boolean) => {
                    setCurrentNews(value);
                    form.setValue("currentNews", value);
                  }}
                />
              </section>

              {/* Admin Section */}
              <section className="bg-white border border-gray-300 rounded p-3 lg:p-5">
                <h1 className="mb-2 font-semibold">Admin Section:</h1>
                <div className="col-span-2">
                  <div className="col-span-2">
                    <TextInput
                      control={form.control}
                      name="adminName"
                      placeholder="Admin Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-2">
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
              <section className="bg-white border border-gray-300 rounded p-3 lg:p-5">
                <h1 className="mb-2 font-semibold">SEO Section:</h1>
                <div className="col-span-2">
                  <TextInput
                    control={form.control}
                    name="metaTitle"
                    label="Meta Title"
                    type="text"
                    placeholder="Enter Meta Title"
                  />
                </div>
                <div className="col-span-2">
                  <TextArea
                    control={form.control}
                    name="metaDescription"
                    label="Meta Description"
                    placeholder="Enter Meta Description"
                  />
                </div>
                <div className="col-span-2">
                  <TagSelector
                    name="metaKeywords"
                    label="Meta Keywords"
                    defaultValues={initialData?.metaKeywords || []}
                  />
                </div>
              </section>
            </div>
          </div>

          {/* Submit Button */}
          <section className="my-4 flex justify-end">
            <Button
              type="submit"
              className="w-[400px] text-white"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Submit"}
            </Button>
          </section>
        </Form>
      </div>
    </>
  );
};

export default AddNews;
