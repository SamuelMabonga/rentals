import React from 'react'
import { FormControl, FormLabel, Input, Typography, Box } from "@mui/material";

export default function FileInput() {
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                    </Box>
                    <Typography fontWeight="600" textAlign="center">Click to upload or drag and drop</Typography>
                    <Typography fontSize="0.875rem" textAlign="center">SVG, PNG, JPG or GIF (MAX. 800x400px)</Typography>
                </Box>
            </FormLabel>
        </FormControl>
    )
}