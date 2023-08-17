import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { CollectionsContext } from 'context/context';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import fetchPayments from 'apis/tenant/fetchPayments';
import { useSession } from 'next-auth/react';
import fetchTickets from 'apis/tenant/fetchTickets';

interface ReactTableProps<T extends object> {
    // data: T[];
    // columns: ColumnDef<T>[];
    tenant: any;
}

type Item = {
    image: string;
    name: string;
    status: string;
    tenants: string;
    dateCreated: string;
    actions: any;
}

export const TicketsTable = <T extends object>({ tenant }: ReactTableProps<T>) => {
    // CONTEXT
    const {
        setShowPropertyForm,
        setPropertyToEdit,
        setOpenTicketForm 
    }: any = useContext(CollectionsContext)

    // const tenantId = tenant?._id

    const session: any = useSession()
    const token = session.data?.accessToken

    const {data, isLoading} = useQuery(["tenant-tickets", tenant], () => fetchTickets(tenant))
        

    const router = useRouter()
    const columns: any = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                header: 'Type',
                cell: (row) => row.renderValue(),
                accessorKey: 'type',
            },
            // {
            //     header: 'Message',
            //     cell: (row) => row.renderValue(),
            //     accessorKey: 'message',
            // },
            {
                header: 'Status',
                cell: (row: any) => <Chip
                    label={row.renderValue()}
                    color={row.renderValue() === "PENDING" ? "warning" : row.renderValue() === "INPROGRESS" ? "info" : "success"}
                    sx={{ fontWeight: "500", fontSize: "0.75rem"}}
                    size="small"
                />,
                accessorKey: 'status',
            },
            {
                header: 'Date Created',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'createdAt',
            },
            // {
            //     header: 'Date Paid',
            //     cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
            //     accessorKey: 'updatedAt',
            // },
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
            pageInfo={data?.pageInfo}
            columns={columns}
            loading={isLoading}
            onRowClick={(rowId) => console.log(rowId)}

            buttonAction={setOpenTicketForm}
            buttonLabel="Create Ticket"
        />
    );
};