"use client";

import React, { useState, useEffect } from "react";
import {
  Button, Card, Col, Image, message, Row, Space, Table, Tabs, TabsProps, Tag,
  Typography, Skeleton,
} from "antd";
import { useParams } from "next/navigation";
import api from "@/api";
import BackButton from "@/components/common/back-button";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ICustomerDetail } from "@/interfaces/Customer";
import { formatDateOnly, formatDateTimeAMPM } from "@/utils/helper";
import Link from "next/link";
import { IOrder } from "@/interfaces/Order";
import OrderActions from "../../orders/components/orderActions";
import { CURRENCY_ICON } from "@/constant";
import CustomerActions from "../components/customerActions";
import EditCustomerDrawer from "../components/editCustomerDrawer";
import {
  UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined,
  ShoppingCartOutlined, EyeOutlined, EditOutlined,
  TrophyOutlined, InboxOutlined,
} from "@ant-design/icons";
import { getOrderStatus } from "@/utils/orderStatus";

const { Text } = Typography;

const HEADER_STYLES = { header: { padding: "10px 16px", minHeight: 44 } };

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  pending:  { color: "orange", label: "Pending"  },
  allowed:  { color: "green",  label: "Allowed"  },
  rejected: { color: "red",    label: "Rejected" },
};

