import { Avatar, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, Snackbar, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import fetchTenantsByUnit from "apis/property/fetchTenantsByUnit"
import { CollectionsContext } from "context/context"
import moment from "moment"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"

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


export default function ViewUnit({ tenant, unit, open, setIsOpen }: any) {

    // CONTEXT
    const {
        setOpenBookingForm,
        setUnitToBook
    }: any = useContext(CollectionsContext)

    const { data: tenants }: any = useQuery({ queryKey: ['unit-tenants', unit?.property, unit?._id], queryFn: () => fetchTenantsByUnit(unit?.property, unit?._id) })

    console.log("tenants", tenants)


    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            {/* <LinearProgress sx={{ display: isLoading ? "block" : "none" }} /> */}
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">{unit?.name}</Typography>
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
                <Box display="flex" flexDirection="column" gap="1rem">
                    <Box width="100%" display="grid" gridTemplateColumns={["1fr", "1fr 1fr",]} gap="1rem">
                        <DetailsCard
                            label="Unit Type"
                            value={unit?.unitType?.name}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Status"
                            value={unit?.status}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Total Tenants Hosted"
                            value={tenants?.pageInfo?.itemCount}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Available After"
                            value={unit?.availableAfter ? moment(unit?.availableAfter).format("DD MMM YYYY") : "Available"}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    </Box>
                </Box>

            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <Button
                    variant="contained"
                    type="submit"
                    form="unit-form"
                    onClick={() => {
                        setUnitToBook(unit)
                        setIsOpen(false)
                        setOpenBookingForm(true)

                    }}
                >
                    Create a booking
                </Button>
            </DialogActions>
        </Dialog>
    )
}