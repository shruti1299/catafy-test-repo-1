"use client";

import React, { useState } from "react";
import {
  Card, Switch, Tag, Modal, message,
} from "antd";
import {
  CreditCardOutlined, LockOutlined,
} from "@ant-design/icons";
import {
  CashIcon, PaypalIcon, PaytmIcon, PhonePayIcon,
} from "@/svg/index";

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
    marginBottom: 16,
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

/* ── Payment methods ────────────────────────────────────────── */
const PAYMENT_METHODS = [
  {
    key: "phonepe",
    name: "PhonePe",
    icon: <PhonePayIcon />,
    description: "Accept UPI payments via PhonePe gateway.",
    comingSoon: false,
  },
  {
    key: "paypal",
    name: "PayPal",
    icon: <PaypalIcon />,
    description: "Accept international card payments via PayPal.",
    comingSoon: false,
  },
  {
    key: "cod",
    name: "Cash on Delivery",
    icon: <CashIcon />,
    description: "Allow customers to pay when the order is delivered.",
    comingSoon: false,
  },
  {
    key: "paytm",
    name: "Paytm",
    icon: <PaytmIcon />,
    description: "Accept wallet and UPI payments via Paytm.",
    comingSoon: false,
  },
];

/* ── Main component ─────────────────────────────────────────── */
const PaymentGateway = () => {
  const [enabledMethods, setEnabledMethods] = useState<Record<string, boolean>>({});

  const handleToggle = (key: string, checked: boolean) => {
    Modal.confirm({
      title: `${checked ? "Enable" : "Disable"} Payment Method`,
      content: `Are you sure you want to ${checked ? "enable" : "disable"} this payment method? Changes may take 5–10 minutes to reflect.`,
      okText: checked ? "Yes, Enable" : "Yes, Disable",
      cancelText: "Cancel",
      okButtonProps: {
        style: { background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" },
      },
      onOk: () => {
        setEnabledMethods(prev => ({ ...prev, [key]: checked }));
        message.success(`Payment method ${checked ? "enabled" : "disabled"} successfully.`);
      },
    });
  };

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>💳 Payment Modes</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <Section
        icon={<CreditCardOutlined />}
        color="#6366f1" bg="#eef2ff"
        title="Manage Payment Options"
        desc="Enable the payment methods available to your customers at checkout"
      />

      <div style={{
        padding: "10px 12px", borderRadius: 8, marginBottom: 20,
        background: "#fffbeb", border: "1px solid #fde68a",
        display: "flex", gap: 8, alignItems: "flex-start",
      }}>
        <LockOutlined style={{ color: "#d97706", marginTop: 2, fontSize: 13 }} />
        <div style={{ fontSize: 11, color: "#92400e" }}>
          Payment gateway integrations are currently managed by the Catafy team. Contact support to activate a payment method.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.key}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", borderRadius: 10,
              background: "#fafafa", border: "1px solid #f1f5f9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: "#fff", border: "1px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {method.icon}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{method.name}</span>
                  <Tag color="default" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>
                    Contact Support
                  </Tag>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{method.description}</div>
              </div>
            </div>
            <Switch
              size="small"
              checked={enabledMethods[method.key] ?? false}
              onChange={(checked) => handleToggle(method.key, checked)}
              disabled
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PaymentGateway;
