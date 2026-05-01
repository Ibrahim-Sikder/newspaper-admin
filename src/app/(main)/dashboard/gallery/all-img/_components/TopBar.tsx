/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import { Input } from "@/components/ui/input";
import AddFolderModal from "../../folder/_components/AddFolderModal";
import { useGetAllFolderQuery } from "@/redux/dailynews/folder.api";
import Loading from "@/app/loading";
import FileInput from "@/utils/Form_Inputs/FileInput";
import { useCreateImagesMutation } from "@/redux/dailynews/images.api";
import toast from "react-hot-toast";

interface FileWithPreview {
  file: File;
  preview: string;
}

const TopBar = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<FileWithPreview[]>(
    [],
  );
  const [createImages] = useCreateImagesMutation();
  const { data, isLoading, isError } = useGetAllFolderQuery({});
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // Clean up previews when component unmounts
  React.useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [selectedFiles]);

  type Inputs = {
    folder: string;
    images: FileWithPreview[];
  };

  const form = useForm<Inputs>({
    defaultValues: {
      folder: "",
      images: [],
    },
  });

  // Watch the images field to update selectedFiles
  const watchedImages = form.watch("images");

  React.useEffect(() => {
    if (watchedImages && Array.isArray(watchedImages)) {
      setSelectedFiles(watchedImages);
    }
  }, [watchedImages]);

  const onSubmit = async (data: Inputs) => {
    // Check if folder is selected
    if (!data.folder) {
      toast.error("Please select a folder");
      return;
    }

    // Check if images are selected
    if (!data.images || data.images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const toastId = toast.loading("Uploading images...");

    try {
      const formData = new FormData();

      // Append all images
      data.images.forEach((fileWithPreview: FileWithPreview) => {
        formData.append("images", fileWithPreview.file);
      });

      formData.append("folder", data.folder);

      const result = await createImages(formData).unwrap();
      console.log("result check", result);

      if (result) {
        // Dismiss loading and show success
        toast.dismiss(toastId);
        toast.success(result.message || "Images Uploaded Successfully!", {
          duration: 3000,
        });

        // Reset form and close modal
        form.reset({
          folder: "",
          images: [],
        });
        setSelectedFiles([]);
        setSheetOpen(false);
      }
    } catch (err: any) {
      // Dismiss loading and show error
      toast.dismiss(toastId);

      const errorMessage =
        err.data?.message || err.data?.errorMessages?.[0] || "Upload failed";

      toast.error(errorMessage, {
        duration: 3000,
      });
    }
  };

  // Handle sheet close
  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when sheet closes
      form.reset({
        folder: "",
        images: [],
      });
      setSelectedFiles([]);
    }
    setSheetOpen(open);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex justify-between items-center content-center bg-white p-2 border rounded shadow-sm mb-5 gap-2 md:gap-0 ">
        <div className="space-y-2">
          <h2 className="text-sm md:text-3xl pl-2 font-semibold">All Images</h2>
        </div>

        <div className="hidden lg:flex">
          <div className="relative flex-grow">
            <div className="absolute p-3">
              <Search className="h-4 md:h-5 w-4 md:w-5" />
            </div>
            <Input
              placeholder="Search..."
              className="pl-10 py-3 w-[300px] border  focus:ring-1 rounded"
            />
          </div>
        </div>

        <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button onClick={() => setSheetOpen(true)}>+ Add Image</Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="pt-4 overflow-auto"
            style={{ maxWidth: "500px" }}
          >
            <SheetHeader>
              <SheetTitle className="text-center">Add Image</SheetTitle>
              <hr />
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-5">
                  <div className="w-full mt-5 lg:flex items-center gap-2">
                    <div className="lg:w-[400px]">
                      <SelectInput
                        control={form.control}
                        name="folder"
                        placeholder="Select Folder"
                        options={
                          data?.map(
                            (program: { name: string; _id: string }) => ({
                              label: program.name,
                              value: program._id,
                            }),
                          ) || []
                        }
                      />
                    </div>
                    <h1 className="text-center">OR</h1>
                    <div className="flex justify-center ">
                      <Button
                        type="button" // Important: prevent form submission
                        className="lg:h-[46px]"
                        onClick={() => setOpen(true)}
                      >
                        Create New Folder
                      </Button>
                    </div>
                  </div>
                  <FileInput
                    control={form.control}
                    name="images"
                    label="Upload Images"
                    accept="image/*"
                    multiple
                    maxFiles={20}
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSheetOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-green-500" type="submit">
                    Upload
                  </Button>
                </div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
      <AddFolderModal isOpen={open} onOpenChange={setOpen} />
    </>
  );
};

export default TopBar;
