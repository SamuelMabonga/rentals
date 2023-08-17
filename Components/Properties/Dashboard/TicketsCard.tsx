import { Box, Card, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import fetchTicketsStatistics from "apis/property/fetchTicketStatistics"
import React, { useEffect } from "react"
import DonutPieChart from "./Atoms/PieChart"



export default function TicketsCard({ property }: any) {
    const { data }: any = useQuery({ queryKey: ['property-ticket-statistics', property], queryFn: () => fetchTicketsStatistics(property) })


    const [chartData, setChartData] = React.useState<any[]>(
      [
        { x: 'Active', y: 4, text: 'Active', fill: '#00226C' },
        { x: 'Inactive', y: 7, text: 'Inactive', fill: '#0450C2' },
      ]
    )
  
    useEffect(() => {
      if (data?.data) {
        const {
          totalTickets,
          totalTicketsFixed,
          totalTicketsInProgress,
          totalTicketsPending
        } = data?.data || {}
        const obj = [
          { x: 'In Progress', y: totalTicketsInProgress, text: 'In Progress', fill: '#00226C' },
          { x: 'Pending', y: totalTicketsPending, text: 'Pending', fill: '#0450C2' },
          { x: 'Fixed', y: totalTicketsFixed, text: 'Fixed', fill: '#0450C2' },
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
              Ticket Management
            </span>
          </Typography>

          <Typography ml="auto" color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
            {data?.data?.totalTickets} <span style={{ color: "gray", fontSize: "1rem" }}> Tickets</span>
          </Typography>
        </Box>

        <DonutPieChart data={chartData} id="tickets" />
      </Card>
    )
  }