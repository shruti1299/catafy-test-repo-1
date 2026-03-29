'use client';

import React, { useState } from 'react';
import { Layout, Space, Button, Dropdown, Modal, Avatar, Input, Tag, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
  BellOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  ShareAltOutlined,
  PlusSquareOutlined,
  DownloadOutlined,
  LinkOutlined,
  PlusCircleFilled,
  ExclamationCircleFilled,
  QuestionCircleFilled,
  ThunderboltFilled,
  AppstoreAddOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  MoonOutlined,
  SunOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useTheme } from '@/contexts/ThemeContext';
import { deleteUserToken } from '@/utils/get-token';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Notifications from './dashboard/notifications';
import { useUserContext } from '@/contexts/UserContext';
import ShareLink from './common/share-link';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const { storeDetail } = useUserContext();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedirection, setIsRedirection] = useState(false);

  const storeLink = `https://${storeDetail?.store?.username}.catafy.com`;
  const storeName = storeDetail?.store?.store_name ?? storeDetail?.store?.username ?? "";
  const initials  = storeName.slice(0, 2).toUpperCase();

  const redirectToUploadProducts = () => {
    setIsRedirection(true);
    router.push("/inventory/add-bulk");
    setIsRedirection(false);
  };

  const showConfirm = () => {
    Modal.confirm({
      title: 'Ready to Leave?',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure you want to log out?',
      okText: 'Logout',
      onOk() {
        deleteUserToken();
        router.replace("/auth/login");
      },
    });
  };

  /* ── Quick Actions dropdown ───────────────────────────── */
  const quickItems: MenuProps['items'] = [
    {
      key: "add-product",
      label: "Add Product",
      icon: <AppstoreAddOutlined />,
      onClick: () => router.push("/inventory/add-bulk"),
    },
    {
      key: "customers",
      label: "Add Customer",
      icon: <TeamOutlined />,
      onClick: () => router.push("/customers"),
    },
    {
      key: "reports",
      label: "Download Reports",
      icon: <DownloadOutlined />,
      onClick: () => router.push("/reports"),
    },
    {
      key: "analytics",
      label: "View Analytics",
      icon: <BarChartOutlined />,
      onClick: () => router.push("/analytics"),
    },
    { type: "divider" },
    {
      key: "share",
      label: "Share Store Link",
      icon: <ShareAltOutlined />,
      onClick: () => setIsModalOpen(true),
    },
  ];

  /* ── User menu ────────────────────────────────────────── */
  const userItems: MenuProps['items'] = [
    {
      key: "store",
      label: (
        <div style={{ padding: "4px 0" }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{storeName}</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>{storeDetail?.user?.email}</div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    { key: "settings", label: "Settings",    icon: <ExclamationCircleOutlined />, onClick: () => router.push("/settings") },
    { key: "billing",  label: "Billing",     icon: <FileTextOutlined />,          onClick: () => router.push("/billing") },
    { type: "divider" },
    { key: "logout",   label: "Logout",      icon: <BellOutlined />,              onClick: showConfirm, danger: true },
  ];

  return (
    <>
      <Header className="kat-navbar">

        {/* ── LEFT: Welcome ─────────────────────────────── */}
        <div className="navbar-left">
          <div className="welcome-box">
            <h3>Welcome Back 👋</h3>
            {storeDetail && (
              <a href={storeLink} target="_blank" rel="noreferrer">
                <LinkOutlined style={{ marginRight: 4 }} />
                {storeDetail?.store?.username}.catafy.com
              </a>
            )}
          </div>
        </div>

        {/* ── RIGHT: Actions ────────────────────────────── */}
        <Space size={10} align="center" className="navbar-right">

          {/* POS */}
          {/* <Link href="/pos">
            <Button
              icon={<ShopOutlined />}
              style={{
                background: "linear-gradient(90deg,#6366f1,#818cf8)",
                border: "none", color: "#fff",
                fontWeight: 700, borderRadius: 8,
              }}
            >
              POS
            </Button>
          </Link> */}

          {/* Bulk upload CTA */}
          <Button
            type="primary"
            icon={<PlusCircleFilled />}
            onClick={redirectToUploadProducts}
            loading={isRedirection}
            className="bulk-upload-btn"
          >
            Bulk Upload
          </Button>

          {/* Quick Actions */}
          <Dropdown menu={{ items: quickItems }} trigger={["click"]} placement="bottomRight" arrow>
            <Tooltip title="Quick Actions">
              <Button
                icon={<ThunderboltFilled />}
                className="navbar-icon-btn"
                type="text"
              />
            </Tooltip>
          </Dropdown>

          {/* Dark / Light toggle */}
          <Tooltip title={isDark ? 'Switch to Light' : 'Switch to Dark'}>
            <Button
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              type="text"
              className="navbar-icon-btn"
              onClick={toggleTheme}
            />
          </Tooltip>

          {/* Notifications */}
          <Notifications />

          {/* Share */}
          <Tooltip title="Share Store">
            <Button
              icon={<ShareAltOutlined />}
              type="text"
              className="navbar-icon-btn"
              onClick={() => setIsModalOpen(true)}
            />
          </Tooltip>

          {/* Help */}
          <Tooltip title="Help & Support">
            <Link href="/help-support">
              <Button icon={<QuestionCircleFilled />} type="text" className="navbar-icon-btn" />
            </Link>
          </Tooltip>

          {/* User avatar dropdown */}
          <Dropdown menu={{ items: userItems }} trigger={["click"]} placement="bottomRight" arrow>
            <Avatar
              className="store-avatar"
              style={{ cursor: "pointer", background: "#4f46e5", fontSize: 13, fontWeight: 700 }}
              size={34}
            >
              {initials || <UserOutlined />}
            </Avatar>
          </Dropdown>
        </Space>
      </Header>

      <ShareLink
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        link={storeLink}
      />
    </>
  );
};

export default Navbar;
