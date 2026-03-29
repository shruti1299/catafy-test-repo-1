"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  InputNumber,
  Typography,
  Space,
  message,
  Divider,
} from "antd";
import api from "@/api";

const { Text } = Typography;
const MIN_AMOUNT = 100;

export default function RechargeWallet() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const quickAmounts = [100, 200, 500, 1000];

  const handlePayment = async () => {
    if (!amount || amount < MIN_AMOUNT) {
      return message.error(`Minimum ₹${MIN_AMOUNT} required`);
    }
    if (!(window as any).Razorpay) {
      return message.error("Payment system not loaded. Please refresh.");
    }
    try {
      setLoading(true);
      const res = await api.post("/payments/create-order", { amount });
      const { order_id, key, currency } = res.data;
      const options: any = {
        key,
        amount: amount * 100,
        currency,
        name: "Catafy Wallet",
        description: "Recharge Credits",
        order_id,
        notes: {
            type: "wallet_recharge"
            },
        handler: async (response: any) => {
          try {
            await api.post("/payments/verify", response);
            message.success("Recharge successful 🎉");
            setOpen(false);
            setAmount(100);
          } catch {
            message.error("Verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            message.info("Payment cancelled");
          },
        },
        theme: {
          color: "#25d366",
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      message.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        style={{ background: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.3)", color: "#fff", fontWeight: 600 }}
      >
        + Recharge
      </Button>

      {/* Modal */}
      <Modal
        title="Recharge Wallet"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">

          {/* Info */}
          <div style={{ fontSize: 13, color: "#888", lineHeight: "20px" }}>
            • 1 Credit = ₹1 <br />
            • 1 WhatsApp message = 1 credit <br />
            • Used for order updates, alerts & notifications <br />
            • Credits deducted only when message is sent
          </div>

          <Text strong>Select Amount</Text>

          {/* Quick Buttons */}
          <Space wrap>
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                type={amount === amt ? "primary" : "default"}
                onClick={() => setAmount(amt)}
              >
                ₹{amt}
              </Button>
            ))}
          </Space>

          {/* Input */}
          <InputNumber
            min={MIN_AMOUNT}
            value={amount}
            onChange={(val) => setAmount(Number(val) || MIN_AMOUNT)}
            style={{ width: "100%", margin:"20px 0"}}
            addonBefore="₹"
            size="large"
          />

          {/* Pay Button */}
          <Button
            type="primary"
            block
            size="large"
            loading={loading}
            disabled={!amount || amount < MIN_AMOUNT}
            onClick={handlePayment}
          >
            Pay ₹{amount}
          </Button>

          <Divider style={{ margin: "8px 0" }} />

          {/* Footer */}
          <div style={{ fontSize: 11, color: "#888", lineHeight: "16px" }}>
            🔒 Secure payments powered by Razorpay, 
            By continuing, you agree to our{" "} Terms and Refund Policy.
          </div>
        </Space>
      </Modal>
    </>
  );
}