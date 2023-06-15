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
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession, useSession } from "next-auth/react"
import FeaturesForm from "Components/Properties/Forms/FeaturesForm"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import fetchAProperty from "apis/fetchAProperty"
import { useRouter } from "next/router"
import fetchFeatures from "apis/fetchFeatures"
import { BillingPeriodsTable } from "Components/Properties/BillingPeriodsTable"
import BillingPeriodsForm from "Components/Properties/Forms/BillingPeriodsForm"
import fetchBillingPeriods from "apis/fetchBillingPeriods"
import UnitTypeForm from "Components/Properties/Forms/UnitTypeForm"
import fetchUnitTypes from "apis/fetchUnitTypes"
import PropertyFeatureForm from "Components/Properties/Forms/PropertyFeatureForm"
import { PropertyFeaturesTable } from "Components/Properties/PropertyFeaturesTable"
import fetchPropertyFeatures from "apis/fetchPropertyFeatures"
import UnitForm from "Components/Properties/Forms/UnitForm"
import fetchUnits from "apis/fetchUnits"
import BookingForm from "Components/Properties/Forms/BookingForm"
import fetchBookings from "apis/fetchBookings"
import fetchTenants from "apis/fetchTenants"

type PageProps = {
    // data: any;
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

        case "billingPeriods":
            return <BillingPeriodsTable />

        case "propertyFeatures":
            return <PropertyFeaturesTable />

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
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {
        activePropertiesTab: activeTab,
        setActivePropertiesTab: setActiveTab,
        setShowUnitTypeForm,
        setOpenFeaturesForm,
        setOpenBillingPeriodsForm,
        setOpenPropertyFeaturesForm,
        setOpenUnitForm,
        setOpenBookingForm,
    }: any = useContext(CollectionsContext)

       // SESSION
       const { status, data: session }: any = useSession()

    const router = useRouter()
    const {id}: any = router.query

    const { data }: any = useQuery({ queryKey: ['property'], queryFn: () => fetchAProperty(session.accessToken, id) })

    console.log(data)

    const {
        name,
        details,
        gallery
    } = data.data

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
                <Typography fontSize="1.5rem" fontWeight="600" color="primary.dark">{name}</Typography>
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap="0.5rem 0.5rem">
                    <Detail />
                    <Detail />
                    <Detail />
                    <Detail />
                </Box>
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
                    <Tab label="Billing Periods" value="billingPeriods" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Property Features" value="propertyFeatures" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
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
                                return setOpenUnitForm(true)
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
                                return setOpenBookingForm(true)
                            }

                            if (activeTab === "features") {
                                return setOpenFeaturesForm(true)
                            }

                            if (activeTab === "billingPeriods") {
                                return setOpenBillingPeriodsForm(true)
                            }

                            if (activeTab === "propertyFeatures") {
                                return setOpenPropertyFeaturesForm(true)
                            }

                        }}
                    >
                        Create New
                    </Button>
                </Box>
                <TableSwitch activeTab={activeTab} />
            </Box>
            <FeaturesForm />
            <BillingPeriodsForm />
            <UnitTypeForm />
            <PropertyFeatureForm />
            <UnitForm />
            <BookingForm />
        </>
    )
}

Property.auth = true

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
    const session: any = await getSession({ req: context.req });

    const {query}: any = context
    const { id } = query;

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

        await Promise.all([
            await queryClient.prefetchQuery(['property'], () => fetchAProperty(accessToken, id)),
            await queryClient.prefetchQuery(['features'], () => fetchFeatures(accessToken)),
            await queryClient.prefetchQuery(['billingPeriods'], () => fetchBillingPeriods(accessToken)),
            await queryClient.prefetchQuery(['unitTypes'], () => fetchUnitTypes(accessToken)),
            await queryClient.prefetchQuery(['propertyFeatures'], () => fetchPropertyFeatures(accessToken)),
            await queryClient.prefetchQuery(['units'], () => fetchUnits(accessToken)),
            await queryClient.prefetchQuery(['bookings'], () => fetchBookings(accessToken)),
            await queryClient.prefetchQuery(['tenants'], () => fetchTenants(accessToken)),
        ])
    
        return {
            props: {
                dehydratedState: dehydrate(queryClient),
            },
        };
};