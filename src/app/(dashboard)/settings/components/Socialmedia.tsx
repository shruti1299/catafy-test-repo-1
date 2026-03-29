"use client";

import React, { useState } from "react";
import {
  Card, Input, Form, Button, message, Modal, Row, Col,
} from "antd";
import type { FormProps } from "antd";
import {
  ShareAltOutlined, GlobalOutlined, SaveOutlined, EnvironmentOutlined,
} from "@ant-design/icons";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useUserContext } from "@/contexts/UserContext";

type SocialMediaFields = {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  google_map?: string;
};

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

/* ── Social field ───────────────────────────────────────────── */
const SOCIAL_FIELDS = [
  { name: "facebook",  emoji: "📘", label: "Facebook",    placeholder: "https://facebook.com/yourpage"        },
  { name: "instagram", emoji: "📸", label: "Instagram",   placeholder: "https://instagram.com/yourprofile"    },
  { name: "whatsapp",  emoji: "💬", label: "WhatsApp",    placeholder: "https://wa.me/91XXXXXXXXXX"           },
  { name: "youtube",   emoji: "▶️",  label: "YouTube",     placeholder: "https://youtube.com/@yourchannel"    },
  { name: "twitter",   emoji: "🐦", label: "Twitter (X)", placeholder: "https://twitter.com/yourhandle"       },
  { name: "linkedin",  emoji: "💼", label: "LinkedIn",    placeholder: "https://linkedin.com/in/yourprofile"  },
];

/* ── Main component ─────────────────────────────────────────── */
const SocialLinksForm = () => {
  const { storeDetail } = useUserContext();
  const [loading, setLoading] = useState(false);
  const isFreePlan = storeDetail?.active_plan?.plan_id === 1;

  const initialValues: SocialMediaFields = {
    facebook:   storeDetail?.company?.meta?.facebook   || "",
    instagram:  storeDetail?.company?.meta?.instagram  || "",
    whatsapp:   storeDetail?.company?.meta?.whatsapp   || "",
    youtube:    storeDetail?.company?.meta?.youtube    || "",
    twitter:    storeDetail?.company?.meta?.twitter    || "",
    linkedin:   storeDetail?.company?.meta?.linkedin   || "",
    website:    storeDetail?.company?.meta?.website    || "",
    google_map: storeDetail?.company?.meta?.google_map || "",
  };

  const onFinish: FormProps<SocialMediaFields>["onFinish"] = async (values) => {
    if (!storeDetail.active_plan || isFreePlan) return;

    Modal.confirm({
      title: "Update Social Media Links?",
      content: "Changes may take 5–10 minutes to reflect on your public store profile.",
      okText: "Yes, Update",
      cancelText: "Cancel",
      okButtonProps: {
        style: { background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none" },
      },
      onOk: async () => {
        setLoading(true);
        try {
          await api.post(API_ENDPOINTS.STORE_COMPANY, {
            ...storeDetail.company,
            meta: values,
          });
          message.success("Social media links updated successfully.");
        } catch (error: any) {
          message.error(error?.response?.data?.message || "Failed to update social media links");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>📱 Social Media & Links</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <Section
        icon={<ShareAltOutlined />}
        color="#6366f1" bg="#eef2ff"
        title="Social Media Profiles"
        desc="Add your social pages — these appear on your store so customers can follow and contact you"
      />

      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
        autoComplete="off"
        size="middle"
      >
        <Row gutter={[16, 0]}>
          {SOCIAL_FIELDS.map((field) => (
            <Col xs={24} sm={12} key={field.name}>
              <Form.Item
                label={<span style={{ fontWeight: 600, fontSize: 13 }}>{field.emoji} {field.label}</span>}
                name={field.name}
              >
                <Input
                  placeholder={field.placeholder}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        {/* ── Website & Map ── */}
        <Section
          icon={<GlobalOutlined />}
          color="#0ea5e9" bg="#f0f9ff"
          title="Website & Location"
          desc="Link to your external website and Google Maps location"
        />

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>🌐 Custom Website</span>}
              name="website"
              extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Your external website, if any</span>}
            >
              <Input placeholder="https://yourwebsite.com" style={{ borderRadius: 8 }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<span style={{ fontWeight: 600, fontSize: 13 }}>📍 Google Maps Link</span>}
              name="google_map"
              extra={<span style={{ fontSize: 11, color: "#94a3b8" }}>Paste your Google Maps share link</span>}
            >
              <Input placeholder="https://maps.app.goo.gl/..." style={{ borderRadius: 8 }} />
            </Form.Item>
          </Col>
        </Row>

        {/* ── Save ── */}
        <div style={{
          padding: "14px 16px",
          background: "linear-gradient(90deg,#f8faff,#eef2ff)",
          borderRadius: 10, border: "1px solid #e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Save social links</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Only valid links will display on your store profile</div>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
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
};

export default SocialLinksForm;
