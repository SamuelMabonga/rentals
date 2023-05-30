import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { CollectionsContext } from 'context/context';
import { Typography } from '@mui/material';

export interface State extends SnackbarOrigin {
    open: boolean;
}

export default function RegularSnackbar() {
    // CONTEXT
    const { snackbarMessage: state, setSnackbarMessage: setState }: any = React.useContext(CollectionsContext)

    //   const [state, setState] = React.useState<State>({
    //     open: false,
    //     vertical: 'top',
    //     horizontal: 'center',
    //   });

    const { vertical, horizontal, open, message, icon } = state;

    const handleClick = (newState: SnackbarOrigin) => () => {
        setState({ open: true, ...newState });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const buttons = (
        <React.Fragment>
            <Button
                onClick={handleClick({
                    vertical: 'top',
                    horizontal: 'center',
                })}
            >
                Top-Center
            </Button>
            <Button
                onClick={handleClick({
                    vertical: 'top',
                    horizontal: 'right',
                })}
            >
                Top-Right
            </Button>
            <Button
                onClick={handleClick({
                    vertical: 'bottom',
                    horizontal: 'right',
                })}
            >
                Bottom-Right
            </Button>
            <Button
                onClick={handleClick({
                    vertical: 'bottom',
                    horizontal: 'center',
                })}
            >
                Bottom-Center
            </Button>
            <Button
                onClick={handleClick({
                    vertical: 'bottom',
                    horizontal: 'left',
                })}
            >
                Bottom-Left
            </Button>
            <Button
                onClick={handleClick({
                    vertical: 'top',
                    horizontal: 'left',
                })}
            >
                Top-Left
            </Button>
        </React.Fragment>
    );

    return (
        <div>
            {/* {buttons} */}
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={6000}
                open={open}
                onClose={handleClose}
                message={<Typography display="flex" alignItems={"center"} gap="0.5rem">{icon} {message}</Typography>}
                key={vertical + horizontal}
            />
        </div>
    );
}