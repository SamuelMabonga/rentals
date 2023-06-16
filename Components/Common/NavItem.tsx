import react from "react"
import { Box, Button, Typography } from "@mui/material"
import { useRouter } from "next/router"

export default function NavItem({ label, to, svg }: any) {
    const router = useRouter()

    return (
        <Button
            variant={"outlined"}
            onClick={() => router.push(to)}
            sx={{
                fontWeight: "500",
                borderRadius: "0.5rem",
                border: router.pathname.startsWith(to) ? "1px solid primary.main" : "1px solid white",
                color: router.pathname.startsWith(to) ? "primary.main" : "gray",
                backgroundColor: router.pathname.startsWith(to) ? "primary.light" : "none",
                width: "100%",
                display: "flex",
                gap: "0.5rem",
                p: "1rem",
                justifyContent: ["flex-start"]
            }}
        >
            <Box width="1.5rem" height="1.5rem" mx={["auto", "auto", 0]}>
                {svg}
            </Box>
            <Typography display={["none", "none", "flex"]} fontWeight={router.pathname.startsWith(to) ? "500" : "300"}>{label}</Typography>
        </Button>
    )
}