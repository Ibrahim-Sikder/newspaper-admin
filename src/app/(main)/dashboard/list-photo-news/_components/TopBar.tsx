"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

const TopBar = () => {
  return (
    <>
      <div className="flex justify-between items-center content-center bg-white p-3  border rounded-md shadow-sm mb-5 gap-2 md:gap-0  ">
        <div className="space-y-2">
          <h2 className="text-sm md:text-3xl pl-2 font-semibold">
            All Photo News
          </h2>
        </div>
        <Link href={"/dashboard/add-photo-news"}>
          <Button className="rounded">+ Create Photo News</Button>
        </Link>
      </div>
    </>
  );
};

export default TopBar;
