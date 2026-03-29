"use client";

import React, { useState } from "react";
import { Card, Segmented, Typography, Divider, Space } from "antd";
import { DoubleArrowIcon } from "@/svg/index";
import GridLayoutSetting from "@/components/layouts/grid-layout";
import HomeLayout from "@/components/layouts/home-layout";

const { Paragraph, Text, Title } = Typography;

export default function StoreLayoutScreen() {
  const [selectedTab, setSelectedTab] = useState("grid");

  return (
    <Card
      style={{ borderRadius: 16 }}
      title={
        <Space>
          <DoubleArrowIcon />
          <span>Store Layout Settings</span>
        </Space>
      }
    >
      {/* Description */}
      <Paragraph type="secondary">
        Customize how your store appears to customers. Configure your product
        grid display and homepage layout to match your brand style.
        Changes may take 5–10 minutes to reflect on your live store.
      </Paragraph>

      <Divider />

      {/* Segmented Tabs */}
      <Segmented
        options={[
          { label: "Grid Layout", value: "grid" },
          { label: "Home Page Layout", value: "home" },
        ]}
        block
        size="large"
        value={selectedTab}
        onChange={(value) => setSelectedTab(value as string)}
      />

      <Divider />

      {/* Section Explanation */}
      {selectedTab === "grid" && (
        <>
          <Title level={5}>Product Grid Configuration</Title>
          <Text type="secondary">
            Control how products are displayed in listing pages — number of
            columns, spacing, and card appearance.
          </Text>

          <Divider />

          <GridLayoutSetting />
        </>
      )}

      {selectedTab === "home" && (
        <>
          <Title level={5}>Homepage Layout Configuration</Title>
          <Text type="secondary">
            Customize banners, featured sections, and overall homepage
            structure to create a better shopping experience.
          </Text>

          <Divider />

          <HomeLayout />
        </>
      )}

      <Divider />

      <Text type="secondary">
        Note: Layout updates may take a few minutes to refresh on your public
        store due to caching.
      </Text>
    </Card>
  );
}
