import { Box, Button, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { UnitsTable } from "Components/Properties/UnitsTable";
import UnitForm from "Components/Properties/Forms/UnitForm";
import fetchPropertyUnits from "apis/property/fetchPropertyUnits";


type PageProps = {
    // data: any;
};


export default function Units({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setOpenUnitForm,
        setUnitSearchQuery,
    }: any = useContext(CollectionsContext)

    const propertyId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("role") || "")?.property?._id : null;

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">Units</Typography>
            <UnitsTable property={propertyId} />
            <UnitForm property={propertyId} />
        </>
    )
}

Units.auth = true

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

    await queryClient.prefetchQuery(['property-units'], () => fetchPropertyUnits(propertyId, 1, "", ""))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

