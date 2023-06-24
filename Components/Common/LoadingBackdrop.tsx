import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { CollectionsContext } from 'context/context';
import { useContext } from 'react';

export default function LoadingBackdrop() {

    const {
        openLoadingBackdrop: open,
        setOpenLoadingBackdrop: setOpen
    }: any = useContext(CollectionsContext)

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            // onClick={handleClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}