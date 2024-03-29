import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import React, { use, useContext, useEffect, useState } from "react"
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useQuery } from "@tanstack/react-query";
import fetchBills from "apis/tenant/fetchBills";
import { set } from "mongoose";
import moment from "moment";
import currencyFormatter from "Components/Common/currencyFormatter";



export default function PaymentsForm({ tenant }: any) {
    // CONTEXT
    const {
        openPaymentForm: open,
        setOpenPaymentForm: setIsOpen,

        propertyFeatureToEdit: toEdit,
        setPropertyFeatureToEdit: setToEdit,

        setSnackbarMessage,

        setOpenLoadingBackdrop,
    }: any = useContext(CollectionsContext)

    const { data: user }: any = useSession()
    // const token = user?.accessToken

    const { data, isLoading }: any = useQuery({ queryKey: ['tenant-bills', tenant], queryFn: () => fetchBills(tenant, 1, "", "PENDING") })

    const [selectedBills, setSelectedBills] = useState<any>([])
    const [amount, setAmount] = useState<any>(0)
    const [tx_ref, setTx_ref] = useState<any>("")


    // FLUTTERWAVE CONFIG
    const config: any = {
        public_key: process.env.NEXT_PUBLIC_FW_PUBLIC_KEY,
        tx_ref: tx_ref,
        amount: amount,
        currency: 'UGX',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: user?.user?.email,
            phone_number: '070********',
            name: `${user?.user?.first_name} ${user?.user?.last_name}`,
        },
        customizations: {
            title: 'Rent It',
            description: 'Payment for your bills',
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    };

    const handleFlutterPayment = useFlutterwave(config);

    useEffect(() => {
        setAmount(selectedBills.reduce((acc: any, curr: any) => acc + +curr.amount, 0))
    }, [selectedBills])

    async function createPayment() {
        const payment = {
            amount: amount,
            bills: selectedBills.map((item: any) => item._id),
            tenant: tenant,
            property: data?.data?.[0]?.tenant?.property,
        }

        // POST A PROPERTY
        try {
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payment)
            })
            const response = await res.json();

            setTx_ref(response.data._id)
        } catch (error) {
            // setIsLoading(false)
            console.log(error)
        }
    }

    useEffect(() => { 
        if (!tx_ref) {
            return
        }

        console.log("Opening flutterwave")
        setOpenLoadingBackdrop(false)
        setIsOpen(false)

        handleFlutterPayment({
            callback: (response) => {
                console.log(response);
                closePaymentModal() // this will close the modal programmatically
            },
            onClose: () => { },
        });
     }, [tx_ref])

     console.log("DATA ", data?.data)

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            {/* <LinearProgress /> */}
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Choose what you would like to pay for</Typography>
                <IconButton onClick={() => {
                    setToEdit({})
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
                <Box width="100%" display="flex" flexDirection="column" gap="1rem">
                    <Box borderRadius="0.5rem" p="1rem" border="1px solid" borderColor="primary.main" display="flex" gap="0.5rem">
                        <Box display="flex" gap="0.5rem">
                            <Box width="2rem" height="2rem">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                </svg>
                            </Box>
                            <Typography fontSize="1.5rem">Total</Typography>
                        </Box>

                        <Typography fontSize="1.5rem" fontWeight="600" ml="auto">{currencyFormatter(selectedBills.reduce((partialSum: any, a: any) => partialSum + +a.amount, 0), "UGX")}</Typography>
                    </Box>

                    <Box display="flex" flexDirection="column" gap="0.5rem">
                        {
                            data?.data?.filter((item: any) => item.status !== "PAID").map((bill: any, i: any) => {
                                return (
                                    <Box
                                        key={i}
                                        width="100%"
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        gap="0.5rem"
                                        padding="0.75rem"
                                        border="1px solid"
                                        borderColor={selectedBills?.find((item: any) => item._id === bill._id) ? "primary.main" : "lightgrey"}
                                        bgcolor={selectedBills?.find((item: any) => item._id === bill._id) ? "primary.light" : "transparent"}
                                        borderRadius="0.5rem"
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => {
                                            if (selectedBills?.find((item: any) => item._id === bill._id)) {
                                                return setSelectedBills((prev: any) => prev.filter((item: any) => item._id !== bill._id))
                                            }
                                            setSelectedBills((prev: any) => [...prev, bill])
                                        }}
                                    >
                                        <Box>
                                            <Typography fontSize={"0.875rem"} fontWeight="400">{bill.type === "RENT" ? "Rent" : bill.propertyFeature.feature.name}</Typography>
                                            <Typography fontWeight="600" fontSize={"1.125rem"}>{currencyFormatter(bill.amount, "UGX")}</Typography>
                                            <Typography fontSize={"0.875rem"} color="grey">{`${moment(bill.startDate).format("DD-MM-YY")} to ${moment(bill.endDate).format("DD-MM-YY")}`}</Typography>
                                        </Box>

                                        <Box
                                            display={selectedBills?.find((item: any) => item._id === bill._id) ? "flex" : "none"}
                                            ml="auto" width="1.5rem" height="1.5rem" color="primary.main">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: "inherit" }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </Box>

                                    </Box>
                                )
                            })
                        }
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        // handleFlutterPayment({
                        //     callback: (response) => {
                        //         console.log(response);
                        //         closePaymentModal() // this will close the modal programmatically
                        //     },
                        //     onClose: () => { },
                        // });

                        setIsOpen(false)
                        setOpenLoadingBackdrop(true)

                        createPayment()
                    }}
                >
                    Pay
                </Button>
            </DialogActions>
        </Dialog>
    )
}