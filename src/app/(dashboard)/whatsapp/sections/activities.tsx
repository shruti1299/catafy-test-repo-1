"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Select, Space, Table, Tag, message } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "@/api";
import { formatDateTimeAMPM } from "@/utils/helper";

const STATUS_COLOR: Record<string, string> = {
  sent:         "blue",
  delivered:    "green",
  read:         "purple",
  failed:       "red",
  queued:       "orange",
  undelivered:  "volcano",
};

export default function WhatsAppActivitiesPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData]       = useState<any[]>([]);
  const [phone, setPhone]     = useState("");
  const [status, setStatus]   = useState("");
  const fetchedRef            = useRef(false);

  const fetchMessages = async (params = {}) => {
    try {
      setLoading(true);
      const res = await api.get("/whatsapp/messages", { params: { phone, status, ...params } });
      setData(res.data.data || []);
    } catch {
      message.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchMessages();
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      width: 50,
      render: (_: any, __: any, i: number) => (
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{i + 1}</span>
      ),
    },
    {
      title: "Recipient",
      dataIndex: "customer_phone",
      render: (v: string) => (
        <span style={{ fontWeight: 500, fontSize: 13 }}>+{v}</span>
      ),
    },
    {
      title: "Template",
      dataIndex: "template_name",
      render: (v: string) => (
        <span style={{ fontSize: 12, color: "#475569", fontFamily: "monospace" }}>{v}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (v: string) => (
        <Tag style={{ fontSize: 10, borderRadius: 4, margin: 0 }}>{v}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s: string) => (
        <Tag color={STATUS_COLOR[s] ?? "default"} style={{ fontSize: 11, borderRadius: 4, margin: 0 }}>
          {s}
        </Tag>
      ),
    },
    {
      title: "Cost",
      dataIndex: "cost",
      render: (v: any) => (
        <span style={{ fontSize: 12, color: "#64748b" }}>₹{v ?? 0}</span>
      ),
    },
    {
      title: "Sent At",
      dataIndex: "created_at",
      render: (v: string) => (
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{formatDateTimeAMPM(v)}</span>
      ),
    },
  ];

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginBottom: 16, flexWrap: "wrap",
      }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Search phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: 200 }}
          size="small"
          allowClear
        />
        <Select
          placeholder="All statuses"
          allowClear
          size="small"
          style={{ width: 150 }}
          value={status || undefined}
          onChange={(v) => setStatus(v ?? "")}
          options={[
            { label: "Sent",        value: "sent" },
            { label: "Delivered",   value: "delivered" },
            { label: "Read",        value: "read" },
            { label: "Failed",      value: "failed" },
            { label: "Queued",      value: "queued" },
          ]}
        />
        <Button
          type="primary"
          size="small"
          onClick={() => fetchMessages()}
          style={{ background: "#25d366", borderColor: "#25d366" }}
        >
          Apply
        </Button>
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => { setPhone(""); setStatus(""); fetchMessages({ phone: "", status: "" }); }}
        />
      </div>

      <Table
        rowKey="id"
        size="small"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ size: "small", pageSize: 20 }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: "8px 16px", background: "#f8fafc", borderRadius: 6 }}>
              {record.error_message && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, color: "#ef4444", fontSize: 12 }}>Error: </span>
                  <code style={{ color: "#ef4444", fontSize: 12 }}>{record.error_message}</code>
                </div>
              )}
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>PAYLOAD</div>
                  <pre style={{ fontSize: 11, margin: 0, color: "#475569" }}>{JSON.stringify(record.payload, null, 2)}</pre>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>RESPONSE</div>
                  <pre style={{ fontSize: 11, margin: 0, color: "#475569" }}>{JSON.stringify(record.response, null, 2)}</pre>
                </div>
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
}
