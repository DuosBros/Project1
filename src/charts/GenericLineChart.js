
import React from 'react';
import { Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CHART_COLORS } from '../appConfig';

const GenericLineChart = (props) => {
    let tooltip = <Tooltip />;
    if (props.tooltipFormatter) {
        tooltip = <Tooltip separator={props.tooltipFormatter.separator ? props.tooltipFormatter.separator : ": "} formatter={(value) => `${value} ${props.tooltipFormatter.formatter ? props.tooltipFormatter.formatter : "CZK"}`} />
    }
    let data = props.data.slice()
    if (props.longNames) {
        data.map(x => {
            x[props.xDataKey] = x[props.xDataKey].length > 15 ? x[props.xDataKey].substring(0, 15) + "..." : x[props.xDataKey]
            return x
        })
    }

    let line;
    if (props.ydataKey2) {
        line = <Line type="monotone" dataKey={props.ydataKey2 && props.ydataKey2} stroke={CHART_COLORS[1]} />
    }

    return (
        <ResponsiveContainer minHeight={300} minWidth={400} >
            <LineChart data={data} margin={{ top: 5, right: 50, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis height={props.longNames && 150} dy={props.longNames && 60} padding={{ left: 20, right: 20 }} interval={0} angle={props.longNames && 90} dataKey={props.xDataKey && props.xDataKey} />
                <YAxis />
                {tooltip}
                <Legend />
                <Line type="monotone" dataKey={props.ydataKey1 && props.ydataKey1} stroke={CHART_COLORS[0]} />
                {line}
            </LineChart>
        </ResponsiveContainer >
    );
}

export default GenericLineChart;