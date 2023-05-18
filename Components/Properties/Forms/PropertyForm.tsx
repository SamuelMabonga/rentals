import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import FileInput from "Components/FileInput"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
})

export default function PropertyForm({open, setIsOpen}: any) {
    const [isLoading, setIsLoading] = useState(false)
    
    const { handleSubmit, register, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            description: "",
            features: ""
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema)
    });

    async function onSubmit(values: any) {
        setIsLoading(true)

        const data = {
            name: values.name,
            details: values.description
        }

        try {
            const res = await fetch('/api/property',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({...data})
            })
            const response = await res.json();
            console.log(response)
            setIsLoading(false)
        } catch(error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
        >
                                    <LinearProgress sx={{display: isLoading ? "block" : "none"}} />
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
                <form
                    id="property-form"
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <TextField
                            placeholder=""
                            {...register("name")}
                        />
                        <FormHelperText>{errors?.name?.message}</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <TextField
                            {...register("description")}
                            multiline
                            rows={4}
                            placeholder=""
                        />
                        <FormHelperText>{errors?.description?.message}</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Features</FormLabel>
                        <Autocomplete
                            // {...register("features")}
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
                <Button
                    variant="contained"
                    type="submit"
                    form="property-form"
                >
                    Create Property
                </Button>
            </DialogActions>
        </Dialog>
    )
}