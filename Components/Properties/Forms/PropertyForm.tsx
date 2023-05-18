import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, Input, TextField, Typography } from "@mui/material"
import React from "react"

function FileInput() {
    return (
        <FormControl>
            <FormLabel>Profile photo</FormLabel>
            <FormLabel sx={{ border: "1px solid red", height: "fit-content", borderRadius: "0.25rem", padding: "1rem" }}>
                <Input
                    type="file"
                    sx={{
                        display: "none"
                    }}
                />
                <Box>
                    <Box width="4rem" height="4rem" mx="auto">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                    </Box>
                    <Typography fontWeight="600" textAlign="center">Click to upload or drag and drop</Typography>
                    <Typography fontSize="0.875rem" textAlign="center">SVG, PNG, JPG or GIF (MAX. 800x400px)</Typography>
                </Box>
            </FormLabel>
        </FormControl>
    )
}

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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
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