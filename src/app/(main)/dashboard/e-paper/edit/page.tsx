"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useGetSingleEpaperQuery } from "@/redux/dailynews/e-paper";
import AddEpaperForm from "@/components/e-paper/AddEpaperForm";

const EditEpaperPage = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") || "";

  const { data, isLoading } = useGetSingleEpaperQuery(date, {
    skip: !date,
  });

  console.log("Fetched Epaper Data:", data);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!date) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">তারিখ পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className=" z-10 bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold"> ই-পেপার এডিট করুন</h1>
      </div>
      <AddEpaperForm initialData={data} isEditing={true} />
    </div>
  );
};

export default EditEpaperPage;
