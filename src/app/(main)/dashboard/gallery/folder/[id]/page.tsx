/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Image from "next/image";
import {
  useDeleteImagesMutation,
  useGetImagesByFolderQuery,
} from "@/redux/dailynews/images.api";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import TopBar from "../_components/TopBar";
import ImgZoomModal from "../_components/ImgZoomModal";
import { Trash2 } from "lucide-react";


const AllImages = ({ params }: any) => {
  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [folderId, setFolderId] = React.useState<string | null>(null);
  const { data, isLoading, isError } = useGetImagesByFolderQuery(folderId!, {
    skip: !folderId, 
  });
  const [deleteImage] = useDeleteImagesMutation();

  React.useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      if (resolvedParams.id) {
        setFolderId(resolvedParams.id);
      }
    };
    fetchParams();
  }, [params]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleDelete = async (id: string, public_id: string) => {
    const toastId = toast.loading("Deleting image...");
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
        await deleteImage({ id, public_id }).unwrap();
        toast.success("Image deleted successfully!", {
          id: toastId,
          duration: 3000,
        });
        Swal.fire("Deleted!", "Your image has been deleted.", "success");
      }
    } catch (err: any) {
      console.error("Error deleting Image:", err);
      toast.error(err?.data?.message || "Failed to delete Image.", {
        id: toastId,
        duration: 3000,
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <TopBar folderId={folderId || ""} />
      {/* <TopBar folderId={params.id} />  */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 p-1 md:p-4">
        {data?.images?.map((row: any, index: number) => (
          <div key={row._id || index} className="relative group">
            <Image
              src={row.url}
              className="w-full h-full rounded shadow-sm cursor-pointer"
              alt={`Image ${row._id}`}
              onClick={() => handleImageClick(row.url)}
              width={100}
              height={100}
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
              onClick={() => handleDelete(row._id, row.public_id)}
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
      <ImgZoomModal
        isOpen={open}
        onOpenChange={setOpen}
        selectedImage={selectedImage}
      />
    </>
  );
};

export default AllImages;
