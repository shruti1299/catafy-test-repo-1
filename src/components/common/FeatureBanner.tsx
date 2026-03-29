"use client";

import { useEffect, useState } from "react";
import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons";
import Link from "next/link";

interface FeatureBannerProps {
  id: string;           // unique key for localStorage — change when you update the announcement
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  accentColor?: string; // border-left + icon bg
}

export default function FeatureBanner({
  id,
  icon,
  title,
  description,
  ctaText,
  ctaHref,
  accentColor = "#6366f1",
}: FeatureBannerProps) {
  const [visible, setVisible] = useState(false);

  // Read from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const dismissed = localStorage.getItem(`banner_dismissed_${id}`);
    if (!dismissed) setVisible(true);
  }, [id]);

  const dismiss = () => {
    localStorage.setItem(`banner_dismissed_${id}`, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "12px 16px",
      borderRadius: 10,
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderLeft: `4px solid ${accentColor}`,
      marginBottom: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      position: "relative",
    }}>
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: `${accentColor}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{title}</span>
          <span style={{
            fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
            background: "rgba(251,191,36,0.15)", color: "#d97706", letterSpacing: "0.04em",
          }}>
            BETA
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#64748b", lineHeight: "17px" }}>{description}</div>
        {ctaText && ctaHref && (
          <Link href={ctaHref} style={{ fontSize: 12, fontWeight: 600, color: accentColor, marginTop: 4, display: "inline-block" }}>
            {ctaText} <ArrowRightOutlined style={{ fontSize: 10 }} />
          </Link>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#94a3b8", padding: 2, flexShrink: 0,
          display: "flex", alignItems: "center",
        }}
        title="Dismiss"
      >
        <CloseOutlined style={{ fontSize: 12 }} />
      </button>
    </div>
  );
}
