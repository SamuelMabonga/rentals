import { Autocomplete, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import fetchPropertyBookings from "apis/property/fetchPropertyBookings";
import { BookingsTable } from "Components/Properties/Bookings";
import BookingForm from "Components/Properties/Forms/BookingForm";
import FilterBadge from "Components/Common/FilterBadge";


type PageProps = {
    // data: any;
};

const statusOptions = [
    {label: "Pending", value: "PENDING"},
    {label: "Accepted", value: "ACCEPTED"},
    {label: "Rejected", value:"REJECTED"}
] 


export default function Bookings({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setOpenBookingForm,
        bookingSearchQuery: searchQuery,
        setBookingSearchQuery: setSearchQuery,
        bookingStatus,
        setBookingStatus,
    }: any = useContext(CollectionsContext)

    const propertyId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("role") || "")?.property?._id : null;

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">Bookings</Typography>


            <BookingsTable property={propertyId} />
            <BookingForm property={propertyId} />
        </>
    )
}

Bookings.auth = true

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
    const session: any = await getSession({ req: context.req });

    const propertyId: any = context.query.property

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

    await queryClient.prefetchQuery(['property-bookings', propertyId], () => fetchPropertyBookings(propertyId, 1, null, null))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

