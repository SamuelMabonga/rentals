import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/TableRenderer';
import { useQuery } from '@tanstack/react-query';
import fetchBookings from 'apis/fetchBookings';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import fetchPropertyBookings from 'apis/property/fetchPropertyBookings';

function AlertDialog({ buttonLabel, buttonVariant, buttonColor="primary", title, content, onAgree, agreeing, setAgreeing }: any) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = (event: any) => {
        event.stopPropagation()
        setOpen(true);
    };

    const handleClose = (event: any) => {
        event.stopPropagation()
        setOpen(false);
    };

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (agreeing) {
            return setLoading(true)
        }

        return setLoading(false)
    }, [agreeing])

    return (
        <div>
            <Button variant={buttonVariant} color={buttonColor} size="small" sx={{ fontSize: "0.875rem" }} onClick={handleClickOpen}>
                {buttonLabel}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <LinearProgress sx={{display: loading ? "flex" : "none"}} />
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                       {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="error" onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={(event) => {
                            setAgreeing(true)
                            onAgree(event)
                        }} 
                        autoFocus
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

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

export const BookingsTable = <T extends object>({ property }: ReactTableProps<T>) => {

    const router = useRouter()
    const session: any = useSession()

    const [declining, setDeclining] = useState(false)
    const [accepting, setAccepting] = useState(false)

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
                header: 'First Name',
                cell: (row) => row.renderValue(),
                accessorKey: "user.first_name",
            },
            {
                header: 'Last Name',
                cell: (row) => row.renderValue(),
                accessorKey: "user.last_name",
            },
            {
                header: 'Unit',
                cell: (row) => row.renderValue(),
                accessorKey: 'unit.name',
            },
            {
                header: 'Status',
                cell: (row) => <Chip label={row.row.original.status} color="primary" size="small" />,
                accessorKey: 'status',
            },
            {
                header: 'Date Created',
                cell: (row: any) => row.renderValue(),
                accessorKey: 'createdAt',
            },
            {
                header: 'Actions',
                cell: (row: any) => (
                    <Box display="flex" gap="1rem" >
                        <AlertDialog
                            buttonLabel="Accept"
                            buttonVariant="contained"
                            title="Are you sure you want to accept this booking?"
                            content="If you accept, the user that created this booking will become a tenant at your property"
                            setAgreeing={setAccepting}
                            agreeing={accepting}
                            onAgree={async (event: any) => {
                                event.stopPropagation()
                                setAccepting(true)
                                try {
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/booking/accept`, {
                                        method: "POST",
                                        headers: {
                                            Authorization: `Bearer ${session.data.accessToken}`,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            status: "ACCEPTED",
                                            id: row.row.original._id,
                                            startDate: row.row.original.startDate, 
                                            endDate: row.row.original.endDate, 
                                            customRent: null, 
                                            customBillingPeriod: null
                                        })
                                    })

                                    console.log("RES", await res.json())
                                    setAccepting(false)
                                } catch (error) {
                                    setAccepting(false)
                                    alert("Failed to accept")
                                }
                            }}
                        />
                        <AlertDialog
                            buttonLabel="Decline"
                            buttonVariant="outlined"
                            buttonColor="error"
                            title="Are you sure you want to decline this booking?"
                            content="If you decline, the user that created this booking will not become a tenant at your property"
                            onAgree={async (event: any) => {
                                event.stopPropagation()
                                setDeclining(true)
                                try {
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/booking?id=${row.row.original._id}`, {
                                        method: "PUT",
                                        headers: {
                                            Authorization: `Bearer ${session.data.accessToken}`,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            status: "Rejected"
                                        })
                                    })

                                    console.log("RES", await res.json())
                                    setDeclining(false)
                                } catch (error) {
                                    setDeclining(false)
                                    alert("Failed to accept")
                                }
                            }}
                        />
                    </Box>
                ),
            },
        ],
        []
    );

    const { data, isLoading }: any = useQuery({ queryKey: ['property-bookings', property], queryFn: () => fetchPropertyBookings(session.data.accessToken, property) })

    return (
        <TableRenderer
            data={data?.data || []}
            columns={columns}
            onRowClick={function (obj: any): void {
                throw new Error('Function not implemented.');
            }}
            loading={isLoading}
            />
    );
};