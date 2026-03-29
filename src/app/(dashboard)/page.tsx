"use client";

import api from '@/api'
import { API_ENDPOINTS } from '@/api/endpoints'
import DashboardLowStocks from '@/components/dashboard/dash-low-stocks'
import DashboardStats from '@/components/dashboard/dashboard-stats'
import Last15DaysViews from '@/components/dashboard/last7days-views';
import LiveStats from '@/components/dashboard/live-customers';
import RecentOrders from '@/components/dashboard/recent-orders'
import StoreHealth from '@/components/dashboard/StoreHealth';
import QuickLinks from '@/components/dashboard/QuickLinks';
import WhatsNew from '@/components/dashboard/WhatsNew';
import TopSellingProducts from '@/components/dashboard/top-selling';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { IOrderList } from '@/interfaces/Order'
import { IProductList } from '@/interfaces/Product'
import { useUserContext } from '@/contexts/UserContext';
import { Button, Card, Col, FloatButton, message, Row, Statistic, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, LinkOutlined, ShareAltOutlined } from '@ant-design/icons';
import { CURRENCY_ICON } from '@/constant';
import Link from 'next/link';

const { Text } = Typography;

const Page = () => {
  const [loading, setLoading]   = useState<boolean>(true);
  const [orders, setOrders]     = useState<IOrderList>({} as IOrderList);
  const [products, setProducts] = useState<IProductList>({} as IProductList);
  const [stats, setStats]       = useState<any>({});
  const { storeDetail }         = useUserContext();

  const storeLink = `https://${storeDetail?.store?.username}.catafy.com`;

  const getStats = async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.STATS);
      setStats(data);
    } catch {
      message.error("Failed to load stats");
    }
  };
  const getRecentOrders = async () => {
    try {
      const { data } = await api.get(`${API_ENDPOINTS.RECENT_ORDERS}?order_date=${moment().format('MM/DD/YYYY')}`);
      setOrders(data);
    } catch {
      message.error("Failed to load recent orders");
    }
  };
  const getLowStock = async () => {
    try {
      const { data } = await api.get(API_ENDPOINTS.LOW_STOCKS);
      setProducts(data);
    } catch {
      message.error("Failed to load low stock data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
    getRecentOrders();
    getLowStock();
  }, []);

  return (
    <div className="mb-100">
      <Row gutter={[16, 16]}>

        {/* ══ LEFT COLUMN ══════════════════════════════════ */}
        <Col xs={24} md={16}>

          {/* Stat Summary Cards */}
          <Row gutter={[10, 10]} style={{ marginBottom: 16 }}>
            {[
              {
                label: 'Today Orders',
                value: stats.total_orders ?? 0,
                prefix: '🛒',
                color: '#6366f1',
                bg: '#eef2ff',
                href: '/orders',
              },
              {
                label: 'Today Sales',
                value: `${CURRENCY_ICON}${stats.total_sales ?? 0}`,
                prefix: '💰',
                color: '#10b981',
                bg: '#f0fdf4',
                href: '/analytics',
              },
              {
                label: 'New Customers',
                value: stats.new_customers ?? 0,
                prefix: '👥',
                color: '#0ea5e9',
                bg: '#f0f9ff',
                href: '/customers',
              },
              {
                label: 'Today Views',
                value: stats.total_views ?? 0,
                prefix: '👁️',
                color: '#f59e0b',
                bg: '#fffbeb',
                href: '/analytics',
              },
            ].map(s => (
              <Col xs={12} sm={12} md={6} key={s.label}>
                <Link href={s.href}>
                  <Card
                    loading={loading}
                    style={{
                      borderRadius: 12,
                      border: 'none',
                      background: s.bg,
                      cursor: 'pointer',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    styles={{ body: { padding: '12px 14px' } }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.prefix}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                      {s.value}
                    </div>
                    <Text style={{ fontSize: 11, color: '#6b7280' }}>{s.label}</Text>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          {/* Today's Orders table — most actionable widget */}
          <RecentOrders orders={orders?.data} loading={loading} />

          {/* Tips / Feature Suggestions */}
          <Card
            style={{ margin: '16px 0', borderRadius: 12, border: '1px dashed #c7d2fe', background: '#fafafe' }}
            styles={{ body: { padding: '16px' } }}
          >
            <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 10 }}>
              💡 Grow your business
            </Text>
            <Row gutter={[10, 10]}>
              {[
                { icon: '📤', title: 'Share your catalog', desc: 'Send catalog links to buyers on WhatsApp', href: '/shareable' },
                { icon: '🎯', title: 'Set MOQ & MOA', desc: 'Control minimum order quantity and amount', href: '/settings' },
                { icon: '🔒', title: 'Private catalogs', desc: 'Show selective products to select buyers', href: '/catalogs' },
                { icon: '📊', title: 'Check analytics', desc: 'See which products buyers view most', href: '/analytics' },
                { icon: '🏷️', title: 'Add bulk discounts', desc: 'Reward buyers who order in high quantity', href: '/inventory' },
                { icon: '🧾', title: 'Enable invoices', desc: 'Send GST invoices directly from the app', href: '/settings' },
              ].map(tip => (
                <Col xs={24} sm={12} md={8} key={tip.title}>
                  <Link href={tip.href}>
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: '#fff',
                        border: '1px solid #e0e7ff',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{tip.icon}</span>
                      <div>
                        <Text strong style={{ fontSize: 12, display: 'block', color: '#3730a3' }}>
                          {tip.title}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#6b7280' }}>{tip.desc}</Text>
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Sales chart — trend analysis after orders */}
          <DashboardStats stats={stats} loading={loading} />

          {/* Top Selling Products — last 30 days */}
          <TopSellingProducts />

          {/* Views trend chart */}
          <Last15DaysViews />

        </Col>

        {/* ══ RIGHT COLUMN ══════════════════════════════════ */}
        <Col xs={24} md={8}>

        {/* 🟠 #2 — Store link: shared with buyers constantly */}
          <Card
            style={{
              marginBottom: 16,
              borderRadius: 12,
              background: 'linear-gradient(135deg,#6366f1,#818cf8)',
              border: 'none',
            }}
            styles={{ body: { padding: '14px 16px' } }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, display: 'block' }}>Your store is live at</Text>
            <a href={storeLink} target="_blank" rel="noreferrer"
              style={{ color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, margin: '4px 0 8px' }}>
              <LinkOutlined /> {storeDetail?.store?.username}.catafy.com
            </a>
            <Button
              size="small"
              icon={<ShareAltOutlined />}
              style={{ borderRadius: 6, fontSize: 11, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}
              onClick={() => navigator.clipboard.writeText(storeLink)}
            >
              Copy Link
            </Button>
          </Card>

          {/* 🟢 #5 — Live visitors: nice-to-have real-time signal */}
          <LiveStats />

          {/* 🟠 #3 — Quick Links: fast shortcuts to common tasks */}
          <QuickLinks />

          {/* 🟡 #4 — Store Health: setup completeness */}
          <StoreHealth />

          {/* ⚪ #6 — What's New: feature discovery */}
          <WhatsNew />

          {/* 🔴 #1 — Low Stock Alerts: operational blocker, check before packing */}
          <DashboardLowStocks products={products?.data} loading={loading} />

        </Col>
      </Row>

      <FloatButton
        style={{ insetBlockEnd: 100 }}
        shape="circle"
        type="primary"
        icon={<PlusOutlined />}
        tooltip={{ title: '+ Add Products', placement: 'top' }}
        href="/inventory/add-bulk"
      />

      {/* Onboarding wizard — shown once to new sellers */}
      <OnboardingWizard />
    </div>
  );
};

export default Page;
