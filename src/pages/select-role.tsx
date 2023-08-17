import { Avatar, Box, Button, Divider, Typography } from '@mui/material';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import PropertyForm from 'Components/Properties/Forms/PropertyForm';
import fetchRolesByUserId from 'apis/auth/fetchRolesByUserId';
import { CollectionsContext } from 'context/context';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

type PageProps = {
    // data: any;
}

export default function SelectRole() {
    const router = useRouter()
    // Context
    const {
        // showPropertyForm,
        setShowPropertyForm
    }: any = React.useContext(CollectionsContext)

    // session
    const session: any = useSession()

    const { data }: any = useQuery({ queryKey: ['userRoles', session?.data?.user?.id], queryFn: () => fetchRolesByUserId(session?.data?.user?.id, null) })

    const userName = session?.data?.user?.name

    return (
        <Box>
            <Box display="flex" gap="0.5rem" flexDirection="row" alignItems="center">
                <Box>
                    <Typography color="black" fontWeight="600" variant="h4">{`Welcome to Rent It, ${userName}`}</Typography>
                    <Typography color="gray" fontSize="1.25rem">Please select a role or create a property to get started</Typography>
                </Box>
            </Box>
            <Box display="grid" gridTemplateColumns={["1fr", "1fr 1fr 1fr"]} gap="1rem" mt="1.5rem">
                {
                    data?.data?.map((role: any) => (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                // localStorage.setItem("role", JSON.stringify(role))

                                console.log("role", role)
                                console.log("session", session)

                                localStorage.setItem("role", JSON.stringify(role))

                                if (role.role.name === "Tenant") {
                                    return router.push(`/dashboard?tenant=${role?.tenant?._id}`)
                                }
                                router.push(`/dashboard?property=${role?.property?._id}`)
                            }}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                bgcolor: "white",
                                borderRadius: "0.5rem",
                                padding: "1rem",
                            }}
                        >
                            <Typography variant="h4">{role?.property?.name}</Typography>
                            <Typography variant="h6">{role?.role?.name}</Typography>

                        </Button>
                    ))
                }
            </Box>
            <Box mt="1.5rem">
                {/* <Typography variant="h4">You are not associated with any property</Typography> */}
                <Typography variant="h6" color="black">Create your own property</Typography>
                <Button variant="contained" sx={{ my: "0.5rem" }} onClick={() => setShowPropertyForm(true)}>Create a property</Button>

                <Divider orientation="horizontal" sx={{ my: "1rem" }} />
                <Typography variant="h6" mt="1rem" color="black">Book a unit on one of our properties</Typography>

                <Button variant="contained" sx={{ my: "0.5rem" }} onClick={() => router.push("/marketplace")}>Browse Properties</Button>
            </Box>
            <PropertyForm />
        </Box>
    )
}

SelectRole.auth = true

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

    // REACT QUERY
    const queryClient = new QueryClient()

    await Promise.all([
        await queryClient.prefetchQuery(['userRoles', session?.user?.id], () => fetchRolesByUserId(session?.user?.id, null)),
    ])

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};