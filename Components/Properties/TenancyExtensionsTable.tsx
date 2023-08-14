import { Avatar, Box, Button, Chip, Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
// import Image from "next/image"
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { useQuery } from '@tanstack/react-query';
import fetchFeatures from 'apis/fetchFeatures';
import { useSession } from 'next-auth/react';
// import fetchExtensions from 'apis/property/fetchExtensions';
import currencyFormatter from 'Components/Common/currencyFormatter';
import moment from 'moment';
import fetchExtensions from 'apis/property/FetchExtensions';
import AlertDialog from 'Components/Common/AlertDialog';
import fetchTenancyModifications from 'apis/property/fetchTenancyModifications';

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

export const TenancyExtensionsTable = <T extends object>({ property }: ReactTableProps<T>) => {
    // SESSION
    const session: any = useSession()
    const token = session?.data?.accessToken
    const { data }: any = useQuery({ queryKey: ['tenancy-extensions', property], queryFn: () => fetchTenancyModifications(property) })

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
                header: 'Current End Date',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'tenant.endDate',
            },
            {
                header: 'New End Date',
                cell: (row: any) => moment(row.renderValue()).format("DD-MM-YYYY"),
                accessorKey: 'newDate',
            },
            {
                header: 'Status',
                cell: (row: any) => <Chip
                                    label={row.row.original.status}
                                    // color={row.row.original.status === "PENDING" ? "warning" : "limegreen"}
                                    size="small"
                                    sx={{
                                        fontSize: "0.75rem",
                                        bgcolor: row.row.original.status === "PENDING" ? "warning.main" : "limegreen",
                                        color: "white",
                                    }}
                                />,
                accessorKey: 'status',
            },
            {
                header: 'Actions',
                cell: (row: any) => (
                    <Box gap="1rem" display="flex">
                        <Button size="small" variant="outlined" color="error" disabled={row.row.original.status !== "PENDING"} >Reject</Button>

                        <AlertDialog
                            // hide={row.row.original.status === "PAID"}
                            disabled={row.row.original.status !== "PENDING"}
                            buttonLabel="Accept"
                            buttonVariant="contained"
                            title="Tenancy extension request"
                            content="Are you sure you want to extend the end date of this tenancy?"
                            // setAgreeing={setAccepting}
                            // agreeing={accepting}
                            onAgree={async (event: any) => {
                                event.stopPropagation()
                                event.stopPropagation()

                                try {
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tenancyModification/accept`, {
                                        method: "POST",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            tenancyModificationId: row.row.original._id,
                                            property: property,
                                        })
                                    })

                                    await res.json()
            
                                    // setAccepting(false)
                                } catch (error) {
                                    // setAccepting(false)
                                    alert("Failed to accept")

                                    console.log("ACCEPT ERROR", error)
                                }
                            }}
                        />
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