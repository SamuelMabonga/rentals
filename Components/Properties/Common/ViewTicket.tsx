import { Close } from "@mui/icons-material"
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, IconButton, LinearProgress, Typography } from "@mui/material"
import { CollectionsContext } from "context/context"
import React, { useContext } from "react"

export default function ViewTicket({ open, setOpen, ticket }: { open: boolean, setOpen: any, ticket: any }) {
    const { setSnackbarMessage }: any = useContext(CollectionsContext)

    console.log("TICKET", ticket)
    const [loading, setLoading] = React.useState(false)
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <LinearProgress sx={{ display: loading ? "flex" : "none" }} />
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight={"600"}>{ticket?.type}</Typography>
                <IconButton onClick={() => setOpen(false)} >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap="1.5rem">

                    <Box display="flex" justifyContent={"space-between"}>
                        <Box display="flex" gap="0.5rem" alignItems="center">
                            <Avatar
                                sx={{ width: "3rem", height: "3rem" }}
                            />
                            <Box>
                                <Typography fontWeight="600">{ticket?.tenant?.user?.name}</Typography>
                                <Typography variant="body2" color="GrayText" fontWeight="600">Unit: {ticket?.unit?.name}</Typography>
                            </Box>
                        </Box>
                        <Chip
                            label={ticket?.status}
                            size="small"
                            sx={{ fontWeight: "500", fontSize: "0.75rem" }}
                            color={ticket?.status === "PENDING" ? "warning" : ticket?.status === "INPROGRESS" ? "info" : "success"}
                        />
                    </Box>

                    <Box>
                        <FormLabel>Message</FormLabel>
                        <Box border="1px solid" padding="1rem" borderColor="#c4c4c4" bgcolor="primary.light" borderRadius="0.5rem">

                            <Typography>{ticket?.message}</Typography>
                        </Box>
                    </Box>
                </Box>

            </DialogContent>

            <DialogActions sx={{ m: 0, p: "1.5rem" }}>
                <Button
                    variant="contained"
                    sx={{ display: ticket?.status === "PENDING" ? "flex" : "none" }}
                    onClick={async () => {
                        setLoading(true)

                        try {
                            const res = await fetch(`/api/ticket/property/progress?id=${ticket?.property}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ ticket: ticket?._id })
                            })
                            await res.json();


                            setLoading(false)
                            setOpen(false)
                            setSnackbarMessage({
                                open: true,
                                vertical: 'top',
                                horizontal: 'center',
                                message: "Ticket marked as in progress",
                                icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "inherit" }} className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </Box>
                            })
                        } catch (error) {
                            setLoading(false)
                            console.log(error)

                        }
                    }}
                >
                    Mark as In Progress
                </Button>
                <Button
                    variant="contained"
                    sx={{ display: ticket?.status === "INPROGRESS" ? "flex" : "none" }}
                    onClick={async () => {
                        setLoading(true)

                        try {
                            const res = await fetch(`/api/ticket/property/completed?id=${ticket?.property}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ ticket: ticket?._id })
                            })
                            await res.json();


                            setLoading(false)
                            setOpen(false)
                            setSnackbarMessage({
                                open: true,
                                vertical: 'top',
                                horizontal: 'center',
                                message: "Ticket marked as completed",
                                icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "inherit" }} className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </Box>
                            })
                        } catch (error) {
                            setLoading(false)
                            console.log(error)

                        }
                    }}
                >
                    Mark as Completed
                </Button>
            </DialogActions>

        </Dialog>
    )
}