// app/dashboard/epaper/page.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useDeleteEpaperMutation,
  useGetAllEpapersQuery,
  useToggleEpaperStatusMutation,
} from "@/redux/dailynews/e-paper";
import { Epaper, EpaperResponse } from "@/types/e-paper";
import ArticleDetailsModal from "@/components/Dashboard/ArticleDetailsModal";

// Type for the query params
interface QueryParam {
  name: string;
  value: string | number;
}

const EpaperList: React.FC = () => {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [selectedEpaper, setSelectedEpaper] = useState<Epaper | null>(null);

  const queryParams: QueryParam[] = [
    { name: "page", value: currentPage },
    { name: "limit", value: limit },
  ];

  if (searchTerm) {
    queryParams.push({ name: "search", value: searchTerm });
  }

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetAllEpapersQuery(queryParams);

  // Log data when it changes
  useEffect(() => {
    if (data) {
      console.log("Component - Received data:", data);
      console.log("Component - Epapers array:", data.data);
      console.log("Component - Meta:", data.meta);
    }
  }, [data]);

  // Log errors
  useEffect(() => {
    if (error) {
      console.log("Component - Error:", error);
    }
  }, [error]);

  const [deleteEpaper] = useDeleteEpaperMutation();
  const [toggleStatus] = useToggleEpaperStatusMutation();

  // Access data safely with proper typing
  const epapers: Epaper[] = (data as EpaperResponse)?.data || [];
  const meta = (data as EpaperResponse)?.meta;

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await deleteEpaper(deleteId).unwrap();
      toast.success("Epaper deleted successfully");
      refetch();
    } catch (err: unknown) {
      console.error("Delete error:", err);
      const errorMessage = (err as { data?: { message?: string } })?.data
        ?.message;
      toast.error(errorMessage || "Failed to delete");
    } finally {
      setDeleteId(null);
    }
  }, [deleteId, deleteEpaper, refetch]);

  const handleToggleStatus = useCallback(
    async (date: string, currentStatus: boolean) => {
      try {
        await toggleStatus({ date, isActive: !currentStatus }).unwrap();
        toast.success(`Epaper ${!currentStatus ? "activated" : "deactivated"}`);
        refetch();
      } catch (err: unknown) {
        console.error("Toggle error:", err);
        const errorMessage = (err as { data?: { message?: string } })?.data
          ?.message;
        toast.error(errorMessage || "Failed to update status");
      }
    },
    [toggleStatus, refetch],
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleViewDetails = useCallback((epaper: Epaper) => {
    setSelectedEpaper(epaper);
  }, []);

  const totalArticles = useCallback((epaper: Epaper): number => {
    return (
      epaper.pages?.reduce(
        (sum: number, page) => sum + (page.articles?.length || 0),
        0,
      ) || 0
    );
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error loading epapers</p>
          <p className="text-sm mt-2">
            Please check your connection and try again
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">📰 ই-পেপার লিস্ট</h1>
        <Button
          onClick={() => router.push("/dashboard/e-paper/add")}
          className="gap-2"
        >
          <Plus size={16} /> নতুন ই-পেপার
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          type="text"
          placeholder="Search by date or title..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>তারিখ</TableHead>
                <TableHead>শিরোনাম</TableHead>
                <TableHead>পৃষ্ঠা</TableHead>
                <TableHead>আর্টিকেল</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="text-right">একশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {epapers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    কোন ই-পেপার পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                epapers.map((epaper: Epaper) => (
                  <TableRow key={epaper._id}>
                    <TableCell className="font-medium">{epaper.date}</TableCell>
                    <TableCell>{epaper.title}</TableCell>
                    <TableCell>{epaper.pages?.length || 0}</TableCell>
                    <TableCell>{totalArticles(epaper)}</TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          handleToggleStatus(epaper.date, epaper.isActive)
                        }
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          epaper.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {epaper.isActive ? (
                          <>
                            <CheckCircle size={12} /> সক্রিয়
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> নিষ্ক্রিয়
                          </>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(epaper)}
                        title="View Details"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/e-paper/edit?date=${epaper.date}`,
                          )
                        }
                      >
                        <Edit size={16} className="text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(epaper.date)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex justify-between items-center p-4 border-t flex-wrap gap-4">
            <div className="text-sm text-gray-500">
              Showing {(meta.page - 1) * meta.limit + 1} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
              results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isFetching}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, meta.totalPage))
                }
                disabled={currentPage === meta.totalPage || isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই ই-পেপারটি স্থায়ীভাবে মুছে ফেলা হবে। এই action পূর্বাবস্থায়
              ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Article Details Modal */}
      <ArticleDetailsModal
        epaper={selectedEpaper}
        onClose={() => setSelectedEpaper(null)}
      />
    </div>
  );
};

export default EpaperList;
