import { Avatar, Box, Button, Card, IconButton, Typography } from "@mui/material"
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query"
import PropertyManagementDashboard from "Components/Properties/Dashboard/PropertyManagementDashboard"
import TenantDashboard from "Components/Properties/Dashboard/TenantDashboard"
import fetchBillsStatistics from "apis/property/fetchBillsStatistics"
import fetchBookingStatistics from "apis/property/fetchBookingStatistics"
import fetchExtensionStatistics from "apis/property/fetchExtensionStatistics"
import fetchOccupancy from "apis/property/fetchOccupancy"
import fetchTenancyModificationStatistics from "apis/property/fetchTenancyModificationStatistics"
import fetchTenantStatistics from "apis/property/fetchTenantStatistics"
import fetchTicketsStatistics from "apis/property/fetchTicketStatistics"
import fetchARental from "apis/tenant/fetchARental"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { useContext } from "react"

type PageProps = {
  // data: any;
};

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
      await queryClient.prefetchQuery(['property-bills-statistics', propertyId], () => fetchBillsStatistics(propertyId)),
      await queryClient.prefetchQuery(['property-ticket-statistics', propertyId], () => fetchTicketsStatistics(propertyId)),
      await queryClient.prefetchQuery(["property-booking-statistics", propertyId], () => fetchBookingStatistics(propertyId)),
      await queryClient.prefetchQuery(["property-tenant-statistics", propertyId], () => fetchTenantStatistics(propertyId)),
      await queryClient.prefetchQuery(["property-extension-statistics", propertyId], () => fetchExtensionStatistics(propertyId)),
      await queryClient.prefetchQuery(["property-tenancy-modification-statistics", propertyId], () => fetchTenancyModificationStatistics(propertyId))
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


  // PROPERTY
  const property: any = router.query.property

  // TENANT
  const tenant = router.query.tenant


  if (tenant) {
    return (
      <TenantDashboard />
    )
  } 

  if (property) {
    return (
      <PropertyManagementDashboard property={property} />
    )
  }
}

Dashboard.auth = true