"use client";

import React, { useState } from "react";
import {
  Card, Input, Form, Button, message, Modal, Tag,
} from "antd";
import type { FormProps } from "antd";
import {
  LinkOutlined, GlobalOutlined, CopyOutlined, SaveOutlined, WarningOutlined,
} from "@ant-design/icons";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useUserContext } from "@/contexts/UserContext";

type FieldType = { username: string };

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
const DomainSetting = ({ username }: { username: string }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const { storeDetail } = useUserContext();
  const storeLink = `https://${storeDetail?.store?.username}.catafy.com`;

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (username === values.username)
      return message.error("Please enter a new subdomain.");
    if (!values?.username)
      return message.error("Subdomain cannot be empty.");

    Modal.confirm({
      title: "Confirm Subdomain Change",
      content: "Changing your subdomain may take 5–10 minutes to reflect globally. Your old link may still work during this time. Do you want to continue?",
      okText: "Yes, Update",
      cancelText: "Cancel",
      okButtonProps: {
        style: { background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" },
      },
      onOk: async () => {
        setIsUpdating(true);
        try {
          await api.post(API_ENDPOINTS.UPDATE_USERNAME, values);
          message.success("Subdomain updated! It may take 5–10 minutes to reflect.");
          setError("");
        } catch (err: any) {
          if (err?.response?.data?.errors?.["username"]) {
            const errMsg = err.response.data.errors["username"];
            message.error(errMsg);
            setError(errMsg);
          }
        }
        setIsUpdating(false);
      },
    });
  };

  return (
    <Card
      loading={!username}
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🌐 Domain & Subdomain</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      {/* ── Live store link ── */}
      <Section
        icon={<LinkOutlined />}
        color="#10b981" bg="#f0fdf4"
        title="Your Live Store Link"
        desc="Share this link with your customers to give them direct access to your catalog"
      />

      <div style={{
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        padding: "12px 14px", borderRadius: 8,
        background: "#fafafa", border: "1px solid #e2e8f0",
        marginBottom: 24,
      }}>
        <Tag color="green" style={{ fontSize: 11, margin: 0 }}>LIVE</Tag>
        <a
          href={storeLink}
          target="_blank"
          rel="noreferrer"
          style={{ flex: 1, fontSize: 13, color: "#0f172a", fontWeight: 500 }}
        >
          {storeLink}
        </a>
        <CopyToClipboard text={storeLink} onCopy={() => message.success("Link copied!")}>
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

      {/* ── Change subdomain ── */}
      <Section
        icon={<GlobalOutlined />}
        color="#6366f1" bg="#eef2ff"
        title="Change Your Subdomain"
        desc="Update your store URL — only lowercase letters and numbers are allowed"
      />

      <div style={{
        padding: "10px 12px", borderRadius: 8, marginBottom: 20,
        background: "#fffbeb", border: "1px solid #fde68a",
        display: "flex", gap: 8, alignItems: "flex-start",
      }}>
        <WarningOutlined style={{ color: "#d97706", marginTop: 2, fontSize: 13 }} />
        <div style={{ fontSize: 11, color: "#92400e" }}>
          Changing your subdomain will update your store URL. Old links may stop working after propagation.
        </div>
      </div>

      <Form
        layout="vertical"
        onFinish={onFinish}
        size="middle"
        initialValues={{ username }}
      >
        <Form.Item<FieldType>
          label={<span style={{ fontWeight: 600, fontSize: 13 }}>Subdomain</span>}
          name="username"
          extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>This becomes your store URL: yourname.catafy.com</span>}
          rules={[
            { required: true, message: "Subdomain is required" },
            { pattern: /^[a-z0-9]+$/, message: "Only lowercase letters and numbers allowed" },
          ]}
          validateStatus={error ? "error" : undefined}
          help={error || undefined}
        >
          <Input
            suffix={<span style={{ color: "#94a3b8", fontSize: 12 }}>.catafy.com</span>}
            style={{ borderRadius: 8 }}
            placeholder="yourstore"
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
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Update subdomain</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Propagation may take 5–10 minutes</div>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={isUpdating}
            style={{
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none", borderRadius: 8,
              fontWeight: 600, minWidth: 160,
            }}
          >
            Update Subdomain
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default DomainSetting;
