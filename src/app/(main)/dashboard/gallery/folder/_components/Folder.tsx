/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { FolderOpen, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDeleteFolderMutation,
  useGetAllFolderQuery,
} from "@/redux/dailynews/folder.api";
import Loading from "@/app/loading";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AddFolderModal from "./AddFolderModal";
import { motion } from "framer-motion";

const Folder = () => {
  const { data, isLoading, isError } = useGetAllFolderQuery({});
  const [deleteFolder] = useDeleteFolderMutation();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  const folderData =
    data?.map((item: any) => ({
      id: item._id,
      name: item.name || "N/A",
    })) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
          await deleteFolder(id).unwrap();
          Swal.fire("Deleted!", "Your activity has been deleted.", "success");
        }
      });
    } catch (err: any) {
      console.error("Error deleting news:", err);
      toast.error(err.message || "Failed to delete news.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-white border shadow-md rounded-md py-3 px-2 lg:px-6 flex  justify-between items-center gap-4">
        <div>
          <h1 className="text-xl text-black font-bold flex-1">Image Manager</h1>
        </div>
        <div className="hidden lg:flex">
          <div className="relative flex-grow">
            <div className="absolute p-3">
              <Search className="h-4 md:h-5 w-4 md:w-5" />
            </div>
            <Input
              placeholder="Search..."
              className="pl-10 py-3 w-[300px] border  focus:ring-1 rounded"
            />
          </div>
        </div>
        <div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-green-500 rounded text-white px-4 py-2"
          >
            + Create Folder
          </Button>
        </div>
      </div>

      {/* Folder Grid Section */}
      <motion.div
        className="py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 lg:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {folderData.map((folder: any, index: any) => (
          <motion.div
            key={folder.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <Link href={`/dashboard/gallery/folder/${folder.id}`}>
              <Card className="cursor-pointer hover:bg-gray-200 ">
                <CardHeader className="flex flex-col items-center p-2 lg:p-6">
                  <div className=" flex items-center justify-center ">
                    <FolderOpen
                      className="h-10 lg:h-20 w-10 lg:w-20 text-yellow-600 "
                      fill="#FFEB00"
                    />
                  </div>
                  <p className="mt-2 font-medium text-center">{folder.name}</p>
                </CardHeader>
              </Card>
            </Link>
            <button
              className="absolute top-2 right-2 text-red-500 p-2 hover:bg-gray-200 hover:rounded-full opacity-0 group-hover:opacity-100 transition"
              onClick={() => handleDelete(folder.id)}
            >
              <Trash2 />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      <AddFolderModal isOpen={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Folder;
