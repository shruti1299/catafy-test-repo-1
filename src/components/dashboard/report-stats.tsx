import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, DatePicker } from 'antd';
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const options = {
    responsive: true
};

interface IGraphData{
    labels: string[]
    order_amounts: string[]
    paid_amount: number
    order_counts: string[]
    graph_data: any[]
}

export function ReportStats() {
    const [chartData, setChartData] = useState({} as IGraphData)
    const [loading, setLoading] = useState(false)

    const ReportStatsQL = async () => {
        setLoading(true)
        const { data } = await api.get(API_ENDPOINTS.ORDER_STATS);
        setChartData(data)
        setLoading(false)
    }

    const data = {
        labels:chartData.labels,
        datasets: [
            {
                fill: true,
                label: 'Orders',
                data: chartData.order_amounts,
                borderColor: '#1677ff',
                backgroundColor: '#EEF2FF80',
            },
        ],
    };
    
      useEffect(() => {
        ReportStatsQL();
      }, [])

    return (<Card
            loading={loading}
            title="Customers Report"
            extra={<DatePicker.RangePicker />}
    >
        <Line options={options} data={data} />
      
    </Card>)
}


















