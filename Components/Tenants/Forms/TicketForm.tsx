import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import RichTextEditor from "Components/Common/RichTextEditor"
import FileInput from "Components/FileInput"
import fetchARental from "apis/tenant/fetchARental"
import fetchTickets from "apis/tenant/fetchTickets"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const formSchema = yup.object().shape({
    type: yup.object().required("Type is required"),
    message: yup.string().required("Message is required"),
})

export default function TicketForm({ tenant }: any) {
    // CONTEXT
    const {
        openTicketForm: open,
        setOpenTicketForm: setIsOpen,

        ticketToEdit: toEdit,
        setTicketToEdit: setToEdit,

        setSnackbarMessage
    }: any = useContext(CollectionsContext)

    // const session: any = useSession()
    // const token = session.data?.accessToken

    const [isLoading, setIsLoading] = useState(false)

    // const {tenant: {
    //     unit,
    //     property,
    // }} = JSON.parse(localStorage.getItem("role") || "")

    const { data }: any = useQuery({ queryKey: ['tenancy', tenant], queryFn: () => fetchARental(tenant) })

    console.log("DATAA" , data)

    const {
        property,
        unit
    } = data?.data || {}

    const {refetch} = useQuery(["tenant-tickets", tenant], () => fetchTickets(tenant))

    const { handleSubmit, register, watch, setValue, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            type: "",
            message: "",
            // features: ""
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    useEffect(() => {
        if (toEdit?.name) {
            setValue("type", toEdit.name)
            setValue("message", toEdit.price)
            return
        }

        reset()

    }, [toEdit])

    async function onSubmit(values: any) {
        setIsLoading(true)

        const data = {
            type: values.type.value,
            message: values.message,
            tenant,
            unit,
            property,
        }

        // POST A PROPERTY
        console.log(data)
        try {
            const res = await fetch('/api/ticket/tenant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...data })
            })
            await res.json();
            // console.log(response)
            refetch()
            setIsLoading(false)
            setIsOpen(false)
            setSnackbarMessage({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: "Ticket created successfully",
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


        // EDIT A PROPERTY
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
                <Typography fontWeight="600">Create new ticket</Typography>
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
                    id="ticket-form"
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    <FormControl>
                        <FormLabel>Ticket type</FormLabel>
                        <Autocomplete
                            // {...register("features")}
                            options={[
                                { value: "MAINTENANCE AND REPAIR", label: "MAINTENANCE AND REPAIR" },
                                { value: "SAFETY CONCERNS", label: "SAFETY CONCERNS" },
                                { value: "NOISE COMPLAINTS", label: "NOISE COMPLAINTS" },
                                { value: "PEST INFECTION", label: "PEST INFECTION" },
                                { value: "RENTAL PAYMENT ISSUES", label: "RENTAL PAYMENT ISSUES" },
                                { value: "DISPUTES WITH LANDLORDS", label: "DISPUTES WITH LANDLORDS" },
                                { value: "PRIVACY VIOLATIONS", label: "PRIVACY VIOLATIONS" },
                                { value: "HEALTH AND SANITATION ISSUES", label: "HEALTH AND SANITATION ISSUES" },
                                { value: "ACCESSIBILITY ISSUES", label: "ACCESSIBILITY ISSUES" },
                                { value: "UNRESPONSIVE LANDLORDS", label: "UNRESPONSIVE LANDLORDS" },
                            ]}
                            onChange={(event, value) => {
                                setValue("type", value)
                            }
                            }
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder=""
                                />
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Message</FormLabel>
                        <TextField
                            placeholder=""
                            {...register("message")}
                            multiline
                            rows={4}
                        // value={}
                        />
                        <FormHelperText>{errors?.message?.message}</FormHelperText>
                    </FormControl>

                    {/* <RichTextEditor

                    /> */}

                </form>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <Button
                    variant="contained"
                    type="submit"
                    form="ticket-form"
                    onClick={() => {
                        console.log(errors)
                     }}
                >
                    {toEdit?.name ? `Edit ticket` : `Create ticket`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}