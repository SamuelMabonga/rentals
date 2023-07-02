import { Avatar, Box, Button, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { CollectionsContext } from 'context/context';
import moment from 'moment';

interface ReactTableProps<T extends object> {
    data: T[];
    pageInfo: any;
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

export const RentalsTable = <T extends object>({ data, pageInfo }: ReactTableProps<T>) => {
    // CONTEXT
    const {
        setShowPropertyForm,
        setPropertyToEdit
    }: any = useContext(CollectionsContext)
        

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
                accessorKey: 'user.first_name',
            },
            {
                header: 'unit',
                cell: (row) => row.renderValue(),
                accessorKey: 'unit.name',
            },
            {
                header: 'Start Date',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'startDate',
            },
            {
                header: 'End Date',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'endDate',
            },
            {
                header: 'Actions',
                cell: (row) => (
                    <Box display="flex" gap="1rem" >
                        <IconButton>
                            <Box width="1.5rem" height="1.5rem">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Box>
                        </IconButton>

                        <IconButton onClick={(event) => {
                            event.stopPropagation()
                            setPropertyToEdit(row.row.original)
                            setShowPropertyForm(true)
                            return
                        }}>
                            <Box width="1.5rem" height="1.5rem">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </Box>
                        </IconButton>

                        <IconButton>
                            <Box width="1.5rem" height="1.5rem">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </Box>
                        </IconButton>
                    </Box>
                ),
            },
        ],
        []
    );

    return (
        <TableRenderer
            data={data}
            pageInfo={pageInfo}
            columns={columns}
            onRowClick={(row: any) => router.push(`/rentals/${row._id}`)}
        />
    );
};