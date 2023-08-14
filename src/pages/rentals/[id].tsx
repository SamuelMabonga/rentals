import { Avatar, Box, Button, Card, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import { CollectionsContext } from "context/context"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession, useSession } from "next-auth/react"
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query'
import { useRouter } from "next/router"
import fetchARental from "apis/tenant/fetchARental"
import PaymentsForm from "Components/Tenants/Forms/PaymentsForm"
import { BillsTable } from "Components/Tenants/BillsTable"
import RequestExtension from "Components/Tenants/Forms/RequestExtension"
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3"
import moment from "moment"
import fetchBills from "apis/tenant/fetchBills"
import { PaymentsTable } from "Components/Tenants/PaymentsTable"
import { TicketsTable } from "Components/Tenants/TicketsTable"
import TicketForm from "Components/Tenants/Forms/TicketForm"
import RequestTenancyExtension from "Components/Tenants/Forms/RequestTenancyExtension"

type PageProps = {
    // data: any;
};

function DetailsCard({ label, value, icon }: any) {
    return (
        <Card
            sx={{
                width: "100%",
                bgcolor: "white",
                color: "secondary",
                padding: "1rem",
                borderRadius: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0px 4px 20px rgba(211, 205, 218, 0.25)",
                border: "1px solid rgba(211, 205, 218, 0.7)",
            }}
        >
            <Box display="flex" gap="0.5rem">
                <Box width="2rem" height="2rem" color="grey">
                    {icon}
                </Box>
                <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
                    Your <br />
                    <span style={{ fontWeight: "600", fontSize: "1rem" }}>
                        {label}
                    </span>
                </Typography>
            </Box>

            <Typography color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"}>{value}</Typography>
        </Card>
    )
}


// FLUTTERWAVE CONFIG
const config: any = {
    public_key: process.env.NEXT_PUBLIC_FW_PUBLIC_KEY,
    tx_ref: moment(),
    amount: 100,
    currency: 'UGX',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
        email: "samuel@gmail.com",
        phone_number: '070********',
        name: `Mabonga Samuel`,
    },
    customizations: {
        title: 'Rent It',
        description: 'Payment for your bills',
        logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
};


function TableSwitch({ activeTab, tenant, openFlutterwave }: any) {
    switch (activeTab) {
        case "bills":
            return <BillsTable tenant={tenant} />

        case "payments":
            return <PaymentsTable tenant={tenant?._id} />

        case "messages":
        // return <BookingsTable />

        case "tickets":
            return <TicketsTable tenant={tenant} />

        default:
            return <></>
    }
}

const buttonLabels: any = {
    bills: "Pay Bills",
    payments: "Make Payment",
    messages: "Send Message",
    tickets: "Create Ticket",
}

