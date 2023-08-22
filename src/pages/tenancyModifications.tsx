import { Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import fetchTenancyModifications from "apis/property/fetchTenancyModifications";
import { TenancyExtensionsTable } from "Components/Properties/TenancyExtensionsTable";
import { useRouter } from "next/router";


type PageProps = {
    // data: any;
};


export default function TenancyModifications({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setOpenBookingForm
    }: any = useContext(CollectionsContext)

    const router = useRouter()

    const propertyId: any = router.query.property

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">Tenancy Modifications</Typography>

            <TenancyExtensionsTable property={propertyId} />
        </>
    )
}

TenancyModifications.auth = true

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

    await queryClient.prefetchQuery(['property-tenancy-modifications'], () => fetchTenancyModifications(propertyId, 1, "", ""))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

