import { Box, Button, TextField, Typography } from "@mui/material"
import { PropertiesTable } from "Components/Properties/PropertiesTable"
import PropertyForm from "Components/Properties/Forms/PropertyForm"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import UnitTypeForm from "Components/Properties/Forms/UnitTypeForm"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"
import ImageCropper from "Components/Common/ImageCropper"
// import ImageUploader from "Components/Common/ImageUploader"

type Property = {
    // name: string;
    // stargazers_count: number;
};

type PageProps = {
    data: any;
};


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

    // Make the API request with the access token included in the headers
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/property`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: "GET"
    });

    const data = await response.json();

    return {
        props: {
            data,
        },
    };
};



export default function Properties({
    data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
        // CONTEXT
        const {
            setShowPropertyForm,
        }: any = useContext(CollectionsContext)

    const [openCreateForm, setOpenCreateForm] = useState(false)

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
            <PropertiesTable data={data.data} />
            {/* <ImageCropper open={true} /> */}

            <PropertyForm />
            <UnitTypeForm />
            {/* <ImageUploader /> */}
        </>
    )
}

Properties.auth = true
