"use client";

import * as React from "react";

const TopBar = () => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-lg border shadow-sm mb-3 md:mb-5 gap-4 md:gap-8">
        {/* Header Section */}
        <div className="space-y-2 flex-1">
          <h2 className="text-lg md:text-3xl pl-2 font-semibold text-gray-900">
           Create New Advertisements
          </h2>
        </div>

        
      </div>
    </>
  );
};

export default TopBar;
