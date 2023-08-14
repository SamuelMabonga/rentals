import { Box, Button, TextField, Typography } from "@mui/material"
import { PropertiesTable } from "Components/Properties/PropertiesTable"
import PropertyForm from "Components/Properties/Forms/PropertyForm"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import ImageCropper from "Components/Common/ImageCropper"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import fetchProperties from "apis/fetchProperties"
import fetchUserTenancies from "apis/fetchUserTenancies"
import { RentalsTable } from "Components/Properties/RentalsTable"
import fetchBillingPeriods from "apis/fetchBillingPeriods"
import { BillingPeriodsTable } from "Components/Admin/BillingPeriodsTable"
import BillingPeriodsForm from "Components/Admin/Forms/BillingPeriodsForm"
import fetchFeatures from "apis/fetchFeatures"
import { FeaturesTable } from "Components/Admin/FeaturesTable"
import FeaturesForm from "Components/Admin/Forms/FeaturesForm"
import { PropertyFeaturesTable } from "Components/Properties/PropertyFeaturesTable"
import fetchPropertyFeatures from "apis/property/fetchPropertyFeatures"
import PropertyFeatureForm from "Components/Properties/Forms/PropertyFeatureForm"
// import fetchPropertyFeatures from "apis/fetchPropertyFeatures"


type PageProps = {
    // data: any;
};


export default function Features({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setOpenPropertyFeaturesForm
    }: any = useContext(CollectionsContext)

    // SESSION
    const { status, data: session }: any = useSession()

    const propertyId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("role") || "")?.property?._id : null;

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">Features</Typography>
            <Box width="100%" display={"flex"} flexDirection={["column", "row"]} gap="1rem">
                <TextField
                    name="search"
                    placeholder="Search"
                    size="small"
                    sx={{
                        width: ["100%", "20rem"]
                    }}
                />
                <Button variant="contained" sx={{ ml: "auto" }} onClick={() => setOpenPropertyFeaturesForm(true)}>Create New</Button>
            </Box>

            <PropertyFeaturesTable property={propertyId} />
            <PropertyFeatureForm property={propertyId} />
        </>
    )
}

Features.auth = true

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

    await queryClient.prefetchQuery(['property-features', propertyId], () => fetchPropertyFeatures(propertyId, 1))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

