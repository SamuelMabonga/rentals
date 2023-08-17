import { Box, Card, Typography } from "@mui/material";

export default function DetailsCard({ subtitle, label, value, icon }: any) {
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
            {icon}
          </Box>
          <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
            Your <br />
            <span style={{ fontWeight: "600", fontSize: "1rem" }}>
              {label}
            </span>
          </Typography>
        </Box>
  
        <Box>
          <Typography color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"}>
            {value}
          </Typography>
          <Typography color="grey" fontWeight={"500"} lineHeight={"100%"} textAlign={"right"} fontSize={"0.875rem"}>
            {subtitle}
          </Typography>
        </Box>
      </Card>
    )
  }