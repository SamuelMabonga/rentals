import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/TableRenderer';
import { CollectionsContext } from 'context/context';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import fetchPayments from 'apis/tenant/fetchPayments';
import { useSession } from 'next-auth/react';

interface ReactTableProps<T extends object> {
    // data: T[];
    // columns: ColumnDef<T>[];
    tenant: string;
}

type Item = {
    image: string;
    name: string;
    status: string;
    tenants: string;
    dateCreated: string;
    actions: any;
}

export const PaymentsTable = <T extends object>({ tenant: id }: ReactTableProps<T>) => {
    // CONTEXT
    const {
        setShowPropertyForm,
        setPropertyToEdit
    }: any = useContext(CollectionsContext)

    const session: any = useSession()
    const token = session.data?.accessToken

    const {data, isLoading} = useQuery(["payments", id, token], () => fetchPayments(token, id))
        

    const router = useRouter()
    const columns: any = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                header: 'Amount',
                cell: (row) => row.renderValue(),
                accessorKey: 'amount',
            },
            {
                header: 'Status',
                cell: (row: any) => <Chip label={row.renderValue()} color="primary" sx={{bgcolor: row.renderValue() === "SUCCESSFUL" ? "limegreen" : row.renderValue() === "PENDING" ? "orange" : "red", fontWeight: "500", fontSize: "0.75rem"}} size="small" />,
                accessorKey: 'status',
            },
            {
                header: 'Date Created',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'createdAt',
            },
            {
                header: 'Date Paid',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'updatedAt',
            },
            // {
            //     header: 'Actions',
            //     cell: (row) => (
            //         <Box display="flex" gap="1rem" >
            //             <Button variant="contained" size="small" sx={{fontSize: "0.875rem"}}>Pay</Button>
            //             <Button variant="outlined" size="small" sx={{fontSize: "0.875rem"}}>Request Extension</Button>
            //         </Box>
            //     ),
            // },
        ],
        []
    );

    return (
        <TableRenderer
            data={data?.data}
            columns={columns}
            loading={isLoading}
            onRowClick={(rowId) => router.push(`/rentals/${rowId}`)}
        />
    );
};