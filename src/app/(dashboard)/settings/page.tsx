"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { IStoreDetail } from "@/interfaces/Store";

import Setting from "./components/setting";
import Loader from "@/components/loader";

// Components
import MyStoreSetting from "./components/my-store";
import MyProfile from "./components/my-account";
import DomainSetting from "./components/domain";
import AllTheme from "./components/themes";
import StoreLayout from "./components/layouts";
import PaymentGateway from "./components/payment-Gatway";
import Transactions from "../billing/transactions";
import ActiveSubscription from "../billing/subscription";
import SocialLinksForm from "./components/Socialmedia";
import HowToMapDomain from "./components/how-to-map-domain";
import POSetting from "./components/po-setting";
import OrderNotification from "./components/order-notification";
import WatermarkSettings from "./components/WatermarkSettings";
import SeoSettings from "./components/seo";
import TeamMembers from "./components/team";
import Integrations from "./components/integrations";
import B2CSetting from "./components/b2c";
import ShiprocketIntegration from "./components/shiprocket";
import InvoiceConfig from "./components/invoice-config";

import {
  ShopOutlined,
  UserOutlined,
  ShareAltOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  AppstoreOutlined,
  CreditCardOutlined,
  RetweetOutlined,
  ToolOutlined,
  NotificationOutlined,
  AppstoreAddOutlined,
  CopyrightOutlined,
  ChromeOutlined,
  UserAddOutlined,
  StarOutlined,
  TruckOutlined,
  ContactsOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import IconWrapper from "@/components/IconWrapper";
import CheckoutSetting from "./components/checkout";

/* ---------------- CONFIG ---------------- */

const SETTINGS_CONFIG = [
  { key: "1", label: "My Store", icon: <ShopOutlined />, component: MyStoreSetting },
  { key: "2", label: "My Account", icon: <UserOutlined />, component: MyProfile },
  { key: "22", label: "Social Media", icon: <ShareAltOutlined />, component: SocialLinksForm },

  { key: "3", label: "Domain Settings", icon: <GlobalOutlined />, component: DomainSetting, ownerOnly: true },
  { key: "4", label: "Theming", icon: <BgColorsOutlined />, component: AllTheme, ownerOnly: true },
  { key: "5", label: "Layout", icon: <AppstoreOutlined />, component: StoreLayout, ownerOnly: true },
  { key: "6", label: "Payment Gateway", icon: <CreditCardOutlined />, component: PaymentGateway, ownerOnly: true },
  { key: "33", label: "Shipping Partners", icon: <TruckOutlined />, component: ShiprocketIntegration, ownerOnly: true },
  { key: "34", label: "Checkout", icon: <ContactsOutlined />, component: CheckoutSetting, ownerOnly: true },

  { key: "23", label: "Custom Domain", icon: <RetweetOutlined />, component: HowToMapDomain, ownerOnly: true },
  { key: "24", label: "PO Setting", icon: <ToolOutlined />, component: POSetting, ownerOnly: true },
  { key: "35", label: "Invoice Config", badge: "BETA", icon: <FileTextOutlined />, component: InvoiceConfig, ownerOnly: true },

  { key: "25", label: "Order Notification", icon: <NotificationOutlined />, component: OrderNotification, ownerOnly: true },

  { key: "26", label: "Watermark", icon: <CopyrightOutlined />, component: WatermarkSettings },
  { key: "27", label: "SEO & Meta", icon: <ChromeOutlined />, component: SeoSettings },

  { key: "28", label: "Team Members", icon: <UserAddOutlined />, component: TeamMembers, ownerOnly: true },
  { key: "31", label: "Integrations", icon: <AppstoreAddOutlined />, component: Integrations, ownerOnly: true },
  { key: "32", label: "B2C Store", icon: <StarOutlined />, component: B2CSetting, ownerOnly: true },
];

/* ---------------- PAGE ---------------- */

const Page = () => {
  const [storeDetail, setStoreDetail] = useState<IStoreDetail | null>(null);
  const [activeSetting, setActiveSetting] = useState("1");
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */

  const getUser = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<IStoreDetail>(API_ENDPOINTS.USER);
      setStoreDetail(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  /* ---------------- FILTER MENU ---------------- */

  const menuItems = useMemo(() => {
    if (!storeDetail) return [];
    const isOwner = storeDetail.user?.role === "o";
    return SETTINGS_CONFIG
      .filter(item => (item.ownerOnly ? isOwner : true))
      .map(item => ({
        key: item.key,
        icon: <IconWrapper icon={item.icon} />,
        label: (item as any).badge ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{item.label}</span>
            <span style={{
              fontSize: 9, fontWeight: 700, lineHeight: "14px",
              padding: "0 5px", borderRadius: 4,
              background: "rgba(251,191,36,0.2)",
              color: "#d97706", letterSpacing: "0.04em",
            }}>BETA</span>
          </span>
        ) : item.label,
      }));
  }, [storeDetail]);

  /* ---------------- ACTIVE COMPONENT ---------------- */

  const ActiveComponent = useMemo(() => {
    return SETTINGS_CONFIG.find(i => i.key === activeSetting)?.component;
  }, [activeSetting]);

  /* ---------------- RENDER ---------------- */

  if (!storeDetail) return <Loader />;

  return (
    <div style={{
      display: "flex",
      height: "calc(100vh - 68px)",
      overflow: "hidden",
      margin: "-20px",
      background: "#f7f8fa",
    }}>

      {/* ── Panel 1: Settings nav ── */}
      <div style={{
        width: 230,
        minWidth: 230,
        flexShrink: 0,
        borderRight: "1px solid #e5e7eb",
        background: "#fff",
        overflow: "hidden",
      }}>
        <Setting
          setActiveSetting={setActiveSetting}
          activeSetting={activeSetting}
          SETTING_LISTING={menuItems}
        />
      </div>

      {/* ── Panel 2: Active setting content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {ActiveComponent && (
          <ActiveComponent
            store={storeDetail.store}
            user={storeDetail.user}
            company={storeDetail.company}
            detail={storeDetail.detail}
            loading={loading}
            username={storeDetail?.store.username}
          />
        )}
      </div>

    </div>
  );
};

export default Page;