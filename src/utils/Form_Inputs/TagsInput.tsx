/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Delete, ImageUpIcon, PlusIcon } from "lucide-react";
import TextInput from "./TextInput";
import AllImgModal from "@/components/Shared/AllImagesModal/AllImgModal";

type Tag = {
  imageTagLine: string;
  photoJournalistName: string;
  selectedImage: string;
};

type TagInputProps = {
  control: any;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};
const handleImageSelect = (images: any[]) => {
  // Handle image selection here
};

const handleClose = () => {
  // Handle modal close here
};
const TagsInput = ({ control, tags, setTags }: TagInputProps) => {
  const handleAddTag = () => {
    setTags([
      ...tags,
      { imageTagLine: "", photoJournalistName: "", selectedImage: "" },
    ]);
  };

  const handleRemoveTag = (index: number) => {
    if (tags.length === 1) return;
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      className="flex flex-col gap-6 w-full max-h-[300px]   lg:max-h-[400px]   overflow-y-auto 
    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {tags.map((tag, index) => (
        <div key={index}>
          <div className="flex flex-col space-y-3">
            <div className="">
              <div className="flex justify-between items-center gap-2 p-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="p-8 border-none hover:bg-blue-400 rounded-full"
                    >
                      <ImageUpIcon color="red" size={50} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" style={{ maxWidth: "800px" }} className="overflow-auto">
                    <SheetTitle className="sr-only">tags</SheetTitle>
                    <AllImgModal onImageSelect={handleImageSelect} onClose={handleClose} />
                  </SheetContent>
                </Sheet>

                <div className="flex justify-end gap-2">
                  {tags.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveTag(index)}
                      aria-label="Remove tag"
                    >
                      <Delete className="w-4 h-4" />
                    </Button>
                  )}
                  {index === tags.length - 1 && (
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleAddTag}
                      aria-label="Add new tag"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <TextInput
                control={control}
                name="photoJournalistName"
                placeholder="ফটো সাংবাদিক নাম"
                rules={{ required: "Photo Journalist Name is required" }}
              />
            </div>
            <TextInput
              control={control}
              name="imageTagLine"
              placeholder="ইমেজ ট্যাগ লাইন"
              rules={{ required: "Image Tagline is required" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagsInput;
