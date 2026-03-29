"use client";

import { Card, Tabs, TabsProps } from "antd";
import { PictureOutlined, FileExcelOutlined, SyncOutlined } from "@ant-design/icons";
import React from "react";
import ProductExcelUploader from "./excel-import";
import BulkProductUpload from "./upload-images";
import UpdateProductFromExcel from "./update-products-excel";

export default function Page() {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PictureOutlined /> Upload Images
        </span>
      ),
      children: <BulkProductUpload />,
    },
    {
      key: "2",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FileExcelOutlined /> Import via Excel
        </span>
      ),
      children: <ProductExcelUploader />,
    },
    {
      key: "3",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SyncOutlined /> Update via Excel
        </span>
      ),
      children: <UpdateProductFromExcel />,
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#6366f1,#818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
          }}>
            📦
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", lineHeight: 1.2 }}>
              Bulk Upload
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400, lineHeight: 1.3 }}>
              Add or update products in bulk using images or Excel
            </div>
          </div>
        </div>
      }
      styles={{ header: { padding: "10px 16px", minHeight: 52 }, body: { padding: "0 16px 16px" } }}
    >
      <Tabs defaultActiveKey="1" items={items} size="small" />
    </Card>
  );
}
