import { Box, Button, TextField, Typography } from "@mui/material"
import DashboardLayout from "Components/Dashboard/DashboardLayout"
import { PropertiesTable } from "Components/Properties/PropertiesTable"
import PropertyForm from "Components/Properties/Forms/PropertyForm"
import React, { useState } from "react"

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
    const [openCreateForm, setOpenCreateForm] = useState(false)
    return (
        <DashboardLayout>
            <Typography color="black" fontSize="1.5rem" fontWeight="600">My Properties</Typography>
            <Box width="100%" display={"flex"} flexDirection={["column", "row"]} gap="1rem">
                <TextField
                    name="search"
                    placeholder="Search"
                    size="small"
                    sx={{
                        width: ["100%", "20rem"]
                    }}
                />
                <Button variant="contained" sx={{ml: "auto"}} onClick={() => setOpenCreateForm(true)}>Create New</Button>
            </Box>
            <PropertiesTable data={data} />
            <PropertyForm open={openCreateForm} setIsOpen={setOpenCreateForm} />
        </DashboardLayout>
    )
}