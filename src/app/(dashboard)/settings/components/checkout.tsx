"use client";

import React, { useEffect, useState } from "react";
import {
  Card, Checkbox, Row, Col, Image, Button, message,
} from "antd";
import {
  FormOutlined, CheckCircleFilled, LayoutOutlined,
  ProfileOutlined, MessageOutlined, CheckSquareOutlined, SaveOutlined,
} from "@ant-design/icons";
import RichTextEditor from "@/components/common/RichTextEditor";
import { useUserContext } from "@/contexts/UserContext";
import { API_ENDPOINTS } from "@/api/endpoints";
import api from "@/api";

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

/* ── Layout card ────────────────────────────────────────────── */
const LayoutCard = ({
  value, selected, label, imgSrc, onClick,
}: {
  value: string; selected: boolean; label: string; imgSrc: string; onClick: () => void;
}) => (
  <div
    onClick={onClick}
    style={{
      border: `2px solid ${selected ? "#6366f1" : "#e2e8f0"}`,
      borderRadius: 10, padding: 8, cursor: "pointer",
      background: selected ? "#eef2ff" : "#fafafa",
      transition: "all .15s",
      position: "relative", textAlign: "center",
    }}
  >
    {selected && (
      <CheckCircleFilled style={{
        position: "absolute", top: 6, right: 8,
        color: "#6366f1", fontSize: 16,
      }} />
    )}
    <Image src={imgSrc} alt={label} width="90%" height="auto" preview={false} />
    <div style={{
      marginTop: 8, fontSize: 12, fontWeight: selected ? 700 : 500,
      color: selected ? "#6366f1" : "#334155",
    }}>{label}</div>
  </div>
);

/* ── Field option ───────────────────────────────────────────── */
const FIELD_OPTIONS = [
  { label: "Phone (Always Required)", value: "phone", disabled: true },
  { label: "Email", value: "email" },
  { label: "Address", value: "address" },
  { label: "Pincode", value: "pincode" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

/* ── Main component ─────────────────────────────────────────── */
const CheckoutSetting = () => {
  const { storeDetail } = useUserContext();
  const detail = storeDetail?.detail;

  const [requiredFields, setRequiredFields] = useState<string[]>(["phone"]);
  const [checkoutMsg, setCheckoutMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [layout, setLayout] = useState<"center" | "split">("center");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (detail) {
      setRequiredFields(detail.checkout_fields || ["phone"]);
      setCheckoutMsg(detail?.checkout_msg || "");
      setSuccessMsg(detail?.order_success_msg || "");
      setLayout(detail?.checkout_layout || "center");
    }
  }, [storeDetail]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post(API_ENDPOINTS.STORE_CHECKOUT, {
        checkout_fields: requiredFields,
        checkout_msg: checkoutMsg,
        order_success_msg: successMsg,
        checkout_layout: layout,
      });
      message.success("Checkout settings saved successfully");
    } catch {
      message.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🛒 Checkout Settings</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      {/* ── Layout ── */}
      <Section
        icon={<LayoutOutlined />}
        color="#6366f1" bg="#eef2ff"
        title="Checkout Layout"
        desc="Choose how your checkout page looks to buyers — centered or two-column split"
      />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <LayoutCard
            value="center"
            selected={layout === "center"}
            label="Centered Layout"
            imgSrc="/images/center.png"
            onClick={() => setLayout("center")}
          />
        </Col>
        <Col xs={24} sm={12}>
          <LayoutCard
            value="split"
            selected={layout === "split"}
            label="Left / Right Layout"
            imgSrc="/images/split.png"
            onClick={() => setLayout("split")}
          />
        </Col>
      </Row>

      {/* ── Required Fields ── */}
      <Section
        icon={<CheckSquareOutlined />}
        color="#0ea5e9" bg="#f0f9ff"
        title="Required Fields at Checkout"
        desc="Select which customer details are mandatory when they place an order"
      />

      <div style={{ marginBottom: 24 }}>
        <Checkbox.Group
          value={requiredFields}
          onChange={(values) => setRequiredFields(values as string[])}
        >
          <Row gutter={[12, 8]}>
            {FIELD_OPTIONS.map((opt) => (
              <Col xs={12} sm={8} key={opt.value}>
                <Checkbox value={opt.value} disabled={opt.disabled}>
                  <span style={{ fontSize: 12 }}>{opt.label}</span>
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </div>

      {/* ── Checkout Message ── */}
      <Section
        icon={<MessageOutlined />}
        color="#10b981" bg="#f0fdf4"
        title="Checkout Page Message"
        desc="Show a custom note or announcement to buyers on the checkout page (e.g., delivery timeline, terms)"
      />

      <div style={{ marginBottom: 24 }}>
        <RichTextEditor value={checkoutMsg} onChange={setCheckoutMsg} />
      </div>

      {/* ── Success Message ── */}
      <Section
        icon={<ProfileOutlined />}
        color="#f97316" bg="#fff7ed"
        title="Order Success Message"
        desc="The message shown to buyers after they successfully place an order"
      />

      <div style={{ marginBottom: 24 }}>
        <RichTextEditor value={successMsg} onChange={setSuccessMsg} />
      </div>

      {/* ── Save ── */}
      <div style={{
        padding: "14px 16px", marginTop: 8,
        background: "linear-gradient(90deg,#f8faff,#eef2ff)",
        borderRadius: 10, border: "1px solid #e0e7ff",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Save checkout configuration</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Changes apply to all future checkouts</div>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isSaving}
          onClick={handleSave}
          style={{
            background: "linear-gradient(90deg,#6366f1,#818cf8)",
            border: "none", borderRadius: 8,
            fontWeight: 600, minWidth: 140,
          }}
        >
          Save Settings
        </Button>
      </div>
    </Card>
  );
};

export default CheckoutSetting;