export default function Rental({
    // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {
        activeRentalTab: activeTab,
        setActiveRentalTab: setActiveTab,
        setShowUnitTypeForm,
        setOpenPaymentForm,
        setOpenFeaturesForm,
        setOpenBillingPeriodsForm,
        setOpenPropertyFeaturesForm,
        setOpenUnitForm,
        setOpenBookingForm,
        paymentConfig,
        setOpenTicketForm,
        setOpenRequestTenancyExtension
    }: any = useContext(CollectionsContext)

    // SESSION
    const { status, data: session }: any = useSession()

    const token = session?.accessToken

    const router = useRouter()
    const { id }: any = router.query

    const { data }: any = useQuery({ queryKey: ['rental', id, token], queryFn: () => fetchARental(token, id) })

    const {
        unit,
        _id,
        startDate,
        endDate,
        status: rentalStatus,
    } = data?.data || {}


    // const handleFlutterPayment = useFlutterwave(config);
    const handleFlutterPayment = useFlutterwave(paymentConfig);

    function openFlutterwave() {
        handleFlutterPayment({
            callback: (response: any) => {
                console.log(response);
                closePaymentModal() // this will close the modal programmatically
            },
            onClose: () => { },
        });
    }

    useEffect(() => {
        if (paymentConfig?.tx_ref) {
            openFlutterwave()
        }

    }, [paymentConfig?.tx_ref])

    return (
        <>
            <Box display="flex" flexDirection={["column", "row"]} gap="1rem" width="100%" mt={["2rem", "1rem"]}>
                <Box>
                    <Typography fontSize="1.5rem" fontWeight="600" color="primary.dark">{`${unit?.name}`}</Typography>
                    <Typography fontWeight="600" color="grey">{`${unit?.property?.name}`}</Typography>
                </Box>

                {/* <Box display={["none", "flex"]} flexDirection={["column", "row"]} gap="1rem">
                    <Button variant="outlined" sx={{ height: "fit-content", padding: "1rem", borderRadius: "0.5rem" }} color="error" >Terminate tenancy</Button>
                    <Button variant="contained" sx={{ height: "fit-content", padding: "1rem", borderRadius: "0.5rem" }}>Renew your tenancy</Button>
                </Box> */}
            </Box>

            <Box width="100%" gap="1rem">
                <Box width="100%" display="grid" gridTemplateColumns={["1fr", "1fr 1fr",]} gap="1rem">
                    <DetailsCard
                        label="Entry Date"
                        value={moment(startDate).format("DD MMM YYYY")}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <DetailsCard
                        label="Exit Date"
                        value={moment(endDate).format("DD MMM YYYY")}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <DetailsCard
                        label="Tenancy length"
                        value={`${moment(endDate).diff(moment(startDate), "days")} days`}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <DetailsCard
                        label="Days Remaining"
                        value={`${moment(endDate).diff(moment(), "days")} days`}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                </Box>

                <Box display={rentalStatus === "ACTIVE" ? "flex" : ["none"]} flexDirection={["column", "row"]} sx={{ mt: "1.5rem" }} gap="1rem">
                    <Button
                        variant="outlined"
                        sx={{
                            height: "fit-content",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            width: ["100%", "fit-content"],
                            ml: "auto"
                        }}
                        color="error"
                        onClick={() => setOpenRequestTenancyExtension(true)}
                    >
                        Terminate tenancy
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ height: "fit-content", padding: "1rem", borderRadius: "0.5rem", width: ["100%", "fit-content"], }}
                        onClick={() => setOpenRequestTenancyExtension(true)}
                    >
                        Renew your tenancy
                    </Button>
                </Box>

                {/* <Box display={rentalStatus === "PENDING" ? "flex" : ["none"]} flexDirection={["column",]} sx={{ mt: "1.5rem" }} gap="1rem">
                    <Typography fontWeight="600" color="grey">Clear all your initial bills to activate your tenancy</Typography>
                    <Button
                        variant="contained"
                        sx={{ height: "fit-content", padding: "1rem", borderRadius: "0.5rem", width: ["100%", "fit-content"], }}
                    // onClick={() => setOpenRenewalForm(true)}
                    >
                        Pay Bills
                    </Button>
                </Box> */}
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
                                return setOpenPaymentForm(true)
                            }

                            if (activeTab === "payments") {
                                return setOpenUnitForm(true)
                            }

                            if (activeTab === "messages") {
                                return setShowUnitTypeForm(true)
                            }

                            if (activeTab === "tickets") {
                                return setOpenTicketForm(true)
                            }
                        }}
                    >
                        {buttonLabels[activeTab]}
                    </Button>
                </Box>
                <TableSwitch activeTab={activeTab} tenant={data?.data} openFlutterwave={openFlutterwave} />
            </Box>
            <PaymentsForm tenant={id} />
            <TicketForm tenant={data?.data} />
            <RequestTenancyExtension tenant={data?.data} />
        </>
    )
}

Rental.auth = true

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
        await queryClient.prefetchQuery(['rental', id], () => fetchARental(accessToken, id)),
        // await queryClient.prefetchQuery(['tenant-bills', id], () => fetchBills(accessToken, id)),
    ])

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};