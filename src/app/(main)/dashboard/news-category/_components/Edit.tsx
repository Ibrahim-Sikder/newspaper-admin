"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "@/utils/Form_Inputs/TextInput";
import {
  useGetSingleCategoriesQuery,
  useUpdateCategoriesMutation,
} from "@/redux/dailynews/category.api";
import { EditIcon } from "lucide-react";
import { useEffect } from "react";

type Inputs = {
  name: string;
  slug: string;
};

type NewsProps = {
  id: string;
};

const Edit = ({ id }: NewsProps) => {
  const [updateCategory] = useUpdateCategoriesMutation();
  const { data: singleData } = useGetSingleCategoriesQuery(id);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const form = useForm<Inputs>({
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (singleData) {
      form.reset({
        name: singleData.name || "",
        slug: singleData.slug || "",
      });
    }
  }, [singleData, form]);

  const onSubmit = async (data: Inputs) => {
    try {
      const res = await updateCategory({ id, ...data }).unwrap();

      if (res) {
        toast.success("Category Updated Successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category");
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center bg-white rounded gap-4 md:gap-8">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <div className="flex justify-end">
            <EditIcon className="hover:bg-gray-200 rounded-full w-[20px] lg:w-[40px]  h-[20px] lg:h-[40px] lg:p-2 " />
          </div>
        </SheetTrigger>
        <SheetContent
          side="right"
          style={{ maxWidth: "400px" }}
          className="overflow-auto"
        >
          <SheetTitle className="sr-only">Edit Category</SheetTitle>
          <div className="pt-4">
            <Form {...form}>
              <div className="bg-white p-1">
                <h1 className="font-semibold text-lg text-center">
                  Edit Category
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
                    placeholder="Enter Slug English"
                    rules={{
                      required: "Slug is required",
                    }}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    type="submit"
                    variant="default"
                    className="px-4 py-2.5 hover:bg-blue-700 text-white font-medium transition-colors rounded-md"
                  >
                    Update Category
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Edit;
