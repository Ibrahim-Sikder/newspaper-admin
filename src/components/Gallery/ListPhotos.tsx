// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   useDeleteImageMutation,
//   useGetAllImagesQuery,
//   useGetFoldersQuery,
// } from "@/redux/features/gallery.api";
// import { TMeta, TQueryParam } from "@/types";
// import { ImageIcon, RefreshCcw, Trash } from "lucide-react";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { FaFileCsv, FaFilePdf } from "react-icons/fa";
// import CreateFolder from "./CreateFolder";
// import UploadImagePopover from "./UploadImagePopover";
// import { TbFileTypeSvg } from "react-icons/tb";
// import GlobalPagination from "../GlobalPagination";
// import Loading from "@/app/loading";
// import { Skeleton } from "../ui/skeleton";

// export const fileIcons: Record<string, JSX.Element> = {
//   pdf: <FaFilePdf className="text-red-600 text-6xl" />,
//   csv: <FaFileCsv className="text-green-600 text-6xl" />,
//   svg: <TbFileTypeSvg className="text-blue-600 text-6xl" />,
// };

// export const getFileType = (url: string) => {
//   const extension = url.split(".").pop()?.toLowerCase();
//   return extension === "jpg" ||
//     extension === "jpeg" ||
//     extension === "png" ||
//     extension === "gif" ||
//     extension === "svg" ||
//     extension === "webp"
//     ? "image"
//     : extension;
// };

// const ListPhotos: React.FC = () => {
//   const [params, setParams] = useState<TQueryParam[]>([]);
//   const [selectedFolder, setSelectedFolder] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   const {
//     data: imagesData,
//     isLoading,
//     refetch,
//     isFetching,
//   } = useGetAllImagesQuery([...params]) as any;
//   const [deleteImage] = useDeleteImageMutation();
//   const { data: foldersData, isLoading: foldersIsLoading } = useGetFoldersQuery(
//     undefined,
//   ) as any;

//   const folders = foldersData?.data || [];
//   const metaData = imagesData?.meta as TMeta;
//   const images = imagesData?.data || [];

//   useEffect(() => {
//     if (selectedFolder) {
//       setParams([{ name: "folder", value: selectedFolder }]);
//     } else {
//       setParams([]);
//     }
//   }, [selectedFolder]);

//   if (isLoading || foldersIsLoading) {
//     return <Loading />;
//   }

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="mt-5">
//       <div className="mb-6 flex items-center space-x-2">
//         <Select onValueChange={setSelectedFolder} value={selectedFolder}>
//           <SelectTrigger className="w-[200px]">
//             <SelectValue placeholder="Filter by folder" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value={null as any}>All Folders</SelectItem>
//             {folders.map((folder: any) => (
//               <SelectItem key={folder._id} value={folder._id}>
//                 {folder.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Button
//           onClick={() => refetch()}
//           className="flex items-center space-x-2"
//           variant="outline"
//         >
//           <RefreshCcw className="w-4 h-4" />
//           <span>Refresh</span>
//         </Button>
//         <CreateFolder />
//         <UploadImagePopover folders={folders} />
//       </div>

//       <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-6 xl:gap-x-8">
//         {isFetching ? (
//           Array.from({ length: images.length || 12 }).map((_, index) => (
//             <div key={index} className="relative group">
//               <Skeleton className="aspect-square rounded-lg" />
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <ImageIcon className="text-gray-600 " size={64} />
//               </div>
//             </div>
//           ))
//         ) : images.length === 0 ? (
//           <p>No images found</p>
//         ) : (
//           images.map((image: any) => {
//             const fileType = getFileType(image.url);
//             return (
//               <div key={image._id} className="relative group">
//                 <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 border">
//                   {fileType === "image" ? (
//                     <Image
//                       src={image.url}
//                       alt={image.name}
//                       layout="fill"
//                       objectFit="cover"
//                       className="p-2 cursor-pointer"
//                       placeholder="blur"
//                       sizes="100%"
//                       blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
//                     />
//                   ) : (
//                     <a
//                       href={image.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center justify-center h-full"
//                     >
//                       {fileIcons[fileType as keyof typeof fileIcons] || (
//                         <FaFileCsv className="text-gray-600 text-6xl" />
//                       )}
//                     </a>
//                   )}
//                 </div>

//                 {/* Delete Button */}
//                 <DeleteDialog
//                   title="Delete Image"
//                   description="Are you sure you want to delete this image? This action cannot be undone."
//                   onDelete={deleteImage}
//                   id={image._id}
//                   public_id={image.public_id}
//                   trigger={
//                     <button className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full group-hover:block group-hover:opacity-100 opacity-0 transition-opacity">
//                       <Trash className="w-4 h-4" />
//                     </button>
//                   }
//                 />
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="mt-8">
//         <GlobalPagination
//           currentPage={currentPage}
//           totalPages={metaData?.totalPage}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// export default ListPhotos;
