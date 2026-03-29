'use client';

import { Card, Col, Row, Typography } from 'antd';
import Link from 'next/link';

const { Text } = Typography;

const LINKS = [
  { emoji: '📦', label: 'Add Product',   desc: 'Bulk upload',     href: '/inventory/add-bulk', bg: 'linear-gradient(135deg,#6366f1,#818cf8)' },
  { emoji: '🛒', label: 'Orders',        desc: 'Manage today',    href: '/orders',             bg: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
  { emoji: '👥', label: 'Customers',     desc: 'View all',        href: '/customers',          bg: 'linear-gradient(135deg,#10b981,#34d399)' },
  { emoji: '📊', label: 'Analytics',     desc: 'Insights',        href: '/analytics',          bg: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
  { emoji: '🗂️', label: 'Catalogs',      desc: 'Share products',  href: '/catalogs',           bg: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
  { emoji: '📈', label: 'Reports',       desc: 'Download data',   href: '/reports',            bg: 'linear-gradient(135deg,#ef4444,#f87171)' },
];

const QuickLinks = () => (
  <Card
    title={<span style={{ fontWeight: 700, fontSize: 13 }}>⚡ Quick Actions</span>}
    style={{ marginBottom: 16, borderRadius: 12, marginTop: 16}}
    styles={{ body: { padding: '12px 16px' } }}
  >
    <Row gutter={[8, 8]}>
      {LINKS.map(link => (
        <Col key={link.href} xs={8} sm={8} md={8}>
          <Link href={link.href}>
            <div
              style={{
                background: link.bg,
                borderRadius: 10,
                padding: '10px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 16px rgba(0,0,0,0.18)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 2 }}>{link.emoji}</div>
              <Text style={{ fontSize: 11, fontWeight: 700, color: '#fff', display: 'block', lineHeight: 1.2 }}>
                {link.label}
              </Text>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', display: 'block' }}>
                {link.desc}
              </Text>
            </div>
          </Link>
        </Col>
      ))}
    </Row>
  </Card>
);

export default QuickLinks;
