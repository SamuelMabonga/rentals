import { Avatar, Box, Button, Chip } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { TableRenderer } from 'Components/Common/TableRenderer';
import { CollectionsContext } from 'context/context';
import { useQuery } from '@tanstack/react-query';
import fetchPayments from 'apis/property/fetchPayments';
import currencyFormatter from 'Components/Common/currencyFormatter';

interface ReactTableProps<T extends object> {
    // data: T[];
    // columns: ColumnDef<T>[];
    property: string;
}

type Item = {
    image: string;
    name: string;
    status: string;
    tenants: string;
    dateCreated: string;
    actions: any;
}

export const PaymentsTable = <T extends object>({ property }: ReactTableProps<T>) => {

    // CONTEXT
    const {
        paymentsStatus,
        setPaymentsStatus,
        paymentsPage,
        setPaymentsPage,
        paymentsSearchQuery,
        setPaymentsSearchQuery,
    }: any = useContext(CollectionsContext)


    const { data, isLoading } = useQuery(["property-payments", property, paymentsPage, paymentsStatus, paymentsSearchQuery], () => fetchPayments(property, paymentsPage, paymentsSearchQuery, paymentsStatus))


    const router = useRouter()
    const columns: any = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                header: 'Image',
                cell: (row: any) => {
                    return (
                        <Avatar
                            src={row?.row?.original?.tenant?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(row?.row?.original?.tenant?.user?.name)}&background=random&color=fff`}
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
                accessorKey: 'tenant.user.name',
            },
            {
                header: 'Unit',
                cell: (row) => row.renderValue(),
                accessorKey: 'tenant.unit.name',
            },
            {
                header: 'Amount',
                cell: (row: any) => currencyFormatter(row.renderValue(), "UGX"),
                accessorKey: 'amount',
            },
            {
                header: 'Status',
                cell: (row: any) => <Chip label={row.renderValue()} color="primary" size="small" />,
                accessorKey: 'status',
            }
        ],
        []
    );

    return (
        <TableRenderer
            data={data?.data || []}
            pageInfo={data?.pageInfo || {}}
            columns={columns}
            onRowClick={(rowId) => console.log("Payment clicked")}

            statusOptions={[]}
            setStatus={(e: any) => console.log(e.target.value)}
            searchQuery={""}

            setPage={(e: any) => console.log(e.target.value)}

            setSearchQuery={(e: any) => console.log(e.target.value)}
            status={''}
        />
    );
};