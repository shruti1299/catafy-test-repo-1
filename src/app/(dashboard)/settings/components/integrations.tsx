"use client";

import React, { useState } from "react";
import {
  Card, Typography, Row, Col, Button, Tag, notification,
} from "antd";
import {
  ApiOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";

/* ── Section header ─────────────────────────────────────────── */
const Section = ({
  icon, color = "#6366f1", bg = "#eef2ff", title, desc,
}: {
  icon: React.ReactNode; color?: string; bg?: string; title: string; desc: string;
}) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 14px", borderRadius: 10,
    background: bg, border: `1px solid ${color}22`,
    marginBottom: 20,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
      background: `${color}18`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, fontSize: 17,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{desc}</div>
    </div>
  </div>
);

type IntegrationStatus = {
  zoho_books: boolean;
  zoho_inventory: boolean;
};

const INTEGRATIONS: { key: keyof IntegrationStatus; title: string; description: string }[] = [
  {
    key: "zoho_books",
    title: "Zoho Books",
    description: "Automatically create invoices in Zoho Books whenever a new order is placed in your store.",
  },
  {
    key: "zoho_inventory",
    title: "Zoho Inventory",
    description: "Sync product stock and inventory data between your store and Zoho Inventory in real-time.",
  },
];

/* ── Main component ─────────────────────────────────────────── */
export default function Integrations() {
  const [status] = useState<IntegrationStatus>({
    zoho_books: false,
    zoho_inventory: false,
  });

  const handleToggle = () => {
    notification.info({
      message: "Contact Support",
      description: "Connect with the Catafy support team to start this integration.",
      placement: "bottomRight",
    });
  };

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🔗 App Integrations</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <Section
        icon={<ApiOutlined />}
        color="#6366f1" bg="#eef2ff"
        title="Third-Party App Integrations"
        desc="Connect your store with external platforms to automate invoicing and inventory management"
      />

      <div style={{
        padding: "10px 12px", borderRadius: 8, marginBottom: 20,
        background: "#fffbeb", border: "1px solid #fde68a",
        fontSize: 11, color: "#92400e",
      }}>
        💬 To enable integrations, please contact Catafy support. Our team will set it up for you within 24 hours.
      </div>

      <Row gutter={[16, 16]}>
        {INTEGRATIONS.map((integration) => {
          const isConnected = status[integration.key];
          return (
            <Col xs={24} md={12} key={integration.key}>
              <div style={{
                padding: "16px", borderRadius: 10,
                border: `1.5px solid ${isConnected ? "#10b981" : "#e2e8f0"}`,
                background: isConnected ? "#f0fdf4" : "#fafafa",
                height: "100%",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Image
                    alt="zoho_logo"
                    height={40}
                    width={100}
                    src="https://www.zohowebstatic.com/sites/zweb/images/commonroot/zoho-logo-web.svg"
                    style={{ objectFit: "contain" }}
                  />
                  <Tag
                    color={isConnected ? "success" : "default"}
                    icon={isConnected ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    style={{ fontSize: 11, borderRadius: 4, margin: 0 }}
                  >
                    {isConnected ? "Connected" : "Not Connected"}
                  </Tag>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                    {integration.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
                    {integration.description}
                  </div>
                </div>

                <Button
                  type={isConnected ? "default" : "primary"}
                  danger={isConnected}
                  size="small"
                  onClick={handleToggle}
                  style={!isConnected ? {
                    background: "linear-gradient(90deg,#6366f1,#818cf8)",
                    border: "none", fontSize: 12,
                  } : { fontSize: 12 }}
                >
                  {isConnected ? "Disconnect" : "Connect via Support"}
                </Button>
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
}
