import { Box, Button, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import fetchPropertyBookings from "apis/property/fetchPropertyBookings";
import { BookingsTable } from "Components/Properties/Bookings";
import BookingForm from "Components/Properties/Forms/BookingForm";
import fetchBills from "apis/tenant/fetchBills";
import { BillsTable } from "Components/Tenants/BillsTable";
import { useRouter } from "next/router";
import fetchTickets from "apis/tenant/fetchTickets";
import { TicketsTable } from "Components/Tenants/TicketsTable";
import TicketForm from "Components/Tenants/Forms/TicketForm";


type PageProps = {
    // data: any;
};


export default function Tickets({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setOpenTicketForm
    }: any = useContext(CollectionsContext)

    const router = useRouter();

    // Get the query parameters from the router
    const { query } = router;
  
    // Access specific query parameters
    const { tenant } = query;
  

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">Tickets</Typography>

            <TicketsTable tenant={tenant} />
            <TicketForm tenant={tenant} />
        </>
    )
}

Tickets.auth = true

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
    const session: any = await getSession({ req: context.req });

    const tenant: any = context.query.tenant

    if (!session) {
        return {
            redirect: {
                destination: '/login', // Redirect to the login page if user is not authenticated
                permanent: false,
            },
        };
    }

    // REACT QUERY
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery(['tenant-tickets'], () => fetchTickets(tenant, 1, "", ""))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

