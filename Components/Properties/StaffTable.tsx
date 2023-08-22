import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import fetchStaff from 'apis/property/fetchStaff';
import { CollectionsContext } from 'context/context';
import moment from 'moment';

interface ReactTableProps<T extends object> {
    // data: T[];
    // columns: ColumnDef<T>[];
    property: string;
}

const statusOptions = [
    {label: "Pending", value: "PENDING"},
    {label: "Active", value: "ACTIVE"},
    {label: "Inactive", value: "INACTIVE"},
]

type Item = {
    image: string;
    name: string;
    role: string;
    startDate: string;
    endDate: string;
    actions: any;
}

export const StaffTable = <T extends object>({ property }: ReactTableProps<T>) => {
    // CONTEXT
    const {
        staffPage: page,
        setStaffPage: setPage,
        staffSearchQuery: searchQuery,
        setStaffSearchQuery: setSearchQuery,
        staffStatus,
        setStaffStatus,
        setOpenStaffForm,

    }: any = useContext(CollectionsContext)

    const router = useRouter()
    const columns: any = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                header: 'Image',
                cell: (row: any) => {
                    return (
                        <Avatar
                            src={row.row.original.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.row.original.user.name)}&background=random&color=fff`}
                            alt={row.row.original.user.name}
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
                cell: (row: any) => row.renderValue(),
                accessorKey: 'user.name',
            },
            {
                header: 'Email',
                cell: (row: any) => row.renderValue(),
                accessorKey: 'user.email',
            },
            {
                header: 'Role',
                cell: (row) => row.renderValue(),
                accessorKey: 'role.name',
            },
            // {
            //     header: 'Start Date',
            //     cell: (row) => row.renderValue(),
            //     accessorKey: 'startDate',
            // },
            {
                header: 'Date Added',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'createdAt',
            },
            {
                header: 'Actions',
                cell: (row) => (
                    <Box display="flex" gap="1rem" >
                        <IconButton>
                            <Box width="1.5rem" height="1.5rem">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </Box>
                        </IconButton>

                        <IconButton>
                            <Box width="1.5rem" height="1.5rem">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </Box>
                        </IconButton>
                    </Box>
                ),
            },
        ],
        []
    );

    // const session: any = useSession()
    // const token = session.data.accessToken
    const { data, isLoading }: any = useQuery({ queryKey: ['property-staff', property, page, searchQuery, staffStatus], queryFn: () => fetchStaff(property, page, searchQuery, staffStatus) })

    return (
        <TableRenderer
            data={data?.data}
            pageInfo={data?.pageInfo}
            columns={columns}
            onRowClick={function (obj: any): void {
                console.log(obj)
            }}
            loading={isLoading}
            setPage={setPage}

            status={staffStatus}
            setStatus={setStaffStatus}
            statusOptions={statusOptions}

            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}

            buttonAction={setOpenStaffForm}
            buttonLabel="Create Staff"
        />
    );
};