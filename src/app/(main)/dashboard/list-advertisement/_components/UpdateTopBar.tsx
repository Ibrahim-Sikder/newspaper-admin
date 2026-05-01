"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

const UpdateTopBar = () => {
  return (
    <>
      <div className="flex justify-between items-center content-center bg-white p-3  border rounded-md shadow-sm mb-5 gap-2 md:gap-0  ">
        <div className="space-y-2">
          <h2 className="text-sm md:text-3xl pl-2 font-semibold">
            Update Advertisement
          </h2>
        </div>
        <Link href={"/dashboard/list-advertisement"}>
          <Button className="rounded">Close</Button>
        </Link>
      </div>
    </>
  );
};

export default UpdateTopBar;
