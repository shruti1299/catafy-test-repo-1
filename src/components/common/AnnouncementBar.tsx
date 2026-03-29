"use client";

import { useEffect, useState } from "react";
import { CloseOutlined, RocketFilled } from "@ant-design/icons";
import Link from "next/link";

const BANNER_ID = "catafy-ui-v2-launch-mar2026";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(`top_bar_${BANNER_ID}`);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(`top_bar_${BANNER_ID}`, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      background: "linear-gradient(90deg, #4f46e5 0%, #6366f1 45%, #818cf8 100%)",
      color: "#fff",
      padding: "9px 48px 9px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontSize: 13,
      fontWeight: 500,
      position: "relative",
      flexShrink: 0,
      zIndex: 200,
      lineHeight: "18px",
    }}>
      <RocketFilled style={{ fontSize: 14, flexShrink: 0 }} />
      <span style={{ textAlign: "center" }}>
        🎉 <strong>Catafy UI Version 2 is here!</strong>
        <span style={{ opacity: 0.9, marginLeft: 6 }}>
          A faster, cleaner &amp; smarter seller experience — enjoy the upgrade!
        </span>
        <Link
          href="/"
          style={{
            color: "#fff",
            fontWeight: 700,
            marginLeft: 10,
            textDecoration: "underline",
            whiteSpace: "nowrap",
          }}
        >
          Explore now →
        </Link>
      </span>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.18)",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          borderRadius: 5,
          width: 26,
          height: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          flexShrink: 0,
          transition: "background 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
      >
        <CloseOutlined style={{ fontSize: 11 }} />
      </button>
    </div>
  );
}
