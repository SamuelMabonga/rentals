import { Box, Card, Typography } from "@mui/material"
import React from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined';

export default function OccupancyRate() {
    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    return (
        <Card
            sx={{
                width: "100%",
                bgcolor: "white",
                color: "secondary",
                padding: "1rem",
                borderRadius: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0px 4px 20px rgba(211, 205, 218, 0.25)",
                border: "1px solid rgba(211, 205, 218, 0.7)",
            }}
        >
            <Box display="flex" gap="0.5rem">
                <Box width="2rem" height="2rem" color="grey">
                    {/* {icon} */}
                    <HolidayVillageOutlinedIcon />
                </Box>
                <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
                    Your <br />
                    <span style={{ fontWeight: "600", fontSize: "1rem" }}>
                        Occupancy Rate
                    </span>
                </Typography>
            </Box>

            <Box>
                <Typography color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
                    30 <span style={{ color: "gray", fontSize: "1rem" }}>/ 40</span>
                </Typography>
                <Typography fontSize="0.875rem" textAlign={"right"} fontWeight={"600"} color="error.main" >10 vacant units</Typography>
            </Box>

            {/* <Box width="10rem" height="10rem">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ border: "1px solid blue", display: "flex", justifyContent: "center", alignItems: "center", padding: 0}}>
                    <Pie
                        data={data}
                        // cx={120}
                        // cy={200}
                        innerRadius={32}
                        // outerRadius={96}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        style={{margin: 0, padding: 0}}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            </Box> */}
        </Card>
    )
}
