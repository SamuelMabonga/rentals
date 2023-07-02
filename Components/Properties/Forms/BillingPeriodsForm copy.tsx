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

setOpenBillingPeriodsFormDelete(false);}

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
        </DialogActions>
    </Dialog>
</>
    )
}

function setCollections(arg0: (prevCollections: any[]) => any[]) {
    throw new Error("Function not implemented.");
}

