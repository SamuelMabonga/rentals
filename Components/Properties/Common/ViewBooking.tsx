import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Avatar, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, Snackbar, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import TenantBillsCard from "Components/Tenants/Common/TenantBillsCard"
import fetchPropertyUnitTypes from "apis/property/fetchPropertyUnitTypes"
import { CollectionsContext } from "context/context"
import moment from "moment"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import BookingAlertDialog from "../Forms/Components/BookingAlertDialog"

function DetailsCard({ label, value, icon }: any) {
    return (
        <Card
            sx={{
                width: "100%",
                bgcolor: "white",
                color: "secondary",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                boxShadow: "0px 4px 20px rgba(211, 205, 218, 0.25)",
                border: "1px solid rgba(211, 205, 218, 0.7)",
            }}
        >
            <Box display="flex" gap="0.5rem" alignItems="center">
                <Box width="1.5rem" height="1.5rem" color="grey">
                    {icon}
                </Box>
                <Typography color="grey" fontSize="0.875rem" fontWeight="500" lineHeight={"100%"}>
                    {label}
                </Typography>
            </Box>

            <Typography color="primary" fontWeight={"600"} fontSize="1rem" textAlign={"right"}>{value}</Typography>
        </Card>
    )
}


export default function ViewBooking({ booking, open, setIsOpen }: any) {
    // // CONTEXT
    // const {
    //     openViewTenant: open,
    //     setOpenViewTenant: setIsOpen,

    // }: any = useContext(CollectionsContext)

    const router = useRouter()
    const { id }: any = router.query

    // SESSION
    const session: any = useSession()
    const token = session?.data?.accessToken
    // const { data: unitTypes }: any = useQuery({ queryKey: ['property-unitTypes', token, id], queryFn: () => fetchPropertyUnitTypes(token, id, null) })
    // const { data: property }: any = useQuery({ queryKey: ['property'], queryFn: () => fetchAProperty(session.accessToken, id) })


    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            {/* <LinearProgress sx={{ display: isLoading ? "block" : "none" }} /> */}
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Booking</Typography>
                <IconButton onClick={() => {
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
                <Box display="flex" flexDirection="column" gap="1rem" width="100%">
                    <Box display="flex" flexDirection={["column", "row"]} gap="1rem" alignItems={["flex-start", "center"]} maxWidth="100%" overflow={"hidden"}>
                        <Avatar
                        src={booking?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking?.user?.name)}&background=random&color=fff`}
                        sx={{ width: "4rem", height: "4rem" }} />
                        <Box width="100%">
                            <Typography fontWeight="600" fontSize="1.125rem">{`${booking?.user?.name}`}</Typography>
                            <Typography color="grey" fontWeight="500" maxWidth="100%" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" sx={{ textOverflow: "ellipsis" }}>{booking?.user?.email}</Typography>
                        </Box>
                    </Box>


                    <Box width="100%" display="grid" gridTemplateColumns={["1fr", "1fr 1fr",]} gap="1rem">
                        <DetailsCard
                            label="Unit"
                            value={booking?.unit?.name}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Unit Type"
                            value={booking?.unit?.unitType?.name}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Entry Date"
                            value={moment(booking?.startDate).format("DD MMM YYYY")}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Exit Date"
                            value={moment(booking?.endDate).format("DD MMM YYYY")}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Tenancy length"
                            value={`${moment(booking?.endDate).diff(moment(booking?.startDate), "days")} days`}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        {/* <DetailsCard
                            label="Days Remaining"
                            value={`${moment(booking?.endDate).diff(moment(), "days")} days`}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        /> */}
                    </Box>
                </Box>

            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <BookingAlertDialog
                    data={booking}
                    disabled={booking?.status !== "PENDING"}
                    buttonLabel="Accept"
                    buttonVariant="contained"
                    title="Are you sure you want to accept this booking?"
                    content="If you accept, the user that created this booking will become a tenant at your property"
                    action="accept"
                />
                <BookingAlertDialog
                    data={booking}
                    disabled={booking?.status !== "PENDING"}
                    buttonLabel="Reject"
                    buttonVariant="outlined"
                    buttonColor="error"
                    title="Are you sure you want to reject this booking?"
                    content="If you decline, the user that created this booking will not become a tenant at your property"
                    action="reject"
                />
            </DialogActions>
        </Dialog>
    )
}