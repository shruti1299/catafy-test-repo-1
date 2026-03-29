"use client";

import { Badge, Card, Tag } from "antd";
import {
  WhatsAppOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const ANNOUNCEMENTS = [
  {
    icon: <WhatsAppOutlined style={{ fontSize: 18, color: "#25d366" }} />,
    bg: "#f0fdf4",
    border: "#bbf7d0",
    tag: "BETA",
    tagColor: "#d97706",
    tagBg: "rgba(251,191,36,0.15)",
    title: "WhatsApp Automation is live!",
    desc: "Send order updates, delivery alerts & seller notifications automatically via WhatsApp Business API.",
    href: "/whatsapp",
    cta: "Set up automations",
    date: "Mar 2026",
  },
  {
    icon: <FileTextOutlined style={{ fontSize: 18, color: "#6366f1" }} />,
    bg: "#eff6ff",
    border: "#bfdbfe",
    tag: "BETA",
    tagColor: "#d97706",
    tagBg: "rgba(251,191,36,0.15)",
    title: "GST Invoice generation",
    desc: "Auto-generate branded GST invoices with your signature, HSN codes & tax breakdowns on every order.",
    href: "/settings?tab=35",
    cta: "Configure invoices",
    date: "Mar 2026",
  },
];

export default function WhatsNew() {
  return (
    <Card
      title={
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
          🎉 What&apos;s New
        </span>
      }
      extra={
        <span style={{
          fontSize: 10, fontWeight: 700, background: "#6366f1",
          color: "#fff", borderRadius: 10, padding: "2px 8px",
        }}>
          {ANNOUNCEMENTS.length} new
        </span>
      }
      styles={{ header: { padding: "10px 16px", minHeight: 44 }, body: { padding: "12px 16px" } }}
      style={{ borderRadius: 12, marginTop: 16 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ANNOUNCEMENTS.map((item) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 10,
              background: item.bg,
              border: `1px solid ${item.border}`,
            }}
          >
            {/* Icon */}
            <div style={{
              width: 38, height: 38, borderRadius: 9, flexShrink: 0,
              background: "#fff", display: "flex", alignItems: "center",
              justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>
              {item.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{item.title}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                  background: item.tagBg, color: item.tagColor, letterSpacing: "0.04em",
                }}>
                  {item.tag}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#475569", lineHeight: "17px", marginBottom: 6 }}>
                {item.desc}
              </div>
              <Link href={item.href} style={{ fontSize: 12, fontWeight: 600, color: "#6366f1" }}>
                {item.cta} <ArrowRightOutlined style={{ fontSize: 10 }} />
              </Link>
            </div>

            {/* Date */}
            <div style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0, paddingTop: 2 }}>
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
