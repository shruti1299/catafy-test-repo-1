"use client";

import React, { useEffect, useState } from "react";
import {
  Card, Input, Button, message, Tag,
} from "antd";
import {
  RocketOutlined, LinkOutlined, DisconnectOutlined,
  LockOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from "@ant-design/icons";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";

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
export default function ShiprocketIntegration() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await api.get(API_ENDPOINTS.SHIPROCKET + "/status");
        setConnected(data.connected);
      } catch {
        message.error("Failed to fetch status");
      } finally {
        setChecking(false);
      }
    };
    fetchStatus();
  }, []);

  const handleConnect = async () => {
    if (!email || !password) {
      return message.warning("Please enter email and password");
    }
    setLoading(true);
    try {
      const { data } = await api.post(API_ENDPOINTS.SHIPROCKET + "/connect", { email, password });
      if (data.success) {
        message.success("Shiprocket connected successfully!");
        setConnected(true);
        setEmail("");
        setPassword("");
      } else {
        message.error(data.message || "Connection failed");
      }
    } catch {
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.SHIPROCKET + "/disconnect");
      setConnected(false);
      message.success("Disconnected successfully");
    } catch {
      message.error("Failed to disconnect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      loading={checking}
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🚀 Shiprocket Integration</span>}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <Section
        icon={<RocketOutlined />}
        color="#6366f1" bg="#eef2ff"
        title="Connect Shiprocket"
        desc="Ship orders in one click — auto-generate AWBs and track shipments without leaving Catafy"
      />

      {/* ── Status indicator ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 14px", borderRadius: 8, marginBottom: 20,
        background: connected ? "#f0fdf4" : "#fafafa",
        border: `1px solid ${connected ? "#bbf7d0" : "#e2e8f0"}`,
      }}>
        {connected
          ? <CheckCircleOutlined style={{ color: "#10b981", fontSize: 18 }} />
          : <CloseCircleOutlined style={{ color: "#94a3b8", fontSize: 18 }} />
        }
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: connected ? "#166534" : "#1e293b" }}>
            {connected ? "Account Connected" : "Not Connected"}
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>
            {connected
              ? "Your Shiprocket account is active — you can ship orders directly from Catafy"
              : "Enter your Shiprocket credentials below to connect"}
          </div>
        </div>
        <Tag
          color={connected ? "success" : "default"}
          style={{ fontSize: 11, borderRadius: 4, margin: 0, marginLeft: "auto" }}
        >
          {connected ? "Active" : "Inactive"}
        </Tag>
      </div>

      {!connected ? (
        <>
          <Section
            icon={<LinkOutlined />}
            color="#0ea5e9" bg="#f0f9ff"
            title="Shiprocket Login Credentials"
            desc="Use the same credentials you use to log in to app.shiprocket.in"
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <Input
              placeholder="Shiprocket Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: 8 }}
              size="middle"
            />
            <Input.Password
              placeholder="Shiprocket Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: 8 }}
              size="middle"
            />
          </div>

          <Button
            type="primary"
            icon={<LinkOutlined />}
            loading={loading}
            onClick={handleConnect}
            block
            style={{
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none", borderRadius: 8,
              fontWeight: 600, height: 40,
            }}
          >
            Connect Shiprocket
          </Button>
        </>
      ) : (
        <Button
          danger
          icon={<DisconnectOutlined />}
          loading={loading}
          onClick={handleDisconnect}
          block
          style={{ borderRadius: 8, fontWeight: 600, height: 40 }}
        >
          Disconnect Shiprocket
        </Button>
      )}

      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        marginTop: 16, padding: "10px 12px", borderRadius: 8,
        background: "#f8fafc", border: "1px solid #e2e8f0",
        fontSize: 11, color: "#64748b",
      }}>
        <LockOutlined style={{ color: "#6366f1" }} />
        Your Shiprocket credentials are 100% secure and encrypted. We never store or share your password.
      </div>
    </Card>
  );
}
