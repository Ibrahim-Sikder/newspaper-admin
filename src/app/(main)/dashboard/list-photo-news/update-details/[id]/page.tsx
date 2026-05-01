/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  useGetPhotoNewsByIDQuery,
  useUpdatePhotoNewsMutation,
} from "@/redux/dailynews/photoNews.api";
import DateTimeInput from "@/utils/Form_Inputs/DateTimeInput";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import UpdateTopBar from "../../_components/UpdateTopBar";

type Inputs = {
  title: string;
  description: string;
  imgTagline: string;
  images: string | string[];
  photos: string | string[];
  selectedImage: string;
  adminName: string;
  galleries: {
    imageTagline: string;
    photos: string[];
  }[];
  postDate: string;
};

type newsProps = {
  params: Promise<{ id: string }>;
};

const Update = ({ params }: newsProps) => {
  const { id } = use(params);
  const [updatePhotoNews] = useUpdatePhotoNewsMutation();
  const { data: singleData } = useGetPhotoNewsByIDQuery(id);

  const [mainSelectedFiles, setMainSelectedFiles] = React.useState<
    { url: string }[]
  >([]);
  const [tagSelectedFiles, setTagSelectedFiles] = React.useState<
    { url: string }[][]
  >([]);
  const [openSheetIndex, setOpenSheetIndex] = useState<number | null>(null);

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
      images: [],
      photos: [],
      adminName: "",
      postDate: "",
      selectedImage: "",
      galleries: [{ imageTagline: "", photos: [] }],
    },
  });

  useEffect(() => {
    if (singleData && Object.keys(singleData).length > 0) {
      const formatDate = (isoString: string) =>
        isoString ? isoString.slice(0, 16) : "";

      form.reset({
        title: singleData.title || "",
        imgTagline: singleData.imgTagline || "",
        photos: singleData.tagImages || "",
        adminName: singleData.adminName || "",
        postDate: formatDate(singleData.postDate),
        description: singleData.description || "",
        selectedImage: singleData.images?.[0] || "",
        galleries: singleData.galleries.map((gallery: any) => ({
          imageTagline: gallery.imageTagline,
          photos: gallery.photos, // Directly mapping the photos array
        })),
      });

      // Handle main images
      const images = singleData.images?.map((url: string) => ({ url })) || [];
      setMainSelectedFiles(images);

      // Handle tag images
      const tagImagesArray: { url: string }[][] = singleData.galleries.map(
        (gallery: any) => gallery.photos.map((url: string) => ({ url })),
      );
      setTagSelectedFiles(tagImagesArray);
    }
  }, [singleData, form]);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "galleries",
  });

  const onSubmit = async (data: Inputs) => {
    const modifyData = {
      ...data,
      _id: id,
      postDate: new Date(data.postDate).toISOString(),
      images: mainSelectedFiles.map((item) => item.url),
      galleries: data.galleries.map((gallery, index) => ({
        imageTagline: gallery.imageTagline,
        photos: tagSelectedFiles[index]?.map((item) => item.url) || [],
      })),
    };

    try {
      const res = await updatePhotoNews({ ...modifyData, id }).unwrap();

      if (res) {
        toast.success("Photo News Update Successfully!");
        router.push("/dashboard/list-photo-news");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const appendField = () => {
    append({
      imageTagline: "",
      photos: [],
    });
    setTagSelectedFiles([...tagSelectedFiles, []]);
  };

  const removeField = (index: number) => {
    remove(index);
    setTagSelectedFiles(tagSelectedFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <UpdateTopBar />
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

                <div className="flex flex-wrap gap-4 mb-2">
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
                      name="title"
                      placeholder="শিরোনাম"
                      rules={{ required: "News title is required" }}
                    />
                  </div>

                  <div className="col-span-2">
                    <RichText
                      name="description"
                      placeholder={"বিস্তারিত বর্ণনা "}
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4 col-span-full space-y-5">
              {/* Tags Section */}
              <section className="bg-white border border-gray-300 rounded p-5">
                <h1 className="mb-2 font-semibold">সংবাদ ট্যাগ:</h1>
                <div className="col-span-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col space-y-3">
                      <div className="flex justify-between items-center gap-2 pt-2 lg:p-4">
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

                      {/* Tag Image Display */}
                      <div className="flex flex-wrap gap-4 rounded-md">
                        {tagSelectedFiles[index]?.map((file, imgIndex) => (
                          <div key={index} className="relative rounded group">
                            <Image
                              key={imgIndex}
                              src={file.url}
                              alt={`Preview ${imgIndex}`}
                              width={130}
                              height={100}
                              className="h-[100px] w-[150px] rounded-lg object-cover"
                            />

                            <button
                              onClick={() => {
                                setTagSelectedFiles((files) =>
                                  files.filter((_, i) => i !== index),
                                );
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full "
                            >
                              <CircleX />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-0 gap-4">
                        <TextInput
                          control={form.control}
                          name={`galleries.${index}.imageTagline`}
                          placeholder="ইমেজ ট্যাগ লাইন"
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
                    />
                  </div>
                  <div className="grid grid-cols-1  gap-4 mt-2">
                    <DateTimeInput
                      control={form.control}
                      name="postDate"
                      label="Post Date"
                      type="datetime-local"
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
