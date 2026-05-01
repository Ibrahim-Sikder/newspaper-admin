/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ActionDropdown = ({ row, onView, onUpdate, onDelete }: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md border border-gray-200 transition-colors hover:bg-gray-100 focus:outline-none">
          <EllipsisVertical className="h-4 w-4 text-gray-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="left"
        className="w-40 bg-white rounded-md shadow-lg"
        sideOffset={5}
      >
        <DropdownMenuItem
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          onClick={() => onView(row.original)}
        >
          <Eye className="mr-2 h-4 w-4" />
          <span>View</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
          onClick={() => onUpdate(row.original)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionDropdown;
