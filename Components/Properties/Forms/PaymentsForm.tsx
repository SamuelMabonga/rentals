import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import React, { useContext } from "react"
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';


export default function PaymentsForm({ property }: any) {
    // CONTEXT
    const {
        openPropertyFeaturesForm: open,
        setOpenPropertyFeaturesForm: setIsOpen,

        propertyFeatureToEdit: toEdit,
        setPropertyFeatureToEdit: setToEdit,
        setSnackbarMessage
    }: any = useContext(CollectionsContext)

    const {data}: any = useSession()


    // FLUTTERWAVE CONFIG
    const config: any = {
        public_key: process.env.NEXT_PUBLIC_FW_PUBLIC_KEY,
        tx_ref: Date.now(),
        amount: 100,
        currency: 'UGX',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: data?.user?.email,
            phone_number: '070********',
            name: `${data?.user?.first_name} ${data?.user?.last_name} Name`,
        },
        customizations: {
            title: 'Rent It',
            description: 'Payment for your bills',
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    };

    const handleFlutterPayment = useFlutterwave(config);


    return (
        <Dialog
            // open={open}
            open={true}
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

            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        handleFlutterPayment({
                            callback: (response) => {
                                console.log(response);
                                closePaymentModal() // this will close the modal programmatically
                            },
                            onClose: () => { },
                        });
                    }}
                >
                    Pay
                </Button>
            </DialogActions>
        </Dialog>
    )
}