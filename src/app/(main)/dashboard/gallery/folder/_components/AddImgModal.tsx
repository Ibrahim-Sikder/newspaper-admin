"use client";


import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/utils/Form_Inputs/Modal";

export type TProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const AddImgModal = ({ isOpen, onOpenChange }: TProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Add Folder"
      description="Create a new folder for organizing images."
    >
      <div className="space-y-2  ">
        <Input placeholder="Folder Name" />
        <Button>Create Folder</Button>
      </div>
    </Modal>
  );
};

export default AddImgModal;
