"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Modal,
  Space,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  CheckCircleFilled,
  CloseCircleOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  UserOutlined,
  ShopOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { IWhatsappData } from "@/interfaces/Whatsapp";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";

const { Text } = Typography;

export default function CommunicationUI({ data }: { data: IWhatsappData }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const sellerEvents   = useMemo(() => data?.events?.filter((e: any) => e.event_key.startsWith("seller_")),   [data]);
  const customerEvents = useMemo(() => data?.events?.filter((e: any) => e.event_key.startsWith("customer_")), [data]);

  const groupByCategory = (events: any[]) =>
    events?.reduce((acc: any, event: any) => {
      if (!acc[event.category]) acc[event.category] = [];
      acc[event.category].push(event);
      return acc;
    }, {}) ?? {};

  const groupedCustomer = groupByCategory(customerEvents);
  const groupedSeller   = groupByCategory(sellerEvents);

  const toggleItem = (key: string) =>
    setSelected((prev) => prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]);

  const openPreview = (item: any) => { setPreviewData(item); setPreviewOpen(true); };

  const totalCost = useMemo(() =>
    selected.reduce((sum, key) => {
      const event = data?.events?.find((e: any) => e.event_key === key);
      return sum + Number(event?.price || 0);
    }, 0),
  [selected, data?.events]);

  useEffect(() => {
    if (!data?.events) return;
    let automation: any[] = Array.isArray(data?.automations) ? data.automations
      : data?.automations ? [data.automations] : [];
    const eventMap = new Map(data.events.map((e: any) => [e.id, e.event_key]));
    const enabledKeys = automation
      .filter((a: any) => a?.enabled && a?.event_id)
      .map((a: any) => eventMap.get(a.event_id))
      .filter(Boolean);
    setSelected(enabledKeys);
  }, [data]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const payload = data.events.map((event: any) => ({
        event_id: event.id,
        enabled: selected.includes(event.event_key),
      }));
      await api.post(`${API_ENDPOINTS.WHATSAPP}/config`, { events: payload });
      message.success("Automations saved");
    } catch {
      message.error("Failed to save");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderEventCard = (item: any) => {
    const isActive = selected.includes(item.event_key);
    return (
      <div
        key={item.id}
        onClick={() => toggleItem(item.event_key)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          borderRadius: 10,
          marginBottom: 8,
          cursor: "pointer",
          border: isActive ? "1.5px solid #25d366" : "1px solid #f1f5f9",
          background: isActive ? "#f0fdf4" : "#fff",
          transition: "all 0.15s ease",
          boxShadow: isActive ? "0 2px 8px rgba(37,211,102,0.1)" : "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: isActive ? "#15803d" : "#1e293b" }}>
              {item.name}
            </span>
            {Number(item.price) < 1
              ? <Tag color="green" style={{ fontSize: 10, margin: 0, lineHeight: "16px", padding: "0 5px" }}>Free</Tag>
              : <Tag style={{ fontSize: 10, margin: 0, lineHeight: "16px", padding: "0 5px" }}>₹{item.price}/msg</Tag>
            }
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{item.description}</div>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined style={{ fontSize: 11 }} />}
            style={{ padding: 0, height: "auto", fontSize: 11, color: "#6366f1", marginTop: 2 }}
            onClick={(e) => { e.stopPropagation(); openPreview(item); }}
          >
            Preview template
          </Button>
        </div>

        <div style={{ flexShrink: 0, marginLeft: 16 }}>
          {isActive
            ? <CheckCircleFilled style={{ fontSize: 22, color: "#25d366" }} />
            : <div style={{
                width: 22, height: 22, borderRadius: "50%",
                border: "2px solid #e2e8f0",
                background: "#f8fafc",
              }} />
          }
        </div>
      </div>
    );
  };

  const renderSection = (title: string, icon: React.ReactNode, groupedData: any) => (
    <Card
      title={<Space>{icon}<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</span></Space>}
      styles={{ header: { padding: "10px 16px", minHeight: 44 }, body: { padding: 16 } }}
      style={{ borderRadius: 10, marginBottom: 16 }}
      key={title}
    >
      {Object.keys(groupedData).map((category) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: "0.06em",
            marginBottom: 8,
          }}>
            {category}
          </div>
          {groupedData[category].map(renderEventCard)}
        </div>
      ))}
    </Card>
  );

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

      {/* ── Left: event lists ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {groupedCustomer && Object.keys(groupedCustomer).length > 0 &&
          renderSection("Customer Notifications", <UserOutlined style={{ color: "#6366f1" }} />, groupedCustomer)}
        {groupedSeller && Object.keys(groupedSeller).length > 0 &&
          renderSection("Seller Notifications", <ShopOutlined style={{ color: "#f59e0b" }} />, groupedSeller)}
      </div>

      {/* ── Right: summary panel ── */}
      <div style={{ width: 240, flexShrink: 0 }}>
        <Card
          title={
            <Space>
              <ThunderboltOutlined style={{ color: "#eab308" }} />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Active ({selected.length})</span>
            </Space>
          }
          styles={{ header: { padding: "10px 14px", minHeight: 44 }, body: { padding: 14 } }}
          style={{ borderRadius: 10, position: "sticky", top: 16 }}
        >
          {selected.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#94a3b8", fontSize: 12 }}>
              <ThunderboltOutlined style={{ fontSize: 22, marginBottom: 6, display: "block" }} />
              No automations selected
            </div>
          ) : (
            selected.map((key) => {
              const event = data.events.find((e: any) => e.event_key === key);
              return (
                <div key={key} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "5px 0", borderBottom: "1px solid #f1f5f9", gap: 6,
                }}>
                  <div style={{ fontSize: 12, color: "#1e293b", flex: 1, lineHeight: "16px" }}>{event?.name}</div>
                  <CloseCircleOutlined
                    style={{ color: "#94a3b8", fontSize: 12, cursor: "pointer", flexShrink: 0 }}
                    onClick={() => toggleItem(key)}
                  />
                </div>
              );
            })
          )}

          <Divider style={{ margin: "12px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <Text style={{ fontSize: 12, color: "#64748b" }}>Est. cost/trigger</Text>
            <Text strong style={{ fontSize: 13 }}>₹{totalCost.toFixed(2)}</Text>
          </div>

          <Button
            type="primary"
            block
            loading={isUpdating}
            disabled={selected.length < 1}
            onClick={handleUpdate}
            style={{ background: "#25d366", borderColor: "#25d366", fontWeight: 600 }}
          >
            Save Automations
          </Button>

          <div style={{ marginTop: 10, fontSize: 10, color: "#94a3b8", lineHeight: "14px", textAlign: "center" }}>
            By saving you agree to Catafy's Terms & Conditions
          </div>
        </Card>
      </div>

      {/* ── Template preview modal ── */}
      <Modal
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={<Button onClick={() => setPreviewOpen(false)}>Close</Button>}
        width={420}
        title={
          <Space>
            <WhatsAppOutlined style={{ color: "#25d366" }} />
            <span>Template Preview — {previewData?.name}</span>
          </Space>
        }
      >
        {/* Fake phone mockup */}
        <div style={{ background: "#e5ddd5", borderRadius: 12, padding: "20px 16px", marginTop: 8 }}>
          <div style={{
            background: "#fff",
            borderRadius: "0 10px 10px 10px",
            padding: "10px 14px",
            maxWidth: 310,
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}>
            <div style={{ fontSize: 13, color: "#1e293b", lineHeight: "19px" }}>
              {previewData?.templates?.[0]?.body ?? `Your order is ${previewData?.name}. Thank you for shopping with us!`}
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, textAlign: "right" }}>
              10:47 AM ✓✓
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#777", marginTop: 12, textAlign: "center" }}>
            This is a preview of the WhatsApp template message
          </div>
        </div>
      </Modal>
    </div>
  );
}
