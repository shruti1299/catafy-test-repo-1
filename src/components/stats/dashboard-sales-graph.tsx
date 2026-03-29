import React, { useEffect, useState } from 'react';
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import RangePicker from '../common/rangepicker';
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Button, Skeleton } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BASE_OPTIONS, C } from './chartTheme';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface IGraphData {
  labels: string[];
  order_amounts: string[];
  paid_amount: number;
  order_counts: string[];
  top_customers: any[];
}

type PresetKey = 'today' | '7days' | '30days' | 'thisMonth' | 'custom';

interface Preset {
  key: PresetKey;
  label: string;
  range: () => [Dayjs, Dayjs];
}

const PRESETS: Preset[] = [
  { key: 'today',     label: 'Today',      range: () => [dayjs(), dayjs()] },
  { key: '7days',     label: '7 Days',     range: () => [dayjs().subtract(6, 'day'), dayjs()] },
  { key: '30days',    label: '30 Days',    range: () => [dayjs().subtract(29, 'day'), dayjs()] },
  { key: 'thisMonth', label: 'This Month', range: () => [dayjs().startOf('month'), dayjs()] },
  { key: 'custom',    label: '📅 Custom',  range: () => [dayjs().subtract(6, 'day'), dayjs()] },
];

export default function DashboardSalesGraph() {
  const [chartData, setChartData] = useState({} as IGraphData);
  const [loading, setLoading]     = useState(false);
  const [activePreset, setActivePreset] = useState<PresetKey>('7days');
  const [showPicker, setShowPicker]     = useState(false);
  const [dates, setDates]               = useState<[Dayjs | null, Dayjs | null] | null>(
    [dayjs().subtract(6, 'day'), dayjs()]
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

  const handlePreset = (preset: Preset) => {
    setActivePreset(preset.key);
    if (preset.key === 'custom') {
      setShowPicker(true);
    } else {
      setShowPicker(false);
      setDates(preset.range());
    }
  };

  const totalOrders  = (chartData.order_counts ?? []).reduce((sum, v) => sum + Number(v), 0);
  const totalRevenue = chartData.paid_amount ?? 0;
  const dayCount     = dates?.[0] && dates?.[1]
    ? Math.max(dates[1].diff(dates[0], 'day') + 1, 1)
    : 1;
  const avgPerDay    = totalOrders > 0 ? (totalRevenue / dayCount) : 0;

  const data = {
    labels: chartData?.labels?.map(l => dayjs(l).format('D MMM')),
    datasets: [
      {
        label: 'Sales (₹)',
        data: chartData.order_amounts,
        fill: true,
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

  const options: any = {
    ...BASE_OPTIONS,
    plugins: {
      ...BASE_OPTIONS.plugins,
      tooltip: {
        ...BASE_OPTIONS.plugins.tooltip,
        callbacks: {
          label: (ctx: any) => ` ₹${Number(ctx.raw ?? 0).toLocaleString('en-IN')}`,
        },
      },
    },
    scales: {
      ...BASE_OPTIONS.scales,
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
    <div>
      {/* Summary bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#6366f1', lineHeight: 1.2 }}>
            ₹{Number(totalRevenue).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Total Revenue</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#475569', lineHeight: 1.2 }}>
            {totalOrders.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Total Orders</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#64748b', lineHeight: 1.2 }}>
            ₹{Number(avgPerDay.toFixed(0)).toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Avg / Day</div>
        </div>
      </div>

      {/* Preset buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {PRESETS.map((preset) => {
          const isActive = activePreset === preset.key;
          return (
            <Button
              key={preset.key}
              size="small"
              onClick={() => handlePreset(preset)}
              style={{
                fontSize: 12,
                borderRadius: 6,
                background: isActive ? '#6366f1' : undefined,
                borderColor: isActive ? '#6366f1' : undefined,
                color: isActive ? '#fff' : undefined,
              }}
              type={isActive ? 'primary' : 'default'}
            >
              {preset.label}
            </Button>
          );
        })}
      </div>

      {/* Custom range picker */}
      {showPicker && (
        <div style={{ marginBottom: 12 }}>
          <RangePicker
            dates={dates}
            setDates={(val: any) => {
              if (val) setDates(val);
            }}
          />
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
}
