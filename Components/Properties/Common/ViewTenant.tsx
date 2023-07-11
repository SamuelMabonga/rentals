import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Avatar, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, Snackbar, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import fetchPropertyUnitTypes from "apis/property/fetchPropertyUnitTypes"
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


export default function ViewTenant({ tenant }: any) {
    // CONTEXT
    const {
        openViewTenant: open,
        setOpenViewTenant: setIsOpen,

    }: any = useContext(CollectionsContext)

    const router = useRouter()
    const { id }: any = router.query

    // SESSION
    const session: any = useSession()
    const token = session?.data?.accessToken
    const { data: unitTypes }: any = useQuery({ queryKey: ['property-unitTypes', id], queryFn: () => fetchPropertyUnitTypes(id, null) })
    // const { data: property }: any = useQuery({ queryKey: ['property'], queryFn: () => fetchAProperty(session.accessToken, id) })
    // const { data: unitTypes }: any = useQuery({ queryKey: ['unitTypes'], queryFn: () => fetchUnitTypes(session.accessToken) })


    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            {/* <LinearProgress sx={{ display: isLoading ? "block" : "none" }} /> */}
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Tenant </Typography>
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
                        <Avatar sx={{ width: "4rem", height: "4rem" }} />
                        <Box>
                            <Typography fontWeight="600" fontSize="1.125rem">{`${tenant?.user?.first_name} ${tenant?.user?.last_name}`}</Typography>
                            <Typography color="grey" fontWeight="500">{tenant?.user?.email}</Typography>
                        </Box>
                    </Box>


                    <Box width="100%" display="grid" gridTemplateColumns={["1fr", "1fr 1fr",]} gap="1rem">
                        <DetailsCard
                            label="Entry Date"
                            value={moment(tenant?.startDate).format("DD MMM YYYY")}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Exit Date"
                            value={moment(tenant?.endDate).format("DD MMM YYYY")}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Tenancy length"
                            value={`${moment(tenant?.endDate).diff(moment(tenant?.startDate), "days")} days`}
                            // value="12/12/2021"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <DetailsCard
                            label="Days Remaining"
                            value={`${moment(tenant?.endDate).diff(moment(), "days")} days`}
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
                >
                    {`Close`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}