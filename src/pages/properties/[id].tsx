import { Avatar, Box, Button, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material"
import DashboardLayout from "Components/Dashboard/DashboardLayout"
import React, { useState } from "react"
import Image from "next/image"
import { PropertiesTable } from "Components/Properties/PropertiesTable"
import { ArrowCircleRight } from "@mui/icons-material"

const data = [
    {
        image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
        name: "string",
        status: "string",
        tenants: "string",
        dateCreated: "string",
    },
    {
        image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
        name: "string",
        status: "string",
        tenants: "string",
        dateCreated: "string",
    },
    {
        image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
        name: "string",
        status: "string",
        tenants: "string",
        dateCreated: "string",
    },
    {
        image: "https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681733894/dwiej6vmaimacevrlx7w.png",
        name: "string",
        status: "string",
        tenants: "string",
        dateCreated: "string",
    }
]

function Detail() {
    return (
        <Box display="flex" alignItems="center" color="black" flexDirection="row" gap="0.5rem" border="1px solid red">
            <Box width="1.5rem" height="1.5rem">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
            </Box>
            <Typography lineHeight={"100%"}>
                Wandegeya
            </Typography>
        </Box>
    )
}

export default function Property() {
    const [activeTab, setActiveTab] = useState("units")
    return (
        <DashboardLayout>
            <Box
                width="100%"
                position="relative"
                // border="1px solid blue"
                sx={{
                    letterSpacing: 0,
                    wordSpacing: 0,
                    fontSize: 0,

                }}
            >
                <Image
                    src="https://res.cloudinary.com/dfmoqlbyl/image/upload/v1681629067/ufb0rk1wiykyrns9r4gr.jpg"
                    alt=""
                    width={0}
                    height={0}
                    layout="responsive"
                    style={{
                        borderRadius: "1rem"
                    }}
                />

                <Box position="absolute" display="flex" border="1px solid red" height="0" alignItems="center" ml={["1rem", "4rem"]}>
                    <Avatar
                        alt=""
                        sx={{
                            width: ["4rem", "8rem"],
                            height: ["4rem", "8rem"]
                        }}
                    />
                </Box>
            </Box>

            <Box width="100%" mt={["1.5rem", "4rem"]} display="flex" flexDirection="column" gap="1rem">
                <Typography fontSize="1.5rem" fontWeight="600" color="black">Polo Apartments</Typography>
                <Box display="flex" flexDirection="row" flexWrap="wrap" gap="0.5rem 1rem">
                    <Detail />
                    <Detail />
                    <Detail />
                    <Detail />
                </Box>
                <Typography color="black">
                    This cabin comes with Smart Home System and beautiful viking style. You can see sunrise in the morning with City View from full Glass Window.
                    This unit is surrounded by business district of West Surabaya that offers you the city life as well as wide range of culinary.
                    This apartment equipped with Washing Machine, Electric Stove, Microwave, Refrigerator, Cutlery.
                </Typography>
                <Button variant="contained">View full profile</Button>
            </Box>


            <Box width="100%" overflow="hidden" display="flex" flexDirection="column" gap="1rem">
                <Typography fontWeight={"600"} color="black" fontSize="1.25rem">Management</Typography>
                <Tabs
                    scrollButtons={true}
                    variant="scrollable"
                    value={activeTab}
                    onChange={(event, value) => setActiveTab(value)}
                >
                    <Tab label="Units" value="units" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Tenants" value="tenants" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Bookings" value="bookings" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Staff" value="staff" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Unit Types" value="untiTypes" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Features" value="features" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                    <Tab label="Tickets" value="tickets" sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }} />
                </Tabs>
                <Box width="100%" display="flex" flexWrap="wrap" gap="1rem">
                    <TextField
                        name="search"
                        placeholder="Search"
                        size="small"
                        sx={{
                            width: ["100%", "20rem"]
                        }}
                    />
                    <Button variant="contained" sx={{ ml: ["auto"] }}>Create New</Button>
                </Box>
                <PropertiesTable data={data} />
            </Box>
        </DashboardLayout>
    )
}