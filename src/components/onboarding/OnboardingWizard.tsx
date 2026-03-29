"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import Link from "next/link";
import { useUserContext } from "@/contexts/UserContext";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

const STORAGE_KEY = "catafy_onboarding_v1";
const INDIGO = "#6366f1";
const GREEN = "#10b981";

// ─── Step Dot Indicator ───────────────────────────────────────────────────────

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 24,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <div
            key={i}
            style={{
              width: current ? 28 : 10,
              height: 10,
              borderRadius: 6,
              background: done || current ? INDIGO : "#e5e7eb",
              transition: "all 0.3s ease",
              opacity: done ? 0.6 : 1,
              animation: current ? "pulse-dot 1.4s infinite" : "none",
            }}
          />
        );
      })}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes pulse-circle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

// ─── Emoji Circle ─────────────────────────────────────────────────────────────

function EmojiCircle({
  emoji,
  bg,
  animate,
}: {
  emoji: string;
  bg: string;
  animate?: boolean;
}) {
  return (
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        fontSize: 48,
        animation: animate ? "pulse-circle 2s infinite" : "none",
      }}
    >
      {emoji}
    </div>
  );
}

// ─── Step 0: Welcome ──────────────────────────────────────────────────────────

function StepWelcome({ name, storeName }: { name: string; storeName: string }) {
  const pills = [
    { emoji: "🏪", label: "Brand your store" },
    { emoji: "🗂️", label: "Upload catalog" },
    { emoji: "📦", label: "Add products" },
    { emoji: "🚀", label: "All set!" },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 800,
          margin: "0 0 10px",
          color: "#111827",
        }}
      >
        Welcome to Catafy!
      </h2>
      <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px", lineHeight: 1.6 }}>
        Hi <strong>{name}</strong>, your store{" "}
        <strong>{storeName}</strong> is almost ready. Let&apos;s get you set up
        in 4 quick steps.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          maxWidth: 340,
          margin: "0 auto",
        }}
      >
        {pills.map((p) => (
          <div
            key={p.label}
            style={{
              background: "#f3f4f6",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 500,
              color: "#374151",
            }}
          >
            <span>{p.emoji}</span>
            <span>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Brand Your Store ─────────────────────────────────────────────────

function StepBrand({ hasLogo }: { hasLogo: boolean }) {
  return (
    <div>
      <EmojiCircle emoji="🏪" bg="#eef2ff" />
      <h3
        style={{
          fontWeight: 700,
          fontSize: 18,
          textAlign: "center",
          margin: "0 0 8px",
          color: "#111827",
        }}
      >
        Brand your store
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "#6b7280",
          textAlign: "center",
          margin: "0 0 20px",
          lineHeight: 1.6,
        }}
      >
        Upload your logo and set your store name. Your logo appears on all
        buyer-facing pages, catalogs, and invoices.
      </p>

      <div
        style={{
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 16,
          fontSize: 13,
          color: "#3730a3",
          lineHeight: 2,
        }}
      >
        <div>✅ Logo builds trust with buyers</div>
        <div>✅ Shown on every catalog &amp; invoice</div>
        <div>✅ Used as watermark on product images</div>
      </div>

      {hasLogo ? (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 10,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              background: GREEN,
              color: "#fff",
              borderRadius: 999,
              padding: "2px 10px",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            ✓ Logo uploaded
          </span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Change anytime in Settings
          </span>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Link href="/settings">
            <Button
              type="primary"
              style={{
                background: "linear-gradient(90deg,#6366f1,#818cf8)",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Upload Logo in Settings →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Upload Catalog ───────────────────────────────────────────────────

function StepUploadCatalog() {
  return (
    <div>
      <EmojiCircle emoji="🗂️" bg="#f5f3ff" />
      <h3
        style={{
          fontWeight: 700,
          fontSize: 18,
          textAlign: "center",
          margin: "0 0 8px",
          color: "#111827",
        }}
      >
        Upload your catalog
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "#6b7280",
          textAlign: "center",
          margin: "0 0 20px",
          lineHeight: 1.6,
        }}
      >
        A catalog is a shareable collection of products you send to buyers.
        Create one now — you can add products to it in the next step.
      </p>

      {/* How it works */}
      <div
        style={{
          background: "#f5f3ff",
          border: "1px solid #ede9fe",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: "#5b21b6", marginBottom: 10 }}>
          How catalogs work
        </div>
        {[
          { step: "1️⃣", text: "Create a catalog (give it a name)" },
          { step: "2️⃣", text: "Add products to it" },
          { step: "3️⃣", text: "Share the link on WhatsApp" },
          { step: "4️⃣", text: "Buyers browse and place orders" },
        ].map((item) => (
          <div
            key={item.step}
            style={{
              display: "flex",
              gap: 8,
              fontSize: 12,
              color: "#5b21b6",
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            <span>{item.step}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <Link href="/catalogs" style={{ display: "block" }}>
        <Button
          type="primary"
          block
          style={{
            background: "linear-gradient(90deg,#6366f1,#818cf8)",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            height: 40,
          }}
        >
          Create a Catalog →
        </Button>
      </Link>
    </div>
  );
}

// ─── Step 3: Add Products inside Catalog ──────────────────────────────────────

function StepAddProducts() {
  return (
    <div>
      <EmojiCircle emoji="📦" bg="#fff7ed" />
      <h3
        style={{
          fontWeight: 700,
          fontSize: 18,
          textAlign: "center",
          margin: "0 0 8px",
          color: "#111827",
        }}
      >
        Add products to your catalog
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "#6b7280",
          textAlign: "center",
          margin: "0 0 20px",
          lineHeight: 1.6,
        }}
      >
        Now fill your catalog with products. Upload photos, set prices, and
        configure stock — buyers order directly from the catalog link.
      </p>

      {/* Tips */}
      <div
        style={{
          background: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 20,
          fontSize: 12,
          color: "#92400e",
          lineHeight: 1.9,
        }}
      >
        <div>📸 Add clear product photos — buyers decide by visuals</div>
        <div>💰 Set price, MOQ (minimum order quantity)</div>
        <div>🏷️ Add bulk discounts to encourage larger orders</div>
        <div>⚡ Use Excel upload to add many products at once</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/inventory/add-bulk" style={{ display: "block" }}>
          <Button
            type="primary"
            block
            style={{
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              height: 40,
            }}
          >
            Upload Products via Excel ⚡ (fastest)
          </Button>
        </Link>
        <Link
          href="/inventory"
          style={{
            textAlign: "center",
            fontSize: 13,
            color: INDIGO,
            fontWeight: 500,
          }}
        >
          Or add products one by one →
        </Link>
      </div>
    </div>
  );
}

// ─── Step 4: All Set ──────────────────────────────────────────────────────────

function StepAllSet({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const storeUrl = `https://${username}.catafy.com`;

  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <EmojiCircle emoji="🚀" bg="#f0fdf4" animate />
      <h2
        style={{
          fontWeight: 800,
          fontSize: 22,
          textAlign: "center",
          margin: "0 0 8px",
          color: "#111827",
        }}
      >
        You&apos;re all set! 🎉
      </h2>
      <p
        style={{
          fontSize: 13,
          color: "#6b7280",
          textAlign: "center",
          margin: "0 0 20px",
          lineHeight: 1.6,
        }}
      >
        Your store is live. Share your catalog link with buyers on WhatsApp and
        start getting orders!
      </p>

      {/* Store link card */}
      <div
        style={{
          background: "linear-gradient(90deg,#6366f1,#818cf8)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 20,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 6 }}>
          Your store is live at
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 12,
            wordBreak: "break-all",
          }}
        >
          {storeUrl}
        </div>
        <Button
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.4)",
            color: "#fff",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 12,
          }}
        >
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>

      {/* What's next pills */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {[
          { emoji: "📱", label: "Share on WhatsApp" },
          { emoji: "📊", label: "Watch Analytics" },
          { emoji: "🏷️", label: "Add Bulk Discounts" },
        ].map((p) => (
          <span
            key={p.label}
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 999,
              padding: "5px 12px",
              fontSize: 12,
              color: "#065f46",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {p.emoji} {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OnboardingWizard() {
  const { storeDetail } = useUserContext();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  const TOTAL_STEPS = 5;

  useEffect(() => {
    if (
      localStorage.getItem(STORAGE_KEY) !== "done" &&
      storeDetail?.store?.username
    ) {
      setVisible(true);
    }
  }, [storeDetail?.store?.username]);

  const markDone = () => {
    localStorage.setItem(STORAGE_KEY, "done");
    setVisible(false);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      markDone();
    }
  };

  const userName = storeDetail?.user?.name ?? "there";
  const storeName = storeDetail?.store?.store_name ?? "your store";
  const username = storeDetail?.store?.username ?? "";
  const hasLogo = !!storeDetail?.store?.logo;

  const renderStep = () => {
    switch (step) {
      case 0: return <StepWelcome name={userName} storeName={storeName} />;
      case 1: return <StepBrand hasLogo={hasLogo} />;
      case 2: return <StepUploadCatalog />;
      case 3: return <StepAddProducts />;
      case 4: return <StepAllSet username={username} />;
      default: return null;
    }
  };

  return (
    <Modal
      open={visible}
      width={560}
      footer={null}
      maskClosable={false}
      closable={false}
      styles={{ body: { padding: "28px 32px 24px" } }}
    >
      <StepDots step={step} total={TOTAL_STEPS} />

      <div style={{ minHeight: 340 }}>{renderStep()}</div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <button
          onClick={markDone}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#9ca3af",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          Skip setup
        </button>

        <Button
          type="primary"
          onClick={handleNext}
          style={{
            background: "linear-gradient(90deg,#6366f1,#818cf8)",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            height: 40,
            paddingLeft: 24,
            paddingRight: 24,
            fontSize: 14,
          }}
        >
          {step === TOTAL_STEPS - 1 ? "Let's Go! 🚀" : "Next →"}
        </Button>
      </div>
    </Modal>
  );
}
