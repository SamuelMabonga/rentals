import { Box, Button, TextField, Typography } from "@mui/material"
import { PropertiesTable } from "Components/Properties/PropertiesTable"
import PropertyForm from "Components/Properties/Forms/PropertyForm"
import React, { useContext, useState } from "react"
import { CollectionsContext } from "context/context"
import UnitTypeForm from "Components/Properties/Forms/UnitTypeForm"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { getSession, useSession } from "next-auth/react"

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
    const response = await fetch('http://localhost:3000/api/property', {
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

    const [openCreateForm, setOpenCreateForm] = useState(false)

    console.log(data)

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
                <Button variant="contained" sx={{ ml: "auto" }} onClick={() => setOpenCreateForm(true)}>Create New</Button>
            </Box>
            <PropertiesTable data={data.data} />
            <PropertyForm open={openCreateForm} setIsOpen={setOpenCreateForm} />
            <UnitTypeForm />
        </>
    )
}

Properties.auth = true
