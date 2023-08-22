// 'use client';

import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Avatar, Box, Button, Chip, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import moment from "moment"
import fetchPropertyFeatures from "apis/property/fetchPropertyFeatures"
import fetchPropertyUnitTypes from "apis/property/fetchPropertyUnitTypes"
import { formSchema, formSchema2 } from "./Schema/BookingForm"
import currencyFormatter from "Components/Common/currencyFormatter"
import fetchPropertyBookings from "apis/property/fetchPropertyBookings"
import dayjs from "dayjs"


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

export default function BookingForm({
    property,
}: any) {
    // CONTEXT
    const {
        openBookingForm: open,
        setOpenBookingForm: setIsOpen,

        bookingToEdit: toEdit,
        setBookingToEdit: setToEdit,

        unitToBook: unit,
        setSnackbarMessage,

        bookingsPage: page,
        setBookingsPage: setPage,
    }: any = useContext(CollectionsContext)

    const session: any = useSession()
    const token = session.data?.accessToken

    const [isLoading, setIsLoading] = useState(false)

    const { data: features, isLoading: featuresLoading }: any = useQuery({
        queryKey: ['property-features', property, token],
        queryFn: () => fetchPropertyFeatures(property, null),
    })

    const { data: unitTypes, isLoading: unitTypesLoading }: any = useQuery({
        queryKey: ['property-unitTypes', property, token],
        queryFn: () => fetchPropertyUnitTypes(property, null),
    })

    const { refetch }: any = useQuery({ queryKey: ['property-bookings', property, page], queryFn: () => fetchPropertyBookings(property, page, "", "") })

    const schema: any = Object?.keys(unit)?.length > 0 ? formSchema2 : formSchema

    const { handleSubmit, register, watch, setValue, setError, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            userSearchTerm: "",
            user: {
                _id: "",
                // first_name: "",
                // last_name: ""
            },
            unitType: {
                _id: "",
                name: ""
            },
            unit: {
                _id: "",
                name: ""
            },
            additionalFeatures: [
                { _id: "", feature: { _id: "", name: "" } }
            ],
            startDate: "",
            endDate: ""

        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (toEdit?.name) {
            setValue("name", toEdit.name)
            setValue("price", toEdit.price)
            return
        }

        reset()

    }, [toEdit])

    const availableAfter = moment(watch("unit")?.availableAfter).format("MM/DD/YYYY")

    console.log("AVAILABLE AFTER", availableAfter)

    async function onSubmit(values: any) {
        setIsLoading(true)

        const postData = {
            user: values.user._id,
            unit: Object.keys(unit).length > 0 ? unit._id : values.unit._id,
            additionalFeatures: [...values.additionalFeatures.map((item: any) => item._id)],
            startDate: values.startDate,
            endDate: values.endDate,
            property
        }

        // POST A BOOKING
        try {
            const res = await fetch('/api/booking', {
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
                message: "Booking created successfully",
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



        const data = {
            name: values.name,
            price: values.price
        }
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
        'Select a tenant',
        'Select a unit',
        'Tenancy details',
    ])
    const [step, setStep] = useState(0)

    useEffect(() => {
        if (unit?._id) {
            setSteps([
                'Select a tenant',
                'Tenancy details',
            ])
        }
    }, [unit])


    // SEARCH
    const [searchingUsers, setSearchingUsers] = useState(false)
    const [searchedUsers, setSearchedUsers] = useState([])
    // const [selectedUser, setSelectedUser] = useState<any>()
    const [minDate, setMinDate] = useState<any>(null)

    useEffect(() => {
        const selectedUnit = watch("unit")
        if (selectedUnit?.availableAfter) {
            setMinDate(dayjs(selectedUnit.availableAfter))
        }

    }, [watch("unit")])

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <LinearProgress sx={{ display: isLoading ? "block" : "none" }} />
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Create a booking</Typography>
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
                                            overflow={"hidden"}
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
                                                if (watch("user")?._id === user?._id) {
                                                    return setValue("user", {})
                                                }
                                                setValue("user", user)

                                                console.log("USER", user)
                                            }}
                                        >
                                            <Avatar
                                                src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=random&color=fff`}
                                                sx={{ width: "3.5rem", height: "3.5rem" }}
                                            />
                                            <Box width="100%" overflow="hidden">
                                                <Typography fontWeight="600">{user.name}</Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="gray"
                                                    width="100%"
                                                    overflow={"hidden"}
                                                    textOverflow="ellipsis"
                                                    whiteSpace="nowrap"
                                                    sx={{ textOverflow: "ellipsis" }}
                                                >
                                                    {user?.email}
                                                </Typography>
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
                            <FormLabel>Select the unit type to book</FormLabel>
                            <Autocomplete
                                options={unitTypes?.data || []}
                                getOptionLabel={(option: any) => option.name}
                                onChange={async (event, value) => {
                                    setValue("unit", {})
                                    setValue("unitType", value)
                                    setLoadingUnits(true)

                                    try {
                                        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unit/unitType?id=${value._id}`, {
                                            headers: {
                                                Authorization: `Bearer ${session.data.accessToken}`,
                                            },
                                            method: "GET"
                                        });

                                        const res = await response.json();
                                        console.log("UNITS", res.data)
                                        setUnits(res.data)
                                        setLoadingUnits(false)
                                    } catch (error) {
                                        setLoadingUnits(false)
                                        alert("Fetch units error")
                                    }
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        placeholder=""
                                    />
                                }
                            />
                        </FormControl>

                        <CircularProgress sx={{ display: loadingUnits ? "flex" : "none", mx: "auto" }} />

                        <Box display={loadingUnits ? "none" : "flex"} flexDirection="column" gap="0.5rem">
                            <Typography display={watch("unitType") ? "flex" : "none"}>Rooms Available</Typography>
                            <Collapse in={units?.length > 0}>
                                <Box display="flex" flexDirection="column" gap="0.5rem">
                                    {
                                        units?.map((item: any, i: any) => {
                                            return (
                                                <Box
                                                    key={i}
                                                    width="100%"
                                                    display="flex"
                                                    flexDirection="row"
                                                    alignItems="center"
                                                    gap="1rem"
                                                    padding="0.75rem"
                                                    border="1px solid"
                                                    borderColor={watch("unit")?._id === item._id ? "primary.main" : "lightgrey"}
                                                    bgcolor={watch("unit")?._id === item._id ? "primary.light" : "transparent"}
                                                    borderRadius="0.5rem"
                                                    sx={{ cursor: "pointer" }}
                                                    onClick={async () => {
                                                        await setError("unit", null)
                                                        // setSelectedUnit(item)
                                                        setValue("unit", item)
                                                    }}
                                                >
                                                    <Avatar sx={{ width: "3.5rem", height: "3.5rem" }} />
                                                    <Box display="flex" flexDirection="column" gap="0.25rem">
                                                        <Typography fontWeight="600" color="grey">{item.name}</Typography>
                                                        <Chip
                                                            size="small"
                                                            label={item?.status}
                                                            color={item?.status === "AVAILABLE" ? "primary" : "error"}
                                                            variant={"outlined"}
                                                            sx={{
                                                                fontWeight: "600",
                                                                fontSize: "0.75rem",
                                                                width: "fit-content"
                                                            }}
                                                        />
                                                        <Typography
                                                            display={item?.status === "AVAILABLE" ? "none" : "flex"}
                                                            variant="body2"
                                                            color="gray"
                                                        >
                                                            Available after: {moment(item.availableAfter).format("DD/MM/YYYY")}
                                                        </Typography>
                                                    </Box>

                                                    <Box display={watch("unit")?._id === item._id ? "flex" : "none"} ml="auto" width="1.5rem" height="1.5rem" color="primary.main">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: "inherit" }}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </Box>

                                                </Box>
                                            )
                                        })
                                    }
                                </Box>
                            </Collapse>
                        </Box>
                    </Box>

                    <Box display={Object?.keys(unit)?.length > 0 && step === 1 ? "flex" : step === 2 ? "flex" : "none"} flexDirection="column" gap="1rem">
                        <FormControl sx={{ width: "100%" }}>
                            <FormLabel>Select additional features for your booking</FormLabel>
                            <Autocomplete
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
                                        minDate={minDate || dayjs(unit?.availableAfter)}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl sx={{ width: "100%" }}>
                                <FormLabel>When would you like to end</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        // label="Basic date picker"
                                        disablePast
                                        minDate={minDate || dayjs(unit?.availableAfter)}
                                        onChange={(event: any) => setValue("endDate", moment(event.$d).format("YYYY-MM-DD"))}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Box>
                    </Box>
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
                        if (step === 1) {
                            if (unit?._id) return

                            if (watch("unit")?._id !== "") {
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