/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import { useGetAllFolderQuery } from "@/redux/dailynews/folder.api";
import { useGetAllImagesQuery } from "@/redux/dailynews/images.api";
import { TQueryParam } from "@/types/api.types";
import GlobalPagination from "../GlobalPagination";

interface RecentProps {
  onImageSelect: (images: any[]) => void;
  onClose: () => void;
}

const Recent: React.FC<RecentProps> = ({ onImageSelect, onClose }) => {
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [imagesPerPage, setImagesPerPage] = useState<number>(10); 

  const { data: foldersData } = useGetAllFolderQuery({});
 
  const [params, setParams] = useState<TQueryParam[]>([
    { name: "page", value: currentPage.toString() },
    { name: "limit", value: imagesPerPage.toString() },
  ]);

  const {
    data: allImages,
    isLoading,
    isFetching,
  } = useGetAllImagesQuery([...params]) as any;

  const metaData = allImages?.meta;
  const images = allImages?.data;

  const handleFolderChange = (value: any) => {
    setCurrentPage(1);
    setParams([
      { name: "page", value: "1" },
      { name: "limit", value: imagesPerPage.toString() },
      { name: "folder", value },
    ]);
  };


  const handleCheckboxChange = (image: any, checked: boolean) => {
    setSelectedImages((prev) =>
      checked ? [...prev, image] : prev.filter((img) => img._id !== image._id)
    );
  };

  
  const handleUpload = () => {
    onImageSelect(selectedImages);
    // onClose(); 
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setParams((prevParams) => {
      return prevParams.map((param) =>
        param.name === "page" ? { ...param, value: page.toString() } : param
      );
    });
  };

  const handleImagesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setImagesPerPage(newLimit);
    setCurrentPage(1); 
    setParams([
      { name: "page", value: "1" },
      { name: "limit", value: newLimit.toString() },
      ...params.filter((param) => param.name !== "limit" && param.name !== "page"),
    ]);
  };

  // Form setup
  const form = useForm({
    defaultValues: {
      folder: "",
    },
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          <div className="text-gray-900">
            {/* Folder selection */}
            <div className="w-full mt-5 flex justify-end items-center gap-2">
              <div className="lg:w-[400px]">
                <SelectInput
                  control={form.control}
                  name="folder"
                  placeholder="Select From Folder"
                  options={
                    foldersData?.map((folder: { name: string; _id: string }) => ({
                      label: folder.name,
                      value: folder._id,
                    })) || []
                  }
                  onValueChange={handleFolderChange}
                />
              </div>
            </div>

            {/* Total images and images per page selector */}
            <div className="my-4 flex justify-between items-center">
              <span className="text-gray-500">
               
              </span>
              <div>
                <label htmlFor="imagesPerPage" className="text-gray-500 mr-2">
                  Images per page:
                </label>
                <select
                  id="imagesPerPage"
                  value={imagesPerPage}
                  onChange={handleImagesPerPageChange}
                  className="p-2 border rounded"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>

            {/* Image grid */}
            {images?.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4  p-1 my-4">
                {images.map((row: any) => (
                  <div key={row._id} className="relative group">
                    <Image
                      src={row.url}
                      className={`lg:w-full lg:h-full rounded shadow-sm bg-gray-500 aspect-square cursor-pointer ${
                        selectedImages.some((img) => img._id === row._id)
                          ? "ring-4 ring-blue-500"
                          : ""
                      }`}
                      alt={`Image ${row._id}`}
                      width={100}
                      height={100}
                    />
                    <div
                      className={`absolute top-1 right-1 text-white rounded-full transition ${
                        selectedImages.some((img) => img._id === row._id)
                          ? "opacity-100"
                          : "opacity-0"
                      } group-hover:opacity-100`}
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer"
                        checked={selectedImages.some(
                          (img) => img._id === row._id
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(row, e.target.checked)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 my-4">No images found.</div>
            )}
          </div>

          {/* Upload button */}
          <div className="flex justify-end mb-8 lg:mb-0">
            <Button
              className="bg-green-500"
              onClick={handleUpload}
              disabled={selectedImages.length === 0}
            >
              Upload
            </Button>
          </div>

          {/* Pagination */}
          <GlobalPagination
            currentPage={currentPage}
            totalPages={metaData?.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </form>
      </Form>
    </>
  );
};

export default Recent;
