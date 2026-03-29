"use client";

import { useEffect, useState } from 'react';
import api from '@/api';
import {
    Avatar, Card, Col, message, Progress, Row, Space,
    Tag, Typography, Skeleton,
} from 'antd';
import StoreStats from './stats';
import { OrderGraph } from '@/components/stats/order-graph';
import CustomerGraph from '@/components/stats/customer-graph';
import { useUserContext } from '@/contexts/UserContext';
import { AnalyticsTable } from '@/components/stats/AnalyticsTable';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { dateTimeHumanize } from '@/utils/helper';
import Last15DaysViews from '@/components/dashboard/last7days-views';
import PlanedUsed from '@/components/stats/PlanedUsed';
import {
    TrophyOutlined,
    FireOutlined,
    ShoppingCartOutlined,
    EyeOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';

dayjs.extend(relativeTime);

const { Text } = Typography;

/* ── Card title helper ──────────────────────────────────────── */
const cardTitle = (icon: React.ReactNode, label: string) => (
    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
        <span style={{ marginRight: 6 }}>{icon}</span>{label}
    </span>
);

const HEADER_STYLES = { header: { padding: '10px 16px', minHeight: 44 } };

/* ── Ranked list item ───────────────────────────────────────── */
const RankedItem = ({
    rank, image, name, value, label, maxValue, color = '#6366f1',
}: {
    rank: number; image?: string; name: string;
    value: number; label: string; maxValue: number; color?: string;
}) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            background: rank <= 3 ? color : '#f1f5f9',
            color: rank <= 3 ? '#fff' : '#94a3b8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700,
        }}>
            {rank}
        </div>
        {image && <Avatar src={image} shape="square" size={34} style={{ flexShrink: 0, borderRadius: 6 }}>{name[0]}</Avatar>}
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#1e293b' }}>
                {name}
            </div>
            <Progress
                percent={maxValue > 0 ? Math.round((value / maxValue) * 100) : 0}
                strokeColor={color}
                showInfo={false}
                size="small"
                style={{ marginBottom: 0 }}
            />
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color, flexShrink: 0 }}>
            {value} <Text type="secondary" style={{ fontSize: 11 }}>{label}</Text>
        </div>
    </div>
);

