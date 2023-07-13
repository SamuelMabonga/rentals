import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, Snackbar, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import FileInput from "Components/FileInput"
import fetchAProperty from "apis/fetchAProperty"
import fetchBillingPeriods from "apis/fetchBillingPeriods"
import fetchFeatures from "apis/fetchFeatures"
import fetchPropertyFeatures from "apis/fetchPropertyFeatures"
import fetchUnitTypes from "apis/fetchUnitTypes"
import fetchPropertyUnitTypes from "apis/property/fetchPropertyUnitTypes"
import fetchPropertyUnits from "apis/property/fetchPropertyUnits"
import { CollectionsContext } from "context/context"
import { fetchAllBillingPeriods } from "controllers/billingPeriods"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const formSchema = yup.object().shape({
    // name: yup.string().required("Name is required"),
    // description: yup.string().required("Description is required"),
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
    const { id }: any = router.query

    // SESSION
    const session: any = useSession()
    const token = session?.data?.accessToken
    const { data, refetch }: any = useQuery({
        queryKey: ['property-units', token, property],
        queryFn: () => fetchPropertyUnits(token, property, null),
    })
    const { data: unitTypes }: any = useQuery({ queryKey: ['property-unitTypes', token, id], queryFn: () => fetchPropertyUnitTypes(token, id, null) })
    // const { data: property }: any = useQuery({ queryKey: ['property'], queryFn: () => fetchAProperty(session.accessToken, id) })
    // const { data: unitTypes }: any = useQuery({ queryKey: ['unitTypes'], queryFn: () => fetchUnitTypes(session.accessToken) })

    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register, watch, setValue, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            name: "",
            unitType: {name: ""}
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
        setValue("unitType", {name: ""})

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
                        <FormLabel>Unit Type</FormLabel>
                        <Autocomplete
                            // {...register("features")}/
                            value={watch("unitType")}
                            options={unitTypes?.data || []}
                            getOptionLabel={(option: any) => option.name}
                            onChange={(event, value) => setValue("unitType", value)}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder=""
                                />
                            }
                        />
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