"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import { useCreateUserMutation } from "@/redux/dailynews/users.api";
import toast from "react-hot-toast";
import TextInput from "@/utils/Form_Inputs/TextInput";

type Inputs = {
  name: string;
  email: string;
  role: string;
  status: string;
  password: string;
};

const TopBar = () => {
  const [createUser] = useCreateUserMutation({});

  const form = useForm<Inputs>({
    defaultValues: {
      name: "",
      email: "",
      role: "",
      status: "",
      password: "",
    },
  });

  const onSubmit = async (data: Inputs) => {
    const modifyData = {
      ...data,
      name: data.name,
      postDate: new Date().toISOString(),
    };

    try {
      const res = await createUser(modifyData).unwrap();

      if (res) {
        toast.success("User Create Successfully!");
        form.reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg border shadow-sm mb-3 md:mb-5 gap-4 md:gap-8">
        {/* Header Section */}
        <div className="space-y-2 flex-1">
          <h2 className="text-lg md:text-3xl pl-2 font-semibold text-gray-900">
            All Users
          </h2>
        </div>

        {/* Create User Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className=" text-white hover:bg-blue-600">
              + Create User
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="pt-12 px-6 overflow-auto">
            <SheetHeader>
              <SheetTitle className="text-center text-xl font-semibold">
                Create User
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

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">Password:</h3>

                    <TextInput
                      control={form.control}
                      name="password"
                      placeholder="Password"
                      rules={{ required: "Password is required" }}
                    />
                  </div>

                  <div className="flex justify-end my-6">
                    <Button
                      // onClick={handleButtonClick}
                      type="submit"
                      className=" text-white hover:bg-green-600"
                    >
                      Create User
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default TopBar;
