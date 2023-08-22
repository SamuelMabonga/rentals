import react from "react"
import { Box, Button, Typography } from "@mui/material"
import { useRouter } from "next/router"

export default function MobileNavItem({ label, to, svg, hidden = true, setOpen }: any) {
    const router = useRouter()

    const [active, setActive] = react.useState(false)
    const [show, setShow] = react.useState(false)

    react.useEffect(() => {
        if (!to) return

        if (router.pathname.match(to.split("?")[0])) {
            setActive(true)
        } else {
            setActive(false)
        }
    }, [router.pathname])

    react.useEffect(() => {
        if (hidden) {
            setShow(false)
        } else {
            setShow(true)
        }
    }, [hidden])

    return (
        <Button
            variant={"outlined"}
            onClick={() => {
                router.push(to)
                setOpen(false)
            }}
            sx={{
                display: show ? "none" : "flex",
                fontWeight: "500",
                borderRadius: "0.5rem",
                border: active ? "1px solid primary.main" : "1px solid white",
                color: active ? "primary.main" : "gray",
                backgroundColor: active ? "primary.light" : "none",
                width: "100%",
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
            <Typography display={["flex"]} fontWeight={active ? "600" : "500"} width="100%" lineHeight="100%">{label}</Typography>
        </Button>
    )
}