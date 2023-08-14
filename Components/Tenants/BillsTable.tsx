import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, LinearProgress, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { CollectionsContext } from 'context/context';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import fetchBills from 'apis/tenant/fetchBills';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import RequestExtension from './Forms/RequestExtension';
import currencyFormatter from 'Components/Common/currencyFormatter';

function AlertDialog({
    hide,
    buttonLabel,
    buttonVariant,
    buttonColor = "primary",
    title,
    content,
    onAgree,
    agreeing,
    setAgreeing,
    // onOpen
}: any) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = (event: any) => {
        event.stopPropagation()
        event.stopPropagation()
        setOpen(true);
        // onOpen(event)
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
        <div style={{display: hide ? "none" : "block"}}>
            <Button variant={buttonVariant} color={buttonColor} size="small" sx={{ fontSize: "0.875rem",  }} onClick={handleClickOpen}>
                {buttonLabel}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{display: hide ? "none" : "block"}}
            >
                <LinearProgress sx={{ display: loading ? "flex" : "none" }} />
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{padding: "1rem"}}>
                    <Button variant="outlined" color="error" onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={(event) => {
                            // setAgreeing(true)
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
    tenant: any
    // openFlutterwave: any
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

    const [billToExtend, setBillToExtend] = React.useState<any>(null)

    const {
        openRequestExtension: open,
        setOpenRequestExtension: setIsOpen,

        bookingToEdit: toEdit,
        setBookingToEdit: setToEdit,
        setSnackbarMessage,

        paymentConfig,
        setPaymentConfig,

        tenantBillsPage: page,
        setTenantBillsPage: setPage,
    }: any = useContext(CollectionsContext)

    // const session: any = useSession()
    // const token = session?.data?.accessToken
    // const tenantId = tenant?._id
    const { data, isLoading, refetch }: any = useQuery({ queryKey: ['tenant-bills', tenant, page], queryFn: () => fetchBills(tenant, page) })

    const { data: user }: any = useSession()

    

    const handleFlutterPayment = useFlutterwave(paymentConfig);

    useEffect(() => {
        if (!paymentConfig?.tx_ref) {
            return
        }

        handleFlutterPayment({
            callback: (response: any) => {
                console.log(response);
                closePaymentModal() // this will close the modal programmatically
            },
            onClose: () => { },
        });
    }, [paymentConfig?.tx_ref])

    const columns: any = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                header: 'Item',
                cell: (row: any) => row?.row?.original?.propertyFeature?.feature?.name ?? row.renderValue(),
                accessorKey: 'type',
            },
            {
                header: 'Amount',
                cell: (row) => currencyFormatter(row.renderValue(), "UGX"),
                accessorKey: 'amount',
            },
            {
                header: 'Status',
                cell: (row: any) => <Chip
                    label={row.renderValue()}
                    size="small"
                    color="primary"
                    sx={{
                        bgcolor: row.renderValue() === "PAID" ? "limegreen" : row.renderValue() === "PENDING" ? "orange" : "red",
                        fontWeight: "500",
                        fontSize: "0.75rem"
                    }}
                />,
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
                header: 'Pay By',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'pay_by',
            },
            {
                header: 'Created At',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'createdAt',
            },
            {
                header: 'Actions',
                cell: (row: any) => (
                    <Box display="flex" gap="1rem" >
                        <AlertDialog
                            hide={row.row.original.status === "PAID"}
                            buttonLabel="Pay"
                            buttonVariant="contained"
                            title="Are you sure you want to pay this bill?"
                            content="If you accept, you will be redirected to the payment page"
                            // setAgreeing={setAccepting}
                            // agreeing={accepting}
                            onAgree={async (event: any) => {
                                event.stopPropagation()
                                event.stopPropagation()

                                const payment = {
                                    amount: row.row.original.amount,
                                    bills: [row.row.original._id, ],
                                    tenant: tenant,
                                }

                                try {
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/payments`, {
                                        method: "POST",
                                        headers: {
                                            // Authorization: `Bearer ${token}`,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            ...payment
                                        })
                                    })

                                    const {data: {_id}} = await res.json()

                                    await setPaymentConfig({
                                        public_key: process.env.NEXT_PUBLIC_FW_PUBLIC_KEY,
                                        tx_ref: _id,
                                        amount: row.row.original.amount,
                                        currency: "UGX",
                                        payment_options: "card,mobilemoney,ussd",
                                        customer: {
                                            email: user?.user?.email,
                                            phonenumber: "0784******",
                                            name: `${user?.user?.name}`
                                        },
                                        customizations: {
                                            title: "Rent Payment",
                                            description: "Payment for rent",
                                            logo: "https://assets.piedpiper.com/logo.png",
                                        }     
                                    })
            
                                    // setAccepting(false)
                                } catch (error) {
                                    // setAccepting(false)
                                    alert("Failed to accept")

                                    console.log("ACCEPT ERROR", error)
                                }
                            }}
                        />
                        <Button
                            variant={"outlined"}
                            size="small"
                            sx={{
                                fontSize: "0.875rem",
                                display: row?.row?.original?.status === "PAID" ? "block" : "none"
                            }}
                            onClick={async (event) => {
                                event.preventDefault()
                                event.stopPropagation()


                            }}
                        >
                            {`Invoice`}
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                fontSize: "0.875rem",
                                display: row?.row?.original?.status === "PAID" ? "none" : "flex"
                            }}
                            onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()

                                setIsOpen(true)

                                setBillToExtend(row?.row?.original?._id)

                            }}
                            disabled={row?.row?.original?.extended}
                        >
                            {!row.row.original.extended ? `Request Extension` : `Extension Requested`}
                        </Button>
                    </Box>
                ),
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <TableRenderer
                data={data?.data}
                pageInfo={data?.pageInfo}
                columns={columns}
                onRowClick={(rowId) => console.log(rowId)}
                loading={isLoading}
                setPage={setPage}
            />
            <RequestExtension tenant={tenant} billToExtend={billToExtend} />
        </React.Fragment>
    );
};
