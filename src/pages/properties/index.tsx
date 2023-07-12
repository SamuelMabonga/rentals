import { Box, Button, TextField, Typography } from "@mui/material"
import { PropertiesTable } from "Components/Properties/PropertiesTable"
import PropertyForm from "Components/Properties/Forms/PropertyForm"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import fetchProperties from "apis/user/fetchProperties"
// import fetchProperties from "apis/fetchProperties"

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
    const session: any = useSession()
    const token = session?.data?.accessToken

    const [openCreateForm, setOpenCreateForm] = useState(false)

    const { data }: any = useQuery({ queryKey: ['properties', token], queryFn: () => fetchProperties(token, 1) })

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
            <PropertiesTable data={data?.data} pageInfo={data?.pageInfo} />

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

    await queryClient.prefetchQuery(['properties', accessToken], () => fetchProperties(accessToken, 1))

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

