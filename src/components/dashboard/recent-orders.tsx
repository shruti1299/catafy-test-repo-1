"use client";

import { CURRENCY_ICON } from '@/constant';
import { IOrder } from '@/interfaces/Order';
import { Button, Card, Tag, Table, TableProps } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Link from 'next/link';

const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: 'New',       color: 'green'   },
  1: { label: 'Confirmed', color: 'blue'    },
  2: { label: 'Rejected',  color: 'red'     },
  3: { label: 'Cancelled', color: 'volcano' },
  9: { label: 'Delivered', color: 'default' },
};

const RecentOrders = ({ orders, loading }: { orders?: IOrder[]; loading: boolean }) => {

  const columns: TableProps<IOrder>['columns'] = [
    {
      title: 'Order',
      dataIndex: 's_no',
      render: (text, { id }) => (
        <Link href={`/orders/${id}`}>
          <span style={{ fontWeight: 600, fontSize: 12, color: '#6366f1' }}>#{text}</span>
        </Link>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            background: '#eef2ff', color: '#6366f1',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {c?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#1e293b' }}>{c?.name}</span>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      render: (total) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: '#10b981' }}>
          {CURRENCY_ICON}{total}
        </span>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items_count',
      render: (n) => (
        <span style={{ fontSize: 11, color: '#64748b' }}>{n} item{n !== 1 ? 's' : ''}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const s = STATUS_MAP[status];
        return s ? (
          <Tag
            color={s.color}
            style={{ fontSize: 10, borderRadius: 4, margin: 0, padding: '0 6px', lineHeight: '18px' }}
          >
            {s.label}
          </Tag>
        ) : null;
      },
    },
    {
      title: '',
      render: (_, { id }) => (
        <Link href={`/orders/${id}`}>
          <Button
            size="small"
            type="primary"
            style={{ fontSize: 11, background: 'linear-gradient(90deg,#6366f1,#818cf8)', border: 'none' }}
          >
            View
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Card
      title={
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
          🛒 Today&apos;s Orders
        </span>
      }
      extra={
        <Link href="/orders">
          <Button type="link" size="small" style={{ fontSize: 12, padding: 0, color: '#6366f1' }}>
            View all →
          </Button>
        </Link>
      }
      loading={loading}
      style={{ marginTop: 16, borderRadius: 12 }}
      styles={{ header: { padding: '10px 16px', minHeight: 44 }, body: { padding: '0 0 4px' } }}
    >
      <Table<IOrder>
        size="small"
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: (
          <div style={{ padding: '24px 0', color: '#94a3b8', textAlign: 'center' }}>
            <ShoppingCartOutlined style={{ fontSize: 28, display: 'block', marginBottom: 6 }} />
            No orders today yet
          </div>
        )}}
      />
    </Card>
  );
};

export default RecentOrders;
