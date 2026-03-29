"use client";

import React from "react";
import { Button } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";

interface SupportWPButtonProps {
  type?: "primary" | "link";
}

const SupportWPButton: React.FC<SupportWPButtonProps> = ({
  type = "primary",
}) => {
  const handleWhatsAppSupport = () => {
    const supportNumber = "9211776130";
    const message = "Hello, I need help with my subscription.";
    const url = `https://wa.me/${supportNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div style={{ width: "100%", marginTop: 20 }}>
      <Button
        type={type === "primary" ? "primary" : "link"}
        onClick={handleWhatsAppSupport}
        icon={<WhatsAppOutlined />}
        style={
          type === "primary"
            ? {
                backgroundColor: "#25D366",
                borderColor: "#25D366",
              }
            : {
                color: "#25D366",
                fontWeight: 600,
              }
        }
      >
        Contact Support
      </Button>
    </div>
  );
};

export default SupportWPButton;
