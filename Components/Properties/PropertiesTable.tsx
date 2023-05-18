import { Avatar, Box, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';

interface ReactTableProps<T extends object> {
    data: T[];
    // columns: ColumnDef<T>[];
}

type Item = {
    image: string;
    name: string;
    status: string;
    tenants: string;
    dateCreated: string;
    actions: any;
}

export const PropertiesTable = <T extends object>({ data }: ReactTableProps<T>) => {
    const router = useRouter()
    const columns: any = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                header: 'Image',
                cell: (row) => {
                    return (
                        <Avatar
                            src={row.row.original.image}
                            alt="Avatar"
                            sx={{
                                width: "3rem",
                                height: "3rem"
                            }}
                        />
                    )
                },
            },
            {
                header: 'Name',
                cell: (row) => row.renderValue(),
                accessorKey: 'name',
            },
            {
                header: 'Status',
                cell: (row) => row.renderValue(),
                accessorKey: 'status',
            },
            {
                header: 'Tenants',
                cell: (row) => row.renderValue(),
                accessorKey: 'tenants',
            },
            {
                header: 'Date Created',
                cell: (row) => row.renderValue(),
                accessorKey: 'dateCreated',
            },
            {
                header: 'Actions',
                cell: (row) => (
                    <Box display="flex" gap="1rem" >
                        <IconButton>
                            <Box width="1.5rem" height="1.5rem">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Box>
                        </IconButton>

                        <IconButton>
                            <Box width="1.5rem" height="1.5rem">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </Box>
                        </IconButton>

                        <IconButton>
                            <Box width="1.5rem" height="1.5rem">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Box>
                        </IconButton>
                    </Box>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Table sx={{    borderCollapse: 'separate',
        borderSpacing: '0px 0.5rem'}}>
            <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableCell key={header.id} sx={{textAlign: "left", fontWeight: "600", border: "0px", py: "0"}}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        sx={{
                            border: "1px solid grey",
                            borderRadius: "1rem",
                            bgcolor: "white",
                            cursor: "pointer",
                            "&:hover": {
                                bgcolor: "#F6F2FA"
                            }
                        }}
                        onClick={() => router.push("/properties/gwdjdw")}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}
                                sx={{
                                    backgroundColor: "inherit",
                                    border: "solid primary.dark",
                                    borderWidth: "1px 0 1px 0",
                                    borderRadius: "0",
                                    cursor: "pointer",
                                    "&:first-child": {
                                        borderWidth: "1px 0 1px 1px",
                                        borderRadius: "1rem 0 0 1rem"
                                    },
                                    "&:last-child": {
                                        borderWidth: "1px 1px 1px 0",
                                        borderRadius: "0 1rem 1rem 0"
                                    }
                                }}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};