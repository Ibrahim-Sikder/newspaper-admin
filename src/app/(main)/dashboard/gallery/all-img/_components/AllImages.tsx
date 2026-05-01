/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ImgZoomModal from "./ImgZoomModal";
import {
  useDeleteImagesMutation,
  useGetAllImagesQuery,
} from "@/redux/dailynews/images.api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Trash2, Search } from "lucide-react";
import Loader from "@/app/loading";
import { TQueryParam } from "@/types/api.types";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";

const ITEMS_PER_PAGE = 20;

const AllImages = () => {
  const [openZoom, setOpenZoom] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Always fetch all with limit=1000 and filter/paginate client-side
  // since backend returns no meta
  const [params] = React.useState<TQueryParam[]>([
    { name: "limit", value: "1000" },
    { name: "page", value: "1" },
  ]);

  const { data, isLoading, refetch } = useGetAllImagesQuery(params);
  const [deleteImage] = useDeleteImagesMutation();

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const allImages: any[] = (data as any)?.data ?? [];

  // Client-side filter by search
  const filteredImages = React.useMemo(() => {
    if (!debouncedSearch) return allImages;
    const lower = debouncedSearch.toLowerCase();
    return allImages.filter(
      (img: any) =>
        img.url?.toLowerCase().includes(lower) ||
        img.public_id?.toLowerCase().includes(lower) ||
        img.folder?.name?.toLowerCase().includes(lower),
    );
  }, [allImages, debouncedSearch]);

  // Client-side pagination
  const totalItems = filteredImages.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
  const indexOfLastItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
  const paginatedImages = filteredImages.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpenZoom(true);
  };

  const handleDelete = async (id: string, public_id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const toastId = toast.loading("Deleting image...");
        try {
          await deleteImage({ id, public_id }).unwrap();
          toast.dismiss(toastId);
          toast.success("Image deleted successfully!", { duration: 3000 });
          Swal.fire("Deleted!", "Your image has been deleted.", "success");

          // If last item on page, go to previous page
          if (paginatedImages.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          } else {
            refetch();
          }
        } catch (err: any) {
          toast.dismiss(toastId);
          toast.error(err?.data?.message || "Failed to delete image.", {
            duration: 3000,
          });
        }
      }
    } catch (err) {
      console.error("Error in delete confirmation:", err);
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationItems = () => {
    const items = [];
    const current = currentPage;
    const total = totalPages;

    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={current === 1}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    if (current > 3) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    const startPage = Math.max(2, current - 1);
    const endPage = Math.min(total - 1, current + 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={current === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (current < total - 2) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (total > 1) {
      items.push(
        <PaginationItem key={total}>
          <PaginationLink
            onClick={() => handlePageChange(total)}
            isActive={current === total}
            className="cursor-pointer"
          >
            {total}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="w-full">
        {/* Search Bar */}
        <div className="mb-4 px-1 md:px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 lg:w-[300px] rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-gray-300"
            />
          </div>
        </div>

        {/* Image Grid */}
        <div className="text-gray-900">
          <div className="grid grid-cols-4 gap-2 lg:gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 p-1 md:p-4">
            {paginatedImages.map((image: any) => (
              <div key={image._id} className="relative group">
                <Image
                  src={image.url}
                  className="w-full h-full rounded shadow-sm bg-gray-500 aspect-square cursor-pointer object-cover"
                  alt={`Image ${image._id}`}
                  onClick={() => handleImageClick(image.url)}
                  width={200}
                  height={200}
                  priority
                />
                <button
                  className="absolute top-2 right-2 text-red-500 p-2 hover:bg-gray-200 hover:rounded-full opacity-0 group-hover:opacity-100 transition"
                  onClick={() => handleDelete(image._id, image.public_id)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Info */}
        {totalItems > 0 && (
          <div className="text-center text-sm text-gray-500 mb-4">
            Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalItems}{" "}
            images
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="my-10">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`cursor-pointer ${
                    currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                  }`}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`cursor-pointer ${
                    currentPage === totalPages
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* Empty State */}
        {totalItems === 0 && (
          <div className="text-center text-gray-500 py-10">
            No images found.
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <ImgZoomModal
        isOpen={openZoom}
        onOpenChange={setOpenZoom}
        selectedImage={selectedImage}
      />
    </>
  );
};

export default AllImages;
