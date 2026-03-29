"use client";

import React from "react";
import { Tabs, Card } from "antd";
import {
  QrcodeOutlined,
  LinkOutlined,
  FilePdfOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import SharedLinksPage from "./links/SharedLinksPage";
import StoreQRCodeSetting from "./StoreQRCodeSetting";
import DownloadCatalogPdf from "./DownloadCatalogPdf";

const ShareablePage = () => {
  return (
    <Card
      title={
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
          <ShareAltOutlined style={{ color: "#6366f1", marginRight: 6 }} />
          Shareable Links, PDFs &amp; QR Codes
        </span>
      }
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
      style={{ borderRadius: 12 }}
      className="mb-100"
    >
      <Tabs
        size="small"
        defaultActiveKey="links"
        items={[
          {
            key: "links",
            label: <span><LinkOutlined style={{ marginRight: 4 }} />Shareable Links</span>,
            children: <SharedLinksPage />,
          },
          {
            key: "qr",
            label: <span><QrcodeOutlined style={{ marginRight: 4 }} />QR Code</span>,
            children: <StoreQRCodeSetting />,
          },
          {
            key: "pdf",
            label: <span><FilePdfOutlined style={{ marginRight: 4 }} />PDFs</span>,
            children: <DownloadCatalogPdf />,
          },
        ]}
      />
    </Card>
  );
};

export default ShareablePage;
