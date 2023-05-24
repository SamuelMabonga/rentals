import { Avatar, Box, Button, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material"
import DashboardLayout from "Components/Dashboard/DashboardLayout"
import React, { useContext, useState } from "react"
import Image from "next/image"
import { UnitsTable } from "Components/Properties/UnitsTable"
import { TenantsTable } from "Components/Properties/TenantsTable"
import { BookingsTable } from "Components/Properties/Bookings"
import { StaffTable } from "Components/Properties/StaffTable"
import { UnitTypesTable } from "Components/Properties/UnitTypesTable"
import { FeaturesTable } from "Components/Properties/FeaturesTable"
import { TicketsTable } from "Components/Properties/TicketsTable"
import { CollectionsContext } from "context/context"
import UnitTypeForm from "Components/Properties/Forms/UnitTypeForm"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"

type PageProps = {
    data: any;
};

function TableSwitch({ activeTab }: any) {
    switch (activeTab) {
        case "units":
            return <UnitsTable />

        case "tenants":
            return <TenantsTable />

        case "bookings":
            return <BookingsTable />

        case "staff":
            return <StaffTable />

        case "unitTypes":
            return <UnitTypesTable />

        case "features":
            return <FeaturesTable />

        case "tickets":
            return <TicketsTable />

        default:
            return <></>
    }
}

function Detail() {
    return (
        <Box display="flex" alignItems="center" color="gray" flexDirection="row" gap="0.25rem">
            <Box width="1.25rem" height="1.25rem">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            </Box>
            <Typography lineHeight={"100%"} fontSize="0.875rem">
                Wandegeya
            </Typography>
        </Box>
    )
}

export default function Property({
    data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {
        activePropertiesTab: activeTab,
        setActivePropertiesTab: setActiveTab,
        setShowUnitTypeForm
    }: any = useContext(CollectionsContext)

    console.log(data)

    return (
        <>
            <Box
                width="100%"
                position="relative"
                sx={{
                    letterSpacing: 0,
                    wordSpacing: 0,
                    fontSize: 0,
                }}
            >
                <Image
                    src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681629067/ufb0rk1wiykyrns9r4gr.jpg"
                    alt=""
                    width={0}
                    height={0}
                    layout="responsive"
                    style={{
                        borderRadius: "1rem"
                    }}
                />

                <Box position="absolute" display="flex" height="0" alignItems="center" ml={["1rem", "4rem"]}>
                    <Avatar
                        alt=""
                        sx={{
                            width: ["4rem", "8rem"],
                            height: ["4rem", "8rem"]
                        }}
                    />
                </Box>
            </Box>

            <Box width="100%" mt={["1.5rem", "4rem"]} display="flex" flexDirection="column" gap="1rem">
                <Typography fontSize="1.5rem" fontWeight="600" color="primary.dark">Polo Apartments</Typography>
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap="0.5rem 0.5rem">
                    <Detail />
                    <Detail />
                    <Detail />
                    <Detail />
                </Box>
                <Typography color="grey">
                    This cabin comes with Smart Home System and beautiful viking style. You can see sunrise in the morning with City View from full Glass Window.
                    This unit is surrounded by business district of West Surabaya that offers you the city life as well as wide range of culinary.
                    This apartment equipped with Washing Machine, Electric Stove, Microwave, Refrigerator, Cutlery.
                </Typography>
                <Button variant="outlined" sx={{ width: "fit-content" }}>View full profile</Button>
            </Box>


            <Box mt="2rem" width="100%" height="fit-content" overflow="hidden" display="flex" flexDirection="column" gap="1rem">
                {/* <Typography fontWeight={"600"} color="black" fontSize="1.25rem">Management</Typography> */}
                <Tabs
                    variant="scrollable"
                    value={activeTab}
                    onChange={(event, value) => setActiveTab(value)}
                >
                    <Tab label="Units" value="units" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Tenants" value="tenants" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Bookings" value="bookings" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Staff" value="staff" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Unit Types" value="unitTypes" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Features" value="features" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Tickets" value="tickets" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                </Tabs>
                <Box width="100%" display="flex" flexWrap="wrap" gap="1rem">
                    <TextField
                        name="search"
                        placeholder="Search"
                        size="small"
                        sx={{
                            width: ["100%", "20rem"]
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{ ml: ["auto"] }}
                        onClick={() => {
                            if (activeTab === "unitTypes") {
                                return setShowUnitTypeForm(true)
                            }

                            if (activeTab === "units") {
                                return setShowUnitTypeForm(true)
                            }

                            if (activeTab === "tenants") {
                                return setShowUnitTypeForm(true)
                            }

                            if (activeTab === "tickets") {
                                return setShowUnitTypeForm(true)
                            }

                            if (activeTab === "staff") {
                                return setShowUnitTypeForm(true)
                            }

                            if (activeTab === "bookings") {
                                return setShowUnitTypeForm(true)
                            }

                            if (activeTab === "features") {
                                return setShowUnitTypeForm(true)
                            }

                        }}
                    >
                        Create New
                    </Button>
                </Box>
                <TableSwitch activeTab={activeTab} />
            </Box>
            <UnitTypeForm />
        </>
    )
}

Property.auth = true

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
    const session: any = await getSession({ req: context.req });

    const {query}: any = context
    const { id } = query;

    console.log("Get server props", id)

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
    const response = await fetch(`http://localhost:3000/api/property?id=${id}`, {
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