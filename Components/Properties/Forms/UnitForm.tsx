import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, Snackbar, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import fetchPropertyUnitTypes from "apis/property/fetchPropertyUnitTypes"
import fetchPropertyUnits from "apis/property/fetchPropertyUnits"
import { CollectionsContext } from "context/context"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    unitType: yup.object().required("Unit type is required")
})

export default function UnitForm({property}: any) {
    // CONTEXT
    const {
        openUnitForm: open,
        setOpenUnitForm: setIsOpen,
        unitToEdit: toEdit,
        setUnitToEdit: setToEdit,
        setSnackbarMessage
    }: any = useContext(CollectionsContext)

    const router = useRouter()

    // SESSION
    const session: any = useSession()
    const token = session?.data?.accessToken
    const { refetch }: any = useQuery({
        queryKey: ['property-units', token, property],
        queryFn: () => fetchPropertyUnits(property, null, null, null),
    })
    const { data: unitTypes }: any = useQuery({ queryKey: ['property-unitTypes', property], queryFn: () => fetchPropertyUnitTypes(property, null) })

    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register, watch, setValue, reset, formState: { errors }, setError }: any = useForm({
        defaultValues: {
            name: "",
            unitType: null
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    useEffect(() => {
        if (toEdit?.name) {
            setValue("name", toEdit.name)
            setValue("unitType", toEdit.unitType)
            return
        }

        reset()
        // setValue()

    }, [toEdit])

    async function onSubmit(values: any) {
        setIsLoading(true)

        const data = {
            name: values.name,
            unitType: values.unitType._id,
            property: property
        }

        // // EDIT A PROPERTY
        if (toEdit?.name) {
            const edited = {
                ...toEdit,
                name: values.name,
                unitType: values.unitType._id,
            }
            try {
                const res = await fetch(`/api/unit?id=${toEdit._id}`,{
                    method: 'PUT',
                    headers:{
                        'Content-Type':'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({...edited})
                })
                const response = await res.json();
                console.log(response)

                refetch()
                setSnackbarMessage({
                    open: true,
                    vertical: 'top',
                    horizontal: 'center',
                    message: "Unit edited successfully",
                    icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{color: "inherit"}} className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Box>
                })
                setIsLoading(false)
                setIsOpen(false)
                reset()
                return
            } catch(error) {
                setIsLoading(false)
                console.log(error)
                return
            }
        }

        // POST A PROPERTY
        try {
            const res = await fetch('/api/unit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...data })
            })
            const response = await res.json();

            if (!response.success) return

            refetch()
            setSnackbarMessage({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: "Unit created successfully",
                icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{color: "inherit"}} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Box>
            })
            setIsLoading(false)
            setIsOpen(false)
            reset()
            return
        } catch (error) {
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
            <LinearProgress sx={{ display: isLoading ? "block" : "none" }} />
            <DialogTitle sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography fontWeight="600">Create new unit </Typography>
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
                    id="unit-form"
                    onSubmit={handleSubmit(onSubmit)}
                    style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    <FormControl
                        error={errors?.name?.message}
                    >
                        <FormLabel>Name</FormLabel>
                        <TextField
                            placeholder=""
                            {...register("name")}
                        // value={}
                        />
                        <FormHelperText>{errors?.name?.message}</FormHelperText>
                    </FormControl>
                    <FormControl
                        error={errors?.unitType?.message}
                    >   
                        <FormLabel>Unit Type</FormLabel>
                        <Autocomplete
                            // {...register("features")}/
                            value={watch("unitType")}
                            options={unitTypes?.data || []}
                            getOptionLabel={(option: any) => option.name}
                            onChange={(event, value) => {
                                setValue("unitType", value)
                                setError("unitType", null)
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder=""
                                />
                            }
                        />
                        <FormHelperText>{errors?.unitType?.message}</FormHelperText>
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <Button
                    variant="contained"
                    type="submit"
                    form="unit-form"
                >
                    {toEdit?.name ? `Edit unit` : `Create unit`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}