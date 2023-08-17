import { AccumulationChartComponent, AccumulationDataLabel, AccumulationDataLabelSettingsModel, AccumulationLegend, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, Inject, PieSeries, }
    from "@syncfusion/ej2-react-charts"
import * as React from 'react';

interface Props {
    data: any;
    id: string;
}

class DonutPieChart extends React.Component<Props, {}> {

    public render() {
        const { data, id } = this.props;
        const datalabel: AccumulationDataLabelSettingsModel = { visible: true, position: "Inside" }
        const legendSettings = { visible: true };

        return <AccumulationChartComponent id={id} enableSmartLabels={true} legendSettings={legendSettings} height={'200px'}  >
            <Inject services={[PieSeries, AccumulationLegend, AccumulationDataLabel]} />
            <AccumulationSeriesCollectionDirective>
                <AccumulationSeriesDirective dataSource={data} xName='x' yName='y' type='Pie' dataLabel={datalabel} />
            </AccumulationSeriesCollectionDirective>
        </AccumulationChartComponent>
    }
};

export default DonutPieChart;