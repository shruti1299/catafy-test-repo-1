'use client';

import useSWR from 'swr';
import { Card, Skeleton } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '@/api';
import { BASE_OPTIONS, C } from '../stats/chartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend, Filler);

const fetcher = (url: string) => api.get(url).then(r => r.data);

export default function Last15DaysViews() {
  const { data, isLoading } = useSWR(`/analytics/recent?days=15`, fetcher);
  const rows = data?.series ?? [];

  const chartData = {
    labels: rows.map((r: any) => r.d),
    datasets: [
      {
        label: 'Views',
        data: rows.map((r: any) => r.views),
        borderColor: C.violet,
        backgroundColor: C.violetA,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: C.violet,
        borderWidth: 2,
      },
    ],
  };

  const options: any = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      legend: {
        display: true,
        position: 'top' as const,
        labels: { color: '#64748b', font: { size: 11 }, boxWidth: 10 },
      },
    },
  };

  return (
    <Card
      title={<span style={{ fontWeight: 700 }}>📈 Views Trend — Last 15 Days</span>}
      style={{ marginTop: 16, borderRadius: 12 }}
    >
      {isLoading
        ? <Skeleton active paragraph={{ rows: 4 }} />
        : <Line data={chartData} options={options} />
      }
    </Card>
  );
}
