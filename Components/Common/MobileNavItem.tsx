import react from "react"
import { Box, Button, Typography } from "@mui/material"
import { useRouter } from "next/router"

export default function MobileNavItem({ label, to, svg, onClick }: any) {
    const router = useRouter()

    return (
        <Button
            variant={"outlined"}
            onClick={onClick}
            sx={{
                fontWeight: "500",
                borderRadius: "0.5rem",
                border: router.pathname.startsWith(to) ? "1px solid primary.main" : "1px solid white",
                color: router.pathname.startsWith(to) ? "primary.main" : "gray",
                backgroundColor: router.pathname.startsWith(to) ? "primary.light" : "none",
                width: "100%",
                display: "flex",
                gap: "0.5rem",
                p: "0.75rem",
                justifyContent: ["flex-start"],
                alignItems: "center",
                textAlign: "left"
            }}
        >
            <Box width="2rem" height="2rem" mx={["auto", "auto", 0]} display="flex" alignItems="center">
                {svg}
            </Box>
            <Typography display={["flex"]} fontWeight={router.pathname.startsWith(to) ? "500" : "300"} width="100%" lineHeight="100%">{label}</Typography>
        </Button>
    )
}