import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import FileInput from "Components/FileInput"
import fetchAProperty from "apis/fetchAProperty"
import fetchBillingPeriods from "apis/fetchBillingPeriods"
import fetchFeatures from "apis/fetchFeatures"
import fetchPropertyFeatures from "apis/property/fetchPropertyFeatures"
import fetchPropertyUnitTypes from "apis/property/fetchPropertyUnitTypes"
// import fetchPropertyFeatures from "apis/fetchPropertyFeatures"
import { CollectionsContext } from "context/context"
import { fetchAllBillingPeriods } from "controllers/billingPeriods"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Name is required"),
    // features: yup.array().required("Billing period is required"),
    price: yup.string().required("Name is required"),
    billingPeriod: yup.object().required("Billing period is required")
})

export default function UnitTypeForm({
    property,
    // billingPeriods,
    // features
}: any) {
    // CONTEXT
    const {
        showUnitTypeForm: open,
        setShowUnitTypeForm: setIsOpen,
        unitTypeToEdit: toEdit,
        setUnitTypeToEdit: setToEdit,
        setSnackbarMessage,
        unitTypesPage: page,
        setUnitTypesPage: setPage,
    }: any = useContext(CollectionsContext)

    const router = useRouter()

    // SESSION
    const session: any = useSession()
    const token = session?.data?.accessToken

    const { data: features }: any = useQuery({ queryKey: ['property-features', token, property], queryFn: () => fetchPropertyFeatures(property, null) })
    const { data: billingPeriods }: any = useQuery({ queryKey: ['billingPeriods', token], queryFn: () => fetchBillingPeriods() })
    const { refetch }: any = useQuery({ queryKey: ['property-unitTypes', token, property, page], queryFn: () => fetchPropertyUnitTypes(property, page) })

    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register, watch, setValue, reset, formState: { errors }, setError }: any = useForm({
        defaultValues: {
            name: "",
            description: "",
            features: [],
            price: "",
            billingPeriod: null
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    useEffect(() => {
        if (toEdit?._id) {
            setValue("name", toEdit.name)
            setValue("description", toEdit.description)
            setValue("features", toEdit.defaultFeatures)
            setValue("price", toEdit.price)
            setValue("billingPeriod", toEdit.billingPeriod)
            return
        }

        reset()

    }, [toEdit?._id, open])

    async function onSubmit(values: any) {
        setIsLoading(true)

        const data = {
            ...values,
            details: values.description,
            defaultFeatures: values?.features ? values.features.map((item: any) => item._id) : null,
            billingPeriod: values.billingPeriod._id,
            property: property
        }

        // EDIT A PROPERTY
        if (toEdit?.name) {
            const edited = {
                ...toEdit,
                name: values.name,
                description: values.description,
                defaultFeatures: values?.features ? values.features.map((item: any) => item._id) : null,
                billingPeriod: values.billingPeriod._id,
                price: values.price,
            }
            try {
                const res = await fetch(`/api/unitTypes?id=${toEdit._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ...edited })
                })
                const response = await res.json();
                console.log(response)
                refetch()

                setIsLoading(false)
                setIsOpen(false)
                setSnackbarMessage({
                    open: true,
                    vertical: 'top',
                    horizontal: 'center',
                    message: "Unit type edited successfully",
                    icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "inherit" }} className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Box>
                })
                return
            } catch (error) {
                setIsLoading(false)
                console.log(error)
                return
            }
        }

        // POST A PROPERTY
        try {
            const res = await fetch('/api/unitTypes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...data })
            })
            const response = await res.json();

            refetch()
            setIsLoading(false)
            setIsOpen(false)
            setSnackbarMessage({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: "Unit type created successfully",
                icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "inherit" }} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Box>
            })
            return
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
                <Typography fontWeight="600">Create new unit type</Typography>
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
                <form
                    id="unit-type-form"
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    <FormControl
                        error={errors?.name?.message}
                    >
                        <FormLabel required >Name</FormLabel>
                        <TextField
                            placeholder=""
                            {...register("name")}
                        // value={}
                        />
                        <FormHelperText>{errors?.name?.message}</FormHelperText>
                    </FormControl>
                    <FormControl
                        error={errors?.description?.message}
                    >
                        <FormLabel required>Description</FormLabel>
                        <TextField
                            {...register("description")}
                            multiline
                            rows={4}
                            placeholder=""
                        />
                        <FormHelperText>{errors?.description?.message}</FormHelperText>
                    </FormControl>
                    <FormControl
                        error={errors?.features?.message}
                    >
                        <FormLabel>Features</FormLabel>
                        <Autocomplete
                            // {...register("features")}/
                            value={watch("features")}
                            options={features?.data || []}
                            multiple
                            getOptionLabel={(option: any) => option.feature.name}
                            onChange={(event, value) => setValue("features", value)}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder=""
                                />
                            }
                        />
                        <FormHelperText>{errors?.features?.message}</FormHelperText>
                    </FormControl>
                    <FormControl
                        error={errors?.price?.message}
                    >
                        <FormLabel required>Price</FormLabel>
                        <TextField
                            placeholder=""
                            {...register("price")}
                        // value={}
                        />
                        <FormHelperText>{errors?.price?.message}</FormHelperText>
                    </FormControl>
                    <FormControl
                        error={errors?.billingPeriod?.message}
                    >
                        <FormLabel required>Billing Period</FormLabel>
                        <Autocomplete
                            // {...register("features")}/
                            value={watch("billingPeriod")}
                            options={billingPeriods?.data || []}
                            getOptionLabel={(option: any) => option.name}
                            onChange={(event, value) => {
                                setValue("billingPeriod", value)
                                setError("billingPeriod", null)
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder=""
                                />
                            }
                        />
                        <FormHelperText>{errors?.billingPeriod?.message}</FormHelperText>
                    </FormControl>
                    {/* <FileInput />
                    <FileInput /> */}
                </form>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <Button
                    variant="contained"
                    type="submit"
                    form="unit-type-form"
                >
                    {toEdit?.name ? `Edit unit type` : `Create unit type`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}