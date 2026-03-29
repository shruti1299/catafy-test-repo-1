import { Card, Col, Row, Space, Statistic } from 'antd';
import { UsergroupAddOutlined, LineChartOutlined, OrderedListOutlined, EyeOutlined, FileFilled, UnorderedListOutlined } from '@ant-design/icons';
import { ICustomerStats } from '@/interfaces/Customer';

const CustomerStats = ({ stats }: { stats: ICustomerStats }) => {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                <Card>
                    <div className='stats'><LineChartOutlined /></div>
                    <Statistic title="Sales" value={stats.total_amount} />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                <Card>
                    <div className='stats'><OrderedListOutlined /></div>
                    <Statistic title="Orders" value={stats.total_order} />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                <Card>
                    <div className='stats'><EyeOutlined /></div>
                    <Statistic title="Views" value={stats.total_amount} />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                <Card>
                    <div className='stats'><UnorderedListOutlined /></div>
                    <Statistic title="Products" value={stats.total_order} />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                <Card>
                    <div className='stats'><FileFilled /></div>
                    <Statistic title="Catalogs" value={stats.total_order} />
                </Card>
            </Col>
        </Row>
    )
}

// 'total_views',
// 'total_orders',
// 'total_sales',
// 'new_customers',
// 'products',
// 'catalogs',
export default CustomerStats;