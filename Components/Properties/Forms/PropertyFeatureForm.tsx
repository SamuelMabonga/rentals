import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import FileInput from "Components/FileInput"
import fetchBillingPeriods from "apis/fetchBillingPeriods"
import fetchFeatures from "apis/fetchFeatures"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const formSchema = yup.object().shape({
    // name: yup.string().required("Name is required"),
    // price: yup.string().required("Price is required"),
})

export default function PropertyFeatureForm({property}: any) {
    // CONTEXT
    const {
        openPropertyFeaturesForm: open,
        setOpenPropertyFeaturesForm: setIsOpen,

        propertyFeatureToEdit: toEdit,
        setPropertyFeatureToEdit: setToEdit,
        setSnackbarMessage
    }: any = useContext(CollectionsContext)

    const session: any = useSession()
    const { data: features }: any = useQuery({ queryKey: ['features'], queryFn: () => fetchFeatures(session.data.accessToken) })
    const { data: billingPeriods }: any = useQuery({ queryKey: ['billingPeriods'], queryFn: () => fetchBillingPeriods(session.data.accessToken) })

    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register, watch, setValue, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            feature: "",
            price: "",
            billingPeriod: ""
            // features: ""
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    console.log("To Edit", toEdit)

    useEffect(() => {
        console.log(toEdit)
        if (toEdit?.feature) {
            setValue("feature", toEdit.feature)
            setValue("price", toEdit.price)
            setValue("billingPeriod", toEdit.billingPeriod)
            return
        }

        // reset()
        setValue("feature", null)
        setValue("price", "")
        setValue("billingPeriod", null)
        return

    }, [toEdit?.feature])

    async function onSubmit(values: any) {
        setIsLoading(true)

        const data = {
            feature: values.feature._id,
            price: values.price,
            billingPeriod: values.billingPeriod._id,
            property: property
        }


        // // EDIT A PROPERTY FEATURE
        if (toEdit?.feature) {
            const edited = {
                ...toEdit,
                feature: values.feature._id,
                price: values.price,
                billingPeriod: values.billingPeriod._id
            }
            try {
                const res = await fetch(`/api/propertyFeatures?id=${toEdit._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.data.accessToken}`,
                    },
                    body: JSON.stringify({ ...edited })
                })
                const response = await res.json();
                console.log(response)
                setIsLoading(false)
                setToEdit({})
                reset()
                setSnackbarMessage({
                    open: true,
                    vertical: 'top',
                    horizontal: 'center',
                    message: "Property feature edited successfully",
                    icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{color: "inherit"}} className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Box>
                })
                setIsOpen(false)
                return
            } catch (error) {
                setIsLoading(false)
                console.log(error)
                return
            }
        }

        // // POST A PROPERTY FEATURE
        try {
            const res = await fetch('/api/propertyFeatures', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.data.accessToken}`,
                },
                body: JSON.stringify({ ...data })
            })
            const response = await res.json();
            console.log(response)
            setIsLoading(false)
            setIsOpen(false)
            setSnackbarMessage({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: "Property feature created successfully",
                icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{color: "inherit"}} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Box>
            })
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <LinearProgress sx={{ display: isLoading ? "block" : "none" }} />
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Create new property feature</Typography>
                <IconButton onClick={() => {
                    setToEdit({})
                    setIsOpen(false)
                    reset()
                }}>
                    <Box width="1.5rem" height="1.5rem">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Box>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form
                    id="property-features-form"
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    <FormControl>
                        <FormLabel>Feature</FormLabel>
                        <Autocomplete
                            // {...register("feature")}
                            value={watch("feature")}
                            options={features?.data}
                            getOptionLabel={(option: any) => option.name}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder=""
                                />
                            }
                            onChange={(event, value) => setValue("feature", value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Price</FormLabel>
                        <TextField
                            placeholder=""
                            {...register("price")}
                        // value={}
                        />
                        <FormHelperText>{errors?.name?.message}</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Billing Period</FormLabel>
                        <Autocomplete
                            // {...register("features")}
                            value={watch("billingPeriod")}
                            options={billingPeriods?.data}
                            getOptionLabel={(option: any) => option.name}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder=""
                                />
                            }
                            onChange={(event, value) => setValue("billingPeriod", value)}
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <Button
                    variant="contained"
                    type="submit"
                    form="property-features-form"
                >
                    {toEdit?.name ? `Edit Property Feature` : `Create Property Feature`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}