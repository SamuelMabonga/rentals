import { yupResolver } from "@hookform/resolvers/yup"
import { CloudUpload, CloudUploadOutlined, Upload } from "@mui/icons-material"
import { Autocomplete, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import ImageEditor from "Components/Common/ImageEditor"
import FileInput from "Components/FileInput"
import fetchPropertyFeatures from "apis/fetchPropertyFeatures"
import fetchProperties from "apis/user/fetchProperties"
import { CollectionsContext } from "context/context"
import { set } from "mongoose"
import { useSession } from "next-auth/react"
import Image from "next/image"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    propertyProfileImage: yup.string().required("Image is required"),
    propertyCoverImage: yup.string().required("Image is required"),
})

function ImageInput({
    id,
    name,
    label,
    value,
    register,
    setImageToUpload,
    setOpenImageUploader,
    inputId,
    setInputId,
    imageUrl,
    setValue,
    error,
    imageType,
    setImageType
}: any) {
    // IMAGE
    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        // Stop if ids do not match
        if (!inputId === id) return

        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        console.log("SELECTED FILE", selectedFile)
        const objectUrl: any = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // SAVE IMAGE AND OPEN IMAGE EDITOR
        setInputId(id)
        setImageToUpload(objectUrl)
        setOpenImageUploader(true)
        setImageType(imageType)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])


    const onSelectFile: any = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    const ref: any = useRef(null)

    // SAVE IMAGE
    useEffect(() => {
        if (imageUrl === "") return

        if (inputId === id) {
            setValue(imageUrl)
        }
    }, [imageUrl])

    return (
        <FormControl
            onClick={() => ref.current.click()}
            sx={{
                display: "flex",
                width: "100%",
            }}
        >
            <FormLabel>{label}</FormLabel>
            <Box display={value === "" ? "flex" : "none"} flexDirection="column" mx="auto" alignItems="center" border="1px solid #ccc" padding="1rem" width="100%" borderRadius="0.25rem">
                <CloudUploadOutlined sx={{ width: "3rem", height: "3rem" }} />
                <Typography color="gray" fontWeight="500" fontSize="0.875rem">Upload Image</Typography>
            </Box>
            <Box display={imageType === "cover" && value !== "" ? "flex" : "none"} width={"100%"}>
                <Image
                    src={value}
                    alt="cover image"
                    width={0}
                    height={0}
                    layout="responsive"
                />
            </Box>
            <Box display={imageType === "avatar" && value !== "" ? "flex" : "none"} width={"100%"}>
                <Avatar
                    src={value}
                    alt="avatar image"
                    sx={{
                        width: "10rem",
                        height: "10rem",
                        border: "1px solid #ccc",
                    }}
                />
            </Box>
            <TextField
                inputRef={ref}
                type="file"
                id={id}
                name={name}
                onChange={onSelectFile}
                sx={{
                    display: "none"
                }}
            // {...register(name)}
            />
            <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
    )
}

export default function PropertyForm() {
    // CONTEXT
    const {
        showPropertyForm: open,
        setShowPropertyForm: setIsOpen,
        propertyToEdit: toEdit,
        setPropertyToEdit: setToEdit,

        propertiesPage: page,
        setPropertiesPage: setPage,

        setSnackbarMessage,


        setOpenImageUploader,
        setImageToUpload,

        inputId,
        setInputId,
        imageUrl,
        setImageUrl,
        imageType,
        setImageType,
    }: any = useContext(CollectionsContext)

    // fetch property features
    // const { data: features }: any = useQuery({ queryKey: ['propertyFeatures'], queryFn: () => fetchPropertyFeatures(session.accessToken) })

    const session: any = useSession()
    const token = session?.data?.accessToken

    const [isLoading, setIsLoading] = useState(false)

    const { refetch }: any = useQuery({ queryKey: ['properties', token], queryFn: () => fetchProperties(token, page) })

    const { handleSubmit, register, watch, setValue, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            name: "",
            description: "",
            propertyProfileImage: "",
            propertyCoverImage: ""
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    useEffect(() => {
        if (toEdit?.name) {
            setValue("name", toEdit.name)
            setValue("description", toEdit.description)
            return
        }

        reset()

    }, [toEdit])

    async function onSubmit(values: any) {
        setIsLoading(true)

        const data = {
            name: values.name,
            description: values.description,
            owner: session?.data?.user?.id,
            propertyProfileImage: values.propertyProfileImage,
            propertyCoverImage: values.propertyCoverImage
        }

        // EDIT A PROPERTY
        if (toEdit?.name) {
            const edited = {
                ...toEdit,
                name: values.name,
                description: values.description
            }
            try {
                const res = await fetch(`/api/property?id=${toEdit._id}`, {
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
                return
            } catch (error) {
                setIsLoading(false)
                console.log(error)
                return
            }
        }

        // POST A PROPERTY
        try {
            const res = await fetch('/api/property', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...data })
            })
            const response = await res.json();
            // console.log(response)
            if (!response.success) {
                setIsLoading(false)
                return setSnackbarMessage({
                    open: true,
                    vertical: 'top',
                    horizontal: 'center',
                    message: "Failed to create property",
                    icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" style={{ color: "red" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>

                    </Box>
                })
            }
            setIsLoading(false)
            refetch()
            setSnackbarMessage({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: "Property created successfully",
                icon: <Box width="1.5rem" height="1.5rem" color="lightgreen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "inherit" }} className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Box>
            })
            setIsOpen(false)
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

                    {/* <FormLabel htmlFor="profile-image" > 
                        Profile Image
                        <TextField
                            id="profie-image"
                            type='file'
                            onChange={onSelectFile}
                            sx={{
                                display: "none"
                            }}
                        />
                    </FormLabel> */}

                    <ImageInput
                        name="propertyProfileImage"
                        label={"Property profile image"}
                        value={watch("propertyProfileImage")}
                        setImageToUpload={setImageToUpload}
                        setOpenImageUploader={setOpenImageUploader}
                        id="propertyProfileImage"
                        inputId={inputId}
                        setInputId={setInputId}
                        imageUrl={imageUrl}
                        setValue={(value: string) => setValue("propertyProfileImage", value)}
                        error={errors?.propertyProfileImage}
                        imageType={"avatar"}
                        setImageType={setImageType}
                    />

                    <ImageInput
                        name="propertyCoverImage"
                        label={"Property cover image"}
                        value={watch("propertyCoverImage")}
                        setImageToUpload={setImageToUpload}
                        setOpenImageUploader={setOpenImageUploader}
                        id="propertyCoverImage"
                        inputId={inputId}
                        setInputId={setInputId}
                        imageUrl={imageUrl}
                        setValue={(value: string) => setValue("propertyCoverImage", value)}
                        error={errors?.propertyCoverImage}
                        imageType={"cover"}
                        setImageType={setImageType}
                    />
                    {/* <FormControl>
                        <FormLabel>Features</FormLabel>
                        <Autocomplete
                            // {...register("features")}
                            options={features?.data}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    placeholder=""
                                />
                            }
                        />
                    </FormControl> */}
                    {/* <FileInput />
                    <FileInput /> */}
                    <ImageEditor />
                </form>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
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