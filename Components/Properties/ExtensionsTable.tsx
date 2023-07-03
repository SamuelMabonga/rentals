import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { useQuery } from '@tanstack/react-query';
import fetchFeatures from 'apis/fetchFeatures';
import { useSession } from 'next-auth/react';
// import fetchExtensions from 'apis/property/fetchExtensions';
import currencyFormatter from 'Components/Common/currencyFormatter';
import moment from 'moment';
import fetchExtensions from 'apis/property/FetchExtensions';

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

export const ExtensionsTable = <T extends object>({ property }: ReactTableProps<T>) => {
    // SESSION
    const session: any = useSession()
    const token = session?.data?.accessToken
    const { data }: any = useQuery({ queryKey: ['extensions', token, property], queryFn: () => fetchExtensions(token, property) })

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
                header: 'Tenant',
                cell: (row: any) => `${row?.row?.original?.tenant?.user?.first_name} ${row?.row?.original?.tenant?.user?.last_name}`,
                // accessorKey: 'name',
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
                header: 'Actions',
                cell: (row) => (
                    <Box display="flex" gap="1rem" >
                        <Button size="small" variant="outlined" color="error">Reject</Button>
                        <Button size="small" variant="contained">Accept</Button>
                    </Box>
                ),
            },
        ],
        []
    );

    return (
        <TableRenderer
            data={data?.data}
            pageInfo={data?.dataInfo}
            columns={columns}
            onRowClick={function (obj: any): void {
                console.log("Extension Clicked")
            }} />
    );
};