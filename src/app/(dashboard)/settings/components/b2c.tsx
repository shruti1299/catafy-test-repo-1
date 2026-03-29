"use client";

import React, { useEffect, useState } from "react";
import {
  Card, Input, Form, message, Switch, Button, Tag,
} from "antd";
import {
  ShopOutlined, LinkOutlined, CopyOutlined, SaveOutlined,
} from "@ant-design/icons";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useUserContext } from "@/contexts/UserContext";
import { randomUserName } from "@/utils/helper";
import OverlayCard from "@/components/upgrade/overlay-card";

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
const B2CSetting = () => {
  const [form] = Form.useForm();
  const [isUpdating, setIsUpdating] = useState(false);
  const { storeDetail } = useUserContext();
  const baseDomain = "catafy.com";
  const isB2CEnabled = Form.useWatch("is_b2c", form);
  const b2cDomain = Form.useWatch("b2c_domain", form);

  const b2cLink =
    isB2CEnabled && b2cDomain
      ? `https://${b2cDomain}-b2c.${baseDomain}`
      : "";

  useEffect(() => {
    if (storeDetail?.store) {
      form.setFieldsValue({
        is_b2c: storeDetail.store.is_b2c,
        b2c_domain: storeDetail.store.b2c_domain || randomUserName(storeDetail?.store.username),
      });
    }
  }, [storeDetail, form]);

  const onFinish = async (values: any) => {
    setIsUpdating(true);
    try {
      await api.post(API_ENDPOINTS.STORE_B2C_SETTINGS, values);
      message.success("B2C settings updated successfully");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const isPlanBlocked =
    storeDetail?.active_plan?.plan_id === 1 ||
    storeDetail?.active_plan?.plan_id === 4;

  return (
    <>
      {isPlanBlocked && <OverlayCard />}
      <Card
        loading={!storeDetail}
        title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🏪 B2C Storefront</span>}
        style={{ borderRadius: 12 }}
        styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      >
        <Section
          icon={<ShopOutlined />}
          color="#6366f1" bg="#eef2ff"
          title="B2C Customer Storefront"
          desc="Enable a separate retail-facing store for direct (B2C) customers with different pricing"
        />

        <div style={{
          padding: "10px 12px", borderRadius: 8, marginBottom: 20,
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          fontSize: 12, color: "#166534",
        }}>
          💡 B2C store lets you serve direct retail customers on a separate URL — with custom pricing, different from your wholesale catalog.
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="middle"
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 12px", borderRadius: 8,
            background: "#fafafa", border: "1px solid #f1f5f9",
            marginBottom: 20,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>🏪 Enable B2C Store</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Turn on to activate a separate storefront for retail customers</div>
            </div>
            <Form.Item name="is_b2c" valuePropName="checked" style={{ margin: 0 }}>
              <Switch size="small" />
            </Form.Item>
          </div>

          {isB2CEnabled && (
            <>
              <Section
                icon={<LinkOutlined />}
                color="#10b981" bg="#f0fdf4"
                title="B2C Store Subdomain"
                desc="Set the unique URL for your B2C storefront"
              />

              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 13 }}>B2C Subdomain</span>}
                name="b2c_domain"
                extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Only lowercase letters, numbers and hyphens allowed</span>}
                rules={[
                  { required: true, message: "Subdomain is required" },
                  { pattern: /^[a-z0-9-]+$/, message: "Only lowercase letters, numbers and hyphen allowed" },
                ]}
              >
                <Input
                  suffix={<span style={{ color: "#94a3b8", fontSize: 12 }}>-b2c.catafy.com</span>}
                  style={{ borderRadius: 8 }}
                  placeholder="yourstore"
                />
              </Form.Item>

              {b2cLink && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                  padding: "12px 14px", borderRadius: 8,
                  background: "#fafafa", border: "1px solid #e2e8f0",
                  marginBottom: 20,
                }}>
                  <Tag color="blue" style={{ fontSize: 11, margin: 0 }}>B2C LIVE</Tag>
                  <a
                    href={b2cLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ flex: 1, fontSize: 13, color: "#0f172a", fontWeight: 500 }}
                  >
                    {b2cLink}
                  </a>
                  <CopyToClipboard text={b2cLink} onCopy={() => message.success("B2C link copied!")}>
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      style={{
                        background: "linear-gradient(90deg,#6366f1,#818cf8)",
                        border: "none", color: "#fff", fontSize: 11,
                      }}
                    >
                      Copy
                    </Button>
                  </CopyToClipboard>
                </div>
              )}
            </>
          )}

          {/* ── Save ── */}
          <div style={{
            padding: "14px 16px",
            background: "linear-gradient(90deg,#f8faff,#eef2ff)",
            borderRadius: 10, border: "1px solid #e0e7ff",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Save B2C settings</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Changes apply to your B2C storefront immediately</div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              style={{
                background: "linear-gradient(90deg,#6366f1,#818cf8)",
                border: "none", borderRadius: 8,
                fontWeight: 600, minWidth: 140,
              }}
            >
              Save Settings
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default B2CSetting;
