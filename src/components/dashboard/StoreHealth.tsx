'use client';

import { useUserContext } from '@/contexts/UserContext';
import { Card, Progress, Skeleton, Tag, Tooltip, Typography } from 'antd';
import {
  CheckCircleFilled,
  ArrowRightOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import useSWR from 'swr';
import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { IPlanUsages } from '@/interfaces/Plan';

const { Text } = Typography;

interface HealthItem {
  label: string;
  desc: string;
  done: boolean;
  href: string;
  emoji: string;
}

const fetcher = (url: string) => api.get(url).then(r => r.data);

const StoreHealth = () => {
  const { storeDetail } = useUserContext();

  const { data: usages, isLoading } = useSWR<IPlanUsages>(
    API_ENDPOINTS.PLAN_USAGES,
    fetcher
  );

  const checks: HealthItem[] = [
    {
      emoji: '🖼️',
      label: 'Upload store logo',
      desc: 'Your logo appears on all buyer-facing pages and invoices',
      done: !!storeDetail?.store?.logo,
      href: '/settings',
    },
    {
      emoji: '🏢',
      label: 'Add business address',
      desc: 'Required for invoicing and Shiprocket shipping',
      done: !!storeDetail?.company?.address,
      href: '/settings',
    },
    {
      emoji: '📦',
      label: 'Add products to inventory',
      desc: 'Add at least one product to start selling',
      done: (usages?.products ?? 0) > 0,
      href: '/inventory/add-bulk',
    },
    {
      emoji: '🗂️',
      label: 'Create your first catalog',
      desc: 'Group products and share via WhatsApp',
      done: (usages?.catalogs ?? 0) > 0,
      href: '/catalogs',
    },
    {
      emoji: '🛒',
      label: 'Receive your first order',
      desc: 'Share your store link with customers to get orders',
      done: (usages?.orders ?? 0) > 0,
      href: '/orders',
    },
    {
      emoji: '🧾',
      label: 'Setup GST invoice',
      desc: 'Enable professional GST-compliant invoices for buyers',
      done: !!storeDetail?.detail?.is_invoice,
      href: '/settings',
    },
  ];

  const done    = checks.filter(c => c.done).length;
  const total   = checks.length;
  const percent = Math.round((done / total) * 100);

  const strokeColor =
    percent === 100 ? '#22c55e' :
    percent >= 60   ? '#f59e0b' :
                      '#6366f1';

  const scoreLabel =
    percent === 100 ? '🎉 Perfect!' :
    percent >= 80   ? 'Almost there' :
    percent >= 50   ? 'Good progress' :
                      'Just getting started';

  if (isLoading) return <Card style={{ marginBottom: 16, borderRadius: 12 }}><Skeleton active paragraph={{ rows: 6 }} /></Card>;

  return (
    <Card
      style={{ marginBottom: 16, borderRadius: 12 }}
      styles={{ body: { padding: '16px 16px 12px' } }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15 }}>🏪</span>
          <span style={{ fontWeight: 700, fontSize: 13 }}>Store Health</span>
          <Tag
            color={percent === 100 ? 'success' : percent >= 60 ? 'warning' : 'processing'}
            style={{ fontSize: 11, marginLeft: 'auto' }}
          >
            {percent}% · {scoreLabel}
          </Tag>
        </div>
      }
    >
      {/* Progress bar */}
      <Progress
        percent={percent}
        strokeColor={strokeColor}
        trailColor="#f1f5f9"
        showInfo={false}
        strokeWidth={8}
        style={{ marginBottom: 12 }}
      />

      <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 10 }}>
        {done} of {total} setup tasks complete
      </Text>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {checks.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 8,
              background: item.done ? '#f0fdf4' : '#fafafa',
              border: `1px solid ${item.done ? '#bbf7d0' : '#e5e7eb'}`,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 15 }}>{item.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Tooltip title={item.desc}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: item.done ? '#15803d' : '#374151',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.label}
                </Text>
              </Tooltip>
            </div>
            {item.done ? (
              <CheckCircleFilled style={{ color: '#22c55e', fontSize: 15, flexShrink: 0 }} />
            ) : (
              <Link href={item.href}>
                <Tag
                  color="blue"
                  style={{ cursor: 'pointer', fontSize: 10, margin: 0, flexShrink: 0 }}
                >
                  Fix <ArrowRightOutlined />
                </Tag>
              </Link>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StoreHealth;
