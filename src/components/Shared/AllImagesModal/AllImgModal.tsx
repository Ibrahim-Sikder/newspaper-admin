/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Upload from "./Upload";
import Recent from "./Recent";

const AllImgModal = ({
  onImageSelect,
  onClose,
}: {
  onImageSelect: (images: any[]) => void;
  onClose: () => void;
}) => {
  const handleImageSelect = (images: any[]) => {
    onImageSelect(images);
  };
  return (
    <div className="w-full mt-5">
      <Tabs defaultValue="account" className="responsive-sheet">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Recent</TabsTrigger>
          <TabsTrigger value="password">New Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Recent onImageSelect={handleImageSelect} onClose={onClose} />
        </TabsContent>
        <TabsContent value="password">
          <Upload onSuccess={onClose} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllImgModal;
