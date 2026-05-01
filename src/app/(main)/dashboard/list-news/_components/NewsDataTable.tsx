/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import parse from "html-react-parser";
import debounce from "lodash.debounce";
import {
  useDeleteNewsMutation,
  useGetAllNewsQuery,
} from "@/redux/dailynews/news.api";
import { DataTable } from "@/utils/Table/DataTable";
import ActionDropdown from "@/utils/Action/ActionDropdown";
import TopBar from "./TopBar";
import Loading from "@/app/loading";
import { Badge } from "@/components/ui/badge";
import { updatePaginationParams } from "@/utils/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { ColumnDef } from "@tanstack/react-table";
import type { TMeta, TQueryParam } from "@/types/api.types";

const tagColors = [
  "border-blue-500 text-blue-500",
  "border-green-500 text-green-500",
  "border-red-500 text-red-500",
  "border-black text-black",
  "border-purple-500 text-purple-500",
  "border-pink-500 text-pink-500",
  "border-orange-500 text-orange-500",
  "border-gray-500 text-gray-500",
];

const NewsDataTable = () => {
  const router = useRouter();
  const [params, setParams] = useState<TQueryParam[]>([
    { name: "page", value: "1" },
    { name: "limit", value: "10" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useGetAllNewsQuery(params);
  const fetchAllNews = data?.data;
  const meta = data?.meta as TMeta;
  const [deleteNews] = useDeleteNewsMutation();

  const newsData =
    fetchAllNews?.map((item: any, index: any) => ({
      id: item._id,
      // Calculate SL No based on page number and limit
      slNo: (meta?.page - 1) * meta?.limit + index + 1,
      images: item.images || "N/A",
      title: item.newsTitle || "N/A",
      category: item.category?.name || "N/A",
      publishedDate: new Date(item.publishedDate).toLocaleDateString(),
      description: item.description || "N/A",
      newsTag: item.newsTag || [],
      newsType: item.newsType || "N/A",
      shortDescription: item.shortDescription || "N/A",
      slug: item.slug || "N/A",
    })) || [];

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setParams((prev) => {
        const newParams = prev.filter((p) => p.name !== "searchTerm");
        if (searchQuery) {
          newParams.push({ name: "searchTerm", value: searchQuery });
        }
        return newParams;
      });
    }, 300);

    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleEdit = (rowData: any) => {
    router.push(`/dashboard/list-news/update-details/${rowData.id}`);
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
          await deleteNews(id).unwrap();
          Swal.fire("Deleted!", "Your activity has been deleted.", "success");
        }
      });
    } catch (err: any) {
      console.error("Error deleting news:", err);
      toast.error(err.message || "Failed to delete news.");
    }
  };

  // const handleView = (rowData: any) => {
  //   router.push(`/dashboard/list-news/view-details/${rowData.id}`);
  // };

  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "slNo",
      header: () => <div className="w-10 font-bold">SL. No.</div>,
    },
    {
      accessorKey: "publishedDate",
      header: () => <div className="w-20 font-bold">Pub. Date</div>,
    },
    {
      accessorKey: "images",
      header: () => (
        <span className="font-bold flex justify-center">Images</span>
      ),
      cell: ({ row }) => {
        const imageUrl = Array.isArray(row.original.images)
          ? row.original.images[0]
          : row.original.images;
        return imageUrl && imageUrl !== "N/A" ? (
          <div className="relative w-24 h-16">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="News thumbnail"
              fill
              className="object-cover rounded-md"
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
      accessorKey: "category",
      header: () => <div className="w-32 font-bold">Category</div>,
    },
    {
      accessorKey: "shortDescription",
      header: () => (
        <span className="font-bold flex justify-center">Short Description</span>
      ),
      cell: ({ row }) => {
        const description = row.original.shortDescription || "";
        return (
          <div>
            {parse(
              description.length > 30
                ? `${description.slice(0, 30)}...`
                : description,
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "newsTag",
      header: () => (
        <div className="w-40  font-bold flex justify-center items-center ">
          Tags
        </div>
      ),
      cell: ({ row }) => (
        <div className="grid grid-cols-2 gap-1 place-content-center place-items-center">
          {row.original.newsTag.map((tag: string, index: number) => (
            <Badge
              key={index}
              variant="outline"
              className={`px-3 py-1 rounded-full ${
                tagColors[index % tagColors.length]
              }`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "Action",
      header: () => <span className="font-bold">Action</span>,
      cell: ({ row }) => (
        <ActionDropdown
          row={row}
          onUpdate={handleEdit}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ];

  const handlePaginationChange = (page: number) => {
    if (page < 1 || page > meta.totalPage) return;
    setParams((prev) => updatePaginationParams(prev, page, meta?.limit || 10));
  };

  if (isLoading) {
    return <Loading />;
  }

  // Function to generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const currentPage = meta.page;
    const totalPages = meta.totalPage;

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => handlePaginationChange(1)}
          isActive={currentPage === 1}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // Show ellipsis if current page is far from start
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePaginationChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Show ellipsis if current page is far from end
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePaginationChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <>
      <TopBar />
      <div className="bg-white p-4 rounded">
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

        <DataTable columns={columns} data={newsData} />
        {meta && meta.totalPage > 1 && (
          <Pagination className="mt-5">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePaginationChange(meta.page - 1)}
                  className={`cursor-pointer ${
                    meta.page === 1 ? "opacity-50 pointer-events-none" : ""
                  }`}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePaginationChange(meta.page + 1)}
                  className={`cursor-pointer ${
                    meta.page === meta.totalPage
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
};

export default NewsDataTable;
