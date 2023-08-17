import { Box, Card, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import fetchExtensionStatistics from "apis/property/fetchExtensionStatistics"


export default function RentalModificationCard({ property }: any) {
    const { data }: any = useQuery({ queryKey: ['property-rental-modification-statistics', property], queryFn: () => fetchExtensionStatistics(property) })
  
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
        </Box>
  
        <Box>
          <Typography color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
            {data?.data?.totalExtensionsPending} <span style={{ color: "gray", fontSize: "1rem" }}>/ {data?.data?.totalExtensions}</span>
          </Typography>
          <Typography
            fontSize="0.875rem"
            textAlign={"right"}
            fontWeight={"600"}
            color="error.main"
          >
            {data?.data?.totalExtensionsPending} pending, {data?.data?.totalExtensionsAccepted} accepted, {data?.data?.totalExtensionsRejected} rejected
          </Typography>
        </Box>
      </Card>
    )
  }