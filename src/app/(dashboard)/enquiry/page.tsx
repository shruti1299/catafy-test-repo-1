"use client";

import { Card } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import EnquiryList from "../orders/components/enquiryList";

const Page = () => {
  return (
    <Card
      title={
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
          <MessageOutlined style={{ color: "#6366f1", marginRight: 6 }} />
          Enquiries
        </span>
      }
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      style={{ borderRadius: 12 }}
      className="mb-100"
    >
      <EnquiryList />
    </Card>
  );
};

export default Page;
