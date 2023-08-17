import { Box, Button, TextField, Typography } from "@mui/material"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { PropertyFeaturesTable } from "Components/Properties/PropertyFeaturesTable"
import fetchPropertyFeatures from "apis/property/fetchPropertyFeatures"
import PropertyFeatureForm from "Components/Properties/Forms/PropertyFeatureForm"
import fetchPropertyUnitTypes from "apis/property/fetchPropertyUnitTypes";
import { UnitTypesTable } from "Components/Properties/UnitTypesTable";
import UnitTypeForm from "Components/Properties/Forms/UnitTypeForm";


type PageProps = {
    // data: any;
};


export default function UnitTypes({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setShowUnitTypeForm
    }: any = useContext(CollectionsContext)

    const propertyId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("role") || "")?.property?._id : null;

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">Unit Types</Typography>

            <UnitTypesTable property={propertyId} />
            <UnitTypeForm property={propertyId} />
        </>
    )
}

UnitTypes.auth = true

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

    await queryClient.prefetchQuery(['property-unitTypes'], () => fetchPropertyUnitTypes(propertyId, 1))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

