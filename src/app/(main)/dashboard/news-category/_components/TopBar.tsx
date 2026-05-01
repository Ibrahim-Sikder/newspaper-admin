/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  // SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "@/utils/Form_Inputs/TextInput";
import { useCreateCategoriesMutation } from "@/redux/dailynews/category.api";
import "./Topbar.css";

type Inputs = {
  name: string;
  slug: string;
};

const TopBar = () => {
  const [createCategories] = useCreateCategoriesMutation();

  const form = useForm<Inputs>({
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: Inputs) => {
    try {
      const res = await createCategories(data).unwrap();
      if (res) {
        toast.success("Category created Successfully!");
      }

      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center bg-white p-1 lg:p-4 rounded mb-5 gap-4 md:gap-8">
        {/* Header Section */}
        <div className="space-y-2 flex-1">
          <h2 className="text-lg md:text-3xl pl-2 font-semibold text-gray-900">
            Category
          </h2>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <div className=" flex justify-end">
              {/* <Button variant="outline" className="bg-black text-white rounded">
                + Add Category
              </Button> */}
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="responsive-sheet">
            <SheetTitle className="sr-only">Category</SheetTitle>

            <div className="pt-4">
              <Form {...form}>
                <div className=" bg-white  lg:p-1 pt-4">
                  <h1 className="font-semibold text-lg text-center">
                    Add New News Category :
                  </h1>
                  <hr className="my-4" />
                  <div>
                    <TextInput
                      control={form.control}
                      name="name"
                      placeholder="Enter Category Name"
                      rules={{
                        required: "Category Name is required",
                      }}
                    />
                  </div>
                  <div className="mt-2 ">
                    <TextInput
                      control={form.control}
                      name="slug"
                      placeholder="Enter Slug Bangla"
                      rules={{
                        required: "Slug is required",
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={form.handleSubmit(onSubmit)}
                      type="submit"
                      variant="default"
                      className="px-4 py-2.5  hover:bg-blue-700 text-white font-medium transition-colors rounded-md"
                    >
                      Create Category
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default TopBar;
