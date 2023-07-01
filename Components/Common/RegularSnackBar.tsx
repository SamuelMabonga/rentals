import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { CollectionsContext } from 'context/context';
import { Box, Typography } from '@mui/material';

export interface State extends SnackbarOrigin {
    open: boolean;
}

export default function RegularSnackbar() {
    // CONTEXT
    const { snackbarMessage: state, setSnackbarMessage: setState }: any = React.useContext(CollectionsContext)

    const { vertical, horizontal, open, message, icon } = state;

    const handleClick = (newState: SnackbarOrigin) => () => {
        setState({ open: true, ...newState });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };


    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={6000}
                open={open}
                onClose={handleClose}
                message={<Box display="flex" alignItems="center" gap="0.5rem"><Typography display="flex" alignItems={"center"} gap="0.5rem">{icon} {message}</Typography></Box>}
                key={vertical + horizontal}
            />
        </div>
    );
}