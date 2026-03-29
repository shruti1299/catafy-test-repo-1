"use client";

import React, { useState } from "react";
import {
  Form, Input, Button, Row, Col, message, Typography, Tag,
} from "antd";
import {
  UserOutlined, MailOutlined, PhoneOutlined, BankOutlined,
  EnvironmentOutlined, SaveOutlined, LockOutlined, IdcardOutlined,
  BuildOutlined,
} from "@ant-design/icons";
import { ICompany, IStore, IUser } from "@/interfaces/Store";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";

const { Text } = Typography;
type IUCompany = IUser & ICompany;

interface IProps {
  user: IUser;
  loading: boolean;
  company: ICompany;
}

/* ── Section header ─────────────────────────────────────────── */
const Section = ({
  icon, color = "#6366f1", bg = "#eef2ff",
  title, desc,
}: {
  icon: React.ReactNode; color?: string; bg?: string;
  title: string; desc: string;
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
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{desc}</div>
    </div>
  </div>
);

/* ── Read-only field wrapper ────────────────────────────────── */
const ReadOnlyNote = ({ text }: { text: string }) => (
  <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
    <LockOutlined style={{ fontSize: 10 }} />{text}
  </span>
);

/* ── Main component ─────────────────────────────────────────── */
const MyProfile = ({ user, loading, company }: IProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const onFinish = async (values: Partial<IUCompany>) => {
    setIsUpdating(true);
    try {
      await api.post(API_ENDPOINTS.STORE_COMPANY, { ...values });
      message.success("Profile updated successfully.");
    } catch {
      message.error("Something went wrong. Please try again.");
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ height: 20, background: "#f1f5f9", borderRadius: 6, marginBottom: 12, width: "60%" }} />
        <div style={{ height: 14, background: "#f1f5f9", borderRadius: 6, width: "40%" }} />
      </div>
    );
  }

  const initials = user?.name
    ?.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase() || "?";

  return (
    <div>
      {/* ── Profile hero ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "16px 18px", borderRadius: 12, marginBottom: 28,
        background: "linear-gradient(135deg,#eef2ff,#f5f3ff)",
        border: "1px solid #e0e7ff",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,#6366f1,#818cf8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 800, color: "#fff",
          boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{user?.name || "Your Name"}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{user?.email}</div>
          <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Tag color="purple" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>Seller Account</Tag>
            {company?.company && (
              <Tag color="blue" style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>
                <BuildOutlined style={{ marginRight: 3 }} />{company.company}
              </Tag>
            )}
          </div>
        </div>
      </div>

      <Form
        layout="vertical"
        initialValues={{ ...user, ...company }}
        onFinish={onFinish}
        size="middle"
      >

        {/* ════════════ 1. Personal Info ════════════ */}
        <Section
          icon={<UserOutlined />}
          color="#6366f1" bg="#eef2ff"
          title="Personal Information"
          desc="Your name and contact details used across orders and invoices"
        />

        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>Full Name</span>}
          name="name"
          rules={[{ required: true, message: "Full name is required" }]}
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Appears on invoices, orders, and customer communications</span>}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#94a3b8" }} />}
            placeholder="Enter your full name"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>Email Address</span>}
              name="email"
              extra={<ReadOnlyNote text="Used for login — cannot be changed" />}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#94a3b8" }} />}
                type="email"
                disabled
                style={{ borderRadius: 8, background: "#f8fafc" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>Phone Number</span>}
              name="phone"
              extra={<ReadOnlyNote text="Primary contact linked to your account" />}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#94a3b8" }} />}
                disabled
                style={{ borderRadius: 8, background: "#f8fafc" }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ════════════ 2. Company / Business Details ════════════ */}
        <Section
          icon={<BankOutlined />}
          color="#0ea5e9" bg="#f0f9ff"
          title="Business Details"
          desc="Your registered company info — used on GST invoices and billing documents"
        />

        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>Company / Business Name</span>}
          name="company"
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Your registered trade name or LLP / Pvt Ltd name</span>}
        >
          <Input
            prefix={<BuildOutlined style={{ color: "#94a3b8" }} />}
            placeholder="e.g. Krishna Textiles Pvt Ltd"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>GST Number</span>}
          name="gst"
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>15-digit GSTIN — printed on all your GST invoices</span>}
        >
          <Input
            prefix={<IdcardOutlined style={{ color: "#94a3b8" }} />}
            placeholder="e.g. 27AABCU9603R1ZX"
            style={{ borderRadius: 8, fontFamily: "monospace", letterSpacing: 1 }}
            maxLength={15}
          />
        </Form.Item>

        {/* ════════════ 3. Address ════════════ */}
        <Section
          icon={<EnvironmentOutlined />}
          color="#10b981" bg="#f0fdf4"
          title="Business Address"
          desc="Billing and shipping address shown on invoices and order documents"
        />

        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>Street Address</span>}
          name="address"
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Building name, street, area, locality</span>}
        >
          <Input.TextArea
            rows={2}
            placeholder="e.g. 12/A, Industrial Estate, MG Road"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>City</span>}
              name="city"
            >
              <Input placeholder="e.g. Surat" style={{ borderRadius: 8 }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>State</span>}
              name="state"
            >
              <Input placeholder="e.g. Gujarat" style={{ borderRadius: 8 }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>Pincode</span>}
              name="pincode"
            >
              <Input
                placeholder="e.g. 395003"
                style={{ borderRadius: 8 }}
                maxLength={6}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>Country</span>}
              name="country"
              initialValue="India"
              extra={<ReadOnlyNote text="Auto-set" />}
            >
              <Input
                disabled
                style={{ borderRadius: 8, background: "#f8fafc" }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ── Save ── */}
        <div style={{
          padding: "14px 16px", marginTop: 8,
          background: "linear-gradient(90deg,#f8faff,#eef2ff)",
          borderRadius: 10, border: "1px solid #e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Save your profile</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Changes to company info reflect on future invoices</div>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdating}
            icon={<SaveOutlined />}
            style={{
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none", borderRadius: 8,
              fontWeight: 600, minWidth: 140,
            }}
          >
            Save Account
          </Button>
        </div>

      </Form>
    </div>
  );
};

export default MyProfile;
