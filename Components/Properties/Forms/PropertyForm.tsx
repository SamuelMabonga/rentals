import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, Input, TextField, Typography } from "@mui/material"
import FileInput from "Components/FileInput"
import React from "react"

export default function PropertyForm({open, setIsOpen}: any) {
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Create new property</Typography>
                <IconButton onClick={() => setIsOpen(false)}>
                    <Box width="1.5rem" height="1.5rem">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Box>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form id="property-form" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <TextField
                            placeholder=""
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <TextField
                            multiline
                            rows={4}
                            placeholder=""
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Features</FormLabel>
                        <Autocomplete
                            options={[{ label: "Yes", value: "Yes" }]}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder=""
                                />
                            }
                        />
                    </FormControl>
                    <FileInput />
                    <FileInput />
                </form>
            </DialogContent>
            <DialogActions sx={{padding: "1.5rem"}}>
                <Button variant="contained">Create Property</Button>
            </DialogActions>
        </Dialog>
    )
}