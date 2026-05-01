/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loader from "@/components/Loader";
import {
  useDeleteAdvertisementMutation,
  useGetAllAdvertisementQuery,
} from "@/redux/dailynews/advertisement.api";
import { TMeta, TQueryParam } from "@/types/api.types";
import ActionDropdown from "@/utils/Action/ActionDropdown";
import { updatePaginationParams } from "@/utils/pagination";
import { DataTable } from "@/utils/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
const ListAdvertisement = () => {
  const router = useRouter();

  // API call

  const [deleteAdvertisement] = useDeleteAdvertisementMutation();


  const [params, setParams] = useState<TQueryParam[]>([
    { name: "page", value: "1" },
    { name: "limit", value: "5" },
  ])
  const [searchQuery, setSearchQuery] = useState("")


  const { data, isLoading, isError } = useGetAllAdvertisementQuery(params);

  const advertisements = data?.data
  const meta = data?.meta as TMeta

  const newsData = advertisements?.map((item: any) => ({
    id: item._id,
    advertisementImage: item.advertisementImage || "N/A",
    scheduleAdvertisements: item.scheduleAdvertisements || "N/A",
    advertisementLink: item.advertisementLink || "N/A",
    displayLocation: item.displayLocation || "N/A",
    adminName: item.adminName || "N/A",
  })) || [];

  const handleEdit = (rowData: any) => {
    router.push(`/dashboard/list-advertisement/update-details/${rowData.id}`);
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
          await deleteAdvertisement(id).unwrap();
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

  const columns: ColumnDef<any, any>[] = [
    {
      accessorKey: "advertisementImage",
      header: () => <span className="font-bold">Image</span>,
      cell: ({ row }) => {
        const imageUrl = row.getValue("advertisementImage") as string;
        return imageUrl && imageUrl !== "N/A" ? (
          <div className="w-20 h-20 relative">
            <Image
              src={imageUrl}
              alt="Advertisement Image"
              fill
              className="object-cover rounded"
            />
          </div>
        ) : (
          <span>No Image</span>
        );
      },
    },
    // {
    //   accessorKey: "advertisementImage",
    //   header: () => <span className="font-bold">Image</span>,
    // },
    {
      accessorKey: "advertisementLink",
      header: () => <span className="font-bold">Ad. Link</span>,
    },
    {
      accessorKey: "displayLocation",
      header: () => <span className="font-bold">Ad. Location</span>,
    },
    {
      accessorKey: "scheduleAdvertisements",
      header: () => <span className="font-bold">Ad. Schedule</span>,
    },
    {
      accessorKey: "adminName",
      header: () => <span className="font-bold">Admin Name</span>,
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
  const handlePaginationChange = (page: number) => {
    setParams((prev) => updatePaginationParams(prev, page, meta?.limit || 5))
  }
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="overflow-x-auto bg-white p-2">
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
  );
};

export default ListAdvertisement;
