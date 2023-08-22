import { Avatar, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, Snackbar, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import AlertDialog from "Components/Common/AlertDialog"
import fetchTenantsByUnit from "apis/property/fetchTenantsByUnit"
import moment from "moment"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import TenancyModificationAlert from "./TenancyModificationAlert"

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


export default function ViewTenancyModification({ tenancyModification, open, setIsOpen }: any) {


    // const { data: tenants }: any = useQuery({ queryKey: ['unit-tenants', unit?.property, unit?._id], queryFn: () => fetchTenantsByUnit(unit?.property, unit?._id) })

    // console.log("tenants", tenants)


    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            {/* <LinearProgress sx={{ display: isLoading ? "block" : "none" }} /> */}
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Tenancy Modification</Typography>
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
                    <Box display="flex" gap="1rem" alignItems="center">
                        <Avatar
                            src={tenancyModification?.tenant?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenancyModification?.tenant?.user?.name)}&background=random&color=fff`}
                            sx={{ width: "4rem", height: "4rem" }} />
                        <Box>
                            <Typography fontWeight="600" fontSize="1.125rem">{`${tenancyModification?.tenant?.user?.name}`}</Typography>
                            <Typography color="grey" fontWeight="500">{tenancyModification?.tenant?.user?.email}</Typography>
                        </Box>
                    </Box>
                    <Box width="100%" display="grid" gridTemplateColumns={["1fr", "1fr 1fr",]} gap="1rem">
                        <DetailsCard
                            label="Unit"
                            value={tenancyModification?.tenant?.unit?.name}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Start Date"
                            value={moment(tenancyModification?.tenant?.startDate).format("DD/MM/YYYY")}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="End Date"
                            value={moment(tenancyModification?.tenant?.endDate).format("DD/MM/YYYY")}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="New End Date"
                            value={moment(tenancyModification?.newDate).format("DD/MM/YYYY")}
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

                {/* <AlertDialog
                    // hide={row.row.original.status === "PAID"}
                    buttonSize="large"
                    disabled={tenancyModification?.status !== "PENDING"}
                    buttonLabel="Reject"
                    buttonVariant="outlined"
                    buttonColor="error"
                    title="Tenancy extension request"
                    content="Are you sure you want to reject this request?"
                    // setAgreeing={setAccepting}
                    // agreeing={accepting}
                    onAgree={async (event: any) => {
                        event.stopPropagation()
                        event.stopPropagation()

                        try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tenancyModification/accept`, {
                                method: "POST",
                                headers: {
                                    // Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    tenancyModificationId: tenancyModification?._id,
                                    property: tenancyModification?.property,
                                })
                            })

                            await res.json()

                            // setAccepting(false)
                        } catch (error) {
                            // setAccepting(false)
                            alert("Failed to accept")

                            console.log("ACCEPT ERROR", error)
                        }
                    }}
                />

                <AlertDialog
                    // hide={row.row.original.status === "PAID"}
                    buttonSize="large"
                    disabled={tenancyModification?.status !== "PENDING"}
                    buttonLabel="Accept"
                    buttonVariant="contained"
                    title="Tenancy extension request"
                    content="Are you sure you want to extend the end date of this tenancy?"
                    // setAgreeing={setAccepting}
                    // agreeing={accepting}
                    onAgree={async (event: any) => {
                        event.stopPropagation()
                        event.stopPropagation()

                        try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/tenancyModification/accept`, {
                                method: "POST",
                                headers: {
                                    // Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    tenancyModificationId: tenancyModification?._id,
                                    property: tenancyModification?.property,
                                })
                            })

                            await res.json()

                            // setAccepting(false)
                        } catch (error) {
                            // setAccepting(false)
                            alert("Failed to accept")

                            console.log("ACCEPT ERROR", error)
                        }
                    }}
                /> */}

                <TenancyModificationAlert
                    data={tenancyModification}
                    disabled={tenancyModification?.status !== "PENDING"}
                    buttonLabel="Reject"
                    buttonVariant="outlined"
                    buttonColor="error"
                    title="Are you sure you want to reject this booking?"
                    content="If you decline, the user that created this booking will not become a tenant at your property"
                    action="reject"
                />
                <TenancyModificationAlert
                    data={tenancyModification}
                    disabled={tenancyModification?.status !== "PENDING"}
                    buttonLabel="Accept"
                    buttonVariant="contained"
                    title="Are you sure you want to accept this booking?"
                    content="If you accept, the user that created this booking will become a tenant at your property"
                    action="accept"
                />
            </DialogActions>
        </Dialog>
    )
}