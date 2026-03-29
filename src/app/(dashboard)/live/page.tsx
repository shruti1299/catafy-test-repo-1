'use client';

import React, { useMemo, useState, useEffect } from 'react';
import useSWR from 'swr';
import {
    Badge, Card, Col, Empty, Image, Progress, Row, Skeleton, Tag, Typography,
} from 'antd';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title as ChartTitle,
    Tooltip as ChartTooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import api from '@/api';
import BackButton from '@/components/common/back-button';
import {
    EyeOutlined,
    FireFilled,
    MobileOutlined,
    DesktopOutlined,
    ReloadOutlined,
    ShoppingOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { BASE_OPTIONS, C, PIE_COLORS_A, TOOLTIP } from '@/components/stats/chartTheme';
import Link from 'next/link';

dayjs.extend(relativeTime);

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, ChartTitle, ChartTooltip, Legend, Filler
);

const { Text } = Typography;

const LIVE_INTERVAL    = 30_000;   // 30 s
const RECENT_INTERVAL  = 600_000;  // 10 min

const fetcher = (url: string) => api.get(url).then(r => r.data);

/* ── helpers ─────────────────────────────────────────────── */
const isLiveVisitor = (last_seen_at: string) =>
    dayjs().diff(dayjs(last_seen_at), 'minute') <= 10;

/** Simplify raw user-agent string into a human label */
const parseDevice = (ua: string): { label: string; icon: React.ReactNode } => {
    const s = ua.toLowerCase();
    if (s.includes('mobile') || s.includes('android') || s.includes('iphone'))
        return { label: 'Mobile', icon: <MobileOutlined /> };
    if (s.includes('tablet') || s.includes('ipad'))
        return { label: 'Tablet', icon: <MobileOutlined /> };
    return { label: 'Desktop', icon: <DesktopOutlined /> };
};

const aggregateDevices = (raw: Record<string, number>) => {
    const agg: Record<string, number> = {};
    for (const [ua, count] of Object.entries(raw)) {
        const { label } = parseDevice(ua);
        agg[label] = (agg[label] ?? 0) + count;
    }
    return agg;
};

/* ── sub-components ─────────────────────────────────────── */

function PulsingDot({ color = '#10b981' }: { color?: string }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 12, height: 12, position: 'relative' }}>
            <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: color, opacity: 0.35,
                animation: 'pulse-ring 1.8s ease-out infinite',
            }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <style>{`@keyframes pulse-ring { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(2.4);opacity:0} }`}</style>
        </span>
    );
}

