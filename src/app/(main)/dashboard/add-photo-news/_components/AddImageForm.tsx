/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import RichText from "@/utils/Form_Inputs/RichText";
import TextInput from "@/utils/Form_Inputs/TextInput";
import { CircleX, Delete, ImageUpIcon, PlusIcon } from "lucide-react";
import AllImgModal from "@/components/Shared/AllImagesModal/AllImgModal";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import toast from "react-hot-toast";
import { useCreatePhotoNewsMutation } from "@/redux/dailynews/photoNews.api";
import DateTimeInput from "@/utils/Form_Inputs/DateTimeInput";
import React, { useState } from "react";
import Image from "next/image";
import DailyTimesEditor from "@/utils/Form_Inputs/JodiEditor";

type Inputs = {
  title: string;
  description: string;
  imgTagline: string;
  images: string[];
  photos: string[];
  adminName: string;
  galleries: {
    imageTagline: string;
    photos: string[];
  }[];
  postDate: string;
};

const AddImageForm = () => {
  const [mainSelectedFiles, setMainSelectedFiles] = React.useState<
    { url: string }[]
  >([]);
  const [tagSelectedFiles, setTagSelectedFiles] = React.useState<
    { url: string }[][]
  >([]);
  const [openSheetIndex, setOpenSheetIndex] = useState<number | null>(null);
  const [createPhotoNews] = useCreatePhotoNewsMutation({});
  const router = useRouter();

  const handleImageSelect = (images: any[]) => {
    if (openSheetIndex === null) {
      setMainSelectedFiles(images.map((img) => ({ url: img.url })));
    } else {
      const newTagFiles = [...tagSelectedFiles];
      newTagFiles[openSheetIndex] = images.map((img) => ({ url: img.url }));
      setTagSelectedFiles(newTagFiles);
    }
  };

  const form = useForm<Inputs>({
    defaultValues: {
      title: "",
      description: "",

      images: [],
      photos: [],
      adminName: "",
      postDate: "",
      galleries: [{ imageTagline: "", photos: [] }],
    },
  });

  const onSubmit = async (data: Inputs) => {
    const modifyData = {
      ...data,
      postDate: new Date(data.postDate).toISOString(),
      images: mainSelectedFiles.map((item) => item.url),
      galleries: data.galleries.map((gallery, index) => ({
        imageTagline: gallery.imageTagline,
        photos: tagSelectedFiles[index]?.map((item) => item.url) || [],
      })),
    };

    try {
      const res = await createPhotoNews(modifyData).unwrap();
      console.log("API Response:", res);
      if (res) {
        toast.success("Photo News Created Successfully!");
        router.push("/dashboard/list-photo-news");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { fields, append, remove, insert } = useFieldArray({
    control: form.control,
    name: "galleries",
  });

  const appendField = (index: number) => {
    insert(index + 1, { imageTagline: "", photos: [] });

    const newTagFiles = [...tagSelectedFiles];
    newTagFiles.splice(index + 1, 0, []);
    setTagSelectedFiles(newTagFiles);
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      setTagSelectedFiles(tagSelectedFiles.filter((_, i) => i !== index));
    } else {
      toast.error("Cannot remove the last section!");
    }
  };

  return (
    <>
      <div>
        <Form {...form}>
          <div className="grid grid-cols-12 gap-4 xl:6">
            <div className="lg:col-span-8 col-span-full space-y-3">
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
                      className="pt-4 overflow-y-auto"
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
                        className="h-[150px] w-[150px] rounded-lg object-cover"
                      />
                      <button
                        onClick={() => {
                          setMainSelectedFiles((files) =>
                            files.filter((_, i) => i !== index),
                          );
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 "
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
                      name="title"
                      placeholder="শিরোনাম"
                      rules={{ required: "News title is required" }}
                    />
                  </div>

                  <div className="col-span-2">
                    <DailyTimesEditor name="description" />
                    {/* <RichText
                      name="description"
                      placeholder={"বিস্তারিত বর্ণনা"}
                    /> */}
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 col-span-full space-y-5">
              {/* Tags Section */}
              <section className="bg-white border border-gray-300 rounded p-5 ">
                <h1 className="mb-2 font-semibold">সংবাদ ট্যাগ:</h1>
                <div className="col-span-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col lg:space-y-3">
                      <div className="flex justify-between items-center gap-1 lg:gap-2 p-0 lg:p-4">
                        <Sheet
                          open={openSheetIndex === index}
                          onOpenChange={(open) =>
                            setOpenSheetIndex(open ? index : null)
                          }
                        >
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              className=" lg:px-8 py-8  border rounded-full mb-2"
                            >
                              <ImageUpIcon color="red" size={50} /> Add Image
                            </Button>
                          </SheetTrigger>
                          <SheetContent
                            side="right"
                            className="pt-4 overflow-y-auto"
                            style={{ maxWidth: "800px" }}
                          >
                            <SheetTitle>সংবাদ ট্যাগ</SheetTitle>
                            <AllImgModal
                              onImageSelect={(images: any) => {
                                const newTagFiles = [...tagSelectedFiles];
                                newTagFiles[index] = images;
                                setTagSelectedFiles(newTagFiles);
                              }}
                              onClose={() => setOpenSheetIndex(null)}
                            />
                          </SheetContent>
                        </Sheet>

                        <div className="flex justify-end gap-2">
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeField(index)}
                            >
                              <Delete className="w-4 h-4" />
                            </Button>
                          )}
                          {/* <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeField(index)}
                          >
                            <Delete className="w-4 h-4" />
                          </Button> */}

                          {/* Add button for every field */}
                          <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={() => appendField(index)}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {tagSelectedFiles[index]?.map((file, imgIndex) => (
                          <div
                            key={index}
                            className="relative rounded-lg group"
                          >
                            <Image
                              key={imgIndex}
                              src={file.url}
                              alt={`Preview ${imgIndex}`}
                              width={130}
                              height={100}
                            />

                            <button
                              onClick={() => {
                                setTagSelectedFiles((files) =>
                                  files.filter((_, i) => i !== index),
                                );
                              }}
                              // className="absolute top-0 right-0 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full"
                            >
                              <CircleX />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-0 gap-4 pb-2">
                        <TextInput
                          control={form.control}
                          name={`galleries.${index}.imageTagline`}
                          placeholder="ইমেজ ট্যাগ লাইন"
                          rules={{ required: "Image Tag Line is required" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Admin Section */}
              <section className="bg-white border border-gray-300 rounded p-5">
                <h1 className="mb-2 font-semibold">Admin Section:</h1>
                <div className="col-span-2">
                  <div className="col-span-2">
                    <TextInput
                      control={form.control}
                      name="adminName"
                      placeholder="Admin Name"
                      rules={{ required: "Admin name is required" }}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-2">
                    <DateTimeInput
                      control={form.control}
                      name="postDate"
                      label="Post Date"
                      type="datetime-local"
                      rules={{ required: "Post date is required" }}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Submit Section */}
          <section className="my-4 flex justify-end">
            <Button
              type="submit"
              className="w-[400px] text-white"
              onClick={form.handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </section>
        </Form>
      </div>
    </>
  );
};

export default AddImageForm;
