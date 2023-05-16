import { Box, Button, TextField, Typography } from "@mui/material"
import DashboardLayout from "Components/Dashboard/DashboardLayout"
import { PropertiesTable } from "Components/Properties/PropertiesTable"
import React from "react"

const dummyData: any = () => {
    const items = [];
    for (let i = 0; i < 10; i++) {
      items.push({
        id: i,
        name: `Item ${i}`,
        price: 100,
        quantity: 1,
      });
    }
    return items;
   }

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

export default function Index() {
    return (
        <DashboardLayout>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">My Properties</Typography>
            <Box width="100%" display="flex">
                <TextField
                    name="search"
                    placeholder="Search"
                    size="small"
                    sx={{
                        width: "20rem"
                    }}
                />
                <Button variant="contained" sx={{ml: "auto"}}>Create New</Button>
            </Box>
            <PropertiesTable data={data} />
        </DashboardLayout>
    )
}