function StatCard({
    icon, label, value, sub, color = C.indigo, bg = '#eef2ff', loading,
}: {
    icon: React.ReactNode; label: string; value: React.ReactNode;
    sub?: string; color?: string; bg?: string; loading?: boolean;
}) {
    return (
        <Card
            style={{ borderRadius: 14, border: 'none', background: bg }}
            styles={{ body: { padding: '16px 18px' } }}
        >
            {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: `${color}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, color,
                    }}>
                        {icon}
                    </div>
                    <div>
                        <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginTop: 2 }}>{label}</div>
                        {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{sub}</div>}
                    </div>
                </div>
            )}
        </Card>
    );
}

function CustomerRow({ row, index }: { row: any; index: number }) {
    const live = isLiveVisitor(row.last_seen_at);
    const initial = row.name?.charAt(0)?.toUpperCase() ?? '?';

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px',
            borderBottom: '1px solid #f1f5f9',
            background: live ? '#f0fdf4' : 'transparent',
            transition: 'background 0.2s',
        }}>
            {/* rank */}
            <span style={{ fontSize: 11, color: '#94a3b8', minWidth: 16, textAlign: 'center' }}>
                {index + 1}
            </span>
            {/* avatar */}
            <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: live ? '#dcfce7' : '#f1f5f9',
                color: live ? '#16a34a' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
            }}>
                {initial}
            </div>
            {/* info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.name || 'Guest'}
                    </span>
                    {row.phone && (
                        <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>{row.phone}</span>
                    )}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Viewing: <b style={{ color: '#374151' }}>{row.last_product || '—'}</b>
                </div>
            </div>
            {/* status + time */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                {live ? (
                    <Tag
                        color="success"
                        style={{ fontSize: 10, margin: 0, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, lineHeight: '18px' }}
                    >
                        <PulsingDot color="#16a34a" /> Live
                    </Tag>
                ) : (
                    <Tag style={{ fontSize: 10, margin: 0, borderRadius: 6, lineHeight: '18px', color: '#94a3b8' }}>Idle</Tag>
                )}
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{dayjs(row.last_seen_at).fromNow()}</span>
            </div>
        </div>
    );
}

function ProductRow({ row, index, maxViews }: { row: any; index: number; maxViews: number }) {
    const views = row.views ?? row.count ?? 0;
    const pct   = maxViews > 0 ? Math.round((views / maxViews) * 100) : 0;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px',
            borderBottom: '1px solid #f1f5f9',
        }}>
            {/* image */}
            {row.image ? (
                <Image
                    src={row.image}
                    width={40} height={40}
                    style={{ objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                    preview={false}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
            ) : (
                <div style={{
                    width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                    background: '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <ShoppingOutlined style={{ color: '#94a3b8' }} />
                </div>
            )}
            {/* name + bar */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                    {row.name || `Product #${row.product_id}`}
                </div>
                <Progress
                    percent={pct}
                    strokeColor={C.indigo}
                    trailColor="#e2e8f0"
                    showInfo={false}
                    size="small"
                    style={{ marginBottom: 0 }}
                />
            </div>
            {/* stats */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                <Tag color="blue" style={{ margin: 0, fontSize: 10, lineHeight: '18px' }}>
                    <EyeOutlined style={{ marginRight: 3 }} />{views}
                </Tag>
                {row.unique_customers > 0 && (
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>
                        {row.unique_customers} unique
                    </span>
                )}
            </div>
        </div>
    );
}

/* ── main page ──────────────────────────────────────────── */
export default function LiveAnalyticsPage() {
    const [countdown, setCountdown] = useState(LIVE_INTERVAL / 1000);

    const { data: liveData, isLoading: liveLoading, mutate: mutateLive } = useSWR(
        '/live',
        fetcher,
        {
            refreshInterval: LIVE_INTERVAL,
            onSuccess: () => setCountdown(LIVE_INTERVAL / 1000),
        }
    );

    const { data: recentData, isLoading: recentLoading } = useSWR(
        '/analytics/recent?days=15',
        fetcher,
        { refreshInterval: RECENT_INTERVAL }
    );

    /* countdown ticker */
    useEffect(() => {
        const t = setInterval(() => setCountdown(c => (c <= 1 ? LIVE_INTERVAL / 1000 : c - 1)), 1000);
        return () => clearInterval(t);
    }, []);

    const totalActive      = liveData?.total_active     ?? 0;
    const uniqueCustomers  = liveData?.unique_customers  ?? 0;
    const topProducts      = liveData?.top_products      ?? [];
    const activeCustomers  = liveData?.active_customers  ?? [];
    const since            = liveData?.since ? dayjs(liveData.since) : null;
    const maxViews         = Math.max(...topProducts.map((p: any) => p.views ?? p.count ?? 0), 1);

    /* device doughnut */
    const deviceAgg = aggregateDevices(liveData?.device ?? {});
    const deviceLabels = Object.keys(deviceAgg);
    const deviceValues = Object.values(deviceAgg) as number[];

    const doughnutData = {
        labels: deviceLabels,
        datasets: [{
            data: deviceValues,
            backgroundColor: PIE_COLORS_A.slice(0, deviceLabels.length),
            borderWidth: 0,
            hoverOffset: 6,
        }],
    };
    const doughnutOptions: any = {
        responsive: true,
        cutout: '68%',
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 }, color: '#64748b' } },
            tooltip: TOOLTIP,
        },
    };

    /* 15-day trend */
    const trendSeries = (recentData?.series ?? []).map((s: any) => ({ d: s.d, views: s.views }));
    const trendData = {
        labels: trendSeries.map((s: any) => dayjs(s.d).format('D MMM')),
        datasets: [{
            label: 'Daily Views',
            data: trendSeries.map((s: any) => s.views),
            fill: true,
            tension: 0.4,
            borderColor: C.indigo,
            backgroundColor: C.indigoA,
            pointRadius: 3,
            pointBackgroundColor: C.indigo,
            borderWidth: 2,
        }],
    };
    const trendOptions: any = {
        ...BASE_OPTIONS,
        scales: { x: BASE_OPTIONS.scales.x, y: { ...BASE_OPTIONS.scales.y, beginAtZero: true } },
    };

    /* top products bar */
    const barData = {
        labels: topProducts.slice(0, 7).map((p: any) => p.name?.split(' ').slice(0, 3).join(' ') || `#${p.product_id}`),
        datasets: [{
            label: 'Views',
            data: topProducts.slice(0, 7).map((p: any) => p.views ?? p.count ?? 0),
            backgroundColor: C.indigoA,
            hoverBackgroundColor: C.indigo,
            borderColor: C.indigo,
            borderWidth: 1.5,
            borderRadius: 6,
            borderSkipped: false,
        }],
    };
    const barOptions: any = {
        ...BASE_OPTIONS,
        indexAxis: 'y' as const,
        scales: {
            x: { ...BASE_OPTIONS.scales.x, beginAtZero: true },
            y: { ...BASE_OPTIONS.scales.y, grid: { display: false } },
        },
    };

    const HEADER = { header: { padding: '10px 16px', minHeight: 44 } };
    const cardTitle = (icon: React.ReactNode, label: string) => (
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
            <span style={{ marginRight: 6 }}>{icon}</span>{label}
        </span>
    );

    return (
        <div style={{ paddingBottom: 80 }}>

            {/* ── top bar ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <BackButton backTo="/" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>
                        {since ? `Updated ${since.fromNow()}` : 'Waiting for data…'}
                    </span>
                    <div
                        onClick={() => { mutateLive(); setCountdown(LIVE_INTERVAL / 1000); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            padding: '4px 10px', borderRadius: 20,
                            background: '#f1f5f9', cursor: 'pointer',
                            fontSize: 11, color: '#6366f1', fontWeight: 600,
                            userSelect: 'none',
                        }}
                    >
                        <ReloadOutlined style={{ fontSize: 11 }} />
                        Refresh in {countdown}s
                    </div>
                </div>
            </div>

            {/* ── hero ── */}
            <div style={{
                borderRadius: 16,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
                padding: '24px 28px',
                marginBottom: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 16,
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <PulsingDot color="#a5f3fc" />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Live Now
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                        <span style={{ fontSize: 56, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                            {liveLoading ? '—' : totalActive}
                        </span>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Active Visitors</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>in the last 10 minutes</div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Unique Customers', value: uniqueCustomers, color: '#a5f3fc' },
                        { label: 'Products Being Viewed', value: topProducts.length, color: '#fde68a' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: 'rgba(255,255,255,0.12)',
                            borderRadius: 12, padding: '12px 20px',
                            backdropFilter: 'blur(8px)',
                        }}>
                            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── stat row ── */}
            <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
                <Col xs={12} sm={6}>
                    <StatCard icon={<FireFilled />} label="Active Now" value={totalActive}
                        sub="last 10 min" color={C.red} bg="#fef2f2" loading={liveLoading} />
                </Col>
                <Col xs={12} sm={6}>
                    <StatCard icon={<TeamOutlined />} label="Unique Customers" value={uniqueCustomers}
                        sub="distinct visitors" color={C.green} bg="#f0fdf4" loading={liveLoading} />
                </Col>
                <Col xs={12} sm={6}>
                    <StatCard icon={<ShoppingOutlined />} label="Hot Products" value={topProducts.length}
                        sub="products with views" color={C.amber} bg="#fffbeb" loading={liveLoading} />
                </Col>
                <Col xs={12} sm={6}>
                    <StatCard icon={<EyeOutlined />} label="Total Views (session)"
                        value={topProducts.reduce((s: number, p: any) => s + (p.views ?? p.count ?? 0), 0)}
                        sub="across all products" color={C.indigo} bg="#eef2ff" loading={liveLoading} />
                </Col>
            </Row>

            {/* ── main content ── */}
            <Row gutter={[16, 16]}>

                {/* ── LEFT column ── */}
                <Col xs={24} lg={14}>

                    {/* Active customers feed */}
                    <Card
                        title={cardTitle(<span style={{ color: C.green }}><TeamOutlined /></span>, 'Active Visitors')}
                        styles={HEADER}
                        style={{ borderRadius: 14, marginBottom: 16 }}
                        extra={
                            <Badge
                                count={activeCustomers.filter((c: any) => isLiveVisitor(c.last_seen_at)).length}
                                color={C.green}
                                style={{ fontSize: 10 }}
                                overflowCount={99}
                            >
                                <span style={{ fontSize: 11, color: '#64748b', paddingRight: 6 }}>Live</span>
                            </Badge>
                        }
                    >
                        {liveLoading ? (
                            <Skeleton active paragraph={{ rows: 5 }} />
                        ) : activeCustomers.length === 0 ? (
                            <Empty
                                description={<span style={{ fontSize: 12, color: '#94a3b8' }}>No active visitors right now</span>}
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{ padding: '24px 0' }}
                            />
                        ) : (
                            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                                {activeCustomers.map((row: any, i: number) => (
                                    <CustomerRow key={row.id ?? `${row.name}-${i}`} row={row} index={i} />
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Hot products feed */}
                    <Card
                        title={cardTitle(<span style={{ color: C.amber }}>🔥</span>, 'Hot Products Right Now')}
                        styles={HEADER}
                        style={{ borderRadius: 14, marginBottom: 16 }}
                        extra={<Link href="/inventory" style={{ fontSize: 12, color: C.indigo }}>View all →</Link>}
                    >
                        {liveLoading ? (
                            <Skeleton active paragraph={{ rows: 5 }} />
                        ) : topProducts.length === 0 ? (
                            <Empty
                                description={<span style={{ fontSize: 12, color: '#94a3b8' }}>No product views yet</span>}
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{ padding: '24px 0' }}
                            />
                        ) : (
                            <div>
                                {topProducts.map((row: any, i: number) => (
                                    <ProductRow key={row.product_id ?? i} row={row} index={i} maxViews={maxViews} />
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* 15-day trend */}
                    <Card
                        title={cardTitle(<EyeOutlined style={{ color: C.indigo }} />, 'Views — Last 15 Days')}
                        styles={HEADER}
                        style={{ borderRadius: 14 }}
                        loading={recentLoading}
                    >
                        {trendSeries.length > 0 ? (
                            <Line data={trendData} options={trendOptions} />
                        ) : (
                            <Empty description="No view data yet" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: '24px 0' }} />
                        )}
                    </Card>

                </Col>

                {/* ── RIGHT column ── */}
                <Col xs={24} lg={10}>

                    {/* Products bar chart */}
                    <Card
                        title={cardTitle(<ShoppingOutlined style={{ color: C.violet }} />, 'Top Viewed Products')}
                        styles={HEADER}
                        style={{ borderRadius: 14, marginBottom: 16 }}
                    >
                        {liveLoading ? (
                            <Skeleton active paragraph={{ rows: 5 }} />
                        ) : topProducts.length === 0 ? (
                            <Empty description="No data yet" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: '24px 0' }} />
                        ) : (
                            <Bar data={barData} options={barOptions} />
                        )}
                    </Card>

                    {/* Device breakdown */}
                    <Card
                        title={cardTitle(<DesktopOutlined style={{ color: C.sky }} />, 'Device Breakdown')}
                        styles={HEADER}
                        style={{ borderRadius: 14, marginBottom: 16 }}
                    >
                        {liveLoading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : deviceLabels.length === 0 ? (
                            <Empty description="No device data" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: '24px 0' }} />
                        ) : (
                            <div>
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {deviceLabels.map((label, i) => (
                                        <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{
                                                    display: 'inline-block', width: 10, height: 10,
                                                    borderRadius: 2, background: PIE_COLORS_A[i % PIE_COLORS_A.length], flexShrink: 0,
                                                }} />
                                                <Text style={{ fontSize: 12, color: '#475569' }}>{label}</Text>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Text style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{deviceValues[i]}</Text>
                                                <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                                                    ({Math.round((deviceValues[i] / (deviceValues.reduce((a, b) => a + b, 0) || 1)) * 100)}%)
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Auto-refresh card */}
                    <Card
                        styles={{ body: { padding: '14px 16px' } }}
                        style={{ borderRadius: 14, background: '#fafafe', border: '1px dashed #c7d2fe' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Text strong style={{ fontSize: 12, color: '#4338ca', display: 'block' }}>Auto-refresh</Text>
                                <Text style={{ fontSize: 11, color: '#94a3b8' }}>Live data refreshes every 30s</Text>
                            </div>
                            <Progress
                                type="circle"
                                percent={Math.round(((LIVE_INTERVAL / 1000 - countdown) / (LIVE_INTERVAL / 1000)) * 100)}
                                size={48}
                                strokeColor={C.indigo}
                                trailColor="#e0e7ff"
                                format={() => <span style={{ fontSize: 11, fontWeight: 700, color: C.indigo }}>{countdown}s</span>}
                            />
                        </div>
                    </Card>

                </Col>
            </Row>
        </div>
    );
}
