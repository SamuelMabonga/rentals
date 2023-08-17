import { Box, Card, Typography } from "@mui/material"
import React, { useEffect } from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts"
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined';
import { useQuery } from "@tanstack/react-query";
import fetchOccupancy from "apis/property/fetchOccupancy";
import DonutPieChart from "../Dashboard/Atoms/PieChart";

export default function OccupancyRate({
    property
}: any) {
    const { data: res }: any = useQuery({ queryKey: ['property-occupancy', property], queryFn: () => fetchOccupancy(property) })
    const {
        activeTenants,
        unitCount,
    } = res?.data || {}

    const [chartData, setChartData] = React.useState<any[]>([])

    useEffect(() => {
        if (res?.data) {
            const { availableUnits, occupiedUnits } = res?.data || {}
            const data = [
                { x: 'Occupied', y: availableUnits, text: 'Occupied', fill: '#00226C' },
                { x: 'Available', y: occupiedUnits, text: 'Available', fill: '#0450C2' },
            ]
            setChartData(data)
        }
    }, [res])

    return (
        <Card
            sx={{
                width: "100%",
                height: "fit-content",
                bgcolor: "white",
                color: "secondary",
                padding: "1rem",
                borderRadius: "1rem",
                display: "flex",
                flexDirection: "column",
                // gap: "1rem",
                boxShadow: "0px 4px 20px rgba(211, 205, 218, 0.25)",
                border: "1px solid rgba(211, 205, 218, 0.7)",
            }}
        >
            <Box display="flex" gap="0.5rem">
                {/* <Box width="2rem" height="2rem" color="grey">
                    <HolidayVillageOutlinedIcon />
                </Box> */}
                <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
                    Your <br />
                    <span style={{ fontWeight: "600", fontSize: "1rem" }}>
                        Occupancy Rate
                    </span>
                </Typography>
                <Typography ml="auto" color="primary" fontWeight={"600"} fontSize="1.75rem" textAlign={"right"} letterSpacing={-1}>
                    {unitCount} <span style={{ color: "gray", fontSize: "1rem" }}>Units</span>
                </Typography>
            </Box>

            <DonutPieChart data={chartData} />
        </Card>
    )
}
