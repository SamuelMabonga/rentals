import { Box, Button, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import fetchPropertyBookings from "apis/property/fetchPropertyBookings";
import { BookingsTable } from "Components/Properties/Bookings";
import BookingForm from "Components/Properties/Forms/BookingForm";
import fetchPayments from "apis/tenant/fetchPayments";
import { useRouter } from "next/router";
import PaymentsForm from "Components/Tenants/Forms/PaymentsForm";
import { PaymentsTable } from "Components/Tenants/PaymentsTable";


type PageProps = {
    // data: any;
};


export default function Payments({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setOpenBookingForm
    }: any = useContext(CollectionsContext)

    const propertyId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("role") || "")?.property?._id : null;

    const router = useRouter();

    // Get the query parameters from the router
    const { query } = router;
  
    // Access specific query parameters
    const { tenant }: any = query;

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">Payments</Typography>

            <PaymentsTable tenant={tenant} />
        </>
    )
}

Payments.auth = true

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

    await queryClient.prefetchQuery(['tenant-payments'], () => fetchPayments(tenant))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

