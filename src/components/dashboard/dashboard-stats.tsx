import { IStats } from '@/interfaces/Dashboard';
import { Button, Card, Col, Row } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import DashboardSalesGraph from '../stats/dashboard-sales-graph';
import RangePicker from '../common/rangepicker';

const DashboardStats = ({ stats, loading }: { stats: IStats; loading: boolean }) => {
  return (
    <Card
      loading={loading}
      title={<span style={{ fontWeight: 700 }}>📊 Sales Overview</span>}
      extra={
        <Link href="/analytics">
          <Button type="link" size="small" style={{ padding: 0, fontSize: 12 }}>
            Full Analytics <DoubleRightOutlined />
          </Button>
        </Link>
      }
      style={{ borderRadius: 12 }}
    >
      <DashboardSalesGraph />
    </Card>
  );
};

export default DashboardStats;
