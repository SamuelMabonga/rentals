import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { CollectionsContext } from 'context/context';
import { Typography } from '@mui/material';

export interface SnackbarMessage {
    message: string;
    key: number;
}

export interface State {
    open: boolean;
    snackPack: readonly SnackbarMessage[];
    messageInfo?: SnackbarMessage;
}

export default function ConsecutiveSnackbars() {
    const { snackbarMessage }: any = React.useContext(CollectionsContext)
    const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
    const [open, setOpen] = React.useState(false);
    const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(
        undefined,
    );

    React.useEffect(() => {
        if (snackPack.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

    // const handleClick = (message: string) => () => {
    //     setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    // };


    //   SET MESSAGE
    React.useEffect(() => setSnackPack((prev: any) => [...prev, { snackbarMessage, key: new Date().getTime() }]), [snackbarMessage])


    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    return (
        <div>
            <Snackbar
                // sx={{
                //     "&.MuiSnackbar-root": {
                //         bgcolor: "white"
                //     }
                // }}
                // sx={{
                //     "&.MuiSnackbarContent-root": {
                //         bgcolor: "white"
                //     }
                // }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                // color="white"
                key={messageInfo ? messageInfo.key : undefined}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                TransitionProps={{ onExited: handleExited }}
            // message={messageInfo ? messageInfo.message : undefined}
            // action={
            //     <React.Fragment>
            //         <Button color="secondary" size="small" onClick={handleClose}>
            //             UNDO
            //         </Button>
            //         <IconButton
            //             aria-label="close"
            //             color="inherit"
            //             sx={{ p: 0.5 }}
            //             onClick={handleClose}
            //         >
            //             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            //                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            //             </svg>
            //         </IconButton>
            //     </React.Fragment>
            // }
            >
                <Typography p="1rem" color="grey" bgcolor="white">
                    {messageInfo ? messageInfo.message : undefined}
                </Typography>
            </Snackbar>
        </div>
    );
}