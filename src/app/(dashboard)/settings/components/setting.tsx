"use client";

import { Menu, MenuProps } from "antd";

type ISetting = {
  setActiveSetting: any;
  activeSetting: string;
  SETTING_LISTING: any;
};

const Setting = ({ setActiveSetting, activeSetting, SETTING_LISTING }: ISetting) => {

  const onClickSidebarMenu: MenuProps["onClick"] = (e) => {
    setActiveSetting(e.key);
  };

  return (
    <>
      {/* Sidebar header */}
      <div style={{
        padding: "10px 12px",
        minHeight: 44,
        borderBottom: "1px solid #f1f5f9",
        display: "flex",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
          ⚙️ Settings
        </span>
      </div>

      {/* Menu */}
      <div style={{ overflowY: "auto", height: "calc(100vh - 112px)" }}>
        <Menu
          className="setting-menu"
          mode="inline"
          selectedKeys={[activeSetting]}
          items={SETTING_LISTING}
          onClick={onClickSidebarMenu}
          style={{ border: "none", fontSize: 13 }}
        />
      </div>
    </>
  );
};

export default Setting;
