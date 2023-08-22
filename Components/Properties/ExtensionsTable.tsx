import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { useQuery } from '@tanstack/react-query';
import fetchFeatures from 'apis/fetchFeatures';
import { useSession } from 'next-auth/react';
import currencyFormatter from 'Components/Common/currencyFormatter';
import moment from 'moment';
import AlertDialog from 'Components/Common/AlertDialog';
import fetchExtensions from 'apis/property/FetchExtensions';
import ViewRentExtensions from './Common/ViewRentExtensions';
import React from 'react';
import { CollectionsContext } from 'context/context';

interface ReactTableProps<T extends object> {
    // data: T[];
    // columns: ColumnDef<T>[];
    property: string;
}

type Item = {
    image: string;
    name: string;
    price: string;
    rate: string;
    dateAdded: string;
    actions: any;
}

const statusOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "Accepted", value: "ACCEPTED" },
    { label: "Rejected", value: "REJECTED" }
]


export const ExtensionsTable = <T extends object>({ property }: ReactTableProps<T>) => {
    // CONTEXT
    const {
        extensionStatus,
        setExtensionStatus,
        extensionsSearchQuery,
        setExtensionsSearchQuery,
        extensionsPage,
        setExtensionsPage,
    }: any = useContext(CollectionsContext)

    // SESSION
    const session: any = useSession()
    const token = session?.data?.accessToken
    const { data }: any = useQuery({
        queryKey: [
            'extensions',
            property,
            extensionsPage,
            extensionsSearchQuery,
            extensionStatus
        ],
        queryFn: () => fetchExtensions(
            property,
            extensionsPage,
            extensionsSearchQuery,
            extensionStatus
        )
    })

    const router = useRouter()
    const columns: any = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                header: 'Image',
                cell: (row: any) => {
                    return (
                        <Avatar
                            src={row?.row?.original?.tenant?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.row.original.tenant.user.name)}&background=random&color=fff`}
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
                header: 'Tenant',
                cell: (row: any) => row.renderValue(),
                accessorKey: 'tenant.user.name',
            },

            {
                header: 'Amount',
                cell: (row: any) => currencyFormatter(row?.row?.original?.bill?.amount, "UGX"),
                accessorKey: 'price',
            },
            {
                header: 'Deadline',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'bill.pay_by',
            },
            {
                header: 'New Deadline',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'newDate',
            },
            {
                header: 'Status',
                cell: (row: any) => <Chip
                    label={row.row.original.status}
                    // color={row.row.original.status === "PENDING" ? "warning" : "limegreen"}
                    size="small"
                    sx={{
                        fontSize: "0.75rem",
                        bgcolor: row.row.original.status === "PENDING" ? "warning.main" : "limegreen",
                        color: "white",
                    }}
                />,
                accessorKey: 'status',
            },
        ],
        []
    );

    const [rentExtension, setRentExtension] = React.useState<any>(null)
    const [viewRentExtension, setViewRentExtension] = React.useState<boolean>(false)

    return (
        <>
            <TableRenderer
                data={data?.data}
                pageInfo={data?.dataInfo}
                columns={columns}
                onRowClick={function (obj: any): void {
                    setRentExtension(obj)
                    setViewRentExtension(true)
                }}

                status={extensionStatus}
                setStatus={setExtensionStatus}
                statusOptions={statusOptions}

                searchQuery={extensionsSearchQuery}
                setSearchQuery={setExtensionsSearchQuery}

                setPage={setExtensionsPage}
            />
            <ViewRentExtensions
                rentExtension={rentExtension}
                open={viewRentExtension}
                setIsOpen={setViewRentExtension}
            />
        </>
    );
};