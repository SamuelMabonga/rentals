import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import FileInput from "Components/FileInput"
import fetchFeatures from "apis/fetchFeatures"
import { CollectionsContext } from "context/context"
import { set } from "mongoose"
import { useSession } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import RolesAutocomplete from "./Atoms/RolesAutocomplete"
import fetchRoles from "apis/admin/fetchRoles"

const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    // price: yup.string().required("Price is required"),
})

export default function RolesForm() {
    // CONTEXT
    const {

        rolesPage: page,
        setRolesPage: setPage,

        roleToEdit: toEdit,
        setRoleToEdit: setToEdit,

        openRolesForm: open,
        setOpenRolesForm: setIsOpen,

        setSnackbarMessage
    }: any = useContext(CollectionsContext)

    const session: any = useSession()
    const token = session?.data?.accessToken

    const { refetch }: any = useQuery({ queryKey: ['roles', token, page], queryFn: () => fetchRoles(token, page) })

    const [isLoading, setIsLoading] = useState(false)

    const { handleSubmit, register, watch, setValue, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            name: "",
            permissions: []
            // features: ""
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    useEffect(() => {
        if (toEdit?.name) {
            setValue("name", toEdit.name)
            setValue("permissions", toEdit.permissions)
            return
        }

        reset()

    }, [toEdit])

    async function onSubmit(values: any) {
        setIsLoading(true)

        const data = {
            name: values.name,
            permissions: values.permissions
        }

        // EDIT A PROPERTY
        if (toEdit?._id) {
            const edited = {
                ...toEdit,
                name: values.name,
                permissions: values.permissions
            }
            try {
                const res = await fetch(`/api/roles?id=${toEdit._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ...edited })
                })
                const response = await res.json();
                console.log(response)
                setIsLoading(false)
                setIsOpen(false)
                setSnackbarMessage({
                    open: true,
                    vertical: 'top',
                    horizontal: 'center',
                    message: response.msg,
                    icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "inherit" }} className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Box>
                })
                return refetch()
            } catch (error) {
                setIsLoading(false)
                console.log(error)
                return
            }
        }

        // POST A feature
        try {
            const res = await fetch('/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...data })
            })
            const response = await res.json();
            console.log(response)
            setIsLoading(false)
            setIsOpen(false)
            setSnackbarMessage({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: "Role created successfully",
                icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "inherit" }} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Box>
            })
            return refetch()
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
                <Typography fontWeight="600">{`${toEdit?._id ? "Edit" : "Create new"} role`}</Typography>
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
                    id="features-form"
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

                    <RolesAutocomplete
                        value={watch("permissions")}
                        setValue={(value: any) => setValue("permissions", value)}
                    />
                </form>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <Button
                    variant="contained"
                    type="submit"
                    form="features-form"
                >
                    {toEdit?.name ? `Edit role` : `Create role`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}