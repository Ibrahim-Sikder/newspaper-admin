"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/utils/Form_Inputs/Modal";
import { useCreateFolderMutation } from "@/redux/dailynews/folder.api";
import { Form } from "@/components/ui/form";
import TextInput from "@/utils/Form_Inputs/TextInput";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  name: string;
};

export type TProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const AddFolderModal = ({ isOpen, onOpenChange }: TProps) => {
  const [createFolder] = useCreateFolderMutation();

  const form = useForm<Inputs>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: Inputs) => {
    try {
      const res = await createFolder(data).unwrap();

      if (res) {
        toast.success("Folder Create Successfully!");
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create Folder"
      description="Create a new folder for organizing images."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2  ">
            <TextInput
              control={form.control}
              name="name"
              placeholder="Folder Name"
              rules={{ required: "Folder name is required" }}
            />

            <div className="flex justify-end">
              <Button type="submit">Create Folder</Button>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default AddFolderModal;
