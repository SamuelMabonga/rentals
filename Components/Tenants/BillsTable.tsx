import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useEffect, useMemo } from 'react';
import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/TableRenderer';
import { CollectionsContext } from 'context/context';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import fetchBills from 'apis/tenant/fetchBills';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';

interface ReactTableProps<T extends object> {
    // data: T[];
    // columns: ColumnDef<T>[];
    tenant: string
    openFlutterwave: any
}

type Item = {
    image: string;
    name: string;
    status: string;
    tenants: string;
    dateCreated: string;
    actions: any;
}

export const BillsTable = <T extends object>({ tenant, openFlutterwave }: ReactTableProps<T>) => {

    const {
        openRequestExtension: open,
        setOpenRequestExtension: setIsOpen,
        
        bookingToEdit: toEdit,
        setBookingToEdit: setToEdit,
        setSnackbarMessage,

        paymentConfig,
        setPaymentConfig
    }: any = useContext(CollectionsContext)

    const session: any = useSession()
    const token = session.data?.accessToken
    const { data, isLoading, refetch }: any = useQuery({ queryKey: ['tenant-bills', tenant, token], queryFn: () => fetchBills(token, tenant) })

    const { data: user }: any = useSession()

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
                cell: (row: any) => (
                    <Box display="flex" gap="1rem" >
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ fontSize: "0.875rem" }}
                            onClick={async (event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                await setPaymentConfig({
                                    tx_ref: row?.row?.original?.id,
                                    amount: +row?.row?.original?.amount,
                                    currency: "UGX",
                                    payment_options: "card,mobilemoney,ussd",
                                    customer: {
                                        email: user?.email,
                                        phonenumber: user?.phoneNumber,
                                        name: user?.first_name
                                    },
                                    customizations: {
                                        title: "Rent Payment",
                                        description: "Payment for rent",
                                        logo: "https://assets.piedpiper.com/logo.png",
                                    }
                                })

                                openFlutterwave()
                                
                            }}
                        >
                            Pay
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                fontSize: "0.875rem",
                                display: row?.row?.original?.type === "RENT" ? "block" : "none"
                            }}
                            onClick={(event) => {
                                event.stopPropagation()

                                setIsOpen(true)
                            }}
                        >
                            Request Extension
                        </Button>
                    </Box>
                ),
            },
        ],
        []
    );

    useEffect(() => {
        if (!tenant || !session?.data?.accessToken) return

        refetch()
    }, [tenant])

    return (
        <TableRenderer
            data={data?.data}
            columns={columns}
            onRowClick={(rowId) => router.push(`/rentals/${rowId}`)}
            loading={isLoading}
        />
    );
};