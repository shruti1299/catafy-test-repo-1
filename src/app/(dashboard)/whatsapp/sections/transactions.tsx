"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Col, DatePicker, Row, Select, Space, Table, Tag, Typography, message } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "@/api";
import { formatDateTimeAMPM } from "@/utils/helper";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export default function CreditTransactions() {
  const [loading, setLoading]     = useState(false);
  const [data, setData]           = useState<any[]>([]);
  const [meta, setMeta]           = useState<any>({});
  const [summary, setSummary]     = useState<any>({});
  const [filters, setFilters]     = useState<any>({ type: "", source: "", from: "", to: "", page: 1 });
  const fetchedRef                = useRef(false);

  const fetchTransactions = async (custom = {}) => {
    try {
      setLoading(true);
      const params = { ...filters, ...custom };
      const res = await api.get("/whatsapp/credit-transactions", { params });
      setData(res.data.data || []);
      setMeta(res.data.meta || {});
      setSummary(res.data.summary || {});
    } catch {
      message.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchTransactions();
  }, []);

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      width: 90,
      render: (type: string) => (
        <Tag
          color={type === "credit" ? "green" : "red"}
          style={{ fontSize: 10, borderRadius: 4, margin: 0 }}
        >
          {type?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 110,
      render: (val: number, record: any) => (
        <Text strong style={{ color: record.type === "credit" ? "#16a34a" : "#ef4444", fontSize: 13 }}>
          {record.type === "credit" ? "+" : "−"}₹{val}
        </Text>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      render: (v: string) => (
        <Tag style={{ fontSize: 10, borderRadius: 4, margin: 0, textTransform: "capitalize" }}>{v}</Tag>
      ),
    },
    {
      title: "Reference",
      dataIndex: "reference_id",
      render: (v: string) => (
        <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{v ?? "—"}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (v: string) => (
        <span style={{ fontSize: 12, color: "#475569" }}>{v}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (v: string) => (
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{formatDateTimeAMPM(v)}</span>
      ),
    },
  ];

  const resetFilters = () => {
    const reset = { type: "", source: "", from: "", to: "", page: 1 };
    setFilters(reset);
    fetchTransactions(reset);
  };

  return (
    <div>
      {/* Summary cards */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8}>
          <div style={{
            background: "#f0fdf4", borderRadius: 10, padding: "12px 16px",
            border: "1px solid #bbf7d0",
          }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Total Credited</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#16a34a" }}>
              <ArrowUpOutlined style={{ fontSize: 13, marginRight: 4 }} />
              ₹{summary?.total_credit ?? 0}
            </div>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div style={{
            background: "#fff1f2", borderRadius: 10, padding: "12px 16px",
            border: "1px solid #fecdd3",
          }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Total Spent</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#ef4444" }}>
              <ArrowDownOutlined style={{ fontSize: 13, marginRight: 4 }} />
              ₹{summary?.total_debit ?? 0}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div style={{
            background: "#eff6ff", borderRadius: 10, padding: "12px 16px",
            border: "1px solid #bfdbfe",
          }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Net Balance</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#6366f1" }}>
              ₹{(Number(summary?.total_credit ?? 0) - Number(summary?.total_debit ?? 0)).toFixed(2)}
            </div>
          </div>
        </Col>
      </Row>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Select
          placeholder="Type"
          allowClear
          size="small"
          style={{ width: 120 }}
          value={filters.type || undefined}
          onChange={(v) => setFilters({ ...filters, type: v ?? "" })}
          options={[
            { label: "Credit", value: "credit" },
            { label: "Debit",  value: "debit" },
          ]}
        />
        <Select
          placeholder="Source"
          allowClear
          size="small"
          style={{ width: 160 }}
          value={filters.source || undefined}
          onChange={(v) => setFilters({ ...filters, source: v ?? "" })}
          options={[
            { label: "Recharge", value: "recharge" },
            { label: "Message",  value: "whatsapp_message" },
            { label: "Refund",   value: "refund" },
          ]}
        />
        <RangePicker
          size="small"
          onChange={(_, dateStrings) =>
            setFilters({ ...filters, from: dateStrings[0], to: dateStrings[1] })
          }
        />
        <Button
          type="primary"
          size="small"
          onClick={() => fetchTransactions()}
          style={{ background: "#25d366", borderColor: "#25d366" }}
        >
          Apply
        </Button>
        <Button size="small" icon={<ReloadOutlined />} onClick={resetFilters} />
      </div>

      <Table
        rowKey="id"
        size="small"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{
          current: meta?.current_page,
          total: meta?.total,
          pageSize: 20,
          size: "small",
          onChange: (page) => fetchTransactions({ page }),
        }}
      />
    </div>
  );
}
