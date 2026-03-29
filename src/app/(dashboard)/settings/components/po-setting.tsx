"use client";

import React, { useEffect, useState } from "react";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useUserContext } from "@/contexts/UserContext";
import { IPOSetting } from "@/interfaces/Store";
import {
  Card, Form, InputNumber, Switch, message, Button, Modal,
} from "antd";
import {
  CarOutlined, InboxOutlined, PercentageOutlined, SaveOutlined,
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

/* ── Charge row ─────────────────────────────────────────────── */
const ChargeRow = ({
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
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{emoji} {title}</div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>{desc}</div>
      </div>
    </div>
    <Switch size="small" checked={checked} disabled={disabled} onChange={onChange} />
  </div>
);

/* ── Main component ─────────────────────────────────────────── */
export default function POSetting() {
  const { storeDetail } = useUserContext();
  const [form] = Form.useForm();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [poData, setPoData] = useState({} as IPOSetting);
  const [settings, setSettings] = useState({
    enable_shipping: false,
    enable_packing: true,
    enable_tax: false,
  });

  const isFreePlan = storeDetail?.active_plan?.plan_id === 1;

  useEffect(() => {
    const getPOData = async () => {
      try {
        const { data } = await api.get(API_ENDPOINTS.PO_UPDATE);
        setPoData(data);
        form.setFieldsValue(data);
        setSettings({
          enable_shipping: !!data.enable_shipping,
          enable_packing: !!data.enable_packing,
          enable_tax: !!data.enable_tax,
        });
      } catch {
        message.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    getPOData();
  }, []);

  const handleSwitchChange = (key: keyof typeof settings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }));
  };

  const confirmAndSave = async (values: any) => {
    if (isFreePlan) return;
    Modal.confirm({
      title: "Confirm Changes",
      content: "Updating invoice settings may take 5–10 minutes to reflect on new orders.",
      okText: "Yes, Save Changes",
      cancelText: "Cancel",
      okButtonProps: {
        style: { background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" },
      },
      onOk: async () => {
        setIsUpdating(true);
        try {
          await api.post(API_ENDPOINTS.PO_UPDATE, { ...values, ...settings });
          message.success("Settings saved successfully.");
        } catch (error: any) {
          message.error(
            error?.response?.data?.message ||
            error?.response?.data?.errors?.[0] ||
            "Something went wrong"
          );
        } finally {
          setIsUpdating(false);
        }
      },
    });
  };

  if (isLoading) return <Card loading style={{ borderRadius: 12 }} />;

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🧾 Order Invoice Charges</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <Section
        icon={<CarOutlined />}
        color="#6366f1" bg="#eef2ff"
        title="Additional Order Charges"
        desc="Configure optional shipping, packing, and tax charges added to invoices"
      />

      <Form
        layout="vertical"
        onFinish={confirmAndSave}
        form={form}
        initialValues={poData}
        size="middle"
      >
        {/* ── Shipping ── */}
        <ChargeRow
          icon={<CarOutlined />} emoji="🚚" title="Shipping Charges"
          desc="Add a flat shipping cost to purchase orders"
          checked={settings.enable_shipping}
          disabled={isFreePlan}
          onChange={(v) => handleSwitchChange("enable_shipping", v)}
        />
        {settings.enable_shipping && (
          <Form.Item
            name="shipping_cost"
            extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Flat shipping amount added per order</span>}
            rules={[{ required: true, message: "Please enter shipping cost" }]}
            style={{ paddingLeft: 16, marginBottom: 16 }}
          >
            <InputNumber
              min={0}
              style={{ width: "100%", borderRadius: 8 }}
              prefix="₹"
              placeholder="e.g., 50"
            />
          </Form.Item>
        )}

        {/* ── Packing ── */}
        <ChargeRow
          icon={<InboxOutlined />} emoji="📦" title="Packing Charges"
          desc="Add packaging cost to orders if applicable"
          checked={settings.enable_packing}
          disabled={isFreePlan}
          onChange={(v) => handleSwitchChange("enable_packing", v)}
        />
        {settings.enable_packing && (
          <Form.Item
            name="packing_cost"
            extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Flat packing amount added per order</span>}
            rules={[{ required: true, message: "Please enter packing cost" }]}
            style={{ paddingLeft: 16, marginBottom: 16 }}
          >
            <InputNumber
              min={0}
              style={{ width: "100%", borderRadius: 8 }}
              prefix="₹"
              placeholder="e.g., 20"
            />
          </Form.Item>
        )}

        {/* ── GST ── */}
        <ChargeRow
          icon={<PercentageOutlined />} emoji="💸" title="GST / Tax"
          desc="Apply GST percentage to the total invoice amount"
          checked={settings.enable_tax}
          disabled={isFreePlan}
          onChange={(v) => handleSwitchChange("enable_tax", v)}
        />
        {settings.enable_tax && (
          <Form.Item
            name="tax_percent"
            extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>e.g., enter 18 for 18% GST</span>}
            rules={[{ required: true, message: "Please enter tax percentage" }]}
            style={{ paddingLeft: 16, marginBottom: 16 }}
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%", borderRadius: 8 }}
              suffix="%"
              placeholder="e.g., 18"
            />
          </Form.Item>
        )}

        {/* ── Save ── */}
        <div style={{
          padding: "14px 16px", marginTop: 8,
          background: "linear-gradient(90deg,#f8faff,#eef2ff)",
          borderRadius: 10, border: "1px solid #e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Save invoice charge settings</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Changes apply to newly generated invoices</div>
          </div>
          <Button
            htmlType="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={isUpdating}
            disabled={isFreePlan}
            style={{
              background: isFreePlan ? undefined : "linear-gradient(90deg,#6366f1,#818cf8)",
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
