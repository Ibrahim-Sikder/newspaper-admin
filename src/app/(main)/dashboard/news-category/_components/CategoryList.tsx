/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/utils/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  useDeleteCategoriesMutation,
  useGetAllCategoriesQuery,
} from "@/redux/dailynews/category.api";
import React from "react";
import { Trash2 } from "lucide-react";
import TopBar from "./TopBar";
import Edit from "./Edit";
import Loader from "@/components/Loader";

const CategoryList = () => {
  const { data, isLoading, isError } = useGetAllCategoriesQuery({});

  const [deleteCategories] = useDeleteCategoriesMutation();

  if (isLoading) {
    return <Loader />;
  }

  const newsData =
    data?.categories?.map((item: any, index: number) => ({
      id: item._id,
      slNo: index + 1,
      category: item.name || "N/A",
    })) || [];

  const handleDelete = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteCategories(id).unwrap();
          Swal.fire("Deleted!", "Your activity has been deleted.", "success");
        }
      });
    } catch (err: any) {
      console.error("Error deleting news:", err);
      toast.error(err.message || "Failed to delete news.");
    }
  };

  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "slNo",
      header: () => <span className="font-bold">Sl No.</span>,
    },
    {
      accessorKey: "category",
      header: () => <span className="font-bold">Category Name</span>,
    },
    {
      accessorKey: "Action",
      header: () => <span className="font-bold">Action</span>,
      cell: ({ row }: any) => (
        <div className="flex gap-2 lg:-ml-5">
          <Edit id={row.original.id} />
          <Trash2
            onClick={() => handleDelete(row.original.id)}
            color="red"
            className="hover:bg-gray-200 rounded-full w-[20px] lg:w-[40px]  h-[20px] lg:h-[40px] lg:p-2 "
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <TopBar />
      <div className="bg-white lg:py-5 px-2 lg:px-8 rounded">
        <DataTable
          columns={columns}
          data={newsData ?? []}
          filterKey="category"
          filterPlaceholder="Search by Category Name"
        />
      </div>
    </>
  );
};

export default CategoryList;
