/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateCategoriesMutation } from "@/redux/dailynews/category.api";
import TextInput from "@/utils/Form_Inputs/TextInput";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  name: string;
};

const AddNewsCategory = () => {
  const [createCategories] = useCreateCategoriesMutation();

  const form = useForm<Inputs>({
    defaultValues: {
      name: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: Inputs) => {
    try {
      const res = await createCategories(data).unwrap();
      if (res.success) {
        toast.success("Category created Successfully!");
        form.reset();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <div className="space-y-4 border border-black p-6 bg-white ">
          <h1 className="font-semibold text-blue-500 text-lg">
            Add New News Category :
          </h1>
          <div>
            <TextInput
              control={form.control}
              name="name"
              placeholder="Enter your category name"
              rules={{ required: "Category Name is required" }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
              variant="default"
              className="w-full sm:w-auto px-8 py-2.5 bg-blue-500 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Create new category
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddNewsCategory;
