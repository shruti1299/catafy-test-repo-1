"use client";

import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, message, Row } from "antd";
import { CheckCircleFilled, BgColorsOutlined } from "@ant-design/icons";
import { ITheme } from "@/interfaces/Store";
import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import ThemeCard from "@/components/theme/theme-card";
import { useUserContext } from "@/contexts/UserContext";

const AllTheme = () => {
  const { storeDetail } = useUserContext();
  const activeThemeId = storeDetail?.store?.theme_id;
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [themes, setThemes] = useState<ITheme[]>([]);

  const getAllThemes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(API_ENDPOINTS.THEMES);
      setThemes(data);
    } catch {/* silent */} finally {
      setLoading(false);
    }
  };

  const onUpdateTheme = async (theme_id: number) => {
    setIsUpdating(true);
    try {
      await api.post(API_ENDPOINTS.STORE_DETAIL, { theme_id });
      message.success("Store theme updated! Changes reflect in 5–10 minutes.");
    } catch {/* silent */} finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    getAllThemes();
  }, []);

  return (
    <Card
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🎨 Choose Your Store Theme</span>}
      loading={loading}
      style={{ borderRadius: 12 }}
      styles={{ header: { padding: "10px 16px", minHeight: 44 } }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px", borderRadius: 10,
        background: "#eef2ff", border: "1px solid #6366f122",
        marginBottom: 20,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: "#6366f118",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6366f1", fontSize: 17,
        }}>
          <BgColorsOutlined />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Store Appearance</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>
            Pick a theme that best represents your brand — changes apply to your public storefront
          </div>
        </div>
      </div>

      <Row gutter={[16, 24]}>
        {themes.map((theme) => {
          const isActive = activeThemeId === theme.id;
          return (
            <Col xs={24} sm={12} md={8} key={theme.id}>
              <div style={{
                borderRadius: 10,
                border: `2px solid ${isActive ? "#6366f1" : "#e2e8f0"}`,
                overflow: "hidden",
                background: theme.bg_color || "#fff",
              }}>
                {isActive && (
                  <div style={{
                    background: "linear-gradient(90deg,#6366f1,#818cf8)",
                    padding: "4px 10px",
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 11, fontWeight: 700, color: "#fff",
                  }}>
                    <CheckCircleFilled style={{ fontSize: 12 }} />
                    Active Theme
                  </div>
                )}
                <ThemeCard theme={theme} />
                <div style={{ padding: "8px 10px" }}>
                  <Button
                    loading={isUpdating}
                    onClick={() => onUpdateTheme(theme.id)}
                    block
                    size="small"
                    disabled={isActive}
                    style={isActive ? { fontSize: 12 } : {
                      background: "linear-gradient(90deg,#6366f1,#818cf8)",
                      border: "none", color: "#fff", fontSize: 12,
                    }}
                  >
                    {isActive ? "✓ Currently Active" : "Use This Theme"}
                  </Button>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default AllTheme;
