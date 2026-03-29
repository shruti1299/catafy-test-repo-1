import { Card, Col, Row, Skeleton, Typography } from 'antd';
import {
    UsergroupAddOutlined,
    RiseOutlined,
    ShoppingOutlined,
    EyeOutlined,
    AppstoreOutlined,
    BookOutlined,
} from '@ant-design/icons';
import { IStats } from '@/interfaces/Dashboard';
import { API_ENDPOINTS } from '@/api/endpoints';
import api from '@/api';
import { useEffect, useState } from 'react';

const { Text } = Typography;

const KPI_CONFIG = [
    {
        key: 'new_customers',
        label: 'New Customers',
        icon: <UsergroupAddOutlined style={{ fontSize: 22 }} />,
        color: '#1677ff',
        bg: '#e6f4ff',
        prefix: '',
    },
    {
        key: 'total_sales',
        label: "Today's Sales",
        icon: <RiseOutlined style={{ fontSize: 22 }} />,
        color: '#52c41a',
        bg: '#f6ffed',
        prefix: '₹',
    },
    {
        key: 'total_orders',
        label: 'Orders Today',
        icon: <ShoppingOutlined style={{ fontSize: 22 }} />,
        color: '#fa8c16',
        bg: '#fff7e6',
        prefix: '',
    },
    {
        key: 'total_views',
        label: 'Catalog Views',
        icon: <EyeOutlined style={{ fontSize: 22 }} />,
        color: '#722ed1',
        bg: '#f9f0ff',
        prefix: '',
    },
    {
        key: 'products',
        label: 'Total Products',
        icon: <AppstoreOutlined style={{ fontSize: 22 }} />,
        color: '#13c2c2',
        bg: '#e6fffb',
        prefix: '',
    },
    {
        key: 'catalogs',
        label: 'Total Catalogs',
        icon: <BookOutlined style={{ fontSize: 22 }} />,
        color: '#eb2f96',
        bg: '#fff0f6',
        prefix: '',
    },
];

const StoreStats = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<IStats>({} as IStats);

    useEffect(() => {
        api.get(API_ENDPOINTS.STATS)
            .then(({ data }) => setStats(data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Row gutter={[16, 16]}>
            {KPI_CONFIG.map((cfg) => (
                <Col xs={12} sm={8} md={8} lg={4} key={cfg.key}>
                    <Card
                        size="small"
                        style={{
                            borderRadius: 12,
                            borderTop: `3px solid ${cfg.color}`,
                            height: '100%',
                        }}
                        styles={{ body: { padding: '16px' } }}
                    >
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 1 }} title={false} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 10,
                                        background: cfg.bg,
                                        color: cfg.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {cfg.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
                                        {cfg.prefix}{(stats as any)[cfg.key] ?? 0}
                                    </div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {cfg.label}
                                    </Text>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StoreStats;
