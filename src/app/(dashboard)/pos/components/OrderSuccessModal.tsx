"use client";

import { Modal, Button } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import Link from "next/link";

interface IProps {
  open: boolean;
  orderId: number | null;
  onNewOrder: () => void;
  onClose: () => void;
}

export default function OrderSuccessModal({ open, orderId, onNewOrder, onClose }: IProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={360}
      centered
      closable={false}
    >
      <div style={{ textAlign: "center", padding: "24px 8px 8px" }}>
        {/* Success icon */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg,#6366f1,#818cf8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
        }}>
          <CheckCircleFilled style={{ fontSize: 32, color: "#fff" }} />
        </div>

        <div style={{ fontWeight: 800, fontSize: 20, color: "#0f172a", marginBottom: 6 }}>
          Order Placed! 🎉
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
          The order has been created successfully.
        </div>

        {orderId && (
          <div style={{
            display: "inline-block",
            background: "#eef2ff", border: "1px solid #c7d2fe",
            borderRadius: 8, padding: "6px 16px", marginBottom: 24,
          }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>Order ID </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#4f46e5" }}>#{orderId}</span>
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          {orderId && (
            <Link href={`/orders/${orderId}`} style={{ flex: 1 }}>
              <Button
                block
                style={{ borderColor: "#6366f1", color: "#6366f1", borderRadius: 9, fontWeight: 600 }}
              >
                View Order
              </Button>
            </Link>
          )}
          <Button
            type="primary"
            block
            onClick={onNewOrder}
            style={{
              flex: 1,
              background: "linear-gradient(90deg,#6366f1,#818cf8)",
              border: "none", borderRadius: 9, fontWeight: 700,
            }}
          >
            + New Order
          </Button>
        </div>
      </div>
    </Modal>
  );
}
