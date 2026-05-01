"use client";
import { CircleUser } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeCookie } from "@/axios/Cookies";
import { authKey } from "@/constant/authkey";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/redux/dailynews/users.api";

const Navbar = () => {
  const router = useRouter();
  const { data, isLoading } = useGetCurrentUserQuery();

  const handleLogout = () => {
    removeCookie(authKey);
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  if (isLoading) {
    return <div className="text-gray-600 text-sm">Loading user...</div>;
  }

  const user = data;

  return (
    <div className="flex justify-end items-center gap-4">
      {/* User Info */}
      <div className="text-right">
        <h1 className="text-gray-800 font-bold text-lg">{user?.name}</h1>
        <p className="text-blue-600 text-xs font-semibold uppercase">
          {user?.role}
        </p>
      </div>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition">
            <CircleUser size={36} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-48"
        >
          <DropdownMenuLabel className="text-gray-600 text-sm font-semibold px-4 py-2">
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="border-gray-200" />
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/profile")}
            className="cursor-pointer px-4 py-2 text-gray-700 text-sm hover:bg-blue-100 hover:text-blue-600 rounded transition"
          >
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer px-4 py-2 text-gray-700 text-sm hover:bg-red-100 hover:text-red-600 rounded transition"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
