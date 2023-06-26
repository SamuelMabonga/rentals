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


type PageProps = {
    // data: any;
};


export default function Rentals({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setShowPropertyForm,
    }: any = useContext(CollectionsContext)

    // SESSION
    const { status, data: session }: any = useSession()

    const [openCreateForm, setOpenCreateForm] = useState(false)

    const { data }: any = useQuery({ queryKey: ['tenancies'], queryFn: () => fetchUserTenancies(session.accessToken) })

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">My Rentals</Typography>
            <Box width="100%" display={"flex"} flexDirection={["column", "row"]} gap="1rem">
                <TextField
                    name="search"
                    placeholder="Search"
                    size="small"
                    sx={{
                        width: ["100%", "20rem"]
                    }}
                />
                <Button variant="contained" sx={{ ml: "auto" }} onClick={() => setShowPropertyForm(true)}>Create New</Button>
            </Box>
            <RentalsTable data={data?.data} />
            <PropertyForm />
        </>
    )
}

Rentals.auth = true

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
    const session: any = await getSession({ req: context.req });
    // Retrieve the access token from the session
    const accessToken = session?.accessToken;


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

    await queryClient.prefetchQuery(['tenancies'], () => fetchUserTenancies(accessToken))
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

