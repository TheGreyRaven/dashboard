// "use client";
// import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   SortingState,
//   useReactTable,
//   VisibilityState,
// } from "@tanstack/react-table";

// interface TXAdmins {
//   name: string;
//   master: boolean;
//   providers: {
//     citizenfx: {
//       id: string;
//       identifier: string;
//       data: {
//         name?: string;
//         profile: string;
//         nameid: string;
//         picture: string;
//       };
//     };
//   };
//   permissions?: [];
// }

// const columns: ColumnDef<TXAdmins>[] = [
//   {
//     accessorKey: "name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Name
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => <div>{row.getValue("name")}</div>,
//   },
//   {
//     accessorKey: "master",
//     header: () => <div className="text-right">Master</div>,
//     cell: ({ row }) => (
//       <div className="lowercase">{row.getValue("master")}</div>
//     ),
//   },
//   {
//     accessorKey: "identifier",
//     accessorFn: (row) => row.providers.citizenfx.identifier,
//     header: () => <div className="text-right">License</div>,
//     cell: ({ row }) => {
//       return <div className="text-right font-medium">AAA</div>;
//     },
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const user = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() =>
//                 navigator.clipboard.writeText(
//                   user.providers.citizenfx.identifier
//                 )
//               }
//             >
//               Copy license
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View admin</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
// ];

// const TxAdmins = ({ txAdmins }: { txAdmins: TXAdmins[] }) => {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});

//   const table = useReactTable({
//     txAdmins,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   return (
//     <div className="flex-1 space-y-4 pt-6">
//       <div className="flex items-baseline justify-between">
//         <div className="flex items-baseline">
//           <h2 className="text-3xl font-bold tracking-tight">TX Admins</h2>
//           <Image
//             src="/emoji/Ring-Buoy.png"
//             alt="Ring Buoy"
//             width="32"
//             height="32"
//             className="ml-2"
//             priority
//             unoptimized
//           />
//         </div>
//       </div>
//       <div>
//         <Card>
//           <CardHeader>
//             <CardTitle>Available TX admins</CardTitle>
//             <CardDescription>
//               Number of admins: {txAdmins.length}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="w-full">
//               <div className="flex items-center py-4">
//                 <Input
//                   placeholder="Search admin"
//                   value={
//                     (table?.getColumn("name")?.getFilterValue() as string) ?? ""
//                   }
//                   onChange={(event) =>
//                     table?.getColumn("name")?.setFilterValue(event.target.value)
//                   }
//                   className="max-w-sm mr-4"
//                 />
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" className="ml-auto">
//                       Columns <ChevronDown className="ml-2 h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     {table
//                       .getAllColumns()
//                       .filter((column) => column.getCanHide())
//                       .map((column) => {
//                         return (
//                           <DropdownMenuCheckboxItem
//                             key={column.id}
//                             className="capitalize"
//                             checked={column.getIsVisible()}
//                             onCheckedChange={(value) =>
//                               column.toggleVisibility(!!value)
//                             }
//                           >
//                             {column.id}
//                           </DropdownMenuCheckboxItem>
//                         );
//                       })}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//               <div className="rounded-md border">
//                 <Table>
//                   <TableHeader>
//                     {table?.getHeaderGroups().map((headerGroup) => (
//                       <TableRow key={headerGroup.id}>
//                         {headerGroup.headers.map((header) => {
//                           return (
//                             <TableHead key={header.id}>
//                               {header.isPlaceholder
//                                 ? null
//                                 : flexRender(
//                                     header.column.columnDef.header,
//                                     header.getContext()
//                                   )}
//                             </TableHead>
//                           );
//                         })}
//                       </TableRow>
//                     ))}
//                   </TableHeader>
//                   <TableBody>
//                     {table?.getRowModel().rows?.length ? (
//                       table?.getRowModel().rows.map((row) => (
//                         <TableRow
//                           key={row.id}
//                           data-state={row.getIsSelected() && "selected"}
//                         >
//                           {row.getVisibleCells().map((cell) => (
//                             <TableCell key={cell.id}>
//                               {flexRender(
//                                 cell.column.columnDef.cell,
//                                 cell.getContext()
//                               )}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell
//                           colSpan={columns.length}
//                           className="h-24 text-center"
//                         >
//                           No results.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//               <div className="flex items-center justify-end space-x-2 py-4">
//                 <div className="flex-1 text-sm text-muted-foreground">
//                   {txAdmins.length} TX admins exists.
//                 </div>
//                 <div className="space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => table?.previousPage()}
//                     disabled={!table?.getCanPreviousPage()}
//                   >
//                     Previous
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => table?.nextPage()}
//                     disabled={!table?.getCanNextPage()}
//                   >
//                     Next
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export { TxAdmins };
