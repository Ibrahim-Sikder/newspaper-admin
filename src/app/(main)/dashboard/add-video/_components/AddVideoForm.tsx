/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCreateNewsMutation } from "@/redux/dailynews/news.api";
import AllImgModal from "@/components/Shared/AllImagesModal/AllImgModal";
import { useGetAllCategoriesQuery } from "@/redux/dailynews/category.api";
import SelecteWithSearch from "@/utils/Form_Inputs/SelecteWithSearch";
import TagSelector from "@/utils/Form_Inputs/TagSelector";
import RadioInput from "@/utils/Form_Inputs/RadioInput";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import MultiSelector from "@/utils/Form_Inputs/MultiSelector";
import {
  districtOption,
  divisionOption,
  newsTagOption,
  reporterTypeOption,
  upazilaOption,
} from "@/utils/options";
import toast from "react-hot-toast";
import Image from "next/image";
import { useCreateVideoNewsMutation } from "@/redux/dailynews/videoNews.api ";
import NewsLocation from "@/utils/Form_Inputs/NewsLocation";

type Inputs = {
  reportedDate: string;
  reporterType: string;
  reporterName: string;
  currentNews: boolean;
  displayLocation: string;
  // firstPage: boolean;
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
  videioJornalistName: string;
  videoUrl: string;
  newsTagLine: string;
  adminName: string;
  slug: string;
  category: string;
  publishedDate: string;
  shortDescription: string;
  description: string;
  // news_tags: string | string[];

  tags: {
    newsTagLine: string;
    videioJornalistName: string;
    videoUrl: string;
  }[];

  metaTitle: string;
  metaKeywords: string | string[];
  metaDescription: string;
};

type CourseFormProps = {
  editingId?: string | undefined;
  initialData?: any | undefined | null;
};

interface FileWithPreview {
  file: File;
  preview: string;
}

