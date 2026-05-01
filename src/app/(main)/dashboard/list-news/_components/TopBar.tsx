"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";
// import { Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import Image from "next/image";
// import upload from "../../../../../assests/images/upload.webp";
// import { Form } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import SelectInput from "@/utils/Form_Inputs/SelectInput";

const TopBar = () => {
  // const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  // const [open, setOpen] = React.useState(false);
  // const [dragOver, setDragOver] = React.useState(false);

  // const handleButtonClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     console.log("File selected:", file);
      
  //   }
  // };

  // type Inputs = {
  //   reporterType: string;
  //   reporterName: string;
  //   newsArea: string;
  //   reportedDateAndTime: string;
  //   selectedImage: string;
  //   photoJournalistName: string;
  //   img_type: string;
  //   publishedDate: string;
  //   newsTitle: string;
  //   description: string;
  //   newsTags: string[];
  // };

  // const form = useForm<Inputs>({
  //   defaultValues: {
  //     reporterType: "",
  //     reporterName: "",
  //     newsArea: "",
  //     reportedDateAndTime: "",
  //     photoJournalistName: "",
  //     img_type: "",
  //     publishedDate: "",
  //     newsTitle: "",
  //     description: "",
  //     newsTags: [""],
  //   },
  // });

  // const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   setDragOver(true);
  // };

  // const handleDragLeave = () => {
  //   setDragOver(false);
  // };

  // const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   setDragOver(false);
  //   const file = event.dataTransfer.files?.[0];
  //   if (file) {
  //     console.log("File dropped:", file);
      
  //   }
  // };
  return (
    <>
      <div className="flex justify-between items-center content-center bg-white p-3  border rounded-md shadow-sm mb-5 gap-2 md:gap-0  ">
        <div className="space-y-2">
          <h2 className="text-sm md:text-3xl pl-2 font-semibold">All News</h2>
        </div>
        <Link href={"/dashboard/add-news"}>
        <Button className="rounded">+ Create News</Button>
        </Link>

        {/* <div className="relative border md:w-[300px] py-1">
          <span className="absolute inset-y-0 left-0 flex items-center py-4">
            <button type="submit" className="p-2 focus:outline-none focus:ring">
              <Search className="h-4 md:h-5 w-4 md:w-5" />
            </button>
          </span>
          <input
            type="search"
            name="Search"
            placeholder="Search..."
            className="w-full md:py-[10px] pl-7 md:pl-10 text-sm dark:border- focus:outline-none dark:bg-gray-100 dark:text-gray-800 focus:dark:bg-gray-50"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-blue-500" >
              Add Image
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pt-20 overflow-auto">
            <SheetHeader>
              <SheetTitle className="text-center">Add Image</SheetTitle>
              <hr />
            </SheetHeader>
            <Form {...form}>
              <div className="space-y-5">
                <div className="w-full mt-5 flex gap-2">
                  <div className="w-[400px]">
                    <SelectInput
                      control={form.control}
                      name="img_type"
                      placeholder="Select Folder"
                      options={[
                        { label: "Folder1", value: "Folder1" },
                        { label: "Folder1", value: "Folder2" },
                        { label: "Folder1", value: "Folder3" },
                        { label: "Folder1", value: "Folder4" },
                        { label: "Folder1", value: "Folder5" },
                      ]}
                    />
                  </div>
                  <Button className="h-[46px] " onClick={() => setOpen(true)}>
                    Create Folder
                  </Button>
                </div>

               
                <div
                  className={`flex flex-col items-center justify-center border-dashed border-2 rounded-xl p-6 my-4 space-y-4 ${
                    dragOver
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Image
                    src={upload}
                    alt="Upload Placeholder"
                    className="h-32 w-32"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button onClick={handleButtonClick}>Browse</Button>
                  <h3>or drag an image here</h3>
                </div>
               
              </div>
              <div className="mt-4 flex justify-end ">
              <Button className="mt-4 bg-green-500">Upload</Button>
              </div>
            </Form>
          </SheetContent>
        </Sheet> */}
      </div>
      {/* <CreateFolderModal isOpen={open} onOpenChange={setOpen} /> */}
    </>
  );
};

export default TopBar;
