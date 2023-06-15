import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/TableRenderer';
import { CollectionsContext } from 'context/context';
import moment from 'moment';

interface ReactTableProps<T extends object> {
    // data: T[];
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

export const PaymentsTable = <T extends object>({ }: ReactTableProps<T>) => {
    // CONTEXT
    const {
        setShowPropertyForm,
        setPropertyToEdit
    }: any = useContext(CollectionsContext)

    const data = [
        {
            image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
            name: "Wifi",
            unit: "Nairobi",
            start_date: "Wifi",
            end_date: "Nairobi",
            status: "Not Paid"
        },
        {
            image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
            name: "Wifi",
            unit: "Nairobi",
            start_date: "Wifi",
            end_date: "Nairobi",
            status: "Not Paid"
        },
        {
            image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
            name: "Wifi",
            unit: "Nairobi",
            start_date: "Wifi",
            end_date: "Nairobi",
            status: "Not Paid"
        },
        {
            image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
            name: "Wifi",
            unit: "Nairobi",
            start_date: "Wifi",
            end_date: "Nairobi",
            status: "Not Paid"
        },
        {
            image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
            name: "Wifi",
            unit: "Nairobi",
            start_date: "Wifi",
            end_date: "Nairobi",
            status: "Not Paid"
        },
        {
            image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
            name: "Wifi",
            unit: "Nairobi",
            start_date: "Wifi",
            end_date: "Nairobi",
            status: "Not Paid"
        },
    ]
        

    const router = useRouter()
    const columns: any = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                header: 'Image',
                cell: (row) => {
                    return (
                        <Avatar
                            // src={row.row.original.image}
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
                header: 'Item',
                cell: (row) => row.renderValue(),
                accessorKey: 'item',
            },
            {
                header: 'Status',
                cell: (row: any) => <Chip label={row.renderValue()} color="primary" size="small" />,
                accessorKey: 'status',
            },
            {
                header: 'Start Date',
                cell: (row: any) => row.renderValue(),
                accessorKey: 'start_date',
            },
            {
                header: 'End Date',
                cell: (row: any) => row.renderValue(),
                accessorKey: 'end_date',
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
            data={data}
            columns={columns}
            onRowClick={(rowId) => router.push(`/rentals/${rowId}`)}
        />
    );
};