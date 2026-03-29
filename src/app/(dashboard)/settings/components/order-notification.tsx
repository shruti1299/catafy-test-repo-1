"use client";

import React from "react";
import { Card, Switch, Tag } from "antd";
import {
  MailOutlined, MessageOutlined, WhatsAppOutlined,
  BellOutlined, UserOutlined, ShopOutlined,
} from "@ant-design/icons";

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
    marginBottom: 12,
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

/* ── Toggle row ─────────────────────────────────────────────── */
const ToggleRow = ({
  icon, emoji, title, desc, checked, disabled, onChange,
}: {
  icon: React.ReactNode; emoji: string; title: string; desc: string;
  checked: boolean; disabled?: boolean; onChange: (v: boolean) => void;
}) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 12px", borderRadius: 8,
    background: "#fafafa", border: "1px solid #f1f5f9",
    marginBottom: 8,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 6, flexShrink: 0,
        background: "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, color: "#64748b",
      }}>{icon}</div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{emoji} {title}</span>
          {disabled && <Tag color="default" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>Coming Soon</Tag>}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>{desc}</div>
      </div>
    </div>
    <Switch
      size="small"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  </div>
);

/* ── Main component ─────────────────────────────────────────── */
const OrderNotification = () => {
  const [settings, setSettings] = React.useState({
    customer_sms: false,
    customer_email: true,
    customer_whatsapp: false,
    seller_sms: false,
    seller_email: true,
    seller_whatsapp: false,
    seller_push: true,
  });

  const toggle = (key: keyof typeof settings) => (value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🔔 Order Notifications</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      {/* ── Customer notifications ── */}
      <Section
        icon={<UserOutlined />}
        color="#6366f1" bg="#eef2ff"
        title="Customer Notifications"
        desc="Notify your buyers automatically when their order is placed or updated"
      />

      <ToggleRow
        icon={<MessageOutlined />} emoji="📱" title="SMS to Customer"
        desc="Send order confirmation via SMS (requires SMS plan)"
        checked={settings.customer_sms} disabled
        onChange={toggle("customer_sms")}
      />
      <ToggleRow
        icon={<MailOutlined />} emoji="📧" title="Email to Customer"
        desc="Send order confirmation and updates by email"
        checked={settings.customer_email}
        onChange={toggle("customer_email")}
      />
      <ToggleRow
        icon={<WhatsAppOutlined />} emoji="💬" title="WhatsApp to Customer"
        desc="Send order details via WhatsApp (requires WhatsApp integration)"
        checked={settings.customer_whatsapp} disabled
        onChange={toggle("customer_whatsapp")}
      />

      <div style={{ marginBottom: 20 }} />

      {/* ── Seller notifications ── */}
      <Section
        icon={<ShopOutlined />}
        color="#10b981" bg="#f0fdf4"
        title="Seller Notifications (You)"
        desc="Get notified when new orders come in or orders are updated"
      />

      <ToggleRow
        icon={<MessageOutlined />} emoji="📱" title="SMS to You"
        desc="Receive SMS alerts for new orders (requires SMS plan)"
        checked={settings.seller_sms} disabled
        onChange={toggle("seller_sms")}
      />
      <ToggleRow
        icon={<MailOutlined />} emoji="📧" title="Email to You"
        desc="Get email alerts for every new order"
        checked={settings.seller_email}
        onChange={toggle("seller_email")}
      />
      <ToggleRow
        icon={<WhatsAppOutlined />} emoji="💬" title="WhatsApp to You"
        desc="Get WhatsApp alerts for new orders"
        checked={settings.seller_whatsapp} disabled
        onChange={toggle("seller_whatsapp")}
      />
      <ToggleRow
        icon={<BellOutlined />} emoji="🔔" title="Push Notifications"
        desc="Browser or app push notifications for new orders"
        checked={settings.seller_push}
        onChange={toggle("seller_push")}
      />
    </Card>
  );
};

export default OrderNotification;
