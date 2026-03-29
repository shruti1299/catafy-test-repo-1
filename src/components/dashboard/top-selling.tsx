import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import api from '@/api';
import { API_ENDPOINTS } from '@/api/endpoints';
import { Card, Skeleton } from 'antd';
import { TrophyOutlined, InboxOutlined } from '@ant-design/icons';
import Link from 'next/link';
import RangePicker from '../common/rangepicker';

interface TopProduct {
  id: number;
  name: string;
  image?: string;
  total_sold: number;
  total_revenue: number;
}

const RANK_BADGES: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <span style={{ fontSize: 18, lineHeight: 1, minWidth: 24, textAlign: 'center' }}>
        {RANK_BADGES[rank]}
      </span>
    );
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#e2e8f0',
        color: '#64748b',
        fontSize: 11,
        fontWeight: 700,
        minWidth: 22,
      }}
    >
      {rank}
    </span>
  );
}

function ProductRow({ product, rank }: { product: TopProduct; rank: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        borderBottom: '1px solid #f1f5f9',
      }}
    >
      <RankBadge rank={rank} />

      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            objectFit: 'cover',
            flexShrink: 0,
            background: '#f8fafc',
          }}
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <InboxOutlined style={{ fontSize: 18, color: '#94a3b8' }} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#1e293b',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.name}
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
          {product.total_sold} units sold
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', flexShrink: 0 }}>
        ₹{Number(product.total_revenue).toLocaleString('en-IN')}
      </div>
    </div>
  );
}

export default function TopSellingProducts() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading]   = useState(false);
  const [dates, setDates]       = useState<[Dayjs | null, Dayjs | null] | null>(
    [dayjs().subtract(29, 'day'), dayjs()]
  );

  const fetchTopProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(API_ENDPOINTS.TOP_PRODUCTS, {
        params: {
          start_at: dates?.[0]?.format('DD-MM-YYYY'),
          end_at:   dates?.[1]?.format('DD-MM-YYYY'),
        },
      });
      setProducts(data);
    } catch {
      // silent — empty state handles it
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTopProducts(); }, [dates]);

  return (
    <Card
      title={
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
          🏆 Top Selling Products
        </span>
      }
      extra={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RangePicker dates={dates} setDates={setDates} />
          <Link href="/analytics" style={{ fontSize: 12, color: '#6366f1' }}>
            View all →
          </Link>
        </div>
      }
      style={{ borderRadius: 12, marginTop: 16 }}
      styles={{ header: { padding: '10px 16px', minHeight: 44 } }}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : products.length === 0 ? (
        <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8' }}>
          <TrophyOutlined style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
          <div style={{ fontSize: 12 }}>No sales data for this period</div>
        </div>
      ) : (
        <div>
          {products.map((product, index) => (
            <ProductRow key={product.id} product={product} rank={index + 1} />
          ))}
        </div>
      )}
    </Card>
  );
}
