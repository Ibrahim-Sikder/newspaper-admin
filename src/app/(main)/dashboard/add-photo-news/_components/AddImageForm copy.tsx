/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import RichText from "@/utils/Form_Inputs/RichText";
import TextInput from "@/utils/Form_Inputs/TextInput";
import { Delete, ImageUpIcon, PlusIcon } from "lucide-react";
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
  images: string | string[];
  tagImages: string | string[];
  adminName: string;
  tags: {
    imgTagline: string;
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
      imgTagline: "",
      images: "",
      tagImages: "",
      adminName: "",
      postDate: "",

      tags: [{ imgTagline: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const appendField = () => {
    append({
      imgTagline: "",
    });
    setTagSelectedFiles([...tagSelectedFiles, []]);
  };

  const onSubmit = async (data: Inputs) => {
    const modifyData = {
      ...data,
      title: data.title,
      images: mainSelectedFiles.map((item) => item.url).join(","), // Convert to string
      tagImages: tagSelectedFiles
        .flat()
        .map((item) => item.url)
        .join(","),
    };

    try {
      const res = await createPhotoNews(modifyData).unwrap();
      if (res) {
        toast.success("Photo News Create Successfully!");
        router.push("/dashboard/list-photo-news");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeField = (index: number) => {
    remove(index);
    setTagSelectedFiles(tagSelectedFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      {/* <TopBar /> */}
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4 xl:6">
              <div className="lg:col-span-8 col-span-full space-y-3">
                {/* News Info Section */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold  ">সংবাদের তথ্য:</h1>
                  <div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="p-8 border  rounded-full mb-5"
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
                        name="title"
                        placeholder="শিরোনাম"
                        rules={{ required: "News title is required" }}
                      />
                    </div>

                    <div className="col-span-2">
                      <DailyTimesEditor name="description" />
                      {/* <RichText
                        name="description"
                        placeholder={"বিস্তারিত বর্ণনা "}
                      /> */}
                    </div>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4 col-span-full space-y-5">
                {/* Tags Section */}
                {/* Tags Section */}
                {/* <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold">সংবাদ ট্যাগ:</h1>
                  <div className="col-span-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex flex-col space-y-3">
                        <div className="flex justify-between items-center gap-2 p-4">
                          <Sheet
                            key={field.id}
                            open={openSheetIndex === index}
                            onOpenChange={(open) =>
                              setOpenSheetIndex(open ? index : null)
                            }
                          >
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
                            {index === fields.length - 1 && (
                              <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={appendField}
                              >
                                <PlusIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {tagSelectedFiles[index]?.map((file, imgIndex) => (
                          <Image
                            key={imgIndex}
                            src={file.url}
                            alt={`Preview ${imgIndex}`}
                            width={130}
                            height={100}
                          />
                        ))}

                        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-0 gap-4">
                          <TextInput
                            control={form.control}
                            name="imgTagline"
                            placeholder="ইমেজ ট্যাগ লাইন"
                            rules={{ required: "Image Tag Line is required" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section> */}
                <section className="bg-white border border-gray-300 rounded p-5">
                  <h1 className="mb-2 font-semibold  ">সংবাদ ট্যাগ:</h1>
                  <div className="col-span-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex flex-col space-y-3">
                        <div className="flex justify-between items-center gap-2 p-4">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button
                                variant="outline"
                                className="p-8 border rounded-full"
                              >
                                <ImageUpIcon color="red" size={50} />
                                Add Image
                              </Button>
                            </SheetTrigger>
                            <SheetContent
                              side="right"
                              style={{ maxWidth: "800px" }}
                            >
                              <SheetTitle className="">
                                Select News Image
                              </SheetTitle>
                              <hr />
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
                                    imgTagline: "",
                                  })
                                }
                              >
                                <PlusIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        {tagSelectedFiles[index]?.map((file, imgIndex) => (
                          <Image
                            key={imgIndex}
                            src={file.url}
                            alt={`Preview ${imgIndex}`}
                            width={130}
                            height={100}
                          />
                        ))}
                        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-0 gap-4">
                          <TextInput
                            control={form.control}
                            name="imgTagline"
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
                    <div className="grid grid-cols-1  gap-4 mt-2">
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

export default AddImageForm;
