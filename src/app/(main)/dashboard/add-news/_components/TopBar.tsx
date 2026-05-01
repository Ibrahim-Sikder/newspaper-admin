"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";

const TopBar = () => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg border shadow-sm mb-3 md:mb-5 gap-4 md:gap-8">
        <div className="space-y-2 flex-1">
          <h2 className="text-lg md:text-3xl pl-2 font-semibold text-gray-900">
            Add News
          </h2>
        </div>
        <Link href={"/dashboard/list-news"}>
          <Button className="hover:bg-red-600 rounded border border-gray-300hover:text-white">
            Close
          </Button>
        </Link>
      </div>
    </>
  );
};

export default TopBar;
