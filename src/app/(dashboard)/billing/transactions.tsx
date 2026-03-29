"use client";

import { Card } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

export default function Transactions() {
  return (
    <Card
      title={
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
          <HistoryOutlined style={{ color: "#6366f1", marginRight: 6 }} />
          Payment Transactions
        </span>
      }
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      style={{ borderRadius: 12 }}
    >
      <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
        <HistoryOutlined style={{ fontSize: 32, display: "block", marginBottom: 8, color: "#c7d2fe" }} />
        <div style={{ fontSize: 13, fontWeight: 500, color: "#64748b", marginBottom: 4 }}>Transaction history coming soon</div>
        <div style={{ fontSize: 12 }}>View and manage all invoice payments and transaction records here.</div>
      </div>
    </Card>
  );
}
