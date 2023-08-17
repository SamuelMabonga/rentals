import { Box, Button, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import fetchARental from "apis/tenant/fetchARental"
import { CollectionsContext } from "context/context"
import moment from "moment"
import { useRouter } from "next/router"
import { useContext } from "react"
import DetailsCard from "./Atoms/DetailsCard"
import RequestTenancyExtension from "Components/Tenants/Forms/RequestTenancyExtension"


export default function TenantDashboard() {
    const {
      setOpenRequestTenancyExtension
    }: any = useContext(CollectionsContext)
  
    const router = useRouter()
  
    const tenantId: any = router.query.tenant
  
    const { data }: any = useQuery({ queryKey: ['tenancy', tenantId], queryFn: () => fetchARental(tenantId) })
  
    console.log("DATA ==>", data)
  
    const {
      startDate,
      endDate,
      status,
      unit
    } = data?.data || {}
  
    const unitName = unit?.name
    const propertyName = unit?.property?.name
  
    return (
      <Box width="100%" gap="1rem" display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column" gap="0.25rem">
          <Typography color="black" fontWeight={"600"} fontSize="1.5rem" lineHeight={"130%"}>{unitName}</Typography>
          <Typography color="grey" fontWeight={"500"} lineHeight={"130%"}>{propertyName}</Typography>
        </Box>
        <Box width="100%" display="grid" gridTemplateColumns={["1fr", "1fr 1fr",]} gap="1rem">
          <DetailsCard
            label="Entry Date"
            value={moment(startDate).format("DD MMM YYYY")}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DetailsCard
            label="Exit Date"
            value={moment(endDate).format("DD MMM YYYY")}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DetailsCard
            label="Tenancy length"
            value={`${moment(endDate).diff(moment(startDate), "days")} days`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DetailsCard
            label="Days Remaining"
            value={`${moment(endDate).diff(moment(), "days")} days`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DetailsCard
            label="Bills"
            value={`${moment(endDate).diff(moment(), "days")} days`}
            subtitle="Due in 5 days"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </Box>
  
        <Box display={status === "ACTIVE" ? "flex" : ["none"]} flexDirection={["column", "row"]} sx={{ mt: "1.5rem" }} gap="1rem">
          <Button
            variant="outlined"
            sx={{
              height: "fit-content",
              padding: "1rem",
              borderRadius: "0.5rem",
              width: ["100%", "fit-content"],
              ml: "auto"
            }}
            color="error"
            onClick={() => setOpenRequestTenancyExtension(true)}
          >
            Terminate tenancy
          </Button>
          <Button
            variant="contained"
            sx={{ height: "fit-content", padding: "1rem", borderRadius: "0.5rem", width: ["100%", "fit-content"], }}
            onClick={() => setOpenRequestTenancyExtension(true)}
          >
            Renew your tenancy
          </Button>
        </Box>
  
        <Box display={status === "PENDING" ? "flex" : ["none"]} flexDirection={["column",]} sx={{ mt: "1.5rem" }} gap="1rem">
          <Typography fontWeight="600" color="grey">Clear all your initial bills to activate your tenancy</Typography>
          <Button
            variant="contained"
            sx={{ height: "fit-content", padding: "1rem", borderRadius: "0.5rem", width: ["100%", "fit-content"], }}
          // onClick={() => setOpenRenewalForm(true)}
          >
            Pay Bills
          </Button>
        </Box>

        {/* REQUEST TENANCY MODIFICATION */}
        <RequestTenancyExtension tenant={data?.data} />
      </Box>
    )
  }