import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Table as ReactTable } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowDown10,
  ArrowDown01,
} from "lucide-react";
import { useState } from "react";

import BaseForm from "@/components/forms/BaseForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormInputType } from "@/constants/form";
import { useCustomForm } from "@/hooks/useCustomForm";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { Datas } from "@/types/common";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  queryKey: string;
  queryParams?: any;
  queryFn: (
    page: number,
    size: number,
    params?: any
  ) => Promise<AxiosResponse<Datas<TData>, any>>;
  defaultSize?: number;
  filters?: (FormInputType | null)[];
}

export function DataTable<TData, TValue>({
  columns,
  queryKey,
  queryFn,
  defaultSize = 10,
  filters = [],
}: DataTableProps<TData, TValue>) {
  const { control, handleSubmit, reset } = useCustomForm();
  const [filter, setFilter] = useState({});
  const [data, setData] = useState<TData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "created_at",
      desc: true,
    },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultSize,
  });
  const [totalRows, setTotalRows] = useState(0);
  const totalPages = Math.ceil(totalRows / pagination.pageSize);

  const { isLoading } = useCustomQuery(
    [
      queryKey,
      {
        ...filter,
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sort: sorting
          .map((sort) => `${sort.id} ${sort.desc ? "desc" : "asc"}`)
          .join(","),
      },
    ],
    () =>
      queryFn(pagination.pageIndex * pagination.pageSize, pagination.pageSize, {
        ...filter,
        sort: sorting
          .map((sort) => `${sort.id} ${sort.desc ? "desc" : "asc"}`)
          .join(","),
      }),
    {
      keepPreviousData: true,
      onSuccess: (res) => {
        setTotalRows(res.count);
        setData(res.data);
      },
    }
  );

  const table = useReactTable({
    columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
    rowCount: totalRows,
    pageCount: totalPages,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  return (
    <div className="space-y-2">
      {filters.length > 0 && (
        <div className="rounded-md border flex flex-col p-4 space-y-2">
          <BaseForm control={control} fields={filters} />
          <div className="flex w-full space-x-2">
            <Button
              onClick={handleSubmit((userInput) => {
                setFilter(userInput);
                setPagination({ ...pagination, pageIndex: 0 });
              })}
              className="flex-grow-[4]"
            >
              검색하기
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setFilter({});
                reset();
              }}
              className="flex-grow-[1]"
            >
              초기화
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="text-xs md:text-base"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanSort() &&
                      !header.column.getIsSorted()
                        ? null
                        : {
                            asc: <ArrowDown01 />,
                            desc: <ArrowDown10 />,
                            false: null,
                          }[header.column.getIsSorted().toString()]}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs md:text-base">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: ReactTable<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 text-xs md:text-sm">
      <div className="hidden text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-wrap items-center space-x-4 lg:space-x-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Total {table.getRowCount()} rows
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
