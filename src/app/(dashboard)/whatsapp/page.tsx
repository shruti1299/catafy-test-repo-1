"use client";

import { Badge, Button, Card, Col, Empty, message, Row, Statistic, Tabs, Tag, Tooltip } from "antd";
import {
  WhatsAppOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import FeatureBanner from "@/components/common/FeatureBanner";
import { useEffect, useState } from "react";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IWhatsappData } from "@/interfaces/Whatsapp";
import WhatsAppActivitiesPage from "./sections/activities";
import CreditTransactions from "./sections/transactions";
import RechargeWallet from "./sections/recharge-wallet";
import CommunicationUI from "./sections/templates";

export default function WhatsAppPage() {
  const [whatsappData, setWhatsappData] = useState({} as IWhatsappData);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(API_ENDPOINTS.WHATSAPP);
      setWhatsappData(data);
    } catch {
      message.error("Failed to load WhatsApp data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { getData(); }, []);

  const balance   = whatsappData?.credit?.balance  ?? 0;
  const used      = whatsappData?.credit?.used      ?? 0;
  const sentToday = whatsappData?.credit?.sent_today ?? 0;

  const tabs = [
    {
      key: "automations",
      label: (
        <span><ThunderboltOutlined style={{ marginRight: 6 }} />Automations</span>
      ),
      children: whatsappData?.events ? <CommunicationUI data={whatsappData} /> : <Empty description="No automation events configured" />,
    },
    {
      key: "activities",
      label: (
        <span><MessageOutlined style={{ marginRight: 6 }} />Message Logs</span>
      ),
      children: <WhatsAppActivitiesPage />,
    },
    {
      key: "wallet",
      label: (
        <span><WalletOutlined style={{ marginRight: 6 }} />Wallet & Credits</span>
      ),
      children: <CreditTransactions />,
    },
  ];

  return (
    <div className="mb-100">

      {/* ── Feature announcement banner ────────────────── */}
      <FeatureBanner
        id="whatsapp-beta-mar2026"
        icon={<WhatsAppOutlined style={{ fontSize: 18, color: "#25d366" }} />}
        title="WhatsApp Automation is now live!"
        description="Send real-time order updates, delivery alerts & seller notifications automatically via WhatsApp Business API. Enable automations and top up your wallet to get started."
        ctaText="Set up automations"
        ctaHref="#automations"
        accentColor="#25d366"
      />

      {/* ── Branded header ─────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #075e54 0%, #128c7e 50%, #25d366 100%)",
        borderRadius: 14,
        padding: "24px 28px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>
        {/* Left — title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}>
            <WhatsAppOutlined style={{ fontSize: 28, color: "#fff" }} />
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, lineHeight: "22px" }}>
              WhatsApp Communication
            </div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 3 }}>
              Powered by Catafy · Business API
            </div>
          </div>
          <Badge
            status="processing"
            color="#4ade80"
            text={<span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>Connected</span>}
          />
        </div>

        {/* Right — balance + recharge */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(4px)",
            borderRadius: 10,
            padding: "8px 16px",
            textAlign: "center",
          }}>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>Credit Balance</div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>₹{balance}</div>
          </div>
          <RechargeWallet />
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────── */}
      <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={8}>
          <Card
            size="small"
            loading={isLoading}
            styles={{ body: { padding: "16px 20px" } }}
            style={{ borderRadius: 10, border: "1px solid #f0fdf4" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Messages Sent
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", lineHeight: "34px" }}>
                  {sentToday}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Today</div>
              </div>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: "#f0fdf4",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MessageOutlined style={{ fontSize: 18, color: "#22c55e" }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            size="small"
            loading={isLoading}
            styles={{ body: { padding: "16px 20px" } }}
            style={{ borderRadius: 10, border: "1px solid #eff6ff" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Credits Used
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", lineHeight: "34px" }}>
                  ₹{used}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Total spent</div>
              </div>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: "#eff6ff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <WalletOutlined style={{ fontSize: 18, color: "#6366f1" }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            size="small"
            loading={isLoading}
            styles={{ body: { padding: "16px 20px" } }}
            style={{ borderRadius: 10, border: "1px solid #fefce8" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Active Automations
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", lineHeight: "34px" }}>
                  {Array.isArray(whatsappData?.automations)
                    ? whatsappData.automations.filter((a: any) => a.enabled).length
                    : 0}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Triggers enabled</div>
              </div>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: "#fefce8",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ThunderboltOutlined style={{ fontSize: 18, color: "#eab308" }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Main tabs ──────────────────────────────────── */}
      <Card
        loading={isLoading}
        styles={{ header: { padding: "0 20px", minHeight: 48, borderBottom: "1px solid #f1f5f9" }, body: { padding: "20px" } }}
        style={{ borderRadius: 12 }}
      >
        <Tabs items={tabs} size="small" />
      </Card>
    </div>
  );
}
