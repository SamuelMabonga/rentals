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
import ViewBooking from './Common/ViewBooking';

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
    { label: "Pending", value: "PENDING" },
    { label: "Accepted", value: "ACCEPTED" },
    { label: "Rejected", value: "REJECTED" }
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
                cell: (row: any) => {
                    return (
                        <Avatar
                            src={row?.row?.original?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.row.original.user.name)}&background=random&color=fff`}
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
        ],
        []
    );


    const { data, isLoading }: any = useQuery({ queryKey: ['property-bookings', property, page, searchQuery, bookingStatus], queryFn: () => fetchPropertyBookings(property, page, searchQuery, bookingStatus) })

    const [viewBooking, setViewBooking] = useState<Boolean>(false)
    const [booking, setBooking] = useState<any>(null)

    return (
        <>
            <TableRenderer
                data={data?.data || []}
                pageInfo={data?.pageInfo}
                columns={columns}
                onRowClick={function (obj: any): void {

                    setBooking(obj)
                    setViewBooking(true)
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
            <ViewBooking booking={booking} open={viewBooking} setIsOpen={setViewBooking} />
        </>
    );
};