/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import AllImgModal from "@/components/Shared/AllImagesModal/AllImgModal";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TextInput from "@/utils/Form_Inputs/TextInput";
import { CircleX, ImageUpIcon } from "lucide-react";
import React, { use, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  useGetSingleAdvertisementQuery,
  useUpdateAdvertisementMutation,
} from "@/redux/dailynews/advertisement.api";
import DateTimeInput from "@/utils/Form_Inputs/DateTimeInput";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UpdateTopBar from "../../_components/UpdateTopBar";
import Loading from "@/app/loading";

type Inputs = {
  scheduleAdvertisements: string;
  advertisementImage: string;
  advertisementLink: string;
  adminName: string;
  displayLocation: string;
  selectedImage: string;
};

type newsProps = {
  params: Promise<{ id: string }>;
};

const Update = ({ params }: newsProps) => {
  const { id } = use(params);
  const [updateAdvertisement] = useUpdateAdvertisementMutation();
  const { data: singleData, isLoading, error } = useGetSingleAdvertisementQuery(id);
  const [openSheetIndex, setOpenSheetIndex] = useState<number | null>(null);
  const [mainSelectedFiles, setMainSelectedFiles] = useState<{ url: string }[]>([]);
  const router = useRouter();

  const form = useForm<Inputs>({
    defaultValues: {
      scheduleAdvertisements: "",
      advertisementImage: "",
      advertisementLink: "",
      adminName: "",
      displayLocation: "popup",
      selectedImage: "",
    },
  });

  useEffect(() => {
    if (singleData && Object.keys(singleData).length > 0) {
      const formatDate = (isoString: string) => isoString ? isoString.slice(0, 16) : "";

      form.reset({
        scheduleAdvertisements: formatDate(singleData.scheduleAdvertisements),
        advertisementLink: singleData.advertisementLink || "",
        selectedImage: singleData.advertisementImage || "",
        adminName: singleData.adminName || "",
        displayLocation: singleData.displayLocation || "popup",
      });

      const mainImages = singleData.advertisementImage
        ? [{ url: singleData.advertisementImage }]
        : [];
      setMainSelectedFiles(mainImages);
    }
  }, [singleData, form]);

  // Modified image selection handler
  const handleImageSelect = (images: any[]) => {
    setMainSelectedFiles(images);
    setOpenSheetIndex(null); // Close the sheet after selection
  };

  // Modified form submission handler
  const onSubmit = async (data: Inputs) => {
    if (mainSelectedFiles.length === 0) {
      toast.error("Please select an image");
      return;
    }

    const modifyData = {
      ...data,
      _id: id,
      scheduleAdvertisements: data.scheduleAdvertisements,
      advertisementLink: data.advertisementLink,
      displayLocation: data.displayLocation,
      adminName: data.adminName,
      advertisementImage: mainSelectedFiles.map((item) => item.url).join(","),
      visibility: {
        popup: data.displayLocation === "popup",
        header: data.displayLocation === "header",
        firstPage: data.displayLocation === "first-page",
        categoryPage: data.displayLocation === "category-page",
        detailsPage: data.displayLocation === "details-page",
      },
    };

    try {
      const res = await updateAdvertisement({ ...modifyData, id }).unwrap();
      if (res) {
        toast.success("Advertisement Updated Successfully!");
        router.push("/dashboard/list-advertisement");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update advertisement");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading advertisement data</div>;

  return (
    <>
      <div className="max-w-xl mx-auto">
        <UpdateTopBar />
        <div className="bg-white rounded border-gray-300 p-4 lg:p-8 shadow-sm">
          

          <Form {...form}>
     
     
              <div className="space-y-4 lg:space-y-8">
              <h1 className="font-bold">Update Image</h1>
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  
                  <Sheet open={openSheetIndex !== null} onOpenChange={(open) => !open && setOpenSheetIndex(null)}>
                    <SheetTrigger asChild>
                      <Button
                        title="Please Add Image"
                        variant="outline"
                        className="group p-8 hover:bg-blue-50 hover:border-blue-200 rounded-2xl transition-all duration-200"
                        onClick={() => setOpenSheetIndex(0)}
                      >
                        <ImageUpIcon className="w-8 h-8 text-blue-500" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" style={{ maxWidth: "800px" }} className="overflow-auto">
                      <SheetTitle className="text-xl font-semibold mb-6">
                        Select Advertisement Image
                      </SheetTitle>
                      <AllImgModal
                        onImageSelect={handleImageSelect}
                        onClose={() => setOpenSheetIndex(null)}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Preview selected images */}
                <div className="flex flex-wrap gap-4">
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
                          setMainSelectedFiles(files => files.filter((_, i) => i !== index));
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                       <CircleX />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium text-gray-700">
                    Advertisement Link:
                  </h3>
                  <TextInput
                    control={form.control}
                    name="advertisementLink"
                    placeholder="Enter the advertisement URL"
                    rules={{
                      required: "Additional Link is required",
                      pattern: {
                        message: "Please enter a valid URL with https://",
                      },
                    }}
                  />
                </div>

                <div>
                  <h1 className="text-blue-500 font-semibold my-2">
                    কোথায় দৃশ্যমান করবেন ?
                  </h1>
                  <Controller
                    name="displayLocation"
                    control={form.control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid lg:grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="popup" id="popup" />
                          <Label htmlFor="popup">
                            ওয়েবসাইট পপ-আপ হিসাবে রাখবেন ?
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="header" id="header" />
                          <Label htmlFor="header">
                            ওয়েবসাইট হেডার রাখবেন ?
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="first-page" id="first-page" />
                          <Label htmlFor="first-page">
                            প্রথম পৃষ্ঠায় রাখবেন ?
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="category-page"
                            id="category-page"
                          />
                          <Label htmlFor="category-page">
                            ক্যাটাগরি পৃষ্ঠায় রাখবেন ?
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="details-page"
                            id="details-page"
                          />
                          <Label htmlFor="details-page">
                            বিস্তারিত পৃষ্ঠায় রাখবেন ?
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                <hr />
                <div>
                  <h3 className="text-base font-medium text-gray-700">
                    Schedule Advertisement:
                  </h3>
                  <DateTimeInput
                    control={form.control}
                    type="datetime-local"
                    name="scheduleAdvertisements"
                    rules={{
                      required:
                        "Schedule Advertisement date and time is required",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium text-gray-700">
                    Admin Name:
                  </h3>
                  <TextInput
                    control={form.control}
                    name="adminName"
                    placeholder="Enter the Admin Name"
                    rules={{
                      required: "Admin Name is Required",
                    }}
                  />
                </div>
                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="default"
                    className="w-full sm:w-auto px-8 py-2.5  hover:bg-blue-700 text-white font-medium transition-colors "
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    Submit
                  </Button>
                </div>
              </div>
      
          </Form>
        </div>
      </div>
    </>
  );
};

export default Update;


