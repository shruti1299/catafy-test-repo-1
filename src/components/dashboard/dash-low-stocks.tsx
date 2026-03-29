'use client';

import { IProduct } from '@/interfaces/Product';
import { Button, Card, Image } from 'antd';
import { WarningFilled, InboxOutlined } from '@ant-design/icons';
import Link from 'next/link';

const getStockStyle = (stock: number): { color: string; bg: string; label: string } => {
  if (stock === 0)  return { color: '#ef4444', bg: '#fff1f2', label: 'Out'     };
  if (stock <= 5)   return { color: '#f97316', bg: '#fff7ed', label: `${stock} left` };
  return              { color: '#eab308', bg: '#fefce8', label: `${stock} left` };
};

const DashboardLowStocks = ({ products, loading }: { products: IProduct[]; loading: boolean }) => {
  return (
    <Card
      style={{marginTop:15, borderRadius: 12}}
      title={
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
          <WarningFilled style={{ color: '#f97316', marginRight: 6 }} />
          Low Stock
        </span>
      }
      extra={
        <Link href="/inventory?stock=low">
          <Button type="link" size="small" style={{ fontSize: 12, padding: 0, color: '#6366f1' }}>
            Fix all →
          </Button>
        </Link>
      }
      loading={loading}
      styles={{ header: { padding: '10px 16px', minHeight: 44 }, body: { padding: '8px 12px 12px' } }}
    >
      {!products?.length ? (
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#94a3b8' }}>
          <InboxOutlined style={{ fontSize: 26, display: 'block', marginBottom: 6 }} />
          <span style={{ fontSize: 12 }}>All products are well stocked</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {products.slice(0, 8).map((product) => {
            const stock = getStockStyle(product.stock ?? 0);
            return (
              <Link href={`/inventory/${product.id}`} key={product.id}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '7px 8px',
                  borderRadius: 8,
                  border: `1px solid ${stock.bg === '#fff1f2' ? '#fecdd3' : '#f1f5f9'}`,
                  background: stock.bg,
                  transition: 'opacity 0.15s',
                  cursor: 'pointer',
                }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: 34, height: 34, borderRadius: 6,
                    overflow: 'hidden', flexShrink: 0,
                    background: '#f8fafc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={34}
                        height={34}
                        style={{ objectFit: 'cover' }}
                        preview={false}
                      />
                    ) : (
                      <InboxOutlined style={{ color: '#cbd5e1', fontSize: 14 }} />
                    )}
                  </div>

                  {/* Name */}
                  <div style={{
                    flex: 1, minWidth: 0,
                    fontSize: 12, fontWeight: 500,
                    color: '#1e293b',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {product.name}
                  </div>

                  {/* Stock badge */}
                  <div style={{
                    flexShrink: 0,
                    fontSize: 11, fontWeight: 700,
                    color: stock.color,
                    background: '#fff',
                    border: `1px solid ${stock.color}30`,
                    borderRadius: 5,
                    padding: '1px 7px',
                    lineHeight: '18px',
                  }}>
                    {stock.label}
                  </div>
                </div>
              </Link>
            );
          })}

          {products.length > 8 && (
            <Link href="/inventory?stock=low">
              <div style={{
                textAlign: 'center', fontSize: 12,
                color: '#6366f1', fontWeight: 500,
                padding: '6px 0 2px',
              }}>
                +{products.length - 8} more low stock items →
              </div>
            </Link>
          )}
        </div>
      )}
    </Card>
  );
};

export default DashboardLowStocks;
