import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { CollectionsContext } from 'context/context';

const formSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

export default function BillingPeriodsForm() {
  // CONTEXT
  const {
    openBillingPeriodsForm: open,
    setOpenBillingPeriodsForm: setIsOpen,
    billingPeriodsToEdit: toEdit,
    setBillingPeriodToEdit: setToEdit,
    setSnackbarMessage,
    setCollections,
    setBillingPeriodToDelete,
  } = useContext(CollectionsContext);
  const session = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (toEdit?.name) {
      setValue('name', toEdit.name);
    } else {
      reset({ name: '' });
    }
  }, [toEdit]);

  // ...

  const handleDeleteConfirmationClose = () => {
    reset(); // Reset the form values
    setDeleteConfirmationOpen(false);
    setIsOpen(false); // Close the form dialog
  };

  const handleDelete = async () => {
    try {
      if (!setBillingPeriodToDelete) {
        console.error('Invalid billing period to delete');
        return;
      }

      const { id } = setBillingPeriodToDelete;
      const accessToken = session.data.accessToken;

      if (!accessToken) {
        console.error('Access token is undefined');
        return;
      }

      try {
        // Send a DELETE request to delete the billing period by ID
        await axios.delete(`${process.env.HOST}/api/billingperiods/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // Update the collections state by removing the deleted billing period
        setCollections((prevCollections: any[]) =>
          prevCollections.filter((billingPeriod) => billingPeriod.id !== id)
        );
        console.log('Billing period deleted successfully');
      } catch (error) {
        console.error('Failed to delete billing period:', error);
      }
    } catch (error) {
      console.error(error);
    }

    // setOpenBillingPeriodsForm(false);
  };

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>{toEdit?._id ? 'Edit Billing Period' : 'Delete Billing Period'}</DialogTitle>
        <DialogContent>
          {toEdit?._id ? (
            <form onSubmit={handleSubmit(onsubmit)}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel>Name</FormLabel>
                <Input {...register('name')} />
                {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
              </FormControl>
              <Button type="submit" color="primary" variant="contained">
                {isLoading ? <CircularProgress size={24} /> : 'Save'}
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
              <Button onClick={handleDelete} color="primary">
                Yes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      {/* Rest of the code */}
    </>
  );
}