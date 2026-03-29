import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Card, Col, Row, Tag, Typography } from 'antd';
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import RangePicker from '../common/rangepicker';
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { BASE_OPTIONS, C } from './chartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend);

const { Text } = Typography;

interface IGraphData {
  labels: string[];
  order_amounts: string[];
  paid_amount: number;
  order_counts: string[];
  graph_data: any[];
}

export function OrderGraph({ activePlanId }: { activePlanId: number }) {
  const [chartData, setChartData] = useState({} as IGraphData);
  const [loading, setLoading]     = useState(false);
  const [dates, setDates]         = useState<[Dayjs | null, Dayjs | null] | null>(
    [dayjs().subtract(7, 'day'), dayjs()]
  );

  const getOrderGraphData = async () => {
    setLoading(true);
    const { data } = await api.get(API_ENDPOINTS.ORDER_STATS, {
      params: {
        start_at: dates?.[0]?.format('DD-MM-YYYY'),
        end_at:   dates?.[1]?.format('DD-MM-YYYY'),
      },
    });
    setChartData(data);
    setLoading(false);
  };

  useEffect(() => { getOrderGraphData(); }, [dates]);

  // Monthly labels arrive as "Jan, 2025"; daily labels as "2025-01-15"
  const formatLabel = (l: string) =>
    l.includes(',') ? l : dayjs(l).format('D MMM');

  const OrderData = {
    labels: chartData.labels?.map(formatLabel),
    datasets: [
      {
        fill: true,
        label: 'Orders',
        data: chartData.order_counts,
        borderColor: C.indigo,
        backgroundColor: C.indigoA,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: C.indigo,
        borderWidth: 2,
      },
    ],
  };

  const SalesData = {
    labels: chartData.labels?.map(formatLabel),
    datasets: [
      {
        label: 'Sales (₹)',
        data: chartData.order_amounts,
        backgroundColor: chartData.order_amounts?.map((_, i) =>
          i % 2 === 0 ? C.green : C.greenA
        ) ?? C.green,
        hoverBackgroundColor: C.green,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const lineOpts: any = {
    ...BASE_OPTIONS,
    plugins: { ...BASE_OPTIONS.plugins },
    scales: { x: BASE_OPTIONS.scales.x, y: BASE_OPTIONS.scales.y },
  };

  const barOpts: any = {
    ...BASE_OPTIONS,
    plugins: { ...BASE_OPTIONS.plugins },
    scales: {
      x: BASE_OPTIONS.scales.x,
      y: {
        ...BASE_OPTIONS.scales.y,
        ticks: {
          ...BASE_OPTIONS.scales.y.ticks,
          callback: (v: number) => v >= 1000 ? `₹${v / 1000}k` : `₹${v}`,
        },
      },
    },
  };

  return (
    <Card
      loading={loading}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700 }}>Order &amp; Sales Stats</span>
          {chartData.paid_amount != null && (
            <Tag color="green" style={{ fontSize: 11 }}>
              Paid ₹{Number(chartData.paid_amount).toLocaleString('en-IN')}
            </Tag>
          )}
        </div>
      }
      extra={<RangePicker dates={dates} setDates={setDates} />}
    >
      <Row gutter={[20, 16]}>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
            📦 Order Count
          </Text>
          <Line options={lineOpts} data={OrderData} />
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
            💰 Sales Amount
          </Text>
          <Bar options={barOpts} data={SalesData} />
        </Col>
      </Row>
    </Card>
  );
}
