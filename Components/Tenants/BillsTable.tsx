import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/TableRenderer';
import { CollectionsContext } from 'context/context';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import fetchBills from 'apis/tenant/fetchBills';

interface ReactTableProps<T extends object> {
    // data: T[];
    // columns: ColumnDef<T>[];
    tenant: string
}

type Item = {
    image: string;
    name: string;
    status: string;
    tenants: string;
    dateCreated: string;
    actions: any;
}

export const BillsTable = <T extends object>({ tenant }: ReactTableProps<T>) => {

    const session: any = useSession()
    const { data, isLoading }: any = useQuery({ queryKey: ['tenant-bills', tenant], queryFn: () => fetchBills(session.data.accessToken, tenant) })
        

    const router = useRouter()
    const columns: any = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                header: 'Item',
                cell: (row: any) => row?.row?.original?.propertyFeature?.feature?.name ?? row.renderValue(),
                accessorKey: 'type',
            },
            {
                header: 'Amount (UGX)',
                cell: (row) => row.renderValue(),
                accessorKey: 'amount',
            },
            {
                header: 'Status',
                cell: (row: any) => <Chip label={row.renderValue()} color="primary" size="small" />,
                accessorKey: 'status',
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
                        <Button variant="contained" size="small" sx={{fontSize: "0.875rem"}}>Pay</Button>
                        <Button variant="outlined" size="small" sx={{fontSize: "0.875rem"}}>Request Extension</Button>
                    </Box>
                ),
            },
        ],
        []
    );

    return (
        <TableRenderer
            data={data?.data}
            columns={columns}
            onRowClick={(rowId) => router.push(`/rentals/${rowId}`)}
        />
    );
};