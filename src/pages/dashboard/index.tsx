import { Box, Typography } from "@mui/material"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React from "react"

export default function Dashboard() {
    const router = useRouter()
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
          // The user is not authenticated, handle it here.
            router.push("/login")
        },
      })

    console.log(status)
    return (
        <Box width="100vw" minHeight="100vh">
            <Typography>Dashboard</Typography>
            <button onClick={() => signOut()}>logout</button>
        </Box>
    )
}

Dashboard.auth = true