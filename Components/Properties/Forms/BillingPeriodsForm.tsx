import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
} from '@mui/material';
import axios from 'axios';
import { CollectionsContext } from 'context/context';
import { useSession } from 'next-auth/react';

const formSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

export default function BillingPeriodsForm() {
  const {
    openBillingPeriodsForm: open,
    setOpenBillingPeriodsForm: setIsOpen,
    setSnackbarMessage,
    setCollections,
    setBillingPeriodToDelete,
  } = useContext(CollectionsContext);
  const { data: session } = useSession();

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
    setValue('name', ''); // Reset the form value for name
  }, [setValue]);

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
      const accessToken = session?.accessToken;

      if (!accessToken) {
        console.error('Access token is undefined');
        return;
      }

      try {
        // Send a DELETE request to delete the billing period by ID
        await axios.delete(`${process.env.HOST}/apis/billingperiods/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
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
        <DialogTitle>Delete Billing Period</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this billing period?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose}>No</Button>
          <Button onClick={handleDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
