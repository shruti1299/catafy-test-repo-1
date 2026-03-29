import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, Col, Row, Typography } from 'antd';
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import RangePicker from '../common/rangepicker';
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Bar, Doughnut } from 'react-chartjs-2';
import { BASE_OPTIONS, C, PIE_COLORS_A, TOOLTIP } from './chartTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const { Text } = Typography;

interface IGraphData {
  labels: string[];
  order_counts: string[];
  top_customers: any[];
}

export default function CustomerGraph({ activePlanId }: { activePlanId: number }) {
  const [chartData, setChartData] = useState({} as IGraphData);
  const [loading, setLoading]     = useState(false);
  const [dates, setDates]         = useState<[Dayjs | null, Dayjs | null] | null>(
    [dayjs().subtract(30, 'day'), dayjs()]
  );

  const getCustomerGraphData = async () => {
    setLoading(true);
    const { data } = await api.get(API_ENDPOINTS.CUSTOMER_STATS, {
      params: {
        start_at: dates?.[0]?.format('DD-MM-YYYY'),
        end_at:   dates?.[1]?.format('DD-MM-YYYY'),
      },
    });
    setChartData(data);
    setLoading(false);
  };

  useEffect(() => { getCustomerGraphData(); }, [dates]);

  const CustomerData = {
    labels: chartData.labels?.map(l => dayjs(l).format('D MMM')),
    datasets: [
      {
        label: 'New Customers',
        data: chartData.order_counts,
        backgroundColor: C.skyA,
        hoverBackgroundColor: C.sky,
        borderColor: C.sky,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const topNames  = chartData?.top_customers?.map(c => c.name || `#${c.id}`) ?? [];
  const topOrders = chartData?.top_customers?.map(c => c.total_orders) ?? [];

  const TopCustomerData = {
    labels: topNames,
    datasets: [
      {
        label: 'Orders',
        data: topOrders,
        backgroundColor: PIE_COLORS_A,
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const barOpts: any = {
    ...BASE_OPTIONS,
    plugins: { ...BASE_OPTIONS.plugins },
    scales: { x: BASE_OPTIONS.scales.x, y: BASE_OPTIONS.scales.y },
  };

  const doughnutOpts: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          color: '#64748b',
          font: { size: 11 },
          boxWidth: 10,
          padding: 10,
        },
      },
      tooltip: {
        ...TOOLTIP,
        callbacks: {
          label: (ctx: any) => ` ${ctx.label}: ${ctx.raw} orders`,
        },
      },
    },
  };

  return (
    <Card
      title={<span style={{ fontWeight: 700 }}>Customer Stats</span>}
      loading={loading}
      extra={<RangePicker dates={dates} setDates={setDates} />}
    >
      <Row gutter={[20, 16]}>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
            👥 New Customers over time
          </Text>
          <Bar options={barOpts} data={CustomerData} />
        </Col>
        <Col xs={24} md={12}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 8 }}>
            🏆 Top Customers by Orders
          </Text>
          {topNames.length > 0 ? (
            <div style={{ height: 220 }}>
              <Doughnut data={TopCustomerData} options={doughnutOpts} />
            </div>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
              No customer data yet
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
}
