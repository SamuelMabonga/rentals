import { Box, Button, TextField, Typography } from "@mui/material"
import { PropertiesTable } from "Components/Properties/PropertiesTable"
import PropertyForm from "Components/Properties/Forms/PropertyForm"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
// import UnitTypeForm from "Components/Properties/Forms/UnitTypeForm"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import ImageCropper from "Components/Common/ImageCropper"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import fetchProperties from "apis/fetchProperties"
// import ImageUploader from "Components/Common/ImageUploader"

// type Property = {
//     // name: string;
//     // stargazers_count: number;
// };

type PageProps = {
    // data: any;
};


export default function Properties({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // CONTEXT
    const {
        setShowPropertyForm,
    }: any = useContext(CollectionsContext)

    // SESSION
    const { status, data: session }: any = useSession()

    const [openCreateForm, setOpenCreateForm] = useState(false)

    const { data }: any = useQuery({ queryKey: ['properties'], queryFn: () => fetchProperties(session.accessToken) })

    return (
        <>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">My Properties</Typography>
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
            <PropertiesTable data={data?.data} />
            {/* <ImageCropper open={true} /> */}

            <PropertyForm />
            {/* <UnitTypeForm /> */}
            {/* <ImageUploader /> */}
        </>
    )
}

Properties.auth = true

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
    const session: any = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: '/login', // Redirect to the login page if user is not authenticated
                permanent: false,
            },
        };
    }

    // Retrieve the access token from the session
    const accessToken = session?.accessToken;

    // REACT QUERY
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery(['properties'], () => fetchProperties(accessToken))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

