/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ActionDropdown from "@/utils/Action/ActionDropdown";
import { DataTable } from "@/utils/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "@/app/loading";
import { useDeletePhotoNewsMutation, useGetAllPhotoNewsQuery } from "@/redux/dailynews/photoNews.api";
import Image from "next/image";
import truncateText from "@/utils/truncateText";
import parse from 'html-react-parser'
import { TMeta, TQueryParam } from "@/types/api.types";
import { useState } from "react";
import { updatePaginationParams } from "@/utils/pagination"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search } from "lucide-react";
const ImagesDataTable = () => {
  const router = useRouter();

  const [params, setParams] = useState<TQueryParam[]>([
    { name: "page", value: "1" },
    { name: "limit", value: "5" },
  ])
  const [searchQuery, setSearchQuery] = useState("")


  const { data, isLoading, isError } = useGetAllPhotoNewsQuery(params);
  const [deletePhotoNews] = useDeletePhotoNewsMutation();

  const photoNews = data?.data
  const meta = data?.meta as TMeta

  if (isLoading) {
    return <Loading />;
  }

  const newsData = photoNews?.map((item: any, index: number) => ({
    id: item._id,
    slug: item.slug || '',
    slNo: index + 1,
    title: item.title || "N/A",
    description: item.description || "N/A",
    imgTagline: item.imgTagline || "N/A",
    images: item.images || "N/A",
    adminName: item.adminName || "N/A",
    postDate: new Date(item.postDate).toLocaleDateString(),
  })) || [];

  const handleEdit = (rowData: any) => {
    router.push(`/dashboard/list-photo-news/update-details/${rowData.id}`);
  };

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
          await deletePhotoNews(id).unwrap();
          Swal.fire("Deleted!", "Your activity has been deleted.", "success");
        }
      });
    } catch (err: any) {
      console.error("Error deleting news:", err);
      toast.error(err.message || "Failed to delete news.");
    }
  };




  const handleView = (rowData: any) => {
    router.push(`/dashboard/list-news/view-details/${rowData.id}`);
  };
  const handlePaginationChange = (page: number) => {
    setParams((prev) => updatePaginationParams(prev, page, meta?.limit || 5))
  }
  const columns: ColumnDef<any, any>[] = [

    {
      accessorKey: "slNo",
      header: () => <span className="font-bold">SL. No.</span>,
    },
    {
      accessorKey: "images",
      header: () => <span className="font-bold">Title Image</span>,
      cell: ({ row }) => {
        const images = row.original.images;
        // Handle array of images or single image string
        const imageUrl = Array.isArray(images) ? images[0] : images;

        return imageUrl && imageUrl !== "N/A" ? (
          <div className="relative w-24 h-16">
            <Image
              src={imageUrl}
              alt="News thumbnail"
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 64px) 100vw, 64px"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: () => <span className="font-bold">Title</span>,
    },
    {
      accessorKey: "description",
      header: () => <span className="font-bold">Description</span>,
      cell: ({ row }) => {
        const description = row.original.description;
        return <span>{parse(truncateText(description, 150))}</span>;
      },
    },


    {
      accessorKey: "Action",
      header: () => <span className="font-bold">Action</span>,
      cell: ({ row }: any) => (
        <ActionDropdown
          row={row}
          onView={handleView}
          onUpdate={handleEdit}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ];

  return (
    <>

      <div className="overflow-x-auto bg-white p-2 rounded">
        <div className="mb-4">

          <div className="relative ">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 lg:w-[300px] rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-gray-300"
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={newsData ?? []}


        />
        <Pagination className="mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePaginationChange(meta.page - 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePaginationChange(1)}
                isActive={meta.page === 1}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>

            {meta.page > 3 && (
              <PaginationItem>
                <PaginationEllipsis className="cursor-pointer" />
              </PaginationItem>
            )}

            {[...Array(meta.totalPage)].map((_, i) => {
              const pageNumber = i + 1;
              if (
                pageNumber !== 1 &&
                pageNumber !== meta.totalPage &&
                pageNumber >= meta.page - 1 &&
                pageNumber <= meta.page + 1
              ) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePaginationChange(pageNumber)}
                      isActive={meta.page === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}

            {meta.page < meta.totalPage - 2 && (
              <PaginationItem>
                <PaginationEllipsis className="cursor-pointer" />
              </PaginationItem>
            )}

            {meta.totalPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePaginationChange(meta.totalPage)}
                  isActive={meta.page === meta.totalPage}
                  className="cursor-pointer"
                >
                  {meta.totalPage}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePaginationChange(meta.page + 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default ImagesDataTable;



