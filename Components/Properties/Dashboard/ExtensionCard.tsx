import { Box, Card, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import fetchExtensionStatistics from "apis/property/fetchExtensionStatistics"
import React, { useEffect } from "react"
import DonutPieChart from "./Atoms/PieChart"


export default function ExtensionCard({ property }: any) {
    const { data }: any = useQuery({ queryKey: ['property-extension-statistics', property], queryFn: () => fetchExtensionStatistics(property) })

    const [chartData, setChartData] = React.useState<any[]>([])

    useEffect(() => {
      if (data?.data) {
        const { 
          totalExtensions,
          totalExtensionsPending,
          totalExtensionsAccepted,
          totalExtensionsRejected
         } : any = data?.data || {}
        const obj = [
          { x: 'Accepted', y: totalExtensionsAccepted, text: 'Accepted', fill: '#00226C' },
          { x: 'Pending', y: totalExtensionsPending, text: 'Pending', fill: '#0450C2' },
          { x: 'Rejected', y: totalExtensionsRejected, text: 'Rejected', fill: '#0450C2' },
        ]
        setChartData(obj)
      }
    }, [])
  
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
          <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
            Your <br />
            <span style={{ fontWeight: "600", fontSize: "1rem" }}>
              Bill Extension Management
            </span>
          </Typography>
          <Typography ml="auto" color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
            {data?.data?.totalExtensions} <span style={{ color: "gray", fontSize: "1rem" }}> Extensions</span>
          </Typography>
        </Box>

        <DonutPieChart data={chartData} id="extensions" />
      </Card>
    )
  }