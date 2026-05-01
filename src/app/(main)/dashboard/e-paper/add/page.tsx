"use client";
import AddEpaperForm from "@/components/e-paper/AddEpaperForm";
import React from "react";

const AddEpaperPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className=" z-10 bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold">➕ নতুন ই-পেপার তৈরি করুন</h1>
        <p className="text-sm text-gray-500">পৃষ্ঠা এবং আর্টিকেল যোগ করুন</p>
      </div>
      <AddEpaperForm />
    </div>
  );
};

export default AddEpaperPage;
