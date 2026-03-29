"use client";

import { Card, Tag, Button } from "antd";
import dayjs from "dayjs";
import { useUserContext } from "@/contexts/UserContext";
import { PLANS } from "@/constant/plans";
import Link from "next/link";
import {
  CalendarOutlined,
  CrownOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

const Row2 = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "9px 0", borderBottom: "1px solid #f1f5f9",
  }}>
    <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
    <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{value}</span>
  </div>
);

export default function ActiveSubscription() {
  const { storeDetail } = useUserContext();
  const subscription = storeDetail?.active_plan;
  const ACTIVE_PLAN  = PLANS.find(f => f.id == subscription?.plan_id);

  if (!subscription) {
    return (
      <Card
        title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>💳 Active Subscription</span>}
        styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
        style={{ borderRadius: 12 }}
      >
        <div style={{ textAlign: "center", padding: "24px 0", color: "#94a3b8", fontSize: 13 }}>
          No active subscription found.
        </div>
      </Card>
    );
  }

  const statusColor =
    subscription.status === "active"  ? "green"  :
    subscription.status === "paused"  ? "orange" : "red";

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}><CrownOutlined style={{ color: "#f59e0b", marginRight: 6 }} />Active Subscription</span>}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      style={{ borderRadius: 12 }}
      extra={
        <Link href="/pricing">
          <Button
            size="small"
            type="primary"
            style={{ background: "linear-gradient(90deg,#6366f1,#818cf8)", border: "none", fontSize: 12 }}
          >
            View Plans
          </Button>
        </Link>
      }
    >
      {/* Plan highlight */}
      <div style={{
        background: "linear-gradient(135deg,#eef2ff,#f5f3ff)",
        borderRadius: 10, padding: "12px 16px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg,#6366f1,#818cf8)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <CrownOutlined style={{ color: "#fff", fontSize: 18 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
            {ACTIVE_PLAN?.title ?? "Current Plan"}
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            ₹{ACTIVE_PLAN?.price} / {ACTIVE_PLAN?.interval}
          </div>
        </div>
        <Tag
          color={statusColor}
          style={{ fontSize: 11, borderRadius: 5, fontWeight: 600, margin: 0 }}
          icon={subscription.status === "active" ? <CheckCircleFilled /> : <ClockCircleOutlined />}
        >
          {subscription.status.toUpperCase()}
        </Tag>
      </div>

      {/* Details rows */}
      <Row2
        label="Start Date"
        value={subscription.start_at ? dayjs(subscription.start_at).format("DD MMM YYYY") : "—"}
      />
      <Row2
        label="End Date"
        value={subscription.end_at ? dayjs(subscription.end_at).format("DD MMM YYYY") : "—"}
      />
      <Row2
        label="Next Billing"
        value={
          subscription.next_charge_at
            ? <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <CalendarOutlined style={{ color: "#6366f1" }} />
                {dayjs(subscription.next_charge_at).format("DD MMM YYYY")}
              </span>
            : "—"
        }
      />
      <Row2 label="Total Renewals" value={subscription.total_cycles ?? 0} />
      <Row2
        label="Last Payment"
        value={subscription.last_payment_at ? dayjs(subscription.last_payment_at).format("DD MMM YYYY, hh:mm A") : "—"}
      />
      {subscription.rz_subscription_id && (
        <Row2
          label="Razorpay ID"
          value={
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#6366f1" }}>
              <IdcardOutlined style={{ marginRight: 4 }} />
              {subscription.rz_subscription_id}
            </span>
          }
        />
      )}

      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 16, marginBottom: 0, lineHeight: "18px" }}>
        Need to stop, cancel, or upgrade your plan? Our team is always happy to help — reach out anytime!
      </p>
    </Card>
  );
}
