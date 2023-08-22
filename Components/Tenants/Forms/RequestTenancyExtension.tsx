// 'use client';

import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Avatar, Box, Button, Chip, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment"


const formSchema = yup.object().shape({
    newDate: yup.string().required(),
    notes: yup.string().required(),
    // billToExtend: yup.string().required(),
})

export default function RequestTenancyExtension({
    tenant,
    unitTypes,
    features,
    billToExtend
}: any) {
    // CONTEXT
    const {
        openRequestTenancyExtension: open,
        setOpenRequestTenancyExtension: setIsOpen,

        setSnackbarMessage
    }: any = useContext(CollectionsContext)

    const session: any = useSession()
    const token = session?.data?.accessToken

    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register, watch, setValue, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            newDate: "",
            notes: "",
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    // useEffect(() => {
    //     if (toEdit?.name) {
    //         setValue("newDate", toEdit.name)
    //         setValue("notes", toEdit.price)
    //         return
    //     }

    //     reset()

    // }, [toEdit])

    async function onSubmit(values: any) {
        setIsLoading(true)

        // POST A PROPERTY
        const postData = {
            newDate: values.newDate,
            notes: values.notes,
            tenant: tenant._id,
            property: tenant.property,
        }

        try {
            const res = await fetch('/api/tenancyModification/tenant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
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
                message: "Extension request submitted successfully",
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


    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <LinearProgress sx={{ display: isLoading ? "block" : "none" }} />
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Request for extension of your tenancy</Typography>
                <IconButton onClick={() => {
                    // setToEdit({})
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
                    id="request-extension"
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}
                >
                    <FormControl sx={{ width: "100%" }}>
                        <FormLabel>To what date would you like to extend</FormLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                disablePast
                                onChange={(event: any) => setValue("newDate", moment(event.$d).format("YYYY-MM-DD"))}
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl sx={{ width: "100%" }}>
                        <FormLabel>Add a message</FormLabel>
                        <TextField
                            {...register("notes")}
                            multiline
                            rows={4}
                        />
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem", display: "flex" }}>
                <Button
                    variant="contained"
                    sx={{ ml: "auto" }}
                    type="submit"
                    form="request-extension"
                    onClick={() => {
                        console.log("ERROR", errors)
                    }}
                >
                    Send Request
                </Button>
            </DialogActions>
        </Dialog>
    )
}