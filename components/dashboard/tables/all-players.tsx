"use client";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import useSWRImmutable from "swr/immutable";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetcher } from "@/lib/utils";
import * as Sentry from "@sentry/nextjs";
import { IconAlertTriangle } from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { ViewPlayer } from "./view-player";

type IPlayer = {
  id: number;
  cid: number;
  license: string;
  name: string;
  charinfo: string;
  last_updated: string;
  online: boolean;
};

const AlertBanner = () => {
  return (
    <Alert className="border-red-600">
      <IconAlertTriangle className="h-4 w-4" color="red" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        The online indicator does <span className="font-bold">not</span>{" "}
        represent that the character is online, it{" "}
        <span className="font-bold">only</span> indicates that owner of the
        character is online and also this does not update at regular intervals
        due to large data being fetched.
      </AlertDescription>
    </Alert>
  );
};

const PlayersTable = () => {
  const { data, isLoading, error } = useSWRImmutable(
    "/api/database/players",
    fetcher
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchType, setSearchType] = useState("charinfo");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState("");
  const [selectedId, setSelectedId] = useState(0);

  const columns: ColumnDef<IPlayer>[] = [
    {
      accessorKey: "online",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Online
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const online = row.getValue("online");
        const styling = online ? "bg-green-500" : "!animate-none bg-red-700";
        return (
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping ${styling} absolute inline-flex h-full w-full rounded-full opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${styling}`}
            ></span>
          </span>
        );
      },
    },
    {
      accessorKey: "cid",
      header: "Character ID",
      cell: ({ row }) => <div>{row.getValue("cid")}</div>,
    },
    {
      accessorKey: "charinfo",
      header: "Character Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("charinfo")}</div>
      ),
    },
    {
      accessorKey: "money",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Money
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">
          {new Intl.NumberFormat("sv-SE", {
            style: "currency",
            currency: "SEK",
            notation: "standard",
          }).format(row.getValue("money"))}
        </div>
      ),
    },
    {
      accessorKey: "license",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            License
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("license")}</div>
      ),
    },
    {
      accessorKey: "last_updated",
      header: "Updated",
      cell: ({ row }) => (
        <div className="font-medium">
          {moment(row.getValue("last_updated"))
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const player = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(player.license)}
              >
                Copy license
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedId(player.cid);
                  setSelectedLicense(player.license);
                  setDialogOpen(true);
                }}
              >
                View player
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Start livestream</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <AlertBanner />

        <div className="py-4">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    Sentry.captureException(error);

    return (
      <div className="w-full h-[400px] flex justify-center items-center">
        <Alert className="border-red-600 max-w-lg">
          <IconAlertTriangle className="h-4 w-4" color="red" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            Failed to fetch players, please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ViewPlayer
        license={selectedLicense}
        cid={selectedId}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
      <AlertBanner />
      <div className="flex justify-between py-4">
        <Input
          placeholder={`Search by ${
            searchType === "charinfo" ? "name" : searchType
          }`}
          value={
            (table.getColumn(searchType)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(searchType)?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-4"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Search by <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={searchType}
              onValueChange={(val) => {
                table.resetColumnFilters(true);
                setSearchType(val);
              }}
            >
              <DropdownMenuRadioItem value="charinfo">
                Name
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="license">
                License
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {data.length} characters exists.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export { PlayersTable };
