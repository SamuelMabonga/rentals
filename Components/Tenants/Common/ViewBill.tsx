import { Avatar, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, Snackbar, TextField, Typography } from "@mui/material"
import { PDFDownloadLink } from "@react-pdf/renderer"
import AlertDialog from "Components/Common/AlertDialog"
import currencyFormatter from "Components/Common/currencyFormatter"
import moment from "moment"
import { useSession } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import BillReceipt from "./BillReceipt"
import { Download } from "@mui/icons-material"
import { CollectionsContext } from "context/context"

function DetailsCard({ label, value, icon }: any) {
    return (
        <Card
            sx={{
                width: "100%",
                bgcolor: "white",
                color: "secondary",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                boxShadow: "0px 4px 20px rgba(211, 205, 218, 0.25)",
                border: "1px solid rgba(211, 205, 218, 0.7)",
            }}
        >
            <Box display="flex" gap="0.5rem" alignItems="center">
                <Box width="1.5rem" height="1.5rem" color="grey">
                    {icon}
                </Box>
                <Typography color="grey" fontSize="0.875rem" fontWeight="500" lineHeight={"100%"}>
                    {label}
                </Typography>
            </Box>

            <Typography color="primary" fontWeight={"600"} fontSize="1rem" textAlign={"right"}>{value}</Typography>
        </Card>
    )
}


export default function ViewBill({ bill, open, setIsOpen, setBillToExtend, setOpenRequest }: any) {
    const {
        setPaymentConfig
    }: any = useContext(CollectionsContext)

    const { data: user }: any = useSession()

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            {/* <LinearProgress sx={{ display: isLoading ? "block" : "none" }} /> */}
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Bill</Typography>
                <IconButton onClick={() => {
                    setIsOpen(false)
                }}>
                    <Box width="1.5rem" height="1.5rem">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Box>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap="1rem">
                    <Box display="flex" gap="1rem" alignItems="center">
                        <Box>
                            <Typography fontWeight="600" fontSize="1.125rem">{bill?.type === "RENT" ? "Rent" : bill?.additionalFeature?.name}</Typography>
                            {/* <Typography color="grey" fontWeight="500">{rentExtension?.tenant?.user?.email}</Typography> */}
                        </Box>
                    </Box>
                    <Box width="100%" display="grid" gridTemplateColumns={["1fr", "1fr 1fr",]} gap="1rem">
                        <DetailsCard
                            label="Amount"
                            value={currencyFormatter(bill?.amount, "UGX")}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Start Date"
                            value={moment(bill?.startDate).format("DD/MM/YYYY")}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="End Date"
                            value={moment(bill?.endDate).format("DD/MM/YYYY")}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="End Date"
                            value={moment(bill?.payBy).format("DD/MM/YYYY")}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    </Box>
                </Box>

            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem", display: "flex", gap: "0.5rem" }}>
                <AlertDialog
                    hide={bill?.status === "PAID"}
                    buttonLabel="Pay"
                    buttonVariant="contained"
                    buttonSize="medium"
                    title="Are you sure you want to pay this bill?"
                    content="If you accept, you will be redirected to the payment page"
                    onAgree={async (event: any) => {
                        event.stopPropagation()
                        event.stopPropagation()

                        const payment = {
                            amount: bill.amount,
                            bills: [bill._id,],
                            tenant: bill.tenant._id,
                            property: bill.property
                        }

                        try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/payments`, {
                                method: "POST",
                                headers: {
                                    // Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    ...payment
                                })
                            })

                            const { data: { _id } } = await res.json()

                            await setPaymentConfig({
                                public_key: process.env.NEXT_PUBLIC_FW_PUBLIC_KEY,
                                tx_ref: _id,
                                amount: bill.amount,
                                currency: "UGX",
                                payment_options: "card,mobilemoney,ussd",
                                customer: {
                                    email: user?.user?.email,
                                    phonenumber: "0784******",
                                    name: `${user?.user?.name}`
                                },
                                customizations: {
                                    title: "Rent Payment",
                                    description: "Payment for rent",
                                    logo: "https://assets.piedpiper.com/logo.png",
                                }
                            })

                            // setAccepting(false)
                        } catch (error) {
                            // setAccepting(false)
                            alert("Failed to accept")

                            console.log("ACCEPT ERROR", error)
                        }
                    }}
                />
                <PDFDownloadLink
                    document={
                        <BillReceipt
                            customerName="Mabonga Samuel"
                            rentalName="Test 3"
                            billDate="12-12-2021"
                            paidDate="12-12-2021"
                            startDate="12-12-2021"
                            endDate="12-12-2021"
                            amount={bill?.amount}
                            property="Olympus"
                            service="Rent"
                            contactDetails="0784******"
                        />
                    }
                    fileName="bill.pdf"
                >
                    {({ blob, url, loading, error }) =>
                        loading ?
                            'Loading document...'
                            : <Button
                                startIcon={<Download />}
                                variant={"outlined"}
                                size="small"
                                sx={{
                                    fontSize: "0.875rem",
                                    display: bill?.status === "PAID" ? "flex" : "none"
                                }}
                            >
                                Receipt
                            </Button>
                    }
                </PDFDownloadLink>
                <Button
                    variant="outlined"
                    sx={{
                        display: bill?.status === "PAID" ? "none" : "flex"
                    }}
                    onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()

                        setBillToExtend(bill?._id)
                        setIsOpen(false)
                        setOpenRequest(true)
                    }}
                    disabled={bill?.extended}
                >
                    {!bill?.extended ? `Request Extension` : `Extension Requested`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}