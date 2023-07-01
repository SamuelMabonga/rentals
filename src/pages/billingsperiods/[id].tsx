import { Box, Button, Card, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useContext } from "react";
import { CollectionsContext } from "context/context";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession, useSession } from "next-auth/react";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import moment from "moment";
import fetchBills from "apis/tenant/fetchBills";
import { BillsTable } from "Components/Tenants/BillsTable";
import { PaymentsTable } from "Components/Properties/PaymentsTable";
import PaymentsForm from "Components/Properties/Forms/PaymentsForm";
import RequestExtension from "Components/Tenants/Forms/RequestExtension";
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import fetchBillingPeriods from "apis/fetchBillingPeriods";
import BillingPeriodsForm from "Components/Properties/Forms/BillingPeriodsForm";

type PageProps = {};

function DetailsCard() {
  return (
    <Card
      sx={{
        width: "100%",
        bgcolor: "white",
        color: "secondary",
        padding: "1rem",
        borderRadius: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box display="flex" gap="0.5rem">
        <Box width="2rem" height="2rem" color="grey">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Box>
        <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
          Your
          <br />
          <span style={{ fontWeight: "600", fontSize: "1.125rem" }}>
            Stay Duration
          </span>
        </Typography>
      </Box>
      <Typography
        color="black"
        fontWeight={"600"}
        fontSize="1.5rem"
        textAlign={"right"}
      >
        200/600 Days
      </Typography>
    </Card>
  );
}
// FLUTTERWAVE CONFIG
const config: any = {
  public_key: process.env.NEXT_PUBLIC_FW_PUBLIC_KEY,
  tx_ref: moment(),
  amount: 100,
  currency: "UGX",
  payment_options: "card,mobilemoney,ussd",
  customer: {
    email: "samuel@gmail.com",
    phone_number: "070********",
    name: `Mabonga Samuel`,
  },
  customizations: {
    title: "Rent It",
    description: "Payment for your bills",
    logo:
      "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
  },
};

function TableSwitch({ activeTab, tenant, openFlutterwave }: any) {
  switch (activeTab) {
    case "bills":
      return <BillsTable tenant={tenant} openFlutterwave={openFlutterwave} />;

    case "payments":
      return <PaymentsTable />;

    case "messages":
      return <BillingPeriodsForm />

    case "tickets":
      // return <StaffTable />

    default:
      return <></>;
  }
}
export default
 function BillingPeriods
 ({
  //  data 
  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    activeRentalTab: activeTab,
    setActiveRentalTab: setActiveTab,
    setShowUnitTypeForm,
    setOpenPaymentForm,
    setOpenFeaturesForm,
    setOpenBillingPeriodsForm,
    setOpenPropertyFeaturesForm,
    setOpenUnitForm,
    setOpenBookingForm,
    paymentConfig,
  }: any = useContext(CollectionsContext);

  // SESSION
  const { status, data: session }: any = useSession();

  const token = session?.accessToken;

  const router = useRouter();
  const { id }: any = router.query;

  const { data }: any = useQuery({
    queryKey: ["billingsperiods", id, token],
    queryFn: () => fetchBills(token, id),
  });

  const { unit, _id } = data?.data || {};

  const handleFlutterPayment = useFlutterwave(paymentConfig);

  function openFlutterwave() {
    handleFlutterPayment({
      callback: (response: any) => {
        console.log(response);
        closePaymentModal(); // this will close the modal programmatically
      },
      onClose: () => {},
    });
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection={["column", "row"]}
        gap="1rem"
        width="100%"
        justifyContent="space-between"
      >
   <Box>
  <Typography
    fontSize="1.5rem"
    fontWeight="600"
    color="primary.dark"
  >
    {`${unit?.name ?? ''}`}
  </Typography>
  <Typography fontWeight="600" color="grey">
    {`${unit?.property?.name ?? ''}`}
  </Typography>
</Box>


        <Box
          display="flex"
          flexDirection={["column", "row"]}
          gap="1rem"
        >
          <Button
            variant="contained"
            sx={{ height: "fit-content", padding: "1rem" }}
          >
            Renew your tenancy
          </Button>
          <Button
            variant="outlined"
            sx={{ height: "fit-content", padding: "1rem" }}
            color="error"
          >
            Terminate tenancy
          </Button>
        </Box>
      </Box>

      {/* <Box
        width="100%"
        display="grid"
        gridTemplateColumns={["1fr", "1fr 1fr"]}
        gap="1rem"
      >
        <DetailsCard />
        <DetailsCard />
        <DetailsCard />
        <DetailsCard />
      </Box> */}

      <Box
        mt="2rem"
        width="100%"
        height="fit-content"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        gap="1rem"
      >
        <Tabs
          variant="scrollable"
          value={activeTab}
          onChange={(event, value) => setActiveTab(value)}
        >
          <Tab
            label="Bills"
            value="bills"
            sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }}
          />
          <Tab
            label="Payments"
            value="payments"
            sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }}
          />
          <Tab
            label="Tickets"
            value="tickets"
            sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }}
          />
          <Tab
            label="Messages"
            value="messages"
            sx={{ textTransform: "capitalize", fontFamily: "Satoshi", fontWeight: "600" }}
          />
        </Tabs>
        <Box width="100%" display="flex" flexWrap="wrap" gap="1rem">
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
            sx={{ ml: ["auto"] }}
            onClick={() => {
              if (activeTab === "bills") {
                return setOpenPaymentForm(true);
              }

              if (activeTab === "payments") {
                return setOpenUnitForm(true);
              }

              if (activeTab === "messages") {
                return setShowUnitTypeForm(true);
              }

              if (activeTab === "tickets") {
                return setShowUnitTypeForm(true);
              }
            }}
          >
            Create New
          </Button>
        </Box>
        <TableSwitch
          activeTab={activeTab}
          tenant={_id}
          openFlutterwave={openFlutterwave}
        />
      </Box>
      <PaymentsForm tenant={id} />
      <RequestExtension tenant={id} />
    </>
  );
}

BillingPeriods.auth = true;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const session: any = await getSession({ req: context.req });

  const { query }: any = context;
  const { id } = query;

  if (!session) {
    return {
      redirect: {
        destination: "/login", // Redirect to the login page if user is not authenticated
        permanent: false,
      },
    };
  }
  // Retrieve the access token from the session
  const accessToken = session?.accessToken;
  // REACT QUERY
  const queryClient = new QueryClient();
  await Promise.all([
    await queryClient.prefetchQuery(
      ["biillingsperiods", id],
      () => fetchBillingPeriods(accessToken,
        //  id
         )
    ),
    // await queryClient.prefetchQuery(['tenant-bills', id], () => fetchBills(accessToken, id)),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};