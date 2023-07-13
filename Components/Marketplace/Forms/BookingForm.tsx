import { yupResolver } from "@hookform/resolvers/yup";
import { Close } from "@mui/icons-material";
import { Autocomplete, Avatar, Box, Button, Chip, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery } from "@tanstack/react-query";
import currencyFormatter from "Components/Common/currencyFormatter";
import { formSchema } from "Components/Properties/Forms/Schema/BookingForm";
import fetchPropertyUnitTypes from "apis/property/fetchPropertyUnitTypes";
import { CollectionsContext } from "context/context";
import moment from "moment";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

export default function BookingForm() {
    // CONTEXT 
    const {
        openPublicBooking: open,
        setOpenPublicBooking: setOpen
    }: any = useContext(CollectionsContext)

    const router = useRouter()
    const { id }: any = router.query

    const { data: unitTypes }: any = useQuery({ queryKey: ['property-unitTypes', id], queryFn: () => fetchPropertyUnitTypes("token", id, null) })
    const { data: features, isLoading: featuresLoading }: any = useQuery({
        queryKey: ['property-features', id],
        queryFn: () => fetchPropertyUnitTypes("token", id, null),
    })

    const [units, setUnits] = useState([])
    const [loadingUnits, setLoadingUnits] = useState(false)


    const { handleSubmit, register, watch, setValue, setError, reset, formState: { errors } }: any = useForm({
        defaultValues: {
            userSearchTerm: "",
            user: {
                _id: "",
                first_name: "",
                last_name: ""
            },
            unitType: {
                _id: "",
                name: ""
            },
            unit: {
                _id: "",
                name: ""
            },
            additionalFeatures: [
                { _id: "", feature: { _id: "", name: "" } }
            ],
            startDate: "",
            endDate: ""

        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });



    return (
        <Dialog open={open} fullWidth maxWidth="sm" disableScrollLock>
            <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h6" fontWeight="600"> Book a room</Typography>
                <IconButton sx={{ ml: "auto" }} onClick={() => setOpen(false)}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form style={{ width: "100%" }}>
                    <FormControl sx={{ width: "100%" }}>
                        <FormLabel sx={{ pb: "0.25rem" }}>Select room type</FormLabel>
                        <Autocomplete
                            options={unitTypes?.data}
                            getOptionLabel={(option: any) => option.name}
                            renderInput={(params) => <TextField {...params} />}
                            onChange={async (event, value) => {
                                console.log(value)
                                setValue("unitType", value)

                                try {
                                    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/unit/unitType?id=${value._id}`, {
                                        headers: {
                                            // Authorization: `Bearer ${session.data.accessToken}`,
                                            Accept: "application/json",
                                        },
                                        method: "GET"
                                    });

                                    const res = await response.json();
                                    console.log("UNITS", res.data)
                                    setUnits(res.data)
                                    setLoadingUnits(false)
                                } catch (error) {
                                    setLoadingUnits(false)
                                    alert("Fetch units error")
                                }
                            }}
                        />
                    </FormControl>

                    <CircularProgress sx={{ display: loadingUnits ? "flex" : "none", mx: "auto" }} />


                    <Box display={loadingUnits ? "none" : "flex"} flexDirection="column" gap="0.5rem">
                        <Typography display={watch("unitType") ? "flex" : "none"}>Rooms Available</Typography>
                        <Collapse in={units?.length > 0}>
                            <Box display="flex" flexDirection="column" gap="0.5rem">
                                {
                                    units?.map((item: any, i: any) => {
                                        return (
                                            <Box
                                                key={i}
                                                width="100%"
                                                display="flex"
                                                flexDirection="row"
                                                alignItems="center"
                                                gap="1rem"
                                                padding="0.75rem"
                                                border="1px solid"
                                                borderColor={watch("unit")?._id === item._id ? "primary.main" : "lightgrey"}
                                                bgcolor={watch("unit")?._id === item._id ? "primary.light" : "transparent"}
                                                borderRadius="0.5rem"
                                                sx={{ cursor: "pointer" }}
                                                onClick={async () => {
                                                    // await setError("unit", null)
                                                    // setSelectedUnit(item)
                                                    setValue("unit", item)
                                                }}
                                            >
                                                <Avatar sx={{ width: "3.5rem", height: "3.5rem" }} />
                                                <Box display="flex" flexDirection="column" gap="0.25rem">
                                                    <Typography fontWeight="600" color="grey">{item.name}</Typography>
                                                    <Chip
                                                        size="small"
                                                        label={item?.status}
                                                        color={item?.status === "AVAILABLE" ? "primary" : "error"}
                                                        variant={"outlined"}
                                                        sx={{
                                                            fontWeight: "600",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    />
                                                </Box>

                                                <Box display={watch("unit")?._id === item._id ? "flex" : "none"} ml="auto" width="1.5rem" height="1.5rem" color="primary.main">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" style={{ color: "inherit" }}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </Box>

                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                        </Collapse>

                        <FormControl sx={{ width: "100%" }}>
                            <FormLabel>Select additional features for your booking</FormLabel>
                            <Autocomplete
                                // {...register("features")}
                                multiple
                                options={features?.data || []}
                                getOptionLabel={(option: any) => `${option.feature.name} - ${currencyFormatter(option.price, "UGX")}`}
                                onChange={(event, value: any) => {
                                    // setSelectedUnit(null)
                                    if (value?.length < 1) {
                                        return setValue("additionalFeatures", [{ _id: "", feature: [{ _id: "", name: "" }] }])
                                    }
                                    setValue("additionalFeatures", value)
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        placeholder=""
                                    />
                                }
                            />
                        </FormControl>

                        <Box width="100%" display="grid" gridTemplateColumns={"1fr 1fr"} gap="1rem">
                            <FormControl sx={{ width: "100%" }}>
                                <FormLabel>When would you like to start</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        disablePast
                                        onChange={(event: any) => setValue("startDate", moment(event.$d).format("YYYY-MM-DD"))}
                                        // minDate={watch("unit")?.}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl sx={{ width: "100%" }}>
                                <FormLabel>When would you like to end</FormLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        // label="Basic date picker"
                                        disablePast
                                        onChange={(event: any) => setValue("endDate", moment(event.$d).format("YYYY-MM-DD"))}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Box>
                    </Box>

                </form>
            </DialogContent>
            <DialogActions sx={{ padding: "1.5rem" }}>
                <Button variant="contained">Continue</Button>
            </DialogActions>
        </Dialog>
    )
}