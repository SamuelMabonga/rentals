import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, Typography } from "@mui/material";

export default function BookingForm() {
    return (
        <Dialog open={true} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h6" fontWeight="600"> Book a room</Typography>
                <IconButton sx={{ ml: "auto" }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form>
                    <FormControl>
                        <FormLabel>Room type</FormLabel>
                    </FormControl>
                </form>
            </DialogContent>
        </Dialog>
    )
}