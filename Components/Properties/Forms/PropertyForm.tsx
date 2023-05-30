import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import FileInput from "Components/FileInput"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
})

export default function PropertyForm() {
    // CONTEXT
    const {
        showPropertyForm: open,
        setShowPropertyForm: setIsOpen,
        propertyToEdit: toEdit,
        setPropertyToEdit: setToEdit,
        setSnackbarMessage
    }: any = useContext(CollectionsContext)

    const session: any = useSession()

    const [isLoading, setIsLoading] = useState(false)
    
    const { handleSubmit, register, watch, setValue, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            name: "",
            description: "",
            features: ""
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    useEffect(() => {
        if (toEdit?.name) {
            setValue("name", toEdit.name)
            setValue("description", toEdit.details)
            return
        }

        reset()

    }, [toEdit])

    async function onSubmit(values: any) {
        setIsLoading(true)

        const data = {
            name: values.name,
            details: values.description
        }


        // EDIT A PROPERTY
        if (toEdit?.name) {
            const edited = {
                ...toEdit,
                name: values.name,
                details: values.description
            }
            try {
                const res = await fetch(`/api/property?id=${toEdit._id}`,{
                    method: 'PUT',
                    headers:{
                        'Content-Type':'application/json',
                        Authorization: `Bearer ${session.data.accessToken}`,
                    },
                    body: JSON.stringify({...edited})
                })
                const response = await res.json();
                console.log(response)
                setIsLoading(false)
                return
            } catch(error) {
                setIsLoading(false)
                console.log(error)
                return
            }
        }

        // POST A PROPERTY
        try {
            const res = await fetch('/api/property',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${session.data.accessToken}`,
                },
                body: JSON.stringify({...data})
            })
            const response = await res.json();
            console.log(response)
            setIsLoading(false)
            setSnackbarMessage({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: "Property created successfully",
                icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{color: "inherit"}} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Box>
            })
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
                <IconButton onClick={() => {
                    setToEdit({})
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
                            // value={}
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
                    {toEdit?.name ? `Edit Property` : `Create Property`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}