import { Box, Button, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { useRouter } from "next/router";
import TicketForm from "Components/Tenants/Forms/TicketForm";
import fetchTickets from "apis/property/fetchTickets";
import { TicketsTable } from "Components/Properties/TicketsTable";


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
    const { property } = query;
  

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">Tickets</Typography>

            <TicketsTable property={property} />
            {/* <TicketForm tenant={tenant} /> */}
        </>
    )
}

Tickets.auth = true

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
    const session: any = await getSession({ req: context.req });

    const property: any = context.query.property

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

    await queryClient.prefetchQuery(['property-tickets'], () => fetchTickets(property, 1, "", ""))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

