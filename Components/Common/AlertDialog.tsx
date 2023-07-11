import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function AlertDialog({
    data,
    hide,
    buttonLabel,
    buttonVariant,
    buttonColor = "primary",
    title,
    content,
    onAgree,
    loadingProp,
    setLoadingProp,
    disabled,
    open: openProp,
    setOpen: setOpenProp,
    // onOpen
}: any) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(openProp)
    }, [openProp])

    const handleClickOpen = (event: any) => {
        event.stopPropagation()
        event.stopPropagation()
        console.log("clicked")
        setOpen((prev: any) => {
            console.log("prev", prev)

            return !prev
            // true
        });
        // onOpen(event)
    };

    const handleClose = (event: any) => {
        event.stopPropagation()
        setOpen(false);
    };

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (loadingProp) {
            return setLoading(true)
        }

        return setLoading(false)
    }, [loadingProp])

    return (
        <div style={{display: hide ? "none" : "block"}}>
            <Button disabled={disabled} variant={buttonVariant} color={buttonColor} size="small" sx={{ fontSize: "0.875rem",  }} onClick={handleClickOpen}>
                {buttonLabel}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby={`alert-dialog-title-${data?._id}`}
                aria-describedby={`alert-dialog-title-${data?._id}`}
                sx={{display: hide ? "none" : "block"}}
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
                <DialogActions sx={{padding: "1rem"}}>
                    <Button variant="outlined" color="error" onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={(event) => {
                            // setAgreeing(true)
                            onAgree(event)
                        }}
                        autoFocus
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}