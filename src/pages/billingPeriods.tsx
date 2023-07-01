import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { BillingPeriodsTable } from "Components/Properties/BillingPeriodsTable";
import BillingPeriodsForm from "Components/Properties/Forms/BillingPeriodsForm";
import { useSession } from "next-auth/react";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import fetchBillingPeriods from "apis/fetchBillingPeriods";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

type PageProps = {};

export default function BillingPeriods({
  // data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // SESSION
  const { status, data: session } = useSession();
  const router = useRouter();

  // STATE
  const [openBillingPeriodsForm, setOpenBillingPeriodsForm] = useState(false);

  // QUERY
  const { data: billingPeriods, isLoading } = useQuery("billingPeriods", () =>
    fetchBillingPeriods(session?.accessToken)
  );

  // Handle click on a billing period
  const handleBillingPeriodClick = (billingPeriodId: string) => {
    router.push(`/billing-periods/${billingPeriodId}`);
  };

  return (
    <>
      <Typography color="black" fontSize="1.5rem" fontWeight="600">
        Billing Periods
      </Typography>
      <Box
        width="100%"
        display="flex"
        flexDirection={["column", "row"]}
        gap="1rem"
      >
        <TextField
          name="search"
          placeholder="Search"
          size="small"
          sx={{
            width: ["100%", "20rem"],
          }}
        />
        <Button
          variant="contained"
          sx={{ ml: "auto" }}
          onClick={() => setOpenBillingPeriodsForm(true)}
        >
          Create New
        </Button>
      </Box>
      <BillingPeriodsTable
        billingPeriods={billingPeriods}
        isLoading={isLoading}
        onBillingPeriodClick={handleBillingPeriodClick}
      />
      <BillingPeriodsForm
        open={openBillingPeriodsForm}
        onClose={() => setOpenBillingPeriodsForm(false)}
      />
    </>
  );
}

BillingPeriods.auth = true;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const { getSession } = await import("next-auth/react");
  const { dehydrate } = await import("@tanstack/react-query");

  const session: any = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login", // Redirect to the login page if the user is not authenticated
        permanent: false,
      },
    };
  }

  // Retrieve the access token from the session
  const accessToken = session?.accessToken;

  // REACT QUERY
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["billingPeriods"], () =>
    fetchBillingPeriods(accessToken)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