const AddVideoForm = ({ editingId, initialData }: CourseFormProps) => {
  const [mainSelectedFiles, setMainSelectedFiles] = React.useState<
    { url: string }[]
  >([]);

  const [tagSelectedFiles, setTagSelectedFiles] = React.useState<
    { url: string }[][]
  >([]);

  const [createNews] = useCreateVideoNewsMutation({});
  const router = useRouter();
  const [firstPage, setFirstPage] = useState("");

  const { data, isLoading, isError } = useGetAllCategoriesQuery({});
  const [openSheetIndex, setOpenSheetIndex] = useState<number | null>(null);
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
      .then((data) => setLocationData(data));
  }, []);
  const form = useForm<Inputs>({
    defaultValues: {
      reportedDate: "",
      reporterType: "",
      reporterName: "",
      currentNews: true || false,
      displayLocation: "",
      selectedImage: "",
      imageTagline: "",
      photojournalistName: "",
      internationalArea: "",
      division: "",
      district: "",
      upazila: "",
      newsTag: "",
      newsType: "",
      newsCategory: "",
      newsTitle: "",
      adminName: "",
      videioJornalistName: "",
      videoUrl: "",
      newsTagLine: "",
      slug: "",
      category: "",
      publishedDate: "",
      shortDescription: "",
      description: "",
      tags: [{ newsTagLine: "", videioJornalistName: "", videoUrl: "" }],
      metaTitle: "",
      metaKeywords: "",
      metaDescription: "",
    },
  });

  const division = useWatch({ control: form.control, name: "division" });
  const district = useWatch({ control: form.control, name: "district" });

  useEffect(() => {
    if (division && locationData[division]) {
      setDistrictOptions(
        Object.keys(locationData[division]).map((district) => ({
          label: district,
          value: district,
        })),
      );
      form.setValue("district", ""); // Reset district
      form.setValue("upazila", ""); // Reset upazila
      setUpazilaOptions([]); // Clear upazila options
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
      form.setValue("upazila", ""); // Reset upazila
    }
  }, [district, division, locationData, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const handleImageSelect = (images: any[]) => {
    if (openSheetIndex === null) {
      setMainSelectedFiles(images.map((img) => ({ url: img.url })));
    } else {
      const newTagFiles = [...tagSelectedFiles];
      newTagFiles[openSheetIndex] = images.map((img) => ({ url: img.url }));
      setTagSelectedFiles(newTagFiles);
    }
  };

  const newsType = useWatch({
    control: form.control,
    name: "newsType",
  });

  if (isLoading) {
    return <h1>loading</h1>;
  }

  const onSubmit = async (data: Inputs) => {
    const modifyData = {
      ...data,
      category: data.category,
      postDate: new Date().toISOString(),
      images: mainSelectedFiles.map((item) => item.url).join(","),
    };

    try {
      const res = await createNews(modifyData).unwrap();
      if (res) {
        toast.success("Video News Created Successfully!");
        router.push("/dashboard/list-video-news");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* <TopBar /> */}
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
                        rules={{ required: "Reporter type is required" }}
                      />
                    </div>
                    <div>
                      <DateTimeInput
                        control={form.control}
                        type="datetime-local"
                        name="reportedDate"
                        rules={{
                          required: "Reported date and time is required",
                        }}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <TextInput
                        control={form.control}
                        name="reporterName"
                        placeholder="প্রতিনিধি নাম"
                        rules={{ required: "Reporter name is required" }}
                      />
                    </div>
                  </div>
                </section>

                {/* news type and area */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold  ">নিউজ টাইপ:</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <SelectInput
                        control={form.control}
                        name="newsType"
                        placeholder="নিউজ টাইপ নির্বাচন করুন"
                        rules={{ required: "News Type is required" }}
                        options={[
                          { label: "Bangladesh", value: "Bangladesh" },
                          { label: "International", value: "International" },
                        ]}
                      />
                    </div>

                    {newsType === "Bangladesh" && (
                      <>
                        <h1 className="mb-1 font-semibold ">নিউজ এলাকা</h1>
                        <div className="col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <SelecteWithSearch
                            name="division"
                            options={Object.keys(locationData).map(
                              (division) => ({
                                label: division,
                                value: division,
                              }),
                            )}
                            label="বিভাগ নির্বাচন করুন"
                          />

                          <SelecteWithSearch
                            name="district"
                            options={districtOptions}
                            label="জেলা নির্বাচন করুন"
                            // disabled={!division}
                          />

                          <SelecteWithSearch
                            name="upazila"
                            options={upazilaOptions}
                            label="উপজেলা নির্বাচন করুন"
                            // disabled={!district}
                          />
                          {/* <SelectorWithSearch
                            name="division"
                            options={divisionOption}
                            label="বিভাগ নির্বাচন করুন"
                          />
                          <SelectorWithSearch
                            name="district"
                            options={districtOption}
                            label="জেলা নির্বাচন করুন"
                          />
                          <SelectorWithSearch
                            name="upazila"
                            options={upazilaOption}
                            label="উপজেলা নির্বাচন করুন"
                          /> */}
                        </div>
                      </>
                    )}

                    {newsType === "International" && (
                      <>
                        <h1 className="mb-1 font-semibold ">নিউজ এলাকা</h1>
                        <div className="col-span-2">
                          <TextInput
                            control={form.control}
                            name="internationalArea"
                            placeholder="আন্তর্জাতিক এলাকা"
                            rules={{
                              required: "International area is required",
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* News Info Section */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold  ">সংবাদের তথ্য:</h1>
                  <div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="p-8 border rounded-full mb-2"
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
                          onClose={() => setOpenSheetIndex(null)}
                        />
                      </SheetContent>
                    </Sheet>
                  </div>

                  {mainSelectedFiles.map((file, index) => (
                    <Image
                      key={index}
                      src={file.url}
                      alt={`Preview ${index}`}
                      width={130}
                      height={100}
                    />
                  ))}

                  <div className="space-y-2">
                    <div className="col-span-2">
                      <TextInput
                        control={form.control}
                        rules={{ required: "Photographer name is required" }}
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
                          name="displayLocation"
                          className="mb-4"
                          rules={{ required: "News type is required" }}
                          setFirstPage={setFirstPage}
                        />
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <TextInput
                        control={form.control}
                        name="newsTitle"
                        placeholder="শিরোনাম"
                        rules={{ required: "News title is required" }}
                      />
                    </div>

                    <div className="col-span-2">
                      <TextArea
                        control={form.control}
                        name="shortDescription"
                        placeholder="সংক্ষিপ্ত বিবরণ"
                        rules={{ required: "Short Description is required" }}
                      />
                    </div>

                    <div className="col-span-2">
                      <RichText
                        name="description"
                        // placeholder={"বিস্তারিত বর্ণনা "}
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
                            rules={{
                              required: "Video Jornalist Name is required",
                            }}
                          />
                          {/* <TextInput
                            control={form.control}
                            name={`tags.${index}.videoUrl`}
                            placeholder="ভিডিও লিঙ্ক"
                            rules={{ required: "Video URL is required" }}
                          /> */}
                          <TextInput
                            control={form.control}
                            name="videoUrl"
                            // name={`tags.${index}.videoUrl`}
                            placeholder="ভিডিও লিঙ্ক"
                            rules={{
                              required: "Additional Link is required",
                              pattern: {
                                message: "Please enter a valid URL",
                              },
                            }}
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
                        rules={{ required: "Admin name is required" }}
                      />
                    </div>

                    <div className="grid grid-cols-1  gap-4">
                      <DateTimeInput
                        control={form.control}
                        name="publishedDate"
                        label="Publish Date"
                        type="datetime-local"
                        rules={{ required: "Post date is required" }}
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
                    defaultValues={initialData?.metaKeywords || []}
                  />
                </section>
              </div>
            </div>

            {/* Submit Section */}
            <section className="my-4 flex justify-end">
              <Button type="submit" className="w-[400px] text-white ">
                Submit
              </Button>
            </section>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddVideoForm;
