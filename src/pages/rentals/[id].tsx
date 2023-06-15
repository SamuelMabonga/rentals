import { Avatar, Box, Button, Card, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material"
import DashboardLayout from "Components/Dashboard/DashboardLayout"
import React, { useContext, useEffect, useState } from "react"
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
import fetchARental from "apis/fetchARental"
import fetchAUnit from "apis/fetchAUnit"
import { BillsTable } from "Components/Properties/BillsTable"
import { PaymentsTable } from "Components/Properties/PaymentsTable"

type PageProps = {
    // data: any;
};

function DetailsCard() {
    return (
        <Card sx={{ width: "100%", bgcolor: "white", color: "secondary", padding: "1rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Box display="flex" gap="0.5rem">
                <Box width="2rem" height="2rem" color="grey">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Box>
                <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
                    Your <br />
                    <span style={{ fontWeight: "600", fontSize: "1.125rem" }}>
                        Stay Duration
                    </span>
                </Typography>
            </Box>

            <Typography color="black" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"}>200/600 Days</Typography>
        </Card>
    )
}

function TableSwitch({ activeTab }: any) {
    switch (activeTab) {
        case "bills":
            return <BillsTable />

        case "payments":
            return <PaymentsTable />

        case "messages":
            return <BookingsTable />

        case "tickets":
            return <StaffTable />

        default:
            return <></>
    }
}

export default function Property({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {
        activeRentalTab: activeTab,
        setActiveRentalTab: setActiveTab,
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
    const { id }: any = router.query

    const { data }: any = useQuery({ queryKey: ['rental'], queryFn: () => fetchARental(session.accessToken, id) })

    const {
        unit
    } = data.data

    return (
        <>
            <Box display="flex" width="100%" justifyContent="space-between">
                <Box>
                    <Typography fontSize="1.5rem" fontWeight="600" color="primary.dark">{`${unit?.name}`}</Typography>
                    <Typography fontWeight="600" color="grey">{`${unit?.property?.name}`}</Typography>
                </Box>

                <Box display="flex" flexDirection="row" gap="1rem">
                    <Button variant="contained" sx={{ height: "fit-content" }}>Renew your tenancy</Button>
                    <Button variant="outlined" sx={{ height: "fit-content" }} color="error" >Terminate tenancy</Button>
                </Box>
            </Box>

            <Box width="100%" display="flex" gap="1rem">
                <DetailsCard />
                <DetailsCard />
                <DetailsCard />
                <DetailsCard />
            </Box>

            <Box mt="2rem" width="100%" height="fit-content" overflow="hidden" display="flex" flexDirection="column" gap="1rem">
                {/* <Typography fontWeight={"600"} color="black" fontSize="1.25rem">Management</Typography> */}
                <Tabs
                    variant="scrollable"
                    value={activeTab}
                    onChange={(event, value) => setActiveTab(value)}
                >
                    <Tab label="Bills" value="bills" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Payments" value="payments" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Tickets" value="tickets" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Messages" value="messages" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
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
                            if (activeTab === "bills") {
                                return setShowUnitTypeForm(true)
                            }

                            if (activeTab === "payments") {
                                return setOpenUnitForm(true)
                            }

                            if (activeTab === "messages") {
                                return setShowUnitTypeForm(true)
                            }

                            if (activeTab === "tickets") {
                                return setShowUnitTypeForm(true)
                            }
                        }}
                    >
                        Create New
                    </Button>
                </Box>
                <TableSwitch activeTab={activeTab} />
            </Box>
            {/* <FeaturesForm />
            <BillingPeriodsForm />
            <UnitTypeForm />
            <PropertyFeatureForm />
            <UnitForm />
            <BookingForm /> */}
        </>
    )
}

Property.auth = true

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
    const session: any = await getSession({ req: context.req });

    const { query }: any = context
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
        await queryClient.prefetchQuery(['rental'], () => fetchARental(accessToken, id)),
    ])

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};