/* eslint-disable @typescript-eslint/no-explicit-any */
'use clie'

import { useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterKey?: string
  filterPlaceholder?: string
  selectOptions?: {
    key: string
    options: { label: string; value: string }[]
    placeholder: string
  }
  customButton?: {
    label: string
    onClick: () => void
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  filterPlaceholder = "Search...",
  selectOptions,
  customButton,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  })

  return (
    <div className="">
      <div className="flex items-center justify-between gap-4 pb-3">
        {filterKey && (
          <div className="relative flex-grow mb-2 p-2">
            <div className="absolute p-3">
              <SearchIcon className="text-gray-400" />
            </div>
            <Input
              placeholder={filterPlaceholder}
              value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(filterKey)?.setFilterValue(event.target.value)}
              className="pl-10 py-3 lg:w-[300px] border border-blue-400 focus:border-blue-800 focus:ring-1 rounded"
            />
          </div>
        )}

        {customButton && (
          <Button
            variant="outline"
            size="default"
            onClick={customButton.onClick}
            className="text-sm font-medium bg-black text-white"
          >
            {customButton.label}
          </Button>
        )}

        {selectOptions && (
          <Select
            value={selectedType}
            onValueChange={(value) => {
              setSelectedType(value)
              if (value === "all") {
                table.getColumn(selectOptions.key)?.setFilterValue("")
              } else {
                table.getColumn(selectOptions.key)?.setFilterValue(value)
              }
            }}
          >
            <SelectTrigger className="w-[200px] border border-blue-400 focus:border-blue-800 focus:ring-1 rounded">
              <SelectValue placeholder={selectOptions.placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-blue-200">
              <SelectItem value="all">All</SelectItem>
              {selectOptions.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="overflow-x-auto border border-blue-200 rounded">
        <Table>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 px-4 text-left text-black font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="divide-y divide-gray-300">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : ""}
                  className="cursor-pointer hover:bg-blue-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4 text-sm text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6 text-emerald-500">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

