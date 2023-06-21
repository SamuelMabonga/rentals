// 'use client';

import { yupResolver } from "@hookform/resolvers/yup"
import { CheckCircle } from "@mui/icons-material"
import { Autocomplete, Avatar, Box, Button, Chip, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import FileInput from "Components/FileInput"
import fetchUnitTypeUnits from "apis/fetchUnitTypeUnits"
import fetchUnitTypes from "apis/fetchUnitTypes"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import fetchPropertyFeatures from "apis/fetchPropertyFeatures";

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import moment from "moment"

const steps = [
    'Select a tenant',
    'Select a unit',
    'Tenancy details',
    // 'Select your tenancy duration',
];

function HorizontalStepper({ step }: any) {
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={step} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}


const formSchema = yup.object().shape({
    userSearchTerm: yup.string().required(),
    user: yup.object().shape({
        _id: yup.string().required("Required"),
        first_name: yup.string().required("Required"),
        last_name: yup.string().required("Required")
    }),
    unitType: yup.object().shape({
        _id: yup.string().required("Required"),
        name: yup.string().required("Required")
    }),
    unit: yup.object().shape({
        _id: yup.string().required("Required"),
        name: yup.string().required("Required")
    }),
    additionalFeatures: yup.array().of(
        yup.object().shape({
            _id: yup.string().required("Required"),
            feature: yup.object().shape({
                _id: yup.string().required("Required"),
                name: yup.string().required("Required")
            }),
        })
    ),
    startDate: yup.string().required("Required"),
    endDate: yup.string().required("Required")
})

export default function BookingForm({
    property,
    unitTypes,
    features
}: any) {
    // CONTEXT
    const {
        openBookingForm: open,
        setOpenBookingForm: setIsOpen,

        bookingToEdit: toEdit,
        setBookingToEdit: setToEdit,

        setSnackbarMessage
    }: any = useContext(CollectionsContext)

    const session: any = useSession()

    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register, watch, setValue, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            userSearchTerm: "",
            user: {
                _id: "",
                first_name: "",
                last_name: ""
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
                {_id: "", feature: {_id: "", name: ""}}
            ],
            startDate: "",
            endDate: ""

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

        const data = {
            name: values.name,
            price: values.price
        }

        console.log("VALUES", values)

        const postData = {
            user: values.user._id,
            unit: values.unit._id,
            additionalFeatures: [...values.additionalFeatures.map((item: any) => item._id)],
            startDate: values.startDate,
            endDate: values.endDate
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

        // POST A PROPERTY
        try {
            const res = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.data.accessToken}`,
                },
                body: JSON.stringify({ ...postData })
            })
            const response = await res.json();
            console.log(response)
            setIsLoading(false)
            setIsOpen(false)
            setSnackbarMessage({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: "Feature feature created successfully",
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
    }


    // FETCH UNITS
    const [loadingUnits, setLoadingUnits] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState<any>()
    const [units, setUnits] = useState<any>([])

    // STEPPER
    const [step, setStep] = useState(0)


    // SEARCH
    const [searchingUsers, setSearchingUsers] = useState(false)
    const [searchedUsers, setSearchedUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState<any>()

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <LinearProgress sx={{ display: isLoading ? "block" : "none" }} />
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Choose a unit to book</Typography>
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
                <HorizontalStepper step={step} />
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
                                            borderColor={selectedUser?._id === user._id ? "primary.main" : "lightgrey"}
                                            bgcolor={selectedUser?._id === user._id ? "primary.light" : "transparent"}
                                            borderRadius="0.5rem"
                                            sx={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedUser(user)
                                                setValue("user", user)

                                                console.log("USER", user)
                                            }}
                                        >
                                            <Avatar sx={{ width: "3.5rem", height: "3.5rem" }} />
                                            <Box>
                                                <Typography>{`${user.first_name} ${user.last_name}`}</Typography>
                                                {/* <Chip size="small" label={!user?.tenant ? "Vacant" : "Occupied"} /> */}
                                            </Box>

                                            <Box display={selectedUser?._id === user._id ? "flex" : "none"} ml="auto" width="1.5rem" height="1.5rem" color="primary.main">
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


                    <Box display={step === 1 ? "flex" : "none"} flexDirection="column" gap="1rem">
                        <FormControl>
                            <FormLabel>Select the unit type to book</FormLabel>
                            <Autocomplete
                                // {...register("features")}
                                options={unitTypes?.data}
                                getOptionLabel={(option: any) => option.name}
                                onChange={async (event, value) => {
                                    setSelectedUnit(null)
                                    setValue("unitType", value)
                                    setLoadingUnits(true)

                                    try {
                                        const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unit?unitType=${value._id}`, {
                                            headers: {
                                                Authorization: `Bearer ${session.data.accessToken}`,
                                            },
                                            method: "GET"
                                        });
                                
                                        const res = await response.json();
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
                                                    gap="0.5rem"
                                                    padding="0.75rem"
                                                    border="1px solid"
                                                    borderColor={selectedUnit?._id === item._id ? "primary.main" : "lightgrey"}
                                                    bgcolor={selectedUnit?._id === item._id ? "primary.light" : "transparent"}
                                                    borderRadius="0.5rem"
                                                    sx={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setSelectedUnit(item)
                                                        setValue("unit", item)
                                                    }}
                                                >
                                                    <Avatar sx={{ width: "3.5rem", height: "3.5rem" }} />
                                                    <Box>
                                                        <Typography>{item.name}</Typography>
                                                        <Chip size="small" label={!item?.tenant ? "Vacant" : "Occupied"} />
                                                    </Box>

                                                    <Box display={selectedUnit?._id === item._id ? "flex" : "none"} ml="auto" width="1.5rem" height="1.5rem" color="primary.main">
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


                    <Box display={step === 2 ? "flex" : "none"} flexDirection="column" gap="1rem">
                        <FormControl sx={{ width: "100%" }}>
                            <FormLabel>Select additional features for your booking</FormLabel>
                            <Autocomplete
                                // {...register("features")}
                                multiple
                                options={features?.data}
                                getOptionLabel={(option: any) => option.feature.name}
                                onChange={(event, value: any) => {
                                    setSelectedUnit(null)
                                    if (value?.length < 1) {
                                        return setValue("additionalFeatures", [{_id: "", feature: [{_id: "", name: ""}]}])
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
                                        onChange={(event: any) => setValue("startDate", moment(event.$d).format("YYYY-MM-DD"))}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl sx={{ width: "100%" }}>
                                <FormLabel>When would you like to end</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                    // label="Basic date picker"
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
                    onClick={() => {
                        console.log("ERROR", errors)

                        if (step === 0) {
                            if (watch("user")?._id !=="" && !errors?.user ) {
                                return setStep((prev) => prev + 1)
                            }
                        }

                        if (step === 1) {
                            if (!errors.unit) {
                                return setStep((prev) => prev + 1)
                            }
                        }
                    }}
                >
                    {step === 2 ? `Submit Booking` :`Next`}
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