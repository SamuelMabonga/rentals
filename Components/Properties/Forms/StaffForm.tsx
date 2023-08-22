// 'use client';

import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Avatar, Box, Button, Chip, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import moment from "moment"
import fetchPropertyFeatures from "apis/property/fetchPropertyFeatures"
import fetchPropertyUnitTypes from "apis/property/fetchPropertyUnitTypes"
import currencyFormatter from "Components/Common/currencyFormatter"
import fetchPropertyBookings from "apis/property/fetchPropertyBookings"
import fetchRoles from "apis/admin/fetchRoles"
import fetchStaff from "apis/property/fetchStaff"

export const formSchema = yup.object().shape({
    userSearchTerm: yup.string().required(),
    user: yup.object().shape({
        _id: yup.string().required("Required"),
    }),
    role: yup.object().shape({
        _id: yup.string().required("Required"),
        name: yup.string().required("Required")
    }),
    // startDate: yup.string().required("Required"),
    // endDate: yup.string().required("Required")
})

function HorizontalStepper({ step, steps }: any) {
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={step} alternativeLabel>
                {steps.map((label: any) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

export default function StaffForm({
    property,
    unitTypes: propertyUnitTypes,
    features: propertyFeatures,
}: any) {
    // CONTEXT
    const {
        unitToBook: unit,
        setSnackbarMessage,

        openStaffForm: open,
        setOpenStaffForm: setIsOpen,
        staffToEdit: toEdit,
        setStaffToEdit: setToEdit,
        staffPage: page,
        setStaffPage: setPage,
    }: any = useContext(CollectionsContext)

    const session: any = useSession()
    const token = session.data?.accessToken

    const [isLoading, setIsLoading] = useState(false)

    const { data: roles }: any = useQuery({
        queryKey: ['roles', property, token],
        queryFn: () => fetchRoles(null)
    })


    const { refetch }: any = useQuery({ queryKey: ['property-staff', property, page], queryFn: () => fetchStaff(property, page, "", "") })

    const { handleSubmit, register, watch, setValue, setError, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            userSearchTerm: "",
            user: {
                _id: "",
            },
            role: {
                _id: "",
                name: ""
            },
            // startDate: "",
            // endDate: ""

        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    useEffect(() => {
        if (toEdit?.name) {
            setValue("name", toEdit.name)
            setValue("price", toEdit.price)
            return
        }

        reset()

    }, [toEdit])

    async function onSubmit(values: any) {
        setIsLoading(true)

        const postData = {
            user: values.user._id,
            role: values.role._id,
            // startDate: values.startDate,
            // endDate: values.endDate,
            property
        }

        // POST A PROPERTY
        try {
            const res = await fetch('/api/staff/property', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.data.accessToken}`,
                },
                body: JSON.stringify({ ...postData })
            })
            await res.json();

            refetch()
            setIsLoading(false)
            setIsOpen(false)
            reset()
            setStep(0)
            setSnackbarMessage({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: "Staff created successfully",
                icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "inherit" }} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Box>
            })
        } catch (error) {
            setIsLoading(false)
            console.log(error)

        }



        // const data = {
        //     name: values.name,
        //     price: values.price
        // }
        // // EDIT A PROPERTY
        // if (toEdit?.name) {
        //     const edited = {
        //         ...toEdit,
        //         name: values.name,
        //         price: values.price
        //     }
        //     try {
        //         const res = await fetch(`/api/feature?id=${toEdit._id}`, {
        //             method: 'PUT',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Authorization: `Bearer ${session.data.accessToken}`,
        //             },
        //             body: JSON.stringify({ ...edited })
        //         })
        //         const response = await res.json();
        //         console.log(response)
        //         setIsLoading(false)
        //         return
        //     } catch (error) {
        //         setIsLoading(false)
        //         console.log(error)
        //         return
        //     }
        // }
    }


    // FETCH UNITS
    const [loadingUnits, setLoadingUnits] = useState(false)
    // const [selectedUnit, setSelectedUnit] = useState<any>()
    const [units, setUnits] = useState<any>([])

    // STEPPER
    const [steps, setSteps] = useState([
        'Select a user',
        'Select a role',
    ])
    const [step, setStep] = useState(0)


    // SEARCH
    const [searchingUsers, setSearchingUsers] = useState(false)
    const [searchedUsers, setSearchedUsers] = useState([])
    // const [selectedUser, setSelectedUser] = useState<any>()

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <LinearProgress sx={{ display: isLoading ? "block" : "none" }} />
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Add a staff member</Typography>
                <IconButton onClick={() => {
                    setToEdit({})
                    setIsOpen(false)
                    setSearchedUsers([])
                    setUnits([])
                    setStep(0)
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
                <HorizontalStepper step={step} steps={steps} />
                <form
                    id="booking-form"
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}
                >

                    <Box display={step === 0 ? "flex" : "none"} flexDirection="column" gap="1rem">
                        <FormControl>
                            <FormLabel>Search for a user</FormLabel>
                            <TextField
                                {...register("userSearchTerm")}
                                onChange={async (event) => {
                                    if (event.target.value === "") {
                                        setSearchedUsers([])
                                    }

                                    if (event?.target?.value?.length > 2) {
                                        setSearchingUsers(true)
                                        try {
                                            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user?searchQuery=${event.target.value}`, {
                                                headers: {
                                                    Authorization: `Bearer ${session.data.accessToken}`,
                                                },
                                                method: "GET"
                                            });

                                            const res = await response.json();
                                            setSearchedUsers(res.data)
                                            return setSearchingUsers(false)
                                        } catch (error) {
                                            alert("Search error")
                                        }
                                    }
                                }}
                            />
                            {/* <FormHelperText>{errors?.userSearchTerm}</FormHelperText> */}
                        </FormControl>

                        <CircularProgress sx={{ display: searchingUsers ? "flex" : "none", mx: "auto" }} />

                        <Collapse in={searchedUsers?.length > 0}>
                            <Box display="flex" flexDirection="column" gap="0.5rem">
                                {
                                    searchedUsers?.map((user: any, i: any) => (
                                        <Box
                                            key={i}
                                            width="100%"
                                            display="flex"
                                            flexDirection="row"
                                            alignItems="center"
                                            gap="0.5rem"
                                            padding="0.75rem"
                                            border="1px solid"
                                            borderColor={watch("user")?._id === user._id ? "primary.main" : "lightgrey"}
                                            bgcolor={watch("user")?._id === user._id ? "primary.light" : "transparent"}
                                            borderRadius="0.5rem"
                                            sx={{ cursor: "pointer" }}
                                            onClick={() => {
                                                // setSelectedUser(user)
                                                setValue("user", user)

                                                console.log("USER", user)
                                            }}
                                        >
                                            <Avatar
                                                src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=random&color=fff`}
                                                sx={{ width: "3.5rem", height: "3.5rem" }}
                                            />
                                            <Box>
                                                <Typography fontWeight="600">{user.name}</Typography>
                                                <Typography variant="body2" color="gray">{user?.email}</Typography>
                                            </Box>

                                            <Box display={watch("user")?._id === user._id ? "flex" : "none"} ml="auto" width="1.5rem" height="1.5rem" color="primary.main">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: "inherit" }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </Box>

                                        </Box>
                                    ))
                                }
                            </Box>
                        </Collapse>
                    </Box>

                    <Box display={Object?.keys(unit)?.length > 0 && step === 1 ? "none" : step === 1 ? "flex" : "none"} flexDirection="column" gap="1rem">
                        <FormControl>
                            <FormLabel>Select a role</FormLabel>
                            <Autocomplete
                                // {...register("features")}
                                options={roles?.data || []}
                                getOptionLabel={(option: any) => option.name}
                                onChange={async (event, value) => {
                                    // setSelectedUnit(null)
                                    setValue("role", value)
                                    // setLoadingUnits(true)
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        placeholder=""
                                    />
                                }
                            />
                        </FormControl>
                    </Box>

                    {/* <Box display={Object?.keys(unit)?.length > 0 && step === 1 ? "flex" : step === 2 ? "flex" : "none"} flexDirection="column" gap="1rem">
                        <FormControl sx={{ width: "100%" }}>
                            <FormLabel>Select additional features for your booking</FormLabel>
                            <Autocomplete
                                // {...register("features")}
                                multiple
                                options={features?.data || []}
                                getOptionLabel={(option: any) => `${option.feature.name} - ${currencyFormatter(option.price, "UGX")}`}
                                onChange={(event, value: any) => {
                                    if (value?.length < 1) {
                                        return setValue("additionalFeatures", [{ _id: "", feature: [{ _id: "", name: "" }] }])
                                    }
                                    setValue("additionalFeatures", value)
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        placeholder=""
                                    />
                                }
                            />
                        </FormControl>

                        <Box width="100%" display="grid" gridTemplateColumns={"1fr 1fr"} gap="1rem">
                            <FormControl sx={{ width: "100%" }}>
                                <FormLabel>When would you like to start</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        disablePast
                                        onChange={(event: any) => setValue("startDate", moment(event.$d).format("YYYY-MM-DD"))}
                                        // minDate={watch("unit")?.}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl sx={{ width: "100%" }}>
                                <FormLabel>When would you like to end</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        // label="Basic date picker"
                                        disablePast
                                        onChange={(event: any) => setValue("endDate", moment(event.$d).format("YYYY-MM-DD"))}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Box>
                    </Box> */}
                </form>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem", display: "flex" }}>
                <Button
                    variant="outlined"
                    type="button"
                    disabled={step === 0}
                    onClick={() => setStep((prev) => prev - 1)}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    sx={{ ml: "auto" }}
                    type="submit"
                    form="booking-form"
                    onClick={async () => {
                        console.log("errors", errors)
                        // await handleSubmit(onSubmit)(); // Run form validation and submission
                        if (step === 0) {
                            if (watch("user")?._id !== "") {
                                setStep((prev) => prev + 1);
                            }
                        }
                    }}
                >
                    {Object.keys(unit).length > 0 && step === 1
                        ? `Submit Booking`
                        : step === 2
                            ? `Submit Booking`
                            : `Next`}
                </Button>
                {/* <Button
                    variant="contained"
                    type="submit"
                    form="features-form"
                    disabled={!selectedUnit}
                >
                    Choose unit
                </Button> */}
            </DialogActions>
        </Dialog>
    )
}