/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCreateImagesMutation } from "@/redux/dailynews/images.api";
import FileInput from "@/utils/Form_Inputs/FileInput";
import { Search } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FileWithPreview {
  file: File;
  preview: string;
}

type Inputs = {
  folder: string;
  images: FileWithPreview[];
};

interface TopBarProps {
  folderId: string;
}

const TopBar = ({ folderId }: TopBarProps) => {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [createImages] = useCreateImagesMutation();

  const form = useForm<Inputs>({
    defaultValues: {
      images: [],
    },
  });

  const onSubmit = async (data: Inputs) => {
    const toastId = toast.loading("Uploading images...");
    const formData = new FormData();

    if (!folderId) {
      toast.error("Folder ID is missing!", { id: toastId });
      return;
    }

    if (!Array.isArray(data.images) || data.images.length === 0) {
      toast.error("Please select at least one image", { id: toastId });
      return;
    }

    data.images.forEach((fileWithPreview: FileWithPreview) => {
      formData.append("images", fileWithPreview.file);
    });
    formData.append("folder", folderId);

    try {
      const result = await createImages(formData).unwrap();
      toast.success(result.message || "Images Uploaded Successfully!", {
        id: toastId,
        duration: 3000,
      });
      form.reset();
      setSheetOpen(false);
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.data?.errorMessages?.[0] || "Upload failed";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="flex justify-between items-center content-center bg-white p-2 border shadow-sm mb-5 gap-2 md:gap-0 ">
      <div className="space-y-2">
        <h2 className="text-sm md:text-3xl pl-2 font-semibold">Folder Image</h2>
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

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button>+ Add Image</Button>
        </SheetTrigger>
        <SheetContent side="right" className="pt-2 overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-center">Add Image</SheetTitle>
            <hr className="pb-5" />
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FileInput
                control={form.control}
                name="images"
                label="Upload Images"
                accept="image/*"
                multiple
                maxFiles={20}
              />
              <div className="mt-4 flex justify-end">
                <Button type="submit">Upload</Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TopBar;
