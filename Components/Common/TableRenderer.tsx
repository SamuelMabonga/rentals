import { Autocomplete, Avatar, Box, Button, Chip, FormControl, Icon, IconButton, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { CollectionsContext } from 'context/context';
import Image from 'next/image';
import PaginationRounded from './PaginationRounded';

interface ReactTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T>[];
    onRowClick: (obj: any) => void;
    loading?: boolean;
    pageInfo: any;
    setPage?: (obj: any) => void;
    searchQuery: any;
    setSearchQuery?: any;
    status: string;
    setStatus?: any;
    statusOptions?: any;
    buttonAction?: any;
    buttonLabel?: string;
}

export const TableRenderer = <T extends object>({
    data,
    pageInfo,
    columns,
    onRowClick,
    loading = false,
    setPage,
    searchQuery,
    setSearchQuery,
    status,
    setStatus,
    statusOptions,
    buttonAction,
    buttonLabel
}: ReactTableProps<T>) => {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Box width="100%" display="flex" flexDirection="column" gap="1.5rem">
            <Box width="100%" display={"flex"} flexDirection={["column", "row"]} gap="1rem">
                <TextField
                    label="Search"
                    name="search"
                    placeholder="Search"
                    value={searchQuery}
                    sx={{
                        width: ["100%", "20rem"],
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="small"
                />

                <FormControl sx={{ minWidth: "10rem" }}>
                    <Autocomplete
                        size="small"
                        renderInput={(params: any) => <TextField {...params} label="Status" />}
                        options={statusOptions}
                        getOptionLabel={(option: any) => option.label}
                        value={statusOptions?.find((item: any) => item.value === status)}
                        onChange={(e, value: any) => {
                            if (!value?.value) {
                                return setStatus("")
                            }
                            setStatus(value.value)
                        }}
                    />
                </FormControl>
                <Button
                    variant="contained"
                    sx={{ ml: "auto", display: buttonLabel ? "flex" : "none" }}
                    onClick={() => buttonAction(true)}
                >
                    {buttonLabel}
                </Button>
            </Box>
            {
                loading ? (
                    <Box display="flex" flexDirection="column" gap="0.5rem">
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={40} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                        <Skeleton animation="wave" variant="rounded" width={"100%"} height={80} sx={{ borderRadius: "0.5rem" }} />
                    </Box>
                ) : data?.length > 0 ? (
                    <Box display="flex" flexDirection="column" gap="0.5rem">
                        <Box sx={{ overflowX: "scroll" }}>
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
                                    {table.getRowModel().rows.map((row: any) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{
                                                // border: "1px solid grey",
                                                borderRadius: "1rem",
                                                bgcolor: "white",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    bgcolor: "#F6F2FA"
                                                },
                                                boxShadow: "0px 4px 20px rgba(211, 205, 218, 0.25)",
                                                border: "1px solid rgba(211, 205, 218, 0.7)",
                                            }}
                                            onClick={() => onRowClick(row.original)}
                                        >
                                            {row.getVisibleCells().map((cell: any) => (
                                                <TableCell key={cell.id}
                                                    sx={{
                                                        fontWeight: "600",
                                                        whiteSpace: "nowrap",
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
                        <PaginationRounded pageInfo={pageInfo} setPage={setPage} />
                    </Box>
                ) : (
                    <Box maxWidth="20rem" mx="auto" my="5rem">
                        <Image
                            src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1686893118/RentIt/Illustrations/Empty_State_Photo_Editor_ivsmqy.svg"
                            alt="Empty state illustration"
                            width={0}
                            height={0}
                            layout="responsive"
                        />
                        <Typography textAlign="center" color="primary.dark" fontWeight="600">Nothing to see here</Typography>
                    </Box>
                )
            }
        </Box>
    );
};