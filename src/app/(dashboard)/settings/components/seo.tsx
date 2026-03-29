"use client";

import React, { useEffect, useState } from "react";
import {
  Form, Input, Button, Card, message, Modal,
} from "antd";
import {
  SearchOutlined, BarChartOutlined, SaveOutlined, EyeOutlined,
} from "@ant-design/icons";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";

const { TextArea } = Input;
const { confirm } = Modal;

export interface ISEO {
  id: number;
  store_id: number;
  meta_title: string;
  meta_description: string;
  google_analytics_id?: string;
  facebook_pixel_id?: string;
  created_at: string;
  updated_at: string;
}

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

/* ── Main component ─────────────────────────────────────────── */
export default function SeoSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSeoData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(API_ENDPOINTS.STORE_SEO);
        form.setFieldsValue(data);
      } catch {
        message.error("Failed to load SEO settings");
      } finally {
        setLoading(false);
      }
    };
    getSeoData();
  }, []);

  const onSave = async (values: any) => {
    confirm({
      title: "Save SEO Settings?",
      content: "Changes may take 5–10 minutes to reflect on search engines and social platforms.",
      okText: "Yes, Save",
      cancelText: "Cancel",
      okButtonProps: {
        style: { background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" },
      },
      onOk: async () => {
        try {
          setLoading(true);
          await api.post(API_ENDPOINTS.STORE_SEO, values);
          message.success("SEO settings saved. Changes may reflect in 5–10 minutes.");
        } catch {
          message.error("Failed to save SEO settings");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Card
      loading={loading}
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🔍 SEO & Tracking</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <Form form={form} onFinish={onSave} layout="vertical" size="middle">

        {/* ── Search visibility ── */}
        <Section
          icon={<SearchOutlined />}
          color="#6366f1" bg="#eef2ff"
          title="Search Engine Visibility"
          desc="Control how your store appears in Google search results and link previews"
        />

        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>Meta Title</span>}
          name="meta_title"
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Shown as headline in Google results — keep under 70 characters</span>}
          rules={[{ max: 70, message: "Maximum 70 characters" }]}
        >
          <Input
            showCount
            maxLength={70}
            placeholder="e.g., Catafy – Wholesale Handpicked Deals"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>Meta Description</span>}
          name="meta_description"
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Short summary shown below the title — recommended under 160 characters</span>}
          rules={[{ max: 160, message: "Maximum 160 characters" }]}
        >
          <TextArea
            rows={3}
            showCount
            maxLength={160}
            placeholder="Describe your store in a way that attracts clicks from search results."
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        {/* ── Analytics & tracking ── */}
        <Section
          icon={<BarChartOutlined />}
          color="#0ea5e9" bg="#f0f9ff"
          title="Analytics & Marketing Tracking"
          desc="Connect external tools to track traffic, ad performance, and conversions"
        />

        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>Google Analytics ID</span>}
          name="google_analytics_id"
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>GA4 format: G-XXXXXXXXXX — tracks visitor behaviour on your store</span>}
          rules={[{
            pattern: /^G-[A-Z0-9]+$/,
            message: "Enter a valid GA4 ID (e.g., G-XXXXXXX)",
          }]}
        >
          <Input
            placeholder="e.g., G-XXXXXXXXXX"
            style={{ borderRadius: 8, fontFamily: "monospace" }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>Facebook Pixel ID</span>}
          name="facebook_pixel_id"
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Measures ad performance and enables retargeting on Facebook & Instagram</span>}
          rules={[{
            pattern: /^[0-9]+$/,
            message: "Facebook Pixel ID should contain only numbers",
          }]}
        >
          <Input
            placeholder="e.g., 123456789012345"
            style={{ borderRadius: 8, fontFamily: "monospace" }}
          />
        </Form.Item>

        {/* ── Save ── */}
        <div style={{
          padding: "14px 16px",
          background: "linear-gradient(90deg,#f8faff,#eef2ff)",
          borderRadius: 10, border: "1px solid #e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Save SEO settings</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Search engines may take time to re-index your updates</div>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            style={{
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none", borderRadius: 8,
              fontWeight: 600, minWidth: 140,
            }}
          >
            Save Changes
          </Button>
        </div>

      </Form>
    </Card>
  );
}
