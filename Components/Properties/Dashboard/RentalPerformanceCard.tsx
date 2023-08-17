import { Box, Card, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import currencyFormatter from "Components/Common/currencyFormatter";
import fetchBillsStatistics from "apis/property/fetchBillsStatistics";
import React, { useEffect } from "react";
import DonutPieChart from "./Atoms/PieChart";
import { AccumulationChartComponent, AccumulationDataLabel, AccumulationDataLabelSettingsModel, AccumulationLegend, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, Inject, PieSeries } from "@syncfusion/ej2-react-charts";


export default function RentalPerformanceCard({ property }: any) {
  const { data: rentStats }: any = useQuery({ queryKey: ['property-bills-statistics', property], queryFn: () => fetchBillsStatistics(property) })
  const {
    totalBills,
    totalPaid,
  } = rentStats?.data || {}

  const [chartData, setChartData] = React.useState<any[]>([])

  useEffect(() => {
    if (rentStats?.data) {
      const { availableUnits, occupiedUnits } = rentStats?.data || {}
      const data = [
        { x: 'Paid', y: totalPaid, text: 'Occupied', fill: '#00226C' },
        { x: 'Pending', y: totalBills - totalPaid, text: 'Available', fill: '#0450C2' },
      ]
      setChartData(data)
    }
  }, [rentStats])


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
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        // gap: "1rem",
        boxShadow: "0px 4px 20px rgba(211, 205, 218, 0.25)",
        border: "1px solid rgba(211, 205, 218, 0.7)",
      }}
    >
      <Box display="flex" gap="0.5rem">
        <Typography color="grey" fontSize="0.75rem" lineHeight={"130%"}>
          Your <br />
          <span style={{ fontWeight: "600", fontSize: "1rem" }}>
            Bills Collection
          </span>
        </Typography>
        <Typography ml="auto" color="primary" fontWeight={"600"} fontSize="1.75rem" textAlign={"right"} letterSpacing={-1}>
        {totalBills} <span style={{ color: "gray", fontSize: "1rem" }}>UGX</span>
      </Typography>
      </Box>

      <AccumulationChartComponent id='charts-39' enableSmartLabels={true} legendSettings={legendSettings} height={'200px'}  >
            <Inject services={[PieSeries, AccumulationLegend, AccumulationDataLabel]} />
            <AccumulationSeriesCollectionDirective>
                <AccumulationSeriesDirective dataSource={chartData} xName='x' yName='y' type='Pie' dataLabel={datalabel} />
            </AccumulationSeriesCollectionDirective>
        </AccumulationChartComponent>
    </Card>
  )
}