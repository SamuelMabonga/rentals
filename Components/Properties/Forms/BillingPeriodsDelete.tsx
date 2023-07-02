import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material";
import FileInput from "Components/FileInput";
import { CollectionsContext } from "context/context";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const formSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
});

export default function BillingPeriodsFormDelete() {
    // CONTEXT
    const {
        setBillingPeriodToDelete: open,
        setsetBillingPeriodToDelete: setIsOpen,
        billingPeriodsToEdit: toEdit,
        setSnackbarMessage
    }: any = useContext(CollectionsContext);
    const { setBillingPeriodToDelete,setOpenBillingPeriodsFormDelete }: any = useContext(CollectionsContext)

    const session: any = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const { setValue, reset }: any = useForm({
        defaultValues: {
            name: "",
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: yupResolver(formSchema),
    });

    useEffect(() => {
        if (toEdit?.name) {
            setValue("name", toEdit.name);
            return;
        }

        reset();
    }, [toEdit]);


    const handleDeleteConfirmationOpen = () => {
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirmationClose = () => {
        setDeleteConfirmationOpen(false);
    };

 //DELETE PROPERTY
    const handleDelete = async () => {
        try {
          if (!setBillingPeriodToDelete) {
            console.error("Invalid billing period to delete");
            return;
          }
    
          const { id } = setBillingPeriodToDelete;
          const accessToken = session.accessToken;
    
          if (!accessToken) {
            console.error("Access token is undefined");
            return;
          }
    
          const response = await fetch(
            `${process.env.HOST}/api/billingPeriods?id=${id}`,
            {
              method: "DELETE",
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.data.accessToken}`,
            },
            }
          );
    
          if (response.ok) {
            setCollections((prevCollections: any[]) =>
                  prevCollections.filter((billingPeriod) => billingPeriod.id !== id)
                );
              } else {
                console.error("Failed to delete billing period");
              }
            } catch (error) {
              console.error(error);
            }
          
            setOpenBillingPeriodsFormDelete(false);
          };

    return (
        <>
            <Dialog open={open}
                onClose={handleDeleteConfirmationClose}>
                <DialogTitle>Delete Billing Period</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this billing period?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
                    <Button onClick={handleDelete} color="primary">Delete</Button>
                    <IconButton
                        onClick={handleDeleteConfirmationOpen}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                        <Box width="1.5rem" height="1.5rem">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                        </Box>
                    </IconButton>
                </DialogActions>
            </Dialog>
           
        </>
    );
}
function setCollections(arg0: (prevCollections: any[]) => any[]) {
    throw new Error("Function not implemented.");
}

