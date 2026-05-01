"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TopBar = () => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg border shadow-sm mb-3 md:mb-5 gap-4 md:gap-8">
        {/* Header Section */}
        <div className="space-y-2 flex-1">
          <h2 className="text-lg md:text-3xl pl-2 font-semibold text-gray-900">
            All Video News
          </h2>
        </div>

        {/* Create User Button */}
        <Link href={"/dashboard/add-video"}>
          <Button className="w-full sm:w-auto text-white hover:bg-blue-600">
            + Create Video News
          </Button>
        </Link>
      </div>
    </>
  );
};

export default TopBar;
