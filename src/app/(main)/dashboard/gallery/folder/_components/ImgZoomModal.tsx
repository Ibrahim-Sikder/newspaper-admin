"use client";
import Modal from "@/utils/Form_Inputs/Modal";
import Image from "next/image";
import React from "react";

export type TProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedImage: string | null;
};

const ImgZoomModal = ({ isOpen, onOpenChange, selectedImage }: TProps) => {
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} title="Image">
        <div className="flex justify-center items-center">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Zoomed"
              className=""
              width={1000}
              height={1000}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default ImgZoomModal;
