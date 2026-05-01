/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DataTable } from "@/utils/Table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Swal from "sweetalert2";
import { Edit, Trash2 } from "lucide-react";
import TopBar from "./_components/TopBar";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
  useUpdateUserMutation,
} from "@/redux/dailynews/users.api";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import TextInput from "@/utils/Form_Inputs/TextInput";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import { useForm } from "react-hook-form";
import { useState } from "react";

type Inputs = {
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string; // Make optional
};

const Page = () => {
  const { data, isLoading } = useGetAllUserQuery({});
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const form = useForm<Inputs>({
    defaultValues: {
      name: "",
      email: "",
      role: "",
      status: "",
      password: "",
    },
  });

  const usersData =
    data?.map((item: any) => ({
      id: item._id,
      name: item.name || "N/A",
      email: item.email || "N/A",
      role: item.role || "N/A",
      status: item.status || "N/A",
    })) || [];

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    form.reset(user);
    setOpen(true);
  };

  const onSubmit = async (data: Inputs) => {
    try {
      // Create update payload without password by default
      const modifyData: any = {
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
      };

      // Only include password if it's provided and not empty
      if (data.password && data.password.trim() !== "") {
        modifyData.password = data.password;
      }

      if (selectedUser) {
        const result = await updateUser({
          id: selectedUser.id,
          body: modifyData,
        }).unwrap();

        if (result.success) {
          toast.success("User updated successfully!");
        }
      }

      form.reset();
      setSelectedUser(null);
      setOpen(false);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };
  const handleDelete = async (id: string) => {
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
        try {
          await deleteUser(id).unwrap();
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch {
          toast.error("Failed to delete user.");
        }
      }
    });
  };

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "status", header: "Status" },
    {
      accessorKey: "Action",
      header: "Action",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Trash2
            onClick={() => handleDelete(row.original.id)}
            className="text-red-500 bg-white border border-red-400 rounded-full p-[2px] "
          />
          {/* <Button
            className="text-white hover:bg-blue-600 bg-white rounded-full"
            
          > */}
          <Edit
            className="text-blue-500 bg-white border border-blue-400 rounded-full p-[2px]"
            onClick={() => handleEdit(row.original)}
          />
          {/* </Button> */}
        </div>
      ),
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <>
      <TopBar />
      <div className="p-4 overflow-x-auto bg-white">
        <DataTable
          columns={columns}
          data={usersData ?? []}
          filterKey="name"
          filterPlaceholder="Search by Name"
        />
      </div>

      {/* ✅ Global Edit Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="pt-12 px-6 overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-center text-xl font-semibold">
              Update User
            </SheetTitle>
            <hr className="my-4" />
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Name:</h3>
                  <TextInput
                    control={form.control}
                    name="name"
                    placeholder="Name"
                    rules={{ required: "Name is required" }}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Email:</h3>
                  <TextInput
                    control={form.control}
                    name="email"
                    placeholder="Email"
                    rules={{ required: "Email is required" }}
                  />
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">Role:</h3>
                  <SelectInput
                    control={form.control}
                    name="role"
                    placeholder="Select Role"
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "User", value: "user" },
                      { label: "Editor", value: "editor" },
                    ]}
                  />
                </div>

                <div>
                  <h3 className="font-medium text-gray-700">Status:</h3>
                  <SelectInput
                    control={form.control}
                    name="status"
                    placeholder="Select Status"
                    options={[
                      { label: "Active", value: "active" },
                      { label: "In-Active", value: "inactive" },
                    ]}
                  />
                </div>

                {/* <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Password:</h3>
                  <TextInput
                    control={form.control}
                    name="password"
                    placeholder="Password"
                    rules={{ required: "Password is required" }}
                  />
                </div> */}

                <div className="flex justify-end my-6">
                  <Button
                    type="submit"
                    className="text-white hover:bg-green-600"
                  >
                    Update User
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Page;
