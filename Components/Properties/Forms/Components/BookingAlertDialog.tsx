import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import fetchPropertyBookings from "apis/property/fetchPropertyBookings";
import { CollectionsContext } from "context/context";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";

export default function BookingAlertDialog({
    data,
    hide,
    buttonLabel,
    buttonVariant,
    buttonColor = "primary",
    title,
    content,
    disabled,
    action
    // onOpen
}: any) {
    // CONTEXT
    const {
        bookingPage: page,
        setBookingPage: setPage,
        setSnackbarMessage
    }: any = useContext(CollectionsContext)

    const session: any = useSession()
    const token = session?.data?.accessToken

    const property = data?.property

    const { refetch }: any = useQuery({ queryKey: ['property-bookings', token, property, page], queryFn: () => fetchPropertyBookings(token, property, page, "") })

    const [open, setOpen] = useState(false);

    const handleClickOpen = (event: any) => {
        event.stopPropagation()
        event.stopPropagation()

        setOpen((prev: any) => {
            return !prev
        });
    };

    const handleClose = (event: any) => {
        event.stopPropagation()
        setOpen(false);
    };

    const [loading, setLoading] = useState(false)

    return (
        <div style={{ display: hide ? "none" : "block" }}>
            <Button disabled={disabled} variant={buttonVariant} color={buttonColor} size="small" sx={{ fontSize: "0.875rem", }} onClick={handleClickOpen}>
                {buttonLabel}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby={`alert-dialog-title-${data?._id}`}
                aria-describedby={`alert-dialog-title-${data?._id}`}
                sx={{ display: hide ? "none" : "block" }}
            >
                <LinearProgress sx={{ display: loading ? "flex" : "none" }} />
                <DialogTitle id={`alert-dialog-title-${data?._id}`}>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id={`alert-dialog-description-${data?._d}`}>
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: "1rem" }}>
                    <Button variant="outlined" color="error" disabled={loading} onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={async (event) => {
                            // setAgreeing(true)
                            event.stopPropagation()
                            event.preventDefault()

                            setLoading(true)

                            if (action === "accept") {
                                try {
                                    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/booking/accept`, {
                                        method: "POST",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            status: "ACCEPTED",
                                            id: data._id,
                                            property: data.property,
                                        })
                                    })
    
                                    const response = await res.json()
    
                                    if (response.success) {
                                        refetch()
                                        setLoading(false)
                                        setSnackbarMessage({
                                            open: true,
                                            vertical: 'top',
                                            horizontal: 'center',
                                            message: "Booking accepted successfully",
                                            icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{color: "inherit"}} className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </Box>
                                        })
                                        return setOpen(false)
                                    }
                                } catch (error) {
                                    setLoading(false)
                                    return alert("Failed to accept")
                                }
                            }

                            try {
                                const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/booking/reject`, {
                                    method: "POST",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        status: "REJECTED",
                                        id: data._id,
                                        property: data.property,
                                    })
                                })

                                const response = await res.json()

                                if (response.success) {
                                    refetch()
                                    setLoading(false)
                                    setSnackbarMessage({
                                        open: true,
                                        vertical: 'top',
                                        horizontal: 'center',
                                        message: "Booking rejected successfully",
                                        icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{color: "inherit"}} className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </Box>
                                    })
                                    return setOpen(false)
                                }
                            } catch (error) {
                                setLoading(false)
                                return alert("Failed to reject")
                            }
                        }}

                    // autoFocus
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}