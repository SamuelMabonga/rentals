import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { CollectionsContext } from 'context/context';

interface ReactTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T>[];
}

type Item = {
    image: string;
    name: string;
    price: string;
    rate: string;
    units: string;
    dateAdded: string;
    actions: any;
}

export const TableRenderer = <T extends object>({ data, columns}: ReactTableProps<T>) => {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const {
        activePropertiesTab: activeTab,
        setActivePropertiesTab: setActiveTab,
        setShowUnitTypeForm
    }: any = useContext(CollectionsContext)

    return (
        <Box width="100%" sx={{ overflowX: "scroll" }}>
            <Table sx={{
                borderCollapse: 'separate',
                borderSpacing: '0px 0.5rem'
            }}>
                <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableCell key={header.id} sx={{ color: "gray", textAlign: "left", fontWeight: "600", border: "0px", py: "0" }}>
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
                            // onClick={() => router.push("/properties/gwdjdw")}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}
                                    sx={{
                                        color: "gray",
                                        backgroundColor: "inherit",
                                        border: "solid primary.dark",
                                        borderWidth: "1px 0 1px 0",
                                        borderRadius: "0",
                                        cursor: "pointer",
                                        "&:first-of-type": {
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
        </Box>
    );
};