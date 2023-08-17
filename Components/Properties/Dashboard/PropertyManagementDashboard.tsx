import { Box, Typography } from "@mui/material";
import OccupancyRate from "../Charts/OccupancyRate";
import RentalPerformanceCard from "./RentalPerformanceCard";
import BookingsCard from "./BookingsCard";
import TicketsCard from "./TicketsCard";
import TenantsCard from "./TenantsCard";
import StaffCard from "./StaffCard";
import ExtensionCard from "./ExtensionCard";
import TenancyModificationCard from "./TenancyModificationCard";
import { useQuery } from "@tanstack/react-query";
import fetchAProperty from "apis/fetchAProperty";

export default function PropertyManagementDashboard({ property }: any) {
    const { data }: any = useQuery({ queryKey: ['property', property], queryFn: () => fetchAProperty(property) })
    return (
        <Box width="100%" display="flex" flexDirection="column" gap="1.5rem" mt="2rem">
            <Box display="flex" flexDirection="column" gap="0.5rem">
                <Typography variant="h4" color="primary" fontWeight="600" lineHeight={"100%"}>{data?.data?.name}</Typography>
                <Typography fontWeight="600" color="gray">Here is your management overview.</Typography>
            </Box>
            
            <Box display="grid" gridTemplateColumns={["1fr", "1fr 1fr"]} gap="1rem">
                <OccupancyRate property={property} />
                <RentalPerformanceCard property={property} />
                <BookingsCard property={property} />
                <TicketsCard property={property} />
                <TenantsCard property={property} />
                <StaffCard property={property} />
                <ExtensionCard property={property} />
                <TenancyModificationCard property={property} />
            </Box>
        </Box>
    )
}