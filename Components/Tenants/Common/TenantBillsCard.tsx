import { Box, Card, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import currencyFormatter from "Components/Common/currencyFormatter";
import fetchBillsStatistics from "apis/property/fetchBillsStatistics";
import React, { useEffect } from "react";
import { AccumulationChartComponent, AccumulationDataLabel, AccumulationDataLabelSettingsModel, AccumulationLegend, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, Inject, PieSeries } from "@syncfusion/ej2-react-charts";
import fetchTenantBillsStatistics from "apis/tenant/fetchTenantBillsStatistics";


export default function TenantBillsCard({ tenant }: any) {
  const { data: billsStats }: any = useQuery({ queryKey: ['tenant-bills-card', tenant], queryFn: () => fetchTenantBillsStatistics(tenant) })
  const {
    totalPaid,
    totalAmount,
    totalPending,
    totalOverdue

  } = billsStats?.data || {}

  const [chartData, setChartData] = React.useState<any[]>([])

  //   useEffect(() => {
  //     if (billsStats?.data) {
  //       const { availableUnits, occupiedUnits } = billsStats?.data || {}
  //       const data = [
  //         { x: 'Paid', y: totalPaid, text: 'Occupied', fill: '#00226C' },
  //         { x: 'Pending', y: totalBills - totalPaid, text: 'Available', fill: '#0450C2' },
  //       ]
  //       setChartData(data)
  //     }
  //   }, [billsStats])


  // CHART
  const datalabel: AccumulationDataLabelSettingsModel = { visible: true, position: "Inside" }
  const legendSettings = { visible: true };

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
        boxShadow: "0px 4px 20px rgba(211, 205, 218, 0.25)",
        border: "1px solid rgba(211, 205, 218, 0.7)",
      }}
    >
      <Box display="flex" gap="0.5rem">
        <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
          Tenant's<br />
          <span style={{ fontWeight: "600", fontSize: "1rem" }}>
            Bills Collection
          </span>
        </Typography>

        <Typography ml="auto" color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
          {currencyFormatter(totalAmount, "UGX", "decimal")} <span style={{ color: "gray", fontSize: "1rem" }}>UGX</span>
        </Typography>
      </Box>

      <Box display="grid" gridTemplateColumns={"1fr 1fr 1fr"} width="100%" >
        <Box width="100" borderRight={"1px solid lightgray"} padding="0 1rem 0 0">
          <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"} fontWeight="500">Total Pending</Typography>
          <Typography color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
            {currencyFormatter(totalPending, "UGX", "decimal")} <span style={{ color: "gray", fontSize: "1rem" }}>UGX</span>
          </Typography>
        </Box>
        <Box width="100" borderRight={"1px solid lightgray"} padding="0 1rem">
          <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"} fontWeight="500">Total Overdue</Typography>
          <Typography color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
            {currencyFormatter(totalOverdue, "UGX", "decimal")} <span style={{ color: "gray", fontSize: "1rem" }}>UGX</span>
          </Typography>
        </Box>
        <Box width="100" padding="0 0 0 1rem">
          <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"} fontWeight="500">Total Paid</Typography>
          <Typography color="primary" fontWeight={"600"} fontSize="1.5rem" textAlign={"right"} letterSpacing={-1}>
            {currencyFormatter(totalPaid, "UGX", "decimal")} <span style={{ color: "gray", fontSize: "1rem" }}>UGX</span>
          </Typography>
        </Box>
      </Box>

      {/* <AccumulationChartComponent id='charts-39' enableSmartLabels={true} legendSettings={legendSettings} height={'200px'}  >
        <Inject services={[PieSeries, AccumulationLegend, AccumulationDataLabel]} />
        <AccumulationSeriesCollectionDirective>
          <AccumulationSeriesDirective dataSource={chartData} xName='x' yName='y' type='Pie' dataLabel={datalabel} />
        </AccumulationSeriesCollectionDirective>
      </AccumulationChartComponent> */}
    </Card>
  )
}