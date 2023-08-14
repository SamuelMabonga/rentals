import { Avatar, Box, Button, Card, IconButton, Typography } from "@mui/material"
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query"
import currencyFormatter from "Components/Common/currencyFormatter"
import OccupancyRate from "Components/Properties/Charts/OccupancyRate"
import fetchExtensions from "apis/property/FetchExtensions"
import fetchBillsStatistics from "apis/property/fetchBillsStatistics"
import fetchOccupancy from "apis/property/fetchOccupancy"
import fetchARental from "apis/tenant/fetchARental"
import { CollectionsContext } from "context/context"
import moment from "moment"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext } from "react"

type PageProps = {
  // data: any;
};

function DetailsCard({ subtitle, label, value, icon }: any) {
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

function RentalPerformanceCard({ label, value, icon, totalBills, totalPaid }: any) {
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
        {/* <Box width="2rem" height="2rem" color="grey">
                  {icon}
              </Box> */}
        <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
          Your <br />
          <span style={{ fontWeight: "600", fontSize: "1rem" }}>
            Rent Collection
          </span>
        </Typography>
      </Box>

      <Box>
        <Typography color="primary" fontWeight={"600"} fontSize="1.75rem" textAlign={"right"} letterSpacing={-1}>
          {currencyFormatter(totalPaid, "UGX")} <span style={{ color: "gray", fontSize: "1rem" }}>/ {currencyFormatter(totalBills, "UGX")}</span>
        </Typography>
        <Typography fontSize="0.875rem" textAlign={"right"} fontWeight={"600"} color="error.main" >- {currencyFormatter((totalBills - totalPaid), "UGX")}</Typography>
      </Box>

    </Card>
  )
}


function TicketsCard({ label, value, icon }: any) {
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
        {/* <Box width="2rem" height="2rem" color="grey">
                  {icon}
              </Box> */}
        <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
          Your <br />
          <span style={{ fontWeight: "600", fontSize: "1rem" }}>
            Ticket Management
          </span>
        </Typography>
      </Box>

      <Box>
        <Typography color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
          5 <span style={{ color: "gray", fontSize: "1rem" }}>/ 30</span>
        </Typography>
        <Typography fontSize="0.875rem" textAlign={"right"} fontWeight={"600"} color="error.main" >2 pending, 3 in progress</Typography>
      </Box>
    </Card>
  )
}

function BookingsCard({ label, value, icon }: any) {
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
        {/* <Box width="2rem" height="2rem" color="grey">
                  {icon}
              </Box> */}
        <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
          Your <br />
          <span style={{ fontWeight: "600", fontSize: "1rem" }}>
            Bookings
          </span>
        </Typography>
      </Box>

      <Box>
        <Typography color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
          5 <span style={{ color: "gray", fontSize: "1rem" }}>/ 40</span>
        </Typography>
        <Typography fontSize="0.875rem" textAlign={"right"} fontWeight={"600"} color="error.main" >5 Open bookings</Typography>
      </Box>
    </Card>
  )
}


function TenantDashboard() {
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
    </Box>
  )
}


export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
  const session: any = await getSession({ req: context.req });

  const tenantId: any = context.query.tenant
  const propertyId: any = context.query.property

  if (!session) {
    return {
      redirect: {
        destination: '/login', // Redirect to the login page if user is not authenticated
        permanent: false,
      },
    };
  }

  // REACT QUERY
  const queryClient = new QueryClient()

  if (tenantId) {
    await queryClient.prefetchQuery(['tenancy', tenantId], () => fetchARental(tenantId))
  } else {
    Promise.all([
      await queryClient.prefetchQuery(['property-occupancy', propertyId], () => fetchOccupancy(propertyId)),
      await queryClient.prefetchQuery(['property-bills-statistics', propertyId], () => fetchBillsStatistics(propertyId))
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};


export default function Dashboard({
  // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // router.push("/login")
    },
  })

  // const {
  //   role: {
  //     name: role
  //   }
  // } = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("role") || "{}") : null


  3
  // TENANT
  const tenant = router.query.tenant
  if (tenant) {
    return (
      <TenantDashboard />
    )
  }

  const propertyId: any = router.query.property
  const { data }: any = useQuery({ queryKey: ['property-occupancy', propertyId], queryFn: () => fetchOccupancy(propertyId) })
  const {
    activeTenants,
    unitCount
  } = data?.data || {}

  const { data: rentStats }: any = useQuery({ queryKey: ['property-bills-statistics', propertyId], queryFn: () => fetchBillsStatistics(propertyId) })
  const {
    totalBills,
    totalPaid,
  } = rentStats?.data || {}


  return (
    <>
      <Box width="100%" display="flex" flexDirection="column">

        <Box display="grid" gridTemplateColumns={["1fr", "1fr 1fr"]} gap="1rem">
          {/* <DetailsCard
                    label="Total Units"
                    value="10"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                    }
                /> */}
          <OccupancyRate activeTenants={activeTenants} unitCount={unitCount} />
          <RentalPerformanceCard
            totalBills={totalBills}
            totalPaid={totalPaid}
          />
          <BookingsCard />
          <TicketsCard />


        </Box>
      </Box>
    </>
  )
}

Dashboard.auth = true