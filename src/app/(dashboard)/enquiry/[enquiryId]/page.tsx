"use client";

import React, { useState, useEffect } from "react";
import { Card, Col, Image, message, Row, Skeleton, Space, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import api from "@/api";
import { CURRENCY_ICON } from "@/constant";
import BackButton from "@/components/common/back-button";
import { API_ENDPOINTS } from "@/api/endpoints";
import { UserOutlined, ShoppingCartOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const HEADER_STYLES = { header: { padding: "10px 16px", minHeight: 44 } };

const STATUS_MAP: Record<number, { color: string; label: string }> = {
  0: { color: "orange", label: "Not Confirmed" },
  1: { color: "blue",   label: "Confirmed"     },
  2: { color: "green",  label: "Delivered"     },
};

const EnquiryDetailPage = () => {
  const { enquiryId } = useParams();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`${API_ENDPOINTS.ENQUIRES}/${enquiryId}`)
      .then(({ data }) => setOrder(data))
      .catch(() => message.error("Failed to load enquiry"))
      .finally(() => setLoading(false));
  }, [enquiryId]);

  if (loading) return (
    <div style={{ paddingBottom: 80 }}>
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
  );
  if (!order) return (
    <div style={{ paddingBottom: 80 }}>
      <BackButton backTo="/enquiry" />
      <Card style={{ borderRadius: 12, textAlign: "center", padding: 32 }}>
        <Typography.Text type="secondary">Enquiry not found or failed to load.</Typography.Text>
      </Card>
    </div>
  );

  const status = STATUS_MAP[order?.status] ?? { color: "default", label: "Unknown" };

  return (
    <div style={{ paddingBottom: 80 }}>
      <BackButton backTo="/enquiry" />

      <Row gutter={[16, 16]}>
        {/* Left — order + customer info */}
        <Col xs={24} md={12}>
          <Card
            size="small"
            title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}><InfoCircleOutlined style={{ color: "#6366f1", marginRight: 6 }} />Enquiry Detail</span>}
            styles={HEADER_STYLES}
            style={{ marginBottom: 16, borderRadius: 12 }}
          >
            {[
              { label: "Enquiry ID", value: `#${order.s_no}` },
              { label: "Placed At",  value: order.created_at },
              { label: "Status",     value: <Tag color={status.color} style={{ fontSize: 11, borderRadius: 4, margin: 0 }}>{status.label}</Tag> },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
                <Text style={{ fontSize: 12, color: "#64748b" }}>{r.label}</Text>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{r.value}</span>
              </div>
            ))}
          </Card>

          <Card
            size="small"
            title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}><UserOutlined style={{ color: "#6366f1", marginRight: 6 }} />Customer Info</span>}
            styles={HEADER_STYLES}
            style={{ borderRadius: 12 }}
          >
            {[
              { label: "Name",  value: order.customer?.name  || "—" },
              { label: "Email", value: order.customer?.email || "—" },
              { label: "Phone", value: order.customer?.phone || "—" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
                <Text style={{ fontSize: 12, color: "#64748b" }}>{r.label}</Text>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{r.value}</span>
              </div>
            ))}
          </Card>
        </Col>

        {/* Right — products */}
        <Col xs={24} md={12}>
          <Card
            size="small"
            title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}><ShoppingCartOutlined style={{ color: "#6366f1", marginRight: 6 }} />Products</span>}
            styles={HEADER_STYLES}
            style={{ borderRadius: 12 }}
          >
            {(order.products ?? []).length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 12 }}>No products</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {order.products.map((item: any, i: number) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px", borderRadius: 8, background: "#fafafa", border: "1px solid #f1f5f9",
                  }}>
                    {item.image && (
                      <Image src={item.image} alt={item.name} width={44} height={44}
                        style={{ objectFit: "cover", borderRadius: 6 }} preview={false} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name || "Unnamed Product"}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", flexShrink: 0 }}>
                      {CURRENCY_ICON}{item.price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EnquiryDetailPage;
