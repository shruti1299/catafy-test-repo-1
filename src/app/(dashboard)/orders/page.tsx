"use client";

import React, { useState } from "react";
import { Card, Tabs, TabsProps, Button } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import Link from "next/link";
import OrderList from "./components/orderList";
import EnquiryList from "./components/enquiryList";

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Orders',
      children: <OrderList />,
    },
    {
      key: '2',
      label: 'Enquiries',
      children: <EnquiryList />,
    },
  ];

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🛒 Orders</span>}
      // extra={
      //   <Link href="/pos">
      //     <Button
      //       icon={<ShopOutlined />}
      //       size="small"
      //       style={{
      //         background: "linear-gradient(90deg,#6366f1,#818cf8)",
      //         border: "none", color: "#fff",
      //         fontWeight: 600, borderRadius: 7,
      //       }}
      //     >
      //       New POS Order
      //     </Button>
      //   </Link>
      // }
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} size="small" />
    </Card>
  );
};

export default Page;
