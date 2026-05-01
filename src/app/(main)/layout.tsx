"use client";
import React, { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import Aside from "@/components/Aside/Aside";
import Navbar from "@/components/Navbar/Navbar";

const Layout = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-sky-950/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - Fixed, always on left */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 h-screen bg-sky-950 text-white
          transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-sky-900 rounded-md"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar scroll area */}
        <div className="w-full overflow-y-auto h-full">
          <Aside toggleSidebar={toggleSidebar} />
        </div>
      </aside>

      {/* Main Content - lg তে sidebar width এর সমান margin দিতে হবে */}
      <div className="flex flex-col flex-1 min-h-screen overflow-hidden lg:ml-64">
        {/* Navbar */}
        <nav className="sticky top-0 z-10 bg-white shadow-md flex-shrink-0">
          <div className="px-4 py-3 flex items-center justify-between lg:justify-end">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <Navbar />
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-3 md:p-6 bg-[#eceff1] overflow-y-auto">
          <div className="w-full max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
