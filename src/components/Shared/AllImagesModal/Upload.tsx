/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import React from "react";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import FileInput from "@/utils/Form_Inputs/FileInput";
import { useGetAllFolderQuery } from "@/redux/dailynews/folder.api";
import { useCreateImagesMutation } from "@/redux/dailynews/images.api";
import toast from "react-hot-toast";
import AddFolderModal from "@/app/(main)/dashboard/gallery/folder/_components/AddFolderModal";

interface FileWithPreview {
  file: File;
  preview: string;
}

const Upload = ({ onSuccess }: { onSuccess: () => void }) => {
  const [selectedFiles, setSelectedFiles] = React.useState<FileWithPreview[]>(
    [],
  );

  const { data, isLoading, isError } = useGetAllFolderQuery({});
  React.useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [selectedFiles]);

  const [createImages] = useCreateImagesMutation();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [selectedFiles]);

  const onSubmit = async (data: Inputs) => {
    const toastId = toast.loading("Uploading images...");
    const formData = new FormData();

    if (Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((file: any) => {
        formData.append("images", file);
      });
    } else {
      toast.error("Please select at least one image");
      return;
    }

    formData.append("folder", data.folder);

    try {
      data.images.forEach((fileWithPreview: FileWithPreview) => {
        formData.append("images", fileWithPreview.file);
      });

      formData.append("folder", data.folder);

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
      toast.error(errorMessage);
    }
  };

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
  const handleUploadSuccess = () => {
    onSuccess();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div className="w-full mt-5 lg:flex justify-end items-center gap-2 space-y-4 ">
              <div className="lg:w-[400px]">
                <SelectInput
                  control={form.control}
                  name="folder"
                  placeholder="Select Folder"
                  options={
                    data?.map((program: { name: string; _id: string }) => ({
                      label: program.name,
                      value: program._id,
                    })) || []
                  }
                  rules={{ required: "Select A Folder is required" }}
                />
              </div>
              <h1 className="text-center">OR</h1>
              <div className="flex justify-center">
                <Button className="lg:h-[46px] " onClick={() => setOpen(true)}>
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

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {selectedFiles.map((fileWithPreview, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={fileWithPreview.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded"
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-end ">
            <Button onClick={handleUploadSuccess}>Upload</Button>
          </div>
        </form>
      </Form>
      <AddFolderModal isOpen={open} onOpenChange={setOpen} />
    </>
  );
};

export default Upload;
