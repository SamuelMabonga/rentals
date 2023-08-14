import { Box, Button, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import fetchPropertyTenants from "apis/property/fetchPropertyTenants";
import { TenantsTable } from "Components/Properties/TenantsTable";


type PageProps = {
    // data: any;
};


export default function Tenants({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setOpenBookingForm,
        tenantsSearchQuery: searchQuery,
        setTenantsSearchQuery: setSearchQuery,
        tenantStatus,
        setTenantStatus,
    }: any = useContext(CollectionsContext)

    const propertyId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("role") || "")?.property?._id : null;

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">Tenants</Typography>

            <TenantsTable property={propertyId} />
        </>
    )
}

Tenants.auth = true

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

    await queryClient.prefetchQuery(['property-tenants'], () => fetchPropertyTenants(propertyId, 1, "", ""))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

