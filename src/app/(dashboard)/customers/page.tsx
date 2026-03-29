
import React from "react";
import CustomerList from "./components/customerList";
import { Card } from "antd";

const page = () => {
  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>👥 Customers</span>}
      className="mb-100"
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <CustomerList />
    </Card>
  );
};

export default page;
