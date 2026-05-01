/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useDeleteVideoNewsMutation,
  useGetAllVideoNewsQuery,
} from "@/redux/dailynews/videoNews.api ";
import ActionDropdown from "@/utils/Action/ActionDropdown";
import { DataTable } from "@/utils/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import parse from 'html-react-parser'
import truncateText from "@/utils/truncateText";
import Loader from "@/components/Loader";
import { useState } from "react";
import { TMeta, TQueryParam } from "@/types/api.types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { updatePaginationParams } from "@/utils/pagination";
import { Search } from "lucide-react";

const VideoList = () => {
  const router = useRouter();
  const [params, setParams] = useState<TQueryParam[]>([
    { name: "page", value: "1" },
    { name: "limit", value: "5" },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteVideoNews] = useDeleteVideoNewsMutation();

  const { data, isLoading, isError } = useGetAllVideoNewsQuery(params);

  const videoNews = data?.data
  const meta = data?.meta as TMeta

  if (isLoading) {
    return <Loader />;
  }


  const videoNewsData = videoNews?.map((item: any, index: any) => ({
    id: item._id,
    slNo: index + 1,
    reporterName: item.reporterName || "N/A",
    reporterType: item.reporterType || "N/A",
    images: item.images || "N/A",
    photojournalistName: item.photojournalistName || "N/A",
    newsTitle: item.newsTitle || "N/A",
    date: new Date(item.date).toLocaleDateString(),
    imageTagline: item.imageTagline || "N/A",
    videioJornalistName: item.videioJornalistName || "N/A",
    videoUrl: item.videoUrl || "N/A",
    category: item.category?.name || "N/A",
    newsType: item.newsType || "N/A",
    shortDescription: item.shortDescription || "N/A",
    description: item.description || "N/A",
    adminName: item.adminName || "N/A",
    slug: item.slug || "N/A",
  })) || [];

  const handleEdit = (rowData: any) => {
    router.push(`/dashboard/list-video-news/update-details/${rowData.id}`);
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
          await deleteVideoNews(id).unwrap();
          Swal.fire("Deleted!", "Your activity has been deleted.", "success");
        }
      });
    } catch (err: any) {
      console.error("Error deleting news:", err);
      toast.error(err.message || "Failed to delete news.");
    }
  };

  const handleView = (rowData: any) => {
    router.push(`/dashboard/list-video-gallery/view-details/${rowData?.id}`);
  };

  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "slNo",
      header: "Sl. No.",
    },
    {
      accessorKey: "images",
      header: "Images",
      cell: ({ row }) => {
        const images = row.original.images;
        const imageUrl = Array.isArray(images) ? images[0] : images;

        return imageUrl && imageUrl !== "N/A" ? (
          <div className="relative w-16 h-16">
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
      accessorKey: "newsTitle",
      header: "News Title",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "videoUrl",
      header: "Video URL",
    },
    {
      accessorKey: "shortDescription",
      header: "Short Description",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="line-clamp-2 text-sm text-gray-700">
          {parse(truncateText(row.original.description, 100))}
        </div>
      ),
    },

    {
      accessorKey: "Action",
      header: "Action",
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
  const handlePaginationChange = (page: number) => {
    setParams((prev) => updatePaginationParams(prev, page, meta?.limit || 5))
  }

  return (
    <div className="overflow-x-auto bg-white p-3">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 lg:w-[300px] rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-gray-300"
        />
      </div>
      <DataTable
        columns={columns}
        data={videoNewsData ?? []}

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
  );
};

export default VideoList;