/* ── Stat tile ─────────────────────────────────────────────── */
const StatTile = ({
  icon, label, value, color = "#6366f1", bg = "#eef2ff",
}: {
  icon: React.ReactNode; label: string; value: React.ReactNode; color?: string; bg?: string;
}) => (
  <div style={{
    padding: "12px 14px", borderRadius: 10,
    background: bg, display: "flex", alignItems: "center", gap: 10,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
      background: `${color}20`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1.1 }}>{value ?? "—"}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

/* ── Main page ─────────────────────────────────────────────── */
const CustomerDetailPage = () => {
  const { customerId } = useParams();
  if (!customerId) return null;

  const [customer, setCustomer]     = useState<ICustomerDetail | null>(null);
  const [loading, setLoading]       = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats]           = useState<any>({});
  const [orders, setOrders]         = useState<IOrder[]>([]);
  const [editOpen, setEditOpen]     = useState(false);

  const fetchData = async () => {
    try {
      const { data } = await api.get(`${API_ENDPOINTS.CUSTOMERS}/${customerId}`);
      setCustomer(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const { data } = await api.get(`/customers/${customerId}/stats`);
      setStats(data);
    } catch {
      message.error("Failed to load customer stats");
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrderLoading(true);
    try {
      const { data } = await api.get(`/customers/${customerId}/orders`);
      setOrders(data.data);
    } catch {
      message.error("Failed to load customer orders");
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStats();
    fetchOrders();
  }, [customerId]);

  const orderColumns = [
    {
      title: "Order",
      dataIndex: "s_no",
      render: (text: string, { id }: IOrder) => (
        <Link href={`/orders/${id}`}>
          <span style={{ fontWeight: 600, fontSize: 12, color: "#6366f1" }}>#{text}</span>
        </Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "order_datetime",
      render: (v: string) => (
        <span style={{ fontSize: 11, color: "#64748b" }}>{formatDateTimeAMPM(v)}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "total",
      render: (total: number) => (
        <span style={{ fontWeight: 700, fontSize: 13, color: "#10b981" }}>{CURRENCY_ICON}{total}</span>
      ),
    },
    {
      title: "Items",
      dataIndex: "items_count",
      render: (n: number) => (
        <span style={{ fontSize: 11, color: "#64748b" }}>{n} item{n !== 1 ? "s" : ""}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: number) => {
        const s = getOrderStatus(status);
        return (
          <Tag
            color={s.tagColor}
            style={{ fontSize: 10, borderRadius: 4, margin: 0, padding: "0 5px", lineHeight: "18px" }}
          >
            {s.message}
          </Tag>
        );
      },
    },
    {
      title: "",
      render: (_: any, record: IOrder) => (
        <Space size={4}>
          <OrderActions order={record} />
          <Link href={`/orders/${record.id}`}>
            <Button
              size="small"
              type="primary"
              style={{ fontSize: 11, background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" }}
            >
              View
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  const tabItems: TabsProps["items"] = [
    {
      key: "stats",
      label: "📊 Stats",
      children: <CustomerStats loading={statsLoading} stats={stats} />,
    },
    {
      key: "orders",
      label: "🛒 Orders",
      children: (
        <Table<IOrder>
          size="small"
          columns={orderColumns}
          dataSource={orders}
          loading={orderLoading}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{ size: "small", pageSize: 10, showSizeChanger: false }}
          locale={{
            emptyText: (
              <div style={{ padding: "32px 0", textAlign: "center", color: "#94a3b8" }}>
                <ShoppingCartOutlined style={{ fontSize: 28, display: "block", marginBottom: 6 }} />
                No orders yet
              </div>
            ),
          }}
        />
      ),
    },
  ];

  const statusStyle = customer?.access_status ? STATUS_STYLE[customer.access_status] : null;

  return (
    <div style={{ paddingBottom: 80 }}>
      <BackButton backTo="/customers" />

      {/* ── Profile card ── */}
      <Card
        loading={loading}
        style={{ marginBottom: 16, borderRadius: 12 }}
        styles={{ body: { padding: "16px 20px" } }}
      >
        {!loading && customer && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{
              width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, color: "#fff",
            }}>
              {customer.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{customer.name}</span>
                {statusStyle && (
                  <Tag color={statusStyle.color} style={{ fontSize: 11, borderRadius: 5, margin: 0 }}>
                    {statusStyle.label}
                  </Tag>
                )}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  <PhoneOutlined style={{ marginRight: 4, color: "#6366f1" }} />
                  {customer.country_code} {customer.phone}
                </span>
                {customer.email && (
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    <MailOutlined style={{ marginRight: 4, color: "#6366f1" }} />
                    {customer.email}
                  </span>
                )}
                {customer.address?.city && (
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    <EnvironmentOutlined style={{ marginRight: 4, color: "#6366f1" }} />
                    {[customer.address.city, customer.address.state].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
              {customer.address?.address && (
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                  {customer.address.address}
                  {customer.address.pincode ? ` — ${customer.address.pincode}` : ""}
                </div>
              )}
            </div>

            {/* Actions */}
            <Space wrap>
              {customer.id && (
                <CustomerActions customerID={customer.id} status={customer.access_status} isShowAllow isShowBlock={customer.access_status !== "allowed"} />
              )}
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => setEditOpen(true)}
                style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none", color: "#fff", fontSize: 12 }}
              >
                Edit
              </Button>
            </Space>
          </div>
        )}
      </Card>

      {/* ── Tabs ── */}
      <Card
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: "0 16px 16px" } }}
      >
        <Tabs size="small" items={tabItems} style={{ marginTop: 0 }} />
      </Card>

      <EditCustomerDrawer
        open={editOpen}
        customer={customer}
        onClose={() => setEditOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

/* ── Customer Stats ─────────────────────────────────────────── */
const CustomerStats = ({ loading, stats }: { loading: boolean; stats: any }) => {
  const tiles = [
    { icon: <ShoppingCartOutlined />, label: "Total Orders",  value: stats.total_orders,  color: "#6366f1", bg: "#eef2ff" },
    { icon: <span style={{ fontWeight: 700 }}>₹</span>, label: "Total Spent", value: stats.total_sales != null ? `₹${Number(stats.total_sales).toFixed(0)}` : "—", color: "#10b981", bg: "#f0fdf4" },
    { icon: <InboxOutlined />, label: "Total Qty",      value: stats.total_quantity,  color: "#f97316", bg: "#fff7ed" },
    { icon: <EyeOutlined />,  label: "Catalog Views",  value: stats.total_views,     color: "#8b5cf6", bg: "#f5f3ff" },
    { icon: <EyeOutlined />,  label: "Unique Products Viewed", value: stats.unique_products_viewed, color: "#0ea5e9", bg: "#f0f9ff" },
    { icon: <ShoppingCartOutlined />, label: "Avg Orders/Month", value: stats.avg_orders_per_month, color: "#ec4899", bg: "#fdf2f8" },
  ];

  if (loading) return <Skeleton active />;

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Stat tiles */}
      <Row gutter={[12, 12]} style={{ marginBottom: 20 }}>
        {tiles.map(t => (
          <Col xs={12} sm={8} md={6} key={t.label}>
            <StatTile {...t} />
          </Col>
        ))}
      </Row>

      {/* Date info */}
      <Row gutter={[12, 8]} style={{ marginBottom: 20 }}>
        {stats.last_order_date && (
          <Col xs={24} sm={12}>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Last Order: <b style={{ color: "#1e293b" }}>{formatDateOnly(stats.last_order_date)}</b>
            </div>
          </Col>
        )}
        {stats.last_viewed_date && (
          <Col xs={24} sm={12}>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Last Viewed: <b style={{ color: "#1e293b" }}>{formatDateOnly(stats.last_viewed_date)}</b>
            </div>
          </Col>
        )}
      </Row>

      {/* Top ordered products */}
      {stats.top_ordered_products?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
            <TrophyOutlined style={{ color: "#f97316", marginRight: 6 }} />Top Ordered Products
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {stats.top_ordered_products.slice(0, 5).map((item: any) => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 8, background: "#fafafa", border: "1px solid #f1f5f9",
              }}>
                {item.image && <Image src={item.image} alt={item.name} width={36} height={36} style={{ objectFit: "cover", borderRadius: 6 }} preview={false} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                </div>
                <Tag color="orange" style={{ fontSize: 11, borderRadius: 4, margin: 0 }}>{item.total_quantity} pcs</Tag>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently viewed */}
      {stats.recently_viewed?.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
            <EyeOutlined style={{ color: "#8b5cf6", marginRight: 6 }} />Recently Viewed
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {stats.recently_viewed.slice(0, 5).map((item: any) => (
              <div key={item.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 8, background: "#fafafa", border: "1px solid #f1f5f9",
              }}>
                {item.image && <Image src={item.image} alt={item.name} width={36} height={36} style={{ objectFit: "cover", borderRadius: 6 }} preview={false} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Viewed {formatDateOnly(item.viewed_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage;
