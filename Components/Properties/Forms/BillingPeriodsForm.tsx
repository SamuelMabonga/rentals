import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, IconButton, Input, LinearProgress, TextField, Typography } from "@mui/material";
import FileInput from "Components/FileInput";
import { CollectionsContext } from "context/context";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const formSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export default function BillingPeriodsForm() {
  // CONTEXT
  const {
    openBillingPeriodsForm: open,
    setOpenBillingPeriodsForm: setIsOpen,
    billingPeriodsToEdit: toEdit,
    setBillingPeriodToEdit: setToEdit,
    setSnackbarMessage,
     
  }: any = useContext(CollectionsContext);
  const { setOpenBillingPeriodsForm,collections, setCollections, setBillingPeriodToDelete }: any = useContext(CollectionsContext)

  const session: any = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const { handleSubmit, register, setValue, reset, formState: { errors } }: any = useForm({
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
    } else {
      reset({ name: "" });
    }
  }, [toEdit]);

  async function onSubmit(values: any) {
    setIsLoading(true);

    const data = {
      name: values.name,
    };

    // EDIT A PROPERTY
    if (toEdit?._id) {
      const edited = {
        ...toEdit,
        name: values.name,
      };

      try {
        const res = await fetch(`/api/billingPeriods?id=${toEdit._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.data.accessToken}`,
          },
          body: JSON.stringify({ ...edited })
        });
        const response = await res.json();
        console.log(response);
        setIsLoading(false);
        setIsOpen(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
    // POST A PROPERTY
    else {
      try {
        const res = await fetch('/api/billingPeriods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.data.accessToken}`,
          },
          body: JSON.stringify({ ...data })
        });
        const response = await res.json();
        console.log(response);
        setIsLoading(false);
        setIsOpen(false);
        setSnackbarMessage({
          open: true,
          vertical: 'top',
          horizontal: 'center',
          message: "Billing period created successfully",
          icon: (
            <Box width="1.5rem" height="1.5rem" color="lightgreen">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: "inherit" }} className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Box>
          )
        });
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  }

  const handleDeleteConfirmationOpen = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    reset(); // Reset the form values
    setDeleteConfirmationOpen(false);
    setOpenBillingPeriodsForm(false); // Close the form dialog
  };


  const handleDelete = async () => {
    try {
      if (!setBillingPeriodToDelete) {
        console.error("Invalid billing period to delete");
        return;
      }

      const { id } = setBillingPeriodToDelete;
      const accessToken = session.data.accessToken; // Assuming the access token is stored in the session object

      if (!accessToken) {
        console.error("Access token is undefined");
        return;
      }

      const response = await fetch(
        `${process.env.HOST}/api/billingPeriods?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        // Update the collections state by removing the deleted billing period
        setCollections((prevCollections: any[]) =>
          prevCollections.filter((billingPeriod) => billingPeriod._id !== id)
        );
 } else {
    // alert(`Failed to delete ${value}`)       
     console.error("Failed to delete billing period");
      }
    } catch (error) {
      console.error(error);
    }

    setOpenBillingPeriodsForm(false);
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>{toEdit?._id ? "Edit Billing Period" : "Delete Billing Period"}</DialogTitle>
        <DialogContent>
          {toEdit?._id ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel>Name</FormLabel>
                <Input {...register("name")} />
                {errors.name && (
                  <FormHelperText error>{errors.name.message}</FormHelperText>
                )}
              </FormControl>
              <Button type="submit" color="primary" variant="contained">
                {isLoading ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </form>
          ) : (
            <Typography>Are you sure you want to delete this billing period?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {toEdit?._id ? (
            <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
          ) : (
            <>
              <Button onClick={handleDeleteConfirmationClose}>No</Button>
              <Button onClick={handleDelete} color="primary">Yes</Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      {/* Rest of the code */}
    </>
  );
}