/* ── Main page ──────────────────────────────────────────────── */
const AnalyticsPage = () => {
    const { storeDetail } = useUserContext();
    const [topCustomers, setTopCustomers] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [viewsByCustomer, setViewsByCustomer] = useState<any[]>([]);
    const [topCartProducts, setTopCartProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState({
        customers: true, products: true, views: true, cart: true,
    });

    useEffect(() => {
        api.get('/stats/top-customers')
            .then(({ data }) => setTopCustomers(data))
            .catch(() => message.error("Failed to load top customers"))
            .finally(() => setLoading(p => ({ ...p, customers: false })));

        api.get('/stats/top-products')
            .then(({ data }) => setTopProducts(data))
            .catch(() => message.error("Failed to load top products"))
            .finally(() => setLoading(p => ({ ...p, products: false })));

        api.get('/stats/views-by-customer')
            .then(({ data }) => setViewsByCustomer(data))
            .catch(() => message.error("Failed to load viewer activity"))
            .finally(() => setLoading(p => ({ ...p, views: false })));

        api.get('/stats/top-cart-products')
            .then(({ data }) => setTopCartProducts(data))
            .catch(() => message.error("Failed to load cart data"))
            .finally(() => setLoading(p => ({ ...p, cart: false })));
    }, []);

    const maxSold    = topProducts[0]?.total_sold ?? 1;
    const maxCart    = topCartProducts[0]?.times_added ?? 1;
    const maxOrders  = topCustomers[0]?.order_count ?? 1;

    const viewColumns = [
        {
            title: 'Customer', dataIndex: ['customer', 'name'], key: 'name',
            render: (name: string, row: any) => (
                <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{row?.customer?.phone}</div>
                </div>
            ),
        },
        {
            title: 'Views', dataIndex: 'view_count', key: 'view_count',
            render: (v: number) => (
                <Tag color="purple" style={{ fontSize: 10, borderRadius: 4, margin: 0, padding: '0 6px', lineHeight: '18px' }}>{v}</Tag>
            ),
        },
        {
            title: 'Last Seen', dataIndex: 'last_viewed_at', key: 'last_viewed_at',
            render: (value: string) => {
                const isLive = dayjs().diff(dayjs(value), 'minute') <= 15;
                return (
                    <Space size={4}>
                        {isLive && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />}
                        <span style={{ fontSize: 11, color: '#64748b' }}>{dateTimeHumanize(value)}</span>
                    </Space>
                );
            },
        },
        {
            title: '', dataIndex: 'customer_id', key: 'action',
            render: (id: number) => (
                <Link href={`/customers/${id}`}>
                    <ArrowRightOutlined style={{ color: '#6366f1', fontSize: 13 }} />
                </Link>
            ),
        },
    ];

    return (
        <Space direction="vertical" size={16} className="w-100 mb-100">

            {/* ── KPI Cards ── */}
            <StoreStats />

            {/* ── Orders & Sales ── */}
            <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    <FireOutlined style={{ marginRight: 6 }} />Orders &amp; Sales
                </div>
                <OrderGraph activePlanId={storeDetail?.active_plan?.plan_id} />
            </div>

            {/* ── Catalog Engagement ── */}
            <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    <EyeOutlined style={{ marginRight: 6 }} />Catalog Engagement
                </div>
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={14}>
                        <Last15DaysViews />
                    </Col>
                    <Col xs={24} lg={10}>
                        <Card
                            title={cardTitle(<EyeOutlined style={{ color: '#6366f1' }} />, 'Live Viewer Activity')}
                            style={{ height: '100%', borderRadius: 12 }}
                            styles={HEADER_STYLES}
                        >
                            {loading.views ? (
                                <Skeleton active />
                            ) : (
                                <AnalyticsTable
                                    data={viewsByCustomer.slice(0, 6)}
                                    columns={viewColumns}
                                    rowKey="customer_id"
                                    loading={false}
                                />
                            )}
                            {viewsByCustomer.length > 6 && (
                                <div style={{ textAlign: 'center', marginTop: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        +{viewsByCustomer.length - 6} more customers
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* ── Customer Analytics ── */}
            <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    <TrophyOutlined style={{ marginRight: 6 }} />Customer Analytics
                </div>
                <CustomerGraph activePlanId={storeDetail?.active_plan?.plan_id} />
            </div>

            {/* ── Top Performers ── */}
            <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    <TrophyOutlined style={{ marginRight: 6 }} />Top Performers
                </div>
                <Row gutter={[16, 16]}>

                    {/* Top Sold Products */}
                    <Col xs={24} md={8}>
                        <Card
                            title={cardTitle('🏆', 'Top Sold Products')}
                            style={{ height: '100%', borderRadius: 12 }}
                            styles={HEADER_STYLES}
                        >
                            {loading.products ? <Skeleton active /> :
                             topProducts.length === 0 ? <Text type="secondary" style={{ fontSize: 12 }}>No data yet</Text> :
                             topProducts.slice(0, 7).map((p, i) => (
                                <RankedItem
                                    key={p.id} rank={i + 1} image={p.image}
                                    name={p.name} value={p.total_sold} label="sold"
                                    maxValue={maxSold} color="#f97316"
                                />
                            ))}
                        </Card>
                    </Col>

                    {/* Most Added to Cart */}
                    <Col xs={24} md={8}>
                        <Card
                            title={cardTitle(<ShoppingCartOutlined style={{ color: '#8b5cf6' }} />, 'Most Added to Cart')}
                            style={{ height: '100%', borderRadius: 12 }}
                            styles={HEADER_STYLES}
                        >
                            {loading.cart ? <Skeleton active /> :
                             topCartProducts.length === 0 ? <Text type="secondary" style={{ fontSize: 12 }}>No data yet</Text> :
                             topCartProducts.slice(0, 7).map((p, i) => (
                                <RankedItem
                                    key={p.id} rank={i + 1} image={p.image}
                                    name={p.name} value={p.times_added} label="times"
                                    maxValue={maxCart} color="#8b5cf6"
                                />
                            ))}
                        </Card>
                    </Col>

                    {/* Top Customers */}
                    <Col xs={24} md={8}>
                        <Card
                            title={cardTitle('👑', 'Top Customers')}
                            style={{ height: '100%', borderRadius: 12 }}
                            styles={HEADER_STYLES}
                        >
                            {loading.customers ? <Skeleton active /> :
                             topCustomers.length === 0 ? <Text type="secondary" style={{ fontSize: 12 }}>No data yet</Text> :
                             topCustomers.slice(0, 7).map((c, i) => (
                                <div key={c.customer_id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <div style={{
                                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                        background: i < 3 ? '#6366f1' : '#f1f5f9',
                                        color: i < 3 ? '#fff' : '#94a3b8',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 700,
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: 12, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.customer?.name}</div>
                                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.customer?.phone}</div>
                                        <Progress
                                            percent={maxOrders > 0 ? Math.round((c.order_count / maxOrders) * 100) : 0}
                                            strokeColor="#6366f1"
                                            showInfo={false}
                                            size="small"
                                            style={{ marginBottom: 0 }}
                                        />
                                    </div>
                                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1' }}>{c.order_count} orders</div>
                                        <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>₹{c.total_spent}</div>
                                    </div>
                                </div>
                            ))}
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* ── Plan & Usage ── */}
            <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                    <FireOutlined style={{ marginRight: 6 }} />Plan &amp; Usage
                </div>
                <PlanedUsed />
            </div>

        </Space>
    );
};

export default AnalyticsPage;
