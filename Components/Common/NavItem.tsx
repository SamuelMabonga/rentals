import react from "react"
import { Box, Button, Typography } from "@mui/material"
import { useRouter } from "next/router"

export default function NavItem({ label, to, svg, hidden = false }: any) {
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
            onClick={() => router.push(to)}
            sx={{
                fontWeight: "500",
                borderRadius: "0.5rem",
                border: active ? "1px solid primary.main" : "1px solid white",
                color: active ? "primary.main" : "gray",
                backgroundColor: active ? "primary.light" : "none",
                width: "100%",
                display: show ? "none" : "flex",
                gap: "0.5rem",
                p: "1rem",
                justifyContent: ["flex-start"]
            }}
        >
            <Box width="1.5rem" height="1.5rem" mx={["auto", "auto", 0]}>
                {svg}
            </Box>
            <Typography display={["none", "none", "flex"]} fontWeight={active ? "600" : "300"}>{label}</Typography>
        </Button>
    )
}