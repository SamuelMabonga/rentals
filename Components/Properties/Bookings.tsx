import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { useQuery } from '@tanstack/react-query';
import fetchBookings from 'apis/fetchBookings';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import fetchPropertyBookings from 'apis/property/fetchPropertyBookings';
import AlertDialog from 'Components/Common/AlertDialog';
import { CollectionsContext } from 'context/context';
import { set } from 'mongoose';
import BookingAlertDialog from './Forms/Components/BookingAlertDialog';

interface ReactTableProps<T extends object> {
    // data: T[];
    // columns: ColumnDef<T>[];
    property: string;
}

type Item = {
    image: string;
    name: string;
    type: string;
    status: string;
    tenant: string;
    dateCreated: string;
    actions: any;
}

const statusOptions = [
    {label: "Pending", value: "PENDING"},
    {label: "Accepted", value: "ACCEPTED"},
    {label: "Rejected", value:"REJECTED"}
] 


export const BookingsTable = <T extends object>({ property }: ReactTableProps<T>) => {

    const router = useRouter()
    const session: any = useSession()

    const {
        bookingPage: page,
        setBookingPage: setPage,
        bookingSearchQuery: searchQuery,
        setBookingSearchQuery: setSearchQuery,
        bookingStatus,
        setBookingStatus,
        setOpenBookingForm,
    }: any = useContext(CollectionsContext)

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
                accessorKey: "user.name",
            },
            {
                header: 'Unit',
                cell: (row) => row.renderValue(),
                accessorKey: 'unit.name',
            },
            {
                header: 'Status',
                cell: (row) => <Chip
                    label={row.row.original.status}
                    // color={row.row.original.status === "PENDING" ? "warning" : "limegreen"}
                    size="small"
                    sx={{
                        fontSize: "0.75rem",
                        bgcolor: row.row.original.status === "PENDING" ? "warning.main" : row.row.original.status === "ACCEPTED" ? "limegreen" : "error.main",
                        color: "white",
                    }}
                />,
                accessorKey: 'status',
            },
            {
                header: 'Date Created',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'createdAt',
            },
            {
                header: 'Actions',
                cell: (row: any) => (
                    <Box display="flex" gap="1rem">
                        <BookingAlertDialog
                            data={row.row.original}
                            disabled={row.row.original.status !== "PENDING"}
                            buttonLabel="Accept"
                            buttonVariant="contained"
                            title="Are you sure you want to accept this booking?"
                            content="If you accept, the user that created this booking will become a tenant at your property"
                            action="accept"
                        />
                        <BookingAlertDialog
                            data={row.row.original}
                            disabled={row.row.original.status !== "PENDING"}
                            buttonLabel="Reject"
                            buttonVariant="outlined"
                            buttonColor="error"
                            title="Are you sure you want to reject this booking?"
                            content="If you decline, the user that created this booking will not become a tenant at your property"
                            action="reject"
                        />
                    </Box>
                ),
            },
        ],
        []
    );


    const { data, isLoading }: any = useQuery({ queryKey: ['property-bookings', property, page, searchQuery, bookingStatus], queryFn: () => fetchPropertyBookings(property, page, searchQuery, bookingStatus) })

    return (
        <TableRenderer
            data={data?.data || []}
            pageInfo={data?.pageInfo}
            columns={columns}
            onRowClick={function (obj: any): void {
                console.log("Clicked row")
            }}
            loading={isLoading}
            setPage={setPage}

            status={bookingStatus}
            setStatus={setBookingStatus}

            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}

            statusOptions={statusOptions}

            buttonLabel='Create Booking'
            buttonAction={setOpenBookingForm}
        />
    );
};